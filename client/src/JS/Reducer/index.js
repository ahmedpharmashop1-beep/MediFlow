import { combineReducers } from 'redux';
import compteReducer from './comptes';

const rootReducer = combineReducers({
  compteReducer,
});

export default rootReducer;

