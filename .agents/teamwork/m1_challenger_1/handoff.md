# Handoff Report — M1 Adversarial Challenger (`m1_challenger_1`)

**Handoff Type**: Hard  
**Milestone**: M1 (Backend R1 — `modules/auth/**`, Iteration 1)  
**Verdict**: **`REJECT`**

---

## 1. Observation

### 1.1 Baseline Test Suite & Test Inspection
- Executed `.\mvnw.cmd test` in `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel`:
  - **Result**: `Tests run: 64, Failures: 0, Errors: 0, Skipped: 0` (`BUILD SUCCESS`, exit code 0).
- Inspected existing M1 test suites:
  - `src/test/java/br/com/floravel/floravel/modules/auth/controller/AuthControllerTest.java` (lines 47–630): Uses `@SpringBootTest`, real MySQL (`floraveldb`), real `PasswordEncoder`, real `TokenRecuperacaoSenhaRepository`, and `@MockitoSpyBean EmailService` (real `EmailService` execution with Mockito verification of `@Async` calls). Covers known/unknown email, whitespace/uppercase DTO normalization, sequential invalidation, reset + old password 422 / new password 200 JWT login, wrong code 400, expired token (wrong code -> `Código Inválido`, right code -> `Código Expirado`), token reuse, Bean Validation 400s, `webAppContextSetup` + `JwtAuthInterceptor` public access with invalid Bearer header, and welcome email idempotency.
  - `src/test/java/br/com/floravel/floravel/modules/auth/service/AuthServiceTest.java` (lines 40–196): Uses `BCryptPasswordEncoder` delegate for real hashing, verifies `InOrder` invalidation -> save -> email, 15-min TTL, hash-before-expiration, `consumirTokenAtomicamente == 0` concurrency failure, and welcome email only on `false -> true`.
  - `src/test/java/br/com/floravel/floravel/modules/auth/service/EmailServiceTest.java` (lines 16–89): Tests real `EmailService` with `mailSender == null`, real `MimeMessage` with `HtmlUtils.htmlEscape` XSS escaping (`&lt;script&gt;`), and `MailSendException` resilience.

### 1.2 Empirical Adversarial Probes (`AdversarialM1AuthTest`, ephemeral, subsequently deleted)
Ran two ephemeral `.\mvnw.cmd test -Dtest=AdversarialM1AuthTest` runs against real `@SpringBootTest` + MySQL + `MockMvcBuilders.webAppContextSetup(webApplicationContext)`:

1. **BUG REPRODUCED — HTTP 500 on `POST /api/auth/redefinir-senha` with valid 73–100 char password**:
   - `RedefinirSenhaRequestDTO.java:24` declares:
     `@Size(min = 6, max = 100, message = "A nova senha deve conter no mínimo 6 caracteres.")`
   - `AuthService.java:194` calls:
     `usuario.setSenha(passwordEncoder.encode(dto.getNovaSenha()));`
   - `SecurityBeansConfig.java:13` provides `new BCryptPasswordEncoder()` (Spring Security 7 in Spring Boot 4.1.2).
   - Direct call `passwordEncoder.encode("P".repeat(73))` threw:
     `java.lang.IllegalArgumentException: password cannot be more than 72 bytes`
   - Full `webAppContextSetup` HTTP `POST /api/auth/redefinir-senha` with an 80-character `novaSenha` (`"P".repeat(80)`) and valid email + valid 6-digit OTP returned **HTTP 500**:
     `PROBE_80CHAR_STATUS=500 BODY={"timestamp":"2026-11-19 22:01:40","status":500,"error":"Erro Interno","message":"Ocorreu um erro inesperado no servidor. Nossa equipe técnica já foi alertada.","path":"/api/auth/redefinir-senha"}`
     (`GlobalExceptionHandler.java` has no handler for `IllegalArgumentException`, so it falls through to `@ExceptionHandler(Exception.class)` at line 139.)
   - Note: Because `redefinirSenha` is `@Transactional`, the transaction rolled back so the token remained usable immediately afterwards with a 72-char password (`"P".repeat(72)` -> `200 OK` and `RH` login succeeded).

2. **Minor Edge Case Observed — `EmailService` `codigo == null` pre-try/catch failure**:
   - `EmailService.java:164` (`gerarTemplateEmailHtml`) and `EmailService.java:215` (`gerarTemplateRecuperacaoSenhaHtml`) call `HtmlUtils.htmlEscape(codigo)` before `enviarEmailHtml(...)`'s `try/catch`.
   - Calling `emailService.enviarCodigoRecuperacaoSenha(null, null, null)` threw:
     `java.lang.IllegalArgumentException: Input is required` at `EmailService.gerarTemplateRecuperacaoSenhaHtml(EmailService.java:215)`.
   - Calling with non-null `codigo` (`"123456"`) and `destinatario == null`, `nome == null`, `mailSender == null`, `createMimeMessage()` throwing `RuntimeException`, or `send()` throwing `MailSendException` all succeeded without throwing.

3. **All Other Probed Attack Vectors Passed Empirically**:
   - **Concurrent Atomic Single-Use**: 8 threads synchronized via `CyclicBarrier` executing `POST /api/auth/redefinir-senha` simultaneously on real MySQL -> exactly **1** `200 OK`, **7** `400 Bad Request`, **0** exceptions/500s, 0 active tokens left.
   - **BCrypt Storage**: `TokenRecuperacaoSenha.codigoHash` (`VARCHAR(100)`) stores 60-char `$2a$10$...` hash; `passwordEncoder.matches(codigo, hash)` is `true`.
   - **Full MVC Jackson 3 Deserialization**: `webAppContextSetup` properly trimmed `"  JACKSON.Space@Floravel.COM  "` and `" <code> "` to valid requests (`200 OK`), and rejected `"   "`, `{}`, `" 12345 "`, `"      "`, and 101-char passwords with `400`.
   - **Expired Token vs Wrong Code**: Expired token (`now - 1s`) + wrong code -> `400 "Código Inválido"`; expired token + right code -> `400 "Código Expirado"`.
   - **Sequential `esqueci-senha` Invalidation**: 3 sequential requests left 1 active token in DB; codes 1 & 2 failed (`400 "Código Inválido"`), code 3 succeeded.
   - **Anti-Enumeration**: `esqueci-senha` for unknown vs known email returned identical `200 OK` (`mensagem`, `expiracaoMinutos: 15`) with 0 tokens created; `redefinir-senha` on unknown email returned `400 "Código Inválido"`.
   - **Welcome Email Idempotency**: Wrong code -> 0 calls; first valid confirmation -> 1 call; second confirmation -> still 1 call.
   - **`JwtAuthInterceptor`**: `GET /api/maes` without token -> `401` (proving interceptor active), while `POST /api/auth/esqueci-senha` and `POST /api/auth/redefinir-senha` succeeded even with `Authorization: Bearer invalid-token-should-still-be-public`.

---

## 2. Logic Chain

1. `RedefinirSenhaRequestDTO.java:24` explicitly advertises `@Size(min = 6, max = 100)` for `novaSenha`, so callers (including password managers or users entering 73–100 char passwords, or 37–100 multi-byte UTF-8 accented/emoji passwords whose UTF-8 encoding exceeds 72 bytes) legitimately pass Spring Bean Validation.
2. Spring Security 7's `BCryptPasswordEncoder` enforces BCrypt's 72-byte input cap by throwing `IllegalArgumentException("password cannot be more than 72 bytes")` inside `AuthService.redefinirSenha` (`AuthService.java:194`).
3. Because neither `RedefinirSenhaRequestDTO` nor `AuthService` validates the 72-byte limit and `GlobalExceptionHandler` does not map `IllegalArgumentException`, any valid 73–100 char (or >72 UTF-8 byte) password causes an unhandled **HTTP 500 Internal Server Error** on `POST /api/auth/redefinir-senha`.
4. Under adversarial acceptance criteria, a reproducible HTTP 500 on valid DTO-accepted input in a newly added M1 endpoint warrants **`REJECT`** so M1 fixes the validation contract before proceeding.

---

## 3. Caveats

- `EmailService` `codigo == null` throws `IllegalArgumentException` in `HtmlUtils.htmlEscape(codigo)`, though all callers in `AuthService` pass `String.format("%06d", ...)` (non-null 6-digit string). Still easy to harden with `(codigo != null ? HtmlUtils.htmlEscape(codigo) : "")`.
- `AuthService.autenticar` (`LoginRequestDTO`) and `MaeService` registration were outside M1's new R1 endpoints and were not stress-tested for >72-byte passwords; note that `BCryptPasswordEncoder.matches` in Spring Security 7 may exhibit similar behavior if registration DTOs also use `max > 72`.
- Frontend R1 (`apps/landing/**`) was not tested by this agent (this dispatch scoped `modules/auth/**`).
- Ephemeral `AdversarialM1AuthTest.java` was removed cleanly after verification (`floravel-backend/Floravel` has no leftover test files from this agent).

---

## 4. Conclusion

**Verdict: `REJECT`**

M1 Backend (`modules/auth/**`) has strong security fundamentals (atomic single-use under 8-thread concurrency, BCrypt OTP hashing, hash-before-expiration ordering, anti-enumeration, sequential invalidation, Jackson 3 constructor trimming, welcome email `false -> true` idempotency, and `JwtAuthInterceptor` public route permitting), **but fails adversarial verification on a reproducible HTTP 500 bug**:

- **Required Fix (M1 Iteration 2)**:
  1. In `RedefinirSenhaRequestDTO.java`, align `@Size(min = 6, max = 72, ...)` AND add UTF-8 byte-length validation (`<= 72` bytes, e.g. via `@AssertTrue(message = "A nova senha deve ter no máximo 72 bytes.")` checking `novaSenha == null || novaSenha.getBytes(StandardCharsets.UTF_8).length <= 72`) so both ASCII >72 chars and multi-byte UTF-8 >72-byte passwords return `400 Bad Request` (`Dados Inválidos`) rather than `500 Internal Server Error`.
  2. Add a regression test in `AuthControllerTest` verifying `POST /api/auth/redefinir-senha` with a 72-char password returns `200 OK` and a 73-char / >72-byte UTF-8 password returns `400 Bad Request` (not `500`).
  3. *(Optional low-severity hardening)* Null-guard `codigo` in `EmailService.gerarTemplateEmailHtml` and `EmailService.gerarTemplateRecuperacaoSenhaHtml`.

---

## 5. Verification Method

1. **Reproduce baseline**: Run `.\mvnw.cmd test` in `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel` -> baseline passes 64/64.
2. **Reproduce the HTTP 500 defect**: Send `POST /api/auth/redefinir-senha` with a valid email, valid 6-digit OTP, and `"novaSenha": "P".repeat(80)` (80 chars, within `@Size(min = 6, max = 100)`).
   - **Current defective behavior**: Returns HTTP `500` (`"error": "Erro Interno"`).
   - **Expected fixed behavior**: Returns HTTP `400` (`"error": "Dados Inválidos"`) for >72-byte passwords and `200 OK` for `6..72`-byte passwords.
3. **Invalidation conditions**: Once `RedefinirSenhaRequestDTO` rejects >72-byte passwords with HTTP `400` and a test in `AuthControllerTest` verifies both the 72-byte boundary (`200`) and >72-byte rejection (`400`, including multi-byte UTF-8), this rejection is resolved.
