# The Commons Business Alternatives Dashboard

Investor-ready single-page dashboard for comparing the five modeled business alternatives in `The Commons Model v3.xlsx`, with Alternative 5 framed as the recommended capital-light model.

## Stack

- React 19 + Vite + TypeScript
- Tailwind CSS v4 for layout and styling
- Recharts for the comparison scatter plot and 10-year cash-flow chart
- Vitest + Testing Library for component tests
- Playwright for end-to-end smoke coverage

## Data flow

- `scripts/extract-dashboard-data.mjs` reads `The Commons Model v3.xlsx`.
- The extractor writes `src/data/generatedDashboardData.ts`.
- Editorial copy and curated pros/cons live in `src/data/editorialContent.ts`.
- The app never reads the workbook at runtime; it ships a static snapshot.

## Scripts

- `npm run dev` regenerates workbook data and starts the Vite dev server.
- `npm run build` regenerates workbook data and creates the production bundle.
- `npm run extract-data` refreshes the generated dashboard data without starting the app.
- `npm run lint` runs ESLint.
- `npm run test` runs the Vitest suite.
- `npm run test:e2e` runs the Playwright smoke test.

## Notes

- The workbook and PowerPoint remain in the repo root as the original source references.
- The current production build output lives in `dist/`.
