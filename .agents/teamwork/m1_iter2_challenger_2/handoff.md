# Handoff Report — M1 Iteration 2 Adversarial Challenger (`m1_iter2_challenger_2`)

**Handoff Type**: Hard  
**Milestone**: M1, Iteration 2 (Frontend R1 Remediation — `apps/landing/**`)  
**Verdict**: **`APPROVE`**

---

## 1. Observation

### 1.1 Suite, Build, Lint, and Static Checks
1. **`npm run test:all`** (in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front`):
   - Initial run & post-cleanup re-run: **EXIT CODE 0** — `Test Files  4 passed (4)`, `Tests  30 passed (30)`:
     - `src/__tests__/AppRoutes.test.jsx` (3 tests)
     - `src/Screen/Auth/__tests__/EmailConfirmationFlow.test.jsx` (9 tests)
     - `src/Screen/Auth/__tests__/PasswordRecoveryFlow.test.jsx` (9 tests)
     - `src/Screen/Auth/__tests__/LoginScreen.test.jsx` (9 tests)
2. **`npm run build:all`** (in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front`):
   - **EXIT CODE 0** — all 4 workspaces built cleanly (`@floravel/landing` 2.74s, `@floravel/mae` 1.87s, `@floravel/psicologo` 1.10s, `@floravel/rh` 2.41s).
3. **ESLint** (`npx eslint src/Screen/Auth/EmailConfirmationFlow.jsx src/Screen/Auth/PasswordRecoveryFlow.jsx src/Screen/Auth/LoginScreen.jsx src/Screen/Auth/__tests__/EmailConfirmationFlow.test.jsx src/Screen/Auth/__tests__/PasswordRecoveryFlow.test.jsx src/Screen/Auth/__tests__/LoginScreen.test.jsx` in `apps/landing`):
   - **EXIT CODE 0** — 0 errors, 0 warnings.
4. **Static `grep_search` checks**:
   - `fallbackSessionData` in `apps/landing`: **0 matches**.
   - `maeCriada` in `apps/landing`: only `LoginScreen.jsx:511-514` (reads `email`/`nome` for `pendingConfirmation`, never passed as session) and test fixtures in `LoginScreen.test.jsx`.
   - Secrets regex scan `(AIza|AKIA|sk_live|sk_test|apps\.googleusercontent\.com|FALLBACK_DEV_SECRET|client_secret|clientSecret|floravel_mail_pass|GOCSPX)` in `apps/landing/src`: **0 matches**.

### 1.2 Source Inspection of Remediated Code
- `apps/landing/src/Screen/Auth/EmailConfirmationFlow.jsx`:
  - `extrairMensagemErro` (lines 9-20) checks `errJson.validationErrors` non-empty string values before `errJson.message` / `errJson.mensagem`.
  - `inFlightRef = useRef(false)` (line 42) guards `handleConfirmSubmit` (lines 46, 70, 114) and `handleResendCode` (lines 120, 137, 157) after client-side validation and is always released in `finally`.
  - Post-confirmation auto-login (lines 85-107) only sets `resolvedSession` when `loginRes.ok && loginData?.tokenSessao`; otherwise sets `autoLoginFailed = true` and `sessionToUse = null`.
  - Welcome CTA (`hasSession = Boolean(sessionToUse?.tokenSessao)`, line 181) renders `"Ir para o Login"` when no JWT session exists, and `handleEnterApp` (lines 162-178) invokes `onClose?.()`, `onGoToLogin?.(emailLimpo)`, and `navigate('/login?email=...')`.
- `apps/landing/src/Screen/Auth/PasswordRecoveryFlow.jsx`:
  - `extrairMensagemErro` (lines 9-20) prioritizes `errJson.validationErrors`.
  - `inFlightRef = useRef(false)` (line 41) guards `handleRequestSubmit` (lines 45, 62, 86), `handleResendCode` (lines 92, 109, 129), and `handleResetSubmit` (lines 136, 166, 190), released in `finally`.
  - `maxLength={72}` added on `#reset-nova-senha` (line 295) and `#reset-confirmar-senha` (line 324).
  - `setInfoMessage('')` cleared when toggling steps via `"Alterar e-mail"` (line 363) and `"Já tenho o código de 6 dígitos"` (line 425).
- `apps/landing/src/Screen/Auth/LoginScreen.jsx`:
  - `extrairMensagemErro` (lines 76-87) applied to `handleLoginSubmit` (line 306) and `handleCadastroSubmit` (line 521).
  - `loginInFlightRef` and `cadastroInFlightRef` (lines 135-136) guard `handleLoginSubmit` (lines 273, 288, 312) and `handleCadastroSubmit` (lines 441, 482, 525), reset in `finally` and on `pageshow` (`e.persisted`, lines 234-245).
  - `pendingConfirmation` (lines 512-516) stores `{ email, nome, senha }` (no `maeCriada`), `onEnterMaeApp` (lines 1156-1165) rejects any call missing `sessionData?.tokenSessao`, and `onGoToLogin` (lines 1149-1155) closes the modal, sets `email`, and calls `alternarModo('login')`.
  - Both modals (`showForgotModal` at lines 1095-1097 and `pendingConfirmation` at lines 1127-1129) expose `role="dialog" aria-modal="true"` with `aria-label` and `Escape` dismissal (`useEffect` at lines 248-258).

### 1.3 Empirical Adversarial Probes Executed (6/6 Passed)
A temporary Vitest suite (`AdversarialChallengeIter2.test.jsx`) was executed against the remediated components (then deleted and `npm run test:all` re-run):
1. **Legacy `fallbackSessionData` ignored + network error fail-closed** -> **PASS**: Even if a caller passes `fallbackSessionData` without `tokenSessao` and `/api/auth/login` throws `TypeError('Failed to fetch')`, `EmailConfirmationFlow` renders `role="status"` + `"Ir para o Login"`, does not call `onEnterMaeApp` or `navigateToApp`, leaves `floravel_jwt` and `floravel_mae_sessao` `null`, invokes `onClose` and `onGoToLogin`, and navigates to `/login?email=...`.
2. **`/login` -> `alternarModo('cadastro')` (`history.replaceState`) -> post-cadastro auto-login network failure** -> **PASS**: Modal closes cleanly on `"Ir para o Login"`, `LoginScreen` returns to login mode (`Entrar como Sou Mãe`), prefills the confirmed email, and leaks zero `localStorage` session keys.
3. **UTF-8 >72-byte multibyte password (`'é'.repeat(40)` = 40 UTF-16 chars / 80 UTF-8 bytes) in `PasswordRecoveryFlow`** -> **PASS**: `maxLength={72}` allows 40 UTF-16 chars, backend HTTP 400 `validationErrors.novaSenhaDentroDoLimiteBytes` (`"A nova senha deve ter no máximo 72 bytes."`) is surfaced ahead of generic `message`, and `inFlightRef` unlocks cleanly so a subsequent 72-byte (`'é'.repeat(36)`) retry succeeds.
4. **Cross-action `inFlightRef` lock + validation/network non-deadlock in `EmailConfirmationFlow`** -> **PASS**: Validation failure does not lock `inFlightRef`; while `handleConfirmSubmit` is in-flight, clicking `Reenviar código` is also blocked (`fetch` called once); after network rejection, `finally` unlocks `inFlightRef` and retry succeeds.
5. **`Escape` dismissal on `pendingConfirmation` modal + whitespace-only `validationErrors` fallback** -> **PASS**: `Escape` dismisses `pendingConfirmation` cleanly without deadlocking, and `{ message: 'Mensagem genérica do servidor', validationErrors: { campo: '   ' } }` falls back cleanly to `errJson.message`.
6. **`LoginScreen` `validationErrors` priority & network error unlock** -> **PASS**: Both `handleLoginSubmit` and `handleCadastroSubmit` unlock after network failure and surface `validationErrors` field messages over generic `"Falha de validação nos campos informados"`.

---

## 2. Logic Chain

1. All 3 Iteration 1 defects reported by `m1_challenger_2` (tokenless `fallbackSessionData` leakage + stuck `/login` modal, missing synchronous `useRef` double-submit guards, and generic `message` shadowing `validationErrors`) are directly fixed in `EmailConfirmationFlow.jsx`, `PasswordRecoveryFlow.jsx`, and `LoginScreen.jsx` (`Obs 1.2`).
2. Both the permanent regression suite (30 tests across 4 files) and 6 additional adversarial stress probes empirically confirm that tokenless sessions can never reach `localStorage` or `navigateToApp('mae', ...)`, synchronous rapid submits or cross-button submit+resend actions fire at most 1 request and never deadlock across validation/HTTP/network errors, `Escape` and `/login` fallback close modals cleanly, and `validationErrors` takes precedence cleanly (`Obs 1.1`, `Obs 1.3`).
3. Full monorepo build (`npm run build:all`), ESLint, and secrets scan all pass with exit code 0 (`Obs 1.1`).
4. Therefore, Milestone M1 Iteration 2 Frontend R1 Remediation is **`APPROVE`**d.

---

## 3. Caveats

- Temporary probe file `AdversarialChallengeIter2.test.jsx` was removed after execution and `npm run test:all` was re-run (`4` files, `30/30` passed) to ensure no untracked test files were left in the repository.
- On the frontend, `maxLength={72}` on `#reset-nova-senha` / `#reset-confirmar-senha` enforces 72 UTF-16 code units rather than 72 UTF-8 bytes; multibyte passwords between 37–72 characters (e.g., 40 `'é'` chars = 80 bytes) are rejected by the backend (`RedefinirSenhaRequestDTO.isNovaSenhaDentroDoLimiteBytes`) with HTTP 400 and cleanly surfaced via `validationErrors`, which is safe and non-blocking.
- Live browser E2E execution against running Spring Boot + SMTP servers remains covered by the dedicated E2E track.

---

## 4. Conclusion

**Verdict: `APPROVE`**

All `m1_challenger_2` Iteration 1 findings in `apps/landing/**` are empirically verified as resolved. Milestone M1 Frontend R1 Remediation is ready to proceed.

---

## 5. Verification Method

1. Run `npm run test:all` in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front` -> verify exit code `0`, `4 passed (4)` files, `30 passed (30)` tests.
2. Run `npm run build:all` in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front` -> verify exit code `0` across `@floravel/landing`, `@floravel/mae`, `@floravel/psicologo`, and `@floravel/rh`.
3. Run `npx eslint src/Screen/Auth/EmailConfirmationFlow.jsx src/Screen/Auth/PasswordRecoveryFlow.jsx src/Screen/Auth/LoginScreen.jsx src/Screen/Auth/__tests__/EmailConfirmationFlow.test.jsx src/Screen/Auth/__tests__/PasswordRecoveryFlow.test.jsx src/Screen/Auth/__tests__/LoginScreen.test.jsx` in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\apps\landing` -> verify exit code `0`.
4. **Invalidation conditions**: Any failure in the 30 tests or 4 workspace builds, any non-zero ESLint exit, or any regression allowing `maeCriada` / tokenless session data to reach `localStorage` or `navigateToApp`.
