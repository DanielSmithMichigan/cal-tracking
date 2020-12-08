import React, { useState, useEffect } from 'react';
import { getFormId, getFormElementValue, getUserId, getStartEndTime } from '../util';
import { goalsApi, mealsApi, diaryApi, weightApi, ormEntriesApi } from '../constants';
import fetch from 'cross-fetch';
    
export function retrieveGoals () {
    return (dispatch) => {
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
        .then( (goals) => dispatch({ type: 'GOALS_UPDATED', goals }) );
    };
}