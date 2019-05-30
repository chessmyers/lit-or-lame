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
        this.props.posts.map((post, index) => {
            return <Post {...post} key={index} authUser={this.props.authUser} />
        }));

        return (
            <div>
                <h1 className="feedTitle">#{this.props.category}</h1>
                <div className="postsContainer">
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
