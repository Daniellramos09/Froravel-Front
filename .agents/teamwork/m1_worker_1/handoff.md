# Handoff Report — M1 Worker 1 (`m1_worker_1`)

**Handoff Type**: Hard  
**Milestone**: M1 — R1 Full-Stack: E-mail, Password Reset, Welcome Email & Frontend Test Infra  
**Conclusion Summary**: Implemented full-stack R1 password recovery (`POST /api/auth/esqueci-senha`, `POST /api/auth/redefinir-senha` with 6-digit `SecureRandom` OTP, BCrypt hash storage, 15-min TTL, atomic single-use consumption, and anti-enumeration), post-verification `@Async` HTML welcome email in `AuthService.confirmarEmail` / `EmailService`, shared Vitest + Testing Library + jsdom infrastructure in `Froravel-Front`, real recovery & email confirmation flows + routes in `apps/landing`, `LoginScreen.jsx` fixes (`rh` session storage key, `tipoPerfil` destination resolution, hardcoded Google Client ID removal), and comprehensive automated tests (Backend: 64/64 passing; Frontend: 18/18 passing; Full monorepo build: 4/4 workspaces passing).

---

## 1. Observation

### 1.1 Exact Files Created & Modified

**Backend (`C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel`)** — strictly inside `modules/auth/**`:
- **Created**:
  - `src/main/java/br/com/floravel/floravel/modules/auth/model/TokenRecuperacaoSenha.java` (`tokens_recuperacao_senha`, `codigo_hash` `VARCHAR(100)`, `data_expiracao`, `usado = false`, `isExpirado()`)
  - `src/main/java/br/com/floravel/floravel/modules/auth/repository/TokenRecuperacaoSenhaRepository.java` (`findFirstByUsuarioAndUsadoFalseOrderByDataCriacaoDescIdDesc`, `findFirstByUsuarioEmailAndUsadoFalseOrderByDataCriacaoDescIdDesc`, `@Modifying(clearAutomatically = true, flushAutomatically = true)` `invalidarTokensAnteriores` and `consumirTokenAtomicamente`)
  - `src/main/java/br/com/floravel/floravel/modules/auth/dto/EsqueciSenhaRequestDTO.java` (trims `email` in both constructor and `setEmail` before `@NotBlank`/`@Email`)
  - `src/main/java/br/com/floravel/floravel/modules/auth/dto/EsqueciSenhaResponseDTO.java` (`mensagem`, `email`, `expiracaoMinutos`)
  - `src/main/java/br/com/floravel/floravel/modules/auth/dto/RedefinirSenhaRequestDTO.java` (trims `email` and `codigo` in both constructor and setters; `@Pattern("^\\d{6}$")`, `@Size(min = 6, max = 100)` on `novaSenha`)
  - `src/main/java/br/com/floravel/floravel/modules/auth/dto/RedefinirSenhaResponseDTO.java` (`redefinida`, `mensagem`, `email`)
  - `src/test/java/br/com/floravel/floravel/modules/auth/service/AuthServiceTest.java` (3 Mockito unit tests)
  - `src/test/java/br/com/floravel/floravel/modules/auth/service/EmailServiceTest.java` (3 unit tests)
- **Modified**:
  - `src/main/java/br/com/floravel/floravel/modules/auth/controller/AuthController.java` — added `@PostMapping("/esqueci-senha")` and `@PostMapping("/redefinir-senha")`.
  - `src/main/java/br/com/floravel/floravel/modules/auth/service/AuthService.java` — injected `TokenRecuperacaoSenhaRepository`, added `solicitarRecuperacaoSenha` & `redefinirSenha`, and added `emailService.enviarEmailBoasVindas(usuario.getEmail(), usuario.getNome())` inside `confirmarEmail` only on first verification transition (`false -> true`).
  - `src/main/java/br/com/floravel/floravel/modules/auth/service/EmailService.java` — added `@Async enviarCodigoRecuperacaoSenha` and `@Async enviarEmailBoasVindas`, HTML-escaped names/codes via `HtmlUtils.htmlEscape`, removed plaintext OTP from pre-SMTP `INFO` log, preserved dev fallback when `mailSender == null` or SMTP throws.
  - `src/test/java/br/com/floravel/floravel/modules/auth/controller/AuthControllerTest.java` — added FK-safe `tokenRecuperacaoSenhaRepository.deleteAll()` in `@BeforeEach` and `@AfterEach`, `@MockitoSpyBean EmailService`, welcome email idempotency assertions, 8 new R1 integration tests + `webAppContextSetup` public-route test verifying `JwtAuthInterceptor`.

**Frontend (`C:\Users\danie\PROA\projetoDemoDay\Froravel-Front`)** — strictly root `package.json`, `package-lock.json`, and `apps/landing/**`:
- **Created**:
  - `apps/landing/vitest.config.js` (`jsdom`, `url: 'http://localhost:5173/'`, `VITE_API_URL: 'http://localhost:8080'`, `VITE_GOOGLE_CLIENT_ID: ''`)
  - `apps/landing/src/test/setup.js` (`@testing-library/jest-dom/vitest`, `cleanup()`, `localStorage.clear()`, `vi.restoreAllMocks()`)
  - `apps/landing/src/Screen/Auth/PasswordRecoveryFlow.jsx` (shared modal/page flow + `EsqueciSenhaScreen`, `RedefinirSenhaScreen`)
  - `apps/landing/src/Screen/Auth/EmailConfirmationFlow.jsx` (shared modal/page flow + `ConfirmarEmailScreen`, auto-login JWT exchange post-cadastro)
  - `apps/landing/src/Screen/Auth/__tests__/PasswordRecoveryFlow.test.jsx` (6 tests)
  - `apps/landing/src/Screen/Auth/__tests__/EmailConfirmationFlow.test.jsx` (4 tests)
  - `apps/landing/src/Screen/Auth/__tests__/LoginScreen.test.jsx` (5 tests)
  - `apps/landing/src/__tests__/AppRoutes.test.jsx` (3 tests)
- **Modified**:
  - `package.json` & `package-lock.json` — added `test:all`, `test:landing`, and devDependencies (`vitest@^5.1.1`, `@testing-library/react@^16.3.3`, `@testing-library/jest-dom@^8.0.0`, `@testing-library/user-event@^14.6.13`, `@testing-library/dom@^10.4.2`, `jsdom@^31.0.1`).
  - `apps/landing/package.json` — added `"test": "vitest run"` and `"test:watch": "vitest"`.
  - `apps/landing/eslint.config.js` — added test override disabling `react-refresh/only-export-components` for `**/*.{test,spec}.{js,jsx}` and `src/test/**`.
  - `apps/landing/src/App.jsx` — exported `AppRoutes`, registered `/esqueci-senha`, `/redefinir-senha`, and `/confirmar-email`.
  - `apps/landing/src/Screen/Auth/LoginScreen.jsx` — replaced hardcoded Google Client ID with `import.meta.env.VITE_GOOGLE_CLIENT_ID || ''`, mapped `'rh'` -> `'floravel_rh_sessao'` and resolved `papelDestino` from `authData.tipoPerfil`, replaced stub forgot modal with `<PasswordRecoveryFlow isModal />`, transitioned post-cadastro (`POST /api/maes` `201`) to `<EmailConfirmationFlow isModal />`, fixed pre-existing ESLint issues in `LoginScreen.jsx`.

### 1.2 Verification Commands & Results

1. **Backend Full Suite**: `.\mvnw.cmd clean test` (in `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel`)
   - Result: **EXIT CODE 0** — `Tests run: 64, Failures: 0, Errors: 0, Skipped: 0` (`AuthControllerTest`: 14, `AuthServiceTest`: 3, `EmailServiceTest`: 3, plus all existing suites: `AgendamentoServiceTest`, `DenunciaServiceTest`, `FeedbackServiceTest`, `MaeControllerTest`, `OnboardingServiceTest`, `PagamentoServiceTest`, `PsicologoPersistenciaAndSecurityTest`, `PsicologoServiceTest`, `RhCorporativoServiceTest`, `RodaDeConversaServiceTest`, `CalculadoraRiscoEdimburgoTest`, `ValidacaoGovernoTest`).
2. **Frontend Dependency Install**: `npm install` (in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front`)
   - Result: **EXIT CODE 0** — `added 62 packages, removed 7 packages, and audited 876 packages in 12s`.
3. **Frontend Unit & Integration Tests**: `npm run test:all` (in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front`)
   - Result: **EXIT CODE 0** — `Test Files  4 passed (4)`, `Tests  18 passed (18)`:
     - `src/__tests__/AppRoutes.test.jsx` (3 passed)
     - `src/Screen/Auth/__tests__/EmailConfirmationFlow.test.jsx` (4 passed)
     - `src/Screen/Auth/__tests__/PasswordRecoveryFlow.test.jsx` (6 passed)
     - `src/Screen/Auth/__tests__/LoginScreen.test.jsx` (5 passed)
4. **Targeted ESLint on All M1-Touched Files**:
   - Command: `npx eslint vitest.config.js src/test/setup.js src/App.jsx src/Screen/Auth/LoginScreen.jsx src/Screen/Auth/PasswordRecoveryFlow.jsx src/Screen/Auth/EmailConfirmationFlow.jsx src/Screen/Auth/__tests__/PasswordRecoveryFlow.test.jsx src/Screen/Auth/__tests__/EmailConfirmationFlow.test.jsx src/Screen/Auth/__tests__/LoginScreen.test.jsx src/__tests__/AppRoutes.test.jsx` (in `apps/landing`)
   - Result: **EXIT CODE 0** — 0 errors, 0 warnings.
5. **Workspace-wide `npm run lint:all`** (in `Froravel-Front`):
   - Result: **EXIT CODE 1** due strictly to pre-existing lint errors in untouched files across `apps/landing` (e.g., unused `import React` in `AccessibilityContext.jsx`, `Landing/*`, `NovaLanding/*`, `Services/*`), `apps/mae`, `apps/psicologo`, and `apps/rh` (see `Caveats`).
6. **Frontend Full Production Build**: `npm run build:all` (in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front`)
   - Result: **EXIT CODE 0** — all 4 workspaces built cleanly: `@floravel/landing` (1.12s), `@floravel/mae` (715ms), `@floravel/psicologo` (575ms), `@floravel/rh` (711ms).
7. **Secrets Scan (`grep_search`)**:
   - Scanned `Froravel-Front/apps/landing/src` and `floravel-backend/Floravel/src/main/java/br/com/floravel/floravel/modules/auth` for `(AIza|AKIA|sk_live|sk_test|apps\.googleusercontent\.com|FALLBACK_DEV_SECRET|client_secret|clientSecret|floravel_mail_pass)`.
   - Result: **No results found** in either directory.

---

## 2. Logic Chain

1. **Jackson 3 Constructor Binding Discovery**: During the initial `.\mvnw.cmd clean test`, `AuthControllerTest.deveAceitarEmailComEspacosEMaiusculasNoEsqueciERedefinirSenha` failed with HTTP `400` because Spring Boot 4.1.2 (`jackson-databind 3.1.7`) compiles with `-parameters` and prefers the `@AllArgsConstructor` over `setEmail(String)`. Writing explicit trimming constructors on `EsqueciSenhaRequestDTO` and `RedefinirSenhaRequestDTO` alongside trimming setters ensures whitespace normalization runs before `@Email`/`@Pattern` Bean Validation regardless of deserialization path.
2. **BCrypt + Hash-Before-Expiration + Atomic Single-Use**: Storing BCrypt hashes in `tokens_recuperacao_senha.codigo_hash` (`VARCHAR(100)`) precludes SQL equality lookup by code. Fetching the latest unused token by normalized email (`OrderByDataCriacaoDescIdDesc`), verifying `passwordEncoder.matches(...)` *before* `token.isExpirado()`, executing `consumirTokenAtomicamente(id) == 1` (`@Modifying(clearAutomatically = true, flushAutomatically = true)`), reloading `Usuario` by ID, and sweeping remaining unused tokens prevents brute-force timing/state leaks and concurrent code reuse.
3. **Post-Cadastro JWT Acquisition**: Since `POST /api/maes` returns `MaeResponseDTO` without a JWT, `LoginScreen.jsx` transitions into `EmailConfirmationFlow`, keeps credentials strictly in React state (never `localStorage`), confirms via `/api/auth/confirmar-email`, exchanges credentials via `POST /api/auth/login`, and only then stores `floravel_mae_sessao` + `floravel_jwt` and calls `navigateToApp('mae', ...)`.
4. **Vitest Isolation from Local `.env`**: `apps/landing/.env` (untracked) defines `VITE_GOOGLE_CLIENT_ID`, which Vite loads into `import.meta.env`. Setting `VITE_GOOGLE_CLIENT_ID: ''` inside `apps/landing/vitest.config.js` keeps tests deterministic and verifies runtime `/api/auth/oauth/google/config` discovery.

---

## 3. Caveats

1. **`npm run lint:all` Fails on Pre-Existing Untouched Files**: While every file created or modified by M1 (including `LoginScreen.jsx` and `App.jsx`) passes ESLint with 0 errors, `npm run lint:all` fails with exit code 1 because of pre-existing unused imports (`import React`, unused icons, unused `catch (_) {}`) in untouched files under `apps/landing/src/Components/**`, `apps/landing/src/Screen/Landing/**`, `apps/landing/src/Screen/NovaLanding/**`, `apps/landing/src/Screen/Services/**`, `apps/mae`, `apps/psicologo`, and `apps/rh`. These were outside M1's minimal-change / exclusive-write scope.
2. **Untracked Local `.env` Files**: Local gitignored `.env` files (`apps/landing/.env` with `VITE_GOOGLE_CLIENT_ID`, backend `application.properties` outside M1 ownership) were left untouched per Exclusive Write Ownership boundaries.

---

## 4. Conclusion

Milestone M1 (R1 Full-Stack) is complete, verified, and ready for Milestone M2 and E2E testing:
- Backend `modules/auth` implements all R1 endpoints, security defenses, welcome email dispatch, and passes 64/64 tests.
- Frontend `Froravel-Front` has shared Vitest + RTL + jsdom configured, `apps/landing` implements all R1 flows, routes, RH session fixes, and secret removal, all 18/18 landing tests pass, all M1-touched files pass ESLint cleanly, and `npm run build:all` passes across all 4 workspaces.

---

## 5. Verification Method

1. **Backend**: Run `.\mvnw.cmd clean test` in `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel` -> verify 64 tests run, 0 failures, 0 errors.
2. **Frontend Tests**: Run `npm run test:all` in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front` -> verify 4 test files, 18 tests pass.
3. **Frontend M1 Lint**: Run `npx eslint vitest.config.js src/test/setup.js src/App.jsx src/Screen/Auth/LoginScreen.jsx src/Screen/Auth/PasswordRecoveryFlow.jsx src/Screen/Auth/EmailConfirmationFlow.jsx src/Screen/Auth/__tests__/PasswordRecoveryFlow.test.jsx src/Screen/Auth/__tests__/EmailConfirmationFlow.test.jsx src/Screen/Auth/__tests__/LoginScreen.test.jsx src/__tests__/AppRoutes.test.jsx` in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\apps\landing` -> verify exit code 0.
4. **Frontend Build**: Run `npm run build:all` in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front` -> verify exit code 0 across all 4 workspaces.
5. **Invalidation Conditions**: Any failure in `AuthControllerTest` FK cleanup when running with `MaeControllerTest` / `ValidacaoGovernoTest`, any 422 instead of 400 on `/api/auth/redefinir-senha`, or any hardcoded `.apps.googleusercontent.com` literal in `apps/landing/src/**` invalidates this handoff.
