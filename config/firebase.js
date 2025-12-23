// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDBF_7uM8TN1Dlaq17oljPtxYuz8gRgKO8",
    authDomain: "healio-748aa.firebaseapp.com",
    projectId: "healio-748aa",
    storageBucket: "healio-748aa.firebasestorage.app",
    messagingSenderId: "315753730698",
    appId: "1:315753730698:web:003b0ecdcd48ac0b53d373",
    measurementId: "G-T1V0BCS8FF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;