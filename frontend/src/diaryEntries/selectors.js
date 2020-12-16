import React, { useState, useEffect } from 'react';
import { getFormId, getFormElementValue, getUserId, getStartEndTime } from '../util';
import { goalsApi, mealsApi, diaryApi, weightApi } from '../constants';
import _ from 'lodash';

import { differenceInDays, startOfDay, endOfDay, subDays } from 'date-fns';

export function selectDiaryEntries({ days = "ALL", currentDate = new Date() } = {}) {
    let start, end;
    if (days !== 'ALL') {
        start = startOfDay(
            subDays(
                currentDate,
                days
            )
        );
        end = endOfDay( currentDate );
    }
    return state => {
        return _.filter(
            _.get(state, 'diaryEntries.all', []),
            entry => {
                if (days === "ALL") {
                    return true;
                }
                const before = entry.timestamp >= start.toISOString();
                const after = entry.timestamp <= end.toISOString();
                return before && after;
            }
        );
    };
}