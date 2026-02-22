import { call, put, takeLatest, all } from 'redux-saga/effects';
import { leaderboardApi } from '../service/leaderboard.service';
import {
  fetchLeaderboardRequest,
  fetchLeaderboardSuccess,
  fetchLeaderboardFailure,
  fetchUserRankRequest,
  fetchUserRankSuccess,
} from '../slice/leaderboard.slice';

// ── Workers ───────────────────────────────────────────────────────────────────

function* handleFetchLeaderboard(
  action: ReturnType<typeof fetchLeaderboardRequest>
): Generator {
  try {
    const { page, limit } = action.payload;
    const data: any = yield call(leaderboardApi.getPaginated, page, limit);
    yield put(fetchLeaderboardSuccess(data));
  } catch (err: any) {
    yield put(fetchLeaderboardFailure(err.message || 'Failed to fetch leaderboard'));
  }
}

function* handleFetchUserRank(
  action: ReturnType<typeof fetchUserRankRequest>
): Generator {
  try {
    const data: any = yield call(leaderboardApi.getUserRank, action.payload.userId);
    yield put(fetchUserRankSuccess(data));
  } catch {
    // Fail silently — rank is secondary data
  }
}

// ── Watchers ──────────────────────────────────────────────────────────────────

export function* leaderboardSaga(): Generator {
  yield all([
    takeLatest(fetchLeaderboardRequest.type, handleFetchLeaderboard),
    takeLatest(fetchUserRankRequest.type,    handleFetchUserRank),
  ]);
}