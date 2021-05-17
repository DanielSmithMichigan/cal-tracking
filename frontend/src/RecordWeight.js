import React, { useState } from 'react';

import { getFormId } from './util';

import { recordWeight } from './weights/api';

import store from './RootStore';

export default function RecordWeight() {
    const [weight, setWeight] = useState('');

    const recordWeightButton = () => {
        store.dispatch(
            recordWeight({ weight })
        );
        setWeight('');
    };

    return (
        <div className="horizontal-spanning-segment extra-padding">
            <form id="record-weight-form">
                <div className="form-group">
                    <input
                        id={getFormId({ name: 'weight' })}
                        className="form-control"
                        type="number"
                        min="0"
                        max="100000"
                        step="1"
                        value={weight}
                        onChange={(event) => setWeight(event.target.value)}
                        required />
                    
                    <small>Weight(lb)</small>
                </div>
                <div className="form-group">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={recordWeightButton}>
                        Record Weight
                    </button>
                </div>
            </form>
        </div>
    )
}