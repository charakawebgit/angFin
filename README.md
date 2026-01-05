# AngFin — Finance Calculator Suite

Modern Angular 21 application delivering 40+ finance calculators (TVM, corporate finance, valuation, fixed income, real estate, ratios). Built with zoneless change detection, Tailwind 4, and a light/dark design system.

## Quick Start

```bash
npm install
npm start
# app runs at http://localhost:4200
```

Key scripts:
- `npm run build` – production build
- `npm run lint` / `npm run lint:fix` – linting
- `npm run format` – format source files

## Architecture
- **entities/** domain models and calculation utilities
- **features/** calculator workspace and flows
- **pages/** top-level routes (home, calculator, static)
- **shared/** reusable UI components and theme services
- **public/** PWA assets and manifest

## Theming
- CSS variables in `src/styles.css` define surfaces, text, accent colors, and light/dark overrides.
- Components consume tokens via `var(--surface-*)`, `var(--text-*)`, `var(--accent-*)` to keep contrast consistent across modes.

## Development Notes
- Change detection is `OnPush` and uses signals; prefer immutable updates.
- Forms use `ReactiveFormsModule`; calculator configs drive dynamic fields and validation.
- Keep calculations pure and covered by specs (see audit recommendations for testing roadmap).

## Deployment Checklist
- Build: `npm run build`
- Service worker/PWA: ensure `public/manifest.webmanifest` icons exist
- Environment: Node 20+ (LTS), npm 10+

## Contributing
- Run lint and format before PRs.
- Keep new components theme-token aware; avoid hardcoded slate/white utility colors.
- Add references/educational links in calculator configs when available.
