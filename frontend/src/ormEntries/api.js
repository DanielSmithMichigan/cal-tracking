import React, { useState, useEffect } from 'react';
import { getFormId, getFormElementValue, getUserId, getStartEndTime } from '../util';
import { goalsApi, mealsApi, diaryApi, weightApi, ormEntriesApi } from '../constants';
import fetch from 'cross-fetch';

import { endOfDay, subDays } from 'date-fns';

export function recordOrmEntry({ liftName, repetitions, weight }) {
    return (dispatch) => {
        const user = getUserId();
        return fetch(`${ormEntriesApi}/orm/record-entry`, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                liftName,
                repetitions: Number(repetitions),
                weight: Number(weight),
                user
            })
        })
        .then( (response) => response.json() )
        .then( () => dispatch( retrieveOrmEntries() ) );
    };
}
    
export function retrieveOrmEntries () {
    return (dispatch) => {
        return fetch(`${ormEntriesApi}/orm/get-entries`, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: getUserId()
            })
        })
        .then( (response) => response.json() )
        .then( (ormEntries) => dispatch({ type: 'ORM_ENTRIES_UPDATED', ormEntries }) );
    };
}
    
export function deleteOrmEntry ({ user, liftName, timestamp }) {
    return (dispatch) => {
        return fetch(`${ormEntriesApi}/orm/delete-entry`, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user,
                liftName,
                timestamp
            })
        })
        .then( (response) => response.json() )
        .then( () => dispatch( retrieveOrmEntries() ) );
    };
}