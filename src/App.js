import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './styles/App.css';

import Navigation from './components/Navigation';
import LandingPage from './components/Landing';
import SignUpPage from './components/SignUp';
import SignInPage from './components/SignIn';
import PasswordForgetPage from './components/PasswordForget';
import AccountPage from './components/Account';
import AdminPage from './components/Admin';
import Footer from './components/Footer';
import NewPostPage from './components/NewPost';
import LostPage from './components/Lost';

import * as ROUTES from './constants/routes';
import {withFirebase} from "./components/Firebase";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authUser: null,
            category: 'litorlame',
            posts: []
        };
        this.changeCategory = this.changeCategory.bind(this);
        this.loadPosts = this.loadPosts.bind(this);
    }

    componentDidMount() {
        this.listener = this.props.firebase.auth.onAuthStateChanged(
            (authUser) => {
                authUser
                    ? this.setState({authUser})
                    : this.setState({authUser: null});
            }
        );

        this.loadPosts(this.state.category);
    }

    componentWillUnmount() {
        this.listener();
    }


    changeCategory(category) {
        if (category !== this.state.category) {
            this.setState({category, posts: []});
            this.loadPosts(category);
        }
    }

    loadPosts(category) {
        const tempPosts = [];
        this.props.firebase.loadPosts(category)
            .then((posts) => {
                posts.forEach((post) => {
                    const tempDat = post.data();
                    tempDat.id = post.id;
                    tempPosts.push(tempDat);
                })
            })
            .then(() => {
                this.setState({
                    posts: tempPosts
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }

    render() {
        return (
            <Router>
                <div>
                    <Navigation changeCat={this.changeCategory}/>
                    <Switch>
                        <Route exact path={ROUTES.LANDING} render={() => (
                            <LandingPage posts={this.state.posts} category={this.state.category}
                                         authUser={this.state.authUser}/>
                        )}/>
                        <Route exact path={ROUTES.SIGN_UP} component={SignUpPage}/>
                        <Route exact path={ROUTES.SIGN_IN} component={SignInPage}/>
                        <Route exact path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage}/>
                        <Route exact path={ROUTES.ACCOUNT} render={() => (
                            <AccountPage authUser={this.state.authUser} />
                        )}/>
                        <Route exact path={ROUTES.ADMIN} component={AdminPage}/>
                        <Route exact path={ROUTES.NEW_POST} render={() => (
                            <NewPostPage onSub={this.loadPosts} category={this.state.category} />
                        )} />
                         <Route component={LostPage} />
                    </Switch>
                </div>
                <Footer authUser={this.state.authUser}/>
            </Router>
        );
    }
};

export default withFirebase(App);
