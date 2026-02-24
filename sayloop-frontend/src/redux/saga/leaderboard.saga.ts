import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import leaderboardService from '../service/leaderboard.service';
import {
  fetchLeaderboardRequest,
  fetchLeaderboardSuccess,
  fetchLeaderboardFailure,
  fetchUserRankRequest,
  fetchUserRankSuccess,
  fetchUserRankFailure,
} from '../slice/leaderboard.slice';

// ─── Workers ──────────────────────────────────────────────────────────────────

function* handleFetchLeaderboard(
  action: PayloadAction<{ page: number; limit: number }>,
): Generator {
  try {
    const data: any = yield call(
      leaderboardService.fetchLeaderboard,
      action.payload.page,
      action.payload.limit,
    );
    yield put(fetchLeaderboardSuccess(data));
  } catch (err: any) {
    const message =
      err?.response?.data?.message ?? err?.message ?? 'Failed to load leaderboard';
    yield put(fetchLeaderboardFailure(message));
  }
}

function* handleFetchUserRank(
  action: PayloadAction<{ userId: number }>,
): Generator {
  try {
    const data: any = yield call(
      leaderboardService.fetchUserRank,
      action.payload.userId,
    );
    yield put(fetchUserRankSuccess(data));
  } catch (err: any) {
    const message =
      err?.response?.data?.message ?? err?.message ?? 'Failed to load your rank';
    yield put(fetchUserRankFailure(message));
  }
}

// ─── Watcher ──────────────────────────────────────────────────────────────────
export function* leaderboardSaga() {
  yield takeLatest(fetchLeaderboardRequest.type, handleFetchLeaderboard);
  yield takeLatest(fetchUserRankRequest.type, handleFetchUserRank);
}