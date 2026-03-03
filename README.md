# Party Vibe 2

Mood tracker with Next.js, TanStack Query, and SQLite.

## Setup

```bash
npm install
npm run db:push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API

- **POST /api/mood** — `{ "value": 0 | 1 }` — 0 decrements mood, 1 increments it
- **GET /api/mood** — Returns `{ "mood": number }`
