import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import _ from 'lodash';

import './stylesheets/buttons.css';

import { selectModifiedDate, selectIsModified, selectUserDateSelection } from './currentDate/selectors';
import { dispatchResetCurrentDate, dispatchUserDateSelection, dispatchSetCurrentDate } from './currentDate/actions';

import { endOfDay, subMilliseconds } from 'date-fns';

import { ymd } from './util';

function ChangeDate() {
    const modifiedDate = useSelector(selectModifiedDate);
    const currentDate = modifiedDate || new Date();
    const isModified = useSelector(selectIsModified);
    const userDateSelection = useSelector(selectUserDateSelection);


    return (<React.Fragment>
        <div className="horizontal-spanning-segment extra-padding">
            <p>Current date is: {currentDate.toDateString()}</p>
            {allowReset({ isModified })}
            {dateModificationForm({ currentDate, userDateSelection })}

        </div>
    </React.Fragment>);
}

function allowReset({ isModified }) {
    if (!isModified) {
        return null
    }
    return (<p onClick={dispatchResetCurrentDate}>
        [reset]
    </p>);
}

function dateModificationForm({ currentDate, userDateSelection }) {
    return (<React.Fragment>   
        <div className="form-group">
            <input
                type="date"
                id="start"
                name="trip-start"
                value={ymd(userDateSelection)}
                onChange={captureSelection}
                />
        </div> 
        <div className="form-group">
            <button
                type="button"
                className="btn btn-primary"
                onClick={() => setCurrentDate({ userDateSelection })}>
                Set
            </button>
        </div>
    </React.Fragment>);
}

function captureSelection(event) {
    const [
        year,
        month,
        day
    ] = event.target.value.split("-");
    const baseYmd = new Date(year, month - 1, day );
    const userDateSelection = endOfDay(baseYmd);
    dispatchUserDateSelection({ userDateSelection });
}

function setCurrentDate({ userDateSelection }) {
    dispatchSetCurrentDate({ modifiedDate: userDateSelection })
}

export default ChangeDate;