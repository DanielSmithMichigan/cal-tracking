import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import * as _ from 'lodash';

import { getFormId, getFormElementValue, getUserId, getStartEndTime } from './util';
import { format } from 'date-fns';

import { selectOrmEntries } from './ormEntries/selectors';

import store from './RootStore';
import { deleteOrmEntry } from './ormEntries/api';
import { calculateOneRepMax } from './ormEntries/helpers';
import { selectLiftName } from './webData/selectors';

function OrmHistoryTable({}) {
    const selectedLiftName = useSelector ( selectLiftName );
    const ormEntries = useSelector( selectOrmEntries({ liftName: selectedLiftName }) );
    return (
        <div className="horizontal-spanning-segment">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th className="text-center">
                            
                        </th>
                        <th className="text-center">
                            Reps
                        </th>
                        <th className="text-center">
                            Weight
                        </th>
                        <th className="text-center">
                            ORM
                        </th>
                        <th>
                            
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        ormEntries.map((ormEntry, k) => 
                            (<tr key={k}>
                                <td>
                                    { format(new Date(ormEntry.timestamp), 'MMM d, yyyy') }
                                </td>
                                <td>
                                    { ormEntry.repetitions }
                                </td>
                                <td>
                                    { ormEntry.weight }
                                </td>
                                <td>
                                    { _.round(calculateOneRepMax({ weight: ormEntry.weight, repetitions: ormEntry.repetitions }), 1) }
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        onClick={() => deleteOrmEntryButton({ ormEntry })}>
                                        x
                                    </button>
                                </td>
                            </tr>
                            )
                        )
                    }
                </tbody>
            </table>
        </div>
    );
}

function deleteOrmEntryButton({ ormEntry }) {
    const {
        user,
        liftName,
        timestamp
    } = ormEntry;
    store.dispatch(
        deleteOrmEntry({
            user,
            liftName,
            timestamp
        })
    );
}

export default OrmHistoryTable;