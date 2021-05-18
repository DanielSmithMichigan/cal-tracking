import store from '../RootStore';
import { retrieveDiaryEntries } from './api';
import { getUserId, randomizedDate } from '../util';

import { goalsApi, mealsApi, diaryApi, weightApi } from '../constants';
import fetch from 'cross-fetch';

import { startOfDay, addDays, subDays } from 'date-fns';
import { add } from 'lodash';

export function dispatchRecordOneTimeDiaryEntry({
    mealName,
    calories,
    protein,
    currentDate
}) {
    const user = getUserId();
    const meal = {
        mealName,
        calories: Number(calories),
        protein: Number(protein)
    };
    return fetch(`${diaryApi}/diary/record-one-time-diary-entry`, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user,
            meal,
            timestamp: currentDate.toISOString()
        })
    })
    .then( (response) => response.json() )
    .then( () => retrieveTodaysDiaryEntries({ currentDate }) );
}

export function dispatchAddDiaryEntry ({ mealName, modifiedDate }) {
    const currentDate = modifiedDate || new Date();
    const randomDate = randomizedDate({ modifiedDate });
    return fetch(`${diaryApi}/diary/add-entry`, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: getUserId(),
            mealName,
            timestamp: randomDate.toISOString()
        })
    })
    .then(response => response.json())
    .then( () => retrieveTodaysDiaryEntries({ currentDate }) );
}


export function deleteDiaryEntry({ timestamp, currentDate }) {
    const user = getUserId();
    return fetch(`${diaryApi}/diary/delete-entry`, {
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
    .then(response => response.json())
    .then( () => retrieveTodaysDiaryEntries({ currentDate }) );
}

export function retrieveTodaysDiaryEntries({ currentDate=new Date() } = {}) {
    return store.dispatch( retrieveDiaryEntries({
        startTimestamp: startOfDay( currentDate ).toISOString(),
        endTimestamp: startOfDay( addDays( currentDate, 1) ).toISOString()
    }) );
}

export function retrieveDiaryEntriesByDays({ days, currentDate = new Date() } = {}) {
    return store.dispatch( retrieveDiaryEntries({
        startTimestamp: startOfDay( subDays( currentDate, days ) ).toISOString(),
        endTimestamp: startOfDay( addDays( currentDate, 1) ).toISOString()
    }) );
}