
import { createStore } from "redux";

const initialState = {
    weights: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'WEIGHTS_UPDATED': {
            const { weights } = action;
            return {
                ...state,
                all: weights
            };
        }
        default:
            return state;
    }
}

export default reducer;
