import {combineReducers} from "redux"
import foodReducer from "./food"
import userReducer from "./user"




const rootReducer=combineReducers({foodReducer,userReducer});
export default rootReducer