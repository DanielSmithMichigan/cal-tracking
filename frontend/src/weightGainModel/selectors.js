import _ from 'lodash';

export const selectWeightGainModel = state => _.get(state, 'weightGainModel.weightGainModel');