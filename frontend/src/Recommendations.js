import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import CaloriesRecommendation from './CaloriesRecommendation';
import Header from './Header';

export default function() {
    return (
        <React.Fragment>
            <Header />
            <CaloriesRecommendation />
        </React.Fragment>
    )
}