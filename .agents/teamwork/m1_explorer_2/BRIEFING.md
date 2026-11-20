# BRIEFING — 2026-11-20T00:44:00Z

## Mission
Produce an exact, implementation-ready strategy for M1 Frontend (Shared Vitest + Testing Library infra in `Froravel-Front` and R1 auth flows in `apps/landing`: forgot/reset password, email confirmation, RH session fix, and automated Vitest test plan).

## 🔒 My Identity
- Archetype: teamwork_preview_explorer
- Roles: Explorer, Synthesizer
- Working directory: C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m1_explorer_2
- Original parent: 189625da-cab0-4c9f-875b-20770dbcc54b
- Milestone: M1 (Iteration 1)

## 🔒 Key Constraints
- Read-only investigation — do NOT modify source code outside `.agents/teamwork/m1_explorer_2/`
- Write `progress.md` and `handoff.md` in working directory
- Report back via `send_message` to `189625da-cab0-4c9f-875b-20770dbcc54b`

## Current Parent
- Conversation ID: 189625da-cab0-4c9f-875b-20770dbcc54b
- Updated: 2026-11-20T00:44:00Z

## Investigation State
- **Explored paths**:
  - `Froravel-Front/package.json`, `apps/{landing,mae,psicologo,rh}/package.json`, `packages/shared/**`
  - `apps/landing/{vite.config.js,eslint.config.js,index.html,vercel.json,.env,.env.example}`
  - `apps/landing/src/{App.jsx,main.jsx,utils/appLinks.js,Screen/Auth/LoginScreen.jsx,Screen/Auth/CadastroScreen.jsx}`
  - `apps/{rh,mae,psicologo}/src/App.jsx` (`hidratarSessaoDoHash`)
  - Backend `AuthController.java`, `AuthService.java`, `MaeController.java`, `MaeService.java`, `MaeResponseDTO.java`, `LoginResponseDTO.java`, `GlobalExceptionHandler.java`
  - Verified npm package versions (`vitest@5.1.1`, `@testing-library/react@16.3.3`, `@testing-library/jest-dom@8.0.0`, `@testing-library/user-event@14.6.13`, `@testing-library/dom@10.4.2`, `jsdom@31.0.1`) on Node `v24.21.0` / npm `11.19.0`.
- **Key findings**:
  - `vitest@5.1.1` supports `vite@^8.0.0`; `@testing-library/react@16.3.3` supports `react@^19.0.0`; `@testing-library/jest-dom@8.0.0` aligns with `vitest@^5.0.0`.
  - `@floravel/shared`'s `isLocalEnvironment` & `LoginScreen`'s `API_BASE` evaluate at module import time; Vitest needs `environmentOptions.jsdom.url = 'http://localhost:5173/'` and `test.env.VITE_API_URL` so tests don't depend on `.env`.
  - `POST /api/maes` returns `MaeResponseDTO` WITHOUT `tokenSessao`, so post-cadastro confirmation must follow `POST /api/auth/confirmar-email` with an automatic `POST /api/auth/login` (using in-memory credentials) before calling `navigateToApp('mae', ...)`.
  - `LoginScreen.jsx:131` writes RH sessions to `floravel_mae_sessao` instead of `floravel_rh_sessao`; line 21 has a hardcoded `GOOGLE_CLIENT_ID_PUBLIC` fallback literal.
- **Unexplored areas**: None within M1 Frontend scope.

## Key Decisions Made
- Recommend root-hoisted Vitest 5.1.1 + RTL 16.3.3 + jsdom 31.0.1 with separate `apps/landing/vitest.config.js` so `npm run build:all` is completely unaffected.
- Recommend extracting `PasswordRecoveryFlow.jsx` and `EmailConfirmationFlow.jsx` (with route wrappers `/esqueci-senha`, `/redefinir-senha`, `/confirmar-email`) reused by `LoginScreen.jsx` modals.

## Artifact Index
- `DISPATCH.md` — Recorded parent dispatch
- `BRIEFING.md` — Working memory
- `progress.md` — Liveness heartbeat
- `handoff.md` — Final 5-component implementation strategy report
