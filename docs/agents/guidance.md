# Safety & edit guidance for AI agents

High-level rules

- Link, don't embed: reference existing docs and configs (`README.md`, `drizzle.config.ts`, `vitest.config.ts`) instead of copying long text.
- Non-destructive by default: avoid destructive actions (DB resets, wiping data, or force-pushing branches) without user confirmation.

When editing code

- Run and update backend tests before and after relevant changes.
- If changes require a schema update, follow the DB workflow in `docs/agents/database.md` and add a migration.
- Preserve existing API shapes unless the task explicitly requests breaking changes; ask before changing public APIs.

User-facing commands

- Always show exact npm commands and the working directory.

Link/reference list

- README: [README.md](README.md)
- Drizzle config: [drizzle.config.ts](drizzle.config.ts)
- Vitest config: [vitest.config.ts](vitest.config.ts)
