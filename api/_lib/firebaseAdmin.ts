// Firebase Admin SDK singleton. On Vercel, the module stays resident between warm invocations,
// so we must guard against re-initialization (initializeApp throws if called twice). Writes made
// through the Admin SDK bypass Realtime Database security rules — this is what lets the DB stay
// permanently locked to `.write: false` while admin uploads still succeed.
import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getDatabase, type Database } from 'firebase-admin/database';

let cached: Database | undefined;

export function getAdminDb(): Database {
  if (cached) return cached;

  let app: App;
  if (getApps().length) {
    app = getApps()[0];
  } else {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT?.trim();
    if (!raw) throw { status: 500, msg: 'FIREBASE_SERVICE_ACCOUNT is not set' };

    const serviceAccount = JSON.parse(raw);
    // Vercel env vars sometimes store the PEM with literal "\n" — normalize to real newlines.
    if (typeof serviceAccount.private_key === 'string') {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    app = initializeApp({
      credential: cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL?.trim(),
    });
  }

  cached = getDatabase(app);
  return cached;
}
