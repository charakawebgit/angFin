# angcF Audit & Opportunities

## Overview
- Angular 21.0.x medical calculator suite with Tailwind 4 and Capacitor Android support. Scripts include `ng serve`, `ng build`, `ng lint`, and `vitest` for tests.
- Registry-driven calculators with tags (see docs/registry-tags.md) and favorites persisted to localStorage.

## Strengths
- Rich calculator registry with tagging; modular Angular architecture noted in README.
- Cross-platform intent via Capacitor (Android target present).
- Testing stack includes Vitest with jsdom/happy-dom available.
- Tooling: Angular CLI 21, Tailwind 4, ESLint 9, TypeScript 5.9.

## Observations (based on repo metadata)
- No mention of zoneless/signal usage; likely still relies on standard change detection and traditional `@Input()` decorators—worth modernizing to Angular 21 patterns (signals, `input()/output()`).
- Theming details are unspecified; potential mix of Tailwind utilities without a tokenized design system could lead to inconsistent dark/light behavior.
- Capacitor setup is present but build/release pipeline details are not surfaced in README (Android gradle files exist).
- Lint/test scripts exist; coverage status unknown.

## Recommendations (angcF)
1) Adopt signal-based patterns and zoneless change detection:
   - Use `provideZonelessChangeDetection()` in app config; migrate components to `input()/output()` and signals for state.
2) Establish a theme token layer with Tailwind 4 `@theme`:
   - Define surface/text/accent/border tokens similar to angFin; replace hardcoded slate/neutral utilities, ensure light/dark contrast.
3) Calculator registry performance:
   - Ensure lazy loading of calculator bundles/routes; apply `withComponentInputBinding` for route params.
   - Add track-by in `@for` loops to reduce DOM churn.
4) Mobile (Capacitor) polish:
   - Audit Android build for icon/splash assets, theme colors, and network security config; ensure `StatusBar` handling matches light/dark themes.
5) Testing:
   - Expand Vitest coverage to shared components and calculator logic; mock localStorage for favorites; add accessibility checks.
6) Documentation:
   - Add CONTRIBUTING/architecture notes on features/services/shared structure; document release steps for web + Android.

## Cross-Project Opportunities
- Share a unified theme system: port angFin’s token approach (surface/text/accent variables) into angcF to keep brand consistency and ease maintenance.
- Shared UI kit: extract common inputs/selects/cards into a package or shared folder usable by both projects, using signal-based APIs and token-driven styling.
- Tooling alignment: standardize lint/prettier configs, testing setup (Vitest + Testing Library), and CI steps across both repos.

## Suggested Next Steps
- angcF: run `npm run lint` and `npm run test` to baseline; add a theming token layer and migrate top-level shared components off hardcoded colors.
- angFin: finish removing hardcoded Tailwind slate/white utilities and align focus/hover states to tokens (see angFin audit).
