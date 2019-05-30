import React, { Component } from 'react';

import { PasswordForgetForm } from "./PasswordForget";
import PasswordChangeForm from './PasswordChange';
import  withAuthorization  from './Session/withAuthorization';
import { withFirebase } from "./Firebase";
import Post from './Post';
import '../styles/Feed.css';

class AccountPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            myPosts: []
        }
    }

    componentDidMount() {
        const tempPosts = [];
        this.props.firebase.loadMyPosts()
            .then((posts)=> {
                posts.forEach((post) => {
                    const tempDat = post.data();
                    tempDat.id = post.id;
                    tempPosts.push(tempDat);
                })
            })
            .then(() => {
                this.setState({
                    myPosts: tempPosts
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }

    render() {
        return (
            <div>
                <MyPostList myPosts={this.state.myPosts} />
                <PasswordForgetForm/>
                <PasswordChangeForm/>
            </div>
        )
    }
}

const MyPostList = (props) => (
    <div>
        {props.myPosts.map((post) => (
            <Post {...post} key={post.id}/>
        ))}
    </div>
);

const condition = (authUser) => authUser != null;

export default withFirebase(withAuthorization(condition)(AccountPage));