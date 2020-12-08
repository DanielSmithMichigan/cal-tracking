import React, { useState, useEffect } from 'react';

import { getFormId, getFormElementValue } from './util';

import { dispatchFormElementValue } from './webData/actions';

import store from './RootStore';

export default function() {
    return (
        <div className="horizontal-spanning-segment extra-padding">
            <form id="new-lift-name-form">
                <div className="form-group">
                    <input
                        id={getFormId({ name: 'lifts/new-lift-name' })}
                        className="form-control"
                        type="text"
                        required />
                    
                    <small>Lift Name</small>
                </div>
                <div className="form-group">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={goToLift}>
                        Go To Lift Page
                    </button>
                </div>
            </form>
        </div>
    )
}

function goToLift() {
    const liftName = getFormElementValue({ name: 'lifts/new-lift-name' });
    dispatchFormElementValue({ name: 'orm/weight', value: null });
    store.dispatch({ type: 'SET_LIFT_NAME', liftName });
}