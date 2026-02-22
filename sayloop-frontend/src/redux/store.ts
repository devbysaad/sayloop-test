import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

// ── Reducers ──────────────────────────────────────────────────────────────────
import leaderboardReducer from './slice/leaderboard.slice';
import profileReducer     from './slice/profile.slice';
import sessionReducer     from './slice/session.slice';

// ── Sagas ─────────────────────────────────────────────────────────────────────
import { leaderboardSaga } from './saga/leaderboard.saga';
import { profileSaga }     from './saga/profile.saga';
import sessionSaga         from './saga/session.saga';

// ─────────────────────────────────────────────────────────────────────────────
// Root saga — combines all feature sagas
// ─────────────────────────────────────────────────────────────────────────────
function* rootSaga() {
  yield all([
    fork(leaderboardSaga),
    fork(profileSaga),
    fork(sessionSaga),
  ]);
}

// ─────────────────────────────────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────────────────────────────────
const sagaMiddleware = createSagaMiddleware();

// ─────────────────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────────────────
export const store = configureStore({
  reducer: {
    leaderboard: leaderboardReducer,
    profile:     profileReducer,
    session:     sessionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(sagaMiddleware),
  devTools: import.meta.env.MODE !== 'production',
});

// Run AFTER store is created
sagaMiddleware.run(rootSaga);

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;