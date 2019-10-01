import React from 'react';

import { withFirebase } from "./Firebase";
import { withRouter } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import '../styles/NewPostAndSigning.css';



const SignOutButton = (props) => {
    return (
        <button type="button" className="signOutButton" onClick={() => {
            props.history.push(ROUTES.LANDING);
            window.location.reload();
            props.firebase.doSignOut();
        }}>
            Sign Out
        </button>
    );
};

export default withRouter(withFirebase(SignOutButton));
