import React, {Component} from 'react';
import {Link} from "react-router-dom";
import SignOutButton from './SignOut';

import '../styles/Footer.css'

import * as ROUTES from '../constants/routes';

const Footer = ({authUser}) => (
    <div>
        {authUser ? <FooterAuth/> : <FooterNonAuth/>}
        <div className="bottomRight">
            <img src="logo.png" alt="logo" width="50%" height="50%"/>
        </div>
    </div>
);

class FooterAuth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchBarText: ''
        }
    }

    onChange = (event) => {
        this.setState({searchBarText: event.target.value});
    };

    onSearch = (event) => {
        // search functionality
        this.setState({searchBarText: ''});
    };

    render() {
        const {searchBarText} = this.state;

        return (
            <div className="bottomLeft">
                <div className="footerLink">
                    <label><span role="img" aria-label="plus emoji">➕</span></label>
                    <span><Link to={ROUTES.NEW_POST}>add a new post</Link></span> <br/>
                </div>

                <div className="footerLink">
                    <label htmlFor='footer-searchBar'>
                        <span role="img" aria-label="search emoji" style={{cursor: 'pointer'}} onClick={this.onSearch}>🔍</span>
                    </label>
                    <input
                        id='searchBar'
                        name='footer-searchBar'
                        type='text'
                        size={30}
                        autoComplete='off'
                        value={searchBarText}
                        onChange={this.onChange}/><br/>
                </div>

                <div className="footerLink">
                    <label><span role="img" aria-label="person emoji">👤</span></label>
                    <span>logged in as <Link to={ROUTES.ACCOUNT}
                                             style={{textDecoration: 'underline'}}>Account</Link></span><br/>
                </div>

                <div className="footerLink">
                    <label><span role="img" aria-label="computer screen emoji">📺</span></label>
                    <span><Link to={ROUTES.ACCOUNT}>see your posts</Link></span>
                </div>

                <label><span role="img" aria-label="door emoji">🚪</span></label>
                <SignOutButton/>

            </div>
        )
    }
}

const FooterNonAuth = () => (
    <div>
        <div className="bottomLeft">

            <label><span role="img" aria-label="">👤</span></label>
            <span><Link to={ROUTES.SIGN_IN}>log in to make a post</Link></span><br/>

        </div>
    </div>
);

export default Footer;