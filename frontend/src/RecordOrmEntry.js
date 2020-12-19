import React, { useState, useEffect } from 'react';

import { getFormId, getFormElementValue, getUserId, getStartEndTime } from './util';

import { recordOrmEntry } from './ormEntries/api';
import { selectLiftName } from './webData/selectors';
import { dispatchFormElementValue } from './webData/actions';
import { dispatchRecordOneTimeDiaryEntry } from './diaryEntries/actions';

import store from './RootStore';

function RecordOrmEntry({}) {
    return (
        <div className="horizontal-spanning-segment extra-padding">
            <form id="add-meal-form">
                <div className="form-group">
                    <input
                        id={getFormId({ name: 'orm/weight' })}
                        onChange={handleUpdate({ name: 'orm/weight' })}
                        className="form-control"
                        type="number"
                        min="0"
                        max="100000"
                        step="1"
                        required />
                    
                    <small>Weight</small>
                </div>
                <div className="form-group">
                    <input
                        id={getFormId({ name: 'repetitions' })}
                        className="form-control"
                        type="number"
                        min="0"
                        max="100000"
                        step="1"
                        required />
                    <small>
                        Repetitions
                    </small>
                </div>
                <div className="form-group">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={recordOrmEntryButton}>
                        Record
                    </button>
                </div>
            </form>
        </div>
    );
}

function handleUpdate({ name }) {
    return (event) => {
        dispatchFormElementValue({ name, value: Number(event.target.value) });
    };
}

function recordOrmEntryButton() {
    const liftName = selectLiftName(store.getState());
    const repetitions = getFormElementValue({ name: "repetitions" });
    const weight = getFormElementValue({ name: "orm/weight" });
    store.dispatch(recordOrmEntry({ liftName, repetitions, weight }));
    const currentDate = new Date();
    dispatchRecordOneTimeDiaryEntry({
        mealName: "Weight Lifting, 15 Min",
        calories: '-115',
        protein: 0,
        currentDate
    });
}

export default RecordOrmEntry;