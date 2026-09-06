// Pure statistics derived from the movie catalog. All parsing is defensive because the stored
// data is OMDb-sourced and can contain "N/A", ranges ("2010–2012"), etc.
import type { Movie } from '@shared/movie';

export interface Count {
  label: string;
  value: number;
}

export interface RankedMovie {
  movie: Movie;
  value: number;
}

export interface Stats {
  totalMovies: number;
  totalRuntimeMinutes: number;
  totalRuntimeLabel: string;
  avgRuntimeMinutes: number;
  avgFemoRating: number;
  avgImdbRating: number;
  ratedCount: number; // movies with a usable runtime (for the "based on N" note)
  topActors: Count[];
  topDirectors: Count[];
  byDecade: Count[];
  byGenre: Count[];
  femoDistribution: Count[];
  mostOverrated: RankedMovie[]; // Felix rated much higher than IMDb
  sameAsImdb: RankedMovie[]; // Felix and IMDb agree (smallest gap)
  mostUnderrated: RankedMovie[]; // Felix rated much lower than IMDb
  watchedByYear: Count[];
  longest: Movie | null;
  shortest: Movie | null;
  oldest: Movie | null;
  newest: Movie | null;
}

const num = (v: string | number | undefined): number | null => {
  if (v === undefined || v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/** "148 min" -> 148; "N/A" -> null. */
export function parseRuntime(runtime: string | undefined): number | null {
  if (!runtime) return null;
  const m = runtime.match(/\d+/);
  return m ? Number(m[0]) : null;
}

/** "2010" / "2010–2012" -> 2010; "N/A" -> null. */
export function parseYear(year: string | undefined): number | null {
  if (!year) return null;
  const m = year.match(/\d{4}/);
  return m ? Number(m[0]) : null;
}

/** 8734 minutes -> "6 days, 1 hr". */
export function formatDuration(totalMinutes: number): string {
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const mins = Math.round(totalMinutes % 60);
  const parts: string[] = [];
  if (days) parts.push(`${days} day${days === 1 ? '' : 's'}`);
  if (hours) parts.push(`${hours} hr${hours === 1 ? '' : 's'}`);
  if (mins && !days) parts.push(`${mins} min`);
  return parts.join(', ') || '0 min';
}

function tally(items: unknown[]): Count[] {
  const map = new Map<string, number>();
  for (const raw of items) {
    if (raw === null || raw === undefined) continue;
    const label = String(raw).trim();
    if (!label || label === 'N/A') continue;
    map.set(label, (map.get(label) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

const avg = (nums: number[]): number =>
  nums.length ? nums.reduce((s, n) => s + n, 0) / nums.length : 0;

// Firebase/OMDb data isn't always well-typed: Genre/Actors are usually string[] but a stray
// record can hold a scalar or object. Normalize to an array so flatMap/tally never choke.
const asArray = (v: unknown): unknown[] => (Array.isArray(v) ? v : v === null || v === undefined ? [] : [v]);

export function computeStats(movies: Movie[]): Stats {
  const runtimes = movies.map((m) => parseRuntime(m.Runtime)).filter((n): n is number => n !== null);
  const totalRuntimeMinutes = runtimes.reduce((s, n) => s + n, 0);

  const femo = movies.map((m) => num(m.FemoRating)).filter((n): n is number => n !== null);
  const imdb = movies.map((m) => num(m.ImdbRating)).filter((n): n is number => n !== null);

  // Decades
  const decades = movies
    .map((m) => parseYear(m.Year))
    .filter((y): y is number => y !== null)
    .map((y) => `${Math.floor(y / 10) * 10}s`);
  const byDecade = tally(decades).sort((a, b) => a.label.localeCompare(b.label));

  // FemoRating distribution, bucketed by integer floor (0..10)
  const distMap = new Map<number, number>();
  for (const m of movies) {
    const r = num(m.FemoRating);
    if (r === null) continue;
    const bucket = Math.min(10, Math.max(0, Math.floor(r)));
    distMap.set(bucket, (distMap.get(bucket) ?? 0) + 1);
  }
  const femoDistribution: Count[] = [];
  for (let b = 0; b <= 10; b++) {
    if (distMap.has(b)) {
      femoDistribution.push({ label: b === 10 ? '10' : `${b}–${b + 1}`, value: distMap.get(b)! });
    }
  }

  // Divergence vs IMDb (value = Felix rating − IMDb rating)
  const withBoth = movies
    .map((movie) => {
      const f = num(movie.FemoRating);
      const i = num(movie.ImdbRating);
      return f !== null && i !== null ? { movie, value: f - i } : null;
    })
    .filter((x): x is RankedMovie => x !== null);
  const mostOverrated = [...withBoth].sort((a, b) => b.value - a.value).slice(0, 6);
  const mostUnderrated = [...withBoth].sort((a, b) => a.value - b.value).slice(0, 6);
  const sameAsImdb = [...withBoth]
    .sort((a, b) => Math.abs(a.value) - Math.abs(b.value))
    .slice(0, 6);

  // Watched-by-year (from the stored "Watched" date string)
  const watchedYears = movies
    .map((m) => {
      const t = Date.parse(m.Watched);
      return Number.isNaN(t) ? null : new Date(t).getFullYear();
    })
    .filter((y): y is number => y !== null)
    .map(String);
  const watchedByYear = tally(watchedYears).sort((a, b) => a.label.localeCompare(b.label));

  // Longest / shortest / oldest / newest
  let longest: Movie | null = null;
  let shortest: Movie | null = null;
  for (const m of movies) {
    const r = parseRuntime(m.Runtime);
    if (r === null) continue;
    if (!longest || r > (parseRuntime(longest.Runtime) ?? 0)) longest = m;
    if (!shortest || r < (parseRuntime(shortest.Runtime) ?? Infinity)) shortest = m;
  }
  let oldest: Movie | null = null;
  let newest: Movie | null = null;
  for (const m of movies) {
    const y = parseYear(m.Year);
    if (y === null) continue;
    if (!oldest || y < (parseYear(oldest.Year) ?? Infinity)) oldest = m;
    if (!newest || y > (parseYear(newest.Year) ?? 0)) newest = m;
  }

  return {
    totalMovies: movies.length,
    totalRuntimeMinutes,
    totalRuntimeLabel: formatDuration(totalRuntimeMinutes),
    avgRuntimeMinutes: Math.round(avg(runtimes)),
    avgFemoRating: avg(femo),
    avgImdbRating: avg(imdb),
    ratedCount: runtimes.length,
    topActors: tally(movies.flatMap((m) => asArray(m.Actors))).slice(0, 15),
    topDirectors: tally(movies.map((m) => m.Director)).slice(0, 10),
    byDecade,
    byGenre: tally(movies.flatMap((m) => asArray(m.Genre))),
    femoDistribution,
    mostOverrated,
    sameAsImdb,
    mostUnderrated,
    watchedByYear,
    longest,
    shortest,
    oldest,
    newest,
  };
}
