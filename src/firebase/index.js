import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDEW5me6M7Odp86XjR4VDcUH512pNcV6ws",
  authDomain: "fir-22489.firebaseapp.com",
  projectId: "fir-22489",
  storageBucket: "fir-22489.appspot.com",
  messagingSenderId: "81560892776",
  appId: "1:81560892776:web:96a2ba234afb38f19e92dd"
}

// init firebase
initializeApp(firebaseConfig)

// init & export firestore service
export const db = getFirestore()
// generate & export auth object
export const auth = getAuth()
