# TypeScript & module conventions

- Project uses TypeScript across frontend and backend.
- Repository uses ES modules (`"type": "module"`) — prefer import/export syntax.
- Build: root `npm run build` compiles frontend and backend; backend output is `backend/dist`.

Agent guidance

- When changing types, run the relevant build or type-check step (`npm run build` or `tsc` in the package) and update types in nearby modules.
- Avoid introducing namespace-style or CommonJS patterns without explicit rationale.
