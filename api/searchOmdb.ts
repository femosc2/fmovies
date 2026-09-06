import type { VercelRequest, VercelResponse } from '@vercel/node';
import { searchOmdb } from './_lib/omdb';

// GET /api/searchOmdb?title=... | ?imdbId=... — powers the admin form's preview.
// Unauthenticated (read-only OMDb lookup) but kept server-side so the OMDb key never
// reaches the browser.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const title = typeof req.query.title === 'string' ? req.query.title : undefined;
  const imdbId = typeof req.query.imdbId === 'string' ? req.query.imdbId : undefined;

  try {
    const result = await searchOmdb({ title, imdbId });
    return res.status(200).json(result);
  } catch (e) {
    if (e && typeof e === 'object' && 'status' in e) {
      const { status, msg } = e as { status: number; msg?: string };
      return res.status(status).json({ error: msg ?? 'Request failed' });
    }
    console.error(e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
