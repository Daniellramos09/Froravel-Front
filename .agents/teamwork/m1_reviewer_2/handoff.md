# Handoff Report — M1 Frontend Review (`m1_reviewer_2`)

**Handoff Type**: Hard  
**Milestone**: M1 — Frontend R1 & Test Infra (`package.json`, `apps/landing/**`) — Iteration 1  
**Verdict**: **APPROVE**

---

## Review Summary

**Verdict**: **APPROVE**  
**Overall Risk Assessment**: **LOW**

All Frontend M1 deliverables (`package.json`, `apps/landing/package.json`, `apps/landing/vitest.config.js`, `apps/landing/eslint.config.js`, `apps/landing/src/test/setup.js`, `apps/landing/src/App.jsx`, `apps/landing/src/Screen/Auth/PasswordRecoveryFlow.jsx`, `apps/landing/src/Screen/Auth/EmailConfirmationFlow.jsx`, `apps/landing/src/Screen/Auth/LoginScreen.jsx`, and the 4 test files covering 18 tests) were independently inspected and verified. All interface contracts match the backend `modules/auth` DTOs, the `rh` session storage key and `tipoPerfil` routing fixes align with `apps/rh`, `apps/psicologo`, and `apps/mae`, zero hardcoded credentials or Google Client IDs exist in M1 files, and all automated checks pass cleanly.

---

## 1. Observation

### 1.1 Independent Inspection of M1 Frontend Files & Cross-Repo Contracts
- `package.json` (lines 21–32): Adds `test:all` (`npm run test --workspaces --if-present`), `test:landing`, and Vitest / React Testing Library / jsdom devDependencies (`vitest@^5.1.1`, `@testing-library/react@^16.3.3`, `@testing-library/jest-dom@^8.0.0`, `@testing-library/user-event@^14.6.13`, `jsdom@^31.0.1`).
- `apps/landing/vitest.config.js` (lines 1–21): Configures `jsdom` (`http://localhost:5173/`), `VITE_API_URL: 'http://localhost:8080'`, and `VITE_GOOGLE_CLIENT_ID: ''` so tests do not leak untracked local `.env` values.
- `apps/landing/src/test/setup.js` (lines 1–9): Imports `@testing-library/jest-dom/vitest` and runs `cleanup()`, `localStorage.clear()`, `vi.restoreAllMocks()` in `afterEach`.
- `apps/landing/src/App.jsx` (lines 15–38): Exports named `AppRoutes` and registers `/esqueci-senha` (`EsqueciSenhaScreen`), `/redefinir-senha` (`RedefinirSenhaScreen`), and `/confirmar-email` (`ConfirmarEmailScreen`).
- `apps/landing/src/Screen/Auth/PasswordRecoveryFlow.jsx` (lines 1–480):
  - Two-step recovery flow (`request` -> `reset` -> `success`) usable both as modal (`isModal`) and standalone pages (`EsqueciSenhaScreen`, `RedefinirSenhaScreen` reading `email` & `codigo` search params).
  - Calls `POST ${apiBase}/api/auth/esqueci-senha` with `{ email }` (trimmed + lowercased) and `POST ${apiBase}/api/auth/redefinir-senha` with `{ email, codigo, novaSenha }`, matching `EsqueciSenhaRequestDTO`, `EsqueciSenhaResponseDTO`, `RedefinirSenhaRequestDTO`, `RedefinirSenhaResponseDTO`, and `ErrorResponseDTO` (`message` / `mensagem` / `validationErrors`).
  - Supports resend (`handleResendCode`), password visibility toggle (`aria-label`), digit-only 6-char sanitization on `codigo`, `noValidate` with `role="alert"` error banners, `<label htmlFor>` bindings, and `disabled={loading || resending}`.
- `apps/landing/src/Screen/Auth/EmailConfirmationFlow.jsx` (lines 1–318):
  - Two-step confirmation flow (`verify` -> `welcome`) usable both post-cadastro modal and via `/confirmar-email` (`ConfirmarEmailScreen`).
  - Calls `POST ${apiBase}/api/auth/confirmar-email` (`ConfirmarEmailRequestDTO`) and `POST ${apiBase}/api/auth/reenviar-codigo` (`ReenviarCodigoRequestDTO`).
  - When `pendingAuthCredentials?.senha` is provided (post-cadastro flow), exchanges credentials via `POST ${apiBase}/api/auth/login` after verification to acquire `LoginResponseDTO` (including `tokenSessao` JWT) before entering `apps/mae`.
- `apps/landing/src/Screen/Auth/LoginScreen.jsx`:
  - Line 20: `const GOOGLE_CLIENT_ID_PUBLIC = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';` with runtime fallback fetch to `${API_BASE}/api/auth/oauth/google/config` (lines 131–141).
  - Lines 22–34 & 143–152: `SESSAO_STORAGE_KEYS` maps `mae -> 'floravel_mae_sessao'`, `terapeuta -> 'floravel_psi_sessao'`, `rh -> 'floravel_rh_sessao'` (matching `apps/rh/src/App.jsx:12`, `apps/psicologo/src/App.jsx:23`, `apps/mae/src/App.jsx:614`). `resolverPapelDestino(tipoPerfil, papelFallback)` resolves destination app and storage key from server `tipoPerfil` in both `handleLoginSubmit` (line 267) and Google OAuth callback (line 183).
  - Lines 471–476 & 1055–1110: Post-cadastro `201` opens `<EmailConfirmationFlow isModal ... />` keeping password strictly in React state (never `localStorage`); "Esqueceu a senha?" opens `<PasswordRecoveryFlow isModal ... />`.
- Test suite (`AppRoutes.test.jsx` 3 tests, `EmailConfirmationFlow.test.jsx` 4 tests, `PasswordRecoveryFlow.test.jsx` 6 tests, `LoginScreen.test.jsx` 5 tests): Cleanly tests routes/query-param prefill, loading/disabled states, client-side validation, 400/422/network errors, resend, RH session key & `tipoPerfil` override, recovery modal prefill, and post-cadastro confirmation + JWT exchange. No integrity violations or hardcoded test bypasses detected.

### 1.2 Independent Verification Command Outputs
1. **`npm run test:all`** (Cwd: `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front`):
   - **Exit code**: `0`
   - **Output**:
     - `src/__tests__/AppRoutes.test.jsx (3 tests)` passed
     - `src/Screen/Auth/__tests__/EmailConfirmationFlow.test.jsx (4 tests)` passed
     - `src/Screen/Auth/__tests__/PasswordRecoveryFlow.test.jsx (6 tests)` passed
     - `src/Screen/Auth/__tests__/LoginScreen.test.jsx (5 tests)` passed
     - `Test Files  4 passed (4)`, `Tests  18 passed (18)`, Duration `9.17s`
2. **`npm run build:all`** (Cwd: `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front`):
   - **Exit code**: `0`
   - **Output**:
     - `@floravel/landing` built in `1.88s` (`dist/assets/index-CwkCf9lu.js 566.47 kB`)
     - `@floravel/mae` built in `784ms` (PWA `generateSW` 16 entries)
     - `@floravel/psicologo` built in `1.01s` (PWA `generateSW` 13 entries)
     - `@floravel/rh` built in `1.61s` (`dist/assets/index-Bjhi4QkF.js 806.53 kB`)
3. **Targeted ESLint on M1-touched files** (Cwd: `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\apps\landing`):
   - Command: `npx eslint vitest.config.js eslint.config.js src/test/setup.js src/App.jsx src/Screen/Auth/LoginScreen.jsx src/Screen/Auth/PasswordRecoveryFlow.jsx src/Screen/Auth/EmailConfirmationFlow.jsx src/Screen/Auth/__tests__/PasswordRecoveryFlow.test.jsx src/Screen/Auth/__tests__/EmailConfirmationFlow.test.jsx src/Screen/Auth/__tests__/LoginScreen.test.jsx src/__tests__/AppRoutes.test.jsx`
   - **Exit code**: `0` (0 errors, 0 warnings)
4. **Secrets Scan (`grep_search`)**:
   - Pattern `(AIza|AKIA|sk_live|sk_test|apps\.googleusercontent\.com|FALLBACK_DEV_SECRET|client_secret|clientSecret|floravel_mail_pass)` across `apps/landing/src` and `apps/landing/vitest.config.js`: **No results found**.
5. **Scope Check (`git diff --stat apps/landing package.json`)**:
   - Only `apps/landing/eslint.config.js`, `apps/landing/package.json`, `apps/landing/src/App.jsx`, `apps/landing/src/Screen/Auth/LoginScreen.jsx`, `apps/landing/src/utils/appLinks.js` modified plus new M1 test/flow/config files and root `package.json`/`package-lock.json`.

---

## 2. Logic Chain

1. **Contract & Session Alignment**: Comparing `PasswordRecoveryFlow.jsx` and `EmailConfirmationFlow.jsx` directly against `AuthController.java`, `EsqueciSenhaRequestDTO.java`, `RedefinirSenhaRequestDTO.java`, `ConfirmarEmailRequestDTO.java`, `ReenviarCodigoRequestDTO.java`, and `ErrorResponseDTO.java` confirms exact JSON field alignment and error extraction (`message`, `mensagem`, `validationErrors`). Comparing `SESSAO_STORAGE_KEYS` in `LoginScreen.jsx` against `apps/rh/src/App.jsx:12` confirms `floravel_rh_sessao` resolves the RH session storage mismatch.
2. **Security & Integrity**: Searching `apps/landing/src` and `apps/landing/vitest.config.js` confirms removal of the hardcoded Google Client ID and zero hardcoded credentials. Reading all 4 test files confirms real component rendering and DOM/fetch/storage assertions with no test-cheating patterns.
3. **Build, Test, and Lint Proof**: Independent execution of `npm run test:all` (18/18 passed), `npm run build:all` (4/4 workspaces built), and targeted `eslint` (exit 0) verifies production build integrity and regression coverage.

---

## 3. Findings & Adversarial Challenges (Non-Blocking Minor Observations)

### [Minor] Finding 1 — Modal ARIA Semantics and `Escape` Key Dismissal
- **Where**: `apps/landing/src/Screen/Auth/LoginScreen.jsx:1055-1110`
- **What**: Both modal wrappers (`showForgotModal` and `pendingConfirmation`) render `<div className="fixed inset-0 ...">` without `role="dialog"`, `aria-modal="true"`, or an `Escape` key handler (though the close `<button>` has an `aria-label`).
- **Suggestion**: Add `role="dialog" aria-modal="true"` and an `Escape` keydown listener in a future polish pass.

### [Minor] Finding 2 — Stale `infoMessage` When Toggling Back from Request Step
- **Where**: `apps/landing/src/Screen/Auth/PasswordRecoveryFlow.jsx:344-349`
- **What**: Clicking "Alterar e-mail" clears `error` (`setError('')`) and switches to `'request'`, leaving `infoMessage` populated if the user clicks "Já tenho o código de 6 dígitos" again without submitting.
- **Suggestion**: Also call `setInfoMessage('')` inside the "Alterar e-mail" `onClick` handler.

### [Minor] Finding 3 — Client-Side Max Password Length Not Mirrored
- **Where**: `apps/landing/src/Screen/Auth/PasswordRecoveryFlow.jsx:139,280`
- **What**: Client-side validates `novaSenha.length < 6`, whereas backend `RedefinirSenhaRequestDTO` enforces `@Size(min = 6, max = 100)`. Backend 400 `validationErrors` is still surfaced cleanly via `extrairMensagemErro`.
- **Suggestion**: Optionally add `maxLength={100}` on the password inputs.

### [Minor] Challenge 4 — Auto-Login Failure Fallback Post-Cadastro
- **Where**: `apps/landing/src/Screen/Auth/EmailConfirmationFlow.jsx:77-95,145-159`
- **What**: If `/api/auth/confirmar-email` succeeds (`200`) but the automatic `/api/auth/login` exchange fails (`!loginRes.ok` or network error), `resolvedSession` falls back to `fallbackSessionData` (`maeCriada` from `POST /api/maes`, which has no `tokenSessao` JWT) and navigates to `apps/mae` without a JWT rather than routing to `/login`.
- **Risk**: Low (occurs only if `/api/auth/login` immediately fails right after `/api/auth/confirmar-email` succeeded; pre-R1 behavior also passed `maeCriada`).

---

## 4. Caveats

1. **`npm run lint:all` not asserted**: Per `m1_worker_1/handoff.md` and `PROJECT.md` exclusive write ownership, untouched legacy files in `apps/landing`, `apps/mae`, `apps/psicologo`, and `apps/rh` contain pre-existing ESLint warnings/errors; only all M1-touched files were linted and verified clean (`exit 0`).
2. **Unit/Component Mocked Fetch vs Live Server**: The 18 Vitest tests mock `globalThis.fetch` and `navigateToApp`. Live end-to-end browser-to-backend integration is scoped for Milestone M5 E2E testing.

---

## 5. Conclusion

**Verdict: APPROVE.**  
Frontend M1 (`package.json`, `apps/landing/**`) meets all R1 requirements, interface contracts, security/integrity rules, and production build/test criteria. Ready to proceed to Milestone M2.

---

## 6. Verification Method

1. Run `npm run test:all` in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front` -> expect `4 passed (4)`, `18 passed (18)`, exit code `0`.
2. Run `npm run build:all` in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front` -> expect all 4 workspaces (`@floravel/landing`, `@floravel/mae`, `@floravel/psicologo`, `@floravel/rh`) to build with exit code `0`.
3. Run targeted `npx eslint` on M1-touched files in `apps/landing` -> expect exit code `0`.
4. **Invalidation Conditions**: Any failure in `npm run test:all`, `npm run build:all`, targeted `eslint`, or any discovery of hardcoded credentials/Client IDs in `apps/landing/src/**` invalidates this approval.
