import _ from 'lodash';

export function selectModifiedDate(state) {
   return _.get(state, 'currentDate.modifiedDate');
}

export function selectIsModified(state) {
   const currentDate = _.get(state, 'currentDate.modifiedDate');
   return currentDate !== 'NOW';
}

export function selectUserDateSelection(state) {
    const userDateSelection = _.get(state, 'currentDate.userDateSelection');
    if (userDateSelection === null) {
        return selectModifiedDate(state) || new Date();
    }
    return userDateSelection;
}