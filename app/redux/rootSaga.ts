import { all, fork } from 'redux-saga/effects';
import BotSaga from './reducers/chatBot/sagas';

export function* rootSaga() {
    yield all([fork(BotSaga)]);
}