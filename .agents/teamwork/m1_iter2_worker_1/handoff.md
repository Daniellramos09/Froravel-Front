# Handoff Report — M1 Iteration 2 Remediation (`m1_iter2_worker_1`)

**Handoff Type**: Hard  
**Milestone**: M1, Iteration 2 (`modules/auth/**` + `apps/landing/**` Remediation)

---

## 1. Observation

### 1.1 Backend Changes (`floravel-backend/Floravel`)
- `src/main/java/br/com/floravel/floravel/modules/auth/dto/RedefinirSenhaRequestDTO.java:3-34`:
  - Updated `novaSenha` annotation from `@Size(min = 6, max = 100, ...)` to `@Size(min = 6, max = 72, message = "A nova senha deve conter entre 6 e 72 caracteres.")`.
  - Added `@JsonIgnore @AssertTrue(message = "A nova senha deve ter no máximo 72 bytes.") public boolean isNovaSenhaDentroDoLimiteBytes()` checking `novaSenha == null || novaSenha.getBytes(StandardCharsets.UTF_8).length <= 72`.
- `src/main/java/br/com/floravel/floravel/modules/auth/service/EmailService.java:29,62,164,215`:
  - Guarded `codigo` against `null` in `enviarCodigoConfirmacao` subject (`codigo != null ? codigo : ""`), `gerarTemplateEmailHtml` (`codigo != null ? HtmlUtils.htmlEscape(codigo) : ""`), and `gerarTemplateRecuperacaoSenhaHtml` (`codigo != null ? HtmlUtils.htmlEscape(codigo) : ""`).
  - Short-circuited `enviarEmailHtml` with `if (mailSender == null || destinatario == null || destinatario.isBlank())` to trigger `devFallback.run()` without constructing a `MimeMessage`.
- `src/main/java/br/com/floravel/floravel/modules/auth/service/AuthService.java:36,215-217`:
  - Added `java.nio.charset.StandardCharsets` import and updated `autenticar` check to `dto.getSenha() != null && dto.getSenha().getBytes(StandardCharsets.UTF_8).length <= 72 && passwordEncoder.matches(dto.getSenha(), usuario.getSenha())`.
- `src/test/java/br/com/floravel/floravel/modules/auth/controller/AuthControllerTest.java:630-769`:
  - Added 4 tests via `MockMvcBuilders.webAppContextSetup(webApplicationContext).build()`:
    1. `deveRedefinirSenhaComSucessoNoLimiteExatoDe72Bytes` (`"P".repeat(72)` -> reset `200`, login `200` with `tokenSessao`)
    2. `deveRetornar400QuandoNovaSenhaExceder72CaracteresAscii` (`"P".repeat(73)`, `"P".repeat(80)` -> `400 Dados Inválidos` with `validationErrors.novaSenha`, token stays `usado == false`)
    3. `deveRetornar400QuandoNovaSenhaExceder72BytesEmUtf8Multibyte` (`"é".repeat(40)` = 40 chars / 80 UTF-8 bytes -> `400 Dados Inválidos` with `validationErrors.novaSenhaDentroDoLimiteBytes`, token stays `usado == false`)
    4. `deveRejeitarLoginCom422QuandoSenhaExceder72BytesMesmoComPrefixoValido` (`"P".repeat(72) + "extra"`, `"P".repeat(80)` against 72-byte stored hash -> `422 Unprocessable Entity`)
- `src/test/java/br/com/floravel/floravel/modules/auth/service/EmailServiceTest.java:74-99`:
  - Added `deveTratarCamposNulosSemLancarExcecao` covering null/blank `destinatario`, `nome`, and `codigo` with both `mailSender == null` and mocked `JavaMailSender` (`verify(mailSender, never()).send(...)`).

### 1.2 Frontend Changes (`Froravel-Front/apps/landing`)
- `apps/landing/src/Screen/Auth/EmailConfirmationFlow.jsx`:
  - Removed `fallbackSessionData` prop and all fallback references (`grep_search` across `apps/landing` confirmed 0 remaining matches).
  - Updated `extrairMensagemErro` (lines 9-19) to inspect non-empty `errJson.validationErrors` values before `errJson.message` / `errJson.mensagem`.
  - Added `inFlightRef = useRef(false)` released in `finally` on both `handleConfirmSubmit` and `handleResendCode`, validating inputs prior to locking.
  - Added `autoLoginFailed` state and required `Boolean(sessionToUse?.tokenSessao)` for valid session (`hasSession` and `sessaoFinal`). When `POST /api/auth/login` fails or omits `tokenSessao`, sets `autoLoginFailed=true`, displays a `role="status"` login-required notice, and renders `"Ir para o Login"`.
  - Updated `handleEnterApp` to call `onClose?.()`, `onGoToLogin?.(emailLimpo)`, and `navigate('/login?email=...')` when `sessaoFinal` is absent.
- `apps/landing/src/Screen/Auth/PasswordRecoveryFlow.jsx`:
  - Updated `extrairMensagemErro` to prioritize non-empty `errJson.validationErrors` values.
  - Added `inFlightRef = useRef(false)` released in `finally` on `handleRequestSubmit`, `handleResendCode`, and `handleResetSubmit`, validating inputs prior to locking.
  - Added `maxLength={72}` to `#reset-nova-senha` and `#reset-confirmar-senha`.
  - Cleared `infoMessage` (`setInfoMessage('')`) when toggling via `"Alterar e-mail"` and `"Já tenho o código de 6 dígitos"`.
- `apps/landing/src/Screen/Auth/LoginScreen.jsx`:
  - Added `extrairMensagemErro` helper and applied it to `handleLoginSubmit` and `handleCadastroSubmit`.
  - Added `loginInFlightRef` and `cadastroInFlightRef` (reset in `finally` and in `pageshow` when `e.persisted`).
  - Converted `handleCadastroSubmit` to `async/await` with `try/catch/finally` and removed `maeCriada` from `pendingConfirmation`.
  - Added `role="dialog" aria-modal="true"` + `aria-label` on both modal containers, plus `Escape` key dismissal listener in `useEffect`.
  - Removed `fallbackSessionData={pendingConfirmation.maeCriada}` from `<EmailConfirmationFlow />`, wired `onGoToLogin`, and added `if (!sessionData?.tokenSessao)` defense-in-depth inside `onEnterMaeApp`.
- Regression tests added:
  - `apps/landing/src/Screen/Auth/__tests__/EmailConfirmationFlow.test.jsx`: 5 new test cases (covering `401`, `500`, tokenless `200` fail-closed degradation + `onClose`/`onGoToLogin`/URL query/`localStorage` clean state; synchronous double-submit & double-resend lock; `validationErrors` priority).
  - `apps/landing/src/Screen/Auth/__tests__/PasswordRecoveryFlow.test.jsx`: 3 new test cases (synchronous double-submit on request, reset, and resend; `validationErrors` priority; `maxLength="72"` and `infoMessage` clearing on step toggle).
  - `apps/landing/src/Screen/Auth/__tests__/LoginScreen.test.jsx`: 4 new test cases (`401` and `500` post-cadastro auto-login degradation inside `LoginScreen`; synchronous double-submit on login and cadastro forms; `role="dialog"` + `aria-modal="true"` + `Escape` modal dismissal).

### 1.3 Verification Commands & Results
- Backend (`C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel`):
  - `.\mvnw.cmd clean test` -> Exit code `0`, `Tests run: 69, Failures: 0, Errors: 0, Skipped: 0`, `BUILD SUCCESS`.
- Frontend (`C:\Users\danie\PROA\projetoDemoDay\Froravel-Front`):
  - `npm run test:all` -> Exit code `0`, `Test Files  4 passed (4)`, `Tests  30 passed (30)`.
  - `npm run build:all` -> Exit code `0`, built `@floravel/landing`, `@floravel/mae`, `@floravel/psicologo`, and `@floravel/rh` cleanly.
- Targeted ESLint (`C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\apps\landing`):
  - `npx eslint src/Screen/Auth/EmailConfirmationFlow.jsx src/Screen/Auth/PasswordRecoveryFlow.jsx src/Screen/Auth/LoginScreen.jsx src/Screen/Auth/__tests__/EmailConfirmationFlow.test.jsx src/Screen/Auth/__tests__/PasswordRecoveryFlow.test.jsx src/Screen/Auth/__tests__/LoginScreen.test.jsx` -> Exit code `0`, 0 errors, 0 warnings.

---

## 2. Logic Chain

1. `RedefinirSenhaRequestDTO` enforces both 72-character (`@Size`) and 72-byte UTF-8 (`@AssertTrue isNovaSenhaDentroDoLimiteBytes`) constraints with `@JsonIgnore`, ensuring `GlobalExceptionHandler` populates `validationErrors` with HTTP `400` without breaking Jackson serialization/deserialization, and `AuthService.autenticar` prevents BCrypt's silent >72-byte key truncation while preserving HTTP `422` (`Obs 1.1`).
2. `EmailService` guards `codigo` before `HtmlUtils.htmlEscape` and short-circuits null/blank `destinatario`, preventing `IllegalArgumentException` crashes before `devFallback` (`Obs 1.1`).
3. Removing `fallbackSessionData` / `maeCriada` and gating navigation on `Boolean(sessionToUse?.tokenSessao)` in `EmailConfirmationFlow.jsx` and `LoginScreen.jsx` eliminates unauthenticated navigation with `floravel_jwt === null` when auto-login fails (`401`, `500`, or tokenless `200`), while `onClose?.()` + `onGoToLogin?.(emailLimpo)` + `navigate('/login?email=...')` cleanly restores the login form regardless of whether `/cadastro` was reached by route or in-place `alternarModo` (`Obs 1.2`).
4. Synchronous `useRef` in-flight guards (`inFlightRef`, `loginInFlightRef`, `cadastroInFlightRef`) prevent duplicate `fetch` invocations fired before React commits `disabled={loading}` state, while `finally` guarantees locks never remain stuck after validation, HTTP, or network errors (`Obs 1.2`).
5. Prioritizing non-empty `errJson.validationErrors` entries in `extrairMensagemErro` surfaces Spring's field-specific validation feedback ahead of the generic `"Falha de validação nos campos informados"` wrapper (`Obs 1.2`).

---

## 3. Caveats

- Outside `modules/auth/**` (M1 ownership), `CadastroMaeRequestDTO.java` and `CadastroPsicologoRequestDTO.java` still declare `@Size(min = 6, max = 100)` rather than 72 bytes, as already noted by `m1_iter2_explorer_1`. They were left untouched to respect exclusive M1 write ownership.

---

## 4. Conclusion

All M1 Iteration 2 backend (`modules/auth/**`) and frontend (`apps/landing/**`) remediation items and regression tests are implemented and verified with zero test failures, zero build errors, and zero ESLint violations.

---

## 5. Verification Method

1. **Backend**: Run `.\mvnw.cmd clean test` in `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel` -> verify `Tests run: 69, Failures: 0, Errors: 0, Skipped: 0`.
2. **Frontend Tests**: Run `npm run test:all` in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front` -> verify `4 passed (4)` files and `30 passed (30)` tests.
3. **Frontend Build**: Run `npm run build:all` in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front` -> verify exit code `0` across all 4 workspaces.
4. **Frontend Lint**: Run `npx eslint src/Screen/Auth/EmailConfirmationFlow.jsx src/Screen/Auth/PasswordRecoveryFlow.jsx src/Screen/Auth/LoginScreen.jsx src/Screen/Auth/__tests__/EmailConfirmationFlow.test.jsx src/Screen/Auth/__tests__/PasswordRecoveryFlow.test.jsx src/Screen/Auth/__tests__/LoginScreen.test.jsx` in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\apps\landing` -> verify exit code `0`.
5. **Invalidation conditions**: Any failure in the 69 backend tests or 30 frontend tests, any non-zero ESLint exit, or any match for `fallbackSessionData` in `apps/landing`.
