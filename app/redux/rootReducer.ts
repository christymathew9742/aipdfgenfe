import { combineReducers } from 'redux';
import botReducer from './reducers/chatBot/reducer'

const rootReducer = combineReducers({
    botReducer,
});
  
export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;