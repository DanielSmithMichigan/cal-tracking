import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import './stylesheets/buttons.css';

import { selectPage, selectIsLoading } from './webData/selectors';

import { userInitialization } from './Initialization';
import DashboardMenu from './DashboardMenu';
import LiftingMenu from './LiftingMenu';
import Nutrition from './Nutrition';
import Weight from './Weight';
import Analysis from './Analysis';

function Dashboard() {
    const isLoading = useSelector(selectIsLoading);
    useEffect(() => {
        userInitialization();
    }, []);
    const page = useSelector(selectPage);
    if (isLoading) {
        return "Loading user data...";
    }
    switch (page) {
        case null:
            return (<DashboardMenu />);
        case "LIFTING_MENU":
            return (<LiftingMenu />);
        case "NUTRITION":
            return (<Nutrition />);
        case "WEIGHT":
            return (<Weight />);
        case 'ANALYSIS':
            return (<Analysis />);
    }
}

export default Dashboard;