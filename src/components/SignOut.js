import React from 'react';

import { withFirebase } from "./Firebase";
import { withRouter } from 'react-router-dom';
import * as ROUTES from '../constants/routes';


const buttonStyle = {
    borderRadius: '20px',
};

const SignOutButton = (props) => {
    return (
        <button type="button" style={buttonStyle} onClick={() => {
            props.history.push(ROUTES.LANDING);
            window.location.reload();
            props.firebase.doSignOut();
        }}>
            Sign Out
        </button>
    );
};

export default withRouter(withFirebase(SignOutButton));
