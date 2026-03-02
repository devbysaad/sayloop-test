import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import profileService from '../service/profile.service';
import {
  fetchProfileStatsRequest,
  fetchProfileStatsSuccess,
  fetchProfileStatsFailure,
} from '../slice/profile.slice';
import type { ProfileStats } from '../slice/profile.slice';

// ─── Worker ───────────────────────────────────────────────────────────────────
function* handleFetchProfileStats(
  action: PayloadAction<{ userId: number }>,
): Generator {
  try {
    // profileService.fetchProfileStats already unwraps response.data.data
    const data = (yield call(
      profileService.fetchProfileStats,
      action.payload.userId,
    )) as ProfileStats;

    yield put(fetchProfileStatsSuccess(data));
  } catch (err: any) {
    const message =
      err?.response?.data?.message ?? err?.message ?? 'Failed to load profile';
    yield put(fetchProfileStatsFailure(message));
  }
}

// ─── Watcher ──────────────────────────────────────────────────────────────────
export function* profileSaga() {
  yield takeLatest(fetchProfileStatsRequest.type, handleFetchProfileStats);
}