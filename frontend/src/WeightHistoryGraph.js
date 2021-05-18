import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Chart from "chart.js";
import './App.css';

import * as _ from 'lodash';

import { weightsSlopeIntercept, ymd, entriesInRangeInclusive } from './util';

import { addDays, differenceInCalendarDays, startOfDay, subDays, endOfDay } from 'date-fns';

import { selectWeightGainModel } from './weightGainModel/selectors';

import { selectWeights } from './weights/selectors';



function WeightHistoryGraph({ numDays }) {
    const chartRef = React.createRef();

    const weights = useSelector ( selectWeights() );

    const includedWeights = numDays !== null ? entriesInRangeInclusive({
        startOfRange: startOfDay(subDays(new Date(), numDays)),
        endOfRange: endOfDay(new Date()),
        entries: weights,
    }) : weights;

    const weightGainModel = useSelector( selectWeightGainModel );

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
                        data: weights.map(weight => ({
                            t: new Date(weight.timestamp),
                            y: weight.weight
                        }))
                    }, {
                        type: 'line',
                        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                        pointBorderColor: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgba(0, 0, 0, .25)',
                        lineTension: 0,
                        borderDash: [5],
                        fill: false,
                        data: weightGainModel.splineWeights.map((weight, k) => ({ x: new Date(weightGainModel.splineTimes[k]), y: weight }))
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: [
                        `Weight History (${numDays !== null ? `${numDays} days` : 'all-time'})`
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
                            unit: 'day',
                            min: numDays ? subDays(new Date(), numDays) : null
                        },
                    }],
                    yAxes: [{
                        ticks: {
                            min: _.chain(includedWeights).map("weight").min().value(),
                            max: _.chain(includedWeights).map("weight").max().value()
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

export default WeightHistoryGraph;