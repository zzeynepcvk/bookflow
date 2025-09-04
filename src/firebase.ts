// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase config (senin değerlerin)
const firebaseConfig = {
  apiKey: "AIzaSyCEP67S6s-Wl4xgRdM9MtMMhrhXlXRwmP8",
  authDomain: "bookflow-d47ec.firebaseapp.com",
  projectId: "bookflow-d47ec",
  storageBucket: "bookflow-d47ec.firebasestorage.app",
  messagingSenderId: "347568226272",
  appId: "1:347568226272:web:89576920ec0bb79baf3585",
  measurementId: "G-98ZSTJYN3Q" // kullanmıyoruz ama kalabilir
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Firestore veritabanı
export const db = getFirestore(app);
