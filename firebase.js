// ============================================================
//  firebase.js — AiClima Firebase SDK v9 (modular)
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage }   from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

const firebaseConfig = {
  apiKey:            "AIzaSyBosg5kcFT4IUSf2nRONiHHLKD-5lGsfJM",
  authDomain:        "aiclima.firebaseapp.com",
  projectId:         "aiclima",
  storageBucket:     "aiclima.firebasestorage.app",
  messagingSenderId: "56568504392",
  appId:             "1:56568504392:web:2d4697e94273344d73f87d",
  measurementId:     "G-ZJ0MH9MK9E"
};

const app       = initializeApp(firebaseConfig);
const db        = getFirestore(app);
const storage   = getStorage(app);
const analytics = getAnalytics(app);

export { app, db, storage, analytics };
