
import { createStore } from "redux";

import _ from 'lodash';

const initialState = {
    all: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'DIARY_ENTRIES_UPDATED': {
            const { diaryEntries, startTimestamp = null, endTimestamp = null } = action;
            _.remove(state.all, e => {
                if (startTimestamp === null || endTimestamp === null) {
                    return true;
                }
                return e.timestamp < endTimestamp && e.timestamp >= startTimestamp;
            });
            state.all = state.all.concat(diaryEntries);
            return {
                ...state,
                all: state.all.slice()
            };
        }
        default:
            return state;
    }
}

export default reducer;
