// Thin client for the serverless API. Same-origin in production and under `vercel dev`
// (paths are relative /api/*). Under plain `vite dev` the functions aren't running, so the
// admin calls will fail — use `vercel dev` to exercise the write path locally.
import { useAuthStore } from '@/stores/auth';
import type { Movie, OmdbResponse } from '@shared/movie';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function parseError(res: Response): Promise<never> {
  let message = res.statusText;
  try {
    const body = await res.json();
    if (body?.error) message = body.error;
  } catch {
    /* keep statusText */
  }
  throw new ApiError(res.status, message);
}

export async function previewOmdb(query: { title?: string; imdbId?: string }): Promise<OmdbResponse> {
  const params = new URLSearchParams();
  if (query.imdbId) params.set('imdbId', query.imdbId);
  else if (query.title) params.set('title', query.title);

  const res = await fetch(`/api/searchOmdb?${params.toString()}`);
  if (!res.ok) return parseError(res);
  return res.json();
}

export async function addMovie(payload: {
  title?: string;
  imdbId?: string;
  rating: string;
}): Promise<Movie> {
  const token = await useAuthStore().getToken();
  if (!token) throw new ApiError(401, 'Not signed in');

  const res = await fetch('/api/addMovie', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return parseError(res);
  return res.json();
}
