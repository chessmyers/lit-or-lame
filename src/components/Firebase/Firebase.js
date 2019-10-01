import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const config = {
    apiKey: "AIzaSyBaSBuT0ldABrBnjbuBz7XN7iM8vawNPQ4",
    authDomain: "lit-or-wack.firebaseapp.com",
    databaseURL: "https://lit-or-wack.firebaseio.com",
    projectId: "lit-or-wack",
    storageBucket: "lit-or-wack.appspot.com",
    messagingSenderId: "669480599660",
    appId: "1:669480599660:web:c0345becf6bea2b7"
};

class Firebase {
    constructor() {
        app.initializeApp(config);

        this.auth = app.auth();
        this.db = app.firestore();
        this.storage = app.storage();
    }

    // Auth API

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = (password) =>
        this.auth().currentUser.updatePassword(password);


    // User Api

    user = (uid) => this.db.collection("users").doc(uid);

    users = () => this.db.collection("users");

    userID = () => this.auth.currentUser.uid;

    getCurrentUsername = () => this.users().doc(this.userID()).get();


    // Posts API

    // TODO limit posts retrieved and add infinite scrolling
    loadPosts = (category) => this.db.collection("posts")
        .where("category", "==", category).orderBy("time", "desc").get();

    loadMyPosts = () => this.db.collection("posts")
        .where("poster", "==", this.auth.currentUser.uid)
        .orderBy("time", "desc").get();

    newPost = (category, textBody, fileUrl) => this.db.collection("posts").add({
        text: textBody,
        time: app.firestore.FieldValue.serverTimestamp(),
        poster: this.auth.currentUser.uid,
        yes: 0,
        no: 0,
        category: category,
        image: fileUrl
    });

    likePost = (post, yesOrNo) => this.db.collection("posts").doc(post).update({
        [yesOrNo]: app.firestore.FieldValue.increment(1),
        voters: app.firestore.FieldValue.arrayUnion(this.auth.currentUser.uid)
    });

    // TODO limit comments loaded and add capability to load more
    loadComments = (post) => this.db.collection("posts").doc(post).collection("comments")
        .orderBy("time", "asc").get();

    makeNewComment = (text, post) => this.db.collection("posts").doc(post)
        .collection("comments").add({
            no: 0,
            poster: this.auth.currentUser.uid,
            text: text,
            time: app.firestore.FieldValue.serverTimestamp(),
            yes: 0
        });

    getCommentPoster = (poster) => this.db.collection("users").doc(poster).get();

    // File Upload API
    uploadPostImg = (file) => {
        const storageRef = this.storage.ref();
        const newRef = storageRef.child(`postImgs/${file.name}`);
        return newRef.put(file)
    };

    getUploadURL = (file) => {
        const imageRef = this.storage.ref().child(`postImgs/${file.name}`);
        return imageRef.getDownloadURL();
    }

    // OTHER STUFF

    currentTime = () => app.firestore.FieldValue.serverTimestamp();

}

export default Firebase;
