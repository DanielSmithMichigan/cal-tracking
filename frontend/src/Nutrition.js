import React, { useState, useEffect } from 'react';

import SingleGoalProgress from './goalProgress/component';
import ResetPageButton from './ResetPageButton';
import DiaryEntriesToday from './DiaryEntriesToday';
import RecordMeal from './RecordMeal';
import ExistingMeals from './ExistingMeals';
import RightNow from './RightNow';

export default function Nutrition() {
    return (
        <React.Fragment>
            <SingleGoalProgress
                goalName='calories'
            />
            <SingleGoalProgress
                goalName='protein'
            />
            <DiaryEntriesToday />
            <RecordMeal />
            <ExistingMeals />
        </React.Fragment>
    );
}