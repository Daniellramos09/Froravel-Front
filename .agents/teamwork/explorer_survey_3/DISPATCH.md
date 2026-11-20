## 2026-11-20T00:34:43Z

You are `explorer_survey_3` (Type: `teamwork_preview_explorer`), performing Step 0 Survey for the Florável project.

**Working Directory**: `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\explorer_survey_3`
**Parent Orchestrator ID**: `189625da-cab0-4c9f-875b-20770dbcc54b`
**Mandatory First Step**: Read `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\ORIGINAL_REQUEST.md` verbatim before starting any investigation.

**Objective**:
Perform a thorough read-only technical survey of the Frontend Monorepo at `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front` focusing on:
1. **Monorepo Structure & Build/Test Setup**: Root `package.json` (`build:all` and other scripts, workspace manager), shared `packages/*` (API client / axios / fetch wrapper, auth state, shared UI components, types), TypeScript/Vite/React/Next/Tailwind configs, `.env*` files, and existing test runners (Vitest/Jest/Playwright/etc. if any).
2. **R1 (`apps/landing`)**: Inspect login, registration, email/code validation, and any existing forgot/reset password screens, routes, and API calls.
3. **R2 (`apps/rh`)**: Inspect all pages, components, services, and mocked data in `apps/rh` (Dashboard RH and sub-views). Document exact mock data shapes vs what needs to be replaced by real HTTP calls to `RhCorporativoController`.
4. **R3 (`apps/psicologo` and `apps/mae` — `SalaAcolhimento` & notifications)**: Inspect `SalaAcolhimento` and related consultation/meeting/notification code in both `apps/psicologo` and `apps/mae`. Check dependencies (whether Jitsi SDK like `@jitsi/react-sdk` or external script is installed), room naming/identifiers, SSE/notification consumption, auth token handling.
5. **R4 (Profile Photo Upload)**: Inspect user profile pages/components across apps (`apps/mae`, `apps/psicologo`, `apps/rh`, `packages/*`) to see where profile editing and avatar/photo display/upload live.

**Scope Boundaries**:
- Read-only investigation! Do NOT modify any source code files.
- Write `progress.md` (with `Last visited: <timestamp>`) and your complete structured survey report in `handoff.md` inside your working directory (`C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\explorer_survey_3\`).

**Completion Criteria**:
Write `handoff.md` with exact file paths, monorepo workspace layout, build/test tooling, detailed findings for R1, R2, R3, R4, and any baseline build issues (`npm run build:all` if safe to check, or config inspection). Then send a concise `send_message` to `189625da-cab0-4c9f-875b-20770dbcc54b` referencing your `handoff.md` path.
