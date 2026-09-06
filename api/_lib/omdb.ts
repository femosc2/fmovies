// OMDb lookup + mapping to our Movie model. Uses native fetch (Node 20+) — no axios.
// Fixes carried over from the old Express controller:
//  - OMDb returns HTTP 200 with { Response: "False" } on a miss → treat as 404 (old code only
//    caught the downstream .split crash).
//  - global dot-replace on Title (old `.replace('.',' ')` only replaced the first dot).
//  - trim genre/actor entries; url-encode the query.
import type { Movie, OmdbResponse } from '../../shared/movie';

export interface OmdbQuery {
  title?: string;
  imdbId?: string;
}

async function fetchOmdb(query: OmdbQuery): Promise<OmdbResponse> {
  const key = process.env.OMDB_APIKEY?.trim();
  if (!key) throw { status: 500, msg: 'OMDB_APIKEY is not set' };
  if (!query.title && !query.imdbId) throw { status: 400, msg: 'title or imdbId is required' };

  const param = query.imdbId
    ? `i=${encodeURIComponent(query.imdbId)}`
    : `t=${encodeURIComponent(query.title!)}`;

  const res = await fetch(`https://www.omdbapi.com/?${param}&apikey=${key}`);
  if (!res.ok) throw { status: 502, msg: 'OMDb request failed' };

  const data = (await res.json()) as OmdbResponse;
  if (data.Response === 'False') throw { status: 404, msg: data.Error ?? 'Movie not found' };
  return data;
}

function toMovie(d: OmdbResponse, femoRating: string): Movie {
  return {
    Title: d.Title.replace(/\./g, ' ').trim(),
    Year: d.Year,
    Runtime: d.Runtime,
    Genre: d.Genre.split(',').map((s) => s.trim()),
    Director: d.Director,
    Actors: d.Actors.split(',').map((s) => s.trim()),
    Plot: d.Plot,
    ImdbRating: d.imdbRating,
    FemoRating: femoRating,
    Watched: new Date().toDateString(),
    Poster: d.Poster,
  };
}

/** Raw OMDb lookup for the admin form's preview (no mapping, no write). */
export async function searchOmdb(query: OmdbQuery): Promise<OmdbResponse> {
  return fetchOmdb(query);
}

/** Lookup + map to a Movie ready to persist. */
export async function fetchAndMap(query: OmdbQuery, femoRating: string): Promise<Movie> {
  return toMovie(await fetchOmdb(query), femoRating);
}
