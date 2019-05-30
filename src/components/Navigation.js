import React from 'react';
import {Link} from "react-router-dom";
import '../styles/Navigation.css';

import * as ROUTES from '../constants/routes';

const Navigation = (props) => (
    <nav className="navBar">
        <Link to={ROUTES.LANDING}>
            <button className="headerButton" onClick={() => props.changeCat("dumbordumber")}>
                Dumb Or Dumber
            </button>
        </Link>
        <Link to={ROUTES.LANDING}>
            <button className="headerButton" onClick={() => props.changeCat("flyorfail")}>
                Fly or Fail
            </button>
        </Link>
        <Link to={ROUTES.LANDING}>
            <button className="headerButton" onClick={() => props.changeCat("litorlame")}>
                Lit or Lame
            </button>
        </Link>
        <Link to={ROUTES.LANDING}>
            <button className="headerButton" onClick={() => props.changeCat("funnyorflat")}>
                Funny or Flat
            </button>
        </Link>
        <Link to={ROUTES.LANDING}>
            <button className="headerButton" onClick={() => props.changeCat("weirdorwonderful")}>
                Weird or Wonderful
            </button>
        </Link>
    </nav>
);

export default Navigation;
