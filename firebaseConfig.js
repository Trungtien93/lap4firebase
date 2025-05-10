// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
 apiKey: "AIzaSyApjzecWD76Ve04R_eXupbMhPcPa_AaWz4",
  authDomain: "qlcv-9f8ca.firebaseapp.com",
  projectId: "qlcv-9f8ca",
  storageBucket: "qlcv-9f8ca.firebasestorage.app",
  messagingSenderId: "1052797218257",
  appId: "1:1052797218257:web:54b7065bd519dc1af304f0",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth, db};
