import React, { useState, useEffect } from 'react';
import './App.css';

import fetch from 'cross-fetch';

import { getFormId, getFormElementValue, getUserId } from './util';

import Dashboard from './Dashboard';
import SetGoals from './SetGoals';
import SelectUser from './SelectUser';

import { goalsApi } from './constants';

function App() {
    const [innerPage, setInnerPage] = useState("LOADING");
    useEffect(() => {
        getInnerPage()
            .then(innerPage => setInnerPage(innerPage));
    });
    switch (innerPage) {
        case 'LOADING':
            return 'Checking if user exists...';
        case 'SELECT_USER':
            return (
                <SelectUser />
            )
        case 'SET_GOALS':
            return (
                <SetGoals />
            )
        case 'DASHBOARD':
            return (
                <Dashboard />
            )
    }
    return (
        <div className='app'>
            {getInnerPage()}
        </div>
    );

    async function getInnerPage() {
        const user = getUserId();

        if (user === null) return 'SELECT_USER';

        const goalsExist = await checkGoalsExist({ user });
        if (!goalsExist) {
            return 'SET_GOALS';
        }

        return 'DASHBOARD';
    }

    function checkGoalsExist({ user }) {
        return fetch(`${goalsApi}/check-goals-exist`, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user
            })
        }).then(response => response.json())
            .then(responseJson => responseJson.userExists);
    }
}

export default App;
