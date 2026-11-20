# Handoff Report — M1 Iteration 2 Remediation Plan (`m1_iter2_explorer_2`)

**Handoff Type**: Hard  
**Milestone**: M1, Iteration 2 (Frontend R1 Remediation Planning)  
**Target Files**:
- `apps/landing/src/Screen/Auth/EmailConfirmationFlow.jsx`
- `apps/landing/src/Screen/Auth/PasswordRecoveryFlow.jsx`
- `apps/landing/src/Screen/Auth/LoginScreen.jsx`
- `apps/landing/src/Screen/Auth/__tests__/EmailConfirmationFlow.test.jsx`
- `apps/landing/src/Screen/Auth/__tests__/PasswordRecoveryFlow.test.jsx`
- `apps/landing/src/Screen/Auth/__tests__/LoginScreen.test.jsx`

> **Core Summary**: All 3 `m1_challenger_2` blocking findings and all 3 `m1_reviewer_2` non-blocking polish items have exact, localized fixes in `EmailConfirmationFlow.jsx`, `PasswordRecoveryFlow.jsx`, and `LoginScreen.jsx` without breaking any of the 18 existing tests or backend DTO contracts. In addition to removing `fallbackSessionData` (`maeCriada`) and checking `sessionToUse?.tokenSessao`, `EmailConfirmationFlow` needs `onClose?.()` plus a `LoginScreen` `onGoToLogin` callback alongside `navigate('/login?email=...')` because `alternarModo('cadastro')` uses `history.replaceState` while keeping `LoginScreen` mounted at `/login`.

---

## 1. Observation

### 1.1 Post-Cadastro Auto-Login Fallback & Modal Dismissal (`EmailConfirmationFlow.jsx`, `LoginScreen.jsx`)
- `apps/landing/src/Screen/Auth/LoginScreen.jsx:471-476` sets `pendingConfirmation` with `maeCriada` (response from `POST /api/maes`, which has no `tokenSessao` JWT), and `LoginScreen.jsx:1101` passes `fallbackSessionData={pendingConfirmation.maeCriada}` to `<EmailConfirmationFlow>`.
- `apps/landing/src/Screen/Auth/EmailConfirmationFlow.jsx:77-95`: on `POST /api/auth/login` failure (`!loginRes.ok` or catch), `resolvedSession` retains `fallbackSessionData` (`maeCriada`) and stores it in `sessionToUse`.
- `apps/landing/src/Screen/Auth/EmailConfirmationFlow.jsx:147-159` and `162, 184`: `sessaoFinal` and `hasSession` evaluate truthy whenever `sessionToUse || fallbackSessionData` is truthy (regardless of `tokenSessao`), rendering `"Entrar no Espaço Florável"` and calling `onEnterMaeApp(sessaoFinal)` -> `salvarSessaoLocal(sessionData, 'mae')` + `navigateToApp('mae', sessionData)` with `floravel_jwt === null`.
- `apps/landing/src/Screen/Auth/EmailConfirmationFlow.jsx:158`: when `sessaoFinal` is null, `handleEnterApp` calls `navigate('/login?email=...')` without calling `onClose?.()`.
- `apps/landing/src/Screen/Auth/LoginScreen.jsx:78-83, 231-239`: `alternarModo('cadastro')` switches `modo` to `'cadastro'` and calls `window.history.replaceState(null, '', '/cadastro')` without changing React Router's route when mounted at `/login`; conversely, `<CadastroScreen />` renders `<LoginScreen initialMode="cadastro" />`. In both standalone `<LoginScreen initialMode="cadastro" />` tests and in-place `alternarModo('cadastro')` flows, `navigate('/login?email=...')` alone does not switch `modo` back to `'login'` or populate `LoginScreen`'s `email` state (`useState(() => searchParams.get('email') || '')` at line 91).

### 1.2 Missing Synchronous In-Flight Double-Submit Guards
- `apps/landing/src/Screen/Auth/PasswordRecoveryFlow.jsx:1, 40-83, 85-122, 124-179`: no `useRef` imported or used; `handleRequestSubmit`, `handleResendCode`, and `handleResetSubmit` rely solely on React state `disabled={loading}` / `disabled={loading || resending}` (lines 327, 336, 397), which only disables DOM controls after commit.
- `apps/landing/src/Screen/Auth/EmailConfirmationFlow.jsx:1, 40-104, 106-143`: no `useRef` imported or used; `handleConfirmSubmit` and `handleResendCode` rely solely on `disabled={loading || resending}` (lines 257, 266).
- `apps/landing/src/Screen/Auth/LoginScreen.jsx:1, 219-229, 242-280, 405-491`: `useRef` is imported (used for `googleBtnRef`), but `handleLoginSubmit` and `handleCadastroSubmit` have no `useRef` in-flight guard. Note also `handleCadastroSubmit` uses `.then().catch()` without `async/await` or `finally`, and `pageshow` (line 219-229) resets `carregandoLogin` / `carregandoCadastro` on `e.persisted`.

### 1.3 `extrairMensagemErro` Priority Bug (`PasswordRecoveryFlow.jsx`, `EmailConfirmationFlow.jsx`)
- `apps/landing/src/Screen/Auth/PasswordRecoveryFlow.jsx:9-18` and `EmailConfirmationFlow.jsx:9-18` evaluate `if (errJson.message) return errJson.message;` and `if (errJson.mensagem) return errJson.mensagem;` **before** inspecting `errJson.validationErrors`.
- Backend `floravel-backend/Floravel/src/main/java/br/com/floravel/floravel/shared/exception/GlobalExceptionHandler.java:62-79` builds `MethodArgumentNotValidException` 400 responses with **both** `message: "Falha de validação nos campos informados"` and `validationErrors: { <field>: "<specific message>" }`.
- `LoginScreen.jsx:274` and `480` only read `errJson.message || ...` without checking `validationErrors`.

### 1.4 Non-Blocking Polish Items (`m1_reviewer_2`) + BCrypt 72-Byte Cap
- `apps/landing/src/Screen/Auth/PasswordRecoveryFlow.jsx:276-288, 304-316`: `#reset-nova-senha` and `#reset-confirmar-senha` have `minLength={6}` but no `maxLength`. Backend `RedefinirSenhaRequestDTO.java:24` has `@Size(min = 6, max = 100)`, and Spring `BCryptPasswordEncoder` truncates/rejects inputs beyond 72 bytes; Objective 4 specifies `maxLength={72}` on password inputs in `PasswordRecoveryFlow.jsx`.
- `apps/landing/src/Screen/Auth/PasswordRecoveryFlow.jsx:344-348, 405-409`: `"Alterar e-mail"` calls `setError(''); setStep('request');` without clearing `infoMessage`. Similarly `"Já tenho o código de 6 dígitos"` does not clear `infoMessage`.
- `apps/landing/src/Screen/Auth/LoginScreen.jsx:1055-1079, 1082-1110`: modal wrappers render without `role="dialog"`, `aria-modal="true"`, or an `Escape` key handler.
- `apps/landing/eslint.config.js:12`: `js.configs.recommended` enforces `no-unused-vars` and `reactHooks.configs.flat.recommended` enforces hook rules; `apps/landing/src/test/setup.js:5-9` runs `cleanup()`, `localStorage.clear()`, `vi.restoreAllMocks()` after every test.

---

## 2. Logic Chain

1. Because `POST /api/maes` returns `MaeResponseDTO` without `tokenSessao`, passing `maeCriada` as `fallbackSessionData` (and gating `hasSession` on `sessionToUse || fallbackSessionData`) allowed unauthenticated navigation to `apps/mae` when `/api/auth/login` failed. Removing `fallbackSessionData` and requiring `Boolean(sessionToUse?.tokenSessao)` guarantees tokenless sessions are never stored or navigated with.
2. When `pendingAuthCredentials?.senha` is present and `/api/auth/login` fails (or omits `tokenSessao`), setting `autoLoginFailed = true` lets the welcome step render an explicit login-required notice alongside `"Ir para o Login"`.
3. Because `LoginScreen` can reach confirmation either from `/cadastro` or in-place from `/login` via `alternarModo('cadastro')`, `handleEnterApp` in `EmailConfirmationFlow` must call `onClose?.()`, `onGoToLogin?.(emailLimpo)` (which closes the modal, sets `email`, and calls `alternarModo('login')` in `LoginScreen`), AND `navigate('/login?email=...')`.
4. Because React `disabled={loading}` takes effect asynchronously after render, rapid synchronous `submit` events or double clicks before commit hit handlers before state updates. Calling `e.preventDefault()` first, validating client-side inputs before locking, acquiring a `useRef` boolean lock (`inFlightRef.current = true`), and releasing it in `finally` blocks duplicate `fetch` calls synchronously without ever leaving the form deadlocked on validation error or HTTP failure.
5. Reordering `extrairMensagemErro` to pick the first non-empty string value in `errJson.validationErrors` before `errJson.message`/`errJson.mensagem` ensures Spring's `MethodArgumentNotValidException` field errors surface instead of the generic `"Falha de validação nos campos informados"`.

---

## 3. Caveats

- Read-only investigation: no source or test files were modified during this analysis.
- Converting `handleCadastroSubmit` in `LoginScreen.jsx` from `.then().catch()` to `async/await` with `try/catch/finally` preserves identical behavior while ensuring `cadastroInFlightRef.current` is always released; `LoginScreen.jsx:160-190` (Google OAuth `callback`) does not use a form submit handler and already guards with `if (!response?.credential) return;` — left untouched unless desired.
- If `EmailConfirmationFlow` uses `autoLoginFailed` state, note that `handleConfirmSubmit` resets `autoLoginFailed` to `false` at start if ever re-entered.
- In `EmailConfirmationFlow.jsx`, `fallbackSessionData` should be removed from destructured props (not just ignored) so ESLint `no-unused-vars` stays exit 0.

---

## 4. Conclusion — Exact Remediation Strategy

### Change 1: `apps/landing/src/Screen/Auth/EmailConfirmationFlow.jsx`

1. **Imports (line 1)**:
   - Replace `import { useState } from 'react';` with `import { useRef, useState } from 'react';`.
2. **`extrairMensagemErro` (lines 9-18)** — prioritize non-empty `validationErrors`:
   ```js
   function extrairMensagemErro(errJson, fallback) {
     if (!errJson || typeof errJson !== 'object') return fallback;
     if (errJson.validationErrors && typeof errJson.validationErrors === 'object') {
       const primeira = Object.values(errJson.validationErrors).find(
         (msg) => typeof msg === 'string' && msg.trim().length > 0
       );
       if (primeira) return primeira;
     }
     if (errJson.message) return errJson.message;
     if (errJson.mensagem) return errJson.mensagem;
     return fallback;
   }
   ```
3. **Props & State/Ref (lines 20-39)**:
   - Remove `fallbackSessionData = null,` prop; add `onGoToLogin,` prop.
   - Add `const [autoLoginFailed, setAutoLoginFailed] = useState(false);`.
   - Add `const inFlightRef = useRef(false);`.
4. **`handleConfirmSubmit` (lines 40-104)**:
   - Call `e.preventDefault();` first, then `if (inFlightRef.current) return;`.
   - Clear `setError('')`, `setInfoMessage('')`, `setAutoLoginFailed(false)`.
   - Perform existing `EMAIL_REGEX`, `/^\d{6}$/`, and `apiBase` validation checks *before* locking.
   - Set `inFlightRef.current = true; setLoading(true);` and wrap the async body in `try { ... } catch { ... } finally { inFlightRef.current = false; setLoading(false); }`.
   - Inside auto-login block (lines 77-95), **remove `fallbackSessionData`**:
     ```js
     if (pendingAuthCredentials?.senha) {
       let resolvedSession = null;
       try {
         const loginRes = await fetch(`${apiBase}/api/auth/login`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
             email: emailLimpo,
             senha: pendingAuthCredentials.senha,
           }),
         });
         if (loginRes.ok) {
           const loginData = await loginRes.json().catch(() => null);
           if (loginData?.tokenSessao) {
             resolvedSession = loginData;
           }
         }
       } catch {
         // Sem sessão automática; degrada com segurança para login explícito
       }
       setSessionToUse(resolvedSession);
       setAutoLoginFailed(!resolvedSession);
     }
     ```
5. **`handleResendCode` (lines 106-143)**:
   - Add `if (inFlightRef.current) return;` at start.
   - Validate `emailLimpo` and `apiBase` *before* setting `inFlightRef.current = true; setResending(true);`.
   - Release `inFlightRef.current = false; setResending(false);` in `finally`.
6. **`handleEnterApp` (lines 145-159)** and **Welcome UI (lines 161-188)**:
   - Define `const validSession = sessionToUse?.tokenSessao ? sessionToUse : null;`.
   - In `handleEnterApp`:
     ```js
     const handleEnterApp = () => {
       const emailLimpo = email.trim().toLowerCase();
       const sessaoFinal = sessionToUse?.tokenSessao ? sessionToUse : null;

       if (sessaoFinal) {
         if (onEnterMaeApp) {
           onEnterMaeApp(sessaoFinal);
           return;
         }
         navigateToApp('mae', sessaoFinal);
         return;
       }

       onClose?.();
       onGoToLogin?.(emailLimpo);
       navigate(`/login${emailLimpo ? `?email=${encodeURIComponent(emailLimpo)}` : ''}`);
     };
     ```
   - In `step === 'welcome'` (lines 161-188):
     - Replace `const hasSession = Boolean(sessionToUse || fallbackSessionData);` with `const hasSession = Boolean(sessionToUse?.tokenSessao);`.
     - Render login-required notice when `autoLoginFailed && !hasSession`:
       ```jsx
       {autoLoginFailed && !hasSession && (
         <div
           role="status"
           className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 leading-relaxed"
         >
           Seu e-mail foi confirmado, mas não foi possível iniciar sua sessão automaticamente. Faça login com seu e-mail e senha para entrar no Espaço Florável.
         </div>
       )}
       ```

---

### Change 2: `apps/landing/src/Screen/Auth/PasswordRecoveryFlow.jsx`

1. **Imports (line 1)**:
   - Replace `import { useState } from 'react';` with `import { useRef, useState } from 'react';`.
2. **`extrairMensagemErro` (lines 9-18)**:
   - Same prioritized `validationErrors` logic as `EmailConfirmationFlow.jsx`:
     ```js
     function extrairMensagemErro(errJson, fallback) {
       if (!errJson || typeof errJson !== 'object') return fallback;
       if (errJson.validationErrors && typeof errJson.validationErrors === 'object') {
         const primeira = Object.values(errJson.validationErrors).find(
           (msg) => typeof msg === 'string' && msg.trim().length > 0
         );
         if (primeira) return primeira;
       }
       if (errJson.message) return errJson.message;
       if (errJson.mensagem) return errJson.mensagem;
       return fallback;
     }
     ```
3. **In-flight ref (near line 39)**:
   - Add `const inFlightRef = useRef(false);`.
4. **`handleRequestSubmit` (lines 40-83)**:
   - `e.preventDefault();` then `if (inFlightRef.current) return;`.
   - Validate `emailLimpo` and `apiBase` *before* setting `inFlightRef.current = true; setLoading(true);`.
   - Remove redundant `setLoading(false);` inside `if (!res.ok)` (already handled in `finally`).
   - In `finally`: `inFlightRef.current = false; setLoading(false);`.
5. **`handleResendCode` (lines 85-122)**:
   - `if (inFlightRef.current) return;` at start.
   - Validate `emailLimpo` and `apiBase` *before* setting `inFlightRef.current = true; setResending(true);`.
   - In `finally`: `inFlightRef.current = false; setResending(false);`.
6. **`handleResetSubmit` (lines 124-179)**:
   - `e.preventDefault();` then `if (inFlightRef.current) return;`.
   - Validate `emailLimpo`, `codigoLimpo`, `novaSenha.length < 6`, `novaSenha !== confirmarSenha`, `apiBase` *before* setting `inFlightRef.current = true; setLoading(true);`.
   - In `finally`: `inFlightRef.current = false; setLoading(false);`.
7. **Password `maxLength={72}` (lines 280 & 308)**:
   - Add `maxLength={72}` to `#reset-nova-senha` (line 280) and `#reset-confirmar-senha` (line 308).
8. **Clear `infoMessage` on step toggle (lines 345-348 & 406-409)**:
   - In `"Alterar e-mail"` `onClick`: add `setInfoMessage('');` before `setStep('request');`.
   - In `"Já tenho o código de 6 dígitos"` `onClick`: add `setInfoMessage('');` before `setStep('reset');`.

---

### Change 3: `apps/landing/src/Screen/Auth/LoginScreen.jsx`

1. **`extrairMensagemErro` helper (recommended for consistency near line 75)**:
   - Add the same `extrairMensagemErro(errJson, fallback)` helper and use it in `handleLoginSubmit` (line 274) and `handleCadastroSubmit` (line 480).
2. **In-flight refs & `pageshow` reset (near line 121 & lines 219-229)**:
   - Add `const loginInFlightRef = useRef(false);` and `const cadastroInFlightRef = useRef(false);`.
   - Inside `handlePageShow` (`if (e.persisted)` at lines 220-225), also reset `loginInFlightRef.current = false; cadastroInFlightRef.current = false;`.
3. **`handleLoginSubmit` (lines 242-280)**:
   - `e.preventDefault();` then `if (loginInFlightRef.current) return;`.
   - Validate `!emailLimpo || !senha` and `!API_BASE` *before* locking.
   - Set `loginInFlightRef.current = true; setCarregandoLogin(true);`.
   - Wrap in `try { ... } catch { ... } finally { loginInFlightRef.current = false; }`, keeping `setCarregandoLogin(false)` on non-OK response and in `catch` (so successful redirect doesn't flash re-enabled state before navigation, while `loginInFlightRef.current` is always released).
4. **`handleCadastroSubmit` (lines 405-491)**:
   - Convert to `async (e) =>`:
     - `e.preventDefault();` then `if (cadastroInFlightRef.current) return;`.
     - Run all validation checks (`bloqueadoEspacoSeguro`, age checks, `isMenorIdade`, `!API_BASE`, `papel !== 'mae'`) *before* locking.
     - Set `cadastroInFlightRef.current = true; setCarregandoCadastro(true);`.
     - Wrap `fetch(`${API_BASE}/api/maes`, ...)` in `try { ... } catch { ... } finally { cadastroInFlightRef.current = false; setCarregandoCadastro(false); }`.
     - Inside `setPendingConfirmation({ ... })` (lines 471-476), remove `maeCriada` property (only `{ email, nome, senha }`).
5. **Modal ARIA semantics + `Escape` dismissal (lines 1055-1110 & `useEffect`)**:
   - Add `role="dialog" aria-modal="true" aria-label="Recuperação de senha"` on the `showForgotModal` inner modal panel `<div>` (line 1057).
   - Add `role="dialog" aria-modal="true" aria-label="Confirmação de e-mail"` on the `pendingConfirmation` inner modal panel `<div>` (line 1084).
   - Optional polish (`m1_reviewer_2` Finding 1): add `useEffect` listening for `Escape` keydown when `showForgotModal || pendingConfirmation` is active to close the open modal.
6. **`<EmailConfirmationFlow />` props (lines 1093-1107)**:
   - **Remove** `fallbackSessionData={pendingConfirmation.maeCriada}` (line 1101).
   - Add `onGoToLogin`:
     ```jsx
     onGoToLogin={(confirmedEmail) => {
       setPendingConfirmation(null);
       if (confirmedEmail) {
         setEmail(confirmedEmail);
       }
       alternarModo('login');
     }}
     ```
   - Defense-in-depth inside `onEnterMaeApp`:
     ```jsx
     onEnterMaeApp={(sessionData) => {
       if (!sessionData?.tokenSessao) {
         setPendingConfirmation(null);
         if (sessionData?.email) setEmail(sessionData.email);
         alternarModo('login');
         return;
       }
       salvarSessaoLocal(sessionData, 'mae');
       navigateToApp('mae', sessionData);
     }}
     ```

---

### Change 4: Permanent Vitest Regression Tests Specification

All tests import `fireEvent` alongside `render, screen, waitFor` from `@testing-library/react`, and use `MemoryRouter` (with `useLocation` probe component where URL assertions are needed).

1. **`apps/landing/src/Screen/Auth/__tests__/EmailConfirmationFlow.test.jsx`**:
   - **Bug 1a (`401` post-cadastro auto-login failure)**:
     - Render `EmailConfirmationFlow` inside `<MemoryRouter initialEntries={['/login']}>` with a `LocationProbe` (`data-testid="location-probe"` rendering `location.pathname + location.search`), `isModal`, `initialEmail="helena@floravel.com"`, `pendingAuthCredentials={{ email: 'helena@floravel.com', senha: 'senhaSegura123' }}`, `onClose={vi.fn()}`, `onGoToLogin={vi.fn()}`, `onEnterMaeApp={vi.fn()}`.
     - Mock `fetch` (`confirmar-email` -> `200`, `login` -> `401`).
     - Confirm email -> assert welcome screen shows login-required notice (`role="status"`), button is `"Ir para o Login"`, `"Entrar no Espaço Florável"` is absent.
     - Click `"Ir para o Login"` -> assert `onEnterMaeApp` and `navigateToApp` NOT called, `localStorage.getItem('floravel_jwt')` and `localStorage.getItem('floravel_mae_sessao')` are `null`, `onClose` called 1 time, `onGoToLogin` called with `'helena@floravel.com'`, and `location-probe` equals `'/login?email=helena%40floravel.com'`.
   - **Bug 1b (`500` or tokenless `200` auto-login response)**:
     - Verify `login` returning `500` (and/or `200` without `tokenSessao`) also degrades to `"Ir para o Login"`, sets `localStorage` keys to `null`, and never invokes `navigateToApp` / `onEnterMaeApp`.
   - **Bug 2 (double-submit & double-resend guard)**:
     - Fill valid 6-digit code, mock deferred `Promise` on `fetch`, invoke `fireEvent.submit(form)` twice synchronously -> `expect(globalThis.fetch).toHaveBeenCalledTimes(1)`. Resolve & wait for completion.
     - On a fresh render with deferred `fetch`, click `Reenviar código` twice synchronously (`fireEvent.click(resendBtn); fireEvent.click(resendBtn);`) -> `expect(globalThis.fetch).toHaveBeenCalledTimes(1)`.
   - **Bug 3 (`validationErrors` priority)**:
     - Mock HTTP 400 `{ status: 400, message: 'Falha de validação nos campos informados', validationErrors: { codigo: 'O código deve conter exatamente 6 dígitos numéricos.' } }`.
     - Submit -> `expect(await screen.findByRole('alert')).toHaveTextContent('O código deve conter exatamente 6 dígitos numéricos.')`.

2. **`apps/landing/src/Screen/Auth/__tests__/PasswordRecoveryFlow.test.jsx`**:
   - **Bug 2 (request submit, reset submit, and resend guards)**:
     - Step `request`: type valid email, mock deferred `fetch`, `fireEvent.submit(form)` x2 synchronously -> `expect(globalThis.fetch).toHaveBeenCalledTimes(1)`.
     - Step `reset`: fill code & matching passwords, mock deferred `fetch`, `fireEvent.submit(form)` x2 synchronously -> `expect(globalThis.fetch).toHaveBeenCalledTimes(1)`.
     - Step `reset` resend: mock deferred `fetch`, `fireEvent.click(resendBtn)` x2 synchronously -> `expect(globalThis.fetch).toHaveBeenCalledTimes(1)`.
   - **Bug 3 (`validationErrors` priority)**:
     - Step `reset`: mock HTTP 400 `{ status: 400, message: 'Falha de validação nos campos informados', validationErrors: { novaSenha: 'A nova senha deve ter entre 6 e 100 caracteres' } }`.
     - Submit -> `expect(await screen.findByRole('alert')).toHaveTextContent('A nova senha deve ter entre 6 e 100 caracteres')`.
   - **Polish (`maxLength={72}` & stale `infoMessage` cleared)**:
     - Assert `#reset-nova-senha` and `#reset-confirmar-senha` have attribute `maxLength="72"`.
     - Submit `request` step (`infoMessage` rendered on `reset`), click `"Alterar e-mail"`, click `"Já tenho o código de 6 dígitos"` -> assert previous `infoMessage` is no longer in the document.

3. **`apps/landing/src/Screen/Auth/__tests__/LoginScreen.test.jsx`**:
   - **Bug 1 (full `LoginScreen` post-cadastro auto-login `401` and `500` degradation)**:
     - Render `<LoginScreen initialMode="cadastro" />` inside `<MemoryRouter initialEntries={['/cadastro']}>`.
     - Mock `/api/maes` -> `201` (`maeCriada` without `tokenSessao`), `/api/auth/confirmar-email` -> `200`, `/api/auth/login` -> `401` (and test `500` variant).
     - Submit cadastro -> assert `screen.getByRole('dialog')` opens (`aria-modal="true"`).
     - Confirm code -> assert `"Ir para o Login"` + login-required notice rendered, click `"Ir para o Login"`.
     - Assert modal closed (`queryByRole('dialog') === null`), login submit button (`Entrar como Sou Mãe`) visible, `#email` prefilled with `'helena@floravel.com'`, `navigateToApp` not called, `localStorage.getItem('floravel_jwt') === null`, `localStorage.getItem('floravel_mae_sessao') === null`.
   - **Bug 2 (`handleLoginSubmit` & `handleCadastroSubmit` double-submit guards)**:
     - Login mode: fill email & password, mock deferred `fetch` for `/api/auth/login`, `fireEvent.submit(form)` x2 synchronously -> count `/api/auth/login` calls === 1.
     - Cadastro mode: fill nome, email, senha, mock deferred `fetch` for `/api/maes`, `fireEvent.submit(form)` x2 synchronously -> count `/api/maes` calls === 1.
   - **Polish (Modal dialog ARIA)**:
     - Click `"Esqueceu a senha?"` -> assert `screen.getByRole('dialog')` has `aria-modal="true"`.

---

## 5. Verification Method

After the implementer applies Changes 1–4:
1. **Run all workspace Vitest suites** from `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front`:
   - `npm run test:all` -> expect exit code 0, all 4 test files and all 28+ tests passing (18 existing + ~10+ new regression tests).
2. **Run production build across all workspaces** from `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front`:
   - `npm run build:all` -> expect exit code 0 across `@floravel/landing`, `@floravel/mae`, `@floravel/psicologo`, `@floravel/rh`.
3. **Run targeted ESLint** from `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\apps\landing`:
   - `npx eslint src/Screen/Auth/EmailConfirmationFlow.jsx src/Screen/Auth/PasswordRecoveryFlow.jsx src/Screen/Auth/LoginScreen.jsx src/Screen/Auth/__tests__/EmailConfirmationFlow.test.jsx src/Screen/Auth/__tests__/PasswordRecoveryFlow.test.jsx src/Screen/Auth/__tests__/LoginScreen.test.jsx` -> expect exit code 0 (0 errors, 0 warnings).
4. **Invalidation conditions**:
   - Any occurrence of `fallbackSessionData` or tokenless `maeCriada` passed to `salvarSessaoLocal` / `navigateToApp`.
   - Any handler returning early after setting `inFlightRef.current = true` without resetting it in `finally`.
   - `fireEvent.submit(form)` x2 invoking `fetch` more than once on any of the 5 forms or 2 resend actions.
