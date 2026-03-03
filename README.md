# Party Vibe 2

Mood tracker with Next.js, TanStack Query, and PostgreSQL.

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

- `/` — Main mood display with increment/decrement buttons
- `/admin` — Admin panel to set mood to a specific value

## API

- **GET /api/mood** — Returns `{ "mood": number }`
- **POST /api/mood** — `{ "value": 0 | 1 }` — 0 decrements mood, 1 increments it
- **PATCH /api/mood** — `{ "mood": number }` — Set mood to exact value (admin)
