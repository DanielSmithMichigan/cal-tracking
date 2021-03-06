import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import InputOutputGraph from "./InputOutputGraph";
import ResetPageButton from './ResetPageButton';
import MealTimingGraph from './MealTimingGraph';
import CalorieHistoryGraph from './CalorieHistoryGraph';
import TDEEOverTime from './TDEEOverTime';
import CaloriesRecommendation from './CaloriesRecommendation';
import DietAdherence from './DietAdherence';
import Header from './Header';
import ModelAccuracy from './ModelAccuracy';

export default function() {
    return (
        <React.Fragment>
            <Header />
            <DietAdherence goal={"calories"} />
            <DietAdherence goal={"protein"} />
            {/* <CalorieHistoryGraph /> */}
            <MealTimingGraph
                mealAttribute={"calories"}
            />
            <MealTimingGraph
                mealAttribute={"protein"}
            />
            <InputOutputGraph />
            <TDEEOverTime />
            <ModelAccuracy />
        </React.Fragment>
    )
}