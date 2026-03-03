import {
  call, put, take, fork, cancel, cancelled,
  takeLatest, takeEvery, delay, race, select,
} from 'redux-saga/effects';
import { createAction } from '@reduxjs/toolkit';
import matchService, { type Match, type MatchUser } from '../service/match.service';
import { markMatchSeen } from '../../hooks/UserMatchNotification';
import {
  setUsersLoading, setUsers, nextCard,
  setWaiting, setMatched, cancelWaiting,
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
  startPollingNotifications: createAction<{ userId: number }>('match/startPollingNotifications'),
  stopPollingNotifications: createAction('match/stopPollingNotifications'),
};

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

// ─── Send match request + poll until accepted/rejected ────────────────────────
function* handleSendRequest(action: ReturnType<typeof matchActions.sendRequest>): Generator {
  const { userId, partnerId, topic, partner } = action.payload;
  try {
    const result = (yield call(matchService.requestMatch, userId, partnerId, topic)) as any;
    const matchId: number = result.matchId ?? result.id;

    // Advance the card immediately
    yield put(nextCard());

    // Switch UI to waiting mode
    yield put(setWaiting({ matchId, partner, topic }));

    // Poll every 3s until accepted, rejected, expired, or cancelled
    yield race({
      result: call(pollMatchStatus, matchId, partner, topic),
      cancel: take(matchActions.cancelWaiting.type),
    });

    // If race won by cancel — already handled by cancelWaiting reducer
  } catch (err: any) {
    yield put(showToast({
      msg: err?.response?.data?.message ?? 'Failed to send request',
      type: 'error',
    }));
  }
}

function* pollMatchStatus(
  matchId: number,
  partner: MatchUser,
  topic: string,
): Generator {
  try {
    while (true) {
      yield delay(3000);
      const match = (yield call(matchService.getMatchById, matchId)) as Match;

      if (match.status === 'accepted' && match.sessionId) {
        yield put(setMatched({
          sessionId: match.sessionId,
          partner,
          topic,
        }));
        return;
      }

      if (match.status === 'rejected' || match.status === 'expired') {
        yield put(cancelWaiting());
        yield put(showToast({ msg: 'Request declined or expired. Try someone else!', type: 'error' }));
        return;
      }
    }
  } finally {
    if (yield cancelled()) {
      // Race was cancelled by matchActions.cancelWaiting — nothing extra needed
    }
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
    // Prevent GlobalMatchWatcher from re-showing this match
    markMatchSeen(matchId);

    if (result?.sessionId) {
      // Build partner shape from requester
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
      yield put(setMatched({ sessionId: result.sessionId, partner, topic: match.topic }));
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

// ─── Global notification polling (User 2 anywhere in app) ────────────────────
// Tracks match IDs already notified so we never fire twice
const notifiedIds = new Set<number>();

function* pollNotifications(action: ReturnType<typeof matchActions.startPollingNotifications>): Generator {
  try {
    while (true) {
      yield delay(15000);
      const active = (yield call(matchService.getActiveMatches, action.payload.userId)) as Match[];
      for (const m of active) {
        if (
          m.status === 'accepted' &&
          m.receiverId === action.payload.userId &&
          !notifiedIds.has(m.id)
        ) {
          notifiedIds.add(m.id);
          yield put(setNotification(m));
          break;
        }
      }
    }
  } finally { /* cancelled on stopPollingNotifications */ }
}

function* watchNotifications(): Generator {
  while (true) {
    const startAction = (yield take(matchActions.startPollingNotifications.type)) as any;
    const task: any = yield fork(pollNotifications, startAction);
    yield take(matchActions.stopPollingNotifications.type);
    yield cancel(task);
  }
}

// ─── Root match saga ──────────────────────────────────────────────────────────
export default function* matchSaga() {
  yield takeLatest(matchActions.loadUsers.type, handleLoadUsers);
  yield takeLatest(matchActions.sendRequest.type, handleSendRequest);
  yield takeLatest(matchActions.loadRequests.type, handleLoadRequests);
  yield takeLatest(matchActions.loadHistory.type, handleLoadHistory);
  yield takeEvery(matchActions.acceptRequest.type, handleAcceptRequest);
  yield takeEvery(matchActions.rejectRequest.type, handleRejectRequest);
  yield fork(watchNotifications);
}