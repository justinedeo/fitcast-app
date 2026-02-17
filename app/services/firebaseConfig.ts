import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCzycn4IoItHXF0VTHrtEGmhTAHWOVjfq4",
  authDomain: "fitcast-7533a.firebaseapp.com",
  databaseURL: "https://fitcast-7533a-default-rtdb.firebaseio.com",
  projectId: "fitcast-7533a",
  storageBucket: "fitcast-7533a.firebasestorage.app",
  messagingSenderId: "621021200344",
  appId: "1:621021200344:web:bf52845bf42536de5bbcad",
  measurementId: "G-EP43FW54F5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export { app };
