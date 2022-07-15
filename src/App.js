import "./App.css";
import React, { useState } from 'react';
import storage, { auth, database } from "./firebaseConfig";
import { ref as databaseRef, get, child } from "firebase/database";
import { ref, uploadBytesResumable } from "firebase/storage";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation().pathname.split("/")[1];
  const [file, setFile]=useState([]);
  const [percent, setPercent]=useState(0);
  const [loggedin, setLoggedin]=useState(!!auth.currentUser);
  const [validlink, setValidLink]=useState(false);

  //Only show the button or upload page or link status if not on home page.
  if(location.length>0){
    const dbref = databaseRef(database);
    get(child(dbref, `${location}`)).then((snapshot) => {
      if (snapshot.exists()) {
        if (new Date().valueOf() - snapshot.val().creationTime < 86400000) {
          console.log("Correct link");
          setValidLink(true);
        }
        else {
          console.log("incorrect link coz time gone");
        };
      }
      else {
        console.log("incorrect link");
      }
    })
  }
  else {
    return (
    <div>
      <p>Welcome to firebase upload app.</p>
      <p>This is the homepage.</p>
    </div>
    )
  }

  //handle user sign in.
  const handleSignin=()=>{
    const provider = new GoogleAuthProvider();
    const signInWithGoogle = () => {
      signInWithPopup(auth, provider)
      .then((result) => {
      const name = result.user.displayName;
      const email = result.user.email;

      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      setLoggedin(!!auth.currentUser);
      })
      .catch((error) => {
      console.log(error);
      });
    };
    signInWithGoogle();
  }

  const handleChange=(e)=>{
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage["id"] = Math.random();
      setFile((prevState)=>[...prevState, newImage]);
    }
  }

  //Handle upload of all the files.
  const handleUpload=()=>{
    if (!file) {alert("Please select an file first!");}

    //upload each file to a folder with user's email address as folder name.
    // eslint-disable-next-line
    file.map((f) => {
      const storageRef = ref(storage, `/${localStorage.getItem("email")}/${f.name}`);
      const uploadTask = uploadBytesResumable(storageRef, f);
      uploadTask.on(
          "state_changed",
          (snapshot) => {
            const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setPercent(percent)
          },
          (err) => console.log(err),
      );
    });
  }

  // display login page or upload page or link status.
  const todisplay=(loggedin, validlink)=>{
    if (validlink) {
      return loggedin? (
        <div >
          <p>You are logged in as <b>{localStorage.getItem("name")}</b>.<br/>Your email address is <b>{localStorage.getItem("email")}</b>.</p>
          <input type="file" multiple onChange={handleChange} />
          <button onClick={handleUpload}>Upload to Firebase</button>
          <p>{percent} "% done"</p>
        </div>
      ) : (
        <div>
          <p>Welcome to firebase upload app.</p>
          <button className="login-with-google-btn" onClick={handleSignin}>
            Sign in with Google
          </button>
        </div>
      );
    }
    else {
      return (
        <div>
          <p>Welcome to firebase upload app.</p>
          <p>The link you clicked has doesn't exist or has expired.</p>
        </div>
      )
    }
  }

  return todisplay(loggedin, validlink);
}

export default App;