# Step 0 Backend Survey Report — Florável (`floravel-backend/Floravel`)

**Core Summary:** The backend at `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel` is a **Java 21 / Spring Boot 4.1.2** modular monolith using **custom MVC `HandlerInterceptor` JWT auth (`JwtAuthInterceptor` + `JwtService`)** and **`spring-security-crypto` (`BCryptPasswordEncoder`)** rather than `spring-boot-starter-security`. For **R1**, 6-digit email verification (`TokenConfirmacaoEmail` + `@Async EmailService`) is implemented for `Mae` registration, whereas **password reset (15-min, single-use, BCrypt-hashed code)** and **post-confirmation welcome email** are absent; for **R4**, `fotoUrl` (`VARCHAR(500)`) exists on `Usuario` and `Psicologo` with `PUT` profile updates, while **S3/Cloudflare R2 SDK, configuration, and presigned URL endpoints do not exist**. All **48 baseline tests** pass (`.\mvnw.cmd test` exit 0 in 36.968s), currently running against local MySQL (`floraveldb`) because no `src/test/resources` override exists.

---

## 1. Observation

### 1.1 Project Build, Dependencies & Configuration
- **Repository Root:** `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel`
- **Build File (`pom.xml`):**
  - Parent: `org.springframework.boot:spring-boot-starter-parent:4.1.2` (`pom.xml:5-9`)
  - Coordinates: `br.com.floravel:Floravel:0.0.1-SNAPSHOT` (`pom.xml:11-13`)
  - Java version: `21` (`pom.xml:30`)
  - Runtime/Main Dependencies (`pom.xml:32-87`):
    - `org.springframework.boot:spring-boot-h2console`
    - `org.springframework.boot:spring-boot-starter-data-jpa`
    - `org.springframework.boot:spring-boot-starter-validation`
    - `org.springframework.boot:spring-boot-starter-mail`
    - `org.springframework.boot:spring-boot-starter-webmvc`
    - `org.springframework.boot:spring-boot-devtools` (`runtime`, `optional`)
    - `com.h2database:h2` (`runtime`)
    - `com.mysql:mysql-connector-j` (`runtime`)
    - `org.projectlombok:lombok` (`optional`, configured in `maven-compiler-plugin` `annotationProcessorPaths`)
    - `com.fasterxml.jackson.core:jackson-databind`
    - `com.fasterxml.jackson.datatype:jackson-datatype-jsr310`
    - `org.springframework.security:spring-security-crypto`
  - **Absent Dependencies:** No `spring-boot-starter-security`, no `software.amazon.awssdk:s3` / AWS SDK v2, no MinIO/R2 client, no Spring WebFlux.
  - **Application Entrypoint:** `br.com.floravel.floravel.FloravelApplication` (`src/main/java/br/com/floravel/floravel/FloravelApplication.java:7-15`) annotated with `@EnableAsync` and `@SpringBootApplication`.

- **Properties & Environment Conventions:**
  - `src/main/resources/application.properties` (`1-75`):
    - `spring.config.import=optional:file:.env[.properties]` (line 2)
    - `server.port=${PORT:8080}` (line 3)
    - Datasource: `SPRING_DATASOURCE_URL` (default `jdbc:mysql://localhost:3306/floraveldb?useSSL=false&serverTimezone=America/Sao_Paulo&allowPublicKeyRetrieval=true&characterEncoding=UTF-8`), `SPRING_DATASOURCE_USERNAME` (`root`), `SPRING_DATASOURCE_PASSWORD` (`1234`), `com.mysql.cj.jdbc.Driver` (lines 8-11)
    - JPA: `MySQLDialect`, `ddl-auto=update`, `show-sql=true`, `open-in-view=false` (lines 16-20)
    - Jackson: `date-format=yyyy-MM-dd HH:mm:ss`, `time-zone=America/Sao_Paulo` (lines 23-24)
    - Mail (SMTP): `SPRING_MAIL_HOST` (`sandbox.smtp.mailtrap.io`), `SPRING_MAIL_PORT` (`2525`), `SPRING_MAIL_USERNAME` (`floravel_mail_user`), `SPRING_MAIL_PASSWORD` (`floravel_mail_pass`), `smtp.auth=true`, `starttls.enable=true`, `starttls.required=true`, `floravel.mail.from=${FLORAVEL_MAIL_FROM:acolhimento@floravel.com.br}` (lines 41-48)
    - Governo / OAuth2: `floravel.governo.*`, `floravel.oauth.google.client-id=${FLORAVEL_GOOGLE_CLIENT_ID:}` (lines 54-61)
    - Security: `floravel.security.encryption-key=${FLORAVEL_ENCRYPTION_KEY:}`, `floravel.security.jwt-secret=${FLORAVEL_JWT_SECRET:}`, `floravel.security.jwt-expiration-hours=${FLORAVEL_JWT_EXPIRATION_HOURS:24}`, `floravel.security.enforce-auth=${FLORAVEL_SECURITY_ENFORCE_AUTH:true}` (lines 66-69)
    - CORS: `floravel.cors.allowed-origins=${FLORAVEL_CORS_ALLOWED_ORIGINS:...}` (line 74)
  - `src/main/resources/application-prod.properties` (`1-20`): disables `show-sql`, `format_sql`, `h2.console`, server error details (`stacktrace/message/binding-errors=never`), enforces `floravel.security.enforce-auth=true`, `ddl-auto=${SPRING_JPA_DDL_AUTO:update}`.
  - `.env.example` (`1-30`): documents `SPRING_PROFILES_ACTIVE`, `SPRING_DATASOURCE_*`, `FLORAVEL_JWT_SECRET`, `FLORAVEL_ENCRYPTION_KEY`, `FLORAVEL_SECURITY_ENFORCE_AUTH`, `FLORAVEL_CORS_ALLOWED_ORIGINS`, `FLORAVEL_GOOGLE_CLIENT_ID`, `FLORAVEL_GOVERNO_*`. (`.env` also exists at repo root.)
  - `Dockerfile` (`1-23`): multi-stage `eclipse-temurin:21-jdk-alpine` -> `21-jre-alpine`, `TZ=America/Sao_Paulo`, exposes `8080`.

- **CORS, Security, JWT & Global Exception Handling (`shared/`):**
  - `br.com.floravel.floravel.shared.config.CorsConfig` (`src/main/java/br/com/floravel/floravel/shared/config/CorsConfig.java:10-30`):
    - Implements `WebMvcConfigurer.addCorsMappings`, maps `/**` with `allowedOriginPatterns` from `floravel.cors.allowed-origins` (defaulting to `https://floravel.vercel.app`, `https://*.vercel.app`, `http://localhost:5173..5176`, `http://127.0.0.1:5173..5176`), methods `GET, POST, PUT, PATCH, DELETE, OPTIONS`, headers `Authorization, Content-Type, X-Requested-With, X-Webhook-Signature`, `allowCredentials(true)`.
  - `br.com.floravel.floravel.shared.config.SecurityBeansConfig` (`SecurityBeansConfig.java:8-15`):
    - Exposes `@Bean PasswordEncoder passwordEncoder()` returning `new BCryptPasswordEncoder()`.
  - `br.com.floravel.floravel.shared.config.WebMvcSecurityConfig` (`WebMvcSecurityConfig.java:9-20`):
    - Registers `JwtAuthInterceptor` on `.addPathPatterns("/api/**")`.
  - `br.com.floravel.floravel.shared.security.JwtService` (`JwtService.java:25-154`):
    - Stateless HS256 (HMAC-SHA256) JWT issuer & validator. Key derived via SHA-256 of `floravel.security.jwt-secret` (fallback dev secret if blank).
    - `gerarToken(String usuarioId, String perfilId, String codigoPublico, String role)` sets claims `sub`, `perfilId`, `codigoPublico`, `role`, `iat`, `exp` (`expirationHours`, default 24h).
    - `validarToken(String token)` returns `JwtClaims(usuarioId, perfilId, codigoPublico, role)` or `null` if invalid/expired.
  - `br.com.floravel.floravel.shared.security.JwtAuthInterceptor` (`JwtAuthInterceptor.java:18-155`):
    - `preHandle` checks `enforceAuth` (`true` by default) and allows `OPTIONS`.
    - Public routes (`ehRotaPublica`, lines 119-145): `/api/auth/**`, `/api/governo/**`, `/api/health`, `/api/sala-ao-vivo/**`, `/v3/api-docs/**`, `/swagger-ui/**`, `/swagger-ui.html`, `/error`, `POST /api/maes`, `POST /api/psicologos`, and `GET` on `/api/psicologos`, `/api/psicologos/{id}`, `/api/psicologos/{id}/agenda`, `/api/rodas/**`, `/api/feedbacks/**`.
    - Private `/api/**` routes require `Authorization: Bearer <token>`, sets `request.setAttribute("FLORAVEL_JWT_CLAIMS", claims)`.
    - Role & anti-IDOR rules (`lines 65-115`):
      - `GET /api/maes` -> `PSICOLOGO` or `RH` only.
      - `PATCH /api/maes/{id}/sinalizar-menor` -> `PSICOLOGO` only.
      - `PUT|DELETE /api/maes/{id}` -> if `role == MAE`, `targetId` must match `claims.getPerfilId()` or `claims.getUsuarioId()`.
      - `PUT /api/psicologos/{id}*` -> `PSICOLOGO` only, and first path segment after `/api/psicologos/` must equal `claims.getPerfilId()`.
      - `/api/rh/empresas/**` and `/api/rh/licencas/convite` -> `RH` only.
  - `br.com.floravel.floravel.shared.security.AesGcmAttributeConverter` (`AesGcmAttributeConverter.java:24-128`):
    - JPA `AttributeConverter<String, String>` using AES-256-GCM (`enc:v1:` prefix) on `Usuario.telefone` (`Usuario.java:37`) and `ResponsavelLegal` fields.
  - `br.com.floravel.floravel.shared.exception.GlobalExceptionHandler` (`GlobalExceptionHandler.java:30-162`) & `ErrorResponseDTO` (`ErrorResponseDTO.java:16-26`):
    - `@RestControllerAdvice` mapping:
      - 404: `MaeNaoEncontradaException`, `OnboardingNaoEncontradoException`, `RodaNaoEncontradaException`, `NoResourceFoundException`
      - 409: `EmailJaCadastradoException`, `MaeJaInscritaException`, `DataIntegrityViolationException`
      - 422: `RegraDeNegocioException`, `RodaLotadaException`
      - 400: `MethodArgumentNotValidException` (populates `validationErrors`), `CodigoInvalidoException`, `CodigoExpiradoException`, `TriagemInvalidaException`, `HttpMessageNotReadableException`, `MethodArgumentTypeMismatchException`, `MissingServletRequestParameterException`
      - 405: `HttpRequestMethodNotSupportedException`
      - 500: generic `Exception`

---

### 1.2 R1 — Auth, Email, Registration Validation & Password Reset Survey

#### Existing Classes in `modules/auth` (`br.com.floravel.floravel.modules.auth`)
1. **Controller:** `AuthController` (`modules/auth/controller/AuthController.java:19-58`, `@RequestMapping("/api/auth")`):
   - `POST /api/auth/login` -> `login(@Valid @RequestBody LoginRequestDTO dto)` -> `ResponseEntity<LoginResponseDTO>`
   - `POST /api/auth/oauth/google` -> `loginGoogle(@Valid @RequestBody OAuthGoogleRequestDTO dto)` -> `ResponseEntity<LoginResponseDTO>`
   - `GET /api/auth/oauth/google/config` -> `googleConfig()` -> `Map` (`enabled`, `clientId`)
   - `POST /api/auth/confirmar-email` -> `confirmarEmail(@Valid @RequestBody ConfirmarEmailRequestDTO dto)` -> `ResponseEntity<ConfirmarEmailResponseDTO>`
   - `POST /api/auth/reenviar-codigo` -> `reenviarCodigo(@Valid @RequestBody ReenviarCodigoRequestDTO dto)` -> `ResponseEntity<ConfirmarEmailResponseDTO>`

2. **Model & Repository:**
   - `TokenConfirmacaoEmail` (`modules/auth/model/TokenConfirmacaoEmail.java:10-45`, table `tokens_confirmacao_email`):
     - `String id` (UUID), `@ManyToOne Usuario usuario`, `String codigo` (`nullable = false, length = 6` — **plaintext 6 digits, NOT hashed**), `LocalDateTime dataExpiracao`, `Boolean usado` (`default false`), `LocalDateTime dataCriacao` (`@CreationTimestamp`).
     - Method: `public boolean isExpirado()` (`LocalDateTime.now().isAfter(dataExpiracao)`).
   - `TokenConfirmacaoEmailRepository` (`modules/auth/repository/TokenConfirmacaoEmailRepository.java:14-24`):
     - `Optional<TokenConfirmacaoEmail> findFirstByUsuarioAndUsadoFalseOrderByDataCriacaoDesc(Usuario usuario)`
     - `Optional<TokenConfirmacaoEmail> findFirstByUsuarioEmailAndCodigoAndUsadoFalseOrderByDataCriacaoDesc(String email, String codigo)`
     - `@Modifying @Query("UPDATE TokenConfirmacaoEmail t SET t.usado = true WHERE t.usuario = :usuario AND t.usado = false") void invalidarTokensAnteriores(@Param("usuario") Usuario usuario)`

3. **Services & Clients:**
   - `AuthService` (`modules/auth/service/AuthService.java:35-237`):
     - `TEMPO_EXPIRACAO_MINUTOS = 15`, `SecureRandom secureRandom = new SecureRandom()` (lines 49-50).
     - `gerarEEnviarCodigoConfirmacao(Usuario usuario)` (lines 52-71): calls `tokenRepository.invalidarTokensAnteriores(usuario)`, generates 6-digit code `String.format("%06d", secureRandom.nextInt(1_000_000))`, saves `TokenConfirmacaoEmail` with `now().plusMinutes(15)` and `usado=false`, calls `emailService.enviarCodigoConfirmacao(usuario.getEmail(), usuario.getNome(), codigo)`.
     - `confirmarEmail(ConfirmarEmailRequestDTO dto)` (lines 73-109): normalizes email, loads `Usuario` (throws `RegraDeNegocioException` if not found), short-circuits if `emailVerificado == true`, looks up unused token matching email+code (throws `CodigoInvalidoException`), checks `token.isExpirado()` (throws `CodigoExpiradoException`), sets `token.setUsado(true)` and `usuario.setEmailVerificado(true)`, saves both, returns `ConfirmarEmailResponseDTO`. **Does NOT send any welcome/confirmation email after validation.**
     - `reenviarCodigo(ReenviarCodigoRequestDTO dto)` (lines 111-133): looks up `Usuario`, short-circuits if already verified, otherwise calls `gerarEEnviarCodigoConfirmacao(usuario)`.
     - `autenticar(LoginRequestDTO dto)` (lines 135-168): verifies password using `passwordEncoder.matches(dto.getSenha(), usuario.getSenha())` (BCrypt), resolves `perfilId` (`maeRepository` -> `psicologoRepository` -> fallback `usuario.getId()`), generates JWT via `jwtService.gerarToken(...)`, returns `LoginResponseDTO` (note: login does NOT block unverified emails; it returns `emailVerificado` boolean in `LoginResponseDTO`).
     - `autenticarComGoogle(OAuthGoogleRequestDTO dto)` (lines 170-228): validates `idToken` via `GoogleOAuthClient`, creates `Usuario` (+ `Mae` or `Psicologo`) if new with random BCrypt password `"OAUTH2_" + UUID`, `emailVerificado=true`.
   - `EmailService` (`modules/auth/service/EmailService.java:12-113`):
     - Uses `@Autowired(required = false) private JavaMailSender mailSender;` and `@Value("${floravel.mail.from:nao-responda@floravel.com.br}") private String remetente;`.
     - `@Async public void enviarCodigoConfirmacao(String destinatario, String nome, String codigo)`: sends HTML `MimeMessage` via `JavaMailSender` (UTF-8, sender `"Florável - Acolhimento Materno"`), catching `Exception` and logging dev fallback `[FLORÁVEL EMAIL - DEV / DEMO DAY FALLBACK]`.
     - **Only 1 email method exists (`enviarCodigoConfirmacao`)**; no password reset email method and no welcome email method exist.
   - `GoogleOAuthClient` (`modules/auth/client/GoogleOAuthClient.java:22-95`): validates Google ID token against `oauth2.googleapis.com/tokeninfo`.

4. **DTOs & Exceptions in `modules/auth`:**
   - `LoginRequestDTO` (`email`, `senha`)
   - `LoginResponseDTO` (`usuarioId`, `perfilId`, `codigoPublico`, `nome`, `email`, `tipoPerfil`, `emailVerificado`, `tokenSessao`, `mensagem`)
   - `ConfirmarEmailRequestDTO` (`@NotBlank @Email email`, `@NotBlank @Pattern("^\\d{6}$") codigo`)
   - `ConfirmarEmailResponseDTO` (`verificado`, `mensagem`, `email`)
   - `ReenviarCodigoRequestDTO` (`@NotBlank @Email email`)
   - `OAuthGoogleRequestDTO` (`idToken`, `tipoPerfil` default `"MAE"`)
   - `CodigoExpiradoException`, `CodigoInvalidoException` (both handled as 400 Bad Request in `GlobalExceptionHandler`).

5. **Registration & Password Hashing across Modules:**
   - `MaeService.cadastrarMae` (`modules/mae/service/MaeService.java:47-146`): hashes password via `passwordEncoder.encode(dto.getSenha())`, leaves `emailVerificado` at default `false` (`Usuario.java:56`), saves `Mae` (cascades `Usuario`), calls `authService.gerarEEnviarCodigoConfirmacao(maeSalva.getUsuario())` (`MaeService.java:143`).
   - `PsicologoService.cadastrarPsicologo` (`modules/psicologo/service/PsicologoService.java:35-80`): hashes password via `passwordEncoder.encode(dto.getSenha())`, sets `emailVerificado(true)` (`PsicologoService.java:57`), does NOT trigger email confirmation.

#### Missing Pieces / Gaps for R1
1. **No "Esqueci minha senha" / "Redefinir senha" flow anywhere in the repo:**
   - No endpoints (`POST /api/auth/esqueci-senha`, `POST /api/auth/redefinir-senha` or equivalent) in `AuthController`.
   - No DTOs for forgot-password request/response or reset-password request/response.
   - No password-reset token entity/repository storing **BCrypt-hashed** temporary codes (`TokenConfirmacaoEmail` stores raw 6-digit `codigo` with `length = 6` and cannot hold a 60-char BCrypt hash; a dedicated `TokenRecuperacaoSenha` entity/repository with `codigoHash VARCHAR(255)` or `length = 100`, `dataExpiracao`, `usado`, `@ManyToOne Usuario` is needed).
   - No service logic enforcing: 15-minute expiration, single-use (`usado = true`), invalidation of prior unused reset tokens, `passwordEncoder.matches(codigoInformado, token.getCodigoHash())`, updating `usuario.setSenha(passwordEncoder.encode(novaSenha))`, and safe handling of unknown emails (preventing user enumeration or matching project policy).
   - Note: `AuthService.confirmarEmail` currently queries by `codigo` in SQL (`findFirstByUsuarioEmailAndCodigoAndUsadoFalse...`), which does NOT work for BCrypt hashes because BCrypt uses random salts — password reset lookup MUST query active unused tokens by `usuario.email` (e.g. latest unused token for that user) and verify with `passwordEncoder.matches(rawCode, token.getCodigoHash())`.
2. **No Welcome / Post-Validation Confirmation Email:**
   - `AuthService.confirmarEmail` (`AuthService.java:74-109`) marks `emailVerificado = true` and `token.setUsado(true)` and immediately returns `ConfirmarEmailResponseDTO` without calling `EmailService`.
   - `EmailService` lacks a `@Async enviarEmailBoasVindas(String destinatario, String nome)` (or confirmation email) method and HTML template.

---

### 1.3 R4 — User/Profile Entities & Profile Photo Storage (S3 / Cloudflare R2)

#### Existing Profile Entities, DTOs & Update Endpoints
1. **`Usuario` (`modules/usuario/model/Usuario.java:11-68`, table `usuarios`):**
   - Fields: `id` (UUID), `codigoPublico` (`FLR-XXXXXX`), `nome`, `email` (unique), `senha`, `telefone` (AES-256-GCM encrypted), `fotoUrl` (`@Column(name = "foto_url", length = 500)` at line 41-42), `cidade`, `estado`, `tipoPerfil` (`TipoPerfil`: `MAE`, `PSICOLOGO`, `RH`), `emailVerificado`, `dataCriacao`.
   - No `UsuarioController` or `UsuarioService` exists.
2. **`Mae` (`modules/mae/model/Mae.java:9-44`, table `maes`):**
   - Has `@OneToOne(cascade = CascadeType.ALL) Usuario usuario`. Does NOT duplicate `fotoUrl`.
   - `MaeResponseDTO` (`modules/mae/dto/MaeResponseDTO.java:24,51`) maps `fotoUrl` from `usuario.getFotoUrl()`.
   - `CadastroMaeRequestDTO` (`CadastroMaeRequestDTO.java:36-37`) and `AtualizacaoMaeRequestDTO` (`AtualizacaoMaeRequestDTO.java:23-24`) accept `fotoUrl` (`@Size(max = 500)`).
   - `MaeController.atualizarMae` (`PUT /api/maes/{id}`, `MaeController.java:56-63`) -> `MaeService.atualizarMae` (`MaeService.java:171-200`) sets `usuario.setFotoUrl(dto.getFotoUrl().trim())`. Protected by `JwtAuthInterceptor` (`PUT /api/maes/{id}` anti-IDOR for `MAE`).
3. **`Psicologo` (`modules/psicologo/model/Psicologo.java:12-97`, table `psicologos`):**
   - Has `@OneToOne(cascade = CascadeType.ALL) Usuario usuario` AND duplicates `@Column(name = "foto_url", length = 500) private String fotoUrl;` (`Psicologo.java:30-31`).
   - `PsicologoResponseDTO.fromEntity` (`PsicologoResponseDTO.java:60`) resolves `.fotoUrl(entity.getFotoUrl() != null ? entity.getFotoUrl() : (u != null ? u.getFotoUrl() : null))`.
   - `PsicologoService.atualizarPerfil` (`PUT /api/psicologos/{id}`, `PsicologoController.java:44-50` -> `PsicologoService.java:105-149`) updates BOTH `psicologo.setFotoUrl(...)` and `usuario.setFotoUrl(...)` when `dto.getFotoUrl()` is non-blank (note: `AtualizarPsicologoRequestDTO.fotoUrl` has no `@Size` constraint currently). Protected by `JwtAuthInterceptor` (`PSICOLOGO` + `perfilId` anti-IDOR check).
4. **RH Corporativo (`modules/rh/`):**
   - Entities are `Empresa` (`modules/rh/model/Empresa.java`) and `LicencaColaboradora` (`modules/rh/model/LicencaColaboradora.java`). There is **no `Rh` entity**; RH users are represented by `Usuario` with `TipoPerfil.RH` (see `AuthService.java:152,234`). No RH profile update endpoint exists in `RhCorporativoController` (`RhCorporativoController.java:15-36`).

#### Missing Pieces / Gaps for R4
- **Zero S3 / Cloudflare R2 Integration:**
  - `grep_search` across `src/` for `presign|cloudflare|s3client|multipart|objectstorage|amazon|software.amazon` returned **0 matches**.
  - `pom.xml` has no AWS SDK v2 (`software.amazon.awssdk:s3` / `s3-presigner`) or S3 signing dependency.
  - `application.properties` and `.env.example` have no `FLORAVEL_STORAGE_*` / `S3_*` / `R2_*` properties (endpoint URL for R2 vs AWS S3, region, bucket name, access key, secret key, public base URL, max size, allowed content types).
  - No service/controller exists to generate Presigned `PUT` URLs with image content-type/size validation (e.g., `image/jpeg`, `image/png`, `image/webp`, max bytes), nor to persist/confirm the resulting public `fotoUrl` (or return `uploadUrl` + `publicUrl`/`objectKey` so frontend can upload directly to S3/R2 and save `fotoUrl` on profile update or confirm endpoint).
  - **Interceptor/Auth consideration:** `WebMvcSecurityConfig` applies `JwtAuthInterceptor` to all `/api/**` routes. Any new `/api/storage/presigned-url` or `/api/usuarios/me/foto` endpoint will automatically require a valid `Bearer` JWT (via `ATTR_JWT_CLAIMS`), which is desirable, and `JwtAuthInterceptor` can be extended if role-based/anti-IDOR rules or `RH` photo updates are needed. Also note `CorsConfig` covers backend HTTP calls, while browser direct `PUT` to S3/R2 relies on S3/R2 bucket CORS configuration.

---

### 1.4 Test Infrastructure & Baseline Verification
- **Test Dependencies (`pom.xml:87-107`):**
  - `spring-boot-starter-test` (JUnit 5, Mockito, AssertJ, Spring Test)
  - `spring-boot-starter-data-jpa-test`
  - `spring-boot-starter-validation-test`
  - `spring-boot-starter-webmvc-test`
  - `com.h2database:h2` (`runtime`)
  - **Absent:** No `GreenMail`, no `Testcontainers`, no `spring-security-test`.
- **Test Configuration & Resources:**
  - `src/test/resources` **does not exist** (confirmed by Maven log: `skip non existing resourceDirectory ...\src\test\resources`).
  - There is **no `application-test.properties` or `@ActiveProfiles("test")`** on existing `@SpringBootTest` classes.
  - Because `application.properties` defaults to `jdbc:mysql://localhost:3306/floraveldb`, the `@SpringBootTest` tests actually connected to **MySQL 8.0.46 (`floraveldb`)** during our test run (`task-89.log:56-61`), and tests like `AuthControllerTest` (`AuthControllerTest.java:64-66`), `MaeControllerTest` (`MaeControllerTest.java:60-63`), and `PsicologoPersistenciaAndSecurityTest` (`83-86`) execute `deleteAll()` on tables in `@BeforeEach`.
  - `DemoDayDataSeeder` (`shared/config/DemoDayDataSeeder.java:44,196-204`) checks stack frames for `org.junit.` / `org.apache.maven.surefire.` to skip seeding during tests.
- **Test Patterns Observed:**
  - Unit tests (`PsicologoServiceTest`, etc.) use `@ExtendWith(MockitoExtension.class)` with `@Mock` + `@InjectMocks`.
  - Integration/Controller tests (`AuthControllerTest`, `MaeControllerTest`, `PsicologoPersistenciaAndSecurityTest`) use `@SpringBootTest`:
    - `AuthControllerTest` & `MaeControllerTest` build `MockMvcBuilders.standaloneSetup(controller).setControllerAdvice(new GlobalExceptionHandler())` (does **not** run `JwtAuthInterceptor`).
    - `PsicologoPersistenciaAndSecurityTest` uses `MockMvcBuilders.webAppContextSetup(wac)` for interceptor/JWT tests (`line 206`) and `@MockitoBean GoogleOAuthClient` (`line 74`).
    - `AuthControllerTest` does NOT mock `EmailService`; `EmailService.enviarCodigoConfirmacao` executes `@Async`, attempts SMTP auth against `sandbox.smtp.mailtrap.io:2525`, catches `MailAuthenticationException`, and prints the dev fallback (`task-89.log:185-192`).
- **Existing Test Files (14 total):**
  1. `FloravelApplicationTests.java`
  2. `modules/agendamento/service/AgendamentoServiceTest.java`
  3. `modules/auth/controller/AuthControllerTest.java`
  4. `modules/denuncia/service/DenunciaServiceTest.java`
  5. `modules/feedback/service/FeedbackServiceTest.java`
  6. `modules/mae/controller/MaeControllerTest.java`
  7. `modules/onboarding/service/OnboardingServiceTest.java`
  8. `modules/pagamento/service/PagamentoServiceTest.java`
  9. `modules/psicologo/PsicologoPersistenciaAndSecurityTest.java`
  10. `modules/psicologo/service/PsicologoServiceTest.java`
  11. `modules/rh/service/RhCorporativoServiceTest.java`
  12. `modules/rodaconversa/service/RodaDeConversaServiceTest.java`
  13. `modules/triagem/service/CalculadoraRiscoEdimburgoTest.java`
  14. `modules/validacaogoverno/ValidacaoGovernoTest.java`
- **Baseline Command Results:**
  - `.\mvnw.cmd test-compile` -> **Exit 0** (`BUILD SUCCESS` in `5.114 s`).
  - `.\mvnw.cmd test` -> **Exit 0** (`Tests run: 48, Failures: 0, Errors: 0, Skipped: 0`, `BUILD SUCCESS` in `36.968 s`).

---

## 2. Logic Chain

1. From `pom.xml` and `shared/` (`SecurityBeansConfig`, `WebMvcSecurityConfig`, `JwtAuthInterceptor`, `JwtService`), the application intentionally avoids `spring-boot-starter-security`'s filter chain and instead uses a `HandlerInterceptor` over `/api/**` paired with `spring-security-crypto`'s `BCryptPasswordEncoder`. Therefore, any new R1 endpoints under `/api/auth/**` will automatically be public (`JwtAuthInterceptor.java:121`), while any new R4 upload/presign endpoint under `/api/**` (outside public prefixes) will automatically require a valid `Bearer` JWT (`JwtAuthInterceptor.java:45-60`).
2. From `AuthService`, `TokenConfirmacaoEmail`, and `EmailService`, email OTP infrastructure (`@EnableAsync`, `JavaMailSender` with fallback, `SecureRandom`, 15-min TTL, `usado` flag, `GlobalExceptionHandler` handling `CodigoInvalidoException` and `CodigoExpiradoException` as 400) already exists, **but**:
   - `TokenConfirmacaoEmail.codigo` is `VARCHAR(6)` plaintext and queried directly in SQL (`findFirstByUsuarioEmailAndCodigoAndUsadoFalse...`), so R1 password reset requires a new entity/column capable of storing a ~60-char BCrypt hash and verifying via `passwordEncoder.matches(rawCode, hash)` after fetching the user's latest unused non-expired reset token.
   - `AuthService.confirmarEmail` does not invoke `EmailService` after setting `emailVerificado = true`, so a dedicated `@Async` welcome/confirmation email method in `EmailService` must be added and invoked when confirmation succeeds (not when already verified, or strictly on first confirmation).
3. From `Usuario`, `Mae`, `Psicologo`, and `RhCorporativoController`, profile photos are stored as URL strings (`fotoUrl` up to 500 chars) and currently updated via `PUT /api/maes/{id}` and `PUT /api/psicologos/{id}` (which syncs both `Psicologo.fotoUrl` and `Usuario.fotoUrl`). To support R4 without hardcoding credentials (`ORIGINAL_REQUEST.md:30`), the backend needs AWS SDK v2 S3 (`software.amazon.awssdk:s3`) configured via externalized properties (supporting path-style / custom `endpointOverride` for Cloudflare R2 compatibility as well as AWS S3), strict MIME type & size validation before signing, and an authenticated endpoint returning a presigned `PUT` URL + final object/public URL.
4. From `src/test` and `task-89.log`, tests currently pass (48/48) against local MySQL (`floraveldb`) and trigger real Mailtrap auth attempts in `EmailService`. When adding tests for R1 and R4, we should be mindful not to depend on live S3/R2 or live SMTP (mock `S3Presigner` / `JavaMailSender` or `EmailService` in unit/MockMvc tests, and consider whether `src/test/resources/application-test.properties` with H2 `MODE=MySQL` is appropriate or keep consistent with existing `@SpringBootTest` setup).

---

## 3. Caveats

- `.env` at `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel\.env` was observed in directory listing (`357` bytes) and is imported optionally by `application.properties:2`, but its contents were intentionally not read/printed to avoid exposing local secrets; `.env.example` and `task-89.log` confirmed `application.properties` defaults were active during tests.
- Non-R1/R4 modules (`agendamento`, `denuncia`, `feedback`, `onboarding`, `pagamento`, `rodaconversa`, `triagem`, `validacaogoverno`) and `reuniao` services/repositories beyond `SalaAoVivoController` and `SalaReuniao` were not deeply inspected as they are outside the scope of this R1/R4/config/test survey (covered by the R2/R3 survey scope).
- `Test` execution in `AuthControllerTest` and `MaeControllerTest` uses `standaloneSetup` which bypasses `JwtAuthInterceptor`; new tests for protected R4 endpoints should use `webAppContextSetup(wac)` (like `PsicologoPersistenciaAndSecurityTest.java:206`) to verify JWT authentication/authorization as well as controller behavior.

---

## 4. Conclusion

The Florável Spring Boot backend is cleanly structured (Domain-driven `modules/` + `shared/`), compiles cleanly, and passes all 48 existing tests. To deliver **R1** and **R4** at production quality:
1. **R1 (`modules/auth`):**
   - Add a password-reset token model/repository (e.g., `TokenRecuperacaoSenha` with `codigoHash` `VARCHAR(255)`, 15-min `dataExpiracao`, `usado` boolean, `@ManyToOne Usuario`), DTOs, `AuthService` methods (`solicitarRecuperacaoSenha` / `redefinirSenha`) using `SecureRandom` + `PasswordEncoder` (BCrypt), and `AuthController` endpoints (`POST /api/auth/esqueci-senha`, `POST /api/auth/redefinir-senha`).
   - Add `@Async enviarEmailBoasVindas(String destinatario, String nome)` to `EmailService` and call it in `AuthService.confirmarEmail` upon successful email verification.
2. **R4 (Storage / Profile Photo):**
   - Add AWS SDK v2 S3 (`software.amazon.awssdk:s3`) to `pom.xml` and externalized R2/S3 configuration properties (`application.properties` + `.env.example`) supporting `endpoint` override (Cloudflare R2) and `pathStyleAccessEnabled` with zero hardcoded credentials.
   - Implement a storage service + authenticated endpoint (e.g. `POST /api/storage/presigned-url` or `/api/usuarios/me/foto/presigned-url`) validating allowed image MIME types (`image/jpeg`, `image/png`, `image/webp`) and max file size, returning `uploadUrl`, `publicUrl` (or `objectKey`), and `expiresInSeconds`, and optionally a profile `fotoUrl` sync endpoint for all `TipoPerfil` roles (including `RH`, which currently has no profile update endpoint).
3. **Testing:**
   - Follow existing JUnit 5 + Mockito + `MockMvc` (`webAppContextSetup` for JWT-protected R4 routes) patterns to cover success, invalid/expired/reused reset codes (R1), and invalid content-type/size/unauthenticated access (R4).

---

## 5. Verification Method

To independently verify every claim in this survey:
1. **Build & Test Baseline:**
   - Run in `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel`:
     - `.\mvnw.cmd test-compile` (expected: `BUILD SUCCESS`)
     - `.\mvnw.cmd test` (expected: `Tests run: 48, Failures: 0, Errors: 0, Skipped: 0`, `BUILD SUCCESS`)
2. **Files to Inspect:**
   - Build & Env: `pom.xml`, `src/main/resources/application.properties`, `src/main/resources/application-prod.properties`, `.env.example`
   - Security & Exceptions: `src/main/java/br/com/floravel/floravel/shared/config/{CorsConfig,SecurityBeansConfig,WebMvcSecurityConfig}.java`, `shared/security/{JwtAuthInterceptor,JwtService}.java`, `shared/exception/GlobalExceptionHandler.java`
   - R1: `src/main/java/br/com/floravel/floravel/modules/auth/**` and `modules/mae/service/MaeService.java:142-143`
   - R4: `modules/usuario/model/Usuario.java`, `modules/mae/{controller/MaeController,service/MaeService,dto/AtualizacaoMaeRequestDTO}.java`, `modules/psicologo/{controller/PsicologoController,service/PsicologoService,model/Psicologo,dto/AtualizarPsicologoRequestDTO}.java`
3. **Invalidation Conditions:** Any newly added dependencies in `pom.xml`, new files under `src/test/resources`, or commits modifying `modules/auth` / `shared/security` after `2026-11-20T00:37:30Z` would supersede the baseline snapshot documented here.
