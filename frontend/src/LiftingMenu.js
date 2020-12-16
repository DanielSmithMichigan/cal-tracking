import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import { getUserId } from './util';

import './stylesheets/buttons.css';

import LiftPage from './LiftPage';
import NewLiftForm from './NewLiftForm';

import store from './RootStore';

import { selectOrmEntries } from './ormEntries/selectors';
import { selectLiftName } from './webData/selectors';

import { dispatchFormElementValue } from './webData/actions';

import ResetPageButton from './ResetPageButton';
import NormalizedOrmGraph from './NormalizedOrmGraph';

function LiftingMenu() {
    const ormEntries = useSelector(selectOrmEntries());
    const selectedLiftName = useSelector(selectLiftName);
    if (selectedLiftName !== null) {
        return (<LiftPage />);
    }
    const lifts = _.uniq(_.map(ormEntries, "liftName"));
    return (<React.Fragment>
        {
            lifts.map(liftName => (
                <div className="text-center">
                    <div
                        className="gradient-btn btn-5"
                        onClick={() => goToLift({ liftName })}>
                        <span>{liftName}</span>
                    </div>
                </div>
            ))
        }
        <NewLiftForm />
        <NormalizedOrmGraph />
    </React.Fragment>);
}

function goToLift({ liftName }) {
    dispatchFormElementValue({ name: 'orm/weight', value: null });
    store.dispatch({ type: 'SET_LIFT_NAME', liftName });
}

export default LiftingMenu;