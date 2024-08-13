// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkI1Ror25ptpjTW4DqHNe1AYykGwtyxA0",
  authDomain: "netflix-clone-yt-6a64a.firebaseapp.com",
  projectId: "netflix-clone-yt-6a64a",
  storageBucket: "netflix-clone-yt-6a64a.appspot.com",
  messagingSenderId: "195878973463",
  appId: "1:195878973463:web:52170ec3a622b76788ac52",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth();
const db = getFirestore();

export { auth, db };
export default app;
