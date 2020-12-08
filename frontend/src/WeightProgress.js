import React, { useState, useEffect } from 'react';
import Chart from "chart.js";
import './App.css';

import * as _ from 'lodash';

import { entriesInRangeInclusive, msPerWeek } from './util';

import { startOfDay, endOfDay, subDays } from 'date-fns';

import WeightHistoryGraph from './WeightHistoryGraph';


function WeightProgress() {
    const importantRanges = [14, 30, null];
    
    return importantRanges.map(range => (
        <WeightHistoryGraph
            key={`range_${range}`}
            numDays={range}
            />
    ));
}

export default WeightProgress;