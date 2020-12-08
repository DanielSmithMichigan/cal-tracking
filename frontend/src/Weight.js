import React, { useState, useEffect } from 'react';

import ResetPageButton from './ResetPageButton';
import RecordWeight from './RecordWeight';
import WeightHistoryTable from './WeightHistoryTable';
import WeightProgress from './WeightProgress';
import DietSummary from './DietSummary';

export default function Weight() {
    return (
        <React.Fragment>
            <ResetPageButton />
            <RecordWeight />
            <DietSummary />
            <WeightProgress />
            <WeightHistoryTable />
        </React.Fragment>
    );
}