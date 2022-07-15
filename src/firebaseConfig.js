import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"
 
const app = initializeApp ({
    apiKey: "AIzaSyBJ8l_9ghu1Dr1l5A_qJOJHnLvvswCU2zY",
    authDomain: "fir-upload-cc5d2.firebaseapp.com",
    projectId: "fir-upload-cc5d2",
    storageBucket: "fir-upload-cc5d2.appspot.com",
    messagingSenderId: "748002701631",
    appId: "1:748002701631:web:c647b8d7a8da7315e8638a",
    databaseURL: "https://fir-upload-cc5d2-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const storage = getStorage(app);
export default storage;

export const auth = getAuth(app);
export const database = getDatabase(app);