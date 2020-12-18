import _ from 'lodash';

import { getUserId } from '../util';

export function selectGoal({ goalName }) {
    return (state) => {
        const userId = getUserId();
        const allGoals = _.get(state, 'goals.all', []);
        const orderedGoals = _.orderBy(allGoals, ['timestamp'], ['desc']);
        return _.find(orderedGoals, {
            goalId: `${userId}/${goalName}`
        });
    }
};

export function selectGoalHistory({ goalName }) {
    return (state) => {
        const userId = getUserId();
        const allGoals = _.get(state, 'goals.all', []);
        const orderedGoals = _.orderBy(allGoals, ['timestamp'], ['desc']);
        return _.filter(orderedGoals, {
            goalId: `${userId}/${goalName}`
        });
    }
};