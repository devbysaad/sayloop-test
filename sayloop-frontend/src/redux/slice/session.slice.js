import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Socket connection
  isConnected: false,
  socketId: null,

  // Matchmaking
  status: 'idle', // idle | searching | matched | in_session | ended
  waitingMessage: null,

  // Partner
  partner: {
    socketId: null,
    userId: null,
  },

  // Session / room
  roomId: null,
  isInitiator: false,
  topic: null,

  // Chat
  messages: [],

  // Debate arguments
  arguments: [],

  // ── Draw state ───────────────────────────────────────
  // 'none'     → no draw offer active
  // 'offered'  → I offered a draw, waiting for partner
  // 'received' → partner offered me a draw, I must respond
  drawState: 'none',

  // ── Session result ───────────────────────────────────
  // outcome: 'draw' | 'resign' | 'completed' | 'opponent_disconnected'
  result: null,

  error: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    // ── Connection ────────────────────────────────────
    setConnected: (state, action) => {
      state.isConnected = true;
      state.socketId = action.payload.socketId;
      state.error = null;
    },
    setDisconnected: (state) => {
      state.isConnected = false;
      state.socketId = null;
    },

    // ── Matchmaking ───────────────────────────────────
    setSearching: (state, action) => {
      state.status = 'searching';
      state.waitingMessage = action.payload?.message ?? 'Looking for a partner…';
      state.error = null;
      state.partner = { socketId: null, userId: null };
      state.roomId = null;
      state.messages = [];
      state.arguments = [];
      state.result = null;
      state.drawState = 'none';
    },
    setWaitingMessage: (state, action) => {
      state.waitingMessage = action.payload.message;
    },
    setPartnerFound: (state, action) => {
      const { partnerId, partnerUserId, roomId, isInitiator, topic } = action.payload;
      state.status = 'matched';
      state.partner = { socketId: partnerId, userId: partnerUserId };
      state.roomId = roomId;
      state.isInitiator = isInitiator;
      state.topic = topic;
      state.drawState = 'none';
    },
    setInSession: (state) => {
      state.status = 'in_session';
    },

    // ── Messages ──────────────────────────────────────
    addMessage: (state, action) => {
      state.messages.push({
        id: Date.now() + Math.random(),
        from: action.payload.userId,
        message: action.payload.message,
        timestamp: action.payload.timestamp,
        isMe: action.payload.isMe ?? false,
      });
    },

    // ── Arguments ─────────────────────────────────────
    addArgument: (state, action) => {
      state.arguments.push({
        id: Date.now() + Math.random(),
        from: action.payload.from,
        argument: action.payload.argument,
        timestamp: action.payload.timestamp,
        isMe: action.payload.isMe ?? false,
      });
    },

    // ── Draw state ────────────────────────────────────
    // I offered a draw — waiting
    setDrawOffered: (state) => {
      state.drawState = 'offered';
    },
    // Partner offered a draw — I need to respond
    setDrawReceived: (state) => {
      state.drawState = 'received';
    },
    // Draw was declined (either side) — reset
    setDrawDeclined: (state) => {
      state.drawState = 'none';
    },
    // Draw accepted — session will end via setDebateEnded
    setDrawAccepted: (state) => {
      state.drawState = 'none';
    },

    // ── Session ended ─────────────────────────────────
    setDebateEnded: (state, action) => {
      state.status = 'ended';
      state.drawState = 'none';
      state.result = action.payload ?? null;
    },
    setPartnerDisconnected: (state, action) => {
      state.status = 'ended';
      state.drawState = 'none';
      state.result = {
        outcome: 'opponent_disconnected',
        message: action.payload?.message ?? 'Your partner disconnected. You win.',
        xpAwarded: action.payload?.xpAwarded ?? 30,
      };
    },
    // Keep for backwards compatibility — treated same as opponent disconnected
    setPartnerSkipped: (state) => {
      state.status = 'ended';
      state.drawState = 'none';
      state.result = {
        outcome: 'opponent_disconnected',
        message: 'Your partner left the session.',
      };
    },

    // ── Reset ─────────────────────────────────────────
    resetSession: () => initialState,

    // ── Error ─────────────────────────────────────────
    setError: (state, action) => {
      state.error = action.payload;
      state.status = 'idle';
    },
  },
});

export const {
  setConnected, setDisconnected,
  setSearching, setWaitingMessage, setPartnerFound, setInSession,
  addMessage, addArgument,
  setDrawOffered, setDrawReceived, setDrawDeclined, setDrawAccepted,
  setDebateEnded, setPartnerDisconnected, setPartnerSkipped,
  resetSession, setError,
} = sessionSlice.actions;

export default sessionSlice.reducer;