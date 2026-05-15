# Commands & scripts

Root commands (run at repository root):
- `npm run dev` — start development environment (Portless: Express backend + Vite frontend middleware).
- `npm run build` — build frontend and compile backend TypeScript.
- `npm run start` — run the compiled production server (`backend/dist/server.js`).
- `npm test` — run backend tests (Vitest).
- `npm run doctor` — project health checks (calls `/health` and `/api/locations`).
- `npm run reset` — deletes `backend/weather.db` (destructive; ask before running).

Frontend (from `frontend/`):
- `npm run dev` — Vite dev server.
- `npm run build` — Vite production build.

Backend (from `backend/`):
- `npm run dev` — tsx watch/dev server for backend.
- `npm run build` — compile TypeScript to `dist`.
- `npm run start` — run compiled server.

DB-related (backend/root):
- `npm run db:generate` — generate Drizzle migration SQL after schema changes.
- `npm run db:migrate` — apply pending migrations.

Notes for agents
- Always show full commands and the working directory when suggesting them to a user.
- Avoid recommending `npm run reset` or other destructive commands without explicit user approval.
