// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlt4ru61Ljsncin6w8hBVlnCRTEyD4GQs",
  authDomain: "realtor-clone-react-2fc5a.firebaseapp.com",
  projectId: "realtor-clone-react-2fc5a",
  storageBucket: "realtor-clone-react-2fc5a.appspot.com",
  messagingSenderId: "1011279699001",
  appId: "1:1011279699001:web:7a66808772321cdca601e8"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
