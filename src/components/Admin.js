import React, { Component } from 'react';

import { withFirebase } from "./Firebase";

import * as ROLES from '../constants/roles';

class AdminPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            users: {}
        };
    }

    componentDidMount() {
        this.setState({ loading: true });

        this.props.firebase.users().on('value', (snapshot) => {
            this.setState({
                users: snapshot.val(),
                loading: false
            })
        })
    }


    render() {
        return (
            <div>
                .
            </div>
        );
    }


}

const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN];

export default (AdminPage);
