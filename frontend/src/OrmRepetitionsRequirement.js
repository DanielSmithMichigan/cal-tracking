import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import { getUserId, getFormElementValue } from './util';

import './stylesheets/buttons.css';
import './stylesheets/basic.css';

import RecordOrmEntry from './RecordOrmEntry';
import OrmHistoryTable from './OrmHistoryTable';
import OrmHistoryGraph from './OrmHistoryGraph';

import store from './RootStore';

import { selectOrmEntries } from './ormEntries/selectors';

import { calculateOneRepMax } from './ormEntries/helpers';
import { addBusinessDays } from 'date-fns';

import { deleteOrmEntry } from './ormEntries/api';
import { selectLiftName, selectFormElementValue } from './webData/selectors';

function OrmRepetitionsRequirement() {
    const selectedLiftName = useSelector ( selectLiftName );
    const ormEntries = useSelector( selectOrmEntries({ liftName: selectedLiftName }) );
    const keyedInLiftWeight = useSelector( selectFormElementValue({ name: 'orm/weight' }) );
    if (keyedInLiftWeight === null || !Number(keyedInLiftWeight)) {
        return null;
    }
    
    const lastRecording = _.chain(ormEntries)
        .orderBy(['timestamp'], ['asc'])
        .last()
        .value();

    if (!lastRecording) {
        return null;
    }
    
    const previousORecordingOneRepMax = calculateOneRepMax({ weight: lastRecording.weight, repetitions: lastRecording.repetitions });

    let requiredLift = null;
    for (let i = 0; i < 100; i++) {
        const oneRepMax = calculateOneRepMax({ weight: keyedInLiftWeight, repetitions: i });
        if (oneRepMax > previousORecordingOneRepMax) {
            requiredLift = i;
            break;
        }
    }
    
    if (requiredLift === null) {
        return null;
    }
    return (
        <div className="horizontal-spanning-segment extra-padding">
            At {keyedInLiftWeight} lbs, you need to do at least {requiredLift} repetitions to exceed your previous one-rep max.
        </div>
    );
}

export default OrmRepetitionsRequirement;