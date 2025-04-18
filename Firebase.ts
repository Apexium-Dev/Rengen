import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyArXjJN1jXA3RxgKl2KRmXkX8IPWU9KxHU",
  authDomain: "rengen-1fbb0.firebaseapp.com",
  projectId: "rengen-1fbb0",
  storageBucket: "rengen-1fbb0.firebasestorage.app",
  messagingSenderId: "713899874652",
  appId: "1:713899874652:web:ce1648dd126693ab738999",
  measurementId: "G-7C59T2Q1D7",
};

const patientsApp = initializeApp(firebaseConfig, "PATIENTS_APP");

const auth = getAuth(patientsApp);
const db = getFirestore(patientsApp);

export { db, auth };
