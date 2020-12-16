import store from '../RootStore';
import { retrieveDiaryEntries } from './api';
import { getUserId } from '../util';

import { goalsApi, mealsApi, diaryApi, weightApi } from '../constants';
import fetch from 'cross-fetch';

import { endOfDay, subDays } from 'date-fns';

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
    .then( () => store.dispatch( retrieveDiaryEntries() ) );
}

export function dispatchAddDiaryEntry ({ mealName, currentDate }) {
    return fetch(`${diaryApi}/diary/add-entry`, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: getUserId(),
            mealName,
            timestamp: currentDate.toISOString()
        })
    })
    .then(response => response.json())
    .then( () => store.dispatch(retrieveDiaryEntries()) );
}
    