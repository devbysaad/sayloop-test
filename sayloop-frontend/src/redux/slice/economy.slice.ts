import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface XPTransaction {
  id: number;
  amount: number;
  reason: string;
  matchId: number | null;
  createdAt: string;
}

export interface NextLevelProgress {
  nextLevelXP: number;
  currentLevelXP: number;
  progress: number; // 0-1
}

export interface PendingReward {
  xpChange: number;
  gemsEarned: number;
  reason: string;
  newStreak: number;
  levelledUp: boolean;
  newLevel: number;
}

export interface EconomyState {
  xp: number;
  gems: number;
  level: number;
  levelTitle: string;
  streak: number;
  totalMatches: number;
  totalWins: number;
  totalDraws: number;
  totalResigns: number;
  xpThisWeek: number;
  nextLevelProgress: NextLevelProgress | null;
  levelledUp: boolean;          // true = show LevelUpModal
  pendingReward: PendingReward | null; // shown in ResultScreen
  transactions: XPTransaction[];
  loading: boolean;
  error: string | null;
}

const initialState: EconomyState = {
  xp: 0,
  gems: 0,
  level: 1,
  levelTitle: 'Newbie',
  streak: 0,
  totalMatches: 0,
  totalWins: 0,
  totalDraws: 0,
  totalResigns: 0,
  xpThisWeek: 0,
  nextLevelProgress: null,
  levelledUp: false,
  pendingReward: null,
  transactions: [],
  loading: false,
  error: null,
};

const economySlice = createSlice({
  name: 'economy',
  initialState,
  reducers: {
    /** Full refresh from GET /api/economy/summary */
    setEconomySummary(state, action: PayloadAction<Partial<EconomyState>>) {
      const s = action.payload;
      if (s.xp          !== undefined) state.xp          = s.xp;
      if (s.gems        !== undefined) state.gems        = s.gems;
      if (s.level       !== undefined) state.level       = s.level;
      if (s.levelTitle  !== undefined) state.levelTitle  = s.levelTitle;
      if (s.streak      !== undefined) state.streak      = s.streak;
      if (s.totalMatches !== undefined) state.totalMatches = s.totalMatches;
      if (s.totalWins   !== undefined) state.totalWins   = s.totalWins;
      if (s.totalDraws  !== undefined) state.totalDraws  = s.totalDraws;
      if (s.totalResigns !== undefined) state.totalResigns = s.totalResigns;
      if (s.xpThisWeek  !== undefined) state.xpThisWeek  = s.xpThisWeek;
      if (s.nextLevelProgress !== undefined) state.nextLevelProgress = s.nextLevelProgress ?? null;
      if (s.transactions !== undefined) state.transactions = s.transactions;
      state.loading = false;
      state.error = null;
    },

    /** Live update from socket economy:update event */
    applyEconomyUpdate(state, action: PayloadAction<{
      xpChange: number;
      newXP: number;
      newGems: number;
      newLevel: number;
      newStreak: number;
      levelledUp: boolean;
      gemsEarned: number;
      reason: string;
    }>) {
      const d = action.payload;
      state.xp      = d.newXP;
      state.gems    = d.newGems;
      state.level   = d.newLevel;
      state.streak  = d.newStreak;
      state.xpThisWeek += Math.max(0, d.xpChange);

      if (d.levelledUp) {
        state.levelledUp = true;
      }

      state.pendingReward = {
        xpChange:   d.xpChange,
        gemsEarned: d.gemsEarned,
        reason:     d.reason,
        newStreak:  d.newStreak,
        levelledUp: d.levelledUp,
        newLevel:   d.newLevel,
      };
    },

    /** Dismiss LevelUpModal */
    clearLevelUp(state) {
      state.levelledUp = false;
    },

    /** Dismiss ResultScreen reward display */
    clearPendingReward(state) {
      state.pendingReward = null;
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setEconomySummary,
  applyEconomyUpdate,
  clearLevelUp,
  clearPendingReward,
  setLoading,
  setError,
} = economySlice.actions;

// Action type constants for sagas
export const FETCH_ECONOMY    = 'economy/fetchSummary';
export const SPEND_GEMS_ACTION = 'economy/spendGems';

export default economySlice.reducer;
