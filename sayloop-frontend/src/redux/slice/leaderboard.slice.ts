import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank:         number;
  id:           number;
  username:     string;
  firstName:    string | null;
  lastName:     string | null;
  pfpSource:    string | null;
  points:       number;
  streakLength: number;
}

export interface LeaderboardData {
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
  data:       LeaderboardEntry[];
}

export interface UserRank {
  rank:         number;
  id:           number;
  username:     string;
  points:       number;
  streakLength: number;
  pfpSource:    string | null;
}

interface LeaderboardState {
  leaderboard:        LeaderboardData | null;
  topLeaderboard:     LeaderboardEntry[];
  userRank:           UserRank | null;
  leaderboardLoading: boolean;
  leaderboardError:   string | null;
}

const initialState: LeaderboardState = {
  leaderboard:        null,
  topLeaderboard:     [],
  userRank:           null,
  leaderboardLoading: false,
  leaderboardError:   null,
};

// ── Slice ─────────────────────────────────────────────────────────────────────

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    fetchLeaderboardRequest: (state, _action: PayloadAction<{ page: number; limit: number }>) => {
      state.leaderboardLoading = true;
      state.leaderboardError   = null;
    },
    fetchLeaderboardSuccess: (state, action: PayloadAction<LeaderboardData>) => {
      state.leaderboard        = action.payload;
      state.leaderboardLoading = false;
    },
    fetchTopLeaderboardSuccess: (state, action: PayloadAction<LeaderboardEntry[]>) => {
      state.topLeaderboard = action.payload;
    },
    fetchUserRankRequest: (state, _action: PayloadAction<{ userId: number }>) => {
      // silent — no loading spinner for rank
    },
    fetchUserRankSuccess: (state, action: PayloadAction<UserRank>) => {
      state.userRank = action.payload;
    },
    fetchLeaderboardFailure: (state, action: PayloadAction<string>) => {
      state.leaderboardLoading = false;
      state.leaderboardError   = action.payload;
    },
    clearLeaderboard: (state) => {
      state.leaderboard        = null;
      state.topLeaderboard     = [];
      state.userRank           = null;
      state.leaderboardError   = null;
    },
  },
});

export const {
  fetchLeaderboardRequest,
  fetchLeaderboardSuccess,
  fetchTopLeaderboardSuccess,
  fetchUserRankRequest,
  fetchUserRankSuccess,
  fetchLeaderboardFailure,
  clearLeaderboard,
} = leaderboardSlice.actions;

export default leaderboardSlice.reducer;