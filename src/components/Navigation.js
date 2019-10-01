import React from 'react';
import {Link} from "react-router-dom";
import '../styles/Navigation.css';

import * as ROUTES from '../constants/routes';

const Navigation = (props) => (
    <nav className="navBar">
        <Link to={ROUTES.LANDING}>
            <button className="headerButton" onClick={() => props.changeCat("tastyorterrible")}>
                TastyorTerrible
            </button>
        </Link>
        <Link to={ROUTES.LANDING}>
            <button className="headerButton" onClick={() => props.changeCat("flyorfail")}>
                FlyorFail
            </button>
        </Link>
        <Link to={ROUTES.LANDING}>
            <button className="headerButton" onClick={() => props.changeCat("litorlame")}>
                LitorLame
            </button>
        </Link>
        <Link to={ROUTES.LANDING}>
            <button className="headerButton" onClick={() => props.changeCat("funnyorflat")}>
                FunnyorFlat
            </button>
        </Link>
        <Link to={ROUTES.LANDING}>
            <button className="headerButton" onClick={() => props.changeCat("weirdorwonderful")}>
                WeirdorWonderful
            </button>
        </Link>
    </nav>
);

export default Navigation;
