import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { selectMeals } from './meals/selectors';
import { dispatchAddDiaryEntry } from './diaryEntries/actions';
import { deleteMeal } from './meals/api';

import store from './RootStore';
import { selectCurrentDate } from './currentDate/selectors';

export default function() {
    const meals = useSelector( selectMeals() );
    const currentDate = useSelector( selectCurrentDate );

    return (
        <div className="horizontal-spanning-segment">
            <table className="table table-striped meals-table">
                <thead>
                    <tr>
                        <th>

                        </th>
                        <th className="text-center">
                            Meal Name
                        </th>
                        <th>
                            
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        meals.map((m, k) => 
                            (<tr key={k}>
                                <td className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => dispatchAddDiaryEntry({ mealName: m.mealName, currentDate })}>
                                        Add
                                    </button>
                                </td>
                                <td>
                                    { m.mealName }
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        onClick={() => store.dispatch( deleteMeal({ mealName: m.mealName }) )}>
                                        x
                                    </button>
                                </td>
                            </tr>
                            )
                        )
                    }
                </tbody>
            </table>
        </div>
    );
}