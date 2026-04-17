import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDz1fgbsMBwMi0POBf2ybe8VbfpfZ39e8M",
  authDomain: "copanye-ai.firebaseapp.com",
  databaseURL: "https://copanye-ai-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "copanye-ai",
  storageBucket: "copanye-ai.firebasestorage.app",
  messagingSenderId: "593433474920",
  appId: "1:593433474920:web:2c3cf77ecb35ee99ba08dd",
  measurementId: "G-S9S96HKBBL",
};

// Singleton pattern (Next.js hot-reload safe)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;
