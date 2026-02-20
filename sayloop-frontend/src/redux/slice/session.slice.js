import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Socket connection
  isConnected:    false,
  socketId:       null,

  // Matchmaking
  status:         'idle', // idle | searching | matched | in_session | ended
  waitingMessage: null,

  // Partner info
  partner: {
    socketId:  null,
    userId:    null,
  },

  // Session/room
  roomId:         null,
  isInitiator:    false,
  topic:          null,

  // Chat messages in session
  messages:       [],

  // Arguments submitted during debate
  arguments:      [],

  // Session result
  result:         null,

  // Errors
  error:          null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    // ── Socket connection ──────────────────────────────
    setConnected: (state, action) => {
      state.isConnected = true;
      state.socketId    = action.payload.socketId;
      state.error       = null;
    },
    setDisconnected: (state) => {
      state.isConnected = false;
      state.socketId    = null;
    },

    // ── Matchmaking ────────────────────────────────────
    setSearching: (state, action) => {
      state.status         = 'searching';
      state.waitingMessage = action.payload?.message ?? 'Looking for a partner...';
      state.error          = null;
      state.partner        = { socketId: null, userId: null };
      state.roomId         = null;
      state.messages       = [];
      state.arguments      = [];
      state.result         = null;
    },
    setWaitingMessage: (state, action) => {
      state.waitingMessage = action.payload.message;
    },
    setPartnerFound: (state, action) => {
      const { partnerId, partnerUserId, roomId, isInitiator, topic } = action.payload;
      state.status         = 'matched';
      state.waitingMessage = null;
      state.partner        = { socketId: partnerId, userId: partnerUserId };
      state.roomId         = roomId;
      state.isInitiator    = isInitiator;
      state.topic          = topic;
    },
    setInSession: (state) => {
      state.status = 'in_session';
    },

    // ── Messages ───────────────────────────────────────
    addMessage: (state, action) => {
      state.messages.push({
        id:        Date.now(),
        from:      action.payload.userId,
        message:   action.payload.message,
        timestamp: action.payload.timestamp,
        isMe:      action.payload.isMe ?? false,
      });
    },

    // ── Debate arguments ───────────────────────────────
    addArgument: (state, action) => {
      state.arguments.push({
        id:        Date.now(),
        from:      action.payload.from,
        argument:  action.payload.argument,
        timestamp: action.payload.timestamp,
        isMe:      action.payload.isMe ?? false,
      });
    },

    // ── Session ended ──────────────────────────────────
    setDebateEnded: (state, action) => {
      state.status = 'ended';
      state.result = action.payload ?? null;
    },
    setPartnerDisconnected: (state) => {
      state.status = 'ended';
      state.result = { reason: 'partner_disconnected', message: 'Your partner disconnected.' };
    },
    setPartnerSkipped: (state) => {
      state.status = 'ended';
      state.result = { reason: 'partner_skipped', message: 'Your partner skipped.' };
    },

    // ── Reset / leave ──────────────────────────────────
    resetSession: () => initialState,

    // ── Error ──────────────────────────────────────────
    setError: (state, action) => {
      state.error  = action.payload;
      state.status = 'idle';
    },
  },
});

export const {
  setConnected, setDisconnected,
  setSearching, setWaitingMessage, setPartnerFound, setInSession,
  addMessage, addArgument,
  setDebateEnded, setPartnerDisconnected, setPartnerSkipped,
  resetSession, setError,
} = sessionSlice.actions;

export default sessionSlice.reducer;
