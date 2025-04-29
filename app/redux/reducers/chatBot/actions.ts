import {
  FETCH_BOT_REQUEST,
  FETCH_BOT_SUCCESS,
  FETCH_BOT_FAILURE,
  POST_BOT_REQUEST,
  POST_BOT_SUCCESS,
  POST_BOT_FAILURE,
  FETCH_REYAL_TIME_BOT,
} from './actionTypes';

import {
  FetchBotSuccess,
  SuccessPayload,
  FetchBotFailure,
  FailurePayload,
} from './types';

// Fetch ChatBot
export const fetchBotRequest = (
  payload: any
): any => ({
  type: FETCH_BOT_REQUEST,
  payload
});

export const fetchBotSuccess = (payload: SuccessPayload): FetchBotSuccess => ({
  type: FETCH_BOT_SUCCESS,
  payload,
});

export const fetchBotFailure = (payload: FailurePayload): FetchBotFailure => ({
  type: FETCH_BOT_FAILURE,
  payload,
});

// Post ChatBot
export const postBotRequest = (payload: any = ''): any => ({
  type: POST_BOT_REQUEST,
  payload,
});

export const postBotSuccess = (payload: SuccessPayload): any => ({
  type: POST_BOT_SUCCESS,
  payload,
});

export const postBotFailure = (payload: FailurePayload): any => ({
  type: POST_BOT_FAILURE,
  payload,
});

// Post Fetch ChatBot
export const postFetchBotRequest = (
  payload?: {
  id?: string;
  botData?: any;
  }
): any => ({
  type: FETCH_REYAL_TIME_BOT,
  payload,
});




