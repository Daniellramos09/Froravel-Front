# Forensic Audit Handoff Report — Milestone M1 (`m1_auditor_1`)

**Handoff Type**: Hard  
**Work Product**: Milestone M1 (R1 Full-Stack) — `floravel-backend/Floravel/.../modules/auth/**`, `Froravel-Front/apps/landing/**`, `Froravel-Front/package.json`  
**Profile**: General Project (`development` mode, verified directly from `ORIGINAL_REQUEST.md` line 8)  
**Verdict**: **CLEAN**

---

## Forensic Audit Report

**Work Product**: `floravel-backend/Floravel/.../modules/auth/**` and `Froravel-Front/apps/landing/**` + `Froravel-Front/package.json`  
**Profile**: General Project (Development Mode)  
**Verdict**: **CLEAN**

### Phase Results
- **Phase 1 — Hardcoded Output / Facade / Stub Detection (Backend `modules/auth/**`)**: **PASS** — `TokenRecuperacaoSenha`, `TokenRecuperacaoSenhaRepository`, `AuthService`, `AuthController`, and `EmailService` implement genuine `SecureRandom` 6-digit OTP generation, BCrypt hashing, 15-minute TTL, atomic single-use update, BCrypt user password update, and `@Async` welcome email dispatch on first verification.
- **Phase 1 — Hardcoded Output / Facade / Stub Detection (Frontend `apps/landing/**`)**: **PASS** — `PasswordRecoveryFlow.jsx`, `EmailConfirmationFlow.jsx`, and `LoginScreen.jsx` make real `fetch` calls to `/api/auth/esqueci-senha`, `/api/auth/redefinir-senha`, `/api/auth/confirmar-email`, `/api/auth/reenviar-codigo`, and `/api/auth/login`. Zero remaining `setForgotSent(true)` stubs or `TODO`/`FIXME`/`NotImplemented` placeholders.
- **Phase 1 — Hardcoded Secrets / Credentials Scan (AC4)**: **PASS** — `LoginScreen.jsx:20` reads `import.meta.env.VITE_GOOGLE_CLIENT_ID || ''` with runtime fallback via `/api/auth/oauth/google/config` (`LoginScreen.jsx:131-141`). Regex secret scans across `Froravel-Front/apps/landing/src` and `floravel-backend/Floravel/.../modules/auth` returned 0 matches (the only match in `apps/landing` is the placeholder `VITE_GOOGLE_CLIENT_ID=seu_client_id.apps.googleusercontent.com` in `apps/landing/.env.example:5`).
- **Phase 1 — Pre-populated Artifact Detection**: **PASS** — Recursive scans for `*.log`, `*result*`, `*output*` outside `node_modules`, `target`, `.git`, and `.agents` returned 0 files in both repositories.
- **Phase 2 — Independent Test & Build Execution**: **PASS** —
  - Frontend tests (`npm run test:all`): EXIT CODE 0 — `Test Files  4 passed (4)`, `Tests  18 passed (18)`.
  - Frontend build (`npm run build:all`): EXIT CODE 0 — all 4 workspaces (`@floravel/landing`, `@floravel/mae`, `@floravel/psicologo`, `@floravel/rh`) built cleanly.
  - Backend tests (`.\mvnw.cmd test`): EXIT CODE 0 — `Tests run: 64, Failures: 0, Errors: 0, Skipped: 0`, `BUILD SUCCESS`.

---

## 1. Observation

### 1.1 Backend Source Inspection (`floravel-backend/Floravel/src/main/java/br/com/floravel/floravel/...`)
1. `modules/auth/model/TokenRecuperacaoSenha.java`:
   - Lines 28–36: `codigoHash` (`@Column(name = "codigo_hash", nullable = false, length = 100)`), `dataExpiracao`, `usado = false`.
   - Lines 42–44: `isExpirado()` returns `LocalDateTime.now().isAfter(dataExpiracao)`.
2. `modules/auth/repository/TokenRecuperacaoSenhaRepository.java`:
   - Line 18: `findFirstByUsuarioEmailAndUsadoFalseOrderByDataCriacaoDescIdDesc(String email)`.
   - Lines 20–22: `@Modifying(clearAutomatically = true, flushAutomatically = true)` `invalidarTokensAnteriores(@Param("usuario") Usuario usuario)`.
   - Lines 24–26: `@Modifying(clearAutomatically = true, flushAutomatically = true)` `@Query("UPDATE TokenRecuperacaoSenha t SET t.usado = true WHERE t.id = :id AND t.usado = false")` `int consumirTokenAtomicamente(@Param("id") String id)`.
3. `shared/config/SecurityBeansConfig.java`:
   - Lines 11–14: `PasswordEncoder` bean returns `new BCryptPasswordEncoder()`.
4. `modules/auth/service/AuthService.java`:
   - Lines 55–56: `TEMPO_EXPIRACAO_MINUTOS = 15`, `private final SecureRandom secureRandom = new SecureRandom();`.
   - Lines 143–167 (`solicitarRecuperacaoSenha`): normalizes email (`trim().toLowerCase()`), inside `usuarioRepository.findByEmail(emailNormalizado).ifPresent(...)` invalidates prior tokens (`line 147`), generates 6-digit OTP via `String.format("%06d", secureRandom.nextInt(1_000_000))` (`line 149`), encodes with `passwordEncoder.encode(codigo)` (`line 153`), sets `dataExpiracao = LocalDateTime.now().plusMinutes(TEMPO_EXPIRACAO_MINUTOS)` (`line 154`), saves `TokenRecuperacaoSenha` (`line 158`), and invokes `emailService.enviarCodigoRecuperacaoSenha(...)` (`line 159`). Returns neutral response on unknown email (`lines 162–166`).
   - Lines 170–205 (`redefinirSenha`): loads latest unused token (`lines 174–176`), checks `!passwordEncoder.matches(codigoLimpo, token.getCodigoHash())` (`line 178`) before `token.isExpirado()` (`line 182`), consumes atomically via `consumirTokenAtomicamente(token.getId())` checking `atualizados != 1` (`lines 187–190`), encodes and persists `usuario.setSenha(passwordEncoder.encode(dto.getNovaSenha()))` (`lines 192–195`), and sweeps remaining unused tokens (`line 197`).
   - Lines 80–116 (`confirmarEmail`): checks `Boolean.TRUE.equals(usuario.getEmailVerificado())` (`line 86`) and returns early without re-sending welcome email; on first verification (`false -> true`), marks `token.setUsado(true)` & `usuario.setEmailVerificado(true)`, saves both, and invokes `emailService.enviarEmailBoasVindas(usuario.getEmail(), usuario.getNome())` (`line 108`).
5. `modules/auth/service/EmailService.java`:
   - Lines 36–60: `@Async enviarCodigoRecuperacaoSenha` and `@Async enviarEmailBoasVindas` with HTML escaping (`HtmlUtils.htmlEscape` at `lines 113, 164, 215`), SMTP dispatch via `JavaMailSender`, and dev fallback when `mailSender == null` or SMTP throws.
6. `modules/auth/controller/AuthController.java` & `shared/security/JwtAuthInterceptor.java` & `shared/exception/GlobalExceptionHandler.java`:
   - `AuthController.java:62-72`: `@PostMapping("/esqueci-senha")` and `@PostMapping("/redefinir-senha")` wired with `@Valid`.
   - `JwtAuthInterceptor.java:121`: `/api/auth/` is public.
   - `GlobalExceptionHandler.java:82-90`: maps `CodigoInvalidoException` and `CodigoExpiradoException` to HTTP `400 Bad Request`.

### 1.2 Frontend Source Inspection (`Froravel-Front`)
1. `apps/landing/src/Screen/Auth/PasswordRecoveryFlow.jsx`:
   - Lines 59–63 & 103–107: real `fetch(\`${apiBase}/api/auth/esqueci-senha\`, { method: 'POST', ... })`.
   - Lines 156–164: real `fetch(\`${apiBase}/api/auth/redefinir-senha\`, { method: 'POST', ... })`.
   - Client-side validation (`lines 131–146`), loading/error states, and route wrappers `EsqueciSenhaScreen` / `RedefinirSenhaScreen` (`lines 455–479`).
2. `apps/landing/src/Screen/Auth/EmailConfirmationFlow.jsx`:
   - Lines 65–69: real `fetch(\`${apiBase}/api/auth/confirmar-email\`, { method: 'POST', ... })`.
   - Lines 80–87: real `fetch(\`${apiBase}/api/auth/login\`, { method: 'POST', ... })` to acquire JWT post-confirmation.
   - Lines 124–128: real `fetch(\`${apiBase}/api/auth/reenviar-codigo\`, { method: 'POST', ... })`.
3. `apps/landing/src/Screen/Auth/LoginScreen.jsx`:
   - Line 20: `const GOOGLE_CLIENT_ID_PUBLIC = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';` (no hardcoded `.apps.googleusercontent.com` literal).
   - Lines 22–34: `SESSAO_STORAGE_KEYS` maps `rh: 'floravel_rh_sessao'`, and `resolverPapelDestino` resolves app destination from server `tipoPerfil`.
   - Lines 462–478 & 1082–1110: post-cadastro opens `<EmailConfirmationFlow isModal ... />`.
   - Lines 613–619 & 1055–1079: "Esqueceu a senha?" opens `<PasswordRecoveryFlow isModal ... />`.
4. `apps/landing/src/App.jsx`:
   - Lines 18–38: exports `AppRoutes` and registers `/esqueci-senha`, `/redefinir-senha`, and `/confirmar-email`.
5. `package.json` & `apps/landing/vitest.config.js`:
   - `package.json:21-22`: `"test:all": "npm run test --workspaces --if-present"`, `"test:landing": "npm --workspace=@floravel/landing run test"`.
   - `apps/landing/vitest.config.js:13-16`: isolates `VITE_API_URL` and `VITE_GOOGLE_CLIENT_ID: ''`.

### 1.3 Secrets, Stubs, and Artifact Scans (Raw Evidence)
- `grep_search` in `Froravel-Front/apps/landing/src` for `(AIza|AKIA|sk_live|sk_test|apps\.googleusercontent\.com|FALLBACK_DEV_SECRET|client_secret|clientSecret|floravel_mail_pass|password\s*=\s*['"][^'"]+['"]|api[_-]?key\s*[:=]\s*['"][^'"]+['"]|secret\s*[:=]\s*['"][^'"]+['"])`: `No results found`.
- `grep_search` in `floravel-backend/Floravel/src/main/java/br/com/floravel/floravel/modules/auth` for the same secret regex: `No results found`.
- `grep_search` in `Froravel-Front/apps/landing` for `(googleusercontent|AIza|AKIA|sk_live|sk_test|client_secret|clientSecret|FALLBACK_DEV_SECRET|floravel_mail_pass)`: only 1 placeholder match in `apps/landing/.env.example:5` (`VITE_GOOGLE_CLIENT_ID=seu_client_id.apps.googleusercontent.com`).
- `grep_search` for `(setForgotSent|NotImplementedError|UnsupportedOperationException|TODO|FIXME)` in `Froravel-Front/apps/landing/src` and `modules/auth`: `No results found`.
- Artifact scan (`Get-ChildItem -Recurse -File -Include *.log,*result*,*output*` excluding `node_modules`, `target`, `.git`, `.agents`): exit code 0, empty stdout in both repos.

### 1.4 Independent Test & Build Execution (Raw Output)
1. **Frontend Tests + Build** (`npm run test:all` and `npm run build:all` in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front`):
```text
 ✓ src/__tests__/AppRoutes.test.jsx (3 tests) 634ms
 ✓ src/Screen/Auth/__tests__/EmailConfirmationFlow.test.jsx (4 tests) 1306ms
 ✓ src/Screen/Auth/__tests__/PasswordRecoveryFlow.test.jsx (6 tests) 4328ms
 ✓ src/Screen/Auth/__tests__/LoginScreen.test.jsx (5 tests) 4573ms

 Test Files  4 passed (4)
      Tests  18 passed (18)
TEST_EXIT=0

✓ built in 2.93s (@floravel/landing)
✓ built in 1.30s (@floravel/mae)
✓ built in 1.25s (@floravel/psicologo)
✓ built in 1.64s (@floravel/rh)
BUILD_EXIT=0
```

2. **Backend Tests** (`.\mvnw.cmd test` in `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel` — run without `clean` per parent parallel-execution notice because active Java/Maven processes `9196`, `18712`, `18720` were present):
```text
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 12.53 s -- in br.com.floravel.floravel.FloravelApplicationTests
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.009 s -- in br.com.floravel.floravel.modules.agendamento.service.AgendamentoServiceTest
[INFO] Tests run: 14, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 11.47 s -- in br.com.floravel.floravel.modules.auth.controller.AuthControllerTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.018 s -- in br.com.floravel.floravel.modules.auth.service.AuthServiceTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.239 s -- in br.com.floravel.floravel.modules.auth.service.EmailServiceTest
...
[INFO] Tests run: 64, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

---

## 2. Logic Chain
1. `ORIGINAL_REQUEST.md` line 8 specifies `Integrity mode: development`, so Phase 2 enforces Development Mode rules (zero hardcoded test results, zero facades/stubs, zero fabricated verification outputs, plus AC4 zero hardcoded credentials/secrets).
2. Inspection of `TokenRecuperacaoSenha.java`, `TokenRecuperacaoSenhaRepository.java`, `SecurityBeansConfig.java`, `AuthService.java`, `EmailService.java`, and `AuthController.java` confirms real `SecureRandom` OTP generation, `BCryptPasswordEncoder` hashing, 15-minute expiration check after hash verification, atomic single-use SQL update (`WHERE id = :id AND usado = false`), user password BCrypt re-encoding, and `@Async` welcome email dispatch strictly on `emailVerificado` `false -> true` transition.
3. Inspection of `PasswordRecoveryFlow.jsx`, `EmailConfirmationFlow.jsx`, `LoginScreen.jsx`, and `App.jsx` confirms the stub forgot-password flow and hardcoded Google Client ID were completely replaced by real `fetch` API integrations, environment-backed OAuth config with runtime `/api/auth/oauth/google/config` discovery, and correct `floravel_rh_sessao` / `tipoPerfil` session routing.
4. Regex scans and filesystem artifact scans confirm zero hardcoded secrets/credentials and zero pre-populated verification outputs in M1 scope.
5. Independent execution of `npm run test:all` (18/18 passed), `npm run build:all` (4/4 workspaces built), and `.\mvnw.cmd test` (64/64 passed, 0 skipped) confirms that all production code and test suites compile and pass genuinely against the real implementations.

---

## 3. Caveats
- `.\mvnw.cmd test` was executed without `clean` (per parent parallel-Maven safety notice, as concurrent Java processes `9196`, `18712`, `18720` from sibling audit agents were active on `target/` and `floraveldb`).
- Live SMTP delivery and live multi-app browser E2E flows are outside M1 unit/integration scope (`EmailService` uses `JavaMailSender` when configured and logs dev fallback when `mailSender == null`, verified via `EmailServiceTest`; browser E2E belongs to the E2E Track / M5).

---

## 4. Conclusion
**Verdict: CLEAN.** Milestone M1 (R1 Full-Stack) passes all Forensic Integrity Checks under `development` mode and satisfies AC1–AC4 for M1 scope. No integrity violations, stubs, fabricated outputs, or hardcoded secrets were found.

---

## 5. Verification Method
1. Re-run frontend tests and production build in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front`:
   - `npm run test:all` (expect 4 test files, 18 passed, exit code 0)
   - `npm run build:all` (expect 4 workspaces built, exit code 0)
2. Re-run backend suite in `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel` (once no other Maven process is active):
   - `.\mvnw.cmd clean test` (expect 64 tests run, 0 failures, 0 errors, 0 skipped, `BUILD SUCCESS`)
3. Inspect `AuthService.java:143-205` & `:80-116`, `TokenRecuperacaoSenhaRepository.java:24-26`, `PasswordRecoveryFlow.jsx`, `EmailConfirmationFlow.jsx`, and `LoginScreen.jsx:19-34`.
4. **Invalidation Conditions**: Any hardcoded secret literal in `apps/landing/src/**` or `modules/auth/**`, any stub handler bypassing `fetch` in auth flows, or any failure in `.\mvnw.cmd clean test` / `npm run test:all` / `npm run build:all` invalidates this verdict.
