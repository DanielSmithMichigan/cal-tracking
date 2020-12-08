import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Chart from "chart.js";
import './App.css';

import * as _ from 'lodash';

import { msPerDay, findLineByLeastSquares, calculateLinearFitError } from './util';

import { addDays, differenceInCalendarDays, startOfDay, format } from 'date-fns';
import { selectDiaryEntries } from './diaryEntries/selectors';
import { selectWeights } from './weights/selectors';

const ransacImprovementThreshold = 0.85;
const ransacMaxIterations = 2;

function getXyPairs({ dataset }) {
    return dataset.map(a => ({y: a.calories, x: a.weight}));
}

function calculateReducedDataset({ dataset, maxIterations = ransacMaxIterations }) {
    const originalError = errorFromLinearFitToDataset({ dataset });
    const bestFitDataset = _.reject(dataset, ( elem, idx ) => {
        const reducedDataset = _.reject(dataset, ( elem2, idx2 ) => idx2 === idx );
        const linearFitError = errorFromLinearFitToDataset({ dataset: reducedDataset });
        return linearFitError < originalError * ransacImprovementThreshold;
    });
    const reducedError = errorFromLinearFitToDataset({ dataset: bestFitDataset });
    if (maxIterations === 0) {
        return { dataset: bestFitDataset, linearFitError: reducedError };
    }
    return calculateReducedDataset({ dataset: bestFitDataset, maxIterations: maxIterations - 1 });
}

function errorFromLinearFitToDataset({ dataset }) {
    const xyPairs = getXyPairs({ dataset });
    const [ slope, intercept ] = findLineByLeastSquares(
        xyPairs.map(xyPair => xyPair.x),
        xyPairs.map(xyPair => xyPair.y)
    );
    return calculateLinearFitError({ xyPairs, slope, intercept });
}

function calcDataset({ weights, diaryEntries }) {
    if (!weights.length) return [];
    return _.chain(
            _.range(1, weights.length)
        ).orderBy(["timestamp"], ["asc"])
        .map((i, idx) => {
            const prevWeight = weights[i - 1];
            const currentWeight = weights[i];
            const lengthOfTimeMs = new Date(currentWeight.timestamp).getTime() - new Date(prevWeight.timestamp).getTime();
            const lengthOfTimeDays = lengthOfTimeMs / msPerDay;
            if (Math.round(lengthOfTimeDays) !== 1) {
                return null;
            }
            const deltaWeight = currentWeight.weight - prevWeight.weight;
            const relevantDiaryEntries = _.filter(diaryEntries, e => e.timestamp > prevWeight.timestamp && e.timestamp < currentWeight.timestamp);
            const caloriesConsumed = _.sumBy(relevantDiaryEntries, d => d.meal.calories);
            return {
                weight: deltaWeight,
                calories: caloriesConsumed,
                timestamp: currentWeight.timestamp,
                idx
            };
        })
        .compact()
        .value();
}

function InputOutputGraph() {
    const weights = useSelector( selectWeights() );
    const diaryEntries = useSelector( selectDiaryEntries() );
    const originalDataset = calcDataset({ weights, diaryEntries });
    const { dataset: bestDataset, linearFitError: bestDatasetError } = calculateReducedDataset({ dataset: originalDataset });
    const originalLinearFitError = errorFromLinearFitToDataset({ dataset: originalDataset });
    const remainderDataset = _.reject(originalDataset, d => _.find(bestDataset, { idx: d.idx }) );
    const xyPairs = getXyPairs({ dataset: bestDataset });
    const [ slope, intercept ] = findLineByLeastSquares(
        xyPairs.map(xyPair => xyPair.x),
        xyPairs.map(xyPair => xyPair.y)
    );
    const chartRef = React.createRef();
    let minX, maxX;
    if (xyPairs.length) {
        minX = _.minBy(xyPairs, "x").x;
        maxX = _.maxBy(xyPairs, "x").x;
    }
    useEffect(() => {
        if (chartRef.current) {
            const context = chartRef
                .current
                .getContext("2d");
            new Chart(context, {
                type: 'scatter',
                data: {
                    datasets: [ 
                        {
                            pointBackgroundColor: "red",
                            data: xyPairs
                        }, 
                        {
                            pointBackgroundColor: "blue",
                            data: getXyPairs({ dataset: remainderDataset })
                        }, {
                            type: 'line',
                            pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                            pointBorderColor: 'rgba(0, 0, 0, 0)',
                            borderColor: 'rgba(0, 0, 0, .25)',
                            borderDash: [5],
                            fill: false,
                            data: [{
                                x: minX,
                                y: minX * slope + intercept
                            }, {
                                x: maxX,
                                y: maxX * slope +  intercept
                            }]
                        }
                    ]
                },
                options: {
                    title: {
                        display: true,
                        text: [
                            `Calories vs Weight Gained`
                        ]
                    },
                    legend: {
                        display: false,
                    },
                    scales: {
                        // xAxes: [{
                            // type: 'time',
                            // position: 'bottom',
                            // time: {
                            //     unit: 'day'
                            // }
                        // }]
                    }
                }
            });
        }
    }, [ weights, diaryEntries ]);

    if (!weights.length) {
        return null;
    }

    if (!diaryEntries.length) {
        return null;
    }
    
    return (
        <React.Fragment>
            <div className='horizontal-spanning-segment'>
                Points Removed: { originalDataset.length - bestDataset.length } <br />
                Reduction: { 100 - _.round(bestDatasetError / originalLinearFitError * 100, 2) }% <br />
                TDEE: { _.round(intercept, 2) } <br />
                Cal / Pound: { _.round( slope, 2) }
            </div>
            <div className='horizontal-spanning-segment'>
                <canvas
                    ref={chartRef}
                />
            </div>
            <div className='horizontal-spanning-segment'>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>
                                Date
                            </th>
                            <th>
                                Calories
                            </th>
                            <th>
                                Weight
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            originalDataset.map((d, k) => (<tr key={k}>
                                <td>
                                    {new Date(d.timestamp).toDateString()}
                                </td>
                                <td>
                                    {_.round(d.calories, 2)}
                                </td>
                                <td>
                                    {_.round(d.weight, 2)}
                                </td>
                            </tr>))
                        }
                        <tr>

                        </tr>
                    </tbody>
                </table>
            </div>
        </React.Fragment>
    );
}

export default InputOutputGraph;