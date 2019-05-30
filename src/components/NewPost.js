import {Link, withRouter} from 'react-router-dom';
import React, {Component} from 'react';
import {compose} from 'recompose';

import {withFirebase} from "./Firebase";
import * as ROUTES from '../constants/routes';
import '../styles/NewPostAndSigning.css';

const NewPostPage = (props) => {
    return (
        <div>
            <NewPostForm category={props.category} sub={props.onSub}/>
        </div>
    );
};

const INITIAL_STATE = {
    text: '',
    uploading: false,
    image: null,
};

class NewPostFormBase extends Component {

    static defaultProps = {
        category: '',
        onSub() {
        }
    }

    constructor(props) {
        super(props);
        this.state = {...INITIAL_STATE};

        this.onAddImage = this.onAddImage.bind(this);
        this.removeImage = this.removeImage.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onAddImage(event) {
        event.preventDefault();
        let file = event.target.files[0];
        if (file.size > 150000) {
            console.log(`${file.name} is too large, please pick a smaller file`);
        } else {
            this.setState({
                uploading: true
            });

            this.props.firebase.uploadPostImg(file)
                .then((res) => {
                    console.log(res);
                    this.setState({
                            uploading: false,
                            image: file
                        }
                    )
                })
                .catch((err) => {
                    console.log(err);
                })
        }

    }

    removeImage() {
        this.setState({
            image: null
        })
    }

    onSubmit = (event) => {
        event.preventDefault();
        const {text} = this.state;

        this.props.firebase
            .newPost(this.props.category, text)
            .then((doc) => {
                this.setState({...INITIAL_STATE});
                this.props.sub(this.props.category);
                this.props.history.push(ROUTES.LANDING);
            })
            .catch((error) => {
                console.log(error);
                this.setState({error})
            });
    };

    onChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    };


    render() {
        const {text, uploading, image} = this.state;

        const isInvalid = text === '' || text.length > 250;

        const imgUpload = () => {
            switch (true) {
                case uploading:
                    return <Spinner/>;
                case image !== null:
                    return <Image image={image} removeImage={this.removeImage}/>;
                default:
                    return <input type="file" id="imgUpload" onChange={this.onAddImage} className="submitButton"
                                  style={{marginTop: '-5px'}}/>
            }
        };

        return (
            <div className="modalContainer">
                <form onSubmit={this.onSubmit} className="modal">
                    <h1>new post</h1>
                    {imgUpload()}
                    <textarea
                        name="text"
                        value={text}
                        onChange={this.onChange}
                        placeholder="250 character limit..."
                    />
                    <label className="characterLimit">{250 - this.state.text.length} characters left</label>
                    <button disabled={isInvalid} type="submit" className="submitButton">
                        post
                    </button>
                </form>
                <Link to={ROUTES.LANDING} style={{textDecoration: 'none', margin: '5px'}}><span role="img"
                                                                                                aria-label="back"
                                                                                                className="goBack">⬅️ go back</span></Link>
            </div>
        );
    }
}

const Spinner = () => (
    <div className="spinner fadeIn">
        <img src="spinner.png" alt="Uploading..."/>
    </div>
);

const Image = (props) => (
    <div className="fadeIn imageContainer">
        <div onClick={() => props.removeImage()} className="deleteButton">X</div>
        <img src={URL.createObjectURL(props.image)} alt='' style={{width: '50%', height: '50%', border: 'solid 1px red'}}/>
    </div>
);

const NewPostForm = compose(
    withRouter,
    withFirebase
)(NewPostFormBase);

export default NewPostPage;
