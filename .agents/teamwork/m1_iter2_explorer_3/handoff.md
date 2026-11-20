# Handoff Report — `m1_iter2_explorer_3` (M1 Iteration 2: R1 E2E Contract Alignment Check)

**Core Summary:** All R1 endpoints, request/response JSON contracts (`mensagem`, `email`, `expiracaoMinutos`, `redefinida`, `verificado`), HTTP status codes (`200`, `201`, `400`, `422`), `EmailService` dev fallback log parsing in `helpers/email-otp.mjs`, and the `T4.S5` static secrets scan are **aligned and passing** across `tests/e2e/`, `modules/auth/**`, and `apps/landing/**`. Three operational/cross-milestone caveats were identified (`R1.T6` awaits M2 RH seed, SMTP fallback timeout dependency in `application.properties`, and a theoretical async timing race in `R1.T5`).

---

## 1. Observation

### 1.1 Endpoint Paths, Request Bodies, Response JSON Fields & Status Codes

| Flow | E2E Test / Frontend Usage | Backend Implementation | Verified Status |
|---|---|---|---|
| `POST /api/auth/esqueci-senha` | `tier1-features.e2e.mjs:30-50` (`R1.T1`, `R1.T2`), `tier2-boundaries.e2e.mjs:29-33,91-99` (`R1.B4`), `PasswordRecoveryFlow.jsx:59-77,103-116`. Sends `{ email }`; expects `200` with `{ mensagem, email, expiracaoMinutos: 15 }` (anti-enumeration on unknown email) or `400` on blank/malformed email. | `AuthController.java:62-66` (`@Valid`), `EsqueciSenhaRequestDTO.java:13-15` (`@NotBlank`, `@Email`), `AuthService.java:143-167` (`TEMPO_EXPIRACAO_MINUTOS = 15`, returns `EsqueciSenhaResponseDTO` with `mensagem`, `email`, `expiracaoMinutos`), `EsqueciSenhaResponseDTO.java:10-14`, `GlobalExceptionHandler.java:62-79` (`400 Bad Request`). | **ALIGNED** |
| `POST /api/auth/redefinir-senha` | `tier1-features.e2e.mjs:71-78` (`R1.T3`), `tier2-boundaries.e2e.mjs:35-48,67-89,101-141` (`R1.B1`–`R1.B3`, `R1.B5`, `R1.B6`), `PasswordRecoveryFlow.jsx:156-173`. Sends `{ email, codigo, novaSenha }`; expects `200` with `{ redefinida: true, mensagem, email }`, and `400` on wrong/reused/superseded/malformed code or `<6`-char password. | `AuthController.java:68-72` (`@Valid`), `RedefinirSenhaRequestDTO.java:15-25` (`@NotBlank`, `@Email`, `@Pattern("^\d{6}$")`, `@Size(min=6, max=100)`), `AuthService.java:170-205` (`RedefinirSenhaResponseDTO` with `redefinida=true`, `mensagem`, `email`), `RedefinirSenhaResponseDTO.java:10-14`, `GlobalExceptionHandler.java:62-90` (`MethodArgumentNotValidException`, `CodigoInvalidoException`, `CodigoExpiradoException` -> `400 Bad Request`). | **ALIGNED** |
| `POST /api/auth/confirmar-email` | `tier1-features.e2e.mjs:98-107,135-147` (`R1.T4`, `R1.T5`), `tier3-combinations.e2e.mjs:39-47` (`T3.C1`), `EmailConfirmationFlow.jsx:65-98`. Sends `{ email, codigo }`; expects `200` with `{ verificado: true, mensagem, email }`, welcome email triggered, and `400` on invalidated prior code. | `AuthController.java:48-53` (`@Valid`), `ConfirmarEmailRequestDTO.java:15-21` (`@NotBlank`, `@Email`, `@Pattern("^\d{6}$")`), `AuthService.java:80-116` (sets `emailVerificado=true`, calls `emailService.enviarEmailBoasVindas(...)`, returns `ConfirmarEmailResponseDTO` with `verificado=true`, `mensagem`, `email`), `ConfirmarEmailResponseDTO.java:10-14`, `GlobalExceptionHandler.java:82-90` (`400 Bad Request`). | **ALIGNED** |
| `POST /api/auth/reenviar-codigo` | `tier1-features.e2e.mjs:118-124` (`R1.T5`), `EmailConfirmationFlow.jsx:124-137`. Sends `{ email }`; expects `200` with `{ verificado: false, email, mensagem }` and invalidation of prior code. | `AuthController.java:55-60` (`@Valid`), `ReenviarCodigoRequestDTO.java:14-16`, `AuthService.java:119-140` (calls `gerarEEnviarCodigoConfirmacao` which calls `tokenRepository.invalidarTokensAnteriores(usuario)` at line 61, returns `verificado=false`, `mensagem`, `email`). | **ALIGNED** |
| `POST /api/auth/login` | `tier1-features.e2e.mjs:80-82,150-166` (`R1.T6`), `tier3-combinations.e2e.mjs:64-70` (`T3.C1`), `LoginScreen.jsx:259-270`, `EmailConfirmationFlow.jsx:80-90`. Sends `{ email, senha }`; expects `200` with `{ tokenSessao, usuarioId, perfilId, codigoPublico, tipoPerfil, emailVerificado, nome, email, mensagem }`, or `401`/`422` on wrong password. | `AuthController.java:30-33`, `LoginRequestDTO.java:14-19`, `AuthService.java:208-240`, `LoginResponseDTO.java:12-20`, `GlobalExceptionHandler.java:56-59` (`RegraDeNegocioException` -> `422 Unprocessable Entity`). | **ALIGNED** (see Caveat 3.1 for `RH` seed) |
| `POST /api/maes` (R1 signup + OTP trigger) | `helpers/auth-fixtures.mjs:42-62`, `tier1-features.e2e.mjs:92-93` (`R1.T4`), `LoginScreen.jsx:462-477`. Expects `201 Created` with `emailVerificado: false` and OTP email dispatched. | `MaeController.java:25-36` (`ResponseEntity.created`), `MaeService.java:143` (`authService.gerarEEnviarCodigoConfirmacao(...)`), `MaeResponseDTO.java:28,55` (`emailVerificado: false`). | **ALIGNED** |
| Public Auth Routing | Unauthenticated calls to `/api/auth/**` in R1 tests and `apps/landing`. | `JwtAuthInterceptor.java:121` (`path.startsWith("/api/auth/")` returns `true` before JWT check). | **ALIGNED** |
| Frontend Routes & Session Storage (`apps/landing`) | `App.jsx:28-32` exposes `/login`, `/cadastro`, `/esqueci-senha`, `/redefinir-senha`, `/confirmar-email`. `LoginScreen.jsx:22-34,143-152` maps `RH` -> `'rh'` -> `'floravel_rh_sessao'`, `PSICOLOGO` -> `'terapeuta'` -> `'floravel_psi_sessao'`, `MAE` -> `'mae'` -> `'floravel_mae_sessao'` and sets `floravel_jwt`. | Matches `PROJECT.md` F4 & `LoginResponseDTO.tipoPerfil` (`MAE`, `PSICOLOGO`, `RH`). | **ALIGNED** |

### 1.2 `helpers/email-otp.mjs` vs `EmailService.java` Dev Fallback Logging

- In `EmailService.java`:
  - Line 25 (`enviarCodigoConfirmacao`): `log.info("Disparando código de verificação para {}", destinatario);` (plaintext OTP removed from pre-SMTP log).
  - Line 38 (`enviarCodigoRecuperacaoSenha`): `log.info("Disparando código de recuperação de senha para {}", destinatario);` (plaintext OTP removed from pre-SMTP log).
  - Line 51 (`enviarEmailBoasVindas`): `log.info("Disparando e-mail de boas-vindas para {}", destinatario);`
  - Lines 86-97 (`logDevFallback`, invoked when `mailSender == null` or SMTP throws):
    ```
    [FLORÁVEL EMAIL - DEV / DEMO DAY FALLBACK]
    Finalidade: <Confirmação de E-mail | Recuperação de Senha>
    Destinatário: <destinatario>
    Código Temporário: [ <codigo> ] (Expira em 15 minutos)
    Motivo/Status SMTP: <motivo>
    ```
  - Lines 99-109 (`logDevBoasVindasFallback`):
    ```
    [FLORÁVEL EMAIL - DEV / DEMO DAY FALLBACK]
    Finalidade: Boas-vindas pós-confirmação
    Destinatário: <destinatario> (<nome>)
    Motivo/Status SMTP: <motivo>
    ```
- In `tests/e2e/helpers/email-otp.mjs`:
  - `extractCodeFromLogSlice` (lines 34-58): Iterates over every line containing `email.trim().toLowerCase()`.
    - On the initial `Disparando código... para <email>` line, `inlineMatch` (`/\[(\d{6})\]|\[\s*(\d{6})\s*\]/`) returns `null`, and unless a `código ...: <6-digits>` line appears within the next 5 lines, `blockMatch` returns `null` and the loop continues.
    - When it reaches `Destinatário: <email>` inside `logDevFallback`, `windowText` (lines `i..i+5`) includes `Código Temporário: [ <codigo> ] (Expira em 15 minutos)`. Regex `/(?:c[óo]digo[^:\n]*:\s*\[?\s*|code[^:\n]*:\s*\[?\s*)(\d{6})/i` matches `Código Temporário: [ <codigo>` and returns `<codigo>`.
  - `hasWelcomeFromLogSlice` (lines 60-77): Matches `Disparando e-mail de boas-vindas para <email>` directly (same line contains both `email` and `boas-vindas`) as well as `logDevBoasVindasFallback` (`windowText` lines `i-2..i+5` includes `Boas-vindas pós-confirmação` and `Destinatário: <email>`).
  - Direct Node simulation of `extractCodeFromLogSlice` and `hasWelcomeFromLogSlice` against the formatted `EmailService.java` log output returned `{ otp: '482910', welcome: true }` with exit code `0`.

### 1.3 `tier4-scenarios.e2e.mjs` Secrets Scan (`T4.S5`)

- Executed `node --test --test-name-pattern="T4.S5" tests/e2e/tier4-scenarios.e2e.mjs` in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front`:
  - Result: **exit code 0** (`pass 1, fail 0, skipped 0`).
- Ran `grep_search` with the `T4.S5` secret rules across `apps/landing` and `modules/auth`:
  - Result: **0 matches** (`No results found`).

---

## 2. Logic Chain

1. **API Contract Alignment:** Every endpoint path, HTTP method, request DTO validation annotation, response DTO field name (`mensagem`, `email`, `expiracaoMinutos`, `redefinida`, `verificado`), and exception-to-HTTP-status mapping (`GlobalExceptionHandler` -> `400` for `MethodArgumentNotValidException`, `CodigoInvalidoException`, `CodigoExpiradoException`; `422` for `RegraDeNegocioException`) in `modules/auth/**` and `modules/mae/**` was directly verified against the assertions in `tier1`–`tier4` and `apps/landing/src/Screen/Auth/**`. No field-name or status-code mismatches exist.
2. **Email Log Parsing Compatibility:** Although `m1_worker_1` removed `[<codigo>]` from the pre-SMTP `Disparando código...` log lines (`EmailService.java:25,38`), `extractCodeFromLogSlice` does not abort on the first matching email line when no code is found — it continues iterating to `Destinatário: <email>` inside `logDevFallback` (`EmailService.java:92-93`), where the multi-line `Código Temporário: [ <codigo> ]` regex (`email-otp.mjs:51-55`) extracts the 6-digit OTP cleanly.
3. **Secrets Scan Compliance:** Running `T4.S5` directly verified zero hardcoded AWS keys, private keys, API tokens, JWT/S3 secret literals, or `floravel123` frontend credential literals across all scanned roots including M1's `apps/landing/**` and `modules/auth/**`.

---

## 3. Caveats

1. **Cross-Milestone Dependency in `R1.T6` (`DemoDayDataSeeder` RH User):** `tier1-features.e2e.mjs:162-165` calls `loginSeededRh()`. Verified in `DemoDayDataSeeder.java:53-183` that `MAE` (`mariana.silva@email.com`) and `PSICOLOGO` (`helena.souza@floravel.com.br`) are seeded, while the `TipoPerfil.RH` user is not yet seeded (planned for Milestone M2, Feature F5 per `PROJECT.md:19`). Consequently, `R1.T6` will fail on `loginSeededRh()` until M2 seeds an RH user (or `E2E_RH_EMAIL` / `E2E_RH_PASSWORD` is configured).
2. **SMTP Default Timing Risk in `application.properties:41-47`:** `spring.mail.host` defaults to `sandbox.smtp.mailtrap.io:2525` with dummy credentials (`floravel_mail_user` / `floravel_mail_pass`) and no `mail.smtp.connectiontimeout` / `mail.smtp.timeout` properties. Because `JavaMailSender` is instantiated (`mailSender != null`), `EmailService` attempts an actual SMTP connection before catching and running `logDevFallback`. If outbound port 2525 is slow or silently dropped by a firewall, `mailSender.send(...)` may block past `waitForOtpCode`'s `8000ms` timeout (`email-otp.mjs:130`). (No contract mismatch with `email-otp.mjs` format itself.)
3. **Minor Offset Ordering in `R1.T5` (`tier1-features.e2e.mjs:111-115`):** `R1.T5` calls `markInboxOffset()` *after* `registerFreshMae()` returns (`const { email } = await registerFreshMae(); const offset1 = await markInboxOffset();`). If `mailSender == null` and the `@Async` `enviarCodigoConfirmacao` thread logs `logDevFallback` before `markInboxOffset()` runs, `offset1` could skip `firstCode` and cause `waitForOtpCode` to time out. (`R1.T4`, `R1.B6`, `T3.C1`, and `T4.S1` mark offsets before the triggering HTTP request and are safe.)
4. **Live Backend Not Started:** By scope (read-only alignment check), the Spring Boot server was not launched to execute live HTTP calls against MySQL; runtime behavior was verified via static inspection, Node simulation of `email-otp.mjs`, and direct execution of `T4.S5`.

---

## 4. Conclusion

**M1 R1 backend (`modules/auth/**`), M1 frontend (`apps/landing/**`), and the R1 E2E suite (`tests/e2e/`) are fully contract-aligned:**
- All R1 endpoints (`/api/auth/esqueci-senha`, `/api/auth/redefinir-senha`, `/api/auth/confirmar-email`, `/api/auth/reenviar-codigo`, `/api/auth/login`, `/api/maes`), request fields, response JSON fields (`mensagem`, `email`, `expiracaoMinutos`, `redefinida`, `verificado`), and status codes (`200`, `201`, `400`, `422`) match `tests/e2e/` expectations.
- `helpers/email-otp.mjs` log-parsing regexes accurately extract both 6-digit OTP codes from `EmailService.logDevFallback` and welcome email logs from `EmailService.enviarEmailBoasVindas` / `logDevBoasVindasFallback`.
- `tier4-scenarios.e2e.mjs` `T4.S5` passes with 0 violations.
- No code fixes are required in M1 for R1 contract alignment (note Caveat 3.1 for M2 RH seed dependency on `R1.T6`, and Caveats 3.2–3.3 as operational/test-runner awareness notes).

---

## 5. Verification Method

1. **Secrets Gate (`T4.S5`):**
   ```powershell
   # From C:\Users\danie\PROA\projetoDemoDay\Froravel-Front
   node --test --test-name-pattern="T4.S5" tests/e2e/tier4-scenarios.e2e.mjs
   ```
   Expected: exit code `0`, `pass 1, fail 0`.
2. **Dry-Run E2E Syntax & Config Check:**
   ```powershell
   node tests/e2e/run-e2e.mjs --dry-run
   ```
3. **Full R1 Live E2E Execution (requires MySQL + `E2E_AUTO_START_BACKEND=true`, plus M2 RH seed or `E2E_RH_EMAIL` for `R1.T6`):**
   ```powershell
   $env:E2E_AUTO_START_BACKEND="true"
   node tests/e2e/run-e2e.mjs --tier=1,2,3 --filter="R1|T3\.C1"
   ```
4. **Files Inspected for Direct Verification:**
   - `tests/e2e/{tier1-features,tier2-boundaries,tier3-combinations,tier4-scenarios}.e2e.mjs`
   - `tests/e2e/helpers/{email-otp,auth-fixtures,config}.mjs`, `tests/e2e/run-e2e.mjs`
   - `floravel-backend/Floravel/src/main/java/br/com/floravel/floravel/modules/auth/**`
   - `floravel-backend/Floravel/src/main/java/br/com/floravel/floravel/shared/{exception/GlobalExceptionHandler,security/JwtAuthInterceptor,config/DemoDayDataSeeder}.java`
   - `floravel-backend/Floravel/src/main/resources/application.properties`
   - `Froravel-Front/apps/landing/src/{App.jsx,Screen/Auth/*}`
