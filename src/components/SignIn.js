import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';
import { compose } from 'recompose'

import { SignUpLink } from "./SignUp";
import { PasswordForgetLink } from "./PasswordForget";
import { withFirebase } from "./Firebase";
import * as ROUTES from '../constants/routes';
import '../styles/NewPostAndSigning.css';


const SignInPage = () => {
    return (
        <div>
            <SignInForm />
        </div>
    );
};

const  INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};

class SignInFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onSubmit = (event) => {
        event.preventDefault();
        const { email, password } = this.state;

        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE});
                this.props.history.push(ROUTES.LANDING);
            })
            .catch((error) => {
                this.setState({ error });
            });
    };

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };


    render() {
        const { email, password, error } = this.state;

        const isInvalid = password === '' || email === '' || password.length < 6;

        return (
            <div className="modalContainer">
                <form onSubmit={this.onSubmit} className="modal" >
                    <h1 className="modalTitle">sign in</h1>
                    <input
                        name="email"
                        className="formInput"
                        value={email}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Email Address"
                    />
                    <input
                        name="password"
                        className="formInput"
                        value={password}
                        onChange={this.onChange}
                        type="password"
                        placeholder="Password"
                    />
                    {error && <div className="errorMessage">{error.message}</div>}
                    <button disabled={isInvalid} type="submit" className="submitButton">
                        sign in
                    </button>
                </form>
                <SignUpLink />
                <PasswordForgetLink />
            </div>
        );
    }
}

const SignInLink = () => (
    <p>
        have an account? <Link to={ROUTES.SIGN_IN}>sign in</Link>
    </p>
);

const SignInForm = compose(
    withRouter,
    withFirebase
)(SignInFormBase);

export default SignInPage;

export { SignInForm, SignInLink };
