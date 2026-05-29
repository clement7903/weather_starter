# AGENTS.md — Quick agent entrypoint

One-line description: Weather Starter — monorepo with a Vite + React frontend and a Node/Express TypeScript backend using Drizzle + SQLite.

Package manager: npm (root workspace + `frontend/` and `backend/` packages).

Essentials (root-level, relevant to every task)

- Core root commands: `npm run dev`, `npm run build`, `npm run start`, `npm test`.
- Monorepo, ES modules (`type: module`), TypeScript codebase.
- Tests live in `backend/src/**/*.test.ts` (Vitest, Node env).

More detailed guidance is organized into focused docs under `docs/agents/`.

- Commands and scripts: [docs/agents/commands.md](docs/agents/commands.md)
- TypeScript & module conventions: [docs/agents/typescript.md](docs/agents/typescript.md)
- Testing patterns: [docs/agents/testing.md](docs/agents/testing.md)
- Database & migrations: [docs/agents/database.md](docs/agents/database.md)
- Safety & edit guidance: [docs/agents/guidance.md](docs/agents/guidance.md)
- Where to look (entry points & key files): [docs/agents/where_to_look.md](docs/agents/where_to_look.md)

Suggested docs folder structure

```
docs/
  agents/
    commands.md
    typescript.md
    testing.md
    database.md
    guidance.md
    where_to_look.md
```

If you want I can also convert this into `.github/copilot-instructions.md` or create focused agent skills next.
