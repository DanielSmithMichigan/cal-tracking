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
import Header from './Header';

function Dashboard() {
    const isLoading = useSelector(selectIsLoading);
    useEffect(() => {
        userInitialization();
    }, []);
    const page = useSelector(selectPage);
    if (isLoading) {
        return "Loading user data...";
    }

    const out = [
        <Header />
    ];
    switch (page) {
        case null:
            return (<DashboardMenu />);
        case "LIFTING_MENU":
            out.push(<LiftingMenu />);
            break;
        case "NUTRITION":
            out.push(<Nutrition />);
            break;
            return (<Nutrition />);
        case "WEIGHT":
            out.push(<Weight />);
            break;
        case 'ANALYSIS':
            out.push(<Analysis />);
            break;
    }
    return out;
}

export default Dashboard;