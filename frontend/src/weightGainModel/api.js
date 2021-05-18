import React, { useState, useEffect } from 'react';
import { getFormId, getFormElementValue, getUserId, getStartEndTime } from '../util';
import { weightGainModelEndpoint } from './constants';
import fetch from 'cross-fetch';

import { endOfDay, subDays } from 'date-fns';

import minimize from './model';

import store from '../RootStore';

import _ from 'lodash';

export function queryWeightGainModel({ weights }) {
    return (dispatch) => {
        return minimize({ weights: _.cloneDeep( weights ) })
            .then( (weightGainModel) => dispatch({ type: 'WEIGHT_GAIN_MODEL_UPDATED', weightGainModel }) )
    };
}

export async function createHistoricalPredictions({ weights }) {
    const orderedWeights = _.orderBy( weights, ['timestamp'], ['asc'] );
    const newestWeight = orderedWeights.slice(-1)[0];
    let predictions = [];
    for ( let idx in orderedWeights ) {
        if (idx <= 21) continue;
        const weightsSlice = orderedWeights.slice(0, idx);
        console.log(idx);
        const {
            splineWeights,
            splineTimes,
            t
        } = await minimize({ weights: weightsSlice });
        const weightGainPerMs = (splineWeights.slice(-1)[0] - splineWeights.slice(-2)[0]) / (splineTimes.slice(-1)[0] - splineTimes.slice(-2)[0]);
        const msPassed = new Date(orderedWeights.slice(-1)[0].timestamp).getTime() - new Date(orderedWeights.slice(-2)[0].timestamp).getTime();
        const predictedWeight = orderedWeights.slice(-2)[0].weight + weightGainPerMs * msPassed;
        const actualWeight = orderedWeights[idx];
        predictions.push({
            predictedWeight,
            actualWeight
        })
        store.dispatch({ type: 'HISTORICAL_PREDICTIONS_UPDATED', historicalPredictions: { predictions, newestWeightTimestamp: newestWeight.timestamp } } );
    }


}