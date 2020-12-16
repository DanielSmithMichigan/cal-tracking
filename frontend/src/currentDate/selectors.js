import _ from 'lodash';

export function selectCurrentDate(state) {
   const currentDate = _.get(state, 'currentDate.date');
   if (currentDate === 'NOW') {
       return new Date();
   }
   return currentDate;
}

export function selectIsModified(state) {
   const currentDate = _.get(state, 'currentDate.date');
   return currentDate !== 'NOW';
}

export function selectUserDateSelection(state) {
    const userDateSelection = _.get(state, 'currentDate.userDateSelection');
    if (userDateSelection === null) {
        return selectCurrentDate(state);
    }
    return userDateSelection;
}