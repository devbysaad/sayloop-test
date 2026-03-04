import {
  call, put, take, fork, cancel, cancelled,
  takeLatest, takeEvery, delay, select,
} from 'redux-saga/effects';
import { createAction } from '@reduxjs/toolkit';
import { eventChannel, END } from 'redux-saga';
import type { Socket } from 'socket.io-client';
import matchService, { type Match, type MatchUser } from '../service/match.service';
import { getOrCreateSocket, ensureConnected, getSocket } from '../service/socket.service';
import { markMatchSeen } from '../../hooks/UserMatchNotification';
import {
  setUsersLoading, setUsers, nextCard,
  setWaiting, setMatched, cancelWaiting, setConfirmed,
  setRequestsLoading, setRequests, removeRequest,
  setHistoryLoading, setHistory,
  setNotification,
  showToast, setError,
} from '../slice/match.slice';

// ─── Actions (dispatched by components) ──────────────────────────────────────
export const matchActions = {
  loadUsers: createAction<{ userId: number }>('match/loadUsers'),
  sendRequest: createAction<{ userId: number; partnerId: number; topic: string; partner: MatchUser }>('match/sendRequest'),
  cancelWaiting: createAction('match/cancelWaiting'),
  loadRequests: createAction<{ userId: number }>('match/loadRequests'),
  loadHistory: createAction<{ userId: number }>('match/loadHistory'),
  acceptRequest: createAction<{ matchId: number; match: Match }>('match/acceptRequest'),
  rejectRequest: createAction<{ matchId: number }>('match/rejectRequest'),
  confirmReady: createAction<{ matchId: number }>('match/confirmReady'),
  initMatchSocket: createAction('match/initMatchSocket'),
};

// ─── Helper: get Clerk auth for socket ────────────────────────────────────────
function* getClerkAuth(): Generator {
  let token: string | null = null;
  // Read clerkId from localStorage (stored by useAuthInit hook)
  const clerkId: string | null = localStorage.getItem('clerk_id');

  // Try to get JWT token via window.Clerk (may not be available in Clerk v5+)
  try {
    const clerk = (window as any).Clerk;
    if (clerk?.session) {
      token = (yield call([clerk.session, clerk.session.getToken])) as string | null;
    }
  } catch { /* Clerk not available on window */ }

  return { token, clerkId };
}

// ─── Match socket event channel ───────────────────────────────────────────────
function createMatchEventChannel(socket: Socket) {
  return eventChannel<any>((emit) => {
    socket.on('match:request-received', (d: any) => emit({ type: 'match:request-received', ...d }));
    socket.on('match:accepted', (d: any) => emit({ type: 'match:accepted', ...d }));
    socket.on('match:rejected', (d: any) => emit({ type: 'match:rejected', ...d }));
    socket.on('match:expired', (d: any) => emit({ type: 'match:expired', ...d }));
    socket.on('match:session-start', (d: any) => emit({ type: 'match:session-start', ...d }));

    return () => {
      socket.off('match:request-received');
      socket.off('match:accepted');
      socket.off('match:rejected');
      socket.off('match:expired');
      socket.off('match:session-start');
    };
  });
}

// ─── Watch match socket events (global) ───────────────────────────────────────
function* watchMatchSocketEvents(channel: ReturnType<typeof createMatchEventChannel>): Generator {
  try {
    while (true) {
      const event: any = yield take(channel);
      console.log('[MatchSaga] Socket event received:', event.type, event);
      switch (event.type) {
        case 'match:request-received': {
          // User 2 receives a match request in real-time
          // Build a minimal Match-like object for the notification
          const notif: any = {
            id: event.matchId,
            topic: event.topic,
            requester: event.requester,
            status: 'pending',
          };
          yield put(setNotification(notif));
          break;
        }
        case 'match:accepted': {
          // Both users receive this when the match is accepted
          const matchId = event.matchId;
          markMatchSeen(matchId);

          // Check if we already handled this match (e.g. User 2 already set matched from REST response)
          const currentState: any = yield select((s: any) => s.match);
          if (currentState.mode === 'matched' && currentState.matchedMatchId === matchId) {
            break; // Already handled — skip duplicate
          }

          // Build partner from whichever side the current user is NOT
          const myId = Number(localStorage.getItem('db_user_id') ?? '0');
          const isRequester = event.requester?.id === myId;
          const partnerData = isRequester ? event.receiver : event.requester;

          const partner: MatchUser = {
            id: partnerData?.id ?? 0,
            firstName: partnerData?.firstName ?? 'Partner',
            username: partnerData?.username ?? '',
            pfpSource: partnerData?.pfpSource ?? null,
            points: partnerData?.points ?? 0,
            learningLanguage: '',
            interests: [],
            streakLength: 0,
          };

          yield put(setMatched({
            matchId,
            sessionId: event.sessionId ?? '',
            partner,
            topic: event.topic ?? '',
          }));
          break;
        }
        case 'match:rejected': {
          yield put(cancelWaiting());
          yield put(showToast({ msg: 'Request declined. Try someone else!', type: 'error' }));
          break;
        }
        case 'match:expired': {
          yield put(cancelWaiting());
          yield put(showToast({ msg: 'Match request expired.', type: 'error' }));
          break;
        }
        case 'match:session-start': {
          // Both users confirmed — session is ready
          yield put(setConfirmed({
            sessionId: event.sessionId,
            matchId: event.matchId,
          }));
          break;
        }
      }
    }
  } finally {
    if (yield cancelled()) channel.close();
  }
}

// ─── Initialize persistent match socket listener ──────────────────────────────
function* handleInitMatchSocket(): Generator {
  const dbUserId = localStorage.getItem('db_user_id');
  if (!dbUserId) {
    console.warn('[MatchSaga] initMatchSocket: no db_user_id in localStorage');
    return;
  }

  const auth: any = yield call(getClerkAuth);
  if (!auth.clerkId) {
    console.warn('[MatchSaga] initMatchSocket: no clerkId available (not in localStorage.clerk_id or window.Clerk)');
    return;
  }

  try {
    console.log('[MatchSaga] initMatchSocket: connecting socket with clerkId:', auth.clerkId);
    const socket: Socket = yield call(getOrCreateSocket, auth.token, auth.clerkId);
    yield call(ensureConnected, socket);
    console.log('[MatchSaga] initMatchSocket: socket connected, setting up event channel');

    const channel = createMatchEventChannel(socket);
    yield fork(watchMatchSocketEvents, channel);
    console.log('[MatchSaga] initMatchSocket: event channel active, listening for match events');
  } catch (err: any) {
    console.warn('[MatchSaga] Could not init match socket:', err?.message);
  }
}

// ─── Load browse users ────────────────────────────────────────────────────────
function* handleLoadUsers(action: ReturnType<typeof matchActions.loadUsers>): Generator {
  yield put(setUsersLoading(true));
  try {
    const users = (yield call(matchService.getBrowseUsers)) as MatchUser[];
    yield put(setUsers(users));
  } catch {
    yield put(setUsersLoading(false));
    yield put(setError('Failed to load users'));
  }
}

// ─── Send match request ─────────────────────────────────────────────────────
function* handleSendRequest(action: ReturnType<typeof matchActions.sendRequest>): Generator {
  const { userId, partnerId, topic, partner } = action.payload;
  try {
    const result = (yield call(matchService.requestMatch, userId, partnerId, topic)) as any;
    const matchId: number = result.matchId ?? result.id;

    // Advance the card immediately
    yield put(nextCard());

    // Switch UI to waiting mode
    yield put(setWaiting({ matchId, partner, topic }));

    // No more polling — socket events (match:accepted, match:rejected, match:expired)
    // will be handled by the global watchMatchSocketEvents listener
  } catch (err: any) {
    yield put(showToast({
      msg: err?.response?.data?.message ?? 'Failed to send request',
      type: 'error',
    }));
  }
}

// ─── Load incoming requests ───────────────────────────────────────────────────
function* handleLoadRequests(action: ReturnType<typeof matchActions.loadRequests>): Generator {
  yield put(setRequestsLoading(true));
  try {
    const all = (yield call(matchService.getActiveMatches, action.payload.userId)) as Match[];
    const pending = all.filter(
      m => m.receiverId === action.payload.userId && m.status === 'pending'
    );
    yield put(setRequests(pending));
  } catch {
    yield put(setRequestsLoading(false));
  }
}

// ─── Load history ─────────────────────────────────────────────────────────────
function* handleLoadHistory(action: ReturnType<typeof matchActions.loadHistory>): Generator {
  yield put(setHistoryLoading(true));
  try {
    const res = (yield call(matchService.getMatchHistory, action.payload.userId)) as any;
    yield put(setHistory(res.data ?? []));
  } catch {
    yield put(setHistoryLoading(false));
  }
}

// ─── Accept incoming request ──────────────────────────────────────────────────
function* handleAcceptRequest(action: ReturnType<typeof matchActions.acceptRequest>): Generator {
  const { matchId, match } = action.payload;
  try {
    const result = (yield call(matchService.acceptMatch, matchId)) as any;
    yield put(removeRequest(matchId));
    markMatchSeen(matchId);

    // The socket event 'match:accepted' will fire for BOTH users shortly after.
    // For the accepting user (User 2), we also set matched immediately from the REST response.
    if (result?.sessionId) {
      const partner: MatchUser = {
        id: match.requester.id,
        firstName: match.requester.firstName ?? 'Partner',
        username: match.requester.username ?? '',
        pfpSource: match.requester.pfpSource ?? null,
        points: 0,
        learningLanguage: '',
        interests: [],
        streakLength: 0,
      };
      yield put(setMatched({ matchId, sessionId: result.sessionId, partner, topic: match.topic }));
    }
  } catch (err: any) {
    yield put(showToast({
      msg: err?.response?.data?.message ?? 'Failed to accept request',
      type: 'error',
    }));
  }
}

// ─── Reject incoming request ──────────────────────────────────────────────────
function* handleRejectRequest(action: ReturnType<typeof matchActions.rejectRequest>): Generator {
  try {
    yield call(matchService.rejectMatch, action.payload.matchId);
    yield put(removeRequest(action.payload.matchId));
    yield put(showToast({ msg: 'Request declined.', type: 'success' }));
  } catch (err: any) {
    yield put(showToast({
      msg: err?.response?.data?.message ?? 'Failed to reject request',
      type: 'error',
    }));
  }
}

// ─── Confirm ready ("Let's Go" button) ────────────────────────────────────────
function* handleConfirmReady(action: ReturnType<typeof matchActions.confirmReady>): Generator {
  const socket = getSocket();
  if (!socket?.connected) {
    yield put(showToast({ msg: 'Connection lost. Please refresh.', type: 'error' }));
    return;
  }
  socket.emit('match:confirm-ready', { matchId: action.payload.matchId });
  // The match:session-start event will arrive via the socket channel when both users confirm
}

// ─── Root match saga ──────────────────────────────────────────────────────────
export default function* matchSaga() {
  yield takeLatest(matchActions.loadUsers.type, handleLoadUsers);
  yield takeLatest(matchActions.sendRequest.type, handleSendRequest);
  yield takeLatest(matchActions.loadRequests.type, handleLoadRequests);
  yield takeLatest(matchActions.loadHistory.type, handleLoadHistory);
  yield takeEvery(matchActions.acceptRequest.type, handleAcceptRequest);
  yield takeEvery(matchActions.rejectRequest.type, handleRejectRequest);
  yield takeEvery(matchActions.confirmReady.type, handleConfirmReady);
  yield takeLatest(matchActions.initMatchSocket.type, handleInitMatchSocket);
}