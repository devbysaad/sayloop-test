import { eventChannel } from 'redux-saga';
import { take, put, call, fork, cancel, cancelled, select } from 'redux-saga/effects';
import { getSocket, connectSocket, disconnectSocket } from './socket.service';
import {
  setConnected, setDisconnected,
  setSearching, setWaitingMessage, setPartnerFound, setInSession,
  addMessage, addArgument,
  setDebateEnded, setPartnerDisconnected, setPartnerSkipped,
  resetSession, setError,
} from '../slice/session.slice';

// ── Action types (dispatched from components) ─────────
export const SESSION_ACTIONS = {
  CONNECT:          'SESSION/CONNECT',
  DISCONNECT:       'SESSION/DISCONNECT',
  FIND_PARTNER:     'SESSION/FIND_PARTNER',
  SEND_MESSAGE:     'SESSION/SEND_MESSAGE',
  SUBMIT_ARGUMENT:  'SESSION/SUBMIT_ARGUMENT',
  END_DEBATE:       'SESSION/END_DEBATE',
  SKIP:             'SESSION/SKIP',
  RESET:            'SESSION/RESET',
};

// ── Action creators ────────────────────────────────────
export const sessionActions = {
  connect:         (payload) => ({ type: SESSION_ACTIONS.CONNECT,         payload }),
  disconnect:      ()        => ({ type: SESSION_ACTIONS.DISCONNECT }),
  findPartner:     (payload) => ({ type: SESSION_ACTIONS.FIND_PARTNER,    payload }),
  sendMessage:     (payload) => ({ type: SESSION_ACTIONS.SEND_MESSAGE,    payload }),
  submitArgument:  (payload) => ({ type: SESSION_ACTIONS.SUBMIT_ARGUMENT, payload }),
  endDebate:       ()        => ({ type: SESSION_ACTIONS.END_DEBATE }),
  skip:            (payload) => ({ type: SESSION_ACTIONS.SKIP,            payload }),
  reset:           ()        => ({ type: SESSION_ACTIONS.RESET }),
};

// ── Create an event channel that listens to all socket events ──
const createSocketChannel = (socket) =>
  eventChannel((emit) => {
    // Connection
    socket.on('connect',    () => emit({ type: 'CONNECTED',    socketId: socket.id }));
    socket.on('disconnect', () => emit({ type: 'DISCONNECTED' }));

    // Matchmaking
    socket.on('waiting',          (data) => emit({ type: 'WAITING',           ...data }));
    socket.on('partner-found',    (data) => emit({ type: 'PARTNER_FOUND',     ...data }));
    socket.on('finding-partner',  ()     => emit({ type: 'FINDING_PARTNER' }));

    // Chat
    socket.on('receive-message',  (data) => emit({ type: 'MESSAGE_RECEIVED',  ...data }));

    // Debate
    socket.on('argument-received',(data) => emit({ type: 'ARGUMENT_RECEIVED', ...data }));
    socket.on('debate-ended',     (data) => emit({ type: 'DEBATE_ENDED',      ...data }));

    // Partner status
    socket.on('partner-disconnected', (data) => emit({ type: 'PARTNER_DISCONNECTED', ...data }));
    socket.on('partner-skipped',      ()     => emit({ type: 'PARTNER_SKIPPED' }));

    // WebRTC (just pass through — handled in component)
    socket.on('offer',         (data) => emit({ type: 'OFFER',          ...data }));
    socket.on('answer',        (data) => emit({ type: 'ANSWER',         ...data }));
    socket.on('ice-candidate', (data) => emit({ type: 'ICE_CANDIDATE',  ...data }));

    // Return unsubscribe function
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('waiting');
      socket.off('partner-found');
      socket.off('finding-partner');
      socket.off('receive-message');
      socket.off('argument-received');
      socket.off('debate-ended');
      socket.off('partner-disconnected');
      socket.off('partner-skipped');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
    };
  });

// ── Listen to all socket events and map to Redux ──────
function* watchSocketEvents(socket) {
  const channel = yield call(createSocketChannel, socket);
  try {
    while (true) {
      const event = yield take(channel);

      switch (event.type) {
        case 'CONNECTED':
          yield put(setConnected({ socketId: event.socketId }));
          break;
        case 'DISCONNECTED':
          yield put(setDisconnected());
          break;
        case 'WAITING':
          yield put(setWaitingMessage({ message: event.message }));
          break;
        case 'PARTNER_FOUND':
          yield put(setPartnerFound({
            partnerId:     event.partnerId,
            partnerUserId: event.partnerUserId,
            roomId:        event.roomId,
            isInitiator:   event.isInitiator,
            topic:         event.topic,
          }));
          break;
        case 'FINDING_PARTNER':
          yield put(setSearching({ message: 'Finding new partner...' }));
          break;
        case 'MESSAGE_RECEIVED': {
          const myId = yield select((s) => s.session.partner.userId);
          yield put(addMessage({ ...event, isMe: event.userId !== myId }));
          break;
        }
        case 'ARGUMENT_RECEIVED': {
          const myUserId = yield select((s) => s.session.partner.userId);
          yield put(addArgument({ ...event, isMe: event.from !== myUserId }));
          break;
        }
        case 'DEBATE_ENDED':
          yield put(setDebateEnded(event));
          break;
        case 'PARTNER_DISCONNECTED':
          yield put(setPartnerDisconnected());
          break;
        case 'PARTNER_SKIPPED':
          yield put(setPartnerSkipped());
          break;
        // WebRTC events are stored in window for component access
        case 'OFFER':
          window.__webrtc_offer = event;
          break;
        case 'ANSWER':
          window.__webrtc_answer = event;
          break;
        case 'ICE_CANDIDATE':
          window.__webrtc_candidate = event;
          break;
        default:
          break;
      }
    }
  } finally {
    if (yield cancelled()) channel.close();
  }
}

// ── Handle outgoing socket emissions ──────────────────
function* handleFindPartner(socket, action) {
  const { userId, topic } = action.payload;
  yield put(setSearching({ message: 'Looking for a partner...' }));
  socket.emit('find-partner', { userId, topic });
}

function* handleSendMessage(socket, action) {
  const roomId = yield select((s) => s.session.roomId);
  socket.emit('send-message', { message: action.payload.message, roomId });
  // Add own message to state
  yield put(addMessage({
    userId:    action.payload.userId,
    message:   action.payload.message,
    timestamp: new Date().toISOString(),
    isMe:      true,
  }));
}

function* handleSubmitArgument(socket, action) {
  const roomId = yield select((s) => s.session.roomId);
  socket.emit('submit-argument', { argument: action.payload.argument, roomId });
  yield put(addArgument({
    from:      action.payload.userId,
    argument:  action.payload.argument,
    timestamp: new Date().toISOString(),
    isMe:      true,
  }));
}

function* handleEndDebate(socket) {
  const roomId = yield select((s) => s.session.roomId);
  socket.emit('end-debate', { roomId });
}

function* handleSkip(socket, action) {
  socket.emit('skip', action.payload);
}

// ── Main connection saga ───────────────────────────────
function* sessionSaga(action) {
  const { userId } = action.payload;
  const socket     = getSocket();

  connectSocket();

  // Authenticate once connected
  socket.once('connect', () => {
    socket.emit('authenticate', { userId });
  });

  // Fork socket event watcher
  const socketTask = yield fork(watchSocketEvents, socket);

  // Listen for outgoing actions from components
  try {
    while (true) {
      const outAction = yield take([
        SESSION_ACTIONS.FIND_PARTNER,
        SESSION_ACTIONS.SEND_MESSAGE,
        SESSION_ACTIONS.SUBMIT_ARGUMENT,
        SESSION_ACTIONS.END_DEBATE,
        SESSION_ACTIONS.SKIP,
        SESSION_ACTIONS.DISCONNECT,
        SESSION_ACTIONS.RESET,
      ]);

      if (
        outAction.type === SESSION_ACTIONS.DISCONNECT ||
        outAction.type === SESSION_ACTIONS.RESET
      ) {
        break;
      }

      switch (outAction.type) {
        case SESSION_ACTIONS.FIND_PARTNER:
          yield call(handleFindPartner, socket, outAction);
          break;
        case SESSION_ACTIONS.SEND_MESSAGE:
          yield call(handleSendMessage, socket, outAction);
          break;
        case SESSION_ACTIONS.SUBMIT_ARGUMENT:
          yield call(handleSubmitArgument, socket, outAction);
          break;
        case SESSION_ACTIONS.END_DEBATE:
          yield call(handleEndDebate, socket);
          break;
        case SESSION_ACTIONS.SKIP:
          yield call(handleSkip, socket, outAction);
          break;
        default:
          break;
      }
    }
  } finally {
    yield cancel(socketTask);
    disconnectSocket();
    if (yield cancelled()) {
      disconnectSocket();
    }
    yield put(setDisconnected());
    yield put(resetSession());
  }
}

// ── Root saga ──────────────────────────────────────────
export default function* rootSaga() {
  while (true) {
    const action = yield take(SESSION_ACTIONS.CONNECT);
    yield call(sessionSaga, action);
  }
}
