const initialState = {
    date: "NOW",
    userDateSelection: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_DATE': {
            const { date } = action;
            return {
                ...state,
                date
            };
        }
        case 'RESET_CURRENT_DATE': {
            return {
                ...state,
                date: initialState.date,
                userDateSelection: initialState.userDateSelection
            };
        }
        case 'USER_DATE_SELECTION': {
            const { userDateSelection } = action;
            return {
                ...state,
                userDateSelection
            };
        }
        default:
            return state;
    }
}

export default reducer;
