import store from '../RootStore';

export function dispatchFormElementValue({ name, value }) {
    store.dispatch({
        type: 'SET_FORM_VALUE',
        name,
        value
    });
}

export function dispatchIsLoading(isLoading) {
    store.dispatch({
        type: 'SET_IS_LOADING',
        isLoading
    });
}