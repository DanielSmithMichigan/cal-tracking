
import { createStore } from "redux";

const initialState = {
    all: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'QUICK_RECORD_WEIGHT': {
            const { weight } = action;
            return {
                ...state,
                all: state.all.concat(weight)
            };
        }
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
