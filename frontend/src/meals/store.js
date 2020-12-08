
import { createStore } from "redux";

const initialState = {
    entries: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'MEALS_UPDATED': {
            const { meals } = action;
            return {
                ...state,
                all: meals
            };
        }
        default:
            return state;
    }
}

export default reducer;
