import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfigDoctors = {
  apiKey: "AIzaSyCKOJBSyKhG_F7nielrWEnrBDM-P83hpu4",
  authDomain: "rengendoctors.firebaseapp.com",
  projectId: "rengendoctors",
  storageBucket: "rengendoctors.firebasestorage.app",
  messagingSenderId: "532261703291",
  appId: "1:532261703291:web:7b91b761572bf1af921cde",
  measurementId: "G-W8FB8Q0RR8",
};

// Initialize Firebase with a specific name for doctors
const doctorsApp = initializeApp(firebaseConfigDoctors, "DOCTORS_APP");
const auth = getAuth(doctorsApp);

export { auth };
