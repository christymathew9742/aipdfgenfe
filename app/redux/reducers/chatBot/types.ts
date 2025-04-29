import {
    FETCH_BOT_REQUEST,
    FETCH_BOT_SUCCESS,
    FETCH_BOT_FAILURE,
    POST_BOT_REQUEST,
    POST_BOT_SUCCESS,
    POST_BOT_FAILURE,
    FETCH_REYAL_TIME_BOT,
} from './actionTypes';
  
// Success and Failure Payload Types
export interface SuccessPayload {
    bot: any[];
    id?: string;
}

export interface WebsoketStatus {
    type: string | any;
}
  
export interface FailurePayload {
    error: any;
}
  
// WebSocket Error Payload
export interface WebSocketErrorPayload {
    error: string | any;
    details?: string | any;
    message?: string | any; 
}
  
export interface botState {
    pending: boolean;
    bot: any[];
    error: string | null;
    webSocketStatus: any | null;
}
  
// Fetch type
export interface FetchBotRequest {
    type: typeof FETCH_BOT_REQUEST;
}
  
export type FetchBotSuccess = {
    type: typeof FETCH_BOT_SUCCESS;
    payload: SuccessPayload;
};
  
export type FetchBotFailure = {
    type: typeof FETCH_BOT_FAILURE;
    payload: FailurePayload;
};
  
// Post type
export type PostBotRequest = {
    type: typeof POST_BOT_REQUEST;
};
  
export type PostFetchBotRequest = {
    type: typeof FETCH_REYAL_TIME_BOT;
};
  
export type PostBotSuccess = {
    type: typeof POST_BOT_SUCCESS;
    payload: SuccessPayload;
};
  
export type PostBotFailure = {
    type: typeof POST_BOT_FAILURE;
    payload: FailurePayload;
};
  
// Combined actions type
export type botActions =
| FetchBotRequest
| FetchBotSuccess
| FetchBotFailure
| PostBotRequest
| PostBotSuccess
| PostBotFailure
| PostFetchBotRequest


  