import { eventChannel } from 'redux-saga';
import { take, put, call, fork, cancel, cancelled, select } from 'redux-saga/effects';
import { getSocket, connectSocket, disconnectSocket } from './socket.service';
import {
  setConnected, setDisconnected,
  setSearching, setWaitingMessage, setPartnerFound, setInSession,
  addMessage, addArgument,
  setDrawOffered, setDrawReceived, setDrawDeclined, setDrawAccepted,
  setDebateEnded, setPartnerDisconnected, setPartnerSkipped,
  resetSession, setError,
} from '../slice/session.slice';

// ── Action types ─────────────────────────────────────────────────
export const SESSION_ACTIONS = {
  CONNECT: 'SESSION/CONNECT',
  DISCONNECT: 'SESSION/DISCONNECT',
  FIND_PARTNER: 'SESSION/FIND_PARTNER',
  SEND_MESSAGE: 'SESSION/SEND_MESSAGE',
  SUBMIT_ARGUMENT: 'SESSION/SUBMIT_ARGUMENT',
  // Draw
  OFFER_DRAW: 'SESSION/OFFER_DRAW',
  ACCEPT_DRAW: 'SESSION/ACCEPT_DRAW',
  DECLINE_DRAW: 'SESSION/DECLINE_DRAW',
  // End
  RESIGN: 'SESSION/RESIGN',
  END_DEBATE: 'SESSION/END_DEBATE',
  RESET: 'SESSION/RESET',
};

// ── Action creators ───────────────────────────────────────────────
export const sessionActions = {
  connect: (payload) => ({ type: SESSION_ACTIONS.CONNECT, payload }),
  disconnect: () => ({ type: SESSION_ACTIONS.DISCONNECT }),
  findPartner: (payload) => ({ type: SESSION_ACTIONS.FIND_PARTNER, payload }),
  sendMessage: (payload) => ({ type: SESSION_ACTIONS.SEND_MESSAGE, payload }),
  submitArgument: (payload) => ({ type: SESSION_ACTIONS.SUBMIT_ARGUMENT, payload }),
  // Draw
  offerDraw: () => ({ type: SESSION_ACTIONS.OFFER_DRAW }),
  acceptDraw: () => ({ type: SESSION_ACTIONS.ACCEPT_DRAW }),
  declineDraw: () => ({ type: SESSION_ACTIONS.DECLINE_DRAW }),
  // End
  resign: () => ({ type: SESSION_ACTIONS.RESIGN }),
  endDebate: () => ({ type: SESSION_ACTIONS.END_DEBATE }),
  reset: () => ({ type: SESSION_ACTIONS.RESET }),
};

// ── Socket event channel ──────────────────────────────────────────
const createSocketChannel = (socket) =>
  eventChannel((emit) => {
    socket.on('connect', () => emit({ type: 'CONNECTED', socketId: socket.id }));
    socket.on('disconnect', () => emit({ type: 'DISCONNECTED' }));

    // Matchmaking
    socket.on('waiting', (d) => emit({ type: 'WAITING', ...d }));
    socket.on('partner-found', (d) => emit({ type: 'PARTNER_FOUND', ...d }));
    socket.on('finding-partner', () => emit({ type: 'FINDING_PARTNER' }));

    // Chat
    socket.on('receive-message', (d) => emit({ type: 'MESSAGE_RECEIVED', ...d }));
    socket.on('argument-received', (d) => emit({ type: 'ARGUMENT_RECEIVED', ...d }));

    // ── Draw events (from server) ───────────────────────────────
    socket.on('draw-offered', (d) => emit({ type: 'DRAW_OFFERED', ...d }));
    socket.on('draw-offer-sent', (d) => emit({ type: 'DRAW_OFFER_SENT', ...d }));
    socket.on('draw-declined', (d) => emit({ type: 'DRAW_DECLINED', ...d }));
    socket.on('draw-declined-confirmed', (d) => emit({ type: 'DRAW_DECLINED_CONFIRMED', ...d }));
    socket.on('draw-already-offered', (d) => emit({ type: 'DRAW_ALREADY_OFFERED', ...d }));

    // Session end (covers draw accepted, resign, completed, disconnect)
    socket.on('debate-ended', (d) => emit({ type: 'DEBATE_ENDED', ...d }));
    socket.on('partner-disconnected', (d) => emit({ type: 'PARTNER_DISCONNECTED', ...d }));
    socket.on('partner-skipped', () => emit({ type: 'PARTNER_SKIPPED' }));

    // WebRTC (handled directly in component via window)
    socket.on('offer', (d) => emit({ type: 'OFFER', ...d }));
    socket.on('answer', (d) => emit({ type: 'ANSWER', ...d }));
    socket.on('ice-candidate', (d) => emit({ type: 'ICE_CANDIDATE', ...d }));

    return () => {
      socket.off('connect'); socket.off('disconnect');
      socket.off('waiting'); socket.off('partner-found'); socket.off('finding-partner');
      socket.off('receive-message'); socket.off('argument-received');
      socket.off('draw-offered'); socket.off('draw-offer-sent');
      socket.off('draw-declined'); socket.off('draw-declined-confirmed');
      socket.off('draw-already-offered');
      socket.off('debate-ended'); socket.off('partner-disconnected'); socket.off('partner-skipped');
      socket.off('offer'); socket.off('answer'); socket.off('ice-candidate');
    };
  });

// ── Socket event → Redux mapping ─────────────────────────────────
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
            partnerId: event.partnerId, partnerUserId: event.partnerUserId,
            roomId: event.roomId, isInitiator: event.isInitiator, topic: event.topic,
          }));
          break;
        case 'FINDING_PARTNER':
          yield put(setSearching({ message: 'Finding new partner…' }));
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

        // ── Draw events ────────────────────────────────────────
        case 'DRAW_OFFER_SENT':
          // I offered — update my state to 'offered'
          yield put(setDrawOffered());
          break;
        case 'DRAW_OFFERED':
          // Partner offered me a draw — show accept/decline UI
          yield put(setDrawReceived());
          break;
        case 'DRAW_DECLINED':
          // My offer was declined — reset draw state
          yield put(setDrawDeclined());
          break;
        case 'DRAW_DECLINED_CONFIRMED':
          // I declined — reset draw state
          yield put(setDrawDeclined());
          break;
        case 'DRAW_ALREADY_OFFERED':
          // Server rejected duplicate offer — reset
          yield put(setDrawDeclined());
          break;

        // ── End events ─────────────────────────────────────────
        case 'DEBATE_ENDED':
          yield put(setDebateEnded(event));
          break;
        case 'PARTNER_DISCONNECTED':
          yield put(setPartnerDisconnected(event));
          break;
        case 'PARTNER_SKIPPED':
          yield put(setPartnerSkipped());
          break;

        // WebRTC — pass to component via window
        case 'OFFER': window.__webrtc_offer = event; break;
        case 'ANSWER': window.__webrtc_answer = event; break;
        case 'ICE_CANDIDATE': window.__webrtc_candidate = event; break;
        default: break;
      }
    }
  } finally {
    if (yield cancelled()) channel.close();
  }
}

// ── Outgoing socket emissions ─────────────────────────────────────
function* handleFindPartner(socket, action) {
  const { userId, topic } = action.payload;
  yield put(setSearching({ message: 'Looking for a partner…' }));
  socket.emit('find-partner', { userId, topic });
}

function* handleSendMessage(socket, action) {
  const roomId = yield select((s) => s.session.roomId);
  socket.emit('send-message', { message: action.payload.message, roomId });
  yield put(addMessage({
    userId: action.payload.userId, message: action.payload.message,
    timestamp: new Date().toISOString(), isMe: true,
  }));
}

function* handleSubmitArgument(socket, action) {
  const roomId = yield select((s) => s.session.roomId);
  socket.emit('submit-argument', { argument: action.payload.argument, roomId });
  yield put(addArgument({
    from: action.payload.userId, argument: action.payload.argument,
    timestamp: new Date().toISOString(), isMe: true,
  }));
}

// Draw handlers
function* handleOfferDraw(socket) {
  const roomId = yield select((s) => s.session.roomId);
  socket.emit('offer-draw', { roomId });
  // Optimistically show 'offered' state — server will confirm via 'draw-offer-sent'
}

function* handleAcceptDraw(socket) {
  const roomId = yield select((s) => s.session.roomId);
  yield put(setDrawAccepted());
  socket.emit('accept-draw', { roomId });
}

function* handleDeclineDraw(socket) {
  const roomId = yield select((s) => s.session.roomId);
  socket.emit('decline-draw', { roomId });
  yield put(setDrawDeclined());
}

// Resign handler
function* handleResign(socket) {
  const roomId = yield select((s) => s.session.roomId);
  socket.emit('resign', { roomId });
}

function* handleEndDebate(socket) {
  const roomId = yield select((s) => s.session.roomId);
  socket.emit('end-debate', { roomId });
}

// ── Main saga ─────────────────────────────────────────────────────
function* sessionSaga(action) {
  const { userId } = action.payload;
  const socket = getSocket();
  connectSocket();

  socket.once('connect', () => socket.emit('authenticate', { userId }));

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

      if (outAction.type === SESSION_ACTIONS.DISCONNECT || outAction.type === SESSION_ACTIONS.RESET) break;

      switch (outAction.type) {
        case SESSION_ACTIONS.FIND_PARTNER: yield call(handleFindPartner, socket, outAction); break;
        case SESSION_ACTIONS.SEND_MESSAGE: yield call(handleSendMessage, socket, outAction); break;
        case SESSION_ACTIONS.SUBMIT_ARGUMENT: yield call(handleSubmitArgument, socket, outAction); break;
        case SESSION_ACTIONS.OFFER_DRAW: yield call(handleOfferDraw, socket); break;
        case SESSION_ACTIONS.ACCEPT_DRAW: yield call(handleAcceptDraw, socket); break;
        case SESSION_ACTIONS.DECLINE_DRAW: yield call(handleDeclineDraw, socket); break;
        case SESSION_ACTIONS.RESIGN: yield call(handleResign, socket); break;
        case SESSION_ACTIONS.END_DEBATE: yield call(handleEndDebate, socket); break;
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

export default function* rootSaga() {
  while (true) {
    const action = yield take(SESSION_ACTIONS.CONNECT);
    yield call(sessionSaga, action);
  }
}