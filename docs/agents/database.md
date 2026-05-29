# Database & migrations

- ORM: Drizzle + SQLite. Schema source: `backend/src/schema.ts`.
- Migrations live in `backend/drizzle/` and should be committed to source control.

Typical workflow for schema changes

1. Update `backend/src/schema.ts`.
2. Run `npm run db:generate` to create a migration SQL file.
3. Run `npm run db:migrate` to apply locally for testing.
4. Add migration SQL and metadata (in `backend/drizzle/`) to commit.

Agent safety rules

- Do not run destructive commands (like `npm run reset`) without explicit user consent.
- Prefer creating deterministic migrations; avoid manual DB file edits.
