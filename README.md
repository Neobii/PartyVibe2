# Party Vibe 2

Mood tracker with Next.js, TanStack Query, and PostgreSQL.

[PartyVibe2](https://party-vibe2.vercel.app)

## Setup

1. Copy `.env.example` to `.env` and add your `DATABASE_URL`.
2. Push the schema and run the app:

```bash
npm install
npm run db:push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. **Push your code to GitHub** (if not already).

2. **Add a database** in the Vercel dashboard:
   - Go to [vercel.com](https://vercel.com) → your project → Storage
   - Create **Postgres** (Vercel Postgres) or connect **Neon**
   - Copy `DATABASE_URL` to your environment variables

3. **Connect the repo**:
   - [vercel.com/new](https://vercel.com/new) → Import your repo
   - Add env var: `DATABASE_URL` = your connection string

4. **Apply schema before first deploy** (run once locally with prod `DATABASE_URL`):
   ```bash
   DATABASE_URL="your-production-url" npx prisma db push
   ```

5. **Deploy** – Vercel builds and deploys on push.

### Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
# Add DATABASE_URL when prompted, or set in project Settings → Environment Variables
```

## Pages

- `/` — Home; lists characters with links to each character and chart
- `/login` — GitHub sign-in (required for admin)
- `/admin` — Admin panel to set mood (-100 to 100); requires login

## GitHub Auth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. New OAuth App: set **Homepage URL** and **Authorization callback URL** (e.g. `http://localhost:3000/api/auth/callback/github` for local)
3. Add to `.env`: `GITHUB_ID`, `GITHUB_SECRET`, `AUTH_SECRET` (run `openssl rand -base64 32`)

## API

- **GET /api/mood** — Returns `{ "mood": number }`
- **POST /api/mood** — `{ "value": 0 | 1 }` — 0 decrements mood, 1 increments it
- **PATCH /api/mood** — `{ "mood": number }` — Set mood to exact value (admin)
