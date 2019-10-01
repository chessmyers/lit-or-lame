import React, {Component} from 'react';
import {Link} from "react-router-dom";
import SignOutButton from './SignOut';

import '../styles/Footer.css'

import * as ROUTES from '../constants/routes';
import {withFirebase} from "./Firebase";

const Footer = (props) => (
    <div>
        {props.authUser ? <FooterAuth firebase={props.firebase}/> : <FooterNonAuth/>}
        <div className="bottomRight">
            <img src="litorlamelogo.png" alt="logo" width="50%" height="50%"/>
        </div>
    </div>
);

class FooterAuth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchBarText: '',
            username: ''
        }
    }

    componentDidMount() {
        this.props.firebase.getCurrentUsername()
            .then(res => {
                this.setState({
                    username: res.data().username
                })
            })
            .catch(err => console.log(err))
    }

    onChange = (event) => {
        this.setState({searchBarText: event.target.value});
    };

    onSearch = (event) => {
        // search functionality
        event.preventDefault();
        this.setState({searchBarText: ''});
        console.log(this.state.searchBarText);
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
                    <form onSubmit={this.onSearch}>
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
                        onChange={this.onChange}/>
                    </form>

                </div>

                <div className="footerLink">
                    <label><span role="img" aria-label="person emoji">👤</span></label>
                    <span>logged in as <Link to={ROUTES.ACCOUNT}
                                             style={{textDecoration: 'underline'}}>{this.state.username}</Link></span><br/>
                </div>

                <div className="footerLink">
                    <label><span role="img" aria-label="computer screen emoji">📺</span></label>
                    <span><Link to={ROUTES.ACCOUNT}>see your posts</Link></span>
                </div>

                <span className="footerLink">
                    <label><span role="img" aria-label="door emoji">🚪</span></label>
                    <SignOutButton/>
                </span>

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

export default withFirebase(Footer);
