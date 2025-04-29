import api from '../../../utils/axios';
import { all, call, put, takeLatest, fork, take, delay } from 'redux-saga/effects';

import {
    POST_BOT_REQUEST,
    FETCH_REYAL_TIME_BOT,
} from './actionTypes';

import {
    fetchBotSuccess,
    fetchBotFailure,
    postBotSuccess,
    postBotFailure,
} from './actions';

const createChatBot = (body: any) => api.post<any[]>(`/api/chatbot/`, body);

// Fetch reyal time data
function* fetchReyalTimedataSaga(data: any): any {
    const { payload } = data;
    try {
        yield put(fetchBotSuccess({ bot: payload }));
    } catch (e: any) {
        yield put(fetchBotFailure({ error: e.message }));
    }
}

// Post ChatBot
function* postBotSaga(data: any): any {
    const { payload } = data;
    try {
        const response: any = yield call(createChatBot, payload);
        yield put(postBotSuccess({ bot: response.data }));
        yield call(fetchReyalTimedataSaga, { payload: response.data });
    } catch (e: any) {
        yield put(postBotFailure({ error: e.message }));
    }
}

function* BotSaga() {
    yield all([
        takeLatest(POST_BOT_REQUEST, postBotSaga),
        takeLatest(FETCH_REYAL_TIME_BOT, fetchReyalTimedataSaga),
    ]);
}

export default BotSaga;







