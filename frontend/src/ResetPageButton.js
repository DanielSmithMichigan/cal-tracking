import React, { useState, useEffect } from 'react';

import store from './RootStore';

export default function ResetPageButton () {
    return (
        <div className="text-center">
            <div
                className="gradient-btn btn-5"
                onClick={() => goToAppPage({ page: null })}>
                <span>Back</span>
            </div>
        </div>
    );
}

function goToAppPage({ page }) {
    store.dispatch({ type: 'SET_PAGE', page });
}

