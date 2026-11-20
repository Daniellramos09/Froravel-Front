# Handoff Report — M1 Iteration 2 Adversarial Challenger (`m1_iter2_challenger_1`)

**Handoff Type**: Hard  
**Milestone**: M1, Iteration 2 (Backend R1 Remediation — `modules/auth/**`)  
**Verdict**: **`APPROVE`**

---

## 1. Observation

### 1.1 Static Code Inspection
Inspected the modified backend files in `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel`:
- `src/main/java/br/com/floravel/floravel/modules/auth/dto/RedefinirSenhaRequestDTO.java`:
  - Line 28: `@Size(min = 6, max = 72, message = "A nova senha deve conter entre 6 e 72 caracteres.")`
  - Lines 31–35: `@JsonIgnore @AssertTrue(message = "A nova senha deve ter no máximo 72 bytes.") public boolean isNovaSenhaDentroDoLimiteBytes()` returns `novaSenha == null || novaSenha.getBytes(StandardCharsets.UTF_8).length <= 72`.
  - Lines 37–49: Constructor and setters trim `email` and `codigo` while preserving exact `novaSenha` whitespace/bytes.
- `src/main/java/br/com/floravel/floravel/modules/auth/service/AuthService.java`:
  - Line 195: `usuario.setSenha(passwordEncoder.encode(dto.getNovaSenha()));`
  - Lines 215–217 (`autenticar`): `boolean senhaValida = dto.getSenha() != null && dto.getSenha().getBytes(StandardCharsets.UTF_8).length <= 72 && passwordEncoder.matches(dto.getSenha(), usuario.getSenha());`
- `src/main/java/br/com/floravel/floravel/modules/auth/service/EmailService.java`:
  - Line 29: `"🌸 Florável - Seu código de confirmação: " + (codigo != null ? codigo : "")`
  - Lines 62–66 (`enviarEmailHtml`): `if (mailSender == null || destinatario == null || destinatario.isBlank()) { devFallback.run(); return; }`
  - Line 164 (`gerarTemplateEmailHtml`) and line 215 (`gerarTemplateRecuperacaoSenhaHtml`): `codigo != null ? HtmlUtils.htmlEscape(codigo) : ""`.
- `src/main/java/br/com/floravel/floravel/shared/exception/GlobalExceptionHandler.java:62-79`:
  - `MethodArgumentNotValidException` collects `ex.getBindingResult().getFieldErrors()` into `ErrorResponseDTO` (`status = 400`, `error = "Dados Inválidos"`, `validationErrors`).
- `src/test/java/br/com/floravel/floravel/modules/auth/controller/AuthControllerTest.java:630-769` & `EmailServiceTest.java:74-98`:
  - Contain the 5 regression tests added in Iteration 2.

### 1.2 M1 Backend Test Execution (No `clean`)
Executed in `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel`:
- Command: `.\mvnw.cmd test "-Dtest=AuthControllerTest,AuthServiceTest,EmailServiceTest"`
  - **Run 1** (`task-27`): Exited `1` due to concurrent `floraveldb` cleanup interference from parallel agents (`DataIntegrityViolation` FK constraint on `tokens_recuperacao_senha` / missing rows).
  - **Run 2** (`task-36`, retry): Exited `0` — **`Tests run: 25, Failures: 0, Errors: 0, Skipped: 0`** (`BUILD SUCCESS` in 49.142 s).

### 1.3 Empirical Adversarial Probes (`AdversarialM1Iter2AuthTest`, ephemeral, cleanly deleted)
Wrote and ran an isolated `@SpringBootTest` + `MockMvcBuilders.webAppContextSetup(webApplicationContext)` test class using UUID-scoped test records (no `deleteAll()`) via `.\mvnw.cmd test "-Dtest=AdversarialM1Iter2AuthTest"` (`task-44`):
- **Result**: **`Tests run: 4, Failures: 0, Errors: 0, Skipped: 0`**, **`BUILD SUCCESS`** (exit code `0`).
- **Exact 72-byte boundary (`200 OK` reset + `200 OK` login with `tokenSessao`)**:
  - `"P".repeat(72)` (72 chars, 72 UTF-8 bytes) -> reset `200`, login `200`
  - `"é".repeat(36)` (36 chars, 72 UTF-8 bytes) -> reset `200`, login `200`
  - `"P".repeat(70) + "é"` (71 chars, 72 UTF-8 bytes) -> reset `200`, login `200`
  - `"🌸".repeat(18)` (36 UTF-16 chars, 72 UTF-8 bytes) -> reset `200`, login `200`
  - `objectMapper.writeValueAsString(...)` confirmed `"novaSenhaDentroDoLimiteBytes"` is NOT serialized (`@JsonIgnore`).
- **>72-byte rejection & bypass resistance (`400 Dados Inválidos`, NOT `500`, token stays `usado == false`)**:
  - `"P".repeat(73)` (73 bytes) -> `400`
  - `"é".repeat(37)` (37 chars, 74 bytes) -> `400`
  - `"é".repeat(40)` (40 chars, 80 bytes) -> `400`
  - `"P".repeat(71) + "é"` (72 chars, 73 bytes) -> `400`
  - `"🌸".repeat(19)` (38 UTF-16 chars, 76 bytes) -> `400`
  - `" " + "P".repeat(72)` (73 chars, untrimmed) -> `400`
  - JSON injection bypass attempt `{"email":..., "codigo":"654321", "novaSenha":"<é*40>", "novaSenhaDentroDoLimiteBytes":true}` -> still rejected with `400 Dados Inválidos` (token remained `usado == false`).
- **Login >72-byte non-truncation (`422 Unprocessable Entity`)**:
  - Stored `"P".repeat(72)`: login attempts with `"P".repeat(72) + "extra"`, `"P".repeat(72) + " "`, `"P".repeat(72) + "\0"`, and `"P".repeat(80)` -> all returned `422` (no BCrypt truncation match, no `500`).
  - Stored `"é".repeat(36)` (72 UTF-8 bytes): login attempts with `"é".repeat(36) + "x"` and `"é".repeat(40)` -> returned `422`; exact `"é".repeat(36)` -> returned `200` with `tokenSessao`.
- **`EmailService` null & adversarial safety**:
  - `enviarCodigoConfirmacao`, `enviarCodigoRecuperacaoSenha`, `enviarEmailBoasVindas` called with `(null, null, null)`, `("", "   ", "")`, `("   ", "%s%n<script>", "%s123")`, and `("bad\r\nemail", "Ana %s", null)` with both `mailSender == null` and mocked `JavaMailSender` (`remetente = null`) -> zero exceptions thrown, safe fallback logs emitted.

---

## 2. Challenge Report

**Overall risk assessment**: **LOW** (for `modules/auth/**` R1 remediation)

| Hypothesis / Attack Vector | Expected | Empirical Result | Status |
|---|---|---|---|
| Exact 72-byte ASCII & multi-byte UTF-8 (`"P".repeat(72)`, `"é".repeat(36)`, `"🌸".repeat(18)`) | `200 OK` reset + `200 OK` login | `200 OK` reset + `200 OK` login (`tokenSessao` issued) | PASS |
| 73-byte ASCII (`"P".repeat(73)`) & untrimmed space (`" " + "P".repeat(72)`) | `400 Dados Inválidos` | `400 Dados Inválidos`, token `usado == false` | PASS |
| >72-byte multi-byte UTF-8 (`"é".repeat(37)`, `"é".repeat(40)`, `"P".repeat(71)+"é"`, `"🌸".repeat(19)`) | `400 Dados Inválidos` (NOT `500`) | `400 Dados Inválidos`, token `usado == false` | PASS |
| JSON `@AssertTrue` property override (`"novaSenhaDentroDoLimiteBytes":true`) | `400 Dados Inválidos` (`@JsonIgnore` blocks override) | `400 Dados Inválidos` | PASS |
| Login >72-byte BCrypt truncation bypass (`"P".repeat(72)+"extra"`, `+\0`, `"é".repeat(36)+"x"`) | `422` | `422` across all >72-byte variants; `200` for exact 72 bytes | PASS |
| `EmailService` null/blank/`%s%n`/XSS/bad recipient safety | 0 exceptions | `assertDoesNotThrow` passed across all cases | PASS |

---

## 3. Logic Chain

1. `RedefinirSenhaRequestDTO` combines `@Size(min = 6, max = 72)` with `@JsonIgnore @AssertTrue isNovaSenhaDentroDoLimiteBytes()` (`Obs 1.1`), which rejects both >72-char ASCII and <=72-char / >72-byte UTF-8 inputs at Bean Validation time via `MethodArgumentNotValidException` (`400 Dados Inválidos`), preventing `BCryptPasswordEncoder.encode(...)` from ever throwing `IllegalArgumentException` (`500`). Empirical probes (`Obs 1.3`) proved both exact 72-byte boundaries (`"P".repeat(72)`, `"é".repeat(36)`, `"🌸".repeat(18)`) pass and >72-byte variants cannot bypass validation even with `"novaSenhaDentroDoLimiteBytes": true` in JSON.
2. `AuthService.autenticar` checks `dto.getSenha().getBytes(StandardCharsets.UTF_8).length <= 72` before `passwordEncoder.matches(...)` (`Obs 1.1`), which empirically eliminated Spring Security 7 `BCrypt.checkpw` silent >72-byte truncation across ASCII, whitespace, null-byte, and multi-byte UTF-8 payloads while preserving HTTP `422` (`Obs 1.3`).
3. `EmailService` guards `codigo` before `HtmlUtils.htmlEscape` and short-circuits `mailSender == null || destinatario == null || destinatario.isBlank()` (`Obs 1.1`), eliminating pre-`try/catch` `IllegalArgumentException` crashes (`Obs 1.2`, `Obs 1.3`).

---

## 4. Caveats

- **Outside M1 scope (`modules/mae`, `modules/psicologo`)**: `CadastroMaeRequestDTO.java` and `CadastroPsicologoRequestDTO.java` still have `@Size(min = 6, max = 100)` before calling `passwordEncoder.encode(...)`; left untouched per M1 scope boundaries.
- **Frontend R1 (`apps/landing/**`)**: Not re-executed by this agent (this dispatch scoped `m1_challenger_1` Iteration 1 backend findings in `modules/auth/**`).
- **Ephemeral probe cleanup**: `AdversarialM1Iter2AuthTest.java` was deleted after execution (`Remove-Item ... -Force`), leaving the repository free of test artifacts from this agent.

---

## 5. Conclusion

**Verdict: `APPROVE`**

All `m1_challenger_1` Iteration 1 backend findings in `modules/auth/**` are completely fixed, verified against both the 25-test M1 backend suite and independent empirical adversarial probes, and cannot be bypassed via multi-byte UTF-8, Jackson `@AssertTrue` property injection, or BCrypt >72-byte truncation.

---

## 6. Verification Method

1. In `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel`, run:
   ```powershell
   .\mvnw.cmd test "-Dtest=AuthControllerTest,AuthServiceTest,EmailServiceTest"
   ```
   Expected: `Tests run: 25, Failures: 0, Errors: 0, Skipped: 0` (`BUILD SUCCESS`).
2. Inspect `RedefinirSenhaRequestDTO.java` (lines 27–35), `AuthService.java` (lines 215–217), and `EmailService.java` (lines 29, 63, 164, 215).
3. **Invalidation conditions**: Any failure in the 25 M1 backend tests, any HTTP `500` on `POST /api/auth/redefinir-senha` with >72 UTF-8 byte inputs, any `200` on `POST /api/auth/login` when appending bytes after a 72-byte password, or any exception in `EmailService` when given `null` arguments.
