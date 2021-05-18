import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import * as _ from 'lodash';

import { selectWeightGainModel } from './weightGainModel/selectors';
import { selectDiaryEntries } from './diaryEntries/selectors';

import { msPerWeek, secPerWeek, ymd, standardDeviation } from './util';
import { isSameDay } from 'date-fns';

function DietSummary() {
    const weightGainModel = useSelector( selectWeightGainModel );
    const allDiaryEntries = useSelector( selectDiaryEntries() );
    
    return (
        <div className="horizontal-spanning-segment">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>
                            Timestamp
                        </th>
                        <th className="text-center">
                            Actual Diet
                        </th>
                        <th>
                            lbs/week
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        weightGainModel.splineWeights.slice(0, weightGainModel.splineWeights.length - 1).map((weight, idx) => 
                            (<tr key={idx}>
                                <td>
                                    {new Date(weightGainModel.splineTimes[idx]).toDateString()}
                                </td>
                                <td>
                                    {ActualDiet({ allDiaryEntries, splineTimes: weightGainModel.splineTimes, idx })}
                                </td>
                                <td>
                                    { _.round((weightGainModel.splineWeights[idx + 1] - weightGainModel.splineWeights[idx]) / (weightGainModel.splineTimes[idx + 1] - weightGainModel.splineTimes[idx]) * msPerWeek, 3) }
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

function ActualDiet({ allDiaryEntries, splineTimes, idx }) {
    const dietStartIso = new Date(splineTimes[idx]).toISOString();
    const dietEndIso = new Date(splineTimes[idx + 1]).toISOString();
    const diaryEntriesWithoutToday = _.reject(allDiaryEntries, d => isSameDay(new Date(d.timestamp), new Date()));
    const diaryEntriesInBetween = _.filter(diaryEntriesWithoutToday, d => d.timestamp <= dietEndIso && d.timestamp >= dietStartIso);
    const diaryEntriesInBetweenByDay = Object.values(_.groupBy(diaryEntriesInBetween, d => ymd(d.timestamp)));
    const caloriesConsumedByDay = _.map(diaryEntriesInBetweenByDay, d => _.sumBy(d, "meal.calories"));
    const mean = _.round( _.mean( caloriesConsumedByDay ), 2 );
    if (!mean) {
        return 'N/A'
    };
    const std = _.round( standardDeviation( caloriesConsumedByDay ), 2 );
    return `${mean} (std: ${std})`;
}

export default DietSummary;