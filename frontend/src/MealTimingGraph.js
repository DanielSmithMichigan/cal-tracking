import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Chart from "chart.js";
import './App.css';

import * as _ from 'lodash';

import { msPerDay, findLineByLeastSquares, calculateLinearFitError, ymd } from './util';

import { addDays, differenceInCalendarDays, startOfDay, format } from 'date-fns';

import { selectDiaryEntries } from './diaryEntries/selectors';

function getAveragePerDayByHour({ diaryEntries, mealAttribute }) {
    const mealsByHour = _.groupBy(
        diaryEntries,
        e => format(new Date(e.timestamp), "h a")
    );
    const totalDays = Object.values(_.groupBy(diaryEntries, e => ymd(e.timestamp))).length;
    return _.chain(mealsByHour)
        .map((listOfDataForHour, hourKey) => {
            const groupedByDay = _.groupBy(listOfDataForHour, e => ymd(e.timestamp));
            const summedPerDay = _.map(groupedByDay, listForDay => _.sumBy(listForDay, `meal.${mealAttribute}`));
            const meanByDay = _.sum(summedPerDay) / totalDays;
            return {
                hourKeyNumeric: Number(format(new Date(_.first(listOfDataForHour).timestamp), "HH")),
                hourKey,
                meanByDay: _.round(meanByDay)
            };
        })
        .orderBy("hourKeyNumeric")
        .value();
}

function MealTimingGraph({ mealAttribute }) {
    const diaryEntries = useSelector( selectDiaryEntries() );
    const mealTimingData = getAveragePerDayByHour({ mealAttribute, diaryEntries });
    let chartRef = React.createRef();
    useEffect(() => {
        const context = chartRef
            .current
            .getContext("2d");
        new Chart(context, {
            type: 'bar',
            data: {
                datasets: [
                    {
                        data: _.map(mealTimingData, "meanByDay"),
                        backgroundColor: ["rgba(255, 99, 132, 0.4)", "rgba(255, 159, 64, 0.4)", "rgba(255, 205, 86, 0.4)", "rgba(75, 192, 192, 0.4)", "rgba(54, 162, 235, 0.4)", "rgba(153, 102, 255, 0.4)", "rgba(201, 203, 207, 0.4)","rgba(255, 99, 132, 0.4)", "rgba(255, 159, 64, 0.4)", "rgba(255, 205, 86, 0.4)", "rgba(75, 192, 192, 0.4)", "rgba(54, 162, 235, 0.4)", "rgba(153, 102, 255, 0.4)", "rgba(201, 203, 207, 0.4)","rgba(255, 99, 132, 0.4)", "rgba(255, 159, 64, 0.4)", "rgba(255, 205, 86, 0.4)", "rgba(75, 192, 192, 0.4)", "rgba(54, 162, 235, 0.4)", "rgba(153, 102, 255, 0.4)", "rgba(201, 203, 207, 0.4)"],
                        borderColor: ["rgb(255, 99, 132)", "rgb(255, 159, 64)", "rgb(255, 205, 86)", "rgb(75, 192, 192)", "rgb(54, 162, 235)", "rgb(153, 102, 255)", "rgb(201, 203, 207)","rgb(255, 99, 132)", "rgb(255, 159, 64)", "rgb(255, 205, 86)", "rgb(75, 192, 192)", "rgb(54, 162, 235)", "rgb(153, 102, 255)", "rgb(201, 203, 207)","rgb(255, 99, 132)", "rgb(255, 159, 64)", "rgb(255, 205, 86)", "rgb(75, 192, 192)", "rgb(54, 162, 235)", "rgb(153, 102, 255)", "rgb(201, 203, 207)"]
                    }
                ],
                labels: _.map(mealTimingData, "hourKey")
            },
            options: {
                title: {
                    display: true,
                    text: [
                        `${_.startCase(mealAttribute)} Timing`
                    ]
                },
                legend: {
                    display: false,
                }
            }
        });
    }, [diaryEntries]);

    return (
        <div className='horizontal-spanning-segment'>
            <canvas
                ref={chartRef}
            />
        </div>
    );
}

export default MealTimingGraph;