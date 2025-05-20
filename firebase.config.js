// firebase.config.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBW_f1iN5iiuvERquIAZAXII6TVysi-0Mc",
  authDomain: "minimarketapp-70ab6.firebaseapp.com",
  projectId: "minimarketapp-70ab6",
  storageBucket: "minimarketapp-70ab6.firebasestorage.app",
  messagingSenderId: "727525149996",
  appId: "1:727525149996:web:0ffeeff880becc8b80b089",
  measurementId: "G-B76SN3YE2D"
};

const firebaseApp = initializeApp(firebaseConfig);

// 👉 Aquí está la clave: inicializar auth con AsyncStorage
const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { firebaseApp, auth };
