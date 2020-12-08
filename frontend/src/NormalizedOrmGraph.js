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

function NormalizedOrmGraph() {
    const chartRefSingle = React.createRef();
    const chartRefFull = React.createRef();
    const ormEntries = useSelector( selectOrmEntries() );
    const liftNames = _.uniq( _.map(ormEntries, 'liftName') );
    const orderedOrmEntries = _.orderBy(ormEntries, "timestamp");
    const lifts = _.groupBy(orderedOrmEntries, "liftName");
    _.each(lifts, listOfLifts => _.each(listOfLifts, l => l.oneRepMax = calculateOneRepMax({ weight: l.weight, repetitions: l.repetitions }) ));
    const normalizedLifts = _.map(lifts, listOfLifts => _.map(listOfLifts, l => ({ ...l, normalizedOneRepMax: l.oneRepMax / listOfLifts[0].oneRepMax })));
    const flattenedNormalizedLifts = _.flatten(normalizedLifts);
    const orderedNormalizedLifts = _.orderBy(flattenedNormalizedLifts, ['timestamp'], ['asc']);
    const unifiedLift = _.map(orderedNormalizedLifts, (v, k) => {
        const sliced = orderedNormalizedLifts.slice(0, k + 1);
        const grouped = _.groupBy(sliced, "liftName");
        const justTheLast = _.map(grouped, _.last);
        return {
            timestamp: v.timestamp,
            meanNormalizedLift: _.meanBy(justTheLast, "normalizedOneRepMax")
        };
    });
    const chartColors = ["rgba(255, 99, 132, 0.4)", "rgba(255, 159, 64, 0.4)", "rgba(255, 205, 86, 0.4)", "rgba(75, 192, 192, 0.4)", "rgba(54, 162, 235, 0.4)", "rgba(153, 102, 255, 0.4)", "rgba(201, 203, 207, 0.4)","rgba(255, 99, 132, 0.4)", "rgba(255, 159, 64, 0.4)", "rgba(255, 205, 86, 0.4)", "rgba(75, 192, 192, 0.4)", "rgba(54, 162, 235, 0.4)", "rgba(153, 102, 255, 0.4)", "rgba(201, 203, 207, 0.4)","rgba(255, 99, 132, 0.4)", "rgba(255, 159, 64, 0.4)", "rgba(255, 205, 86, 0.4)", "rgba(75, 192, 192, 0.4)", "rgba(54, 162, 235, 0.4)", "rgba(153, 102, 255, 0.4)", "rgba(201, 203, 207, 0.4)"];
    useEffect(() => {
        if (chartRefSingle.current) {
            const contextSingle = chartRefSingle
                .current
                .getContext("2d");
            new Chart(contextSingle, {
                type: 'line',
                data: {
                    datasets: _.map(normalizedLifts, (liftData) => {
                        const { liftName }  = liftData[0];
                        const color = chartColors[0]
                        return {
                            label: liftName,
                            backgroundColor: color,
                            borderColor: color,
                            fill: false,
                            lineTension: 0,
                            data: unifiedLift.map(d => {
                                return {
                                    t: new Date(d.timestamp),
                                    y: d.meanNormalizedLift
                                }
                            })
                        }
                    })
                },
                options: {
                    title: {
                        display: true,
                        text: [
                            `Mean lift over time, normalized`
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
        }
        if (chartRefFull.current) {
            const contextFull = chartRefFull
                .current
                .getContext("2d");
            new Chart(contextFull, {
                type: 'line',
                data: {
                    datasets: _.map(normalizedLifts, (liftData) => {
                        const { liftName }  = liftData[0];
                        const color = chartColors[liftNames.indexOf(liftName)];
                        return {
                            label: liftName,
                            backgroundColor: color,
                            borderColor: color,
                            fill: false,
                            data: liftData.map(d => {
                                return {
                                    t: new Date(d.timestamp),
                                    y: d.normalizedOneRepMax
                                }
                            })
                        };
                    })
                },
                options: {
                    title: {
                        display: true,
                        text: [
                            `All lifts over time, normalized`
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
        }
    }, [ormEntries]);

    if (!ormEntries.length) {
        return null;
    }

    return (
        <React.Fragment>
            <div className='horizontal-spanning-segment'>
                <canvas
                    ref={chartRefSingle}
                />
            </div>
            <div className='horizontal-spanning-segment'>
                <canvas
                    ref={chartRefFull}
                />
            </div>
        </React.Fragment>
    );
}

export default NormalizedOrmGraph;