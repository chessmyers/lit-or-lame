import React, {Component} from 'react';

import {withFirebase} from "./Firebase";
import '../styles/Account.css';

const INITIAL_STATE = {
    passwordOne: '',
    passwordTwo: '',
    error: null
};

class PasswordChangeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {...INITIAL_STATE};

        this.onChange = this.onChange.bind(this);
    }

    onSubmit = (event) => {
        event.preventDefault();
        const {passwordOne} = this.state;

        this.props.firebase
            .doPasswordUpdate(passwordOne)
            .then(() => {
                this.setState({...INITIAL_STATE});
            })
            .catch((error) => {
                this.setState({error});
            });
    };

    onChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    };


    render() {
        const {passwordOne, passwordTwo, error} = this.state;

        const isInvalid = (
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            passwordOne.length < 6
        );
        return (
            <form onSubmit={this.onSubmit} className="passwordChangeForm">
                <h3>change your password</h3>
                <input
                    name="passwordOne"
                    value={passwordOne}
                    onChange={this.onChange}
                    type="password"
                    placeholder="New Password"
                    className="passwordForgetBox"
                />

                <input
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Confirm New Password"
                    className="passwordForgetBox"
                />
                <button disabled={isInvalid} type="submit" className="appButton">
                    Reset My Password
                </button>

                {error && <p>{error.message}</p>}
            </form>
        );
    }

}

export default withFirebase(PasswordChangeForm);
