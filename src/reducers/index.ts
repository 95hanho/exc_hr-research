import { combineReducers } from "redux";
import modal from "./modalSlice";
import common from "./commonSlice";

const rootReducer = combineReducers({ modal, common });

export default rootReducer;
