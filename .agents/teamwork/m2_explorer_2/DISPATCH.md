## 2026-11-20T01:20:50Z

You are `m2_explorer_2` (`teamwork_preview_explorer`) for **Milestone M2 (R2 Full-Stack — Frontend `apps/rh`)**, Iteration 1.

- **Working Directory**: `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m2_explorer_2`
- **Parent Orchestrator ID**: `189625da-cab0-4c9f-875b-20770dbcc54b`
- **Mandatory Reading First**:
  1. `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\ORIGINAL_REQUEST.md`
  2. `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\PROJECT.md`
  3. `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\explorer_survey_3\handoff.md`

**Objective**:
Perform a read-only deep dive into `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\apps\rh\**` (`App.jsx`, `DashboardRh.jsx`, `Sidebar.jsx`, `screens/LicensesScreen.jsx`, `screens/HealthReportsScreen.jsx`, `screens/BillingScreen.jsx`, `screens/SettingsScreen.jsx`, `package.json`, `eslint.config.js`, `vite.config.js`, `.env.example`) to design the exact M2 Frontend implementation:
1. API service (`apps/rh/src/services/rhApi.js`): uses `getApiBase()` from `@floravel/shared`, reads `floravel_jwt` from `localStorage`, sends `Authorization: Bearer ...`, parses `ErrorResponseDTO`, handles 401/403/network errors cleanly.
2. Exact replacement of hardcoded mocks (`"TechCorp Brasil"`, `42 / 50`, `INITIAL_COLLABORATORS`, etc.) across `DashboardRh.jsx`, `Sidebar.jsx`, `LicensesScreen.jsx`, `HealthReportsScreen.jsx`, `SettingsScreen.jsx`, and `BillingScreen.jsx`:
   - Real loading states (skeleton/spinner), explicit error banner with retry button, and **safe fallback** (clearly distinguishing real backend K-anonymity metrics & license counts from LGPD-firewalled or unavailable clinical/billing panels — never silently faking mock data as live API data!).
   - Real CRUD in `LicensesScreen.jsx` (list, invite, resend, revoke, reactivate, copy invite link with real `tokenConvite`).
   - Auth session guard & working logout button in `Sidebar.jsx` / `App.jsx` (clearing `floravel_rh_sessao` / `floravel_jwt` and redirecting to `APP_LINKS.landing + '/login'`).
3. Vitest + Testing Library setup (`apps/rh/vitest.config.js`, `src/test/setup.js`, `package.json` `"test": "vitest run"`, ESLint test override) + comprehensive automated tests covering loading, real data rendering, invite/revoke/reactivate/resend, and 401/403/500/network fallback states.

Write `progress.md` and `handoff.md` in your working directory, then `send_message` to `189625da-cab0-4c9f-875b-20770dbcc54b`.
