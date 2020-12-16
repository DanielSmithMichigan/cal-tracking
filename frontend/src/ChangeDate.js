import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import './stylesheets/buttons.css';

import { selectCurrentDate, selectIsModified, selectUserDateSelection } from './currentDate/selectors';
import { dispatchResetCurrentDate, dispatchUserDateSelection, dispatchSetCurrentDate } from './currentDate/actions';

import { ymd } from './util';

function ChangeDate() {
    const currentDate = useSelector(selectCurrentDate);
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
                onClick={() => dispatchSetCurrentDate({ date: userDateSelection })}>
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
    dispatchUserDateSelection({ userDateSelection: new Date(year, month - 1, day ) });
}

export default ChangeDate;