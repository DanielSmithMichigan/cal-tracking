import React, { useState, useEffect } from 'react';
import fetch from 'cross-fetch';
import { getFormId, getFormElementValue, getUserId } from './util';

import * as _ from 'lodash';

import { goalsApi } from './constants';

function SetGoals({ user }) {
    function submitGoalsToDynamo() {
        const user = getUserId();
        const firstMealTime = getFormElementValue({ name: "first-meal-time" });
        const lastMealTime = getFormElementValue({ name: "last-meal-time" });
        const caloriesPerDay = getFormElementValue({ name: "calories-per-day" });
        const proteinPerDay = getFormElementValue({ name: "protein-per-day-grams" });
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
        .then(() => window.location.reload());
    }
    return (
        <div>
            <div className='header-text'>
                Hello {_.startCase(getUserId())},
            </div>
            <div className='horizontal-spanning-segment row'>
                <div className="col-md-12">
                    <form>
                        <div className="form-group">
                            <input
                                id={getFormId({ name: 'first-meal-time' })}
                                type="hidden"
                                className="form-control"
                                required
                                value="09:00" />
                                
                            {/* <small>What time is your first meal?</small> */}
                        </div>
                        <div className="form-group">
                            <input
                                id={getFormId({ name: 'last-meal-time' })}
                                type="hidden"
                                className="form-control"
                                required
                                value="22:00" />
                            
                            {/* <small>What time is your last meal?</small> */}
                        </div>
                        <div className="form-group">
                            <input
                                id={getFormId({ name: 'calories-per-day' })}
                                className="form-control"
                                type="number"
                                min="0"
                                max="100000"
                                step="1"
                                required />
                            <small>
                                How many calories per day?
                            </small>
                        </div>
                        <div className="form-group">
                            <input
                                id={getFormId({ name: 'protein-per-day-grams' })}
                                className="form-control"
                                type="number"
                                min="0"
                                max="100000"
                                step="1"
                                required />
                            
                            <small>How many grams of protein per day?</small>
                        </div>
                        <div className="form-group">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={submitGoalsToDynamo}>
                                SUBMIT
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}


export default SetGoals;
