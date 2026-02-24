import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface PartnerProfile {
  id: number;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  pfpSource: string | null;
  points: number;
  streakLength: number;
  level: 'Rookie' | 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  matchPercent: number;
}


export interface MatchRequest {
  matchId: number;
  partnerId: number;
  topic: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface PartnersState {
  // Available partners to swipe
  partners: PartnerProfile[];
  partnersLoading: boolean;
  partnersError: string | null;

  // Current topic filter
  currentTopic: string | null;

  // Swiped history
  passedIds: number[];
  connectedIds: number[];

  // Active match request
  matchRequest: MatchRequest | null;
  matchLoading: boolean;
  matchError: string | null;

  // Pagination
  page: number;
  hasMore: boolean;
}

const initialState: PartnersState = {
  partners: [],
  partnersLoading: false,
  partnersError: null,
  currentTopic: null,
  passedIds: [],
  connectedIds: [],
  matchRequest: null,
  matchLoading: false,
  matchError: null,
  page: 0,
  hasMore: true,
};

// ─── Slice ────────────────────────────────────────────────────────────────────
const partnersSlice = createSlice({
  name: 'partners',
  initialState,
  reducers: {
    // ── Fetch partners ──────────────────────────────────────────────────────
    fetchPartnersRequest(state, action: PayloadAction<{ topic: string; userId: number; page?: number }>) {
      state.partnersLoading = true;
      state.partnersError = null;
      state.currentTopic = action.payload.topic;
      if (!action.payload.page) {
        // Reset on fresh load
        state.partners = [];
        state.page = 0;
        state.passedIds = [];
        state.connectedIds = [];
      }
    },
    fetchPartnersSuccess(state, action: PayloadAction<{ partners: PartnerProfile[]; hasMore: boolean; page: number }>) {
      state.partnersLoading = false;
      state.partners = action.payload.page === 0
        ? action.payload.partners
        : [...state.partners, ...action.payload.partners];
      state.hasMore = action.payload.hasMore;
      state.page = action.payload.page;
    },
    fetchPartnersFailure(state, action: PayloadAction<string>) {
      state.partnersLoading = false;
      state.partnersError = action.payload;
    },

    // ── Swipe actions ───────────────────────────────────────────────────────
    passPartner(state, action: PayloadAction<number>) {
      state.passedIds.push(action.payload);
      state.partners = state.partners.filter(p => p.id !== action.payload);
    },
    connectPartner(state, action: PayloadAction<number>) {
      state.connectedIds.push(action.payload);
    },

    // ── Request match ───────────────────────────────────────────────────────
    requestMatchRequest(state, _action: PayloadAction<{ userId: number; partnerId: number; topic: string }>) {
      state.matchLoading = true;
      state.matchError = null;
      state.matchRequest = null;
    },
    requestMatchSuccess(state, action: PayloadAction<MatchRequest>) {
      state.matchLoading = false;
      state.matchRequest = action.payload;
    },
    requestMatchFailure(state, action: PayloadAction<string>) {
      state.matchLoading = false;
      state.matchError = action.payload;
    },

    // ── Cancel / reset ──────────────────────────────────────────────────────
    cancelMatch(state) {
      state.matchRequest = null;
      state.matchLoading = false;
      state.matchError = null;
    },
    resetPartners() {
      return initialState;
    },
  },
});

export const {
  fetchPartnersRequest,
  fetchPartnersSuccess,
  fetchPartnersFailure,
  passPartner,
  connectPartner,
  requestMatchRequest,
  requestMatchSuccess,
  requestMatchFailure,
  cancelMatch,
  resetPartners,
} = partnersSlice.actions;

export default partnersSlice.reducer;