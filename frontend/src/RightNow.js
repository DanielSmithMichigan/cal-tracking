import React, { useState, useEffect } from 'react';

import { startOfHour, addHours } from 'date-fns';
import TimeOfDay from './components/timeOfDay';

export default function() {
    return (
        <div className="horizontal-spanning-segment">
            It's <TimeOfDay time={new Date()}></TimeOfDay>, <br />
            As of <TimeOfDay time={ startOfHour( addHours( new Date(), 1 ) )}></TimeOfDay>
        </div>
    );
}