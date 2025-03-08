// src/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';  // Firestore methods
import { getStorage } from 'firebase/storage';  // Firebase Storage
import { getDatabase } from 'firebase/database';  // Firebase Realtime Database

// Firebase configuration object
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,  // Add database URL
};

// Initialize Firebase app
export const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);  // Initialize Firebase Storage
const realtimeDb = getDatabase(app);  // Initialize Firebase Realtime Database

// Export the auth, Google provider, Firestore instance, Firestore methods, Storage, and Realtime Database
export { auth, googleProvider, db, collection, addDoc, storage, realtimeDb };
