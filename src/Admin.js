import "./App.css";
import React from 'react';
import { database } from "./firebaseConfig";
import { ref , set } from "firebase/database";
import { useLocation } from "react-router-dom";


function Admin() {
  const location = useLocation();
  console.log(location);
  
  const handleGeneration = () =>{
    let r = (Math.random() + 1).toString(36).substring(7);
    console.log("here's the link", r);
    console.log(new Date().valueOf());
    set(ref(database, '/'+r+'/'), {
      creationTime: new Date().valueOf(),
    });
  }

  return (
    <div className="App" style={{marginTop : 250}}>
        <center>
          <h1>Admin page</h1>
          <button onClick={handleGeneration}>Create new link</button>
        </center>
    </div>
  )
}

export default Admin;