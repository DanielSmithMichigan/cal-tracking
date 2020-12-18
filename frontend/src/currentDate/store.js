const initialState = {
    date: "NOW",
    userDateSelection: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_DATE': {
            const { modifiedDate } = action;
            return {
                ...state,
                modifiedDate
            };
        }
        case 'RESET_CURRENT_DATE': {
            return {
                ...state,
                modifiedDate: initialState.modifiedDate,
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
