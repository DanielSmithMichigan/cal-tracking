import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import InputOutputGraph from "./InputOutputGraph";
import ResetPageButton from './ResetPageButton';
import MealTimingGraph from './MealTimingGraph';
import CalorieHistoryGraph from './CalorieHistoryGraph';
import TDEEOverTime from './TDEEOverTime';

export default function() {
    return (
        <React.Fragment>
            <ResetPageButton />
            <CalorieHistoryGraph />
            <MealTimingGraph
                mealAttribute={"calories"}
            />
            <MealTimingGraph
                mealAttribute={"protein"}
            />
            <InputOutputGraph />
            <TDEEOverTime />
        </React.Fragment>
    )
}