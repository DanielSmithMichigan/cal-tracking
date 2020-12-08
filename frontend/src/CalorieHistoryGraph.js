import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Chart from "chart.js";
import './App.css';

import * as _ from 'lodash';

import { msPerDay, findLineByLeastSquares, calculateLinearFitError, ymd } from './util';

import { addDays, differenceInCalendarDays, startOfDay, format } from 'date-fns';

import { selectDiaryEntries } from './diaryEntries/selectors';

function CalorieHistoryGraph() {
    const chartRef = React.createRef();
    const diaryEntries = useSelector( selectDiaryEntries() );
    const diaryEntriesByDay = _.groupBy( diaryEntries, e => ymd(e.timestamp));
    const data = _.map(diaryEntriesByDay, (listOfDiaryEntries, date) => ({
        calories: _.sumBy(listOfDiaryEntries, 'meal.calories'),
        date
    }));
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
                        data: data.map(d => ({ t: d.date, y: d.calories }))
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: [
                        `Calories Over Time`
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

export default CalorieHistoryGraph;