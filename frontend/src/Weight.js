import React, { useState, useEffect } from 'react';

import ResetPageButton from './ResetPageButton';
import RecordWeight from './RecordWeight';
import WeightHistoryTable from './WeightHistoryTable';
import WeightProgress from './WeightProgress';
import DietSummary from './DietSummary';
import Header from './Header';

export default function Weight() {
    return (
        <React.Fragment>
            <Header />
            <RecordWeight />
            <DietSummary />
            <WeightProgress />
            <WeightHistoryTable />
        </React.Fragment>
    );
}