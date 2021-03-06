import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { getFormId, getFormElementValue, getUserId, getStartEndTime, randomizedDate } from './util';

import { dispatchRecordOneTimeDiaryEntry } from './diaryEntries/actions';
import { selectModifiedDate } from './currentDate/selectors';
import { createMeal } from './meals/api';

import store from './RootStore';

function RecordMeal({}) {
    const modifiedDate = useSelector( selectModifiedDate );
    return (
        <div className="horizontal-spanning-segment extra-padding">
            <form id="add-meal-form">
                <div className="form-group">
                    <input
                        id={getFormId({ name: 'meal-name' })}
                        className="form-control"
                        type="text"
                        required />
                    <small>
                        Meal Name
                    </small>
                </div>
                <div className="form-group">
                    <input
                        id={getFormId({ name: 'calories' })}
                        className="form-control"
                        type="number"
                        min="-100000"
                        max="100000"
                        step="1"
                        required />
                    <small>
                        Calories
                    </small>
                </div>
                <div className="form-group">
                    <input
                        id={getFormId({ name: 'protein' })}
                        className="form-control"
                        type="number"
                        min="0"
                        max="100000"
                        step="1"
                        required />
                    
                    <small>Protein(g)</small>
                </div>
                <div className="form-group">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => store.dispatch(createMeal())}>
                        Create New Meal
                    </button>
                </div>
                <div className="form-group">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => recordOneTimeDiaryEntry({ modifiedDate })}>
                        Record Single Entry
                    </button>
                </div>
            </form>
        </div>
    );
}

function recordOneTimeDiaryEntry({ modifiedDate }) {
    const currentDate = randomizedDate({ modifiedDate });
    const mealName = getFormElementValue({ name: "meal-name" });
    const calories = getFormElementValue({ name: "calories" });
    const protein = getFormElementValue({ name: "protein" });
    dispatchRecordOneTimeDiaryEntry({
        mealName,
        calories,
        protein,
        currentDate
    });
}

export default RecordMeal;