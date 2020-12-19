import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Chart from "chart.js";
import './App.css';

import * as _ from 'lodash';

import { msPerDay, findLineByLeastSquares, calculateLinearFitError, ymd } from './util';

import { addDays, differenceInCalendarDays, startOfDay, format, isSameDay, isAfter } from 'date-fns';

import { selectDiaryEntries } from './diaryEntries/selectors';
import { selectGoalHistory } from './goals/selectors';

const binSizes = {
    calories: 100,
    protein: 20
};

function DietAdherence({ goal }) {
    const binSize = binSizes[goal];
    const goalName = `${goal}PerDay`;
    const goalHistory = useSelector( selectGoalHistory({ goalName }) );
    const chartRef = React.createRef();
    const diaryEntries = useSelector( selectDiaryEntries({ days: "ALL" }) );
    const diaryEntriesByDay = _.groupBy( diaryEntries, e => ymd(e.timestamp));
    const dailyAggregates = _.chain(diaryEntriesByDay)
        .map((listOfDiaryEntries, date) => {
            const relevantGoal = _.findLast(goalHistory,
                g => isSameDay(new Date(date), new Date(g.timestamp)) || isAfter(new Date(date), new Date(g.timestamp))
            );
            if (!relevantGoal) return null;
            if (date === ymd(new Date())) return null;
            const amountConsumed = _.sumBy(listOfDiaryEntries, `meal.${goal}`);
            return {
                amountConsumed,
                date,
                goal: relevantGoal.value,
                delta: amountConsumed - relevantGoal.value,
                binnedDelta: Math.floor((amountConsumed - relevantGoal.value) / binSize) * binSize
            };
        })
        .compact()
        .value();
    const grouped = _.groupBy(dailyAggregates, 'binnedDelta');
    const keys = _.map(Object.keys(grouped), Number);
    console.log(keys);
    const labels = _.range(_.min(keys), _.max(keys) + binSize, binSize);
    const amounts = _.map(labels, k => _.get(grouped, `${k}.length`, 0));
    const percentages = _.map(amounts, a => a / _.sum(amounts));
    useEffect(() => {
        const context = chartRef
            .current
            .getContext("2d");
        new Chart(context, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    data: percentages
                }]
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
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
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