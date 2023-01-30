// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQPR2g-8WQnLn2ZpvVOHKBgUxgtslXDnQ",
  authDomain: "copy-assignment.firebaseapp.com",
  databaseURL: "https://copy-assignment-default-rtdb.firebaseio.com",
  projectId: "copy-assignment",
  storageBucket: "copy-assignment.appspot.com",
  messagingSenderId: "721728520802",
  appId: "1:721728520802:web:b6b86075f00534ff35473b",
  measurementId: "G-WF9CCZ6MRW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;