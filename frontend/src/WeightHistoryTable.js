import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import { selectWeights } from './weights/selectors';
import { deleteWeightEntry } from './weights/api';

import store from './RootStore';

export default function () {
    const weights = useSelector( selectWeights() );
    console.log(weights);
    return (
        <div className="horizontal-spanning-segment">
            <table className="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>lbs</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        weights.map(
                            (entry, k) => (<tr key={k}>
                                <td>{entry.weight}</td>
                                <td>{new Date(entry.timestamp).toDateString()}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="button8"
                                        onClick={() => store.dispatch( deleteWeightEntry({ timestamp: entry.timestamp }) ) }>
                                        x
                                    </button>
                                </td>
                            </tr>)
                        )
                    }
                </tbody>
            </table>
        </div>
    );
}