# Forensic Audit Report & Handoff — M1 Iteration 2 (`m1_iter2_auditor_1`)

**Handoff Type**: Hard  
**Work Product**: Milestone M1, Iteration 2 (`modules/auth/**` + `apps/landing/**`)  
**Profile**: General Project  
**Integrity Mode**: `development` (read directly from `ORIGINAL_REQUEST.md:8`)  
**Verdict**: **CLEAN**

---

## Forensic Audit Report

### Phase Results
- **Hardcoded Output / Test Result Detection**: **PASS** — Inspected all M1 Iteration 2 backend (`RedefinirSenhaRequestDTO.java`, `EmailService.java`, `AuthService.java`, `AuthControllerTest.java`, `EmailServiceTest.java`) and frontend (`EmailConfirmationFlow.jsx`, `PasswordRecoveryFlow.jsx`, `LoginScreen.jsx`, `EmailConfirmationFlow.test.jsx`, `PasswordRecoveryFlow.test.jsx`, `LoginScreen.test.jsx`, `AppRoutes.test.jsx`) files. All logic uses real BCrypt hashing/matching, `SecureRandom`, JPA repositories, Spring Bean Validation, `fetch()`, and React state/refs. Zero hardcoded test results.
- **Facade Implementation Detection**: **PASS** — No stubbed or constant-returning implementations in M1 Iteration 2 code. `EmailService` sends real `MimeMessage` via `JavaMailSender` when present and cleanly triggers dev fallback logging when `mailSender == null`, `destinatario` is null/blank, or SMTP throws. `EmailConfirmationFlow.jsx` has zero `fallbackSessionData` references (`grep_search` returned 0 matches) and fails closed unless `Boolean(sessionToUse?.tokenSessao)`.
- **Pre-Populated Artifact Detection**: **PASS** — Searched both `Froravel-Front` and `floravel-backend/Floravel` (excluding `node_modules`, `target`, `.git`) for `*.log`, `*result*`, `*output*`; 0 matching files found.
- **Hardcoded Secrets / Credentials Scan**: **PASS** — Zero hardcoded secrets, API keys, or credentials in any M1 Iteration 2 file.
- **Behavioral Verification — Frontend Tests (`npm run test:all`)**: **PASS** — Exit code `0`, `Test Files  4 passed (4)`, `Tests  30 passed (30)`.
- **Behavioral Verification — Frontend Build (`npm run build:all`)**: **PASS** — Exit code `0`, all 4 workspaces (`@floravel/landing`, `@floravel/mae`, `@floravel/psicologo`, `@floravel/rh`) built cleanly.
- **Behavioral Verification — Frontend Lint (`npx eslint ...`)**: **PASS** — Exit code `0`, 0 errors, 0 warnings on all 6 M1 Iteration 2 frontend files.
- **Behavioral Verification — Backend Tests (`.\mvnw.cmd test`)**: **PASS** (on single retry after transient concurrent DB cleanup) — Attempt 1 hit 1 transient failure in `AuthControllerTest.deveAceitarEmailComEspacosEMaiusculasNoEsqueciERedefinirSenha:318` due to concurrent `limparBanco()` against shared `localhost:3306/floraveldb` (no `src/test/resources` override). Attempt 2 exited `0` with `Tests run: 73, Failures: 0, Errors: 0, Skipped: 0`, `BUILD SUCCESS` (`AuthControllerTest`: 18/18 passed, `EmailServiceTest`: 4/4 passed).

---

## 1. Observation

1. **Ground-Truth Constraints (`ORIGINAL_REQUEST.md:8,26-30`)**:
   - `Integrity mode: development`.
   - Acceptance criteria: `npm run build:all` 0 errors, `.\mvnw.cmd clean test` 0 failures/errors, automated tests covering success and error cases, no hardcoded credentials or secret keys.
2. **Backend M1 Iteration 2 Source & Tests**:
   - `RedefinirSenhaRequestDTO.java:27-35`: `@Size(min = 6, max = 72)` + `@JsonIgnore @AssertTrue` `isNovaSenhaDentroDoLimiteBytes()` verifying `novaSenha.getBytes(StandardCharsets.UTF_8).length <= 72`.
   - `EmailService.java:29,62-66,164,215`: Null-safe `codigo` handling (`codigo != null ? HtmlUtils.htmlEscape(codigo) : ""`) and short-circuit `if (mailSender == null || destinatario == null || destinatario.isBlank())` triggering `devFallback.run()`.
   - `AuthService.java:36,215-217`: `autenticar` checks `dto.getSenha() != null && dto.getSenha().getBytes(StandardCharsets.UTF_8).length <= 72 && passwordEncoder.matches(dto.getSenha(), usuario.getSenha())`.
   - `AuthControllerTest.java:630-769` (18 total tests in surefire report) and `EmailServiceTest.java:74-98` (4 total tests in surefire report): Test exact 72-byte boundary, >72 ASCII chars (`400`), >72 UTF-8 multibyte chars (`"é".repeat(40)` -> `400` `validationErrors.novaSenhaDentroDoLimiteBytes`), >72-byte login rejection (`422`), and null/blank `EmailService` inputs with `verify(mailSender, never()).send(...)`.
3. **Frontend M1 Iteration 2 Source & Tests**:
   - `grep_search` for `fallbackSessionData` in `Froravel-Front/apps/landing`: `No results found`.
   - `EmailConfirmationFlow.jsx`: `extrairMensagemErro` (lines 9-20) prioritizes `errJson.validationErrors`; `inFlightRef = useRef(false)` guards submit and resend (released in `finally`); `autoLoginFailed` and `Boolean(sessionToUse?.tokenSessao)` enforce fail-closed behavior (`"Ir para o Login"`, `onClose?.()`, `onGoToLogin?.(emailLimpo)`, `navigate('/login?email=...')`).
   - `PasswordRecoveryFlow.jsx`: `extrairMensagemErro` prioritizes `validationErrors`; `inFlightRef` guards request/reset/resend; `maxLength={72}` on `#reset-nova-senha` and `#reset-confirmar-senha`; clears `infoMessage` on step toggle.
   - `LoginScreen.jsx`: `extrairMensagemErro` applied to login/cadastro; `loginInFlightRef` / `cadastroInFlightRef` released in `finally` and `pageshow`; `role="dialog" aria-modal="true"` + `Escape` dismissal; defense-in-depth `if (!sessionData?.tokenSessao)` in `onEnterMaeApp`.
   - Tests: `AppRoutes.test.jsx` (3), `EmailConfirmationFlow.test.jsx` (9), `PasswordRecoveryFlow.test.jsx` (9), `LoginScreen.test.jsx` (9) — total 30 tests.
4. **Static Scans**:
   - `find_by_name` for `*.log`, `*result*`, `*output*` (excluding `node_modules`, `target`, `.git`): 0 results in both repos.
   - Secret scan on `modules/auth/**` and `apps/landing/src/**`: 0 hardcoded secrets/credentials.
5. **Command Execution Evidence**:
   - `npm run test:all` (`Froravel-Front`): Exit code `0`, `Test Files  4 passed (4)`, `Tests  30 passed (30)` (`task-56.log`).
   - `npm run build:all` (`Froravel-Front`): Exit code `0`, `@floravel/landing`, `@floravel/mae`, `@floravel/psicologo`, `@floravel/rh` built (`task-60.log`).
   - `npx eslint src/Screen/Auth/EmailConfirmationFlow.jsx src/Screen/Auth/PasswordRecoveryFlow.jsx src/Screen/Auth/LoginScreen.jsx src/Screen/Auth/__tests__/EmailConfirmationFlow.test.jsx src/Screen/Auth/__tests__/PasswordRecoveryFlow.test.jsx src/Screen/Auth/__tests__/LoginScreen.test.jsx` (`Froravel-Front/apps/landing`): Exit code `0`, 0 errors, 0 warnings.
   - `.\mvnw.cmd test` (`floravel-backend/Floravel`):
     - Run 1 (`task-65.log`): Exit code `1`, `Tests run: 69, Failures: 1` (`AuthControllerTest.deveAceitarEmailComEspacosEMaiusculasNoEsqueciERedefinirSenha:318` — `emailService.enviarCodigoRecuperacaoSenha` had zero interactions because concurrent test execution deleted `camila.espaco@email.com` from shared `localhost:3306/floraveldb` between save and `POST /api/auth/esqueci-senha`).
     - Run 2 (`task-74.log`): Exit code `0`, `Tests run: 73, Failures: 0, Errors: 0, Skipped: 0`, `BUILD SUCCESS` (73 includes 4 tests from concurrent reviewer's `AdversarialM1Iter2AuthTest`; `AuthControllerTest` 18/18 passed, `EmailServiceTest` 4/4 passed).

---

## 2. Logic Chain

1. Static inspection of all M1 Iteration 2 files confirms real cryptographic/DB/HTTP logic with zero facades, zero hardcoded test results, zero `fallbackSessionData` remnants, and zero hardcoded secrets (`Obs 2, 3, 4`).
2. Artifact scan confirms zero pre-populated logs or result files (`Obs 4`).
3. Frontend Vitest suite (30/30), Vite production builds across all 4 workspaces, and targeted ESLint all passed on first execution (`Obs 5`).
4. Backend `.\mvnw.cmd test` initial failure was strictly due to concurrent `limparBanco()` DB cleanup against the shared MySQL `floraveldb` instance (no `src/test/resources` isolation); single retry passed 73/73 tests with `BUILD SUCCESS` (`Obs 5`).
5. Evaluated against `development` mode rules from `ORIGINAL_REQUEST.md:8`, all forensic checks pass -> Verdict is **`CLEAN`**.

---

## 3. Caveats

- **Shared Test DB Concurrency**: `floravel-backend/Floravel` has no `src/test/resources` datasource override, so concurrent `mvnw test` runs share `localhost:3306/floraveldb` and can interfere via `limparBanco()`.
- **Pre-Existing Out-of-Scope Defaults**: Pre-existing `application.properties`, `JwtService.java`, `AesGcmAttributeConverter.java`, and `LoginScreen.jsx` Demo Day shortcuts (`simularFallbackGovernoLocal`, `Acesso Rápido Demo Day`) predate M1 Iteration 2 and are outside M1 Iteration 2 changes.
- **Client `maxLength={72}` vs UTF-8 Bytes**: `PasswordRecoveryFlow.jsx` `maxLength={72}` constrains UTF-16 code units rather than UTF-8 bytes, which is safely handled because the backend enforces the 72-byte UTF-8 check (`400`) and `extrairMensagemErro` displays `validationErrors.novaSenhaDentroDoLimiteBytes`.

---

## 4. Conclusion

**VERDICT: CLEAN**

All M1 Iteration 2 backend (`modules/auth/**`) and frontend (`apps/landing/**`) deliverables pass Forensic Integrity Verification in `development` mode with zero stubs, zero facades, zero hardcoded test results, zero pre-populated result artifacts, zero hardcoded secrets/credentials, and full passing test and build suites.

---

## 5. Verification Method

1. Run `npm run test:all` in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front` -> expect `4 passed (4)`, `30 passed (30)`, exit code `0`.
2. Run `npm run build:all` in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front` -> expect exit code `0` across all 4 workspaces.
3. Run `.\mvnw.cmd test` (when no other Maven process is concurrently cleaning `floraveldb`) in `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel` -> expect `Failures: 0, Errors: 0, Skipped: 0`, `BUILD SUCCESS`.
4. **Invalidation conditions**: Any hardcoded secret/credential introduced into M1 files, any `fallbackSessionData` reintroduction in `apps/landing`, or any non-concurrent test/build failure.
