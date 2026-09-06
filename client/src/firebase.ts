// Firebase modular SDK (v11) initialization. Replaces the old v7 namespaced init in main.js.
// Reads the public web config from Vite env vars (VITE_* — safe to ship in the bundle; security
// comes from the Realtime Database rules + Auth, not from hiding these values).
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Trim defensively — env values can pick up stray whitespace/CR depending on how they were set.
const env = (v: string | undefined) => v?.trim();

const app = initializeApp({
  apiKey: env(import.meta.env.VITE_FIREBASE_KEY),
  authDomain: env(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  databaseURL: env(import.meta.env.VITE_FIREBASE_DATABASE_URL),
  projectId: env(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  appId: env(import.meta.env.VITE_FIREBASE_APP_ID),
});

export const db = getDatabase(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
