import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {compose} from 'recompose';
import { SignInLink } from "./SignIn";

import {withFirebase} from './Firebase';
import * as ROUTES from '../constants/routes';
import '../styles/NewPostAndSigning.css';


const SignUpPage = () => {
    return (
        <div>
            <SignUpForm/>
        </div>
    );
};

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null
};

class SignUpFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = {...INITIAL_STATE};

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onSubmit = event => {
        event.preventDefault();
        const {username, email, passwordOne} = this.state;

        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then((authUser) => {
                // create a new user in Cloud Firestore
                return this.props.firebase
                    .user(authUser.user.uid)
                    .set({
                        username,
                        email
                    });
            })
            .then(() => {
                this.setState({...INITIAL_STATE});
                this.props.history.push(ROUTES.LANDING);
            })
            .catch(error => {
                this.setState({error});
            });
    };

    onChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };


    render() {
        const {
            username,
            email,
            passwordOne,
            passwordTwo,
            error
        } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            passwordOne.length < 6 ||
            email === '' ||
            username === '';

        return (
            <div className="modalContainer">
                <form onSubmit={this.onSubmit} className="modal">
                    <h1 className="modalTitle">sign up</h1>
                    <input
                        name="username"
                        className="formInput"
                        value={username}
                        onChange={this.onChange}
                        type="text"
                        placeholder="username"
                    />
                    <input
                        name="email"
                        className="formInput"
                        value={email}
                        onChange={this.onChange}
                        type="text"
                        placeholder="email address"
                    />
                    <input
                        name="passwordOne"
                        className="formInput"
                        value={passwordOne}
                        onChange={this.onChange}
                        type="password"
                        placeholder="password"
                    />
                    <input
                        name="passwordTwo"
                        className="formInput"
                        value={passwordTwo}
                        onChange={this.onChange}
                        type="password"
                        placeholder="confirm Password"
                    />
                    {error && <div className="errorMessage">{error.message}</div>}
                    <button disabled={isInvalid} type="submit" className="submitButton">
                        sign up
                    </button>
                </form>
                <SignInLink />
            </div>
        );
    }
}

const SignUpLink = () => (
    <p>
        don't have an account? <Link to={ROUTES.SIGN_UP}>sign up</Link>
    </p>
);

const SignUpForm = compose(
    withRouter,
    withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export {SignUpForm, SignUpLink}
