import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import { getUserId } from './util';

import './stylesheets/buttons.css';
import './stylesheets/basic.css';

import RecordOrmEntry from './RecordOrmEntry';
import OrmHistoryTable from './OrmHistoryTable';
import OrmHistoryGraph from './OrmHistoryGraph';
import OrmRepetitionsRequirement from './OrmRepetitionsRequirement';

import store from './RootStore';

import { selectOrmEntries } from './ormEntries/selectors';

function LiftingPage() {
    return (
        <React.Fragment>
            <div className="text-center full">
                <div
                    className="gradient-btn btn-5"
                    onClick={() => goToLift({ liftName: null })}>
                    <span>Back</span>
                </div>
            </div>

            <RecordOrmEntry />
            <OrmRepetitionsRequirement />
            <OrmHistoryGraph />
            <OrmHistoryTable />
        </React.Fragment>
    );
}

function goToLift({ liftName }) {
    store.dispatch({ type: 'SET_LIFT_NAME', liftName });
}

export default LiftingPage;