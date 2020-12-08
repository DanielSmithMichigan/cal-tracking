import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Chart from "chart.js";
import './App.css';

import * as _ from 'lodash';

import { msPerDay, findLineByLeastSquares, calculateLinearFitError } from './util';

import { addDays, differenceInCalendarDays, startOfDay, format } from 'date-fns';
import { selectDiaryEntries } from './diaryEntries/selectors';
import { selectWeights } from './weights/selectors';

const chunkSize = 14;

function TDEEOverTime() {
    const weights = useSelector( selectWeights() );
    const diaryEntries = useSelector( selectDiaryEntries() );
    const orderedWeights = _.orderBy( weights, 'timestamp' );
    _.each(orderedWeights, (v, k) => v.key = k);
    _.each(orderedWeights, (value, k) => value.msSincePreviousDate = k > 0 ? new Date(value.timestamp).getTime() - new Date(orderedWeights[k - 1].timestamp).getTime() : Math.infinity);
    _.each(orderedWeights, (value, k) => value.daysSincePreviousWeighing = k > 0 ? Math.round(value.msSincePreviousDate / msPerDay) : 0);
    const usableWeights = _.reject(orderedWeights, o => o.daysSincePreviousWeighing !== 1);
    const summary = _.map(usableWeights, weight => {
        const prevWeight = orderedWeights[weight.key - 1];
        const dWeight = orderedWeights[weight.key].weight - orderedWeights[weight.key - 1].weight;
        const dCalories = _.chain(diaryEntries)
            .filter(e => e.timestamp < weight.timestamp && e.timestamp > prevWeight.timestamp)
            .sumBy('meal.calories')
            .round(2)
            .value();
        return { dWeight, dCalories, ms: new Date(weight.timestamp).getTime() };
    });
    const chunkedSummary = [];
    while (summary.length >= chunkSize) {
        chunkedSummary.push(summary.slice(0, chunkSize));
        summary.shift();
    }
    const dataPoints = chunkedSummary.map(chunk => {
        const meanDate = new Date(_.meanBy(chunk, 'ms'));
        const [ calPerDay, tdee ] = findLineByLeastSquares(
            _.map(chunk, 'dWeight'),
            _.map(chunk, 'dCalories')
        );
        return {
            meanDate,
            calPerDay,
            tdee
        };
    });
    const chartRef = React.createRef();
    useEffect(() => {
        const context = chartRef
            .current
            .getContext("2d");
        new Chart(context, {
            type: 'line',
            data: {
                datasets: [ 
                    {
                        fill: false,
                        data: _.map(dataPoints, d => ({ t: d.meanDate, y: d.tdee }))
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: [
                        `TDEE Over Time`
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
    }, [ weights, diaryEntries ]);
    
    return (
        <React.Fragment>
            <div className='horizontal-spanning-segment'>
                <canvas
                    ref={chartRef}
                />
            </div>
        </React.Fragment>
    );
}

export default TDEEOverTime;