
import { createStore } from "redux";

const initialState = {
    weightGainModel: {
        spline_goals: [],
        spline_timestamps: [],
        spline_weights: []
    }
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'WEIGHT_GAIN_MODEL_UPDATED': {
            const { weightGainModel } = action;
            return {
                ...state,
                weightGainModel
            };
        }
        default:
            return state;
    }
}

export default reducer;
