# Handoff Report — M1 Adversarial Challenger (`m1_challenger_2`)

**Handoff Type**: Hard  
**Milestone**: M1 (Frontend R1 — `apps/landing/**` & `package.json`), Iteration 1  
**Verdict**: **`REJECT`**

---

## 1. Observation

### 1.1 Baseline Test & Build Execution
1. **`npm run test:all`** in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front`:
   - Result: **EXIT CODE 0** — `Test Files  4 passed (4)`, `Tests  18 passed (18)` (`AppRoutes.test.jsx`: 3, `EmailConfirmationFlow.test.jsx`: 4, `PasswordRecoveryFlow.test.jsx`: 6, `LoginScreen.test.jsx`: 5).
2. **`npm run build:all`** in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front`:
   - Result: **EXIT CODE 0** — all 4 workspaces built (`@floravel/landing` 1.03s, `@floravel/mae` 946ms, `@floravel/psicologo` 1.44s, `@floravel/rh` 1.74s).
3. **Secrets Scan (`grep_search`)** across `apps/landing` for `(AIza|AKIA|sk_live|sk_test|apps\.googleusercontent\.com|FALLBACK_DEV_SECRET|client_secret|clientSecret|floravel_mail_pass|GOCSPX)`:
   - Result: Only `apps/landing/.env.example:5` (`VITE_GOOGLE_CLIENT_ID=seu_client_id.apps.googleusercontent.com`) matched. Zero hardcoded credentials in `apps/landing/src/**`; `LoginScreen.jsx:20` uses `import.meta.env.VITE_GOOGLE_CLIENT_ID || ''` and `LoginScreen.jsx:131-141` fetches `${API_BASE}/api/auth/oauth/google/config`.

### 1.2 Empirical Adversarial Challenge Execution
Temporary Vitest probes were executed directly against `PasswordRecoveryFlow`, `EmailConfirmationFlow`, `LoginScreen`, and `AppRoutes` (then removed so the repo working tree remained untouched):

1. **Bug 1 (HIGH) — Post-Cadastro Auto-Login Failure Navigates Tokenless to `apps/mae` Instead of Degrading to `/login`**:
   - **Code observed**:
     - `apps/landing/src/Screen/Auth/LoginScreen.jsx:1101`: passes `fallbackSessionData={pendingConfirmation.maeCriada}` (`MaeResponseDTO` from `POST /api/maes`, which has NO `tokenSessao` JWT).
     - `apps/landing/src/Screen/Auth/EmailConfirmationFlow.jsx:77-95`: on `POST /api/auth/login` failure (`401`/`500`/reject), `resolvedSession` falls back to `fallbackSessionData` (`maeCriada`).
     - `apps/landing/src/Screen/Auth/EmailConfirmationFlow.jsx:147-162`: `hasSession = Boolean(sessionToUse || fallbackSessionData)` evaluates `true`, rendering CTA `"Entrar no Espaço Florável"` instead of `"Ir para o Login"`. Clicking it invokes `onEnterMaeApp(maeCriada)`.
   - **Empirical test result**:
     - When `POST /api/maes` returns `201` (`maeCriada` without `tokenSessao`), `POST /api/auth/confirmar-email` returns `200`, and `POST /api/auth/login` returns `401`:
       - Expected CTA `"Ir para o Login"`, actual CTA `"Entrar no Espaço Florável"`.
       - Clicking CTA called `navigateToApp('mae', maeCriada)` with `localStorage.getItem('floravel_jwt') === null` and `localStorage.getItem('floravel_mae_sessao') === JSON.stringify(maeCriada)`.
   - **Secondary flaw in `/login` fallback path**:
     - In `EmailConfirmationFlow.jsx:145-159`, when `sessaoFinal` is null, `handleEnterApp` calls `navigate('/login?email=...')` without calling `onClose?.()`.
     - Empirical test with `isModal`, `initialEntries={['/login']}`, `fallbackSessionData={null}`, and `onClose = vi.fn()`: clicking `"Ir para o Login"` left `expect(onClose).toHaveBeenCalled()` **FAILED** (`0` calls). If a user switched from `/login` to `"Criar Conta"` via `alternarModo('cadastro')` (which uses `window.history.replaceState` at `LoginScreen.jsx:237` without updating React Router's location), the modal remains stuck open on top of `/login`.

2. **Bug 2 (MEDIUM) — Missing Synchronous In-Flight Double-Submit Guard**:
   - **Code observed**:
     - `PasswordRecoveryFlow.jsx:40` (`handleRequestSubmit`), `85` (`handleResendCode`), `124` (`handleResetSubmit`)
     - `EmailConfirmationFlow.jsx:40` (`handleConfirmSubmit`), `106` (`handleResendCode`)
     - `LoginScreen.jsx:242` (`handleLoginSubmit`), `405` (`handleCadastroSubmit`)
     - Buttons use `disabled={loading}` (which takes effect only after React commits state), and none of the handlers check `if (loading || resending) return;` or a synchronous `useRef` lock (`inFlightRef.current`).
   - **Empirical test result**:
     - Two rapid `fireEvent.click(btn)` calls on the `<button type="submit">` fired `fetch` once, **but** two synchronous `fireEvent.submit(form)` calls (e.g., rapid Enter key / form submit before React commits `disabled`) fired `globalThis.fetch` **2 times** on:
       - `PasswordRecoveryFlow` `handleRequestSubmit`: `expected "vi.fn()" to be called 1 times, but got 2 times`
       - `PasswordRecoveryFlow` `handleResetSubmit`: `expected "vi.fn()" to be called 1 times, but got 2 times`
       - `EmailConfirmationFlow` `handleConfirmSubmit`: `expected "vi.fn()" to be called 1 times, but got 2 times`

3. **Bug 3 (LOW-MEDIUM) — `extrairMensagemErro` Hides Specific `validationErrors` Behind Generic `MethodArgumentNotValidException` Message**:
   - **Code observed**:
     - `PasswordRecoveryFlow.jsx:9-18` and `EmailConfirmationFlow.jsx:9-18` check `if (errJson.message) return errJson.message;` before `errJson.validationErrors`.
     - Backend `GlobalExceptionHandler.java:62-79` returns HTTP 400 `ErrorResponseDTO` containing **both** `message: "Falha de validação nos campos informados"` and `validationErrors: { novaSenha: "A nova senha deve ter entre 6 e 100 caracteres" }`.
   - **Empirical test result**:
     - Mocking that exact backend 400 payload produced alert text `"Falha de validação nos campos informados"` instead of `"A nova senha deve ter entre 6 e 100 caracteres"`.

4. **Passing Edge Cases Verified Empirically**:
   - HTTP 400 `ErrorResponseDTO` with `validationErrors` only (no `message`), non-JSON HTTP 500 error body, and network `TypeError('Failed to fetch')` on `/api/auth/esqueci-senha` and `/api/auth/redefinir-senha` all render user-friendly `[role="alert"]` messages without crashing.
   - Direct navigation to `/esqueci-senha`, `/redefinir-senha`, and `/confirmar-email` with dirty query params (`?email=%20ANA@TEST.COM%20&codigo=ab12cd34ef5678`) sanitizes `codigo` to `123456`, trims/lowercases `email` on submit, and navigates cleanly to `/login?email=ana%40test.com` with `#email` prefilled.
   - `LoginScreen.jsx` stores `floravel_rh_sessao` and `floravel_jwt` and calls `navigateToApp('rh', data)` on both RH email/password login and RH Google OAuth callback (`apps/rh/src/App.jsx:12` also reads/writes `floravel_rh_sessao`).

---

## 2. Logic Chain

1. From `LoginScreen.jsx:1101` + `EmailConfirmationFlow.jsx:77-95, 147-162`, passing `maeCriada` (which lacks `tokenSessao`) as `fallbackSessionData` guarantees `hasSession === true` even when auto-login returns `401` or `500`.
2. Empirically executing that exact flow proved `EmailConfirmationFlow` writes a tokenless `floravel_mae_sessao` (`floravel_jwt === null`) and redirects to `apps/mae` instead of degrading gracefully to `/login` as required.
3. Furthermore, even with `fallbackSessionData={null}`, omitting `onClose?.()` before `navigate('/login?email=...')` leaves the modal open whenever `LoginScreen` remains mounted at `/login`.
4. Additionally, lack of a synchronous `useRef` in-flight guard allows duplicate `POST` submissions on rapid `submit` events before React commits `disabled={loading}`, which on `/api/auth/esqueci-senha` would trigger concurrent OTP generation/invalidation.
5. Therefore, despite passing baseline tests (`18/18`) and workspace builds (`4/4`), M1 Frontend must be **`REJECT`**ed until the post-cadastro auto-login failure fallback and double-submit guards are fixed.

---

## 3. Caveats

- Temporary adversarial test file (`AdversarialChallenge.test.jsx`) was deleted after capturing empirical results and `npm run test:all` was re-run (4 files, 18/18 passed) to verify no repo modifications were left behind.
- `LoginScreen.jsx` `handleLoginSubmit` and `handleCadastroSubmit` share the same missing synchronous `useRef` pattern as `PasswordRecoveryFlow` and `EmailConfirmationFlow` (by code inspection; `fireEvent.submit` x2 was executed directly on `PasswordRecoveryFlow` and `EmailConfirmationFlow`).
- Live browser E2E against running Spring Boot + SMTP server was not executed here (JSDOM + mocked `fetch`); that remains covered by the E2E track.

---

## 4. Conclusion

**Verdict: `REJECT`**

Required fixes before re-verification:
1. **Fix post-cadastro auto-login failure fallback (`LoginScreen.jsx` & `EmailConfirmationFlow.jsx`)**:
   - Do **not** fall back to `maeCriada` (which has no `tokenSessao` JWT) when `/api/auth/login` fails (`401`/`500`/network error). Only consider a session valid if `sessionToUse?.tokenSessao` exists (or do not pass tokenless `maeCriada` as `fallbackSessionData`).
   - When auto-login fails, show a clear notice on the welcome step, render `"Ir para o Login"`, and in `handleEnterApp` call `onClose?.()` (and prefill/switch `LoginScreen` to login mode with the confirmed email) alongside `navigate('/login?email=...')` so the modal closes cleanly even when already mounted at `/login`.
2. **Add synchronous in-flight `useRef` double-submit guards**:
   - Guard `handleRequestSubmit`, `handleResendCode`, `handleResetSubmit` (`PasswordRecoveryFlow.jsx`), `handleConfirmSubmit`, `handleResendCode` (`EmailConfirmationFlow.jsx`), and `handleLoginSubmit`, `handleCadastroSubmit` (`LoginScreen.jsx`) with a synchronous `useRef` lock released in `finally` (or on unmount/error).
3. **Prioritize `validationErrors` over generic `MethodArgumentNotValidException` `message`**:
   - In `extrairMensagemErro`, when `errJson.validationErrors` is a non-empty object, surface the specific field validation error(s) before falling back to generic `errJson.message`.

---

## 5. Verification Method

1. **Baseline suite & build**:
   - Run `npm run test:all` in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front` -> expect 4 files, 18+ tests passing.
   - Run `npm run build:all` in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front` -> expect exit code 0 across all 4 workspaces.
2. **Regression tests to verify fixes**:
   - Add permanent tests in `LoginScreen.test.jsx` / `EmailConfirmationFlow.test.jsx` / `PasswordRecoveryFlow.test.jsx` asserting:
     1. Post-cadastro `confirmar-email` (`200`) + `/api/auth/login` (`401` and `500`) does **not** call `navigateToApp`, leaves `localStorage.getItem('floravel_jwt')` and `localStorage.getItem('floravel_mae_sessao')` `null`, closes the modal (`onClose`), and routes to `/login?email=...`.
     2. Two synchronous `fireEvent.submit(form)` calls before re-render result in `expect(fetch).toHaveBeenCalledTimes(1)`.
     3. HTTP 400 `{ message: 'Falha de validação nos campos informados', validationErrors: { novaSenha: '...' } }` renders the `validationErrors` message.
3. **Invalidation conditions**: Any case where tokenless `maeCriada` is stored as a session or navigated to `apps/mae` upon `/api/auth/login` failure invalidates approval.
