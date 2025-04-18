import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfigDoctors = {
  apiKey: "AIzaSyArXjJN1jXA3RxgKl2KRmXkX8IPWU9KxHU",
  authDomain: "rengen-1fbb0.firebaseapp.com",
  projectId: "rengen-1fbb0",
  storageBucket: "rengen-1fbb0.firebasestorage.app",
  messagingSenderId: "713899874652",
  appId: "1:713899874652:web:710b841e7630a86d738999",
  measurementId: "G-MXLD024ZKP",
};

// Initialize Firebase with a specific name for doctors
const doctorsApp = initializeApp(firebaseConfigDoctors, "DOCTORS_APP");
const auth = getAuth(doctorsApp);
const db = getFirestore(doctorsApp);

export { db, auth };
