import React, { useState, useEffect } from 'react';

import { getUserId } from './util';

import { userInitialization } from './Initialization';

import './stylesheets/buttons.css';

import store from './RootStore';

import ChangeDate from './ChangeDate';

function DashboardMenu() {
    return (
        <div className="text-center">
            <div>
                <div
                    className="gradient-btn btn-5"
                    onClick={() => goToAppPage({ page: "LIFTING_MENU" })}>
                    <span>Lifting</span>
                </div>
            </div>
            <div>
                <div
                    className="gradient-btn btn-5"
                    onClick={() => goToAppPage({ page: "NUTRITION" })}>
                    <span>Nutrition</span>
                </div>
            </div>
            <div>
                <div
                    className="gradient-btn btn-5"
                    onClick={() => goToAppPage({ page: "WEIGHT" })}>
                    <span>Weight</span>
                </div>
            </div>
            <div>
                <div
                    className="gradient-btn btn-5"
                    onClick={() => goToAppPage({ page: "RECOMMENDATIONS" })}>
                    <span>Recommendations</span>
                </div>
            </div>
            <div>
                <div
                    className="gradient-btn btn-5"
                    onClick={() => goToAppPage({ page: "ANALYSIS" })}>
                    <span>Analysis</span>
                </div>
            </div>
            <div>
                <div
                    className="gradient-btn btn-5"
                    onClick={() => userInitialization() }>
                    <span>Refresh All Data</span>
                </div>
            </div>
            <ChangeDate />
        </div>
    );
}

function goToAppPage({ page }) {
    store.dispatch({ type: 'SET_PAGE', page });
}

export default DashboardMenu;