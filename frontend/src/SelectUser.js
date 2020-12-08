import React, { useState, useEffect } from 'react';
import { getFormId, getFormElementValue } from './util';
import fetch from 'cross-fetch';

import * as _ from 'lodash';

function SignUp({ user }) {
    function goToUserPage() {
        const userId = getFormElementValue({ name: 'user-id' });
        window.location.href = `/index.html?user=${userId}`;
    }
    return (
        <div>
            <div className='header-text'>
                Hello, please enter your username.
            </div>
            <div className='horizontal-spanning-segment row'>
                <div className="col-md-12">
                    <form>
                        <div className="form-group">
                            <input
                                id={getFormId({ name: 'user-id' })}
                                type="text"
                                className="form-control"
                                required />
                                
                            <small>Username</small>
                        </div>
                        <div className="form-group">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={goToUserPage}>
                                SUBMIT
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}


export default SignUp;
