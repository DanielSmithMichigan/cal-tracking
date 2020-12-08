import React, { useState, useEffect } from 'react';
import { getFormId, getFormElementValue, getUserId, getStartEndTime } from '../util';
import { weightGainModelEndpoint } from './constants';
import fetch from 'cross-fetch';

import { endOfDay, subDays } from 'date-fns';

export function queryWeightGainModel() {
    return (dispatch) => {
        const user = getUserId();
        return fetch(`${weightGainModelEndpoint}/model`, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user
            })
        })
        .then( (response) => response.json() )
        .then( (weightGainModel) => dispatch({ type: 'WEIGHT_GAIN_MODEL_UPDATED', weightGainModel }) );
    };
}