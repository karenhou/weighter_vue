/* eslint-disable */
import firebase from 'firebase'
import firestore from 'firebase/firestore'

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBm2UOBYxQjSbHkNqOP3xdzpBUwFcyZyN8",
    authDomain: "weighter-fee2d.firebaseapp.com",
    databaseURL: "https://weighter-fee2d.firebaseio.com",
    projectId: "weighter-fee2d",
    storageBucket: "weighter-fee2d.appspot.com",
    messagingSenderId: "482664829766"
  };
  const firebaseApp = firebase.initializeApp(config);
  firebaseApp.firestore().settings({ timestampsInSnapshots: true })

  export default firebaseApp.firestore()