import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ProfileStats {
  userId: number;
  points: number;
  streakLength: number;
  rank: number;
  accuracy: number;
  lessonsCompleted: number;
  totalExercises: number;
  correctAnswers: number;
  debatesWon: number;
  debatesTotal: number;
}

interface ProfileState {
  profileStats: ProfileStats | null;
  profileLoading: boolean;
  profileError: string | null;
}

const initialState: ProfileState = {
  profileStats: null,
  profileLoading: false,
  profileError: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    fetchProfileStatsRequest(state, _action: PayloadAction<{ userId: number }>) {
      state.profileLoading = true;
      state.profileError = null;
    },

    // data is already unwrapped by profileService — store directly
    fetchProfileStatsSuccess(state, action: PayloadAction<ProfileStats>) {
      state.profileLoading = false;
      state.profileStats = action.payload;
    },

    fetchProfileStatsFailure(state, action: PayloadAction<string>) {
      state.profileLoading = false;
      state.profileError = action.payload;
    },

    resetProfile() {
      return initialState;
    },
  },
});

export const {
  fetchProfileStatsRequest,
  fetchProfileStatsSuccess,
  fetchProfileStatsFailure,
  resetProfile,
} = profileSlice.actions;

export default profileSlice.reducer;