import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ProfileStats {
  points:           number;
  streakLength:     number;
  rank:             number;
  league:           string;
  lessonsCompleted: number;
  totalExercises:   number;
  correctAnswers:   number;
  accuracy:         number;
}

export interface PublicProfile {
  id:               number;
  username:         string;
  firstName:        string | null;
  lastName:         string | null;
  pfpSource:        string | null;
  points:           number;
  streakLength:     number;
  createdAt:        string;
  league:           string;
  lessonsCompleted: number;
  following:        number;
  followers:        number;
}

export interface SearchResult {
  id:           number;
  username:     string;
  firstName:    string | null;
  lastName:     string | null;
  pfpSource:    string | null;
  points:       number;
  streakLength: number;
}

interface ProfileState {
  publicProfile:  PublicProfile | null;
  profileStats:   ProfileStats | null;
  searchResults:  SearchResult[];
  profileLoading: boolean;
  profileError:   string | null;
}

const initialState: ProfileState = {
  publicProfile:  null,
  profileStats:   null,
  searchResults:  [],
  profileLoading: false,
  profileError:   null,
};

// ── Slice ─────────────────────────────────────────────────────────────────────

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Request (triggers saga)
    fetchPublicProfileRequest: (state, _action: PayloadAction<{ userId: number }>) => {
      state.profileLoading = true;
      state.profileError   = null;
    },
    fetchProfileStatsRequest: (state, _action: PayloadAction<{ userId: number }>) => {
      state.profileLoading = true;
      state.profileError   = null;
    },
    searchProfilesRequest: (state, _action: PayloadAction<{ query: string }>) => {
      state.profileLoading = true;
      state.profileError   = null;
    },

    // Success
    fetchPublicProfileSuccess: (state, action: PayloadAction<PublicProfile>) => {
      state.publicProfile  = action.payload;
      state.profileLoading = false;
    },
    fetchProfileStatsSuccess: (state, action: PayloadAction<ProfileStats>) => {
      state.profileStats   = action.payload;
      state.profileLoading = false;
    },
    searchProfilesSuccess: (state, action: PayloadAction<SearchResult[]>) => {
      state.searchResults  = action.payload;
      state.profileLoading = false;
    },

    // Failure
    fetchPublicProfileFailure: (state, action: PayloadAction<string>) => {
      state.profileLoading = false;
      state.profileError   = action.payload;
    },
    fetchProfileStatsFailure: (state, action: PayloadAction<string>) => {
      state.profileLoading = false;
      state.profileError   = action.payload;
    },
    searchProfilesFailure: (state, action: PayloadAction<string>) => {
      state.profileLoading = false;
      state.profileError   = action.payload;
    },

    // Reset
    clearProfile: (state) => {
      state.publicProfile  = null;
      state.profileStats   = null;
      state.searchResults  = [];
      state.profileError   = null;
    },
  },
});

export const {
  fetchPublicProfileRequest,
  fetchProfileStatsRequest,
  searchProfilesRequest,
  fetchPublicProfileSuccess,
  fetchProfileStatsSuccess,
  searchProfilesSuccess,
  fetchPublicProfileFailure,
  fetchProfileStatsFailure,
  searchProfilesFailure,
  clearProfile,
} = profileSlice.actions;

export default profileSlice.reducer;