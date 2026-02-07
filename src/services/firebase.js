
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/* 
  @todo: REPLACE WITH YOUR FIREBASE CONFIG
  Get these from: Firebase Console -> Project Settings -> General -> Your apps
*/
const firebaseConfig = {
  apiKey: "AIzaSyDZtEWURWEUozmzz-S2Y0iBu0KnQPRlDFw",
  authDomain: "hiro-production.firebaseapp.com",
  projectId: "hiro-production",
  storageBucket: "hiro-production.firebasestorage.app",
  messagingSenderId: "186950130411",
  appId: "1:186950130411:web:a86e45c4226cd797befcae",
  measurementId: "G-LCLV06CXSB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
