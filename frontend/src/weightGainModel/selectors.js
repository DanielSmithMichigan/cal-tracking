import _ from 'lodash';

export const selectWeightGainModel = state => _.get(state, 'weightGainModel.weightGainModel');
export const selectHistoricalPredictionsNewestWeightTimestamp = state => _.get(state, 'weightGainModel.historicalPredictions.newestWeightTimestamp');
export const selectHistoricalPredictions = state => _.get(state, 'weightGainModel.historicalPredictions');