import { createStore, combineReducers, applyMiddleware } from "redux";

import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import diaryEntries from "./diaryEntries/store";
import meals from "./meals/store";
import ormEntries from "./ormEntries/store";
import weightGainModel from "./weightGainModel/store";
import webData from "./webData/store";
import goals from "./goals/store";
import weights from "./weights/store";
import currentDate from "./currentDate/store";

const loggerMiddleware = createLogger();

const rootReducer = combineReducers({
    diaryEntries,
    meals,
    ormEntries,
    weightGainModel,
    webData,
    goals,
    weights,
    currentDate
});

export default createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
);
