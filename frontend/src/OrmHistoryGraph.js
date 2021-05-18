import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Chart from "chart.js";

import * as _ from 'lodash';

import { getFormId, getFormElementValue, getUserId, getStartEndTime } from './util';

import { selectOrmEntries } from './ormEntries/selectors';

import store from './RootStore';
import { deleteOrmEntry } from './ormEntries/api';
import { calculateOneRepMax } from './ormEntries/helpers';
import { selectLiftName } from './webData/selectors';

function OrmHistoryGraph({ }) {
    const chartRef = React.createRef();
    const selectedLiftName = useSelector ( selectLiftName );
    const ormEntries = useSelector( selectOrmEntries({ liftName: selectedLiftName }) );
    const lifts = _.groupBy(ormEntries, "liftName");
    const chartColors = ["rgba(255, 99, 132, 0.4)", "rgba(255, 159, 64, 0.4)", "rgba(255, 205, 86, 0.4)", "rgba(75, 192, 192, 0.4)", "rgba(54, 162, 235, 0.4)", "rgba(153, 102, 255, 0.4)", "rgba(201, 203, 207, 0.4)","rgba(255, 99, 132, 0.4)", "rgba(255, 159, 64, 0.4)", "rgba(255, 205, 86, 0.4)", "rgba(75, 192, 192, 0.4)", "rgba(54, 162, 235, 0.4)", "rgba(153, 102, 255, 0.4)", "rgba(201, 203, 207, 0.4)","rgba(255, 99, 132, 0.4)", "rgba(255, 159, 64, 0.4)", "rgba(255, 205, 86, 0.4)", "rgba(75, 192, 192, 0.4)", "rgba(54, 162, 235, 0.4)", "rgba(153, 102, 255, 0.4)", "rgba(201, 203, 207, 0.4)"];
    useEffect(() => {
        const context = chartRef
            .current
            .getContext("2d");
        new Chart(context, {
            type: 'line',
            data: {
                datasets: _.map(lifts, (liftData, liftName) => {
                    const color = chartColors[Object.keys(lifts).indexOf(liftName)]
                    return {
                        label: liftName,
                        backgroundColor: color,
                        borderColor: color,
                        fill: false,
                        data: liftData.map(d => {
                            return {
                                t: new Date(d.timestamp),
                                y: calculateOneRepMax({ weight: d.weight, repetitions: d.repetitions })
                            }
                        })
                    }
                })
            },
            options: {
                title: {
                    display: true,
                    text: [
                        `${selectedLiftName} Over Time`
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
    }, [ormEntries]);

    return (
        <div className='horizontal-spanning-segment'>
            <canvas
                ref={chartRef}
            />
        </div>
    );
}

export default OrmHistoryGraph;