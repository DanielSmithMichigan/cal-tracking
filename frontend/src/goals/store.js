const initialState = {
    all: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GOALS_UPDATED': {
            const { goals } = action;
            return {
                ...state,
                all: goals
            };
        }
        default:
            return state;
    }
}

export default reducer;
