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
- **Client build type-check:** use `vue-tsc --noEmit` (not `-b`/composite) — composite build mode
  emitted a stray `vite.config.js` that broke Vite's ESM config loader.
- `@vue/tsconfig@0.7` has no `tsconfig.node.json`; `client/tsconfig.node.json` is self-contained.
- The public catalog never calls the backend; if you add read APIs, wire them deliberately.

## API reference

- `GET /api/searchOmdb?title=…` | `?imdbId=…` → OMDb preview (unauthenticated).
- `POST /api/addMovie` → body `{ title? | imdbId?, rating }`, header
  `Authorization: Bearer <Firebase ID token>`. `201` on success; `400` bad input; `401` no/invalid
  token; `403` not an admin; `404` movie not found.
