// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: 'AIzaSyBaSEXVhTKmSidht37QksK_sklvaWw5xJ4',
  authDomain: 'lab3-4-a2c36.firebaseapp.com',
  projectId: 'lab3-4-a2c36',
  storageBucket: 'lab3-4-a2c36.appspot.com',
  messagingSenderId: '521922674445',
  appId: '1:521922674445:web:1643b71c0a4253791cba44',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth, db};
