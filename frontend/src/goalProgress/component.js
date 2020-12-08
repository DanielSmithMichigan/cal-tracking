import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import { getNextHour, msPerHour, getStartEndTime } from '../util';

import constants from './constants';

import { selectGoal } from '../goals/selectors';
import { selectDiaryEntries } from '../diaryEntries/selectors';

import TimeOfDay from '../components/timeOfDay';

function SingleGoalProgress({
    goalName
}) {
    const goal = useSelector ( selectGoal({ goalName: `${goalName}PerDay` }) );
    const goalAmountPerDay = goal.value;

    const firstMealTime = useSelector ( selectGoal({ goalName: 'firstMealTime' }) ).value;
    const lastMealTime = useSelector ( selectGoal({ goalName: 'lastMealTime' }) ).value;
    const labelPlural = _.get(constants, `pluralLabels.${goalName}`, goalName);


    const diaryEntries = useSelector( selectDiaryEntries({ days: 0 }) );

    const consumedAmount = Math.round(_.sumBy(diaryEntries, `meal.${goalName}`));

    const { startTime, endTime } = getStartEndTime({ firstMealTime, lastMealTime });
    const hoursElapsed = (new Date().getTime() - startTime.getTime()) / msPerHour;
    const msPerDay = endTime.getTime() - startTime.getTime();
    const goalConsumedPerMs = goalAmountPerDay / msPerDay;
    const goalConsumedPerHour = Math.round(goalConsumedPerMs * msPerHour);
    const unclampedGoalConsumedAmount = Math.round(hoursElapsed * goalConsumedPerHour);
    const goalConsumedAmount = Math.max(0, Math.min(goalAmountPerDay, unclampedGoalConsumedAmount));
    const differenceConsumedVsGoal = Math.round(goalConsumedAmount - consumedAmount);
    const differenceConsumedVsDay = Math.round(goalAmountPerDay - consumedAmount);
    const surplusLanguage = differenceConsumedVsGoal < 0 ? 'surplus' : 'deficit';
    const surplusSymbol = differenceConsumedVsGoal < 0 ? '+' : '-';
    const surplusLanguageDay = differenceConsumedVsDay < 0 ? 'surplus' : 'deficit';
    const surplusSymbolDay = differenceConsumedVsDay < 0 ? '+' : '-';
    return (
        <div className='horizontal-spanning-segment'>
            For <TimeOfDay time={new Date()}/>, you are at {consumedAmount}/{goalConsumedAmount} (<span className={surplusLanguage}>{surplusSymbol} {Math.abs(differenceConsumedVsGoal)}</span>) {labelPlural}. <br />
            For your daily goal, you are at {consumedAmount}/{goalAmountPerDay} (<span className={surplusLanguageDay}>{surplusSymbolDay} {Math.abs(differenceConsumedVsDay)}</span>).<br />
        </div>
    );
}

export default SingleGoalProgress;
