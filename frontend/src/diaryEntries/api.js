import React, { useState, useEffect } from 'react';
import { getFormId, getFormElementValue, getUserId, getStartEndTime } from '../util';
import { goalsApi, mealsApi, diaryApi, weightApi } from '../constants';
import fetch from 'cross-fetch';

import { endOfDay, subDays } from 'date-fns';

export function addDiaryEntry ({ mealName }) {
    return (dispatch) => {
        return fetch(`${diaryApi}/diary/add-entry`, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: getUserId(),
                mealName
            })
        })
        .then(response => response.json())
        .then( () => dispatch(retrieveDiaryEntries()) );
    };
}

export function recordOneTimeDiaryEntry() {
    return (dispatch) => {
        const user = getUserId();
        const mealName = getFormElementValue({ name: "meal-name" });
        const calories = getFormElementValue({ name: "calories" });
        const protein = getFormElementValue({ name: "protein" });
        return fetch(`${diaryApi}/diary/record-one-time-diary-entry`, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mealName,
                calories: Number(calories),
                protein: Number(protein),
                user
            })
        })
        .then( (response) => response.json() )
        .then( () => dispatch( retrieveDiaryEntries() ) );
    };
}
    
export function retrieveDiaryEntries () {
    return (dispatch) => {
        return fetch(`${diaryApi}/diary/get-entries`, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: getUserId(),
                startTime: subDays(new Date(), 9999).toISOString(),
                endTime: endOfDay(new Date()).toISOString()
            })
        })
        .then( (response) => response.json() )
        .then( (diaryEntries) => dispatch({ type: 'DIARY_ENTRIES_UPDATED', diaryEntries }) );
    };
}

export function deleteDiaryEntry({ timestamp }) {
    return (dispatch) => {
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
        .then( () => dispatch( retrieveDiaryEntries() ) );
    };
}