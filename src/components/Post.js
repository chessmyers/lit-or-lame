import moment from "moment";
import React, {Component} from "react";
import {withFirebase} from "./Firebase";
import {withRouter} from 'react-router-dom';
import * as ROUTES from '../constants/routes';


class Post extends Component {
    static defaultProps = {
        text: '',
        id: '',
        yes: 0,
        no: 0,
        time: new Date(),
        category: '',
        poster: '',
        voters: [],
        authUser: null
    };


    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            showComments: false,
            showVotesBar: false,
            yesPercent: 50,
            noPercent: 50,
            yes: 0,
            no: 0
        };

        this.toggleComments = this.toggleComments.bind(this);
        this.loadComments = this.loadComments.bind(this);
        this.goToSignIn = this.goToSignIn.bind(this);
    }


    componentDidMount() {
        if (this.props.authUser && this.props.voters && this.props.voters.indexOf(this.props.firebase.userID()) !== -1) {
            const yesPer = Math.ceil((this.props.yes / (this.props.yes + this.props.no)) * 100);
            // User has already voted; show the progress bar
            this.setState({
                showVotesBar: true,
                yesPercent: yesPer,
                noPercent: 100 - yesPer,
                yes: this.props.yes,
                no: this.props.no
            })
        }
    }


    static ago(time) {
        let difference = moment(time.toDate()).diff(moment());
        return moment.duration(difference).humanize();
    }

    toggleComments() {
        this.setState((prevState) => ({
            showComments: !prevState.showComments
        }))
    }

    loadComments() {
        const tempComments = [];
        this.props.firebase.loadComments(this.props.id)
            .then((comments) => {
                comments.forEach((comment) => {
                    const tempComm = comment.data();
                    tempComm.id = comment.id;
                    tempComments.push(tempComm);
                })
            })
            .then(() => {
                this.setState({
                    showComments: true,
                    comments: tempComments
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }

    // triggered when a post is clicked
    clickPost(isYes) {
        if (this.props.authUser) {
            let like = isYes ? "yes" : "no";
            const yesCount = this.props.yes + (isYes ? 1 : 0);
            const noCount = this.props.no + (isYes ? 0 : 1);

            const yesPer = Math.ceil((yesCount / (yesCount + noCount)) * 100);
            this.props.firebase.likePost(this.props.id, like)
                .then((res) => {
                    this.setState({
                        showVotesBar: true,
                        yesPercent: yesPer,
                        noPercent: 100 - yesPer,
                        yes: this.props.yes + (isYes ? 1 : 0),
                        no: this.props.no + (isYes ? 0 : 1)
                    })
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            this.goToSignIn();
        }
    }

    goToSignIn() {
        this.props.history.push(ROUTES.SIGN_IN);
    }

    render() {
        return (
            <div className="postContent">
                <div className="Post">
                    <div className="postText">{this.props.text}</div>
                    {
                        this.state.showVotesBar ?
                            <div className="postButtonsBox">
                                <div className="votingBar">
                                    <span className="colBar greenBar"
                                          style={{width: this.state.yesPercent.toString(10) + '%'}}>{this.state.yes}</span>
                                    <span className="colBar redBar"
                                          style={{width: this.state.noPercent.toString(10) + '%'}}>{this.state.no}</span>
                                </div>
                            </div>
                            :
                            <div className="postButtonsBox">
                                <input type="image" src="yee.png" alt="Lit" width="10%" height="10%"
                                       onClick={() => this.clickPost(true)}/>
                                <span
                                    style={{flexBasis: '100px', textAlign: 'center', color: 'darkgray'}}>   or   </span>
                                <input type="image" src="nah.png" alt="Lame" width="10%" height="10%"
                                       onClick={() => this.clickPost(false)}/>
                            </div>
                    }

                    <div className="time">posted {Post.ago(this.props.time)} ago</div>

                </div>
                <div className="commentsBox">
                    {
                        this.state.showComments ?
                            <CommentsBox comments={this.state.comments} postID={this.props.id}
                                         firebase={this.props.firebase} toggleComm={this.toggleComments}
                                         reloadComments={this.loadComments} authUser={this.props.authUser}
                                         goToSignIn={this.goToSignIn}/>
                            : <div className="showCommentsButton" onClick={this.loadComments}>Show Comments</div>

                    }
                </div>
            </div>
        );
    }
}


class CommentsBox extends Component {
    static defaultProps = {
        comments: [],
        // comment props: no: number, yes: number, text: string, time: timestamp, poster: string
        postID: '',
        firebase: null,
        toggleComm() {
        },
        reloadComments() {
        },
        authUser: null,
        goToSignIn() {
        },
    };

    constructor(props) {
        super(props);
        this.state = {
            commentText: ''
        }
    }

    onChange = (event) => {
        this.setState({commentText: event.target.value});
    };

    onPostComment = (event) => {
        event.preventDefault();
        const {commentText} = this.state;

        if (this.props.authUser) {

            this.props.firebase.makeNewComment(commentText, this.props.postID)
                .then((res) => {
                    console.log(res);
                    this.setState({
                        commentText: ''
                    })
                })
                .then(() => {
                    this.props.reloadComments();
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            this.props.goToSignIn();
        }
    };

    render() {
        const {commentText} = this.state;

        const isInvalid = (commentText === '');

        return (
            <div>
                <div className="comments">
                    {this.props.comments.map((comment) => (
                        <div className="comment" key={comment.id}>
                            <span>{comment.text}</span>
                            <div className="commentTime">{Post.ago(comment.time)} ago</div>
                        </div>
                    ))}
                </div>

                <form onSubmit={this.onPostComment} className="newCommentForm">
                    <input
                        name="username"
                        className="newCommentBox"
                        value={commentText}
                        onChange={this.onChange}
                        type="text"
                        placeholder="new comment..."
                    />
                    <button disabled={isInvalid} type="submit" className="newCommentButton">
                        send
                    </button>
                </form>
                <div className="hideCommentsButton" onClick={() => this.props.toggleComm()}>Hide Comments</div>
            </div>
        )
    }
}

export default withRouter(withFirebase(Post));