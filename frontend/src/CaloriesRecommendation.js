import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Chart from "chart.js";
import './App.css';

import * as _ from 'lodash';

import { weightsSlopeIntercept, ymd, entriesInRangeInclusive, secPerWeek, weightedLinearRegression } from './util';

import { addDays, differenceInCalendarDays, startOfDay, subDays, endOfDay, isSameDay } from 'date-fns';

import { selectWeightGainModel } from './weightGainModel/selectors';

import { selectWeights } from './weights/selectors';
import { selectDiaryEntries } from './diaryEntries/selectors';



function CaloriesRecommendation() {
    const chartRef = React.createRef();

    const weights = useSelector ( selectWeights() );
    const weightGainModel = useSelector( selectWeightGainModel );
    const allDiaryEntries = useSelector( selectDiaryEntries() );

    const ascendingTimestamps = weightGainModel.spline_timestamps.slice(0).sort();

    const allDatapoints = ascendingTimestamps.slice(1).map((timestamp, pIdx) => {
        const idx = pIdx + 1;
        const weightDiff = weightGainModel.spline_weights[idx] - weightGainModel.spline_weights[idx - 1];
        const timeDiff = weightGainModel.spline_timestamps[idx] - weightGainModel.spline_timestamps[idx - 1];
        const lbsPerWeek = weightDiff / timeDiff * secPerWeek;


        const dietStartIso = startOfDay(new Date(weightGainModel.spline_timestamps[idx - 1] * 1000)).toISOString();
        const dietEndIso = startOfDay(new Date(weightGainModel.spline_timestamps[idx] * 1000)).toISOString();
        const diaryEntriesWithoutToday = _.reject(allDiaryEntries, d => isSameDay(new Date(d.timestamp), new Date()));
        const diaryEntriesInBetween = _.filter(
            diaryEntriesWithoutToday,
            d => {
                return d.timestamp < dietEndIso
                    && d.timestamp >= dietStartIso;
            }
        );
        const diaryEntriesInBetweenWithYmd = _.map(diaryEntriesInBetween, d => ({ ...d, ymd: ymd(d.timestamp)}));
        const diaryEntriesInBetweenByDay = Object.values(_.groupBy(diaryEntriesInBetweenWithYmd, 'ymd'));
        const daysReported = diaryEntriesInBetweenByDay.length;
        const caloriesConsumedByDay = _.map(diaryEntriesInBetweenByDay, d => _.sumBy(d, "meal.calories"));
        const meanCaloriesConsumedPerDay = _.round( _.mean( caloriesConsumedByDay ), 2 );

        const daysCovered = differenceInCalendarDays(new Date(dietEndIso), new Date(dietStartIso));
        const daysFraction = Math.min(daysReported / daysCovered, 1);
        const weight = daysFraction * 0.8 ** (ascendingTimestamps.length - pIdx - 2);

        return {
            weight,
            x: lbsPerWeek,
            y: meanCaloriesConsumedPerDay,
            diaryEntriesInBetweenByDay
        };
    });
    const { equation: [ slope, intercept] } = weightedLinearRegression(
        allDatapoints.map(({x, y}) => [x, y]),
        _.map(allDatapoints, 'weight')
    );

    const x = _.map(allDatapoints, 'x');
    const minX = _.min(x);
    const maxX = _.max(x);

    useEffect(() => {
        const context = chartRef
            .current
            .getContext("2d");
        new Chart(context, {
            type: 'scatter',
            data: {
                datasets: [ 
                    {
                        pointBackgroundColor: "red",
                        data: allDatapoints.map(({x, y}) => ({x, y}))
                    }, {
                        type: 'line',
                        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                        pointBorderColor: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgba(0, 0, 0, .25)',
                        lineTension: 0,
                        borderDash: [5],
                        fill: false,
                        data: [
                            {
                                x: minX,
                                y: minX * slope + intercept
                            },
                            {
                                x: maxX,
                                y: maxX * slope + intercept
                            }
                        ]
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: [
                        `Calories Recommendation: ${ _.round(slope + intercept, 2) }`
                    ]
                },
                legend: {
                    display: false,
                },
                scales: {
                    xAxes: [{
                        position: 'bottom',
                        time: {
                            // min: numDays ? subDays(new Date(), numDays) : null
                        },
                    }],
                    yAxes: [{
                        ticks: {
                            // min: _.chain(includedWeights).map("weight").concat(weightGainModel.spline_weights).min().value(),
                            // max: _.chain(includedWeights).map("weight").concat(weightGainModel.spline_weights).max().value()
                        }
                    }]
                }
            }
        });
    }, [ weights, weightGainModel ]);
    
    return (
        <div className='horizontal-spanning-segment'>
            <canvas
                ref={chartRef}
            />
        </div>
    );
}

export default CaloriesRecommendation;