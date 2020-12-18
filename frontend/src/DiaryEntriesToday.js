import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { selectDiaryEntries } from './diaryEntries/selectors';
import { deleteDiaryEntry } from './diaryEntries/api';
import { selectModifiedDate } from './currentDate/selectors';

import store from './RootStore';

export default function DiaryEntriesToday() {
    const modifiedDate = useSelector( selectModifiedDate );
    const currentDate = modifiedDate || new Date();
    const diaryEntries = useSelector( selectDiaryEntries({ days: 0, currentDate }) );

    console.log({
        diaryEntries
    })
    return (<div className="horizontal-spanning-segment">
        <table className="table">
            <thead>
                <tr>
                    <th>Meal</th>
                    <th>Calories</th>
                    <th>Protein</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    diaryEntries.map(
                        (entry, k) => (<tr key={k}>
                            <td>{entry.meal.mealName}</td>
                            <td>{entry.meal.calories}</td>
                            <td>{entry.meal.protein}</td>
                            <td>
                                <button
                                    type="button"
                                    className="button8"
                                    onClick={() => store.dispatch( deleteDiaryEntry({ timestamp: entry.timestamp}) ) }>
                                    x
                                </button>
                            </td>
                        </tr>)
                    )
                }
            </tbody>
        </table>
    </div>);
}