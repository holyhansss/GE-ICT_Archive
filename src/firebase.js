// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/analytics'
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';
// import 'firebase/compat/firestore';

import firebase from 'firebase/compat/app';
import 'firebase/compat/analytics'
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};
// Initialize Firebase
export default firebase.initializeApp(firebaseConfig);
// const firebaseInstance = firebase.initializeApp(firebaseConfig);

//export const auth = firebase.auth();
//export const firestore = firebase.firestore();

//export default firebase;
//export const firebase = firebaseInstance;
// export const authService = firebaseInstance.authService();
// export const firestore = firebaseInstance.firestore;
// export const storageService = firebaseInstance.storage();



// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const firestore = firebase.firestore;
// export default {firestore};
