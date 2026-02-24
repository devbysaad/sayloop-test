import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface LeaderboardEntry {
  id: number;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  pfpSource: string | null;
  points: number;
  streakLength: number;
  rank: number;
}

export interface UserRank {
  // BUG FIXED: had a stray `z` on a blank line here — caused TypeScript compile error
  userId: number;
  rank: number;
  points: number;
  streakLength: number;
}

interface PaginatedLeaderboard {
  data: LeaderboardEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface LeaderboardState {
  leaderboard: PaginatedLeaderboard | null;
  userRank: UserRank | null;
  leaderboardLoading: boolean;
  leaderboardError: string | null;
  rankLoading: boolean;
  rankError: string | null;
}

const initialState: LeaderboardState = {
  leaderboard: null,
  userRank: null,
  leaderboardLoading: false,
  leaderboardError: null,
  rankLoading: false,
  rankError: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────
const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    fetchLeaderboardRequest(state, _action: PayloadAction<{ page: number; limit: number }>) {
      state.leaderboardLoading = true;
      state.leaderboardError = null;
    },
    fetchLeaderboardSuccess(state, action: PayloadAction<PaginatedLeaderboard>) {
      state.leaderboardLoading = false;
      state.leaderboard = action.payload;
    },
    fetchLeaderboardFailure(state, action: PayloadAction<string>) {
      state.leaderboardLoading = false;
      state.leaderboardError = action.payload;
    },

    fetchUserRankRequest(state, _action: PayloadAction<{ userId: number }>) {
      state.rankLoading = true;
      state.rankError = null;
    },
    fetchUserRankSuccess(state, action: PayloadAction<UserRank>) {
      state.rankLoading = false;
      state.userRank = action.payload;
    },
    fetchUserRankFailure(state, action: PayloadAction<string>) {
      state.rankLoading = false;
      state.rankError = action.payload;
    },

    resetLeaderboard() {
      return initialState;
    },
  },
});

export const {
  fetchLeaderboardRequest,
  fetchLeaderboardSuccess,
  fetchLeaderboardFailure,
  fetchUserRankRequest,
  fetchUserRankSuccess,
  fetchUserRankFailure,
  resetLeaderboard,
} = leaderboardSlice.actions;

export default leaderboardSlice.reducer;