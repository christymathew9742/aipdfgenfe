import {
    FETCH_BOT_REQUEST,
    FETCH_BOT_SUCCESS,
    FETCH_BOT_FAILURE,
    POST_BOT_REQUEST,
    POST_BOT_SUCCESS,
    POST_BOT_FAILURE,
    FETCH_REYAL_TIME_BOT,
} from './actionTypes';
  
import { botActions, botState } from './types';
  
const initialState: botState = {
    pending: false,
    bot: [],
    error: null,
    webSocketStatus: 'disconnected',
};
  
export default (state = initialState, action: botActions) => {
    switch (action.type) {
    // Fetch ChatBot
    case FETCH_BOT_REQUEST:
        return {
            ...state,
            pending: true,
        };
    case FETCH_BOT_SUCCESS:
        return {
            ...state,
            pending: false,
            bot: action.payload.bot,
            error: null,
        };
    case FETCH_BOT_FAILURE:
        return {
            ...state,
            pending: false,
            bot: [],
            error: action.payload.error,
        };
  
    // Post ChatBot
    case POST_BOT_REQUEST:
        return {
            ...state,
            pending: true,
            botResponse: null,
        };
    case POST_BOT_SUCCESS:
        return {
            ...state,
            pending: false,
            botResponse: action.payload,
            bot: null,
            error: null,
        };
    case POST_BOT_FAILURE:
        return {
            ...state,
            pending: false,
            botResponse: null,
            error: action.payload.error,
        };
  
    // Post fetch ChatBot
    case FETCH_REYAL_TIME_BOT:
        return {
            ...state,
            pending: true,
            botResponse: null,
        };
  
    default:
        return state;
    }
};
  