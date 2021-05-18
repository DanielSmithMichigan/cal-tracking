import React, { useState, useEffect } from 'react';
import { getFormId, getFormElementValue, getUserId, getStartEndTime } from '../util';
import { goalsApi, mealsApi, diaryApi, weightApi, ormEntriesApi } from '../constants';
import fetch from 'cross-fetch';

import { endOfDay, subDays } from 'date-fns';

import { queryWeightGainModel } from '../weightGainModel/api';
import { selectWeights } from './selectors';

import store from '../RootStore';

export function recordWeight({ weight }) {
    return (dispatch) => {
        const user = getUserId();
        const weightObj = {
            weight: Number(weight),
            user
        };
        new Promise( resolve => resolve() )
            .then( () => dispatch({ type: 'QUICK_RECORD_WEIGHT', weight: { ...weightObj, timestamp: new Date().toISOString() } }) )
            .then( () => dispatch( queryWeightGainModel({ weights: selectWeights()(store.getState()) }) ) );
        return fetch(`${weightApi}/weight/record`, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(weightObj)
        })
        .then(response => response.json())
        .then( () => dispatch( retrieveWeights() ) );
    };
}
    
export function retrieveWeights () {
    return (dispatch) => {
        let weights;
        const user = getUserId();
        return fetch(`${weightApi}/weight/get`, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user
            })
        })
        .then(response => response.json())
        .then( (_weights) => { weights=_weights} )
        .then( () => dispatch({ type: 'WEIGHTS_UPDATED', weights }) )
        .then( () => dispatch( queryWeightGainModel({ weights }) ) );
    };
}

    
export function deleteWeightEntry ({ timestamp }) {
    return (dispatch) => {
        const user = getUserId();
        return fetch(`${weightApi}/weight/delete`, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                timestamp,
                user
            })
        })
        .then( response => response.json() )
        .then( () => dispatch( retrieveWeights() ) )
    };
}