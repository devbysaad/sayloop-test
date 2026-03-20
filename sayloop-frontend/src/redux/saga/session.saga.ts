import {
  call, put, take, fork, cancel, cancelled,
  takeLatest, takeEvery, race, delay,
} from 'redux-saga/effects';
import { createAction } from '@reduxjs/toolkit';
import { eventChannel, END } from 'redux-saga';
import { getOrCreateSocket, ensureConnected, disconnectSocket, getSocket } from '../service/socket.service';
import type { Socket } from 'socket.io-client';
import {
  setSearching, setMatched, setInSession,
  receiveMessage, receiveArgument,
  setDrawOffered, setDrawReceived, setDrawNone,
  setResult, setSessionError, setWaitingMessage, resetSession,
  updatePartnerSocketId,
  setTimer, setMicWarning, clearMicWarning,
  addXpPopup, removeXpPopup, tickSpeaking,
} from '../slice/session.slice';
import { applyEconomyUpdate, FETCH_ECONOMY } from '../slice/economy.slice';


// ─── Actions ──────────────────────────────────────────────────────────────────
export const sessionActions = {
  findPartner:      createAction<{ userId: number; topic: string }>('session/findPartner'),
  joinSession:      createAction<{ userId: number; sessionId: string; topic: string }>('session/joinSession'),
  sendMessage:      createAction<{ message: string }>('session/sendMessage'),
  submitArgument:   createAction<{ argument: string }>('session/submitArgument'),
  offerDraw:        createAction('session/offerDraw'),
  acceptDraw:       createAction('session/acceptDraw'),
  declineDraw:      createAction('session/declineDraw'),
  resign:           createAction('session/resign'),
  leaveSession:     createAction('session/leave'),
  reset:            createAction('session/reset'),
  // Mic reporting (called from component hooks on change only)
  reportMicStatus:  createAction<{ isOn: boolean }>('session/reportMicStatus'),
  reportSpeaking:   createAction('session/reportSpeaking'),
};

// ─── Socket event channel ─────────────────────────────────────────────────────
function createSocketChannel(socket: Socket) {
  return eventChannel((emit) => {
    socket.on('connect',            ()      => emit({ type: 'connected' }));
    socket.on('connect_error',      (e: Error) => emit({ type: 'connect_error', message: e.message }));
    socket.on('waiting',            (d: any) => emit({ type: 'waiting', ...d }));
    socket.on('matched',            (d: any) => emit({ type: 'matched', ...d }));
    socket.on('session-joined',     (d: any) => emit({ type: 'session-joined', ...d }));
    socket.on('partner-joined',     (d: any) => emit({ type: 'partner-joined', ...d }));
    socket.on('chat-message',       (d: any) => emit({ type: 'chat-message', ...d }));
    socket.on('debate-argument',    (d: any) => emit({ type: 'debate-argument', ...d }));
    socket.on('draw-received',      ()       => emit({ type: 'draw-received' }));
    socket.on('draw-declined',      ()       => emit({ type: 'draw-declined' }));
    socket.on('draw-accepted',      ()       => emit({ type: 'draw-accepted' }));
    socket.on('opponent-resigned',  ()       => emit({ type: 'opponent-resigned' }));
    socket.on('session-error',      (d: any) => emit({ type: 'session-error', ...d }));
    socket.on('partner-disconnected', ()     => { emit({ type: 'partner-disconnected' }); emit(END); });

    // ── New events ──────────────────────────────────────────────────────────
    socket.on('session:start',      (d: any) => emit({ type: 'session:start', ...d }));
    socket.on('timer:update',        (d: any) => emit({ type: 'timer:update', secondsLeft: d.secondsLeft }));
    socket.on('session:end',         (d: any) => emit({ type: 'session:end', ...d }));
    socket.on('mic:warning',         (d: any) => emit({ type: 'mic:warning', secondsLeft: d.secondsLeft }));
    socket.on('mic:warning:cleared', ()       => emit({ type: 'mic:warning:cleared' }));
    socket.on('user:resigned',       (d: any) => emit({ type: 'user:resigned', ...d }));
    socket.on('economy:update',      (d: any) => emit({ type: 'economy:update', ...d }));

    return () => {
      [
        'connect', 'connect_error', 'waiting', 'matched', 'session-joined', 'partner-joined',
        'chat-message', 'debate-argument', 'draw-received', 'draw-declined', 'draw-accepted',
        'opponent-resigned', 'partner-disconnected', 'session-error',
        'session:start', 'timer:update', 'session:end', 'mic:warning', 'mic:warning:cleared',
        'user:resigned', 'economy:update',
      ].forEach(ev => socket.off(ev));
    };
  });
}

// ─── XP popup helper ─────────────────────────────────────────────────────────
function* spawnXpPopup(amount: number, label: string): Generator {
  const id = `${Date.now()}-${Math.random()}`;
  yield put(addXpPopup({ amount, label }));
  yield delay(2500);
  yield put(removeXpPopup(id));
}

// ─── Socket event watcher ─────────────────────────────────────────────────────
function* watchSocketEvents(channel: ReturnType<typeof createSocketChannel>): Generator {
  try {
    while (true) {
      const event: any = yield take(channel);
      switch (event.type) {
        case 'connected': break;
        case 'connect_error': yield put(setSessionError('Connection failed: ' + event.message)); break;
        case 'waiting': yield put(setWaitingMessage(event.message)); break;

        case 'matched':
          yield put(setMatched({ sessionId: event.sessionId, partner: event.partner, isInitiator: event.isInitiator }));
          break;

        case 'session-joined':
          yield put(setMatched({ sessionId: event.sessionId, partner: event.partner, isInitiator: event.isInitiator }));
          yield put(setInSession());
          break;

        case 'partner-joined':
          if (event.socketId) yield put(updatePartnerSocketId(event.socketId));
          yield put(setInSession());
          break;

        case 'chat-message':
          yield put(receiveMessage({ userId: event.userId, message: event.message, isMe: false, timestamp: event.timestamp }));
          break;

        case 'debate-argument':
          yield put(receiveArgument({ userId: event.userId, argument: event.argument, isMe: false, timestamp: event.timestamp }));
          break;

        case 'draw-received':  yield put(setDrawReceived()); break;
        case 'draw-declined':  yield put(setDrawNone()); break;
        case 'draw-accepted':
          yield put(setDrawNone());
          yield put(setResult({ outcome: 'draw', winnerId: null, xpEarned: 15, breakdown: ['Draw — both sides argued well'] }));
          break;

        case 'opponent-resigned':
          yield put(setResult({ outcome: 'resign', winnerId: null, xpEarned: 30, breakdown: ['Opponent resigned — +30 XP win bonus'] }));
          break;

        case 'partner-disconnected':
          yield put(setResult({ outcome: 'opponent_disconnected', winnerId: null, xpEarned: 10, breakdown: ['Partner disconnected — +10 XP'] }));
          break;

        case 'session-error': yield put(setSessionError(event.message)); break;

        // ── New events ────────────────────────────────────────────────────
        case 'session:start':
          yield put(setInSession());
          break;

        case 'timer:update':
          yield put(setTimer(event.secondsLeft));
          break;

        case 'session:end': {
          // Show XP popups for each breakdown item
          const { xpEarned, breakdown = [], speakingTime, sessionDuration, outcome } = event;
          if (xpEarned > 0) {
            yield fork(spawnXpPopup, xpEarned, `+${xpEarned} XP earned!`);
          }
          yield put(setResult({
            outcome: outcome || 'time_up',
            winnerId: null,
            xpEarned: xpEarned ?? 0,
            breakdown: breakdown,
            speakingTime,
            sessionDuration,
          }));
          break;
        }

        case 'mic:warning':
          yield put(setMicWarning(event.secondsLeft));
          break;

        case 'mic:warning:cleared':
          yield put(clearMicWarning());
          break;

        case 'user:resigned':
          // This user was auto-resigned due to mic inactivity
          if (event.reason === 'mic_inactive') {
            yield put(setResult({
              outcome: 'mic_inactive',
              winnerId: null,
              xpEarned: -15,
              breakdown: ['Auto-resigned (mic inactive) — -15 XP penalty'],
            }));
          }
          break;

        case 'economy:update':
          // Live economy update after session ends — update XP, gems, level, streak in Redux
          yield put(applyEconomyUpdate({
            xpChange:   event.xpChange ?? 0,
            newXP:      event.newXP ?? 0,
            newGems:    event.newGems ?? 0,
            newLevel:   event.newLevel ?? 1,
            newStreak:  event.newStreak ?? 0,
            levelledUp: event.levelledUp ?? false,
            gemsEarned: event.gemsEarned ?? 0,
            reason:     event.reason ?? '',
          }));
          // Show XP popup in the session screen if positive
          if ((event.xpChange ?? 0) > 0) {
            yield fork(spawnXpPopup, event.xpChange, event.reason ?? 'Session bonus');
          }
          break;
      }
    }
  } finally {
    if (yield cancelled()) channel.close();
  }
}

// ─── Mic activity reporter saga ────────────────────────────────────────────────
// Responds to actions dispatched by the session screen component's mic state hook.
// Emits ONLY on change (efficient — not a 1s poll).
function* watchMicActivity(): Generator {
  while (true) {
    const action: any = yield take([
      sessionActions.reportMicStatus.type,
      sessionActions.reportSpeaking.type,
    ]);
    const socket = getSocket();
    if (!socket?.connected) continue;

    if (action.type === sessionActions.reportMicStatus.type) {
      socket.emit('mic:status', { isOn: action.payload.isOn });
      if (action.payload.isOn) {
        // Mic just turned ON — start tracking speaking
      }
    }

    if (action.type === sessionActions.reportSpeaking.type) {
      socket.emit('speaking:tick');
      yield put(tickSpeaking());
    }
  }
}

// ─── Auth helper ─────────────────────────────────────────────────────────────
function* getClerkAuth(): Generator {
  let token: string | null = null;
  const clerkId: string | null = localStorage.getItem('clerk_id');
  try {
    const clerk = (window as any).Clerk;
    if (clerk?.session) {
      token = (yield call([clerk.session, clerk.session.getToken])) as string | null;
    }
  } catch { /* not available */ }
  return { token, clerkId };
}

// ─── Join existing session ────────────────────────────────────────────────────
function* joinSessionFlow(action: ReturnType<typeof sessionActions.joinSession>): Generator {
  const { userId, sessionId, topic } = action.payload;
  const auth: any = yield call(getClerkAuth);
  if (!auth.clerkId) { yield put(setSessionError('Not signed in.')); return; }

  const dbUserId = localStorage.getItem('db_user_id');
  if (!dbUserId) { yield put(setSessionError('Account still syncing. Wait a moment.')); return; }

  let socket: Socket;
  try {
    socket = (yield call(getOrCreateSocket, auth.token, auth.clerkId)) as Socket;
    yield call(ensureConnected, socket);
  } catch (err: any) {
    yield put(setSessionError('Failed to connect: ' + (err?.message ?? 'Unknown')));
    return;
  }

  yield put(setSearching({ topic }));
  socket.emit('match:join-session', { sessionId });

  const channel = createSocketChannel(socket);
  const watchTask: any = yield fork(watchSocketEvents, channel);
  const micTask: any = yield fork(watchMicActivity);

  yield race({
    leave: take(sessionActions.leaveSession.type),
    reset: take(sessionActions.reset.type),
  });

  yield cancel(watchTask);
  yield cancel(micTask);
  channel.close();
  socket.emit('leave-session');
  yield put(resetSession());
}

// ─── Random matchmaking ───────────────────────────────────────────────────────
function* sessionFlow(action: ReturnType<typeof sessionActions.findPartner>): Generator {
  const { userId, topic } = action.payload;
  const auth: any = yield call(getClerkAuth);
  if (!auth.clerkId) { yield put(setSessionError('Not signed in.')); return; }

  const dbUserId = localStorage.getItem('db_user_id');
  if (!dbUserId) { yield put(setSessionError('Account still syncing.')); return; }

  let socket: Socket;
  try {
    socket = (yield call(getOrCreateSocket, auth.token, auth.clerkId)) as Socket;
    yield call(ensureConnected, socket);
  } catch (err: any) {
    yield put(setSessionError('Failed to connect: ' + (err?.message ?? 'Unknown')));
    return;
  }

  yield put(setSearching({ topic }));
  socket.emit('find-partner', { userId, topic });

  const channel = createSocketChannel(socket);
  const watchTask: any = yield fork(watchSocketEvents, channel);
  const micTask: any = yield fork(watchMicActivity);

  yield race({
    leave: take(sessionActions.leaveSession.type),
    reset: take(sessionActions.reset.type),
  });

  yield cancel(watchTask);
  yield cancel(micTask);
  channel.close();
  socket.emit('leave-session');
  disconnectSocket();
  yield put(resetSession());
}

// ─── Message handlers ─────────────────────────────────────────────────────────
function* handleSendMessage(action: ReturnType<typeof sessionActions.sendMessage>): Generator {
  const socket = getSocket();
  if (!socket?.connected) return;
  socket.emit('chat-message', { message: action.payload.message });
  yield put(receiveMessage({ userId: 0, message: action.payload.message, isMe: true, timestamp: new Date().toISOString() }));
}

function* handleSubmitArgument(action: ReturnType<typeof sessionActions.submitArgument>): Generator {
  const socket = getSocket();
  if (!socket?.connected) return;
  socket.emit('debate-argument', { argument: action.payload.argument });
  yield put(receiveArgument({ userId: 0, argument: action.payload.argument, isMe: true, timestamp: new Date().toISOString() }));
}

function* handleOfferDraw(): Generator {
  const socket = getSocket();
  if (!socket?.connected) return;
  socket.emit('offer-draw');
  yield put(setDrawOffered());
}

function* handleAcceptDraw(): Generator {
  const socket = getSocket();
  if (!socket?.connected) return;
  socket.emit('accept-draw');
  yield put(setDrawNone());
}

function* handleDeclineDraw(): Generator {
  const socket = getSocket();
  if (!socket?.connected) return;
  socket.emit('decline-draw');
  yield put(setDrawNone());
}

function* handleResign(): Generator {
  const socket = getSocket();
  if (!socket?.connected) return;
  socket.emit('resign');
}

// ─── Root saga ────────────────────────────────────────────────────────────────
export default function* sessionSaga() {
  yield takeLatest(sessionActions.findPartner.type, sessionFlow);
  yield takeLatest(sessionActions.joinSession.type, joinSessionFlow);
  yield takeEvery(sessionActions.sendMessage.type, handleSendMessage);
  yield takeEvery(sessionActions.submitArgument.type, handleSubmitArgument);
  yield takeEvery(sessionActions.offerDraw.type, handleOfferDraw);
  yield takeEvery(sessionActions.acceptDraw.type, handleAcceptDraw);
  yield takeEvery(sessionActions.declineDraw.type, handleDeclineDraw);
  yield takeEvery(sessionActions.resign.type, handleResign);
}