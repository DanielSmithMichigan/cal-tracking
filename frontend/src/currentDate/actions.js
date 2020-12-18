import store from '../RootStore';

export function dispatchSetCurrentDate({ modifiedDate }) {
    store.dispatch({
        type: 'SET_CURRENT_DATE',
        modifiedDate
    });
}

export function dispatchResetCurrentDate() {
    store.dispatch({
        type: 'RESET_CURRENT_DATE'
    });
}

export function dispatchUserDateSelection({ userDateSelection }) {
    store.dispatch({
        type: 'USER_DATE_SELECTION',
        userDateSelection
    });
}