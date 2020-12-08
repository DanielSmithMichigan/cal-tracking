import React, { useState, useEffect } from 'react';
import { getFormId, getFormElementValue, getUserId, getStartEndTime } from '../util';
import { goalsApi, mealsApi, diaryApi, weightApi } from '../constants';
import _ from 'lodash';

import { differenceInDays, startOfDay, endOfDay, subDays } from 'date-fns';

export function selectMeals() {
    return state => _.get(state, 'meals.all', [])
}