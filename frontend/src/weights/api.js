import React, { useState, useEffect } from 'react';
import { getFormId, getFormElementValue, getUserId, getStartEndTime } from '../util';
import { goalsApi, mealsApi, diaryApi, weightApi, ormEntriesApi } from '../constants';
import fetch from 'cross-fetch';

import { endOfDay, subDays } from 'date-fns';

import { queryWeightGainModel } from '../weightGainModel/api';

export function recordWeight({ weight }) {
    return (dispatch) => {
        const user = getUserId();
        return fetch(`${weightApi}/weight/record`, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                weight: Number(weight),
                user
            })
        })
        .then(response => response.json())
        .then( () => dispatch( retrieveWeights() ) )
        .then( () => dispatch( queryWeightGainModel() ) );
    };
}
    
export function retrieveWeights () {
    return (dispatch) => {
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
        .then( (weights) => dispatch({ type: 'WEIGHTS_UPDATED', weights }) );
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
        .then( () => dispatch( queryWeightGainModel() ) );
    };
}