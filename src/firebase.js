// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAVvC-sKlXkAcjoCnxIcKEu_ddCBvfPiIU",
  authDomain: "laundry-webapp-dce5e.firebaseapp.com",
  projectId: "laundry-webapp-dce5e",
  storageBucket: "laundry-webapp-dce5e.firebasestorage.app",
  messagingSenderId: "721735220988",
  appId: "1:721735220988:web:5b151b87f2735e5a5e2179",
  measurementId: "G-FP7J53CXGR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services you need
export const auth = getAuth(app);
export const db = getFirestore(app);
