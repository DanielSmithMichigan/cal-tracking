import React, { useState, useEffect } from 'react';
import './App.css';

import * as _ from 'lodash';

import WeightHistoryGraph from './WeightHistoryGraph';


function WeightProgress() {
    const importantRanges = [30, null];
    
    return importantRanges.map(range => (
        <WeightHistoryGraph
            key={`range_${range}`}
            numDays={range}
            />
    ));
}

export default WeightProgress;