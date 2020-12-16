import store from '../RootStore';

export function dispatchSetCurrentDate({ date }) {
    store.dispatch({
        type: 'SET_CURRENT_DATE',
        date
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