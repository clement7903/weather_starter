# Testing patterns

- Test runner: Vitest configured in `vitest.config.ts` (backend tests live under `backend/src/**/*.test.ts`).
- Use `NODE_ENV=test` and `LOG_LEVEL=silent` for CI-like runs to reduce noise.
- Recommended command examples:
  - Run all tests (root): `npm test`
  - Run a single test file: `./node_modules/.bin/vitest run backend/src/weather.test.ts --reporter=verbose`

Agent guidance
- When modifying backend behavior, run and update unit tests in `backend/src/`.
- Prefer small, focused tests; use Supertest for API-level assertions.
