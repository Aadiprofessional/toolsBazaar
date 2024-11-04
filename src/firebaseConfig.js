import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, getDoc } from "firebase/firestore";


import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyByqxx_8WYNPufYZEkXV5NUsc8Nl2o67Zs",
  authDomain: "toolsbazaar-c1927.firebaseapp.com",
  projectId: "toolsbazaar-c1927",
  storageBucket: "toolsbazaar-c1927.appspot.com",
  messagingSenderId: "335320710885",
  appId: "1:335320710885:web:defa07fccf513e55da9e0c",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firestore
const firestore = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app); // Initialize storage

// Function to check authentication state
const checkAuth = (callback) => {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

export { auth, firestore, storage, checkAuth ,onAuthStateChanged}; // Export storage