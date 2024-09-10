import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// firebase.js
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';




// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCsjRPHe2AhGpRhVGt-NWOG0blXkOt0HwI",
    authDomain: "climetapipe.firebaseapp.com",
    databaseURL: "https://climetapipe-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "climetapipe",
    storageBucket: "climetapipe.appspot.com",
    messagingSenderId: "307910444889",
    appId: "1:307910444889:web:e4dabdb09f92313b84ae48",
    measurementId: "G-92DGS1EBSQ"
  };

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase, firestore };