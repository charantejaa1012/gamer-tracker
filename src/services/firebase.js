import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1J0uHfraON6ck2MfNtqOIR3S2w-sU_18",
  authDomain: "game-tracker-2c763.firebaseapp.com",
  projectId: "game-tracker-2c763",
  storageBucket: "game-tracker-2c763.firebasestorage.app",
  messagingSenderId: "644841843835",
  appId: "1:644841843835:web:5362ede6d25f9a4a38c6de",
  
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);