# CLAUDE.md

Guidance for working in this repo. fmovies is a personal movie catalog: a public, read-only
catalog (Vue 3 SPA) plus a login-gated admin area for adding movies. Live at
https://fmovies.vercel.app/. Originally built 2020 (Vue 2 + Express), modernized 2026.

## Architecture

```
Browser ── reads ──► Firebase Realtime DB   (rules: .read = true, .write = false)
   │
   └─ /admin (Google sign-in) ── POST /api/addMovie (Bearer Firebase ID token)
                                      │
                                      ▼
                          Vercel serverless function
                          ├─ verify ID token + admin allowlist
                          ├─ enrich via OMDb
                          └─ write via Firebase Admin SDK  (bypasses DB rules)
```

- **client/** — Vue 3.5 + Vite + Pinia + TypeScript SPA (`<script setup lang="ts">`). Reads the
  catalog **directly** from the Realtime Database (client never calls the API for reads).
- **api/** — Vercel serverless functions (TypeScript, CommonJS). `addMovie` (auth-gated write via
  Admin SDK) and `searchOmdb` (OMDb preview, keeps the key server-side). Files: `api/addMovie.ts`,
  `api/searchOmdb.ts`, `api/_lib/{firebaseAdmin,auth,omdb}.ts`.
- **shared/movie.ts** — `Movie` and `OmdbResponse` types imported by both client (`@shared/movie`)
  and API (`../../shared/movie`).
- Single Vercel project serves both the SPA and `/api/*` (see `vercel.json`).

## Commands

```bash
# install (root holds firebase-admin/@vercel/node; client holds SPA deps)
npm install --prefix client && npm install

# client dev (catalog UI only, no /api)
npm run dev --prefix client            # http://localhost:8080

# full stack incl. /api (needs Vercel CLI + linked project + pulled env)
vercel dev

# type-check + production build of the client
npm run build --prefix client          # vue-tsc --noEmit && vite build

# deploy
vercel deploy            # preview
vercel deploy --prod     # production (aliases fmovies.vercel.app)
```

Environment: Windows, PowerShell primary. `node`/`npm`/`vercel` are on the **Machine PATH** but a
shell/VS Code opened before install won't see them — open a fresh terminal, or refresh in-session:
`$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")`.

## Data model

Movies are stored in the Realtime DB **keyed by `Title` at the root** (e.g. `/Inception`). Do not
reshape this — existing data depends on it. All fields are strings except `Genre`/`Actors` (string
arrays); ratings (`FemoRating`, `ImdbRating`, `Year`) are strings — coerce with `Number()` when
sorting, and format ratings for display with `formatRating` (`client/src/format.ts`).

## Environment variables

**Client (public, `VITE_`-prefixed, safe in the bundle — Firebase web config is not secret):**
`VITE_FIREBASE_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_DATABASE_URL`,
`VITE_FIREBASE_PROJECT_ID`, `VITE_ADMIN_EMAILS` (UI gating only). In production
`VITE_FIREBASE_AUTH_DOMAIN` is set to `fmovies.vercel.app` (first-party auth, see gotchas); local
`client/.env.local` may use `fmovies-7dd88.firebaseapp.com`.

**Serverless (secret, un-prefixed, set in Vercel only):** `FIREBASE_SERVICE_ACCOUNT` (full JSON),
`FIREBASE_DATABASE_URL`, `OMDB_APIKEY`, `ADMIN_ALLOWLIST` (comma-separated admin emails).

All are set in Vercel for Production + Preview + Development. `client/.env.example` documents the
client set. `serviceAccount.json` at repo root is git-ignored (used for local `vercel dev`); its
value is also stored as the `FIREBASE_SERVICE_ACCOUNT` Vercel var.

## Deployment (Vercel)

Project: `fmovies-0zzo` (scope `felix-moraus-projects`). **Root Directory = repo root** (not
`client/`), Framework = Other, Node = 22.x. `vercel.json` drives the build (`vite build` →
`client/dist`), routes `/api/*` to functions, proxies `/__/auth` + `/__/firebase` to Firebase, and
rewrites everything else to `index.html` for the SPA router. Production and preview both deploy the
same monorepo; production aliases `fmovies.vercel.app`.

**Deploys are automatic via the GitHub↔Vercel Git integration (production branch = `master`):**
- **Merge to `master` → automatic production deploy** to `fmovies.vercel.app` (~30–60s). Just merge;
  do NOT run `vercel deploy --prod` — it only redundantly rebuilds the same commit.
- **Push a branch / open a PR → automatic preview deploy.**
- Use the `vercel` CLI only for one-off previews outside the git flow (e.g. testing an unmerged
  branch locally-built). A merge-triggered deploy is identifiable by its `…-git-master-…` alias.

## Security model

- Realtime DB rules are permanently `{ ".read": true, ".write": false }` (`database.rules.json`).
  Public catalog; **no client writes ever**. Do not "temporarily open" writes — that pattern is gone.
- All writes go through `api/addMovie.ts`, which calls `requireAdmin()` (`api/_lib/auth.ts`):
  verifies the Firebase ID token, requires `email_verified`, and checks the email against
  `ADMIN_ALLOWLIST`. The Admin SDK write **bypasses** the DB rules by design.
- The client-side `isAdmin` check (`VITE_ADMIN_EMAILS`) is **UI gating only** — never the real
  boundary. The serverless function is the authority.

## Maintenance: poster rot

**Poster URLs decay and must be re-swept periodically.** Almost every `Poster` is an
`m.media-amazon.com` URL; IMDb deletes/replaces those images over time and the old URL starts
404ing. Nothing in the app surfaces this — `Movie.vue` renders the poster as a CSS
`background-image` and the overlay/stat list use plain `<img>`, so a dead link is just a blank
tile with no console error. **A record is never "missing" a poster — the field is always
populated; the URL behind it is dead.** Don't look for empty/`N/A` values, HTTP-check the URLs.

Last sweep: **2026-09-06 — 75 of 432 (17%) were dead** (72×404, plus 3×400 on stale
`upload.wikimedia.org` thumbs). All 75 replaced; backup of the pre-write DB kept out of tree.

### Procedure

1. **Pull the catalog** — `curl https://fmovies-7dd88.firebaseio.com/.json` (public read, no auth).
2. **HTTP-check every `Poster`** with a browser UA. 404 = gone; Wikimedia thumbs 400 when the
   thumbnail is regenerated.
3. **Re-look-up** through the site's own endpoint: `/api/searchOmdb?title=…` or `?imdbId=…`
   (unauthenticated, keeps `OMDB_APIKEY` server-side — no need to pull the key locally).
4. **Always verify `Director` + `Year` against the existing record before accepting a match.**
   Non-negotiable: bare title lookups return confidently wrong films. Real misses from the 2026-09
   sweep — `Swimmer` (2020, Jonatan Etzler) → Lynne Ramsay's 2012 short; `The Emigrants` (2021,
   Poppe) → Troell's 1971 original; `The Silence` (1963, Bergman) → the 2019 horror film;
   `Kill Bill: Volume 2` → *The Making of Kill Bill: Volume 2*; `Disco` (2019, Norwegian) → the
   2008 French comedy. Compare only the first director and the first 4 chars of `Year`, and expect
   name-order variants (`Kar-Wai Wong` vs `Wong Kar-Wai`) and ±1y OMDb drift on festival releases.
5. **OMDb frequently serves the *same dead URL*** — it is not an independent source. It could not
   fix 21 of the 75 (all 12 `Johan Falk:*`, plus `1-1`, `A Snowy Christmas`, `Inside the Diamond`,
   `Intercourse`, `Olla`, `Swimmer`, `Portrait d'une jeune fille…`). For those, fall back to
   **TMDb** — it resolved all 21. TMDb images: `https://image.tmdb.org/t/p/w500<poster_path>`.
   - `GET /3/find/{ttID}?external_source=imdb_id` is precise — prefer it over title search.
   - For shorts/obscure titles, `/3/search/person` → `/3/person/{id}/movie_credits` and pick the
     directing credit by year. This is the only thing that found the right `Swimmer`.
   - **No TMDb key is stored in this project** (deliberately — it is not needed at runtime). Ask
     the user for one; free from themoviedb.org. Don't commit it.
6. **Getting an IMDb ID when the OMDb title lookup misses:** Wikidata `wbsearchentities` +
   `wbgetentities` (claim `P345`), searching en/sv/fr labels. Use the **entity API, not SPARQL** —
   `query.wikidata.org` returned 502/504 on most requests.
7. **Dead ends, don't retry them:** IMDb blocks scraping (`www.imdb.com/title/…` → HTTP 202, empty
   body, no `og:image`). Wikipedia `pageimages` returns nothing for films — non-free posters are
   excluded from the API. Stripping the `._V1_SX300` transform off a dead Amazon URL also 404s;
   the underlying asset is gone, not just the derivative.

### Writing the fixes

- **Update the `Poster` field only**, via `firebase-admin` + root `serviceAccount.json`
  (`admin.database().ref().child(key).update({ Poster })`). Guard each write with a
  compare-and-set against the value seen during the scan so a concurrent change isn't clobbered.
- **Do NOT route this through `/api/addMovie`** — it rewrites the whole record via `toMovie()` and
  would reset `Watched` to today and overwrite `FemoRating`.
- **Back up first:** `curl …/.json -o backup-<ts>.json`, and keep it out of the repo.
- Run the script **from the repo root** so `firebase-admin` resolves — a script sitting in a temp
  dir won't find it (`NODE_PATH` and `-e require(…)` both fight Windows path handling; just
  `cp` the script in, run it, delete it).
- **Verify after:** re-pull the DB and diff against the backup — assert the entry count is
  unchanged, that *only* `Poster` differs and *only* on the intended keys, then re-crawl all
  posters expecting zero non-200.

Known open issue: the client has **no placeholder fallback**, so any future rot is silently
invisible again. A title-card fallback on image error in `Movie.vue` / `MovieOverlay.vue` /
`MovieStatList.vue` would make the next decay self-evident.

## Conventions

- **Always branch from a freshly pulled `master`.** Before starting new work, run
  `git checkout master && git pull`, then create the feature branch from it. Never branch off another
  feature branch.
- **Commits: Conventional Commits** (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, optional scope
  like `fix(auth):`). **Do NOT add `Co-Authored-By: Claude` trailers; never list Claude as author or
  committer.** Keep commits atomic. Work on a branch and open a PR (default branch is `master`).
- TypeScript throughout; Vue components use `<script setup lang="ts">`. Path aliases: `@` → client
  `src`, `@shared` → repo `shared`.
- Match the existing terse, single-file-component style; scoped styles per component.

## Gotchas / hard-won lessons

- **Env values can carry a trailing `\r`** (e.g. when set by piping through PowerShell). Code trims
  defensively at point of use (`omdb.ts`, `firebaseAdmin.ts`, client `firebase.ts`) — keep doing
  that; a stray CR silently breaks the OMDb key (401→502) and Admin SDK init.
- **Firebase Google auth is first-party by design here.** `authDomain` points at `fmovies.vercel.app`
  and `/__/auth/*` is proxied to `fmovies-7dd88.firebaseapp.com` via `vercel.json`. Without this,
  `signInWithRedirect` silently drops the session (cross-origin storage partitioning).
- **Use `signInWithRedirect`, not popup** — popups get blocked (`auth/popup-blocked`). Never trigger
  sign-in from a router guard (no user gesture → blocked); trigger it from a button click.
- **Firebase auth prerequisites** (console, easy to miss): Google provider **Enabled** with a support
  email; an existing **OAuth 2.0 client** in Google Cloud (a deleted one → `deleted_client`) whose
  authorized redirect URIs include `https://fmovies.vercel.app/__/auth/handler` and
  `https://fmovies-7dd88.firebaseapp.com/__/auth/handler`, wired into Firebase → Google → Web SDK
  configuration; and both domains in Auth → **Authorized domains**.
- **OMDb returns HTTP 200 on a miss** with `{ "Response": "False" }` — treat as 404 (handled in
  `omdb.ts`).
- **Poster URLs rot** — stored `m.media-amazon.com` links go 404 over time and fail silently (blank
  tile, no error). Re-sweep periodically; see [Maintenance: poster rot](#maintenance-poster-rot).
- **Client build type-check:** use `vue-tsc --noEmit` (not `-b`/composite) — composite build mode
  emitted a stray `vite.config.js` that broke Vite's ESM config loader.
- `@vue/tsconfig@0.7` has no `tsconfig.node.json`; `client/tsconfig.node.json` is self-contained.
- The public catalog never calls the backend; if you add read APIs, wire them deliberately.

## API reference

- `GET /api/searchOmdb?title=…` | `?imdbId=…` → OMDb preview (unauthenticated).
- `POST /api/addMovie` → body `{ title? | imdbId?, rating }`, header
  `Authorization: Bearer <Firebase ID token>`. `201` on success; `400` bad input; `401` no/invalid
  token; `403` not an admin; `404` movie not found.
