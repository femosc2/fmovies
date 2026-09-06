import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminDb } from './_lib/firebaseAdmin';
import { requireAdmin } from './_lib/auth';
import { fetchAndMap } from './_lib/omdb';

interface AddMovieBody {
  title?: string;
  imdbId?: string;
  rating?: string | number;
}

// POST /api/addMovie — auth-gated. Body: { title? | imdbId?, rating }.
// Unifies the old /movie and /movie/id endpoints. Writes via Admin SDK (bypasses DB rules),
// keyed by Title at the DB root to stay compatible with existing data.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await requireAdmin(req.headers.authorization);

    const { title, imdbId, rating } = (req.body ?? {}) as AddMovieBody;
    if (rating === undefined || rating === null || String(rating).trim() === '') {
      return res.status(400).json({ error: 'rating is required' });
    }
    if (!title && !imdbId) {
      return res.status(400).json({ error: 'title or imdbId is required' });
    }

    const movie = await fetchAndMap({ title, imdbId }, String(rating));
    await getAdminDb().ref(movie.Title).set(movie);
    return res.status(201).json(movie);
  } catch (e) {
    return handleError(e, res);
  }
}

function handleError(e: unknown, res: VercelResponse) {
  if (e && typeof e === 'object' && 'status' in e) {
    const { status, msg } = e as { status: number; msg?: string };
    return res.status(status).json({ error: msg ?? 'Request failed' });
  }
  console.error(e);
  return res.status(500).json({ error: 'Internal error' });
}
