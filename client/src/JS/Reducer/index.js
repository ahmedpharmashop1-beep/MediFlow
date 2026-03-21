import { combineReducers } from 'redux';
import patientReducer from './patient';

const rootReducer = combineReducers({
  patientReducer,
});

export default rootReducer;

