## 2026-11-20T00:40:57Z

You are `m1_explorer_2` (`teamwork_preview_explorer`) for **Milestone M1 (R1 Full-Stack — Frontend Shared Test Infra & `apps/landing`)**, Iteration 1.

- **Working Directory**: `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m1_explorer_2`
- **Parent Orchestrator ID**: `189625da-cab0-4c9f-875b-20770dbcc54b`
- **Mandatory Reading First**:
  1. `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\ORIGINAL_REQUEST.md`
  2. `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\PROJECT.md`

**Objective**:
Perform a read-only deep dive into `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\package.json`, `packages/shared/**`, and `apps/landing/**` (`App.jsx`, `LoginScreen.jsx`, `CadastroScreen.jsx`, `vite.config.js`, `package.json`) to produce an exact, implementation-ready strategy for M1 Frontend:
1. Exact Vitest + `@testing-library/react` + `jsdom` configuration compatible with React 19 and Vite 8 in `Froravel-Front` (including `"test:all"` in root `package.json` without breaking `npm run build:all`).
2. Exact UI & routing design in `apps/landing/src/App.jsx` and `LoginScreen.jsx` (and dedicated screen/modal components if cleaner) for:
   - "Esqueci minha senha" -> calls `POST /api/auth/esqueci-senha` (loading, error, transition to 6-digit code + new password)
   - "Redefinir senha" -> calls `POST /api/auth/redefinir-senha` (6-digit code, password confirmation match, loading, error messages for invalid/expired code, success transition to login)
   - Routes `/esqueci-senha`, `/redefinir-senha`, and `/confirmar-email` (plus seamless modal integration in `LoginScreen.jsx`).
   - Post-cadastro email validation step (`POST /api/auth/confirmar-email` + `POST /api/auth/reenviar-codigo`) showing welcome confirmation and allowing entry to `apps/mae`.
   - Fix `salvarSessaoLocal` (`LoginScreen.jsx:131`) for `'rh'` -> `'floravel_rh_sessao'` and RH login redirect.
3. Exact automated Vitest test plan for `apps/landing` covering forgot/reset password & email confirmation (success & error states).

**Constraints**: Read-only! Do NOT modify code. Write `progress.md` and `handoff.md` in your working directory, then `send_message` to `189625da-cab0-4c9f-875b-20770dbcc54b`.
