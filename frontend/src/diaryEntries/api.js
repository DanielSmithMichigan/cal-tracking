import React, { useState, useEffect } from 'react';
import { getFormId, getFormElementValue, getUserId, getStartEndTime } from '../util';
import { goalsApi, mealsApi, diaryApi, weightApi } from '../constants';
import fetch from 'cross-fetch';

import { endOfDay, subDays } from 'date-fns';
    
export function retrieveDiaryEntries ({
    startTimestamp = null,
    endTimestamp = null
} = {}) {
    return (dispatch) => {
        return fetch(`${diaryApi}/diary/get-entries`, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: getUserId(),
                startTimestamp,
                endTimestamp
            })
        })
        .then( (response) => response.json() )
        .then( (diaryEntries) => dispatch({ type: 'DIARY_ENTRIES_UPDATED', diaryEntries, startTimestamp, endTimestamp }) );
    };
}