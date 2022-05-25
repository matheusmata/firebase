import firebase from 'firebase/app';

import 'firebase/firestore';
import 'firebase/auth';

let firebaseConfig = {
    apiKey: "AIzaSyD44O4eR_7bcFmMzwTHEIMT4CTsnsOWJPo",
    authDomain: "vueapp-2045a.firebaseapp.com",
    projectId: "vueapp-2045a",
    storageBucket: "vueapp-2045a.appspot.com",
    messagingSenderId: "501888999848",
    appId: "1:501888999848:web:de0a6fedc268d420f03d9d",
    measurementId: "G-N171094WM3"
  };

  if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export default firebase;