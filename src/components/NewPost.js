import {Link, withRouter} from 'react-router-dom';
import React, {Component} from 'react';
import {compose} from 'recompose';

import  withAuthorization  from './Session/withAuthorization';
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
    fileTooLarge: null,
    filePath: null,
    submitted: false
};

class NewPostFormBase extends Component {

    static defaultProps = {
        category: '',
        onSub() {
        }
    };

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
        if (file.size > 500000) {
            this.setState({
                fileTooLarge: `${file.name} is too large, please pick a smaller file`
            });
            event.target.value = null;
        } else {
            this.setState({
                uploading: true,
                fileTooLarge: null,
                filePath: file
            });
            let reader = new FileReader();

            reader.onload = (e) => {
                this.setState({
                    uploading: false,
                    image: e.target.result
                })
            };
            reader.readAsDataURL(file);

            // this.props.firebase.uploadPostImg(file)
            //     .then((snapshot) => {
            //         console.log(snapshot);
            //         this.setState({
            //                 uploading: false,
            //                 image: file
            //             }
            //         )
            //     })
            //     .catch((err) => {
            //         console.log(err);
            //     })
        }

    }

    removeImage() {
        this.setState({
            image: null,
            filePath: null
        })
    }

    onSubmit = (event) => {
        event.preventDefault();
        this.setState({
            submitted: true
        })
        const { text, filePath } = this.state;
        if (filePath) {
            this.props.firebase.uploadPostImg(filePath)
                .then(snapshot => {
                    this.props.firebase.getUploadURL(filePath)
                        .then(url => {
                            console.log(url);
                            this.makeNewPost(text, url);
                        })
                        .catch(err => console.log(err))
                })
                .catch(err => console.log(err))
        } else {
            this.makeNewPost(text, "");
        }
    };

    makeNewPost(text, imgUrl) {
        this.props.firebase.newPost(this.props.category, text, imgUrl)
            .then(doc => {
                this.setState({...INITIAL_STATE});
                this.props.sub(this.props.category);
                this.props.history.push(ROUTES.LANDING);
            })
            .catch(err => console.log(err));
    }

    onChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    };


    render() {
        const { text, uploading, image, submitted } = this.state;

        const isInvalid = text === '' || text.length > 250 || submitted;

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
                    {this.state.fileTooLarge && this.state.fileTooLarge}
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
        <img src={props.image} alt='' style={{maxWidth: '180px', height: '130px'}}/>
    </div>
);

const NewPostForm = compose(
    withRouter,
    withFirebase
)(NewPostFormBase);

const condition = (authUser) => authUser != null;

export default withAuthorization(condition)(NewPostPage);
