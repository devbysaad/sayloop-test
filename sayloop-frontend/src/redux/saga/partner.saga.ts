import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import partnersService from '../service/partner.service';
import {
  fetchPartnersRequest,
  fetchPartnersSuccess,
  fetchPartnersFailure,
  requestMatchRequest,
  requestMatchSuccess,
  requestMatchFailure,
  connectPartner,
} from '../slice/partner.slice';

// ─── Workers ──────────────────────────────────────────────────────────────────

function* handleFetchPartners(
  action: PayloadAction<{ topic: string; userId: number; page?: number }>,
): Generator {
  try {
    const { topic, page = 0 } = action.payload;
    // BUG FIXED: removed userId from service call — backend uses req.dbUserId from auth token
    const response: any = yield call(partnersService.fetchPartners, {
      topic,
      page,
      limit: 10,
    });

    // Backend wraps in { success, data } — unwrap here
    const data = response.data ?? response;

    yield put(
      fetchPartnersSuccess({
        partners: data.partners,
        hasMore: data.hasMore,
        page: data.page,
      }),
    );
  } catch (err: any) {
    const message = err?.response?.data?.message ?? err?.message ?? 'Failed to load partners';
    yield put(fetchPartnersFailure(message));
  }
}

function* handleRequestMatch(
  action: PayloadAction<{ userId: number; partnerId: number; topic: string }>,
): Generator {
  try {
    const response: any = yield call(partnersService.requestMatch, action.payload);
    const data = response.data ?? response;

    yield put(
      requestMatchSuccess({
        matchId: data.matchId,
        partnerId: data.partnerId,
        topic: data.topic,
        status: data.status,
      }),
    );
    yield put(connectPartner(action.payload.partnerId));
  } catch (err: any) {
    const message = err?.response?.data?.message ?? err?.message ?? 'Failed to request match';
    yield put(requestMatchFailure(message));
  }
}

// ─── Watcher ──────────────────────────────────────────────────────────────────
export function* partnersSaga() {
  yield takeLatest(fetchPartnersRequest.type, handleFetchPartners);
  yield takeLatest(requestMatchRequest.type, handleRequestMatch);
}