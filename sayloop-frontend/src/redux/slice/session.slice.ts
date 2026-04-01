import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// ─── Types ────────────────────────────────────────────────────────────────────
export type SessionStatus =
  | 'idle'
  | 'searching'
  | 'matched'
  | 'in_session'
  | 'ended';

export type DrawState = 'none' | 'offered' | 'received';

export interface Partner {
  userId: number;
  socketId: string;
  username: string | null;
  firstName: string | null;
  pfpSource: string | null;
}

export interface ChatMessage {
  id: string;
  userId: number;
  message: string;
  isMe: boolean;
  timestamp: string;
}

export interface Argument {
  id: string;
  userId: number;
  argument: string;
  isMe: boolean;
  timestamp: string;
}

export interface SessionResult {
  outcome: 'resign' | 'draw' | 'opponent_disconnected' | 'time_up' | 'mic_inactive';
  winnerId: number | null;
  xpEarned: number;
  breakdown: string[];
  speakingTime?: number;
  sessionDuration?: number;
  sessionId?: string;
}

export interface XpPopup {
  id: string;
  amount: number;
  label: string;
}

interface SessionState {
  status: SessionStatus;
  sessionId: string | null;
  topic: string | null;
  partner: Partner | null;
  isInitiator: boolean;
  messages: ChatMessage[];
  arguments: Argument[];
  drawState: DrawState;
  debateResult: SessionResult | null;
  waitingMessage: string | null;
  error: string | null;

  // ── Timer ──────────────────────────────────────────────────────────────────
  timerSeconds: number | null;     // server-driven countdown (null = not started)

  // ── Mic anti-abuse ─────────────────────────────────────────────────────────
  micWarning: number | null;       // seconds until auto-resign (null = OK)

  // ── XP system ──────────────────────────────────────────────────────────────
  xpPopups: XpPopup[];             // transient popups (auto-dismissed)
  speakingSeconds: number;         // local tracker for UI feedback only

  // ── Emoji reactions ────────────────────────────────────────────────────────
  partnerEmoji: string | null;     // last emoji received from partner (transient)
}

const initialState: SessionState = {
  status: 'idle',
  sessionId: null,
  topic: null,
  partner: null,
  isInitiator: false,
  messages: [],
  arguments: [],
  drawState: 'none',
  debateResult: null,
  waitingMessage: null,
  error: null,
  timerSeconds: null,
  micWarning: null,
  xpPopups: [],
  speakingSeconds: 0,
  partnerEmoji: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────
const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {

    setSearching(state, action: PayloadAction<{ topic: string }>) {
      state.status = 'searching';
      state.topic = action.payload.topic;
      state.error = null;
      state.debateResult = null;
      state.timerSeconds = null;
      state.micWarning = null;
      state.xpPopups = [];
      state.speakingSeconds = 0;
    },

    setWaitingMessage(state, action: PayloadAction<string>) {
      state.waitingMessage = action.payload;
    },

    setMatched(state, action: PayloadAction<{
      sessionId: string;
      partner: Partner;
      isInitiator: boolean;
    }>) {
      state.status = 'matched';
      state.sessionId = action.payload.sessionId;
      state.partner = action.payload.partner;
      state.isInitiator = action.payload.isInitiator;
      state.waitingMessage = null;
    },

    setInSession(state) {
      state.status = 'in_session';
    },

    updatePartnerSocketId(state, action: PayloadAction<string>) {
      if (state.partner) {
        state.partner.socketId = action.payload;
      }
    },

    receiveMessage(state, action: PayloadAction<{
      userId: number;
      message: string;
      isMe: boolean;
      timestamp: string;
    }>) {
      state.messages.push({
        id: `${Date.now()}-${Math.random()}`,
        ...action.payload,
      });
    },

    receiveArgument(state, action: PayloadAction<{
      userId: number;
      argument: string;
      isMe: boolean;
      timestamp: string;
    }>) {
      state.arguments.push({
        id: `${Date.now()}-${Math.random()}`,
        ...action.payload,
      });
    },

    setDrawOffered(state) { state.drawState = 'offered'; },
    setDrawReceived(state) { state.drawState = 'received'; },
    setDrawNone(state) { state.drawState = 'none'; },

    setResult(state, action: PayloadAction<SessionResult>) {
      state.status = 'ended';
      state.debateResult = action.payload;
      state.drawState = 'none';
      state.timerSeconds = null;
      state.micWarning = null;
    },

    setSessionError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.status = 'idle';
    },

    // ── Timer ────────────────────────────────────────────────────────────────
    setTimer(state, action: PayloadAction<number>) {
      state.timerSeconds = action.payload;
    },

    // ── Mic warning ──────────────────────────────────────────────────────────
    setMicWarning(state, action: PayloadAction<number>) {
      state.micWarning = action.payload;
    },

    clearMicWarning(state) {
      state.micWarning = null;
    },

    // ── XP popups ────────────────────────────────────────────────────────────
    addXpPopup(state, action: PayloadAction<{ amount: number; label: string }>) {
      state.xpPopups.push({
        id: `${Date.now()}-${Math.random()}`,
        ...action.payload,
      });
      // Keep max 5 popups at a time
      if (state.xpPopups.length > 5) state.xpPopups.shift();
    },

    removeXpPopup(state, action: PayloadAction<string>) {
      state.xpPopups = state.xpPopups.filter(p => p.id !== action.payload);
    },

    // ── Speaking tracker (UI feedback only) ──────────────────────────────────
    tickSpeaking(state) {
      state.speakingSeconds += 1;
    },

    // ── Emoji reactions ───────────────────────────────────────────────────────
    setPartnerEmoji(state, action: PayloadAction<string | null>) {
      state.partnerEmoji = action.payload;
    },

    resetSession() {
      return initialState;
    },
  },
});

export const {
  setSearching,
  setWaitingMessage,
  setMatched,
  setInSession,
  updatePartnerSocketId,
  receiveMessage,
  receiveArgument,
  setDrawOffered,
  setDrawReceived,
  setDrawNone,
  setResult,
  setSessionError,
  setTimer,
  setMicWarning,
  clearMicWarning,
  addXpPopup,
  removeXpPopup,
  tickSpeaking,
  setPartnerEmoji,
  resetSession,
} = sessionSlice.actions;

export default sessionSlice.reducer;