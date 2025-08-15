// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVct1uXyTpXSrG5FG49vU8m6qFrmWbD4w",
  authDomain: "valodash.firebaseapp.com",
  projectId: "valodash",
  storageBucket: "valodash.firebasestorage.app",
  messagingSenderId: "942399520818",
  appId: "1:942399520818:web:56739ea1d5ce799bba7c2b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);