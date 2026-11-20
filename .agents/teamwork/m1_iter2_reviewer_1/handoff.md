# Handoff Report — M1 Iteration 2 Backend Review (`m1_iter2_reviewer_1`)

**Handoff Type**: Hard  
**Milestone**: M1, Iteration 2 (Backend R1 Remediation — `modules/auth/**`)  
**Verdict**: **`APPROVE`**

---

## Review Summary

**Verdict**: `APPROVE`

All M1 Iteration 2 backend remediation items in `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel` (`RedefinirSenhaRequestDTO.java`, `EmailService.java`, `AuthService.java`, `AuthControllerTest.java`, `EmailServiceTest.java`) completely address `m1_challenger_1`'s rejection findings and comply with `PROJECT.md § Interface Contracts`. Isolated execution of `.\mvnw.cmd clean test` passed **69/69 tests (0 failures, 0 errors, 0 skipped)** in `49.422 s` (`BUILD SUCCESS`), with zero hardcoded secrets and no integrity violations.

### Findings

No Critical, Major, or Minor blocking defects found.

### Verified Claims

- **`RedefinirSenhaRequestDTO.java` 72-char & 72-byte UTF-8 validation (`@Size` + `@JsonIgnore @AssertTrue`)** → verified via direct inspection (`RedefinirSenhaRequestDTO.java:28-35`) and full-MVC `MockMvcBuilders.webAppContextSetup` tests (`AuthControllerTest.java:630-744`) → **pass**.
- **`AuthService.autenticar` 72-byte password guard** → verified via direct inspection (`AuthService.java:215-217`) and `AuthControllerTest.java:746-769` (`422 Unprocessable Entity` on `"P".repeat(72) + "extra"` and `"P".repeat(80)`) → **pass**.
- **`EmailService` null/blank hardening** → verified via direct inspection (`EmailService.java:29, 63-66, 164, 215`) and `EmailServiceTest.java:74-98` (both `mailSender == null` and mocked `JavaMailSender` with `verify(mailSender, never()).send(...)`) → **pass**.
- **All 5 new regression tests execute real Spring MVC / Hibernate / BCrypt / Mockito logic** → verified via inspection of `AuthControllerTest.java:630-769` (4 tests) and `EmailServiceTest.java:74-98` (1 test) + Surefire reports (`AuthControllerTest`: 18, `AuthServiceTest`: 3, `EmailServiceTest`: 4) → **pass**.
- **Full backend test suite (`.\mvnw.cmd clean test`)** → verified via isolated execution (`task-64`) → **pass (`Tests run: 69, Failures: 0, Errors: 0, Skipped: 0`)**.
- **Hardcoded secrets scan across `modules/auth`** → verified via `grep_search` → **pass (0 matches)**.

### Coverage Gaps

- **Frontend M1 Iteration 2 (`apps/landing/**`)** — outside this backend-scoped reviewer dispatch.
- **Registration DTOs outside `modules/auth/**`** (`CadastroMaeRequestDTO`, `CadastroPsicologoRequestDTO`) — out of M1 scope (see Caveats).

### Unverified Items

- None within `modules/auth/**` scope.

---

## Challenge Summary (Adversarial Review)

**Overall risk assessment**: `LOW`

### Challenges

#### [Low] Challenge 1 — Service-layer `redefinirSenha` assumes controller `@Valid` enforcement
- **Assumption challenged**: Callers of `AuthService.redefinirSenha(RedefinirSenhaRequestDTO)` always enter via `AuthController` (`@Valid @RequestBody`).
- **Attack scenario**: If internal Java code constructs `RedefinirSenhaRequestDTO` with a >72-byte `novaSenha` and calls `AuthService.redefinirSenha(dto)` directly without Bean Validation, `passwordEncoder.encode(dto.getNovaSenha())` (`AuthService.java:195`) would still throw `IllegalArgumentException`.
- **Blast radius**: Low — `AuthService.redefinirSenha` is only invoked by `AuthController.redefinirSenha` (`AuthController.java:69-72`), which enforces `@Valid`.
- **Mitigation**: Optional future defense-in-depth byte-length check in `AuthService.redefinirSenha` if service-to-service callers are introduced.

#### [Low] Challenge 2 — Shared `floraveldb` contention under concurrent Maven runs
- **Assumption challenged**: Multiple agents or test runners can run `.\mvnw.cmd test` concurrently on the same host.
- **Attack scenario**: Observed empirically during our initial `task-18` run when peer Maven processes ran simultaneously against `floraveldb`: `limparBanco()` hit `ObjectOptimisticLockingFailureException` and MySQL FK `DataIntegrityViolationException`.
- **Blast radius**: Test-runner flakiness only (not a production defect), when two surefire JVMs share the same local MySQL schema simultaneously.
- **Mitigation**: Serialize Maven test runs against `floraveldb` (or isolate per-run schemas in CI).

### Stress Test Results

- **Exact 72-byte ASCII boundary on reset + login** → `POST /api/auth/redefinir-senha` (`200 OK`) followed by `POST /api/auth/login` (`200 OK`, non-empty `tokenSessao`) → **pass** (`AuthControllerTest.java:630-669`).
- **73-byte and 80-byte ASCII `novaSenha` on reset** → `400 Dados Inválidos`, `validationErrors.novaSenha` present, token `usado == false` preserved → **pass** (`AuthControllerTest.java:671-707`).
- **40-char / 80-byte UTF-8 multibyte (`"é".repeat(40)`) `novaSenha` on reset** → `@Size(max=72)` passes char count, `@AssertTrue isNovaSenhaDentroDoLimiteBytes()` catches byte overflow -> `400 Dados Inválidos`, `validationErrors.novaSenhaDentroDoLimiteBytes` present, token `usado == false` → **pass** (`AuthControllerTest.java:709-744`).
- **Jackson 3 serialization/deserialization with `@AssertTrue` getter** → `@JsonIgnore` on `isNovaSenhaDentroDoLimiteBytes()` prevents `objectMapper.writeValueAsString` / MVC binding interference → **pass** (`AuthControllerTest.java:653-736`).
- **BCrypt >72-byte login truncation / exception probe** → `"P".repeat(72) + "extra"` and `"P".repeat(80)` against stored 72-byte hash return `422 Unprocessable Entity` → **pass** (`AuthControllerTest.java:746-769`).
- **Null/blank `EmailService` arguments (`destinatario`, `nome`, `codigo`)** → short-circuits cleanly to `devFallback` without invoking `HtmlUtils.htmlEscape(null)` or `mailSender.send(...)` → **pass** (`EmailServiceTest.java:74-98`).

### Unchallenged Areas

- Frontend R1 remediation (`apps/landing/**`) — out of dispatch scope.

---

## 1. Observation

- **`RedefinirSenhaRequestDTO.java:27-35`**:
  - `novaSenha` annotated with `@NotBlank` and `@Size(min = 6, max = 72, message = "A nova senha deve conter entre 6 e 72 caracteres.")`.
  - Method `isNovaSenhaDentroDoLimiteBytes()` annotated with `@JsonIgnore` and `@AssertTrue(message = "A nova senha deve ter no máximo 72 bytes.")`, returning `novaSenha == null || novaSenha.getBytes(StandardCharsets.UTF_8).length <= 72`.
- **`AuthService.java:36, 215-217`**:
  - `autenticar(LoginRequestDTO dto)` guards `passwordEncoder.matches(...)` with `dto.getSenha() != null && dto.getSenha().getBytes(StandardCharsets.UTF_8).length <= 72`.
  - All other `passwordEncoder` usages in `modules/auth` (`AuthService.java:154` 6-digit OTP, `179` 6-digit OTP match, `195` DTO-validated `novaSenha`, `255` `"OAUTH2_" + UUID`) are bounded `<= 72` bytes.
- **`EmailService.java:29, 62-66, 164, 215`**:
  - Null-guards `codigo` in subject (`codigo != null ? codigo : ""`) and both HTML templates (`codigo != null ? HtmlUtils.htmlEscape(codigo) : ""`).
  - Short-circuits `enviarEmailHtml` when `mailSender == null || destinatario == null || destinatario.isBlank()` to execute `devFallback.run()` directly.
- **`AuthControllerTest.java:630-769`** & **`EmailServiceTest.java:74-98`**:
  - 4 integration tests (`webAppContextSetup`) in `AuthControllerTest` + 1 unit test in `EmailServiceTest`.
- **Secrets Scan (`grep_search`)**:
  - Regex `(AIza|AKIA|sk_live|sk_test|apps\.googleusercontent\.com|FALLBACK_DEV_SECRET|client_secret|clientSecret|floravel_mail_pass|password\s*=|secret\s*=)` on `src/main/java/.../modules/auth` -> `No results found`.
- **Isolated Maven Execution (`task-64`)**:
  - Command: `.\mvnw.cmd clean test` in `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel` (after confirming zero peer Maven/Java processes and no ephemeral `Adversarial*` source files).
  - Result: Exit code `0`, `Tests run: 69, Failures: 0, Errors: 0, Skipped: 0`, `BUILD SUCCESS` in `49.422 s`.
  - Surefire breakdown: `AuthControllerTest` (`18/18`), `AuthServiceTest` (`3/3`), `EmailServiceTest` (`4/4`), all remaining backend suites (`44/44`).

## 2. Logic Chain

1. `RedefinirSenhaRequestDTO` enforces `6..72` characters via `@Size` and `<= 72` UTF-8 bytes via `@JsonIgnore @AssertTrue isNovaSenhaDentroDoLimiteBytes()`, so `GlobalExceptionHandler.handleValidationErrors` returns HTTP `400 Dados Inválidos` with `validationErrors` before `AuthService.redefinirSenha` invokes `BCryptPasswordEncoder.encode` — eliminating the HTTP `500` reproduced by `m1_challenger_1`.
2. `AuthService.autenticar` enforces `dto.getSenha().getBytes(StandardCharsets.UTF_8).length <= 72` prior to `passwordEncoder.matches`, preventing BCrypt 72-byte `IllegalArgumentException` or silent prefix truncation on `/api/auth/login` while preserving HTTP `422`.
3. `EmailService` guards `codigo` before `HtmlUtils.htmlEscape` and short-circuits null/blank `destinatario` before `MimeMessageHelper` construction, resolving `m1_challenger_1`'s null-`codigo` finding.
4. Isolated execution of `.\mvnw.cmd clean test` passes all 69/69 tests (including all 5 new regression tests), confirming end-to-end correctness without regressions.

## 3. Caveats

- Registration DTOs outside `modules/auth/**` (`CadastroMaeRequestDTO`, `CadastroPsicologoRequestDTO`) still use `@Size(min = 6, max = 100)` as noted by `m1_challenger_1` and `m1_iter2_worker_1`; left untouched per M1 write-ownership boundaries.
- Initial `task-18` test run failed solely due to concurrent Maven runs by peer agents against shared `floraveldb`; isolated re-run `task-64` passed 69/69 cleanly.

## 4. Conclusion

**Verdict: `APPROVE`**

M1 Iteration 2 Backend Remediation (`modules/auth/**`) resolves all findings from `m1_challenger_1`, adheres to `PROJECT.md`, contains zero secrets or integrity violations, and passes 69/69 backend tests cleanly.

## 5. Verification Method

1. Run `.\mvnw.cmd clean test` (with no concurrent processes accessing `floraveldb`) in `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel` -> verify `Tests run: 69, Failures: 0, Errors: 0, Skipped: 0` (`BUILD SUCCESS`).
2. Inspect `RedefinirSenhaRequestDTO.java`, `EmailService.java`, `AuthService.java`, `AuthControllerTest.java:630-769`, and `EmailServiceTest.java:74-98`.
3. **Invalidation conditions**: Any failure in the 69 tests, any `500` on `POST /api/auth/redefinir-senha` or `POST /api/auth/login` with >72-byte passwords, or any hardcoded credential in `modules/auth/**`.
