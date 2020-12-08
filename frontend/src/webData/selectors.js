import _ from 'lodash';

export const selectUser = state => _.get(state, 'webData.user');
export const selectPage = state => _.get(state, 'webData.page');
export const selectLiftName = state => _.get(state, 'webData.liftName');
export const selectFormElementValue = ({ name }) => state => _.get(state, `webData.form-field/${name}`, null);
export const selectIsLoading = state => _.get(state, `webData.isLoading`, false);