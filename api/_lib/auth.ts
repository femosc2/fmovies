// Verifies the caller is an allowlisted admin. This is the REAL security boundary for writes
// (the client-side route guard is only UX). Every write endpoint must call requireAdmin first.
import { getAuth } from 'firebase-admin/auth';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { getAdminDb } from './firebaseAdmin';

const ADMIN_EMAILS = (process.env.ADMIN_ALLOWLIST ?? '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export async function requireAdmin(authHeader?: string): Promise<DecodedIdToken> {
  // Touch the singleton so firebase-admin's default app exists when getAuth() runs.
  getAdminDb();

  if (!authHeader?.startsWith('Bearer ')) {
    throw { status: 401, msg: 'Missing or malformed Authorization header' };
  }
  const idToken = authHeader.slice('Bearer '.length).trim();

  let decoded: DecodedIdToken;
  try {
    decoded = await getAuth().verifyIdToken(idToken);
  } catch {
    throw { status: 401, msg: 'Invalid or expired token' };
  }

  const email = decoded.email?.toLowerCase();
  if (!email || decoded.email_verified !== true || !ADMIN_EMAILS.includes(email)) {
    throw { status: 403, msg: 'Not authorized' };
  }
  return decoded;
}
