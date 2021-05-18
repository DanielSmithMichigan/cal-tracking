
import { createStore } from "redux";

const initialState = {
    weightGainModel: {
        splineTimes: [],
        splineWeights: []
    },
    historicalPredictions: {
        newestWeightTimestamp: null,
        predictions: []
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
        case 'HISTORICAL_PREDICTIONS_UPDATED': {
            const { historicalPredictions } = action;
            return {
                ...state,
                historicalPredictions
            };
        }
        default:
            return state;
    }
}

export default reducer;
