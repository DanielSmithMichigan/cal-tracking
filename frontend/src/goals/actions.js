import React, { useState, useEffect } from 'react';
import { getFormId, getFormElementValue, getUserId, getStartEndTime } from '../util';
import { goalsApi } from '../constants';
import fetch from 'cross-fetch';

import store from '../RootStore';
    
export function dispatchRetrieveGoals () {
    const user = getUserId();
    return fetch(`${goalsApi}/get-goals`, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: getUserId()
        })
    })
    .then( response => response.json() )
    .then( (goals) => store.dispatch({ type: 'GOALS_UPDATED', goals }) );
}

export function dispatchSetGoals({
    firstMealTime,
    lastMealTime,
    caloriesPerDay,
    proteinPerDay
}) {
    const user = getUserId();
    return fetch(`${goalsApi}/set-goal`, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstMealTime,
            lastMealTime,
            caloriesPerDay: Number(caloriesPerDay),
            proteinPerDay: Number(proteinPerDay),
            user
        })
    }).then(response => response.json())
    .then(() => dispatchRetrieveGoals());
}