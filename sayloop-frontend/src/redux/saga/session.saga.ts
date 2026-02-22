import { eventChannel } from 'redux-saga';
import { take, put, call, fork, cancel, cancelled, select } from 'redux-saga/effects';
import { getSocket, connectSocket, disconnectSocket } from '../service/socket.service';
import {
  setConnected, setDisconnected,
  setSearching, setWaitingMessage, setPartnerFound, setInSession,
  addMessage, addArgument,
  setDrawOffered, setDrawReceived, setDrawDeclined, setDrawAccepted,
  setDebateEnded, setPartnerDisconnected, setPartnerSkipped,
  resetSession, setError,
} from '../slice/session.slice';

// Action type constants
export const SESSION_ACTIONS = {
  CONNECT:          'SESSION/CONNECT',
  DISCONNECT:       'SESSION/DISCONNECT',
  FIND_PARTNER:     'SESSION/FIND_PARTNER',
  SEND_MESSAGE:     'SESSION/SEND_MESSAGE',
  SUBMIT_ARGUMENT:  'SESSION/SUBMIT_ARGUMENT',
  OFFER_DRAW:       'SESSION/OFFER_DRAW',
  ACCEPT_DRAW:      'SESSION/ACCEPT_DRAW',
  DECLINE_DRAW:     'SESSION/DECLINE_DRAW',
  RESIGN:           'SESSION/RESIGN',
  END_DEBATE:       'SESSION/END_DEBATE',
  RESET:            'SESSION/RESET',
};

// Action creators used by components and hooks
export const sessionActions = {
  connect:         (payload) => ({ type: SESSION_ACTIONS.CONNECT,         payload }),
  disconnect:      ()        => ({ type: SESSION_ACTIONS.DISCONNECT }),
  findPartner:     (payload) => ({ type: SESSION_ACTIONS.FIND_PARTNER,    payload }),
  sendMessage:     (payload) => ({ type: SESSION_ACTIONS.SEND_MESSAGE,    payload }),
  submitArgument:  (payload) => ({ type: SESSION_ACTIONS.SUBMIT_ARGUMENT, payload }),
  offerDraw:       ()        => ({ type: SESSION_ACTIONS.OFFER_DRAW }),
  acceptDraw:      ()        => ({ type: SESSION_ACTIONS.ACCEPT_DRAW }),
  declineDraw:     ()        => ({ type: SESSION_ACTIONS.DECLINE_DRAW }),
  resign:          ()        => ({ type: SESSION_ACTIONS.RESIGN }),
  endDebate:       ()        => ({ type: SESSION_ACTIONS.END_DEBATE }),
  reset:           ()        => ({ type: SESSION_ACTIONS.RESET }),
};

// Creates a channel that listens to socket events and passes them into the saga.
// IMPORTANT: WebRTC signal events (offer, answer, ice-candidate) are NOT handled
// here. The useWebRTC hook registers its own socket.on listeners for those directly.
// If the saga also listened to them, it would consume them before the hook could.
const createSocketChannel = (socket) =>
  eventChannel((emit) => {
    socket.on('connect',    () => emit({ type: 'CONNECTED', socketId: socket.id }));
    socket.on('disconnect', () => emit({ type: 'DISCONNECTED' }));

    // Matchmaking
    socket.on('waiting',         (d) => emit({ type: 'WAITING',          ...d }));
    socket.on('partner-found',   (d) => emit({ type: 'PARTNER_FOUND',    ...d }));
    socket.on('finding-partner', () => emit({ type: 'FINDING_PARTNER' }));

    // Chat and debate
    socket.on('receive-message',  (d) => emit({ type: 'MESSAGE_RECEIVED',  ...d }));
    socket.on('argument-received',(d) => emit({ type: 'ARGUMENT_RECEIVED', ...d }));

    // Draw system
    socket.on('draw-offered',           (d) => emit({ type: 'DRAW_OFFERED',           ...d }));
    socket.on('draw-offer-sent',        (d) => emit({ type: 'DRAW_OFFER_SENT',        ...d }));
    socket.on('draw-declined',          (d) => emit({ type: 'DRAW_DECLINED',          ...d }));
    socket.on('draw-declined-confirmed',(d) => emit({ type: 'DRAW_DECLINED_CONFIRMED',...d }));
    socket.on('draw-already-offered',   (d) => emit({ type: 'DRAW_ALREADY_OFFERED',   ...d }));

    // Session end events
    socket.on('debate-ended',         (d) => emit({ type: 'DEBATE_ENDED',          ...d }));
    socket.on('partner-disconnected', (d) => emit({ type: 'PARTNER_DISCONNECTED',  ...d }));
    socket.on('partner-skipped',      () => emit({ type: 'PARTNER_SKIPPED' }));

    // Cleanup all listeners when channel closes
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('waiting');
      socket.off('partner-found');
      socket.off('finding-partner');
      socket.off('receive-message');
      socket.off('argument-received');
      socket.off('draw-offered');
      socket.off('draw-offer-sent');
      socket.off('draw-declined');
      socket.off('draw-declined-confirmed');
      socket.off('draw-already-offered');
      socket.off('debate-ended');
      socket.off('partner-disconnected');
      socket.off('partner-skipped');
    };
  });

// Reads socket events and dispatches the matching Redux action
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
            partnerId:      event.partnerId,
            partnerUserId:  event.partnerUserId,
            roomId:         event.roomId,
            isInitiator:    event.isInitiator,
            topic:          event.topic,
          }));
          break;

        case 'FINDING_PARTNER':
          yield put(setSearching({ message: 'Finding new partner...' }));
          break;

        case 'MESSAGE_RECEIVED': {
          const mySocketId = yield select((s) => s.session.socketId);
          yield put(addMessage({
            userId:    event.userId,
            message:   event.message,
            timestamp: event.timestamp,
            isMe:      event.from === mySocketId,
          }));
          break;
        }

        case 'ARGUMENT_RECEIVED': {
          const myUserId = yield select((s) => s.session.partner?.userId);
          yield put(addArgument({
            from:      event.from,
            argument:  event.argument,
            timestamp: event.timestamp,
            isMe:      event.from !== myUserId,
          }));
          break;
        }

        // Draw flow: partner offered me a draw
        case 'DRAW_OFFERED':
          yield put(setDrawReceived());
          break;

        // Draw flow: server confirmed my offer was sent
        case 'DRAW_OFFER_SENT':
          yield put(setDrawOffered());
          break;

        // Draw flow: my offer was declined
        case 'DRAW_DECLINED':
          yield put(setDrawDeclined());
          break;

        // Draw flow: I declined, server confirmed
        case 'DRAW_DECLINED_CONFIRMED':
          yield put(setDrawDeclined());
          break;

        // Draw flow: tried to offer but one is already pending
        case 'DRAW_ALREADY_OFFERED':
          yield put(setDrawDeclined());
          break;

        case 'DEBATE_ENDED':
          yield put(setDebateEnded(event));
          break;

        case 'PARTNER_DISCONNECTED':
          yield put(setPartnerDisconnected(event));
          break;

        case 'PARTNER_SKIPPED':
          yield put(setPartnerSkipped());
          break;

        default:
          break;
      }
    }
  } finally {
    if (yield cancelled()) channel.close();
  }
}

// Outgoing socket emissions — these send events from the client to the server

function* handleFindPartner(socket, action) {
  const { userId, topic } = action.payload;
  yield put(setSearching({ message: 'Looking for a partner...' }));
  socket.emit('find-partner', { userId, topic });
}

function* handleSendMessage(socket, action) {
  const roomId = yield select((s) => s.session.roomId);
  if (!roomId) return;
  socket.emit('send-message', { message: action.payload.message, roomId });
  yield put(addMessage({
    userId:    action.payload.userId,
    message:   action.payload.message,
    timestamp: new Date().toISOString(),
    isMe:      true,
  }));
}

function* handleSubmitArgument(socket, action) {
  const roomId = yield select((s) => s.session.roomId);
  if (!roomId) return;
  socket.emit('submit-argument', { argument: action.payload.argument, roomId });
  yield put(addArgument({
    from:      action.payload.userId,
    argument:  action.payload.argument,
    timestamp: new Date().toISOString(),
    isMe:      true,
  }));
}

function* handleOfferDraw(socket) {
  const roomId = yield select((s) => s.session.roomId);
  if (!roomId) return;
  socket.emit('offer-draw', { roomId });
}

function* handleAcceptDraw(socket) {
  const roomId = yield select((s) => s.session.roomId);
  if (!roomId) return;
  yield put(setDrawAccepted());
  socket.emit('accept-draw', { roomId });
}

function* handleDeclineDraw(socket) {
  const roomId = yield select((s) => s.session.roomId);
  if (!roomId) return;
  socket.emit('decline-draw', { roomId });
  yield put(setDrawDeclined());
}

function* handleResign(socket) {
  const roomId = yield select((s) => s.session.roomId);
  if (!roomId) return;
  socket.emit('resign', { roomId });
}

function* handleEndDebate(socket) {
  const roomId = yield select((s) => s.session.roomId);
  if (!roomId) return;
  socket.emit('end-debate', { roomId });
}

// Main saga: runs while a session is active, routes outgoing actions to handlers
function* sessionSaga(action) {
  const { userId } = action.payload;
  const socket = getSocket();
  connectSocket();

  // Authenticate with the server as soon as the socket connects
  socket.once('connect', () => {
    socket.emit('authenticate', { userId });
  });

  const socketTask = yield fork(watchSocketEvents, socket);

  try {
    while (true) {
      const outAction = yield take([
        SESSION_ACTIONS.FIND_PARTNER,
        SESSION_ACTIONS.SEND_MESSAGE,
        SESSION_ACTIONS.SUBMIT_ARGUMENT,
        SESSION_ACTIONS.OFFER_DRAW,
        SESSION_ACTIONS.ACCEPT_DRAW,
        SESSION_ACTIONS.DECLINE_DRAW,
        SESSION_ACTIONS.RESIGN,
        SESSION_ACTIONS.END_DEBATE,
        SESSION_ACTIONS.DISCONNECT,
        SESSION_ACTIONS.RESET,
      ]);

      if (
        outAction.type === SESSION_ACTIONS.DISCONNECT ||
        outAction.type === SESSION_ACTIONS.RESET
      ) break;

      switch (outAction.type) {
        case SESSION_ACTIONS.FIND_PARTNER:    yield call(handleFindPartner,   socket, outAction); break;
        case SESSION_ACTIONS.SEND_MESSAGE:    yield call(handleSendMessage,   socket, outAction); break;
        case SESSION_ACTIONS.SUBMIT_ARGUMENT: yield call(handleSubmitArgument,socket, outAction); break;
        case SESSION_ACTIONS.OFFER_DRAW:      yield call(handleOfferDraw,     socket);            break;
        case SESSION_ACTIONS.ACCEPT_DRAW:     yield call(handleAcceptDraw,    socket);            break;
        case SESSION_ACTIONS.DECLINE_DRAW:    yield call(handleDeclineDraw,   socket);            break;
        case SESSION_ACTIONS.RESIGN:          yield call(handleResign,        socket);            break;
        case SESSION_ACTIONS.END_DEBATE:      yield call(handleEndDebate,     socket);            break;
        default: break;
      }
    }
  } finally {
    yield cancel(socketTask);
    disconnectSocket();
    if (yield cancelled()) disconnectSocket();
    yield put(setDisconnected());
    yield put(resetSession());
  }
}

// Root saga: waits for CONNECT action, then starts a session
export default function* rootSaga() {
  while (true) {
    const action = yield take(SESSION_ACTIONS.CONNECT);
    yield call(sessionSaga, action);
  }
}