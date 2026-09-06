# fmovies

A movie catalog. Public, read-only catalog (Vue 3 SPA) + a login-gated admin area for adding
movies. Live at https://fmovies.vercel.app/.

## Architecture (2026 rewrite)

```
Browser ── reads ──► Firebase Realtime DB   (public: .read = true)
   │
   └─ /admin (Google sign-in) ── POST /api/addMovie (Bearer ID token)
                                      │
                                      ▼
                          Vercel serverless fn
                          ├─ verify token + admin allowlist
                          ├─ enrich via OMDb
                          └─ write via Firebase Admin SDK  (bypasses rules)
```

- **client/** — Vue 3 + Vite + Pinia + TypeScript SPA. Reads the catalog directly from the
  Realtime Database. The `/admin` route (Google sign-in) hosts the upload form.
- **api/** — Vercel serverless functions (TypeScript). `addMovie` (auth-gated write via Admin
  SDK) and `searchOmdb` (OMDb preview, keeps the key server-side).
- **shared/** — `Movie` / `OmdbResponse` types shared by client and API.
- **Security**: the DB is permanently `{".read": true, ".write": false}`. All writes go through
  the Admin SDK after the function verifies the caller is an allowlisted admin. No more manual
  Firebase rule toggling.

## Local development

```bash
# install
npm install --prefix client && npm install

# catalog UI only (no serverless API):
npm run dev --prefix client          # http://localhost:8080

# full stack incl. /api (requires Vercel CLI + linked project + pulled env):
npm i -g vercel
vercel link
vercel env pull            # writes .env.local for the functions
vercel dev                 # serves client + /api on one origin
```

Client env (`client/.env.local`, copy from `client/.env.example`) — public Firebase web config:
`VITE_FIREBASE_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_DATABASE_URL`,
`VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`, `VITE_ADMIN_EMAILS`.

## Serverless env (Vercel project settings — secret, never committed)

| Var | Value |
|-----|-------|
| `FIREBASE_SERVICE_ACCOUNT` | Full service-account JSON (Firebase Console → Project Settings → Service Accounts → Generate new private key) |
| `FIREBASE_DATABASE_URL` | `https://fmovies-7dd88.firebaseio.com` |
| `OMDB_APIKEY` | OMDb API key |
| `ADMIN_ALLOWLIST` | Comma-separated admin emails (e.g. `felixmorau@gmail.com`) |

## API

- `GET  /api/searchOmdb?title=…`  or  `?imdbId=…` → OMDb preview (unauthenticated).
- `POST /api/addMovie` → `{ title? | imdbId?, rating }`, header `Authorization: Bearer <Firebase ID token>`.
  Verifies the token + allowlist, enriches via OMDb, writes to the DB. `201` on success;
  `401` no/invalid token, `403` not an admin, `404` movie not found.

## Deploy (Vercel)

Single project, **Root Directory = repo root** (not `client/`). Framework = Other. Node 20.x.
`vercel.json` builds the client (`client/dist`) and serves `/api/*` as functions; all other
paths rewrite to `index.html` for the SPA router.
