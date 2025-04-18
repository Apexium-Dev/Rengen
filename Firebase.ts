// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArXjJN1jXA3RxgKl2KRmXkX8IPWU9KxHU",
  authDomain: "rengen-1fbb0.firebaseapp.com",
  projectId: "rengen-1fbb0",
  storageBucket: "rengen-1fbb0.firebasestorage.app",
  messagingSenderId: "713899874652",
  appId: "1:713899874652:web:ce1648dd126693ab738999",
  measurementId: "G-7C59T2Q1D7",
};

// Initialize Firebase with a specific name for patients
const patientsApp = initializeApp(firebaseConfig, "PATIENTS_APP");
const auth = getAuth(patientsApp);
const db = getFirestore(patientsApp);

export { db, auth };
