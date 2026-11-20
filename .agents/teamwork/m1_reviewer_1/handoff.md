# Handoff Report — Backend M1 Review (`m1_reviewer_1`)

**Handoff Type**: Hard  
**Milestone**: M1 — Backend R1 (`modules/auth/**`) — Iteration 1  
**Verdict**: **APPROVE**

---

## Review Summary

**Verdict**: `APPROVE`

All Backend R1 deliverables in `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel\src\main\java\br\com\floravel\floravel\modules\auth\**` and `src\test\java\br\com\floravel\floravel\modules\auth\**` conform to `ORIGINAL_REQUEST.md` (R1) and `PROJECT.md § Interface Contracts`. Security controls (6-digit `SecureRandom` OTP, BCrypt hash storage, 15-minute TTL, hash-before-expiry validation, atomic single-use consumption, anti-enumeration on unknown email, HTML escaping via `HtmlUtils.htmlEscape`, no OTP leakage in pre-SMTP `INFO` logs or recovery email subjects, and zero hardcoded secrets) are cleanly implemented and verified by both unit and integration tests. Independent execution of `.\mvnw.cmd clean test` passed **64/64 tests with 0 failures and 0 errors**.

### Findings

No Critical, Major, or Minor blocking defects found.

### Verified Claims

- **Endpoints & DTO contracts (`PROJECT.md § Interface Contracts #1`)** → verified via direct inspection of `AuthController.java:62-72`, `EsqueciSenhaRequestDTO.java`, `EsqueciSenhaResponseDTO.java`, `RedefinirSenhaRequestDTO.java`, `RedefinirSenhaResponseDTO.java` → **pass**.
- **6-digit `SecureRandom` + BCrypt hash + 15-min TTL** → verified via `AuthService.java:55-56, 149-158`, `TokenRecuperacaoSenha.java:28-44`, `SecurityBeansConfig.java:11-14` → **pass**.
- **Single-use & atomic consumption + prior token invalidation** → verified via `TokenRecuperacaoSenhaRepository.java:20-26`, `AuthService.java:147, 187-197` → **pass**.
- **Anti-enumeration & hash-before-expiry check** → verified via `AuthService.java:146-166, 178-184` and `AuthControllerTest.java:279-296, 512-534` → **pass**.
- **Post-validation welcome email (`@Async`, idempotent first-time transition, HTML escaping)** → verified via `FloravelApplication.java:7`, `AuthService.java:86-108`, `EmailService.java:49-60, 111-114, 164, 215, 265` → **pass**.
- **Error handling (`400 Bad Request` on `CodigoInvalidoException`, `CodigoExpiradoException`, validation errors)** → verified via `GlobalExceptionHandler.java:61-90` → **pass**.
- **Public route access via `JwtAuthInterceptor`** → verified via `JwtAuthInterceptor.java:121` (`/api/auth/`) and `AuthControllerTest.java:595-628` → **pass**.
- **Zero hardcoded secrets in `modules/auth/**`** → verified via `grep_search` across `modules/auth` → **pass (0 matches)**.
- **Full backend test suite (`.\mvnw.cmd clean test`)** → verified via independent execution → **pass (64/64, 0 failures, 0 errors)**.

### Coverage Gaps

- **Frontend `apps/landing/**` & root `package.json`** — not reviewed by this backend-scoped reviewer (handled separately per dispatch scope).

### Unverified Items

- Live SMTP delivery against Mailtrap/Gmail with real credentials (dev fallback and mocked `JavaMailSender` verified in `EmailServiceTest.java`).

---

## Challenge Summary (Adversarial Review)

**Overall risk assessment**: `LOW`

### Challenges

#### [Low] Challenge 1 — No per-email brute-force attempt counter/lockout on `redefinir-senha`
- **Assumption challenged**: 15-minute TTL + BCrypt computational cost sufficiently deter online guessing of a 6-digit ($10^6$) OTP.
- **Attack scenario**: Distributed concurrent requests against `POST /api/auth/redefinir-senha` with a known target email could test codes without hitting an explicit per-token attempt cap (e.g., max 5 failed attempts invalidating the token).
- **Blast radius**: Low for Demo Day / MVP due to ~100ms BCrypt cost per attempt and 15-min TTL, though high-concurrency production traffic could apply pressure.
- **Mitigation**: Future hardening can add an `int tentativas` counter on `TokenRecuperacaoSenha` (invalidating after 5 mismatches) or endpoint rate-limiting. (Not required by R1 / `PROJECT.md`.)

#### [Low] Challenge 2 — BCrypt timing difference on `esqueci-senha`
- **Assumption challenged**: Returning identical `200 OK` JSON payloads prevents account enumeration.
- **Attack scenario**: For a registered email, `AuthService.solicitarRecuperacaoSenha` runs `passwordEncoder.encode(codigo)` synchronously (~60–100ms) while unknown emails skip encoding and return immediately, creating a measurable response-time delta.
- **Blast radius**: Minor timing side-channel; payload and status are strictly identical.
- **Mitigation**: Optional future hardening via constant-time dummy hash or async token generation.

#### [Low] Challenge 3 — `@Async` email dispatch invoked before `@Transactional` commit
- **Assumption challenged**: `EmailService` async tasks only execute after DB state is committed.
- **Attack scenario**: In `AuthService.solicitarRecuperacaoSenha` (`AuthService.java:158-159`) and `AuthService.confirmarEmail` (`AuthService.java:106-108`), the `@Async` email call is queued before the `@Transactional` method returns/commits. If a DB commit exception occurred at transaction end, an email could be sent for a rolled-back change. (Because `EmailService` receives Strings directly and makes no DB queries, there is no stale-DB-read hazard.)
- **Blast radius**: Very low in practice (no further mutations occur before method return).
- **Mitigation**: Optional `TransactionSynchronizationManager.registerSynchronization(... afterCommit ...)` or `@TransactionalEventListener(phase = AFTER_COMMIT)` in future refactoring.

### Stress Test Results

- **Jackson 3 constructor deserialization with whitespace + mixed-case email** → trims in constructor & setters (`EsqueciSenhaRequestDTO`, `RedefinirSenhaRequestDTO`) before Bean Validation → **pass** (`AuthControllerTest.java:300-334`).
- **Expired token probed with wrong code** → returns `CodigoInvalidoException` (`400 Código Inválido`) instead of leaking `CodigoExpiradoException` → **pass** (`AuthControllerTest.java:512-521`, `AuthServiceTest.java:125-133`).
- **Concurrent / repeated consumption (`consumirTokenAtomicamente == 0`)** → throws `CodigoInvalidoException` and skips password update → **pass** (`AuthServiceTest.java:145-155`, `AuthControllerTest.java:538-572`).
- **XSS payload in user `nome` (`<script>alert(1)</script>`)** → escaped to `&lt;script&gt;` in email HTML → **pass** (`EmailServiceTest.java:33-54`).
- **Invalid/expired `Authorization: Bearer ...` header on `/api/auth/redefinir-senha`** → `JwtAuthInterceptor` permits `/api/auth/**` regardless of stale client JWT → **pass** (`AuthControllerTest.java:595-628`).

### Unchallenged Areas

- Frontend R1 implementation (`Froravel-Front/apps/landing/**`) — outside backend review scope.

---

## 1. Observation

### 1.1 Files Inspected
- **Created in `modules/auth/**`**:
  - `src/main/java/br/com/floravel/floravel/modules/auth/model/TokenRecuperacaoSenha.java` (lines 1–46)
  - `src/main/java/br/com/floravel/floravel/modules/auth/repository/TokenRecuperacaoSenhaRepository.java` (lines 1–28)
  - `src/main/java/br/com/floravel/floravel/modules/auth/dto/EsqueciSenhaRequestDTO.java` (lines 1–25)
  - `src/main/java/br/com/floravel/floravel/modules/auth/dto/EsqueciSenhaResponseDTO.java` (lines 1–15)
  - `src/main/java/br/com/floravel/floravel/modules/auth/dto/RedefinirSenhaRequestDTO.java` (lines 1–41)
  - `src/main/java/br/com/floravel/floravel/modules/auth/dto/RedefinirSenhaResponseDTO.java` (lines 1–15)
  - `src/test/java/br/com/floravel/floravel/modules/auth/service/AuthServiceTest.java` (lines 1–196)
  - `src/test/java/br/com/floravel/floravel/modules/auth/service/EmailServiceTest.java` (lines 1–89)
- **Modified in `modules/auth/**`**:
  - `src/main/java/br/com/floravel/floravel/modules/auth/controller/AuthController.java` (lines 1–74)
  - `src/main/java/br/com/floravel/floravel/modules/auth/service/AuthService.java` (lines 1–310)
  - `src/main/java/br/com/floravel/floravel/modules/auth/service/EmailService.java` (lines 1–268)
  - `src/test/java/br/com/floravel/floravel/modules/auth/controller/AuthControllerTest.java` (lines 1–630)
- **Supporting context inspected**:
  - `GlobalExceptionHandler.java`, `JwtAuthInterceptor.java`, `SecurityBeansConfig.java`, `FloravelApplication.java`, `Usuario.java`, `UsuarioRepository.java`, `MaeService.java`, `PsicologoService.java`, `DemoDayDataSeeder.java`, `MaeControllerTest.java`, `application.properties`, `pom.xml`.

### 1.2 Independent Test & Scan Results
- **Command**: `.\mvnw.cmd clean test` (Cwd: `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel`)
  - **Exit Code**: `0` (`BUILD SUCCESS`, Time: `01:21 min`)
  - **Totals**: `Tests run: 64, Failures: 0, Errors: 0, Skipped: 0`
  - **Auth suite breakdown**:
    - `AuthControllerTest`: `Tests run: 14, Failures: 0, Errors: 0, Skipped: 0`
    - `AuthServiceTest`: `Tests run: 3, Failures: 0, Errors: 0, Skipped: 0`
    - `EmailServiceTest`: `Tests run: 3, Failures: 0, Errors: 0, Skipped: 0`
    - All 13 other test classes (`FloravelApplicationTests`, `AgendamentoServiceTest`, `DenunciaServiceTest`, `FeedbackServiceTest`, `MaeControllerTest`, `OnboardingServiceTest`, `PagamentoServiceTest`, `PsicologoPersistenciaAndSecurityTest`, `PsicologoServiceTest`, `RhCorporativoServiceTest`, `RodaDeConversaServiceTest`, `CalculadoraRiscoEdimburgoTest`, `ValidacaoGovernoTest`) passed with 0 failures/errors.
- **Secrets Scan (`grep_search`)**:
  - Regex `(AIza|AKIA|sk_live|sk_test|apps\.googleusercontent\.com|FALLBACK_DEV_SECRET|client_secret|clientSecret|floravel_mail_pass|password\s*=|secret\s*=)` on `modules/auth` -> `No results found`.

---

## 2. Logic Chain

1. `TokenRecuperacaoSenha` persists `codigoHash` (`VARCHAR(100)`) and `dataExpiracao` (`LocalDateTime`) with `usado = false`. `AuthService.solicitarRecuperacaoSenha` normalizes email, invalidates prior unused tokens, generates a 6-digit `SecureRandom` code, encodes it with `BCryptPasswordEncoder`, saves the token with `+15` minutes TTL, and dispatches `EmailService.enviarCodigoRecuperacaoSenha` (`@Async`), always returning `EsqueciSenhaResponseDTO(mensagem, email, 15)` -> satisfies F1, anti-enumeration, and BCrypt/TTL requirements.
2. `AuthService.redefinirSenha` loads the newest unused token (`OrderByDataCriacaoDescIdDesc`), checks `passwordEncoder.matches` *before* `token.isExpirado()`, executes `consumirTokenAtomicamente(id)` expecting `1` updated row (`clearAutomatically = true, flushAutomatically = true`), reloads `Usuario`, updates `senha` with BCrypt, and sweeps remaining unused tokens -> satisfies F2, atomic single-use, and prevents expired-code oracle.
3. `AuthService.confirmarEmail` checks `usuario.getEmailVerificado()` early and only invokes `@Async EmailService.enviarEmailBoasVindas` when transitioning `false -> true`. `EmailService` escapes `nome` and `codigo` via `HtmlUtils.htmlEscape` and avoids logging plaintext OTPs on normal `INFO` entry logs -> satisfies F3 and XSS/log hygiene.
4. `GlobalExceptionHandler` maps `CodigoInvalidoException`, `CodigoExpiradoException`, and `MethodArgumentNotValidException` to `400 Bad Request` (`ErrorResponseDTO`), `JwtAuthInterceptor` permits `/api/auth/**`, and `.\mvnw.cmd clean test` passes all 64 tests -> confirms full integration correctness.

---

## 3. Caveats

1. **Scope limited to Backend M1 (`modules/auth/**`)**: Frontend M1 (`Froravel-Front/apps/landing/**` and root `package.json`) was not reviewed here.
2. **Non-blocking operational notes**: Lack of per-email OTP failure lockout, BCrypt timing difference on `esqueci-senha`, and pre-commit `@Async` queuing (see Challenges 1–3 above) are Low-severity observations and do not violate R1 or `PROJECT.md`.

---

## 4. Conclusion

**Verdict: `APPROVE`**

Backend Milestone M1 (`modules/auth/**`) is complete, secure, compliant with R1 and `PROJECT.md § Interface Contracts`, and passes all 64 backend tests cleanly (`.\mvnw.cmd clean test`). Ready to proceed.

---

## 5. Verification Method

1. Run `.\mvnw.cmd clean test` in `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel` and verify `Tests run: 64, Failures: 0, Errors: 0, Skipped: 0`.
2. Inspect `AuthController.java`, `AuthService.java`, `EmailService.java`, `TokenRecuperacaoSenha.java`, `TokenRecuperacaoSenhaRepository.java`, `EsqueciSenhaRequestDTO.java`, `RedefinirSenhaRequestDTO.java`, and `AuthControllerTest.java`.
3. **Invalidation Conditions**: Any test failure in `.\mvnw.cmd clean test`, any `422` response instead of `400` on invalid/expired reset codes, any plaintext reset code persisted in `tokens_recuperacao_senha`, or any hardcoded secret in `modules/auth/**` would invalidate this approval.
