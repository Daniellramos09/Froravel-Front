# Handoff Report — m1_explorer_3 (M1: R1 Edge Cases, Security & Secrets Hygiene)

**Handoff Type**: Hard  
**Core Summary**: `LoginScreen.jsx:19-21` hardcodes a real Google OAuth2 Client ID (blocking the runtime `/api/auth/oauth/google/config` fallback and violating AC4), `LoginScreen.jsx:131` fails to map `'rh'` to `floravel_rh_sessao`, `@Email` Bean Validation rejects untrimmed whitespace before service normalization runs, and `TokenRecuperacaoSenha` requires BCrypt hash verification in Java plus atomic SQL single-use consumption (`UPDATE ... WHERE id = :id AND usado = false`) to survive sequential/concurrent retries. `EmailService` safely absorbs `mailSender == null` and SMTP errors, while `JwtAuthInterceptor` already permits `/api/auth/**`.

---

## 1. Observation

### A. Secrets & Credentials Hygiene (AC4) — Frontend (`Froravel-Front`)

1. **`apps/landing/src/Screen/Auth/LoginScreen.jsx:19-21` & `118-128`** (`view_file`):
   ```js
   // lines 19-21
   const GOOGLE_CLIENT_ID_PUBLIC =
     import.meta.env.VITE_GOOGLE_CLIENT_ID ||
     '339469409890-1g5vn0mmj2hir5ishgi0kh2q47rglfb2.apps.googleusercontent.com';
   ```
   ```js
   // lines 118-128
   useEffect(() => {
     if (googleClientId || !API_BASE) return;
     fetch(`${API_BASE}/api/auth/oauth/google/config`)
       .then((res) => (res.ok ? res.json() : null))
       .then((cfg) => {
         if (cfg?.enabled && cfg?.clientId) {
           setGoogleClientId(cfg.clientId);
         }
       })
       .catch(() => {});
   }, [googleClientId]);
   ```
2. **`apps/landing/.env:1-4`** (`view_file`):
   ```env
   # Variáveis locais da Landing/Auth (arquivo protegido pelo .gitignore)
   VITE_API_URL=http://localhost:8080
   VITE_GOOGLE_CLIENT_ID=339469409890-1g5vn0mmj2hir5ishgi0kh2q47rglfb2.apps.googleusercontent.com
   ```
   - `git ls-files .env apps/landing/.env apps/landing/dist` returned empty output (exit code 0): neither `.env` nor `dist/` is tracked in Git.
   - `apps/landing/.env.example:5` contains placeholder `VITE_GOOGLE_CLIENT_ID=seu_client_id.apps.googleusercontent.com`.
   - `apps/landing/dist/assets/index-m_eOowmD.js` exists locally (gitignored build output); Vite inlines `VITE_*` variables from `.env` during `vite build`.
3. **Other literals in `LoginScreen.jsx`** (`view_file`):
   - Lines `293, 310, 787, 798, 809`: synthetic Demo Day CPF strings (`'14582931065'`, `'52998224725'`, `'390.533.447-05'`), matching `SimuladoGovernoIdentidadeClient.java:20-23`.
   - Lines `130-139`:
     ```js
     const salvarSessaoLocal = (authData, papelAtual) => {
       const chave = papelAtual === 'terapeuta' ? 'floravel_psi_sessao' : 'floravel_mae_sessao';
     ```
     Meanwhile `apps/rh/src/App.jsx:12` (`grep_search`) reads/writes `'floravel_rh_sessao'`.
   - Lines `284-287` & `1040-1103`: `handleForgotSubmit` only calls `setForgotSent(true)` without any `fetch` to `/api/auth/esqueci-senha`.
   - Lines `457-460`: `handleCadastroSubmit` saves `MaeResponseDTO` (which has no `tokenSessao` per `MaeResponseDTO.java:16-39`) into `localStorage` and calls `navigateToApp('mae', maeCriada)` immediately, skipping `/confirmar-email`.
4. **Cross-repo frontend secret scan** (`grep_search` across `Froravel-Front`):
   - Regex `(AIza|AKIA|sk_live|sk_test|apps\.googleusercontent\.com|FALLBACK_DEV_SECRET|client_secret|clientSecret)` found ONLY `apps/landing/.env.example:5`, `LoginScreen.jsx:21`, and two `sha512-...` npm integrity hashes in `package-lock.json`. `apps/mae/.env` and `apps/psicologo/.env` only contain `VITE_*_URL` localhost URLs.

### B. Secrets & Config Hygiene — Backend (`floravel-backend/Floravel`)

1. **`src/main/resources/application.properties`** (`view_file`):
   - Line 10: `spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:1234}`
   - Lines 41-44: `spring.mail.host=${SPRING_MAIL_HOST:sandbox.smtp.mailtrap.io}`, `spring.mail.username=${SPRING_MAIL_USERNAME:floravel_mail_user}`, `spring.mail.password=${SPRING_MAIL_PASSWORD:floravel_mail_pass}`
   - Lines 61, 66, 67: `${FLORAVEL_GOOGLE_CLIENT_ID:}`, `${FLORAVEL_ENCRYPTION_KEY:}`, `${FLORAVEL_JWT_SECRET:}` (empty defaults).
2. **`.env` & `.env.example`** (`view_file`, `git ls-files .env` -> empty):
   - `.env` contains placeholder strings (`seu-google-client`, `cole-sua-chave-aqui`), ignored by `.gitignore:8-9`.
3. **Outside M1 scope (observed during repo-wide scan)**:
   - `JwtService.java:30`: `FALLBACK_DEV_SECRET = "floravel-dev-jwt-hs256-secret-2026-change-in-prod"`
   - `AesGcmAttributeConverter.java:31`: `FALLBACK_DEV_SECRET = "floravel-dev-lgpd-aes256-key-2026-changeme-in-prod"`
   - `DemoDayDataSeeder.java:58, 80` & `OpenApiSwaggerController.java:81, 94, 106`: demo password literal `"floravel123"`.

### C. Auth & Mae Service Edge-Case Observations

1. **Email whitespace & uppercase handling**:
   - `MaeService.java:49`, `AuthService.java:75, 113, 137`: all normalize via `dto.getEmail().trim().toLowerCase()`.
   - `ConfirmarEmailRequestDTO.java:15-17`, `ReenviarCodigoRequestDTO.java:14-16`, `LoginRequestDTO.java:14-16`, `CadastroMaeRequestDTO.java:24-27`: all use `@NotBlank` + `@Email` from `jakarta.validation.constraints`.
   - `UsuarioRepository.java:13, 15`: defines `findByEmail(String email)` and `existsByEmail(String email)` (exact match; no `IgnoreCase` variant).
2. **Token invalidation & `TokenConfirmacaoEmail` vs `TokenRecuperacaoSenha`**:
   - `TokenConfirmacaoEmail.java:28-29`: `@Column(nullable = false, length = 6) private String codigo;` (plaintext 6-digit code).
   - `TokenConfirmacaoEmailRepository.java:19, 21-23`:
     ```java
     Optional<TokenConfirmacaoEmail> findFirstByUsuarioEmailAndCodigoAndUsadoFalseOrderByDataCriacaoDesc(String email, String codigo);

     @Modifying
     @Query("UPDATE TokenConfirmacaoEmail t SET t.usado = true WHERE t.usuario = :usuario AND t.usado = false")
     void invalidarTokensAnteriores(@Param("usuario") Usuario usuario);
     ```
     Notice `@Modifying` has default `clearAutomatically = false, flushAutomatically = false`.
3. **`AuthService.confirmarEmail` (`AuthService.java:73-109`)**:
   - Lines 80-86: if `Boolean.TRUE.equals(usuario.getEmailVerificado())`, immediately returns `200 OK` (`verificado: true`).
   - Lines 88-90: looks up unused token by email + trimmed code; throws `CodigoInvalidoException` (mapped to `400` in `GlobalExceptionHandler.java:82-85`).
   - Lines 92-94: checks `token.isExpirado()`; throws `CodigoExpiradoException` (mapped to `400` in `GlobalExceptionHandler.java:87-90`).
   - Lines 96-100: sets `token.setUsado(true)`, `usuario.setEmailVerificado(true)`, saves both. Currently does NOT call `emailService.enviarEmailBoasVindas(...)`.
4. **`EmailService.java:14-113`**:
   - Line 16-17: `@Autowired(required = false) private JavaMailSender mailSender;`
   - Line 22: `@Async` on `enviarCodigoConfirmacao(String destinatario, String nome, String codigo)` (`FloravelApplication.java:7` has `@EnableAsync`).
   - Line 24: `log.info("Disparando código de verificação para {}: [{}]", destinatario, codigo);` (logs plaintext OTP at `INFO` unconditionally before attempting SMTP).
   - Lines 26-29: `if (mailSender == null) { logDevFallback(...); return; }`
   - Lines 44-48: `catch (Exception e)` logs warning and calls `logDevFallback(...)` without rethrowing.
   - Line 111: `""".formatted(nomeExibicao, codigo)` interpolates `nomeExibicao` raw into HTML without escaping.
5. **`JwtAuthInterceptor.java:30-43, 119-130`**:
   - Line 41-42: `if (ehRotaPublica(method, path)) { return true; }` executes BEFORE checking `Authorization` header (line 45).
   - Line 121: `if (path.startsWith("/api/auth/") ... ) return true;`

---

## 2. Logic Chain

1. **AC4 Hardcoded Client ID (`LoginScreen.jsx:19-21` & `.env`)**:
   - Observation A1 shows `'339469409890-1g5vn0mmj2hir5ishgi0kh2q47rglfb2.apps.googleusercontent.com'` is hardcoded as the fallback of `GOOGLE_CLIENT_ID_PUBLIC` in `LoginScreen.jsx:21`.
   - Because `GOOGLE_CLIENT_ID_PUBLIC` is always truthy, `googleClientId` state (line 102) is always non-empty, which causes the guard `if (googleClientId || !API_BASE) return;` at line 119 to short-circuit and NEVER fetch `/api/auth/oauth/google/config`.
   - Replacing line 20-21 with `import.meta.env.VITE_GOOGLE_CLIENT_ID || ''` simultaneously satisfies AC4 (zero client IDs in source code) and activates the existing backend config endpoint (`AuthController.java:37-43`).
   - Observation A2 shows `apps/landing/.env` (untracked) also sets `VITE_GOOGLE_CLIENT_ID=339469409890-...`. Because Vite inlines `VITE_*` env vars into `dist/assets/*.js` at build time, anyone running `npm run build:all` with that `.env` present will bake that string into `dist/`. Removing or clearing `VITE_GOOGLE_CLIENT_ID=` in `apps/landing/.env` (and rebuilding `dist/`) ensures neither `src/` nor local `dist/` carries it when using backend-provided config.
2. **RH Session Bug (`LoginScreen.jsx:131`)**:
   - Observation A3 shows `salvarSessaoLocal` only branches on `papelAtual === 'terapeuta'` vs `'floravel_mae_sessao'`. When logging in with `papel === 'rh'`, it writes to `floravel_mae_sessao` instead of `floravel_rh_sessao` expected by `apps/rh/src/App.jsx:12`.
3. **Whitespace & Uppercase Email Edge Case (`esqueci-senha` & `redefinir-senha`)**:
   - Observation C1 shows DTOs use Hibernate Validator `@Email`. Standard `@Email` rejects leading/trailing spaces (`" user@example.com "`) with `400 Bad Request` (`MethodArgumentNotValidException` at `GlobalExceptionHandler:62`) BEFORE reaching `AuthService`'s `.trim().toLowerCase()`.
   - Meanwhile, uppercase emails without surrounding whitespace (`"User@Example.COM"`) pass `@Email`, and then `.trim().toLowerCase()` in `AuthService` matches `Usuario.email` (assuming `Usuario` was stored lowercased; in H2 test DB, `VARCHAR` equality is case-sensitive).
   - Therefore, normalizing email in **three** places — (a) frontend `.trim().toLowerCase()` before `fetch`, (b) DTO setter / Jackson trim (or custom normalizing setter `setEmail`) so `@Email` validates trimmed input, and (c) `AuthService` (`trim().toLowerCase()` + null-guard) — eliminates both 400-on-whitespace and H2 case-sensitivity mismatches.
4. **Multiple `esqueci-senha` Requests (Token Invalidation & Race Conditions)**:
   - Observation C2 shows `TokenConfirmacaoEmailRepository.invalidarTokensAnteriores` uses `@Modifying` without `clearAutomatically = true, flushAutomatically = true`. If an entity is already managed in the Hibernate session (e.g., inside a test or multi-step service call), the bulk JPQL `UPDATE` leaves stale `usado = false` in the persistence context.
   - Under sequential `esqueci-senha` calls, `invalidarTokensAnteriores` invalidates prior tokens so old codes fail; under **concurrent** `esqueci-senha` calls (e.g., double-click), two transactions in `READ_COMMITTED` can both execute `UPDATE ... WHERE usado = false` before either inserts its new token, leaving two active `usado = false` rows!
   - When `redefinir-senha` queries `findFirstByUsuarioEmailAndUsadoFalseOrderByDataCriacaoDesc` (plus `IdDesc` tiebreaker), only the newest token is accepted (though if `dataCriacao` timestamps match to the millisecond, `OrderByDataCriacaoDesc` alone is ambiguous). Furthermore, after a successful password reset, invalidating ALL remaining unused tokens for that user guarantees no stale concurrent token can still be used.
5. **BCrypt Hash Lookup & Single-Use Race Condition (`redefinir-senha`)**:
   - Observation C2 vs `PROJECT.md` F1/F2: `TokenConfirmacaoEmail` stores plaintext 6-digit `codigo` (`length = 6`) and queries `findFirstByUsuarioEmailAndCodigoAndUsadoFalse...`. A password-reset token (`TokenRecuperacaoSenha`) MUST store a **BCrypt hash** (`@Column(length = 100)` or `255`). Because BCrypt generates a unique salt per `.encode()` call, the repository CANNOT query by `codigoHash`; it must fetch the latest unused token for `emailNormalizado` and verify `passwordEncoder.matches(codigoLimpo, token.getCodigoHash())`.
   - If two concurrent `redefinir-senha` requests arrive with the same valid code before either commits, both could pass `passwordEncoder.matches(...)` and reset the password twice. Executing an atomic conditional update (`UPDATE TokenRecuperacaoSenha t SET t.usado = true WHERE t.id = :id AND t.usado = false` returning `int`, throwing `CodigoInvalidoException` if `0` rows updated) enforces strict single-use at the database level.
6. **`EmailService` Resilience & Security (`null` `JavaMailSender` / SMTP failure)**:
   - Observation C4 shows `EmailService` injects `@Autowired(required = false) private JavaMailSender mailSender` and wraps `mailSender.send(message)` in `try { ... } catch (Exception e)` with `logDevFallback(...)`. Thus `mailSender == null` or SMTP auth/connection failures in dev/test NEVER throw an exception back to `AuthService` or `MaeService`.
   - Note two subtleties: (a) `application.properties:41` sets `spring.mail.host=sandbox.smtp.mailtrap.io`, so Spring Boot instantiates a real `JavaMailSenderImpl` in `@SpringBootTest` that fails on `send()` and hits `catch (Exception e)`; (b) `EmailService.java:24` logs the plaintext code unconditionally at `INFO` level before SMTP runs, which leaks password-reset OTPs into production logs! Also, `@Async` `void` methods receive primitive `String` args (good — avoids `LazyInitializationException` across async boundary) and interpolate `nomeExibicao` into HTML without escaping.
7. **`JwtAuthInterceptor` Coverage**:
   - Observation C5 confirms `JwtAuthInterceptor.ehRotaPublica` (`JwtAuthInterceptor.java:121`) matches `path.startsWith("/api/auth/")` before checking the `Authorization` header. Therefore `/api/auth/esqueci-senha` and `/api/auth/redefinir-senha` are ALREADY permitted without a JWT (and even if a client sends an expired `Authorization` header). No edit to `JwtAuthInterceptor.java` is required in M1.

---

## 3. Caveats

- **Read-only audit**: No code was modified and no tests (`mvnw.cmd test` / `npm run build:all`) were executed in this task.
- **Outside-M1 backend fallback secrets**: `JwtService.java:30` and `AesGcmAttributeConverter.java:31` contain `FALLBACK_DEV_SECRET` constants, and `DemoDayDataSeeder.java` / `OpenApiSwaggerController.java` contain demo `"floravel123"` passwords. Those files are outside M1 write ownership (`PROJECT.md:86-90`), so M1 Worker should not touch them, though M5 / Challengers should be aware of them when scanning for AC4 false positives vs real secrets.
- **`apps/landing/.env`**: Exists locally on disk (gitignored) with `VITE_GOOGLE_CLIENT_ID=339469409890-...`. Whether `.env` should be cleared or kept for local Google OAuth testing depends on whether AC4 scanning inspects `.env` and `dist/` in addition to tracked source files.

---

## 4. Conclusion

### 4.1 Secrets & Hygiene Fixes Required for M1 (AC4)
1. **`apps/landing/src/Screen/Auth/LoginScreen.jsx:19-21`**: Remove the hardcoded Google Client ID literal `'339469409890-1g5vn0mmj2hir5ishgi0kh2q47rglfb2.apps.googleusercontent.com'` -> `const GOOGLE_CLIENT_ID_PUBLIC = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';`.
2. **`apps/landing/.env`**: Clear `VITE_GOOGLE_CLIENT_ID=` (or verify whether local Google OAuth testing needs it, noting Vite bakes `VITE_*` into `dist/`). Do NOT commit `.env`; keep `.env.example` with placeholder `seu_client_id.apps.googleusercontent.com`.
3. **`apps/landing/src/Screen/Auth/LoginScreen.jsx:130-139`**: Fix `salvarSessaoLocal` for `rh`:
   ```js
   const chave =
     papelAtual === 'terapeuta'
       ? 'floravel_psi_sessao'
       : papelAtual === 'rh'
       ? 'floravel_rh_sessao'
       : 'floravel_mae_sessao';
   ```
4. **No hardcoded secrets in new M1 backend code**: `EmailService` and `TokenRecuperacaoSenha` must rely strictly on Spring properties (`spring.mail.*`, `floravel.mail.from`) and `PasswordEncoder` (BCrypt), with zero hardcoded credentials/tokens.

### 4.2 Concrete Defensive Checks Recommended for M1 Worker

1. **DTO & Service Input Normalization (Whitespace / Uppercase / Nulls)**:
   - In `EsqueciSenhaRequestDTO` and `RedefinirSenhaRequestDTO` (and optionally `LoginRequestDTO` / `ConfirmarEmailRequestDTO` / `ReenviarCodigoRequestDTO`), trim email in the setter (e.g., `public void setEmail(String email) { this.email = email != null ? email.trim() : null; }`) or via Jackson `@JsonDeserialize` so `@Email` does not falsely reject `"  user@email.com  "` with 400.
   - In `RedefinirSenhaRequestDTO`: enforce `@NotBlank @Pattern(regexp = "^\\d{6}$")` on `codigo` (also trim in setter), and `@NotBlank @Size(min = 6, max = 100)` on `novaSenha`.
   - In `AuthService`: always guard null and normalize `emailNormalizado = dto.getEmail().trim().toLowerCase()`, and use `usuarioRepository.findByEmail(emailNormalizado)` (or `findByEmailIgnoreCase`).
   - In `apps/landing` forms (login, cadastro, esqueci-senha, redefinir-senha, confirmar-email): always `.trim().toLowerCase()` email and `.trim()` code before `fetch`.
2. **Anti-Enumeration in `POST /api/auth/esqueci-senha`**:
   - When `usuarioRepository.findByEmail(emailNormalizado)` is empty, do NOT throw `RegraDeNegocioException` (422) or 404 — return the exact same `200 OK` `{ "mensagem": "...", "email": emailNormalizado, "expiracaoMinutos": 15 }` without creating a token or sending an email.
3. **BCrypt Storage & Non-Enumerable Lookup in `TokenRecuperacaoSenha`**:
   - Column `codigo_hash`: `@Column(name = "codigo_hash", nullable = false, length = 100)` (NEVER `length = 6`, since BCrypt hashes are 60 chars!).
   - Query active token by email/user (`findFirstByUsuarioEmailAndUsadoFalseOrderByDataCriacaoDescIdDesc(emailNormalizado)`), check `!token.isExpirado()` and `passwordEncoder.matches(codigoLimpo, token.getCodigoHash())`.
   - Tip: If the latest unused token is expired, throw `CodigoExpiradoException` (400) ONLY if the code matches? Wait — think carefully!
     - If `token.isExpirado()` is checked *before* `passwordEncoder.matches`, an attacker submitting a wrong code `"000000"` against an expired token learns the token is expired (`CodigoExpiradoException`), whereas checking `passwordEncoder.matches` first ensures wrong code ALWAYS returns `CodigoInvalidoException` ("Código inválido ou já utilizado"), and a valid-but-expired code returns `CodigoExpiradoException`! Checking `passwordEncoder.matches` BEFORE `token.isExpirado()` is cleaner and avoids leaking token state on wrong codes.
4. **Sequential & Concurrent Token Invalidation + Atomic Single-Use**:
   - Annotate `invalidarTokensAnteriores` with `@Modifying(clearAutomatically = true, flushAutomatically = true)`.
   - Add an atomic consume query on `TokenRecuperacaoSenhaRepository`:
     ```java
     @Modifying(clearAutomatically = true, flushAutomatically = true)
     @Query("UPDATE TokenRecuperacaoSenha t SET t.usado = true WHERE t.id = :id AND t.usado = false")
     int consumirTokenAtomicamente(@Param("id") String id);
     ```
     In `redefinirSenha`, after verifying hash and non-expiration, assert `consumirTokenAtomicamente(token.getId()) == 1` (else throw `CodigoInvalidoException`), update `usuario.setSenha(passwordEncoder.encode(dto.getNovaSenha()))`, save `usuario`, and also call `invalidarTokensAnteriores(usuario)` to sweep any concurrent leftover tokens.
   - Add `IdDesc` as secondary sort (`OrderByDataCriacaoDescIdDesc`) to handle same-millisecond concurrent inserts deterministically.
5. **Post-Validation Welcome Email (`AuthService.confirmarEmail` — F3)**:
   - Call `emailService.enviarEmailBoasVindas(usuario.getEmail(), usuario.getNome())` ONLY inside the transition branch (after `usuarioRepository.save(usuario)` at line 100), NEVER in the `if (Boolean.TRUE.equals(usuario.getEmailVerificado()))` early-return branch (lines 80-86).
6. **`EmailService` Security & Resilience**:
   - Do NOT log the plaintext password-reset 6-digit code unconditionally at `INFO` level before `mailSender.send()` (only log inside `logDevFallback` when `mailSender == null` or SMTP fails, so production SMTP deliveries don't leak reset OTPs to logs).
   - HTML-escape `nomeExibicao` (e.g., `org.springframework.web.util.HtmlUtils.htmlEscape(nomeExibicao)`) before `.formatted(...)` in HTML email templates to prevent HTML injection.
   - Keep passing primitive `String` arguments (`email`, `nome`, `codigo`) to `@Async` methods rather than JPA entities (`Usuario`), avoiding `LazyInitializationException` and uncommitted-transaction reads.
7. **Frontend Double-Submit & UX State Hygiene (`apps/landing`)**:
   - Disable submit buttons while `fetch` is in flight (`carregando`) to mitigate double-click races; clear stale errors when switching steps/modals.

### 4.3 Recommended Test Assertions for M1 Worker & Challengers

**Backend (`AuthControllerTest` / `AuthServiceTest` / `EmailServiceTest`)**:
1. **Password Reset Happy Path**: `POST /api/auth/esqueci-senha` -> `200 OK` (`expiracaoMinutos: 15`, `TokenRecuperacaoSenha` persisted with BCrypt hash != raw 6-digit code, `usado == false`); `POST /api/auth/redefinir-senha` with valid code -> `200 OK` (`redefinida: true`), `token.usado == true`; `POST /api/auth/login` with old password fails (`422`), with new password succeeds (`200` + JWT).
2. **Anti-Enumeration**: `POST /api/auth/esqueci-senha` for non-existent email returns `200 OK` with identical JSON structure (`expiracaoMinutos: 15`), zero tokens created, zero emails sent.
3. **Whitespace & Uppercase Email**: `POST /api/auth/esqueci-senha` and `POST /api/auth/redefinir-senha` with `"  MARIANA.Teste@Email.COM  "` normalize properly, return `200 OK`, and authenticate with lowercase email.
4. **Multiple `esqueci-senha` Invalidation**: Calling `esqueci-senha` twice generates Code1 then Code2; Code1 is marked `usado == true`; `redefinir-senha` with Code1 returns `400 Bad Request` (`CodigoInvalidoException`), while Code2 succeeds (`200 OK`).
5. **Single-Use Reuse Rejection**: Using a valid code in `redefinir-senha` succeeds (`200 OK`), and immediately retrying `redefinir-senha` with the exact same code returns `400 Bad Request` (`CodigoInvalidoException`).
6. **Expired Code (>15 min)**: Token with `dataExpiracao` in the past (`LocalDateTime.now().minusMinutes(1)`) returns `400 Bad Request` (`CodigoExpiradoException`) when submitted with the matching 6-digit code; wrong code on expired token returns `400` (`CodigoInvalidoException`).
7. **Validation Failures**: `redefinir-senha` with `"12345"` (not 6 digits), `"abcdef"`, or 3-char `novaSenha` returns `400 Bad Request` with `validationErrors`.
8. **Welcome Email Idempotency**: `confirmar-email` with valid code invokes `emailService.enviarEmailBoasVindas` **exactly once** (`verify(..., times(1))`); a second `confirmar-email` call on the now-verified user returns `200 OK` without triggering a second welcome email (`verifyNoMoreInteractions`).
9. **`EmailService` Resilience**: Direct test with `mailSender == null` AND with mocked `JavaMailSender` throwing `MailSendException` verifies `enviarCodigoConfirmacao`, `enviarCodigoRecuperacaoSenha`, and `enviarEmailBoasVindas` complete without throwing exceptions.
10. **Public Route Check (`JwtAuthInterceptor`)**: Perform `MockMvc` with `JwtAuthInterceptor` registered (not just `standaloneSetup` without interceptors!) to assert `POST /api/auth/esqueci-senha` and `POST /api/auth/redefinir-senha` succeed without an `Authorization` header (and even with an invalid/expired Bearer token).

**Frontend (`apps/landing` Vitest + Testing Library)**:
1. Forgot password modal/page submits trimmed lowercase email to `POST /api/auth/esqueci-senha`, handles loading/error/success states, and prevents double submit.
2. Reset password form validates 6-digit code & `novaSenha.length >= 6`, submits to `POST /api/auth/redefinir-senha`, displays backend error message on `400`, and transitions to login on `200`.
3. Email confirmation flow submits to `POST /api/auth/confirmar-email` and `POST /api/auth/reenviar-codigo`, showing verified welcome state.
4. `salvarSessaoLocal` stores `'rh'` session under `floravel_rh_sessao` and `floravel_jwt`.
5. Assert `LoginScreen.jsx` does NOT contain any hardcoded `.apps.googleusercontent.com` literal and calls `/api/auth/oauth/google/config` when `VITE_GOOGLE_CLIENT_ID` is unset.

---

## 5. Verification Method

After M1 Worker implements the fixes, independently verify with:

1. **Secrets & Hygiene Scan (AC4)**:
   - Run `grep_search` across `Froravel-Front` and `floravel-backend/Floravel` for `apps.googleusercontent.com`, `339469409890`, `AIza`, `AKIA`, `sk_live_`, `BEGIN .*PRIVATE KEY` -> zero real credentials in `src/`.
   - Confirm `git ls-files .env apps/landing/.env apps/landing/dist` returns empty in both repos.
   - Inspect `apps/landing/src/Screen/Auth/LoginScreen.jsx:19-21` and `130-139` via `view_file`.
2. **Backend Build & Test Suite (AC2 + AC3)**:
   - Run `.\mvnw.cmd clean test` in `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel` -> expect exit code `0`, 0 failures, 0 errors, including the new M1 test cases.
3. **Frontend Build & Test Suite (AC1 + AC3)**:
   - Run `npm test` (Vitest) and `npm run build:all` in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front` -> expect exit code `0`, 0 errors.
4. **Invalidation Conditions**:
   - Findings become invalidated if `JwtAuthInterceptor.ehRotaPublica` is narrowed from `/api/auth/**`, if `TokenRecuperacaoSenha` reuses `TokenConfirmacaoEmail`'s `length = 6` column instead of a BCrypt-sized column, or if `LoginScreen.jsx` retains a default Google Client ID fallback string.
