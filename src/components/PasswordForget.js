import React, { Component } from 'react';
import { Link } from "react-router-dom";

import { withFirebase } from "./Firebase";
import * as ROUTES from '../constants/routes';
import '../styles/NewPostAndSigning.css';

const PasswordForgetPage = () => (
    <div>
        <PasswordForgetForm />
    </div>
);

const INITIAL_STATE = {
    email: '',
    error: null
};

class PasswordForgetFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onSubmit = (event) => {
        event.preventDefault();
        const { email } = this.state;

        this.props.firebase
            .doPasswordReset(email)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
            })
            .catch((error) => {
                this.setState({ error });
            })
    };

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };


    render() {
        const { email } = this.state;

        const isInvalid = (email === '');

        return (
            <div className="modalContainer">
                <form onSubmit={this.onSubmit} className="modal">
                    <h1 className="modalTitle">Password Forget</h1>
                    <input
                        name="email"
                        className="formInput"
                        value={this.state.email}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Email Address"
                    />
                    <button disabled={isInvalid} type="submit" className="submitButton">
                        Reset My Password
                    </button>
                </form>
                <Link to={ROUTES.SIGN_IN} style={{textDecoration: 'none', margin: '5px'}}><span role="img" aria-label="back" className="goBack">⬅️ go back</span></Link>
            </div>
        );
    }
}

const PasswordForgetLink = () => (
    <p>
        forgot password? <Link to={ROUTES.PASSWORD_FORGET}>reset it here</Link>
    </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };