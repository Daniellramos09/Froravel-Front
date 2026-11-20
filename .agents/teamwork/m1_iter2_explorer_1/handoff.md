# Handoff Report — M1 Iteration 2 Backend Remediation Analysis (`m1_iter2_explorer_1`)

**Handoff Type**: Hard  
**Milestone**: M1 (Backend R1 — `modules/auth/**`, Iteration 2 Remediation Planning)  

> **Summary**: `RedefinirSenhaRequestDTO` requires `@Size(min = 6, max = 72)` plus a `@JsonIgnore @AssertTrue` method named `isNovaSenhaDentroDoLimiteBytes()` so `GlobalExceptionHandler` maps both >72-char ASCII and >72-byte UTF-8 inputs to HTTP `400 Dados Inválidos` with `validationErrors`. `EmailService` needs `codigo` null guards at lines 29, 164, and 215 (plus recipient blank/null short-circuit at line 63), while `AuthService.autenticar` does **not** throw `IllegalArgumentException` in `spring-security-crypto 7.1.2` (`BCrypt.checkpw` skips the throw) **but** silently truncates >72-byte passwords and should short-circuit `> 72` UTF-8 bytes to `false` (`422`).

---

## 1. Observation

### 1.1 `RedefinirSenhaRequestDTO.java` & `GlobalExceptionHandler.java`
- `RedefinirSenhaRequestDTO.java:23-25` currently declares:
  ```java
  @NotBlank(message = "A nova senha é obrigatória.")
  @Size(min = 6, max = 100, message = "A nova senha deve conter no mínimo 6 caracteres.")
  private String novaSenha;
  ```
- `RedefinirSenhaRequestDTO.java:12,27-39` uses `@Builder`, `@NoArgsConstructor`, and an explicit 3-arg constructor `(String email, String codigo, String novaSenha)` that trims `email` and `codigo` without trimming `novaSenha`.
- `GlobalExceptionHandler.java:62-79` handles `MethodArgumentNotValidException` by iterating **only** `ex.getBindingResult().getFieldErrors()`:
  ```java
  Map<String, String> errors = new HashMap<>();
  for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
      errors.put(fieldError.getField(), fieldError.getDefaultMessage());
  }
  ```
  and builds `ErrorResponseDTO` (`status = 400`, `error = "Dados Inválidos"`, `message = "Falha de validação nos campos informados"`, `validationErrors = errors`).
- Existing DTOs and `ErrorResponseDTO.java:3-4` use `com.fasterxml.jackson.annotation.*` (`JsonFormat`, `JsonInclude`), and `AuthControllerTest.java:20,51` uses `com.fasterxml.jackson.databind.ObjectMapper`.
- Frontend `apps/landing/src/Screen/Auth/PasswordRecoveryFlow.jsx:9-18` extracts errors via `errJson.message || errJson.mensagem || Object.values(errJson.validationErrors)[0]`.

### 1.2 `EmailService.java` Null-Safety
- `EmailService.java:111-114` already guards `nome` in `escaparNome(String nome, String fallback)`:
  ```java
  private String escaparNome(String nome, String fallback) {
      String base = (nome != null && !nome.isBlank()) ? nome.trim() : fallback;
      return HtmlUtils.htmlEscape(base);
  }
  ```
- `EmailService.java:29` (`enviarCodigoConfirmacao`) interpolates `codigo` directly into the subject:
  `"🌸 Florável - Seu código de confirmação: " + codigo`
- `EmailService.java:164` (`gerarTemplateEmailHtml`) and `EmailService.java:215` (`gerarTemplateRecuperacaoSenhaHtml`) call `HtmlUtils.htmlEscape(codigo)` directly before `enviarEmailHtml`'s `try/catch`. Per `m1_challenger_1/handoff.md:38`, `emailService.enviarCodigoRecuperacaoSenha(null, null, null)` threw `java.lang.IllegalArgumentException: Input is required` at `EmailService.java:215`.
- `EmailService.java:218-266` (`gerarTemplateBoasVindasHtml`) uses only `escaparNome(nome, "Mãe")` — already null-safe.
- `EmailService.java:62-84` (`enviarEmailHtml`): when `mailSender == null`, `devFallback.run()` logs safely even with `destinatario == null`; when `mailSender != null`, `helper.setTo(destinatario)` inside `try { ... } catch (Exception e)` catches `IllegalArgumentException` and triggers `devFallback.run()`, though checking `destinatario == null || destinatario.isBlank()` at line 63 avoids creating a `MimeMessage` unnecessarily.

### 1.3 `LoginRequestDTO.java`, `AuthService.autenticar`, & `BCryptPasswordEncoder` (`spring-security-crypto 7.1.2`)
- `LoginRequestDTO.java:14-19` only declares `@NotBlank` on `email` and `senha` (no `@Size(max=...)`).
- `AuthService.java:214` calls `boolean senhaValida = passwordEncoder.matches(dto.getSenha(), usuario.getSenha());`.
- `SecurityBeansConfig.java:13` instantiates `new BCryptPasswordEncoder()`. `spring-boot-dependencies-4.1.2.pom:205` resolves `<spring-security.version>7.1.2</spring-security.version>`.
- Bytecode inspection (`javap -c -p`) of `BCryptPasswordEncoder` and `BCrypt` in `spring-security-crypto-7.1.2.jar`:
  - `BCrypt.hashpw(String, String)` (`encode`) calls `hashpw(bytes, salt, false)` -> checks `if (!for_check && passwordb.length > 72) throw new IllegalArgumentException("password cannot be more than 72 bytes")`.
  - `BCrypt.checkpw(String, String)` (`matches`) calls `hashpwforcheck(bytes, salt)` -> calls `hashpw(bytes, salt, true)` (`iconst_1`), **skipping** the `> 72` bytes exception!
- Empirical verification via `jshell --class-path "...spring-security-crypto-7.1.2.jar;...spring-jcl..."`:
  ```text
  encode72=$2a$10$ZoaLf91TzaLZrNQxDAnvjeIO7IJc8xreXulrkOmShYiwT33m9ySFy
  matches72_with_80=true
  matches_short_with_80=false
  encode73_ERR=java.lang.IllegalArgumentException: password cannot be more than 72 bytes
  ```
- Out-of-scope check: `CadastroMaeRequestDTO.java:30` and `CadastroPsicologoRequestDTO.java:28` also use `@Size(min = 6, max = 100)` with `passwordEncoder.encode(dto.getSenha())` (`MaeService.java:104`, `PsicologoService.java:51`).

### 1.4 `AuthControllerTest.java` & `EmailServiceTest.java` Structure
- `AuthControllerTest.java:81-87` sets up `MockMvcBuilders.standaloneSetup(authController).setControllerAdvice(new GlobalExceptionHandler()).build()`, and line `597` demonstrates `MockMvcBuilders.webAppContextSetup(webApplicationContext).build()` for full Boot MVC + Jackson 3 + `JwtAuthInterceptor` + `GlobalExceptionHandler` testing.
- `AuthControllerTest.java:575-592` asserts HTTP `400`, `$.error == "Dados Inválidos"`, and `$.validationErrors.<field>` on `redefinir-senha`.

---

## 2. Logic Chain

1. **Why `@AssertTrue` needs exact `is...()` naming + `@JsonIgnore` (Ref: Obs 1.1)**:
   - Because `GlobalExceptionHandler` reads `ex.getBindingResult().getFieldErrors()`, a class-level constraint would produce an `ObjectError` (leaving `validationErrors` empty).
   - In Jakarta Bean Validation / Hibernate Validator, `@AssertTrue` on a `public boolean isNovaSenhaDentroDoLimiteBytes()` getter produces a **`FieldError`** whose field name is `"novaSenhaDentroDoLimiteBytes"`. A method not prefixed with `is`/`get` would be silently ignored by Bean Validation, and naming it `isNovaSenha()` would clash with `getNovaSenha()` (`String`).
   - Adding `@JsonIgnore` (`com.fasterxml.jackson.annotation.JsonIgnore`) prevents Jackson (both test `ObjectMapper` and MVC Jackson 3) from serializing `"novaSenhaDentroDoLimiteBytes": true` in `objectMapper.writeValueAsString(dto)` or treating it as a JSON input property.
   - Returning `true` when `novaSenha == null` prevents duplicate errors alongside `@NotBlank`.
   - With `@Size(min = 6, max = 72)` on `novaSenha`:
     - ASCII `73+` chars (e.g. `"P".repeat(73)` / `"P".repeat(80)`) fails `@Size` -> `validationErrors.novaSenha` is populated (and `novaSenhaDentroDoLimiteBytes` too) -> HTTP `400 Dados Inválidos`.
     - Multi-byte UTF-8 `<= 72` chars but `> 72` bytes (e.g. `"é".repeat(40)`: 40 chars, 80 UTF-8 bytes) passes `@Size` and fails `@AssertTrue` -> `validationErrors.novaSenhaDentroDoLimiteBytes` is populated -> HTTP `400 Dados Inválidos`.
     - `72` bytes (e.g. `"P".repeat(72)` or `"é".repeat(36)`) passes both -> `200 OK`.

2. **Why `EmailService` needs `codigo` + `destinatario` guards (Ref: Obs 1.2)**:
   - `HtmlUtils.htmlEscape(null)` throws `IllegalArgumentException` outside `enviarEmailHtml`'s `try/catch`, crashing synchronous callers or async tasks before `devFallback`. Guarding `codigo != null ? HtmlUtils.htmlEscape(codigo) : ""` in `gerarTemplateEmailHtml` and `gerarTemplateRecuperacaoSenhaHtml` (plus `codigo != null ? codigo : ""` in `enviarCodigoConfirmacao` subject) and short-circuiting `destinatario == null || destinatario.isBlank()` in `enviarEmailHtml` makes all three `EmailService` methods completely null-safe.

3. **Why `AuthService.autenticar` has no 500 risk but has silent BCrypt truncation (Ref: Obs 1.3)**:
   - `BCryptPasswordEncoder.matches` in `spring-security-crypto 7.1.2` does NOT throw `IllegalArgumentException` on >72-byte inputs (`matches_short_with_80=false`), so `POST /api/auth/login` with an 80-char wrong password returns HTTP `422`.
   - However, `matches("P".repeat(80), encode("P".repeat(72)))` returns `true` due to BCrypt's 72-byte key truncation. Because no stored user can ever have a >72-byte password (all `encode()` calls reject >72 bytes), guarding `dto.getSenha().getBytes(StandardCharsets.UTF_8).length <= 72` before `passwordEncoder.matches(...)` in `AuthService.autenticar` eliminates silent truncation while preserving the exact `422 Credenciais inválidas` response contract (without adding `@Size(max = 72)` to `LoginRequestDTO`, which would change `422` to `400` on wrong long passwords).

---

## 3. Caveats

- **Field key for multi-byte >72-byte errors**: With `@AssertTrue` on `isNovaSenhaDentroDoLimiteBytes()`, an input like `"é".repeat(40)` produces `validationErrors.novaSenhaDentroDoLimiteBytes` (while `"P".repeat(73)` produces both `validationErrors.novaSenha` and `validationErrors.novaSenhaDentroDoLimiteBytes`). Frontend `PasswordRecoveryFlow.jsx:14` reads `Object.values(errJson.validationErrors)[0]`, so it displays the message regardless of key name. If an exact `validationErrors.novaSenha` key were ever required for multi-byte UTF-8, a custom Jakarta `@Constraint` on `novaSenha` would be needed instead of `@AssertTrue`.
- **Out-of-scope registration DTOs**: `CadastroMaeRequestDTO.java:30` and `CadastroPsicologoRequestDTO.java:28` still declare `@Size(min = 6, max = 100)` before calling `passwordEncoder.encode(...)`; these are outside `modules/auth/**` (M1 ownership) and should be flagged for cross-module hardening if desired.
- **Read-only scope**: Proposed diffs below were not compiled or executed against Maven; they must be verified by the M1 implementer with `.\mvnw.cmd test`.

---

## 4. Conclusion — Exact Backend Fixes & Regression Tests

### Fix 1: `RedefinirSenhaRequestDTO.java`
**Target**: `floravel-backend/Floravel/src/main/java/br/com/floravel/floravel/modules/auth/dto/RedefinirSenhaRequestDTO.java` (lines 3–30)

```java
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.nio.charset.StandardCharsets;
```
Replace lines 23–25 with:
```java
    @NotBlank(message = "A nova senha é obrigatória.")
    @Size(min = 6, max = 72, message = "A nova senha deve conter entre 6 e 72 caracteres.")
    private String novaSenha;

    @JsonIgnore
    @AssertTrue(message = "A nova senha deve ter no máximo 72 bytes.")
    public boolean isNovaSenhaDentroDoLimiteBytes() {
        return novaSenha == null || novaSenha.getBytes(StandardCharsets.UTF_8).length <= 72;
    }
```

### Fix 2: `EmailService.java`
**Target**: `floravel-backend/Floravel/src/main/java/br/com/floravel/floravel/modules/auth/service/EmailService.java`
- Line 29 (`enviarCodigoConfirmacao` subject):
  `"🌸 Florável - Seu código de confirmação: " + (codigo != null ? codigo : ""),`
- Line 63 (`enviarEmailHtml` guard):
  `if (mailSender == null || destinatario == null || destinatario.isBlank()) {`
- Line 164 (`gerarTemplateEmailHtml`):
  `""".formatted(nomeExibicao, codigo != null ? HtmlUtils.htmlEscape(codigo) : "");`
- Line 215 (`gerarTemplateRecuperacaoSenhaHtml`):
  `""".formatted(nomeExibicao, codigo != null ? HtmlUtils.htmlEscape(codigo) : "");`

### Fix 3: `AuthService.java` (`autenticar` truncation hardening)
**Target**: `floravel-backend/Floravel/src/main/java/br/com/floravel/floravel/modules/auth/service/AuthService.java` (imports + line 214)
Add `import java.nio.charset.StandardCharsets;` and update line 214:
```java
        boolean senhaValida = dto.getSenha() != null
                && dto.getSenha().getBytes(StandardCharsets.UTF_8).length <= 72
                && passwordEncoder.matches(dto.getSenha(), usuario.getSenha());
```
*(Leave `LoginRequestDTO.java` unchanged with `@NotBlank` so >72-byte wrong passwords return `422` consistently with any wrong credential rather than changing to `400`.)*

### Fix 4: Regression Tests in `AuthControllerTest.java` (and `EmailServiceTest.java`)
**Target A**: `floravel-backend/Floravel/src/test/java/br/com/floravel/floravel/modules/auth/controller/AuthControllerTest.java`
Add 4 tests (using `MockMvcBuilders.webAppContextSetup(webApplicationContext).build()` for full MVC + Jackson 3 + Bean Validation + `GlobalExceptionHandler` coverage):
1. `deveRedefinirSenhaComSucessoNoLimiteExatoDe72Bytes` — creates user + `TokenRecuperacaoSenha` (`"112233"`), submits `POST /api/auth/redefinir-senha` with `novaSenha = "P".repeat(72)` -> `200 OK`, `$.redefinida == true`; verifies login with `"P".repeat(72)` -> `200 OK`, `$.tokenSessao` non-empty.
2. `deveRetornar400QuandoNovaSenhaExceder72CaracteresAscii` — creates user + active token (`"445566"`), submits `POST /api/auth/redefinir-senha` with `"P".repeat(73)` and `"P".repeat(80)` via `webAppContextSetup` -> `400 Bad Request` (`$.status == 400`, `$.error == "Dados Inválidos"`, `$.validationErrors.novaSenha` exists); asserts token remains unused (`usado == false`).
3. `deveRetornar400QuandoNovaSenhaExceder72BytesEmUtf8Multibyte` — creates user + active token (`"778899"`), submits `POST /api/auth/redefinir-senha` with `novaSenha = "é".repeat(40)` (40 chars, 80 UTF-8 bytes) via `webAppContextSetup` -> `400 Bad Request` (`$.status == 400`, `$.error == "Dados Inválidos"`, `$.validationErrors.novaSenhaDentroDoLimiteBytes` exists); asserts token remains unused (`usado == false`).
4. `deveRejeitarLoginCom422QuandoSenhaExceder72BytesMesmoComPrefixoValido` — creates user with `passwordEncoder.encode("P".repeat(72))`, submits `POST /api/auth/login` with `"P".repeat(72) + "extra"` (77 bytes) and `"P".repeat(80)` -> both return `422 Unprocessable Entity` (neither `200` from BCrypt truncation nor `500`).

**Target B**: `floravel-backend/Floravel/src/test/java/br/com/floravel/floravel/modules/auth/service/EmailServiceTest.java`
Add `deveTratarCamposNulosSemLancarExcecao()` asserting `assertDoesNotThrow` for `enviarCodigoConfirmacao(null, null, null)`, `enviarCodigoRecuperacaoSenha(null, null, null)`, and `enviarEmailBoasVindas(null, null)` both with `mailSender == null` and with a mocked `JavaMailSender`.

---

## 5. Verification Method

1. **After applying Fixes 1–4**, run in `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel`:
   ```powershell
   .\mvnw.cmd test -Dtest=AuthControllerTest,AuthServiceTest,EmailServiceTest
   ```
   and full suite:
   ```powershell
   .\mvnw.cmd clean test
   ```
2. **Expected outcomes**:
   - All existing 64 tests + 5 new regression tests (69 total) pass with `Failures: 0, Errors: 0, Skipped: 0`.
   - `POST /api/auth/redefinir-senha` with `"P".repeat(72)` -> `200 OK`; with `"P".repeat(73)` / `"P".repeat(80)` -> `400 Dados Inválidos` (`validationErrors.novaSenha`); with `"é".repeat(40)` -> `400 Dados Inválidos` (`validationErrors.novaSenhaDentroDoLimiteBytes`).
   - `POST /api/auth/login` with `"P".repeat(72) + "extra"` against a `"P".repeat(72)` user -> `422`.
   - `EmailService` with `null` `codigo` / `nome` / `destinatario` -> zero exceptions.
3. **Invalidation conditions**: If `AuthControllerTest` fails on `validationErrors.novaSenhaDentroDoLimiteBytes` (missing from `validationErrors`), check that the method name in `RedefinirSenhaRequestDTO` starts with `is` (`isNovaSenhaDentroDoLimiteBytes`) and returns primitive `boolean`. If Jackson fails during serialization/deserialization, verify `@JsonIgnore` is imported from `com.fasterxml.jackson.annotation.JsonIgnore`.
