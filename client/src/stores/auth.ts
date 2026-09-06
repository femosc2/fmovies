import { defineStore } from 'pinia';
import {
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth, googleProvider } from '@/firebase';

// Client-side admin allowlist — for UI gating ONLY (show/hide the admin area). The real
// authorization check happens server-side in the serverless function against ADMIN_ALLOWLIST.
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS ?? '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

interface AuthState {
  user: User | null;
  initialized: boolean;
  error: string | null;
}

let readyPromise: Promise<void> | null = null;

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    initialized: false,
    error: null,
  }),

  getters: {
    isSignedIn: (state) => state.user !== null,
    isAdmin: (state) => {
      const email = state.user?.email?.toLowerCase();
      return !!email && ADMIN_EMAILS.includes(email);
    },
  },

  actions: {
    // Subscribe to Firebase auth state once, and complete any pending redirect sign-in. Returns a
    // promise that resolves after the first state is known, so route guards can await a definitive
    // signed-in/out answer.
    init(): Promise<void> {
      if (readyPromise) return readyPromise;
      // Completes the redirect flow on return from Google; surfaces any redirect error.
      getRedirectResult(auth).catch((e: unknown) => {
        this.error = e instanceof Error ? e.message : 'Sign-in failed';
      });
      readyPromise = new Promise<void>((resolve) => {
        onAuthStateChanged(auth, (user) => {
          this.user = user;
          if (!this.initialized) {
            this.initialized = true;
            resolve();
          }
        });
      });
      return readyPromise;
    },

    ready(): Promise<void> {
      return this.init();
    },

    // Redirect-based sign-in — navigates the page to Google (no popup to be blocked) and returns
    // to the app, where init()/getRedirectResult completes it.
    async signInWithGoogle() {
      this.error = null;
      await signInWithRedirect(auth, googleProvider);
    },

    async logout() {
      await signOut(auth);
    },

    // Fresh Firebase ID token for the Authorization header on API calls.
    async getToken(): Promise<string | null> {
      return this.user ? this.user.getIdToken() : null;
    },
  },
});
