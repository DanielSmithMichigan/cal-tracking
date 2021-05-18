import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import { selectNewestWeightTimestamp, selectWeights } from './weights/selectors';

import { createHistoricalPredictions } from './weightGainModel/api';

import { selectHistoricalPredictions, selectHistoricalPredictionsNewestWeightTimestamp } from './weightGainModel/selectors';

import Chart from "chart.js";

import * as _ from 'lodash';

function ModelAccuracy() {
    const chartRef = React.createRef();
    const historicalPredictionsNewestWeightTimestamp = useSelector( selectHistoricalPredictionsNewestWeightTimestamp );
    const newestWeightTimestamp = useSelector( selectNewestWeightTimestamp );
    const historicalPredictions = useSelector( selectHistoricalPredictions );
    const weights = useSelector( selectWeights() );
    if ( historicalPredictionsNewestWeightTimestamp !== newestWeightTimestamp ) {
        createHistoricalPredictions({ weights });
    }

    console.log(historicalPredictions);

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
                        data: historicalPredictions.predictions.map(historicalPrediction => ({
                            x: historicalPrediction.actualWeight.weight,
                            y: historicalPrediction.predictedWeight
                        }))
                    }, // {
                    //     type: 'line',
                    //     pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                    //     pointBorderColor: 'rgba(0, 0, 0, 0)',
                    //     borderColor: 'rgba(0, 0, 0, .25)',
                    //     lineTension: 0,
                    //     borderDash: [5],
                    //     fill: false,
                    //     data: weightGainModel.splineWeights.map((weight, k) => ({ x: new Date(weightGainModel.splineTimes[k]), y: weight }))
                    // }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: [
                        `asd`
                    ]
                },
                legend: {
                    display: false,
                }
            }
        });
    }, [ historicalPredictions ]);
    
    return (
        <div className='horizontal-spanning-segment'>
            <canvas
                ref={chartRef}
            />
        </div>
    );
}


export default ModelAccuracy;