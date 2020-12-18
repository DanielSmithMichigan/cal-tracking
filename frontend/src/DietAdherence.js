import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Chart from "chart.js";
import './App.css';

import * as _ from 'lodash';

import { msPerDay, findLineByLeastSquares, calculateLinearFitError, ymd } from './util';

import { addDays, differenceInCalendarDays, startOfDay, format, isSameDay, isAfter } from 'date-fns';

import { selectDiaryEntries } from './diaryEntries/selectors';
import { selectGoalHistory } from './goals/selectors';

function DietAdherence({ goal }) {
    const goalName = `${goal}PerDay`;
    const goalHistory = useSelector( selectGoalHistory({ goalName }) );
    const chartRef = React.createRef();
    const diaryEntries = useSelector( selectDiaryEntries({ days: "ALL" }) );
    const diaryEntriesByDay = _.groupBy( diaryEntries, e => ymd(e.timestamp));
    const data = _.chain(diaryEntriesByDay)
        .map((listOfDiaryEntries, date) => {
            const relevantGoal = _.findLast(goalHistory,
                g => isSameDay(new Date(date), new Date(g.timestamp)) || isAfter(new Date(date), new Date(g.timestamp))
            );
            if (!relevantGoal) return null;
            if (date === ymd(new Date())) return null;
            return {
                amountConsumed: _.sumBy(listOfDiaryEntries, `meal.${goal}`),
                date,
                goal: relevantGoal.value
            };
        })
        .compact()
        .value();
    useEffect(() => {
        const context = chartRef
            .current
            .getContext("2d");
        new Chart(context, {
            type: 'line',
            data: {
                datasets: [ 
                    {
                        data: data.map(d => ({ t: d.date, y: d.amountConsumed })),
                        fill: false,
                        borderColor: 'blue'
                    },
                    {
                        data: data.map(d => ({ t: d.date, y: d.goal })),
                        fill: false,
                        borderColor: 'red'
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: [
                        `Diet Adherence (${goal})`
                    ]
                },
                legend: {
                    display: false,
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        position: 'bottom',
                        time: {
                            unit: 'day'
                        }
                    }]
                }
            }
        });
    }, [ diaryEntries ]);

    return (
        <div className='horizontal-spanning-segment'>
            <canvas
                ref={chartRef}
            />
        </div>
    );
}

export default DietAdherence