import React from 'react';
import {Link} from "react-router-dom";
import * as ROUTES from '../constants/routes';

const Lost = () => {
    return (
        <div style={{display: 'flex', justifyContent: 'center', paddingTop: '10px'}}>
            <h1 style={{width: '50%', textAlign: 'center'}}>Hmmm, we're not sure we know what you're looking for.<br /><br />  Head on back to the home page <Link to={ROUTES.LANDING}>here</Link></h1>
        </div>
    );
};

export default Lost;
