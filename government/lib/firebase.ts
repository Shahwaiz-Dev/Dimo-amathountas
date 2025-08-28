import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Replace with your own Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDKVAAneFHL-hjpHTFfUDLSAKW09VacOtA",
  authDomain: "municipality-90393.firebaseapp.com",
  projectId: "municipality-90393",
  storageBucket: "municipality-90393.firebasestorage.app",
  messagingSenderId: "486698354551",
  appId: "1:486698354551:web:90fbe3fc7ab4a21ecd4372",
  measurementId: "G-EDJHDH1Z3L"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 