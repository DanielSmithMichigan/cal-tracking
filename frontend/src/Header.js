import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import ResetPageButton from './ResetPageButton';
import ChangeDate from './ChangeDate';

function Header() {
    return (<React.Fragment>
        <ResetPageButton />
        <ChangeDate />
    </React.Fragment>);
}

export default Header;