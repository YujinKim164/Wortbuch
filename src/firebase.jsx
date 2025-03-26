// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  // Firestore 추가
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbQNXKOt1J4KCykVCjEYSxp-nV347UAM0",
  authDomain: "german-vocab-trainer.firebaseapp.com",
  projectId: "german-vocab-trainer",
  storageBucket: "german-vocab-trainer.firebasestorage.app",
  messagingSenderId: "185026648258",
  appId: "1:185026648258:web:8b13cfcb865d95fc18035b",
  measurementId: "G-KXGE4X0VS2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); 

export { db };
