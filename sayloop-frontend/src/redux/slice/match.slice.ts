import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Match, MatchUser } from '../../lib/matchApi';

// ─── Types ────────────────────────────────────────────────────────────────────
export type MatchMode = 'browse' | 'waiting' | 'matched' | 'confirmed';

interface Toast {
  msg: string;
  type: 'success' | 'error';
}

interface MatchState {
  // Browse tab
  users: MatchUser[];
  usersLoading: boolean;
  cardIdx: number;

  // Sending a request (User 1)
  mode: MatchMode;
  pendingMatchId: number | null;
  pendingPartner: MatchUser | null;
  pendingTopic: string;

  // After both sides ready
  matchedMatchId: number | null;
  matchedSessionId: string;
  matchedPartner: MatchUser | null;
  matchedTopic: string;

  // Incoming requests tab (User 2)
  requests: Match[];
  requestsLoading: boolean;
  pendingRequestCount: number;

  // History tab
  history: Match[];
  historyLoading: boolean;

  // Global notification — fires for User 2 anywhere in the app (via socket)
  notification: Match | null;

  // UI
  toast: Toast | null;
  error: string | null;
}

const initialState: MatchState = {
  users: [],
  usersLoading: false,
  cardIdx: 0,

  mode: 'browse',
  pendingMatchId: null,
  pendingPartner: null,
  pendingTopic: '',

  matchedMatchId: null,
  matchedSessionId: '',
  matchedPartner: null,
  matchedTopic: '',

  requests: [],
  requestsLoading: false,
  pendingRequestCount: 0,

  history: [],
  historyLoading: false,

  notification: null,
  toast: null,
  error: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────
const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {

    // ── Browse ──────────────────────────────────────────────────────────────
    setUsersLoading(state, action: PayloadAction<boolean>) {
      state.usersLoading = action.payload;
    },
    setUsers(state, action: PayloadAction<MatchUser[]>) {
      state.users = action.payload;
      state.usersLoading = false;
    },
    nextCard(state) {
      state.cardIdx = Math.min(state.cardIdx + 1, state.users.length);
    },
    resetCards(state) {
      state.cardIdx = 0;
    },

    // ── Sending request (User 1) ────────────────────────────────────────────
    setWaiting(state, action: PayloadAction<{
      matchId: number;
      partner: MatchUser;
      topic: string;
    }>) {
      state.mode = 'waiting';
      state.pendingMatchId = action.payload.matchId;
      state.pendingPartner = action.payload.partner;
      state.pendingTopic = action.payload.topic;
    },
    setMatched(state, action: PayloadAction<{
      matchId: number;
      sessionId: string;
      partner: MatchUser;
      topic: string;
    }>) {
      state.mode = 'matched';
      state.matchedMatchId = action.payload.matchId;
      state.matchedSessionId = action.payload.sessionId;
      state.matchedPartner = action.payload.partner;
      state.matchedTopic = action.payload.topic;
      // clear waiting state
      state.pendingMatchId = null;
      state.pendingPartner = null;
      state.pendingTopic = '';
    },
    setConfirmed(state, action: PayloadAction<{
      sessionId: string;
      matchId: number;
    }>) {
      state.mode = 'confirmed';
      state.matchedSessionId = action.payload.sessionId;
      state.matchedMatchId = action.payload.matchId;
    },
    cancelWaiting(state) {
      state.mode = 'browse';
      state.pendingMatchId = null;
      state.pendingPartner = null;
      state.pendingTopic = '';
    },
    clearMatched(state) {
      state.mode = 'browse';
      state.matchedMatchId = null;
      state.matchedSessionId = '';
      state.matchedPartner = null;
      state.matchedTopic = '';
    },

    // ── Requests (User 2) ───────────────────────────────────────────────────
    setRequestsLoading(state, action: PayloadAction<boolean>) {
      state.requestsLoading = action.payload;
    },
    setRequests(state, action: PayloadAction<Match[]>) {
      state.requests = action.payload;
      state.pendingRequestCount = action.payload.length;
      state.requestsLoading = false;
    },
    removeRequest(state, action: PayloadAction<number>) {
      state.requests = state.requests.filter(r => r.id !== action.payload);
      state.pendingRequestCount = Math.max(0, state.pendingRequestCount - 1);
    },
    setPendingRequestCount(state, action: PayloadAction<number>) {
      state.pendingRequestCount = action.payload;
    },

    // ── History ─────────────────────────────────────────────────────────────
    setHistoryLoading(state, action: PayloadAction<boolean>) {
      state.historyLoading = action.payload;
    },
    setHistory(state, action: PayloadAction<Match[]>) {
      state.history = action.payload;
      state.historyLoading = false;
    },

    // ── Global notification (User 2 via socket) ─────────────────────────────
    setNotification(state, action: PayloadAction<Match>) {
      state.notification = action.payload;
    },
    clearNotification(state) {
      state.notification = null;
    },

    // ── UI helpers ──────────────────────────────────────────────────────────
    showToast(state, action: PayloadAction<Toast>) {
      state.toast = action.payload;
    },
    clearToast(state) {
      state.toast = null;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setUsersLoading, setUsers, nextCard, resetCards,
  setWaiting, setMatched, setConfirmed, cancelWaiting, clearMatched,
  setRequestsLoading, setRequests, removeRequest, setPendingRequestCount,
  setHistoryLoading, setHistory,
  setNotification, clearNotification,
  showToast, clearToast, setError,
} = matchSlice.actions;

export default matchSlice.reducer;