import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCG2kN_V4yn_NfuPJeJcVEXPmNmucQnZA4",
  authDomain: "finbuddy-6d1d6.firebaseapp.com",
  projectId: "finbuddy-6d1d6",
  storageBucket: "finbuddy-6d1d6.appspot.com", 
  messagingSenderId: "702105803211",
  appId: "1:702105803211:web:8144db7a9f73c4e9603e4e",
  measurementId: "G-TF6T4DLE2T"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
