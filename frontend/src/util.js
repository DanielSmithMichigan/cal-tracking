import { format, differenceInCalendarDays } from 'date-fns';

import * as _ from 'lodash';

export const msPerHour = 60 * 60 * 1000;
export const msPerDay = 24 * msPerHour;
export const msPerWeek = 7 * msPerDay;
export const secPerWeek = msPerWeek / 1000;

export function getFormId({ name }) {
    return `formElement-${name}`;
}

export function getFormElementValue({ name }) {
    return _.get(document.getElementById(getFormId({ name })), 'value', null);
}

export function getUserId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('user');
}

export function getNextHour() {
    const currentTime = new Date();
    return new Date(Math.ceil(currentTime.getTime() / msPerHour) * msPerHour);
}

export function getStartEndTime({ firstMealTime, lastMealTime }) {
    const [ firstMealHour, firstMealMinute ] = firstMealTime.split(":");
    const [ lastMealHour, lastMealMinute ] = lastMealTime.split(":");
    const currentTime = new Date();
    const startTime = new Date(
        currentTime.getFullYear(),
        currentTime.getMonth(),
        currentTime.getDate(),
        firstMealHour,
        firstMealMinute
    );
    const endTime = new Date(
        currentTime.getFullYear(),
        currentTime.getMonth(),
        currentTime.getDate(),
        lastMealHour,
        lastMealMinute
    );
    return { startTime, endTime };
}

export function ymd(date) {
    return format( new Date(date) , 'yyyy-MM-dd');
}

export function entriesInRangeInclusive({ startOfRange, endOfRange, entries }) {
    return _.filter(
        entries,
        e => {
            const lt = e.timestamp <= endOfRange.toISOString();
            const gt = e.timestamp >= startOfRange.toISOString();
            return lt && gt;
        }
    );
}

export function findLineByLeastSquares(values_x, values_y) {
    /** 
     * NOT MY CODE.
     * AUTHOR: https://dracoblue.net/dev/linear-least-squares-in-javascript/ 
     */
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var count = 0;

    /*
     * We'll use those variables for faster read/write access.
     */
    var x = 0;
    var y = 0;
    var values_length = values_x.length;

    if (values_length != values_y.length) {
        throw new Error('The parameters values_x and values_y need to have same size!');
    }

    /*
     * Nothing to do.
     */
    if (values_length === 0) {
        return [ [], [] ];
    }

    /*
     * Calculate the sum for each of the parts necessary.
     */
    for (var v = 0; v < values_length; v++) {
        x = values_x[v];
        y = values_y[v];
        sum_x += x;
        sum_y += y;
        sum_xx += x*x;
        sum_xy += x*y;
        count++;
    }

    /*
     * Calculate m and b for the formular:
     * y = x * m + b
     */
    var m = (count*sum_xy - sum_x*sum_y) / (count*sum_xx - sum_x*sum_x);
    var b = (sum_y/count) - (m*sum_x)/count;
    return [m, b];
}

export function weightsSlopeIntercept({ weights }) {
    const firstRecording = _.chain(weights)
        .orderBy(["timestamp"], ["asc"])
        .first()
        .value();
    const x = weights.map(
        w => differenceInCalendarDays(
            new Date(w.timestamp),
            new Date(firstRecording.timestamp)
        )
    )
    const y = weights.map(
        w => w.weight
    );
    const [ slope, intercept ] = findLineByLeastSquares(
        x,
        y
    )
    return [ slope, intercept ];
}

/*
    Original Error: 5413973.399602467
    Reduced Error: 522075.7874051621
    Original Error: 492179.39996386063
    Reduced Error: 58008.4208227958
*/

export function calculateLinearFitError({ xyPairs, slope, intercept}) {
    return _.meanBy(
        xyPairs,
        ({x, y}) => Math.pow((slope * x + intercept) - y, 2)
    );
}

export function standardDeviation(array) {
    var avg = _.sum(array) / array.length;
    return Math.sqrt(_.sum(_.map(array, (i) => Math.pow((i - avg), 2))) / array.length);
}