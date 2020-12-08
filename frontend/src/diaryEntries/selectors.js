import React, { useState, useEffect } from 'react';
import { getFormId, getFormElementValue, getUserId, getStartEndTime } from '../util';
import { goalsApi, mealsApi, diaryApi, weightApi } from '../constants';
import _ from 'lodash';

import { differenceInDays, startOfDay, endOfDay, subDays } from 'date-fns';

export function selectDiaryEntries({ days = "ALL" } = {}) {
    return state => {
        return _.filter(
            _.get(state, 'diaryEntries.all', []),
            entry => days === "ALL" || entry.timestamp > startOfDay(subDays(new Date(), days)).toISOString()
        );
    };
}