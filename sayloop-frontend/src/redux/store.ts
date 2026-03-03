import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

// ── Reducers ────────────────────────────────────────────────────────────────
import leaderboardReducer from './slice/leaderboard.slice';
import profileReducer from './slice/profile.slice';
import sessionReducer from './slice/session.slice';
import partnersReducer from './slice/partner.slice';
import matchReducer from './slice/match.slice'; // ← added

// ── Sagas ───────────────────────────────────────────────────────────────────
import { leaderboardSaga } from './saga/leaderboard.saga';
import { profileSaga } from './saga/profile.saga';
import sessionSaga from './saga/session.saga';
import { partnersSaga } from './saga/partner.saga';
import matchSaga from './saga/match.saga'; // ← added

// ────────────────────────────────────────────────────────────────────────────
// Root saga
// ────────────────────────────────────────────────────────────────────────────
function* rootSaga() {
  yield all([
    fork(leaderboardSaga),
    fork(profileSaga),
    fork(sessionSaga),
    fork(partnersSaga),
    fork(matchSaga), // ← added
  ]);
}

// ────────────────────────────────────────────────────────────────────────────
// Middleware
// ────────────────────────────────────────────────────────────────────────────
const sagaMiddleware = createSagaMiddleware();

// ────────────────────────────────────────────────────────────────────────────
// Store
// ────────────────────────────────────────────────────────────────────────────
export const store = configureStore({
  reducer: {
    leaderboard: leaderboardReducer,
    profile: profileReducer,
    session: sessionReducer,
    partners: partnersReducer,
    match: matchReducer, // ← added
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(sagaMiddleware),
  devTools: import.meta.env.MODE !== 'production',
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;