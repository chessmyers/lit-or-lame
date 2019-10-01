import React, {Component} from 'react';
import '../styles/Feed.css';

import Post from './Post';

class Landing extends Component {

    static defaultProps = {
        onLoad() {},
        posts: [],
        category: '',
        authUser: null
    };


    constructor(props) {
        super(props);
        this.state = {
            posts: [],
        };
    }

    componentDidMount() {
        this.props.onLoad();
    }

    render() {
        const feed = this.props.posts.length === 0 ? <div className="loading">Loading...</div> : (
        this.props.posts.map((post) => {
            return <Post {...post} key={post.id} authUser={this.props.authUser} />
        }));
        let desc = '';
        switch (this.props.category) {
            case 'tastyorterrible': {
                desc = "Post your best food ideas and/or pictures we'll vote on whether we'd indulge or take a pass!";
                break;
            }
            case 'flyorfail': {
                desc = "Post your new/best outfit, and we'll vote on whether you'll be turning heads, for better or worse!";
                break;
            }

            case 'litorlame': {
                desc = "Post anything you want here and we'll vote on the fundamental question: is it lit, or is it lame?";
                break;
            }
            case 'funnyorflat': {
                desc = "Post your most humorous joke or situation and we'll vote on whether its funny or just falls flat";
                break;
            }
            case 'weirdorwonderful': {
                desc = "Post your craziest idea here and we'll vote on whether its the next big thing or just plain odd";
                break;
            }
            default: {
                desc = '';
            }
        }
        return (
            <div>
                <h1 className="feedTitle">#{this.props.category}</h1>

                <div className="postsContainer">
                    <p className="description">{desc}</p>
                    {feed}
                </div>
            </div>
        );
    }

}

// class PostObj {
//     constructor(public id: string, public text: string, public time: string,
//     public yes: number, public no: number, public img?: string,) {}
// }


export default Landing;
