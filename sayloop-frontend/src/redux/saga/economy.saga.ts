import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import axiosInstance from '../../lib/axiosInstance';
import {
  setEconomySummary,
  applyEconomyUpdate,
  setLoading,
  setError,
  FETCH_ECONOMY,
  SPEND_GEMS_ACTION,
} from '../slice/economy.slice';

// ── Fetch economy summary ────────────────────────────────────────────────────

function* handleFetchEconomy(): Generator<any, void, any> {
  yield put(setLoading(true));
  try {
    const response = yield call([axiosInstance, 'get'], '/api/economy/summary');
    const data = response.data?.data;
    if (data) {
      yield put(setEconomySummary({
        xp:               data.xp,
        gems:             data.gems,
        level:            data.level,
        levelTitle:       data.levelTitle,
        streak:           data.streak,
        totalMatches:     data.totalMatches,
        totalWins:        data.totalWins,
        totalDraws:       data.totalDraws,
        totalResigns:     data.totalResigns,
        xpThisWeek:       data.xpThisWeek,
        nextLevelProgress: data.nextLevelProgress,
        transactions:     data.recentTransactions ?? [],
      }));
    }
  } catch (err: any) {
    const msg = err?.response?.data?.message ?? 'Failed to load economy data';
    yield put(setError(msg));
    console.error('[economySaga] fetchEconomy error:', msg);
  }
}

// ── Spend gems ───────────────────────────────────────────────────────────────

function* handleSpendGems(action: { type: string; payload: { itemId: string; cost: number } }): Generator<any, void, any> {
  try {
    const { cost } = action.payload;
    const response = yield call([axiosInstance, 'post'], '/api/economy/spend-gems', { cost });
    const newGems: number = response.data?.data?.newGems ?? 0;
    // Refresh summary to get full state after purchase
    yield put({ type: FETCH_ECONOMY });
    console.log('[economySaga] Spent gems. New total:', newGems);
  } catch (err: any) {
    const msg = err?.response?.data?.message ?? 'Failed to spend gems';
    yield put(setError(msg));
    console.error('[economySaga] spendGems error:', msg);
  }
}

// ── Root economy saga ─────────────────────────────────────────────────────────

export function* economySaga() {
  yield takeLatest(FETCH_ECONOMY, handleFetchEconomy);
  yield takeEvery(SPEND_GEMS_ACTION, handleSpendGems);
}
