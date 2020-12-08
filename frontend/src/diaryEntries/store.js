
import { createStore } from "redux";

const initialState = {
    entries: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'DIARY_ENTRIES_UPDATED': {
            const { diaryEntries } = action;
            return {
                ...state,
                all: diaryEntries
            };
        }
        default:
            return state;
    }
}

export default reducer;
