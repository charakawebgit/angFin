# angFin Audit & Theme Alignment

## Overview
- Angular 21, Tailwind 4, zoneless signals-first. Theme tokens defined in [src/styles.css](src/styles.css) with light/dark CSS variables.
- Recent theming issues came from hardcoded Tailwind slate/white utilities inside shared UI components, causing unreadable text in light mode. Global overrides now fix most cases, but component code still carries legacy classes.

## Strengths
- FSD-style layout (entities/features/pages/shared).
- Signals + `input()/output()` usage, zoneless config present.
- Lucide icon set already integrated; service worker and PWA manifest included.
- ESLint/Prettier/Tailwind 4 configured; Angular 21.0.4 stack up to date.

## Key Findings
- Theme coupling: Components (inputs/selects/header/footer) hardcode slate/white utilities. A global override in [src/styles.css](src/styles.css#L92-L119) patches readability but is brittle.
- Palette fragmentation: Background gradients in light mode previously washed out panels; flattened now, but accents/focus rings are still utility-based in some places (e.g., cyan/blue focus colors not tied to tokens).
- Form UX (zoneless): Inputs rely on `control().invalid` directly; no subscription to `statusChanges`, so async validation or programmatic errors could miss immediate UI updates.
- Asset contrast: Hero/header logo backgrounds previously used dark overlays; now themed but still depend on gradient blur layers that can reduce contrast on light backgrounds.
- Documentation: Root README still Angular CLI boilerplate; does not reflect FSD, zoneless, Tailwind 4, or theming rules.

## Recommended Improvements (angFin)
1) Remove hardcoded slate/white utilities from shared UI:
   - Replace with CSS-variable-driven classes in [src/app/shared/ui/input.component.ts](src/app/shared/ui/input.component.ts#L1-L86), [select.component.ts](src/app/shared/ui/select.component.ts#L1-L56), header/footer, and any remaining `text-slate-*`, `bg-slate-*`, `bg-white/*`, `border-white/*` usages.
   - Drop the global overrides once components are clean.
2) Centralize accent/focus tokens:
   - Define `--accent-1/2` usage for focus rings, hover states, and icons; wire them into component classes instead of `focus:ring-blue-500`/`cyan-400`.
3) Flatten light-mode shell fully:
   - Keep body background solid; avoid radial glows for clarity in light mode. If needed, scope glows to hero only via a wrapper class.
4) Improve input error handling (zoneless):
   - Derive an error signal off `statusChanges` in Input/Select wrappers so programmatic errors surface without user interaction.
5) Update documentation:
   - Replace README with project-specific guidance: FSD layers, theming tokens, zoneless change detection, Tailwind 4 notes, how to add new calculators/entities.
6) Testing:
   - Add Vitest/Testing Library coverage for shared UI (input/select focus/disabled/error states) to prevent regressions in theme.

## Quick Wins
- Search/replace remaining `text-slate-`/`bg-slate-`/`bg-white/`/`border-white/` under `src/app/shared` and `src/app/pages`; map to CSS variables.
- Normalize focus ring: `focus:ring-[color:var(--accent-1)]` everywhere.
- Hero/header gradients: ensure text uses `var(--text-primary)` and backgrounds stay opaque enough in light mode.

## Suggested Next Steps
- Lint: `npm run lint` (already clean). Add UI snapshots/tests for light mode if testing is set up.
- Documentation refresh: update README and add a short theming guide in `/reports` or `/docs`.
