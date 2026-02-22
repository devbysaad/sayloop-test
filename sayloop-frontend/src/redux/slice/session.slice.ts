import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// ── Types ─────────────────────────────────────────────────────────────────────

export type SessionStatus =
  | 'idle'
  | 'connecting'
  | 'searching'
  | 'waiting'
  | 'partner_found'
  | 'in_session'
  | 'ended'
  | 'error';

export interface ChatMessage {
  userId:    string;
  message:   string;
  timestamp: string;
  isMe:      boolean;
}

export interface Argument {
  from:      string;
  argument:  string;
  timestamp: string;
  isMe:      boolean;
}

export interface Partner {
  socketId: string;
  userId:   string;
}

export interface DebateResult {
  winner?:  string;
  reason?:  string;
  scores?:  Record<string, number>;
  [key: string]: any;
}

interface DrawState {
  offered:  boolean;
  received: boolean;
  accepted: boolean;
  declined: boolean;
}

interface SessionState {
  status:          SessionStatus;
  socketId:        string | null;
  roomId:          string | null;
  partner:         Partner | null;
  isInitiator:     boolean;
  topic:           string | null;
  messages:        ChatMessage[];
  arguments:       Argument[];
  draw:            DrawState;
  debateResult:    DebateResult | null;
  waitingMessage:  string | null;
  error:           string | null;
}

// ── Initial state ─────────────────────────────────────────────────────────────

const initialState: SessionState = {
  status:         'idle',
  socketId:       null,
  roomId:         null,
  partner:        null,
  isInitiator:    false,
  topic:          null,
  messages:       [],
  arguments:      [],
  draw: {
    offered:  false,
    received: false,
    accepted: false,
    declined: false,
  },
  debateResult:   null,
  waitingMessage: null,
  error:          null,
};

// ── Slice ─────────────────────────────────────────────────────────────────────

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {

    // Connection
    setConnected: (state, action: PayloadAction<{ socketId: string }>) => {
      state.socketId = action.payload.socketId;
      state.status   = 'connecting';
      state.error    = null;
    },
    setDisconnected: (state) => {
      state.socketId = null;
      state.status   = 'idle';
    },

    // Matchmaking
    setSearching: (state, action: PayloadAction<{ message?: string }>) => {
      state.status         = 'searching';
      state.waitingMessage = action.payload.message ?? 'Looking for a partner...';
      state.error          = null;
    },
    setWaitingMessage: (state, action: PayloadAction<{ message: string }>) => {
      state.status         = 'waiting';
      state.waitingMessage = action.payload.message;
    },
    setPartnerFound: (
      state,
      action: PayloadAction<{
        partnerId:     string;
        partnerUserId: string;
        roomId:        string;
        isInitiator:   boolean;
        topic:         string;
      }>
    ) => {
      state.status      = 'partner_found';
      state.roomId      = action.payload.roomId;
      state.isInitiator = action.payload.isInitiator;
      state.topic       = action.payload.topic;
      state.partner     = {
        socketId: action.payload.partnerId,
        userId:   action.payload.partnerUserId,
      };
      state.waitingMessage = null;
    },
    setInSession: (state) => {
      state.status = 'in_session';
    },

    // Chat
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },

    // Debate arguments
    addArgument: (state, action: PayloadAction<Argument>) => {
      state.arguments.push(action.payload);
    },

    // Draw system
    setDrawOffered: (state) => {
      state.draw.offered = true;
    },
    setDrawReceived: (state) => {
      state.draw.received = true;
    },
    setDrawAccepted: (state) => {
      state.draw.accepted = true;
      state.draw.received = false;
      state.draw.offered  = false;
    },
    setDrawDeclined: (state) => {
      state.draw.declined = true;
      state.draw.offered  = false;
      state.draw.received = false;
    },

    // Session end
    setDebateEnded: (state, action: PayloadAction<DebateResult>) => {
      state.status       = 'ended';
      state.debateResult = action.payload;
    },
    setPartnerDisconnected: (state, action: PayloadAction<any>) => {
      state.status       = 'ended';
      state.debateResult = { reason: 'partner_disconnected', ...action.payload };
    },
    setPartnerSkipped: (state) => {
      state.partner    = null;
      state.roomId     = null;
      state.status     = 'searching';
      state.messages   = [];
      state.arguments  = [];
      state.draw       = { offered: false, received: false, accepted: false, declined: false };
    },

    // Error + reset
    setError: (state, action: PayloadAction<string>) => {
      state.status = 'error';
      state.error  = action.payload;
    },
    resetSession: () => initialState,
  },
});

export const {
  setConnected,
  setDisconnected,
  setSearching,
  setWaitingMessage,
  setPartnerFound,
  setInSession,
  addMessage,
  addArgument,
  setDrawOffered,
  setDrawReceived,
  setDrawAccepted,
  setDrawDeclined,
  setDebateEnded,
  setPartnerDisconnected,
  setPartnerSkipped,
  setError,
  resetSession,
} = sessionSlice.actions;

export default sessionSlice.reducer;