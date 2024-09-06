// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth,getReactNativePersistence } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAGLa2lnkLHEDh9fs7OuxVmJsVQY0a9GPI",
    authDomain: "rmp-coconuts.firebaseapp.com",
    projectId: "rmp-coconuts",
    storageBucket: "rmp-coconuts.appspot.com",
    messagingSenderId: "743970093389",
    appId: "1:743970093389:web:a42b5668b0713fd52a1f04"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const firebase_Auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });

export const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const firestore = getFirestore(app);
export const Real_time_database = getDatabase(app);