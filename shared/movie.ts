// Shared types — single source of truth, imported by both the Vue client (@shared/movie)
// and the Vercel serverless functions (../../shared/movie).
//
// `Movie` is intentionally byte-for-byte compatible with the original server `IMovie`
// interface so existing Realtime Database records (keyed by Title at the root) keep working
// with no data migration. All rating/year fields are strings because that is how they are
// stored today; coerce with Number() when sorting.

export interface Movie {
  Title: string;
  Year: string;
  Runtime: string;
  Genre: string[];
  Director: string;
  Actors: string[];
  Plot: string;
  ImdbRating: string;
  FemoRating: string;
  Watched: string;
  Poster: string;
}

// Shape of the OMDb API response (https://www.omdbapi.com/). OMDb returns HTTP 200 even on a
// miss, signalling failure via `Response: "False"` + `Error`, so callers must check `Response`.
export interface OmdbResponse {
  Response: 'True' | 'False';
  Error?: string;
  Title: string;
  Year: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Actors: string;
  Plot: string;
  imdbRating: string;
  Poster: string;
}
