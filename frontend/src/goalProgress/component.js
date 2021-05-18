import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import { getNextHour, msPerHour, getStartEndTime } from '../util';
import { startOfDay, subDays, differenceInHours } from 'date-fns';

import constants from './constants';

import { selectGoal } from '../goals/selectors';
import { selectDiaryEntries } from '../diaryEntries/selectors';
import { selectModifiedDate } from '../currentDate/selectors';

import TimeOfDay from '../components/timeOfDay';

const historicalDays = 7;

function SingleGoalProgress({
    goalName
}) {
    const goal = useSelector ( selectGoal({ goalName: `${goalName}PerDay` }) );
    const goalAmountPerDay = goal.value;

    const firstMealTime = useSelector ( selectGoal({ goalName: 'firstMealTime' }) ).value;
    const lastMealTime = useSelector ( selectGoal({ goalName: 'lastMealTime' }) ).value;
    const labelPlural = _.get(constants, `pluralLabels.${goalName}`, goalName);


    const modifiedDate = useSelector( selectModifiedDate );
    const currentDate = modifiedDate || new Date();
    const diaryEntries = useSelector( selectDiaryEntries({ days: 0, currentDate }) );

    const consumedAmount = Math.round(_.sumBy(diaryEntries, `meal.${goalName}`));

    const { startTime, endTime } = getStartEndTime({ firstMealTime, lastMealTime });
    const hoursElapsed = (currentDate.getTime() - startTime.getTime()) / msPerHour;
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

    const historicalEntries = useSelector( selectDiaryEntries({ days: historicalDays - 1, currentDate }) );
    const historicalConsumedAmount = _.round( _.sumBy(historicalEntries, `meal.${goalName}`) );
    const historicalGoalConsumedAmount = Math.round((historicalDays - 1) * goalAmountPerDay + unclampedGoalConsumedAmount);
    const differenceConsumedVsHistoricalGoal = Math.round(historicalGoalConsumedAmount - historicalConsumedAmount);
    const surplusLanguageHistorical = differenceConsumedVsHistoricalGoal < 0 ? 'surplus' : 'deficit';
    const surplusSymbolHistorical = differenceConsumedVsHistoricalGoal < 0 ? '+' : '-';
    return (
        <div className='horizontal-spanning-segment'>
            For <TimeOfDay time={new Date()}/>, you are at {consumedAmount}/{goalConsumedAmount} (<span className={surplusLanguage}>{surplusSymbol} {Math.abs(differenceConsumedVsGoal)}</span>) {labelPlural}. <br />
            For your daily goal, you are at {consumedAmount}/{goalAmountPerDay} (<span className={surplusLanguageDay}>{surplusSymbolDay} {Math.abs(differenceConsumedVsDay)}</span>).<br />
            For {historicalDays} days, you are at {historicalConsumedAmount}/{historicalGoalConsumedAmount} (<span className={surplusLanguageHistorical}>{surplusSymbolHistorical} {Math.abs(differenceConsumedVsHistoricalGoal)}</span>).<br />
            {goalName === 'calories' && ConsumptionOnly({ diaryEntries, goalName }) }
        </div>
    );
}

function ConsumptionOnly({ diaryEntries, goalName }) {
    const positiveDiaryEntries = _.filter(diaryEntries, d => _.get(d, `meal.${goalName}`, 0) > 0);
    const positiveConsumedAmount = _.sumBy(positiveDiaryEntries, d => _.get(d, `meal.${goalName}`, 0));
    const negativeDiaryEntries = _.filter(diaryEntries, d => _.get(d, `meal.${goalName}`, 0) < 0);
    const negativeConsumedAmount = _.sumBy(negativeDiaryEntries, d => _.get(d, `meal.${goalName}`, 0));
    return (<React.Fragment>
        Consumed: {positiveConsumedAmount}<br />
        Burned: {negativeConsumedAmount}<br />
    </React.Fragment>);
}

export default SingleGoalProgress;
