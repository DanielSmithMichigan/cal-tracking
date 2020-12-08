
const initialState = {
    page: null,
    user: null,
    liftName: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_LIFT_NAME': {
            const { liftName } = action;
            return {
                ...state,
                liftName
            };
        }
        case 'SET_PAGE': {
            const { page } = action;
            return {
                ...state,
                page
            };
        }
        case 'SET_USER': {
            const { user } = action;
            return {
                ...state,
                user
            };
        }
        case 'SET_FORM_VALUE': {
            const { name, value } = action;
            return {
                ...state,
                [`form-field/${name}`]: value
            };
        }
        case 'SET_IS_LOADING': {
            const { isLoading } = action;
            return {
                ...state,
                [`isLoading`]: isLoading
            };
        }
        default:
            return state;
    }
}

export default reducer;
