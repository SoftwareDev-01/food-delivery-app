import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "fooddelivery-98fba.firebaseapp.com",
  projectId: "fooddelivery-98fba",
  storageBucket: "fooddelivery-98fba.firebasestorage.app",
  messagingSenderId: "756086184981",
  appId: "1:756086184981:web:b9fc9278c3b456c1b6821c",
  measurementId: "G-RPPJRR302J"
};

const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
const provider=new GoogleAuthProvider()
export {provider,auth}