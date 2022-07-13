import "./App.css";
import React from 'react';
import storage, { auth } from "./firebaseConfig";
import { ref, uploadBytesResumable } from "firebase/storage";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

class App extends React.Component {
  
  constructor(props) {
    super(props)
    auth.signOut(); //clear login creds.
    localStorage.clear(); //clear stored email and name.

    //set empty filename, upload percentage and whether user is logged in or not.
    this.state = {
      file: [],
      percent: 0,
      loggedin: !!auth.currentUser,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleSignin = this.handleSignin.bind(this);
  }

  // Handle sign in. set email, name and loggedin status.
  handleSignin() {
    const provider = new GoogleAuthProvider();
    const signInWithGoogle = () => {
      signInWithPopup(auth, provider)
      .then((result) => {
      const name = result.user.displayName;
      const email = result.user.email;

      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      this.setState({loggedin: !!auth.currentUser});
      })
      .catch((error) => {
      console.log(error);
      });
    };
    signInWithGoogle();
  };

  //set file variable as picked file.
  handleChange(event) {
    for (let i = 0; i < event.target.files.length; i++) {
      const newImage = event.target.files[i];
      newImage["id"] = Math.random();
      this.setState((prevState) => ({
        file: [...prevState.file, newImage]
      }));
    }
  }

  //upload the file
  handleUpload() {
    if (!this.state.file) {
        alert("Please select an file first!");
    }
    //upload each file to a folder with user's email address as folder name.
    // eslint-disable-next-line
    this.state.file.map((f) => {
      const storageRef = ref(storage, `/${localStorage.getItem("email")}/${f.name}`);
      const uploadTask = uploadBytesResumable(storageRef, f);
      uploadTask.on(
          "state_changed",
          (snapshot) => {
              const percent = Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );

              this.setState({percent: percent});
          },
          (err) => console.log(err),
      );
    });
  }
  
  render() {
    if(this.state.loggedin) {
      return (
        <div >
          <p>You are logged in as <b>{localStorage.getItem("name")}</b>.<br/>Your email address is <b>{localStorage.getItem("email")}</b>.</p>
          <input type="file" multiple onChange={this.handleChange} />
          <button onClick={this.handleUpload}>Upload to Firebase</button>
          <p>{this.state.percent} "% done"</p>
        </div>
      );
    }
    else {
      return (
        <div>
          <p>Welcome to firebase upload app.</p>
          <button className="login-with-google-btn" onClick={this.handleSignin}>
            Sign in with Google
          </button>
        </div>
      );
    }
  }
}

export default App;