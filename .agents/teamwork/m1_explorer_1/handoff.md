# M1 Backend Exploration & Implementation Strategy — Handoff Report

**Summary:** The `modules/auth` package already has `CodigoInvalidoException`/`CodigoExpiradoException` wired to HTTP 400 in `GlobalExceptionHandler`, `/api/auth/**` whitelisted in `JwtAuthInterceptor`, `@EnableAsync` on `FloravelApplication`, and `BCryptPasswordEncoder` in `SecurityBeansConfig`. Implementing R1 requires adding `TokenRecuperacaoSenha` (`codigo_hash` VARCHAR(100)), `TokenRecuperacaoSenhaRepository`, 4 DTOs, 2 controller endpoints + service methods (`solicitarRecuperacaoSenha`, `redefinirSenha`), triggering `EmailService.enviarEmailBoasVindas` in `AuthService.confirmarEmail` on first verification, and covering all success/error/async scenarios with proper FK cleanup in `AuthControllerTest` and unit tests.

---

## 1. Observation

### 1.1 Existing Auth Module (`floravel-backend/Floravel/src/main/java/br/com/floravel/floravel/modules/auth/`)
- **`AuthController.java`** (`lines 19–58`): `@RestController` mapped to `/api/auth`, injects `AuthService` and `GoogleOAuthClient`. Exposes `POST /login`, `POST /oauth/google`, `GET /oauth/google/config`, `POST /confirmar-email`, `POST /reenviar-codigo`. No `/esqueci-senha` or `/redefinir-senha` endpoints exist yet.
- **`TokenConfirmacaoEmail.java`** (`lines 10–45`):
  - `@Table(name = "tokens_confirmacao_email")`
  - UUID `@Id` (`length = 36, nullable = false, updatable = false`)
  - `@ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "usuario_id", nullable = false) private Usuario usuario;`
  - `@Column(nullable = false, length = 6) private String codigo;` (plaintext for email confirmation)
  - `@Column(name = "data_expiracao", nullable = false) private LocalDateTime dataExpiracao;`
  - `@Builder.Default @Column(nullable = false) private Boolean usado = false;`
  - `@CreationTimestamp @Column(name = "data_criacao", updatable = false) private LocalDateTime dataCriacao;`
  - `public boolean isExpirado() { return LocalDateTime.now().isAfter(dataExpiracao); }`
- **`TokenConfirmacaoEmailRepository.java`** (`lines 14–24`):
  - `findFirstByUsuarioAndUsadoFalseOrderByDataCriacaoDesc(Usuario usuario)`
  - `findFirstByUsuarioEmailAndCodigoAndUsadoFalseOrderByDataCriacaoDesc(String email, String codigo)`
  - `@Modifying @Query("UPDATE TokenConfirmacaoEmail t SET t.usado = true WHERE t.usuario = :usuario AND t.usado = false") void invalidarTokensAnteriores(@Param("usuario") Usuario usuario);`
- **`AuthService.java`** (`lines 35–237`):
  - `TEMPO_EXPIRACAO_MINUTOS = 15` (`line 49`), `private final SecureRandom secureRandom = new SecureRandom();` (`line 50`), `private final PasswordEncoder passwordEncoder;` (`line 44`).
  - `gerarEEnviarCodigoConfirmacao(Usuario)` (`lines 52–71`): calls `tokenRepository.invalidarTokensAnteriores(usuario)`, generates `String.format("%06d", secureRandom.nextInt(1_000_000))`, saves `TokenConfirmacaoEmail` with `LocalDateTime.now().plusMinutes(15)`, invokes `emailService.enviarCodigoConfirmacao(...)`.
  - `confirmarEmail(ConfirmarEmailRequestDTO)` (`lines 73–109`): normalizes email (`trim().toLowerCase()`), checks `if (Boolean.TRUE.equals(usuario.getEmailVerificado()))` (`line 80`) and returns early, validates `TokenConfirmacaoEmail`, sets `token.setUsado(true)` & `usuario.setEmailVerificado(true)`, saves both, returns `ConfirmarEmailResponseDTO` (`lines 104–108`). Does **not** call any welcome email method yet.
  - `autenticar(LoginRequestDTO)` (`line 142`): validates password via `passwordEncoder.matches(dto.getSenha(), usuario.getSenha())`.
- **`EmailService.java`** (`lines 12–113`):
  - `@Autowired(required = false) private JavaMailSender mailSender;` (`lines 16–17`)
  - `@Value("${floravel.mail.from:nao-responda@floravel.com.br}") private String remetente;` (`lines 19–20`)
  - `@Async public void enviarCodigoConfirmacao(String destinatario, String nome, String codigo)` (`lines 22–49`): logs `"Disparando código de verificação para {}: [{}]"`, falls back to `logDevFallback(...)` if `mailSender == null` or if `mailSender.send(message)` throws any `Exception`.
  - `gerarTemplateEmailHtml(String nome, String codigo)` (`lines 63–112`): inline CSS HTML template (`#FAF7F5` background, `#2D5A43` brand green, `#EAE3DE` border), injects `nomeExibicao` and `codigo` via `.formatted(nomeExibicao, codigo)`. Note: `nomeExibicao` is not currently HTML-escaped.
- **Exceptions**: `CodigoInvalidoException.java` (`lines 3–7`) and `CodigoExpiradoException.java` (`lines 3–7`) both extend `RuntimeException`.
- **DTO conventions**:
  - `ConfirmarEmailRequestDTO.java` (`lines 15–21`): `@NotBlank`, `@Email`, `@Pattern(regexp = "^\\d{6}$", message = "...")` with Lombok `@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder`.
  - `CadastroMaeRequestDTO.java` (`lines 29–31`): `@NotBlank` + `@Size(min = 6, max = 100, message = "A senha deve conter no mínimo 6 caracteres")`.

### 1.2 Shared Infrastructure & Global Exception Handling
- **`GlobalExceptionHandler.java`** (`lines 30–162`):
  - `RegraDeNegocioException` → **HTTP 422** (`HttpStatus.UNPROCESSABLE_ENTITY`, `"Regra de Negócio Violada"`, `lines 56–59`).
  - `MethodArgumentNotValidException` → **HTTP 400** (`HttpStatus.BAD_REQUEST`, `"Dados Inválidos"`, `validationErrors` map, `lines 62–79`).
  - `CodigoInvalidoException` → **HTTP 400** (`HttpStatus.BAD_REQUEST`, `"Código Inválido"`, `lines 82–85`).
  - `CodigoExpiradoException` → **HTTP 400** (`HttpStatus.BAD_REQUEST`, `"Código Expirado"`, `lines 87–90`).
- **`JwtAuthInterceptor.java`** (`lines 119–130`): `ehRotaPublica` returns `true` for `path.startsWith("/api/auth/")`.
- **`SecurityBeansConfig.java`** (`lines 11–14`): exposes `BCryptPasswordEncoder` as `PasswordEncoder` bean.
- **`FloravelApplication.java`** (`lines 7–8`): `@EnableAsync` is enabled.
- **`application.properties`** (`lines 8–48`):
  - `spring.jpa.hibernate.ddl-auto=update` (`line 17`), `spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect` (`line 16`).
  - `spring.mail.host=${SPRING_MAIL_HOST:sandbox.smtp.mailtrap.io}` (`line 41`), `spring.mail.username=${SPRING_MAIL_USERNAME:floravel_mail_user}` (`line 43`), `spring.mail.password=${SPRING_MAIL_PASSWORD:floravel_mail_pass}` (`line 44`).
  - `floravel.mail.from=${FLORAVEL_MAIL_FROM:acolhimento@floravel.com.br}` (`line 48`).

### 1.3 Existing Tests & Runtime Evidence
- **`AuthControllerTest.java`** (`lines 34–196`): `@SpringBootTest` using `MockMvcBuilders.standaloneSetup(authController).setControllerAdvice(new GlobalExceptionHandler()).build()`.
  - `setUp()` (`lines 64–66`): deletes `tokenRepository.deleteAll()`, `maeRepository.deleteAll()`, `usuarioRepository.deleteAll()`.
  - Other tests calling `usuarioRepository.deleteAll()`: `MaeControllerTest.java:63`, `PsicologoPersistenciaAndSecurityTest.java:86`, `ValidacaoGovernoTest.java:76`.
- **`TEST-br.com.floravel.floravel.modules.auth.controller.AuthControllerTest.xml`** (`lines 129, 171–179, 608–680`):
  - Confirms tests run against MySQL (`tokens_confirmacao_email`, `usuarios`, `limit ?`).
  - Confirms `@Async` `EmailService` executes on `task-*` threads, attempts SMTP connection because `spring.mail.host` defaults to `sandbox.smtp.mailtrap.io`, catches `MailAuthenticationException`, and triggers `logDevFallback`.
- **`PsicologoPersistenciaAndSecurityTest.java`** (`line 27`): Spring Boot 4.1.2 uses `org.springframework.test.context.bean.override.mockito.MockitoBean` (and `MockitoSpyBean` in the same package).
- **`PsicologoServiceTest.java`** (`lines 24–37`): Unit test pattern uses `@ExtendWith(MockitoExtension.class)` with `@Mock` + `@InjectMocks`.

---

## 2. Logic Chain

1. **BCrypt Hash Lookup Requirement** (from Obs 1.1 `PasswordEncoder` & `TokenConfirmacaoEmailRepository`):
   - `BCryptPasswordEncoder.encode(codigo)` generates a salted ~60-character hash (`$2a$10$...`). Because every call produces a distinct salt, SQL equality on `codigo_hash` cannot match a raw 6-digit code.
   - Therefore: (a) `TokenRecuperacaoSenha.codigoHash` must have `length >= 60` (use `length = 100` in `@Column(name = "codigo_hash", nullable = false, length = 100)`), and (b) `TokenRecuperacaoSenhaRepository` must query the active token by `usuario.email` (`usado = false`, ordered by `dataCriacao DESC`), while `AuthService.redefinirSenha` verifies `passwordEncoder.matches(codigoLimpo, token.getCodigoHash())` in Java.

2. **Check Hash Before Expiration & Map Missing Token to 400** (from Obs 1.2 `GlobalExceptionHandler`):
   - `GlobalExceptionHandler` maps `RegraDeNegocioException` to **422** and `CodigoInvalidoException`/`CodigoExpiradoException` to **400**.
   - In `PROJECT.md` Interface Contracts (`lines 48–49`), `POST /api/auth/redefinir-senha` specifies `400 Bad Request` for wrong, unknown, already-used, or expired codes.
   - Therefore, `redefinirSenha` must throw `CodigoInvalidoException` (not `RegraDeNegocioException`) when no active unused token exists for the normalized email, and must check `passwordEncoder.matches(...)` **before** `token.isExpirado()`. That prevents leaking whether an expired token exists to someone guessing wrong codes while returning `CodigoExpiradoException` (400) when the authentic code is expired (`> 15` minutes).

3. **Prevent Account Enumeration on `esqueci-senha`** (from `PROJECT.md` line 45 & Obs 1.1):
   - When `usuarioRepository.findByEmail(emailNormalizado)` is empty, `solicitarRecuperacaoSenha` must skip token creation and email sending, yet return the exact same `200 OK` `EsqueciSenhaResponseDTO` (`expiracaoMinutos = 15`, generic message).

4. **Welcome Email Trigger Only on First Verification** (from Obs 1.1 `AuthService.confirmarEmail:80-108`):
   - Line 80 returns early if `Boolean.TRUE.equals(usuario.getEmailVerificado())`.
   - Placing `emailService.enviarEmailBoasVindas(usuario.getEmail(), usuario.getNome())` immediately after `usuarioRepository.save(usuario)` (line 100) guarantees the `@Async` welcome email is triggered **only** on the `false -> true` transition.

5. **Test Isolation & FK Safety** (from Obs 1.3 `AuthControllerTest` & `AuthControllerTest.xml`):
   - Tests persist to real MySQL (`floraveldb`) and other suites call `usuarioRepository.deleteAll()`.
   - Adding a new child table `tokens_recuperacao_senha` with `NOT NULL` FK `usuario_id -> usuarios(id)` means `AuthControllerTest` must delete from `tokenRecuperacaoSenhaRepository.deleteAll()` in `@BeforeEach` **and** `@AfterEach` before `usuarioRepository.deleteAll()`, preventing FK constraint failures both within `AuthControllerTest` and across subsequent test classes.
   - Because `EmailService` methods are `@Async` and `TokenRecuperacaoSenha` stores only `codigoHash` (not plaintext), `AuthControllerTest` should use `@MockitoSpyBean EmailService` + `ArgumentCaptor<String>` with `verify(emailService, timeout(3000))...` to capture the generated 6-digit code in-flight and verify `enviarEmailBoasVindas` execution, complemented by synchronous `@ExtendWith(MockitoExtension.class)` unit tests in `AuthServiceTest` and `EmailServiceTest`.

---

## 3. Exact Implementation Strategy for M1 Backend

### 3.1 Entity & Repository
1. **`br.com.floravel.floravel.modules.auth.model.TokenRecuperacaoSenha`**
   - `@Entity`, `@Table(name = "tokens_recuperacao_senha")`, `@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder`
   - Fields:
     - `@Id @GeneratedValue(strategy = GenerationType.UUID) @Column(length = 36, nullable = false, updatable = false) private String id;`
     - `@ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "usuario_id", nullable = false) private Usuario usuario;`
     - `@Column(name = "codigo_hash", nullable = false, length = 100) private String codigoHash;`
     - `@Column(name = "data_expiracao", nullable = false) private LocalDateTime dataExpiracao;`
     - `@Builder.Default @Column(nullable = false) private Boolean usado = false;`
     - `@CreationTimestamp @Column(name = "data_criacao", updatable = false) private LocalDateTime dataCriacao;`
   - Helper: `public boolean isExpirado() { return LocalDateTime.now().isAfter(dataExpiracao); }`

2. **`br.com.floravel.floravel.modules.auth.repository.TokenRecuperacaoSenhaRepository`**
   ```java
   @Repository
   public interface TokenRecuperacaoSenhaRepository extends JpaRepository<TokenRecuperacaoSenha, String> {

       Optional<TokenRecuperacaoSenha> findFirstByUsuarioAndUsadoFalseOrderByDataCriacaoDesc(Usuario usuario);

       Optional<TokenRecuperacaoSenha> findFirstByUsuarioEmailAndUsadoFalseOrderByDataCriacaoDesc(String email);

       @Modifying(flushAutomatically = true)
       @Query("UPDATE TokenRecuperacaoSenha t SET t.usado = true WHERE t.usuario = :usuario AND t.usado = false")
       void invalidarTokensAnteriores(@Param("usuario") Usuario usuario);
   }
   ```

### 3.2 DTOs (`br.com.floravel.floravel.modules.auth.dto`)
1. **`EsqueciSenhaRequestDTO`** (`@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder`):
   - `@NotBlank(message = "O e-mail é obrigatório.")`
   - `@Email(message = "Formato de e-mail inválido.")`
   - `private String email;`
2. **`EsqueciSenhaResponseDTO`** (`@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder`):
   - `private String mensagem;`
   - `private String email;`
   - `private int expiracaoMinutos;` (set to `15`)
3. **`RedefinirSenhaRequestDTO`** (`@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder`):
   - `@NotBlank(message = "O e-mail é obrigatório.")`
   - `@Email(message = "Formato de e-mail inválido.")`
   - `private String email;`
   - `@NotBlank(message = "O código de recuperação é obrigatório.")`
   - `@Pattern(regexp = "^\\d{6}$", message = "O código de recuperação deve conter exatamente 6 dígitos numéricos.")`
   - `private String codigo;`
   - `@NotBlank(message = "A nova senha é obrigatória.")`
   - `@Size(min = 6, max = 100, message = "A nova senha deve conter no mínimo 6 caracteres.")`
   - `private String novaSenha;`
4. **`RedefinirSenhaResponseDTO`** (`@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder`):
   - `private boolean redefinida;`
   - `private String mensagem;`
   - `private String email;`

### 3.3 `AuthController` & `AuthService`
1. **`AuthController.java`** — add 2 endpoints under `@RequestMapping("/api/auth")`:
   - `@PostMapping("/esqueci-senha")` → `ResponseEntity<EsqueciSenhaResponseDTO> esqueciSenha(@Valid @RequestBody EsqueciSenhaRequestDTO dto)` → returns `ResponseEntity.ok(authService.solicitarRecuperacaoSenha(dto))`.
   - `@PostMapping("/redefinir-senha")` → `ResponseEntity<RedefinirSenhaResponseDTO> redefinirSenha(@Valid @RequestBody RedefinirSenhaRequestDTO dto)` → returns `ResponseEntity.ok(authService.redefinirSenha(dto))`.
2. **`AuthService.java`**:
   - Inject `private final TokenRecuperacaoSenhaRepository tokenRecuperacaoSenhaRepository;`
   - `confirmarEmail(ConfirmarEmailRequestDTO dto)`: after `usuarioRepository.save(usuario);` (line 100), call `emailService.enviarEmailBoasVindas(usuario.getEmail(), usuario.getNome());`.
   - `@Transactional public EsqueciSenhaResponseDTO solicitarRecuperacaoSenha(EsqueciSenhaRequestDTO dto)`:
     - `String emailNormalizado = dto.getEmail().trim().toLowerCase();`
     - `usuarioRepository.findByEmail(emailNormalizado).ifPresent(usuario -> { ... });`
       - `tokenRecuperacaoSenhaRepository.invalidarTokensAnteriores(usuario);`
       - `String codigo = String.format("%06d", secureRandom.nextInt(1_000_000));`
       - Build & save `TokenRecuperacaoSenha` with `codigoHash = passwordEncoder.encode(codigo)`, `dataExpiracao = LocalDateTime.now().plusMinutes(TEMPO_EXPIRACAO_MINUTOS)`, `usado = false`.
       - Call `emailService.enviarCodigoRecuperacaoSenha(usuario.getEmail(), usuario.getNome(), codigo);`
     - Return `EsqueciSenhaResponseDTO.builder().mensagem("Se o e-mail informado estiver cadastrado, enviaremos um código de 6 dígitos para redefinição de senha.").email(emailNormalizado).expiracaoMinutos(TEMPO_EXPIRACAO_MINUTOS).build();`
   - `@Transactional public RedefinirSenhaResponseDTO redefinirSenha(RedefinirSenhaRequestDTO dto)`:
     - `String emailNormalizado = dto.getEmail().trim().toLowerCase();`
     - `String codigoLimpo = dto.getCodigo().trim();`
     - Lookup `TokenRecuperacaoSenha token = tokenRecuperacaoSenhaRepository.findFirstByUsuarioEmailAndUsadoFalseOrderByDataCriacaoDesc(emailNormalizado).orElseThrow(() -> new CodigoInvalidoException("Código de recuperação incorreto ou já utilizado."));`
     - Check BCrypt match: `if (!passwordEncoder.matches(codigoLimpo, token.getCodigoHash())) { throw new CodigoInvalidoException("Código de recuperação incorreto ou já utilizado."); }`
     - Check TTL: `if (token.isExpirado()) { throw new CodigoExpiradoException("Este código de recuperação expirou. Solicite um novo código."); }`
     - Single-use + encode new password:
       - `Usuario usuario = token.getUsuario();`
       - `token.setUsado(true); tokenRecuperacaoSenhaRepository.save(token);`
       - `tokenRecuperacaoSenhaRepository.invalidarTokensAnteriores(usuario);`
       - `usuario.setSenha(passwordEncoder.encode(dto.getNovaSenha()));` (do **not** trim password)
       - `usuarioRepository.save(usuario);`
     - Return `RedefinirSenhaResponseDTO.builder().redefinida(true).mensagem("Senha redefinida com sucesso! Você já pode fazer login com sua nova senha.").email(emailNormalizado).build();`

### 3.4 `EmailService` Templates & Dev Fallback
- Escape user `nome` via `org.springframework.web.util.HtmlUtils.htmlEscape(nome.trim())` in all HTML templates to prevent HTML injection.
- Reuse a private `enviarEmailHtml(String destinatario, String assunto, String html, Runnable devFallback)` helper:
  - Uses injected `JavaMailSender` (`@Autowired(required = false)`) and `@Value("${floravel.mail.from:nao-responda@floravel.com.br}")`.
  - Zero credentials in `EmailService.java`.
  - If `mailSender == null` or `mailSender.send(...)` throws `Exception`, invokes `devFallback.run()` (structured log block).
- Add `@Async public void enviarCodigoRecuperacaoSenha(String destinatario, String nome, String codigo)`:
  - Subject: `"🔐 Florável - Código para redefinição de senha"` (avoid putting the code in the subject/info logs in prod; only log code in `devFallback`).
  - HTML template in Florável palette (`#FAF7F5` / `#2D5A43`), displaying the 6-digit code, 15-minute validity, single-use notice, and security disclaimer.
- Add `@Async public void enviarEmailBoasVindas(String destinatario, String nome)`:
  - Subject: `"🌸 Bem-vinda à Florável! Seu cadastro foi confirmado"`
  - HTML template congratulating verified account, outlining access to emotional support, screening, and support circles, and dev fallback log.

### 3.5 Test Strategy (`modules/auth`)
1. **`AuthControllerTest.java`** (`@SpringBootTest` + `@MockitoSpyBean private EmailService emailService`):
   - Inject `TokenRecuperacaoSenhaRepository tokenRecuperacaoSenhaRepository`.
   - Clean `tokenRecuperacaoSenhaRepository.deleteAll()` **before** `usuarioRepository.deleteAll()` in both `@BeforeEach` and `@AfterEach`.
   - Update `deveConfirmarEmailComCodigoValido`: add `verify(emailService, timeout(3000).times(1)).enviarEmailBoasVindas("mariana.confirmacao@email.com", "Mariana Teste");`, and also test that calling `confirmar-email` a second time when already verified does **not** invoke `enviarEmailBoasVindas` again (`times(1)` total).
   - Add R1 integration test cases:
     1. `deveSolicitarRecuperacaoSenhaParaEmailConhecido`: `POST /api/auth/esqueci-senha` → `200`, `expiracaoMinutos == 15`, DB has 1 `TokenRecuperacaoSenha` with `usado == false`, `codigoHash` != plaintext & `passwordEncoder.matches(capturedCode, codigoHash) == true`, and `verify(emailService, timeout(3000))` invoked.
     2. `deveRetornar200SemVazarExistenciaParaEmailDesconhecido`: `POST /api/auth/esqueci-senha` with non-existent email → `200`, same response shape, 0 tokens saved, `verify(emailService, never()).enviarCodigoRecuperacaoSenha(...)`.
     3. `deveInvalidarTokensAnterioresAoSolicitarNovoCodigoRecuperacao`: two `esqueci-senha` calls → first token becomes `usado == true`, only latest token has `usado == false`.
     4. `deveRedefinirSenhaComCodigoValidoEMarcarTokenComoUsado`: `esqueci-senha` → capture code via `ArgumentCaptor` → `POST /api/auth/redefinir-senha` → `200` (`redefinida == true`), token `usado == true`, old password fails login (`422`), new password succeeds login (`200` with `tokenSessao`).
     5. `deveRetornar400QuandoCodigoRecuperacaoForIncorreto`: `esqueci-senha` → `redefinir-senha` with wrong 6-digit code → `400`, `$.error == "Código Inválido"`, token remains `usado == false` and password unchanged.
     6. `deveRetornar400QuandoCodigoRecuperacaoEstiverExpirado`: create token with `dataExpiracao = LocalDateTime.now().minusMinutes(1)` (or backdate after `esqueci-senha`) → `redefinir-senha` with matching code → `400`, `$.error == "Código Expirado"`.
     7. `deveRetornar400QuandoCodigoRecuperacaoForReutilizado`: complete `redefinir-senha` once (`200`), call `redefinir-senha` again with the same code → `400`, `$.error == "Código Inválido"`.
     8. `deveRetornar400ParaErrosDeValidacaoEmEsqueciERedefinirSenha`: invalid email, non-6-digit code (`"123"` / `"abcdef"`), short `novaSenha` (`"123"`) → `400`, `$.error == "Dados Inválidos"`, `$.validationErrors` populated.
2. **`AuthServiceTest.java`** (`@ExtendWith(MockitoExtension.class)`):
   - Fast unit tests verifying BCrypt encoding of reset code, 15-min TTL (`Duration.between(now, dataExpiracao)` ≈ 15 min), invalidation call order, and `confirmarEmail` calling `enviarEmailBoasVindas` only on first verification.
3. **`EmailServiceTest.java`**:
   - Unit test verifying `enviarCodigoRecuperacaoSenha` and `enviarEmailBoasVindas` run safely with `mailSender == null` (dev fallback) and with a mocked `JavaMailSender` (verifying `MimeMessage` subject & HTML body without throwing when `send` fails).

---

## 4. Caveats

1. **Placeholder Mail Credentials in `application.properties`**: `application.properties:43–44` currently defines `spring.mail.username=${SPRING_MAIL_USERNAME:floravel_mail_user}` and `spring.mail.password=${SPRING_MAIL_PASSWORD:floravel_mail_pass}` (plus DB fallback `:1234` at line 10). M1's write-ownership boundary (`PROJECT.md:86`) covers `modules/auth/**`, not `application.properties`; coordinate with the orchestrator/M4 if AC4 requires clearing those default fallback literals from `application.properties`.
2. **Test Database Dependency**: Existing `@SpringBootTest` suites (`AuthControllerTest`, `MaeControllerTest`, etc.) connect to local MySQL `floraveldb` via `application.properties` (`src/test/resources` does not exist). MySQL must be running locally when executing `.\mvnw.cmd clean test`.
3. **Spring Boot `@MockitoSpyBean` + `@Async` Behavior**: Because `EmailService` uses `@Async`, `AuthControllerTest` must use `Mockito.timeout(3000)` on `verify(emailService, ...)` calls rather than synchronous `verify(...)`.

---

## 5. Verification Method

Once M1 Backend changes are implemented:
1. **Run full Maven test suite** from `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel`:
   ```powershell
   .\mvnw.cmd clean test
   ```
   Confirm exit code `0`, 0 failures, 0 errors across all test classes (including `AuthControllerTest`, `AuthServiceTest`, `EmailServiceTest`, `MaeControllerTest`, `PsicologoPersistenciaAndSecurityTest`, `ValidacaoGovernoTest`).
2. **Verify no hardcoded secrets** in `modules/auth/**`:
   Inspect `EmailService.java`, `AuthService.java`, `AuthController.java`, and new DTOs/models to confirm zero SMTP passwords, API keys, or JWT secrets.
3. **Invalidation conditions**:
   - Any FK constraint error in `MaeControllerTest`, `PsicologoPersistenciaAndSecurityTest`, or `ValidacaoGovernoTest` indicates missing cleanup of `tokens_recuperacao_senha` in `AuthControllerTest`.
   - Any `422` instead of `400` on `/api/auth/redefinir-senha` indicates `RegraDeNegocioException` was thrown instead of `CodigoInvalidoException`/`CodigoExpiradoException`.
