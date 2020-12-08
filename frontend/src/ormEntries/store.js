
import { createStore } from "redux";

const initialState = {
    entries: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ORM_ENTRIES_UPDATED': {
            const { ormEntries } = action;
            return {
                ...state,
                all: ormEntries
            };
        }
        default:
            return state;
    }
}

export default reducer;
