import React, { useState, useEffect } from 'react';

import { getFormId, getFormElementValue, getUserId, getStartEndTime } from './util';

import { recordOneTimeDiaryEntry } from './diaryEntries/api';
import { createMeal } from './meals/api';

import store from './RootStore';

function RecordMeal({}) {
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
                        min="0"
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
                        onClick={() => store.dispatch(recordOneTimeDiaryEntry())}>
                        Record Single Entry
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RecordMeal;