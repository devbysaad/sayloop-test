import {
  call, put, take, fork, cancel, cancelled,
  takeLatest, takeEvery, race,
} from 'redux-saga/effects';
import { createAction } from '@reduxjs/toolkit';
import { eventChannel, END } from 'redux-saga';
import { connectSocket, disconnectSocket, getSocket } from '../service/socket.service';
import type { Socket } from 'socket.io-client';
import {
  setSearching, setMatched, setInSession,
  receiveMessage, receiveArgument,
  setDrawOffered, setDrawReceived, setDrawNone,
  setResult, setSessionError, setWaitingMessage, resetSession,
} from '../slice/session.slice';

export const sessionActions = {
  findPartner: createAction<{ userId: number; topic: string }>('session/findPartner'),
  sendMessage: createAction<{ message: string }>('session/sendMessage'),
  submitArgument: createAction<{ argument: string }>('session/submitArgument'),
  offerDraw: createAction('session/offerDraw'),
  acceptDraw: createAction('session/acceptDraw'),
  declineDraw: createAction('session/declineDraw'),
  resign: createAction('session/resign'),
  leaveSession: createAction('session/leave'),
  reset: createAction('session/reset'),
};

function createSocketChannel(socket: Socket) {
  return eventChannel((emit) => {
    socket.on('connect', () => emit({ type: 'connected' }));
    socket.on('connect_error', (e: Error) => emit({ type: 'connect_error', message: e.message }));
    socket.on('waiting', (d: any) => emit({ type: 'waiting', ...d }));
    socket.on('matched', (d: any) => emit({ type: 'matched', ...d }));
    socket.on('chat-message', (d: any) => emit({ type: 'chat-message', ...d }));
    socket.on('debate-argument', (d: any) => emit({ type: 'debate-argument', ...d }));
    socket.on('draw-received', () => emit({ type: 'draw-received' }));
    socket.on('draw-declined', () => emit({ type: 'draw-declined' }));
    socket.on('draw-accepted', () => emit({ type: 'draw-accepted' }));
    socket.on('opponent-resigned', () => emit({ type: 'opponent-resigned' }));
    socket.on('session-error', (d: any) => emit({ type: 'session-error', ...d }));
    socket.on('partner-disconnected', () => { emit({ type: 'partner-disconnected' }); emit(END); });

    return () => {
      ['connect', 'connect_error', 'waiting', 'matched', 'chat-message',
        'debate-argument', 'draw-received', 'draw-declined', 'draw-accepted',
        'opponent-resigned', 'partner-disconnected', 'session-error'
      ].forEach(ev => socket.off(ev));
    };
  });
}

function* watchSocketEvents(channel: ReturnType<typeof createSocketChannel>): Generator {
  try {
    while (true) {
      const event: any = yield take(channel);
      switch (event.type) {
        case 'connected': break;
        case 'connect_error': yield put(setSessionError('Connection failed: ' + event.message)); break;
        case 'waiting': yield put(setWaitingMessage(event.message)); break;
        case 'matched': yield put(setMatched({ sessionId: event.sessionId, partner: event.partner, isInitiator: event.isInitiator })); break;
        case 'chat-message': yield put(receiveMessage({ userId: event.userId, message: event.message, isMe: false, timestamp: event.timestamp })); break;
        case 'debate-argument': yield put(receiveArgument({ userId: event.userId, argument: event.argument, isMe: false, timestamp: event.timestamp })); break;
        case 'draw-received': yield put(setDrawReceived()); break;
        case 'draw-declined': yield put(setDrawNone()); break;
        case 'draw-accepted': yield put(setDrawNone()); yield put(setResult({ outcome: 'draw', winnerId: null, xpEarned: 15 })); break;
        case 'opponent-resigned': yield put(setResult({ outcome: 'resign', winnerId: null, xpEarned: 30 })); break;
        case 'partner-disconnected': yield put(setResult({ outcome: 'opponent_disconnected', winnerId: null, xpEarned: 10 })); break;
        case 'session-error': yield put(setSessionError(event.message)); break;
      }
    }
  } finally {
    if (yield cancelled()) channel.close();
  }
}

function* sessionFlow(action: ReturnType<typeof sessionActions.findPartner>): Generator {
  const { userId, topic } = action.payload;

  let token: string | null = null;
  let clerkId: string | null = null;

  try {
    const clerk = (window as any).Clerk;
    if (clerk?.session) token = (yield call([clerk.session, clerk.session.getToken])) as string | null;
    if (clerk?.user?.id) clerkId = clerk.user.id as string;
  } catch { /* Clerk not ready */ }

  if (!clerkId) {
    yield put(setSessionError('Not signed in. Please refresh and sign in again.'));
    return;
  }

  const socket = (yield call(connectSocket, userId, token, clerkId)) as Socket;
  yield put(setSearching({ topic }));

  if (!socket.connected) {
    yield new Promise<void>((resolve, reject) => {
      socket.once('connect', () => resolve());
      socket.once('connect_error', (e: Error) => reject(e));
    });
  }

  socket.emit('find-partner', { userId, topic });

  const channel = createSocketChannel(socket);
  const watchTask: any = yield fork(watchSocketEvents, channel);

  yield race({
    leave: take(sessionActions.leaveSession.type),
    reset: take(sessionActions.reset.type),
  });

  yield cancel(watchTask);
  channel.close();
  socket.emit('leave-session');
  disconnectSocket();
  yield put(resetSession());
}

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

export default function* sessionSaga() {
  yield takeLatest(sessionActions.findPartner.type, sessionFlow);
  yield takeEvery(sessionActions.sendMessage.type, handleSendMessage);
  yield takeEvery(sessionActions.submitArgument.type, handleSubmitArgument);
  yield takeEvery(sessionActions.offerDraw.type, handleOfferDraw);
  yield takeEvery(sessionActions.acceptDraw.type, handleAcceptDraw);
  yield takeEvery(sessionActions.declineDraw.type, handleDeclineDraw);
  yield takeEvery(sessionActions.resign.type, handleResign);
}