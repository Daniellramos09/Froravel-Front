# BRIEFING — 2026-11-20T01:28:00Z

## Mission
Design the exact Milestone M2 Frontend implementation for `apps/rh` (`rhApi.js`, replacing hardcoded mocks with live backend integration + safe LGPD/unavailable fallbacks, real CRUD in `LicensesScreen.jsx`, auth guard & logout, and Vitest + Testing Library test suite).

## 🔒 My Identity
- Archetype: teamwork_preview_explorer
- Roles: explorer, synthesizer
- Working directory: C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m2_explorer_2
- Original parent: 189625da-cab0-4c9f-875b-20770dbcc54b
- Milestone: M2 (R2 Full-Stack — Frontend `apps/rh`), Iteration 1

## 🔒 Key Constraints
- Read-only investigation — do NOT implement or modify source code
- Write reports/metadata only in `.agents/teamwork/m2_explorer_2`
- Follow 5-component Handoff Protocol and send_message to parent on completion

## Current Parent
- Conversation ID: 189625da-cab0-4c9f-875b-20770dbcc54b
- Updated: 2026-11-20T01:28:00Z

## Investigation State
- **Explored paths**:
  - `.agents/teamwork/{ORIGINAL_REQUEST.md,PROJECT.md,TEST_INFRA.md,explorer_survey_3/handoff.md}`
  - `Froravel-Front/package.json`, `packages/shared/package.json`, `packages/shared/src/{index.js,appLinks.js}`
  - `apps/landing/{package.json,eslint.config.js,vitest.config.js,src/test/setup.js,src/Screen/Auth/LoginScreen.jsx,src/Screen/Auth/__tests__/LoginScreen.test.jsx}`
  - `apps/rh/{package.json,eslint.config.js,vite.config.js,.env.example,index.html,src/**}`
  - `floravel-backend/.../modules/rh/**`, `shared/exception/{ErrorResponseDTO,GlobalExceptionHandler}.java`, `shared/security/JwtAuthInterceptor.java`, `shared/config/DemoDayDataSeeder.java`, `modules/auth/dto/LoginResponseDTO.java`
- **Key findings**:
  - `apps/rh` has 0 HTTP calls today and `npm --workspace=@floravel/rh run lint` currently fails on `App.jsx:16` (`no-unused-vars`, `no-empty`).
  - `DemoDayDataSeeder` seeds `"TechMães Brasil S.A."` with departments `"Engenharia"` (6), `"Jurídico"` (2), `"Design"` (2) — `LicensesScreen` hardcoded `"Engenharia de Software"` etc., so department options must accommodate seeded values dynamically.
  - Root `package.json` already provides `vitest`, `@testing-library/*`, `jsdom`, and `test:all`; `apps/rh` needs `vitest.config.js`, `src/test/setup.js` (including `ResizeObserver` polyfill for Recharts), `"test": "vitest run"` script, and ESLint override.
  - Clinical/EPDS/burnout series, multi-admin CRUD, and billing/NF-e have NO backend endpoints (and clinical individual telemetry is LGPD-firewalled), so UI must show explicit LGPD-protected / unavailable states rather than fake mock numbers.
- **Unexplored areas**: None within M2 frontend scope.

## Key Decisions Made
- Designed `rhApi.js` + `rhSession.js` + component-by-component replacement map + Vitest config/test matrix in `handoff.md`.

## Artifact Index
- `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m2_explorer_2\DISPATCH.md` — Logged dispatch
- `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m2_explorer_2\BRIEFING.md` — Working memory
- `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m2_explorer_2\progress.md` — Liveness heartbeat
- `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m2_explorer_2\handoff.md` — M2 Frontend architecture & implementation blueprint
