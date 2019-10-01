import React, { Component } from 'react';

import PasswordChangeForm from './PasswordChange';
import  withAuthorization  from './Session/withAuthorization';
import { withFirebase } from "./Firebase";
import Post from './Post';
import '../styles/Account.css';

class AccountPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            myPosts: [],
            username: ""
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
                this.props.firebase.getCurrentUsername()
                    .then(res => {
                        this.setState({username: res.data().username})
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
            .catch((err) => {
                console.log(err);
            })
    }

    render() {
        return (
            <div className="page">
                <h2>my account</h2>
                <h5>logged in as {this.state.username}</h5>
                <PasswordChangeForm/>
                {this.state.myPosts.length > 0 ?
                    <MyPostList myPosts={this.state.myPosts} authUser={this.props.authUser}/>
                    :
                    <p>posts you make will appear here</p>
                }
            </div>
        )
    }
}

const MyPostList = (props) => (
    <div>
        <h2>My Posts</h2>
        {props.myPosts.map((post) => (
            <Post {...post} key={post.id} authUser={props.authUser}/>
        ))}
    </div>
);

const condition = (authUser) => authUser != null;

export default withFirebase(withAuthorization(condition)(AccountPage));
