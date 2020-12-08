import _ from 'lodash';

export function selectOrmEntries({ liftName } = {}) {
    return state => {
        const allLifts = _.get(state, 'ormEntries.all', []);
        if (!liftName) {
            return allLifts;
        }
        return _.filter(allLifts, { liftName });
    }
}