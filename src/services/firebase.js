
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/* 
  @todo: REPLACE WITH YOUR FIREBASE CONFIG
  Get these from: Firebase Console -> Project Settings -> General -> Your apps
*/
const firebaseConfig = {
  apiKey: "AIzaSyAK31ark01UEW0kze668juGaGj4F0gaERc",
  authDomain: "xproject-ac0a5.firebaseapp.com",
  projectId: "xproject-ac0a5",
  storageBucket: "xproject-ac0a5.firebasestorage.app",
  messagingSenderId: "10581435557",
  appId: "1:10581435557:web:fa3b99d6f2071ef490194c",
  measurementId: "G-EPP5ZKXFNM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
