import { call, put, takeLatest, all } from 'redux-saga/effects';
import { profileApi } from '../service/leaderboard.service';
import {
  fetchPublicProfileRequest,
  fetchPublicProfileSuccess,
  fetchPublicProfileFailure,
  fetchProfileStatsRequest,
  fetchProfileStatsSuccess,
  fetchProfileStatsFailure,
  searchProfilesRequest,
  searchProfilesSuccess,
  searchProfilesFailure,
} from '../slice/profile.slice';

// ── Workers ───────────────────────────────────────────────────────────────────

function* handleFetchPublicProfile(
  action: ReturnType<typeof fetchPublicProfileRequest>
): Generator {
  try {
    const data: any = yield call(profileApi.getPublicProfile, action.payload.userId);
    yield put(fetchPublicProfileSuccess(data));
  } catch (err: any) {
    yield put(fetchPublicProfileFailure(err.message || 'Failed to fetch profile'));
  }
}

function* handleFetchProfileStats(
  action: ReturnType<typeof fetchProfileStatsRequest>
): Generator {
  try {
    const data: any = yield call(profileApi.getStats, action.payload.userId);
    yield put(fetchProfileStatsSuccess(data));
  } catch (err: any) {
    yield put(fetchProfileStatsFailure(err.message || 'Failed to fetch stats'));
  }
}

function* handleSearchProfiles(
  action: ReturnType<typeof searchProfilesRequest>
): Generator {
  try {
    const data: any = yield call(profileApi.search, action.payload.query);
    yield put(searchProfilesSuccess(data));
  } catch (err: any) {
    yield put(searchProfilesFailure(err.message || 'Search failed'));
  }
}

// ── Watchers ──────────────────────────────────────────────────────────────────

export function* profileSaga(): Generator {
  yield all([
    takeLatest(fetchPublicProfileRequest.type, handleFetchPublicProfile),
    takeLatest(fetchProfileStatsRequest.type,  handleFetchProfileStats),
    takeLatest(searchProfilesRequest.type,     handleSearchProfiles),
  ]);
}