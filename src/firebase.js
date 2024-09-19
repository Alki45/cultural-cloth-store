// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCF8zO8CUG2ukmpyywQ7I3nNODp92d6GgA",
  authDomain: "cloth-store-76ae5.firebaseapp.com",
  projectId: "cloth-store-76ae5",
  storageBucket: "cloth-store-76ae5.appspot.com",
  messagingSenderId: "555766122086",
  appId: "1:555766122086:web:9c370c2d853bb874028fa7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };