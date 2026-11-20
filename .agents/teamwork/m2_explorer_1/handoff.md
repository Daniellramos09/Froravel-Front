# M2 Backend Deep-Dive Design — RH Corporativo (`modules/rh`, `Usuario`, `DemoDayDataSeeder`, `JwtAuthInterceptor`)

**Summary:** The M2 backend implementation requires adding a nullable `empresaId` (`VARCHAR(36)`) to `Usuario` (and exposing it in `LoginResponseDTO` + `AuthService`), seeding a `TipoPerfil.RH` user (`rh@techmaes.com.br`) linked to `TechMães Brasil S.A.` in `DemoDayDataSeeder` via `@Value("${floravel.demo.rh-password:}")` with zero hardcoded secret literals, expanding `RhCorporativoController` / `RhCorporativoService` with the 6 required company and license-lifecycle endpoints plus DB-backed anti-IDOR `empresaId` ownership enforcement, updating `JwtAuthInterceptor` to protect all `/api/rh/**` routes except `/api/rh/licencas/ativar` (`MAE`), and adding comprehensive unit + full-MVC `MockMvcBuilders.webAppContextSetup` tests.

---

## 1. Observation

### 1.1 `Usuario`, `LoginResponseDTO`, `AuthService`, and `JwtService`
- **`Usuario.java`** (`C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel\src\main\java\br\com\floravel\floravel\modules\usuario\model\Usuario.java:18-68`):
  - Contains `id` (UUID, `length = 36`), `codigoPublico`, `nome`, `email`, `senha`, `telefone`, `fotoUrl`, `cidade`, `estado`, `tipoPerfil` (`TipoPerfil`: `MAE`, `PSICOLOGO`, `RH`), `emailVerificado`, `dataCriacao`.
  - **No `empresaId` column exists.**
- **`UsuarioRepository.java`** (`modules/usuario/repository/UsuarioRepository.java:11-20`):
  - Extends `JpaRepository<Usuario, String>` with `findByEmail`, `existsByEmail`, `findByCodigoPublico`, `existsByCodigoPublico`. Inherits `findById(String)`.
- **`LoginResponseDTO.java`** (`modules/auth/dto/LoginResponseDTO.java:10-21`):
  - Fields: `usuarioId`, `perfilId`, `codigoPublico`, `nome`, `email`, `tipoPerfil`, `emailVerificado`, `tokenSessao`, `mensagem`. Does **not** expose `empresaId`.
- **`AuthService.java`** (`modules/auth/service/AuthService.java:209-243, 246-303`):
  - In `autenticar` (lines 223–242) and `autenticarComGoogle` (lines 283–302), `perfilId` resolves via `maeRepository` or `psicologoRepository` and falls back to `usuario.getId()` for `RH`.
  - `JwtService.gerarToken(usuario.getId(), perfilId, usuario.getCodigoPublico(), role)` (lines 230, 290) signs `sub`, `perfilId`, `codigoPublico`, `role`, `iat`, `exp`.
  - `AuthControllerTest.java` (lines 231–238, 449–456, 661–668) only asserts `$.email`, `$.tipoPerfil`, `$.tokenSessao` on `/api/auth/login`.
- **`JwtService.java`** (`shared/security/JwtService.java:148-153`):
  - `JwtClaims` has `usuarioId`, `perfilId`, `codigoPublico`, `role` (no `empresaId`).

### 1.2 `DemoDayDataSeeder.java` & Configuration
- **`DemoDayDataSeeder.java`** (`shared/config/DemoDayDataSeeder.java:31-205`):
  - `run(String... args)` skips execution when `isRunningUnderJUnitTest()` is true (lines 43–46) and delegates to `@Transactional public void popularDadosIniciaisSeNecessario()` (line 51).
  - Lines 54–136 seed `mariana.silva@email.com` (`MAE`) and `helena.souza@floravel.com.br` (`PSICOLOGO`) with `passwordEncoder.encode("floravel123")`.
  - Lines 139–182 check `empresaRepository.findByCnpj("12.345.678/0001-90").isEmpty()`, create `Empresa` `"TechMães Brasil S.A."` (`status = "ATIVA"`), and seed 10 `LicencaColaboradora` records (`6` `Engenharia`, `2` `Jurídico`, `2` `Design`, all `status = "ATIVADA"`, `dataAtivacao = LocalDateTime.now().minusDays(i)`, **`maeId = null`**).
  - **No `TipoPerfil.RH` user is seeded.**
- **`Froravel-Front/tests/e2e/helpers/config.mjs`** (lines 31–33):
  - Probes candidate RH emails starting with `'rh@techmaes.com.br'`, `'rh@floravel.com.br'`, `'gestao.rh@techmaes.com.br'`.
- **`application.properties`** (`src/main/resources/application.properties:1-76`):
  - Imports `optional:file:.env[.properties]` (line 2).
  - Security/OAuth/Governo secrets use `${ENV_VAR:}` empty defaults (lines 56, 61, 66, 67).
  - `floravel.security.enforce-auth=${FLORAVEL_SECURITY_ENFORCE_AUTH:true}` (line 69).
  - `spring.jackson.date-format=yyyy-MM-dd HH:mm:ss`, `spring.jackson.time-zone=America/Sao_Paulo` (lines 23–24).

### 1.3 `modules/rh/**` Current Implementation & Call Sites
- **`Empresa.java`** (`modules/rh/model/Empresa.java:16-36`): `id` (UUID, length 36), `nome` (length 150, not null), `cnpj` (unique, length 18, not null), `status` (default `"ATIVA"`, length 30), `dataCadastro` (`@CreationTimestamp`).
- **`EmpresaRepository.java`** (`modules/rh/repository/EmpresaRepository.java:11-13`): only `Optional<Empresa> findByCnpj(String cnpj)`.
- **`LicencaColaboradora.java`** (`modules/rh/model/LicencaColaboradora.java:22-61`): `id`, `empresaId` (length 36), `nomeColaboradora`, `emailCorporativo`, `departamento`, `status` (default `"PENDENTE"`), `tokenConvite` (unique, length 100), `dataConvite`, `dataAtivacao`, `maeId` (length 36, nullable).
- **`LicencaColaboradoraRepository.java`** (`modules/rh/repository/LicencaColaboradoraRepository.java:12-16`): `findByEmpresaId`, `findByTokenConvite`, `existsByEmpresaIdAndEmailCorporativo`.
- **`RhCorporativoController.java`** (`modules/rh/controller/RhCorporativoController.java:15-36`):
  - Only exposes `POST /api/rh/licencas/convite`, `POST /api/rh/licencas/ativar`, `GET /api/rh/empresas/{empresaId}/relatorio-k-anonimato`.
- **`RhCorporativoService.java`** (`modules/rh/service/RhCorporativoService.java:17-121`):
  - Injects only `LicencaColaboradoraRepository` (does NOT inject `EmpresaRepository` or `UsuarioRepository`).
  - `emitirConviteLicenca` (lines 26–47) does not check if `empresaId` exists or matches the logged-in RH user.
  - `ativarLicencaComPortabilidade` (lines 50–65) checks `"ATIVADA".equalsIgnoreCase(licenca.getStatus())`, **does not reject `"REVOGADA"`** licenses.
  - `gerarRelatorioAgregadoKAnonimato` (lines 73–120) does not validate `empresaId` existence or ownership.
- **External callers of `RhCorporativoService`** (`grep_search` across `floravel-backend/Floravel/src`):
  - Only `RhCorporativoController.java` and `RhCorporativoServiceTest.java` reference `RhCorporativoService`.

### 1.4 `JwtAuthInterceptor.java` & `GlobalExceptionHandler.java`
- **`JwtAuthInterceptor.java`** (`shared/security/JwtAuthInterceptor.java:107-115`):
  ```java
  // 4. Relatórios corporativos K-Anonimato e emissão de convites B2B -> apenas RH
  if (path.startsWith("/api/rh/empresas/") || "/api/rh/licencas/convite".equals(path)) {
      if (!"RH".equals(role)) {
          escreverErro(response, HttpServletResponse.SC_FORBIDDEN,
                  "Acesso Negado", "Recurso restrito ao perfil Gestão RH B2B.");
          return false;
      }
  }
  ```
  - Sets `request.setAttribute(ATTR_JWT_CLAIMS, claims)` at line 60.
  - **Gap:** `/api/rh/licencas/{id}/reenviar`, `/revogar`, `/reativar` are NOT matched by `path.startsWith("/api/rh/empresas/") || "/api/rh/licencas/convite".equals(path)`, so `MAE` / `PSICOLOGO` tokens are currently NOT blocked (`403`) on those paths!
- **`GlobalExceptionHandler.java`** (`shared/exception/GlobalExceptionHandler.java:30-150`):
  - Maps `*NaoEncontradaException` to `404`, `RegraDeNegocioException` to `422`, `MethodArgumentNotValidException` to `400` (`validationErrors`), and has a catch-all `@ExceptionHandler(Exception.class)` returning **`500 INTERNAL_SERVER_ERROR`** (lines 139–150).
  - **Critical finding:** Because of `@ExceptionHandler(Exception.class)`, any new custom exception (even if annotated with `@ResponseStatus`) will return `500` unless explicitly registered in `GlobalExceptionHandler` (or on a controller `@ExceptionHandler`).
- **Existing tests:**
  - `RhCorporativoServiceTest.java` (`src/test/java/.../modules/rh/service/RhCorporativoServiceTest.java:25-130`): Mockito unit test with `@Mock LicencaColaboradoraRepository` + `@InjectMocks RhCorporativoService`, calling `gerarRelatorioAgregadoKAnonimato("emp-1")` and `emitirConviteLicenca(conviteDto)` + `ativarLicencaComPortabilidade(ativacaoDto)`.
  - `PsicologoPersistenciaAndSecurityTest.java` (lines 206–220): uses `MockMvcBuilders.webAppContextSetup(wac).build()` to test `JwtAuthInterceptor` (`403` for `MAE` on `/api/rh/empresas/emp-1/relatorio-k-anonimato`).

---

## 2. Logic Chain

1. **User-to-Company Link (`Usuario.empresaId` + `LoginResponseDTO` + `GET /api/rh/empresas/atual`):**
   - Adding `@Column(name = "empresa_id", length = 36) private String empresaId;` to `Usuario` (`nullable = true`) allows `RH` users to be bound to an `Empresa` without affecting `MAE` or `PSICOLOGO` rows (Observation 1.1).
   - Keeping `JwtService.JwtClaims` unchanged and resolving `usuario.getEmpresaId()` from `UsuarioRepository.findById(claims.getUsuarioId())` in `RhCorporativoService` ensures `GET /api/rh/empresas/atual` and anti-IDOR ownership checks always reflect the authoritative database state and avoids JWT schema churn across M1/M3/M4.
   - Exposing `private String empresaId;` on `LoginResponseDTO` (populated from `usuario.getEmpresaId()` in `AuthService.autenticar` and `autenticarComGoogle`) is strictly additive (null for non-RH users), breaks zero `AuthControllerTest` assertions (Observation 1.1), and immediately provides `empresaId` inside `floravel_rh_sessao` upon login while `GET /api/rh/empresas/atual` remains the authoritative endpoint for `EmpresaResponseDTO`.

2. **AC4-Compliant Demo RH Seeding (`DemoDayDataSeeder.java`):**
   - Because AC4 forbids hardcoded credentials/secrets in source code, `DemoDayDataSeeder` must **not** embed a fallback password literal for the RH user (Observation 1.2).
   - Injecting `@Value("${floravel.demo.rh-email:rh@techmaes.com.br}") private String rhDemoEmail;` and `@Value("${floravel.demo.rh-password:}") private String rhDemoPassword;` (backed by `floravel.demo.rh-password=${FLORAVEL_DEMO_RH_PASSWORD:}` in `application.properties` and documented in `.env.example`) satisfies AC4 cleanly.
   - Resolving `Empresa emp = empresaRepository.findByCnpj("12.345.678/0001-90").orElse(null)` outside the `if (isEmpty())` seed block ensures that even on restarts where `TechMães Brasil S.A.` already exists, an RH user configured via `FLORAVEL_DEMO_RH_PASSWORD` is still seeded (or backfilled with `empresaId = emp.getId()` if `empresaId` was null). When `rhDemoPassword` is blank, seeding the RH user is skipped with an informational log (never logging any secret).

3. **Anti-IDOR Ownership Check, License Lifecycle & Role Security:**
   - Updating `JwtAuthInterceptor.java:108` from `path.startsWith("/api/rh/empresas/") || "/api/rh/licencas/convite".equals(path)` to `(path.startsWith("/api/rh/") && !"/api/rh/licencas/ativar".equals(path))` guarantees `403 Forbidden` for `MAE` and `PSICOLOGO` on `/reenviar`, `/revogar`, `/reativar`, `/empresas/atual`, `/empresas/{id}`, `/empresas/{id}/licencas`, `/empresas/{id}/relatorio-k-anonimato`, and `/licencas/convite`, while keeping `POST /api/rh/licencas/ativar` accessible to authenticated mothers (`MAE`) and returning `401` when unauthenticated (Observation 1.4).
   - For multi-tenant anti-IDOR protection, `RhCorporativoController` extracts `JwtService.JwtClaims claims = (JwtService.JwtClaims) request.getAttribute(JwtAuthInterceptor.ATTR_JWT_CLAIMS);` and passes `claims` to `RhCorporativoService`. When `claims != null`, `RhCorporativoService` verifies `usuarioRepository.findById(claims.getUsuarioId())` has a non-blank `empresaId` equal to the target `empresaId` (or `licenca.getEmpresaId()`); on mismatch or missing link, it throws `AcessoNegadoRhException` (`403 Forbidden` via `GlobalExceptionHandler`). When `claims == null` (only possible in `standaloneSetup` unit tests or `floravel.security.enforce-auth=false`), the `empresaId` ownership check is bypassed for `{empresaId}`/`{licencaId}` endpoints while `GET /api/rh/empresas/atual` explicitly rejects `claims == null` with `AcessoNegadoRhException` (`403`).
   - Because `GlobalExceptionHandler` defines `@ExceptionHandler(Exception.class)` -> `500` (Observation 1.4), `EmpresaNaoEncontradaException` (`404`), `LicencaNaoEncontradaException` (`404`), and `AcessoNegadoRhException` (`403`) must be registered in `GlobalExceptionHandler` so `ErrorResponseDTO` returns the exact HTTP status codes (`404` and `403`).
   - Because `DemoDayDataSeeder` seeds `"ATIVADA"` licenses with `dataAtivacao != null` and `maeId == null` (Observation 1.2), `PATCH /api/rh/licencas/{licencaId}/reativar` should restore `"ATIVADA"` when `(licenca.getMaeId() != null && !licenca.getMaeId().isBlank()) || licenca.getDataAtivacao() != null`, and `"PENDENTE"` otherwise—preserving `maeId` and `dataAtivacao` untouched during `revogar`. Meanwhile `ativarLicencaComPortabilidade` must reject `"REVOGADA"` licenses with `422 RegraDeNegocioException`.
   - Because `"12.345.678/0001-90"` is a synthetic Demo Day CNPJ whose check digits are not valid Modulo-11 digits (Observation 1.2), `AtualizarEmpresaRequestDTO` should validate format (`14` digits formatted `XX.XXX.XXX/XXXX-XX` or plain 14 digits) without Modulo-11 rejection, and `RhCorporativoService.atualizarEmpresa` should reject duplicate CNPJs belonging to another company (`existsByCnpjAndIdNot`) with `422 RegraDeNegocioException`.

4. **Test Strategy (Unit + Full-MVC `MockMvcBuilders.webAppContextSetup`):**
   - Keeping backward-compatible 1-arg overloads in `RhCorporativoService` (`emitirConviteLicenca(dto)`, `gerarRelatorioAgregadoKAnonimato(empresaId)`) alongside `(..., JwtClaims claims)` overloads ensures clean unit testing, while updating `RhCorporativoServiceTest` mocks (`EmpresaRepository`, `UsuarioRepository`, `LicencaColaboradoraRepository`) tests all service rules in isolation.
   - Adding `RhCorporativoControllerTest` using `@SpringBootTest` + `MockMvcBuilders.webAppContextSetup(wac).build()` (matching `PsicologoPersistenciaAndSecurityTest.java:206`) exercises the full `JwtAuthInterceptor` -> `RhCorporativoController` -> `RhCorporativoService` -> H2 JPA -> `GlobalExceptionHandler` pipeline across `401`, `403` role, `403` anti-IDOR, `400`, `404`, `422`, and `200`/`201` scenarios.

---

## 3. Caveats

- `.\mvnw.cmd test` was not executed during this read-only investigation.
- `EmailService` (`modules/auth/service/EmailService.java`) does not currently have a corporate-invite email template and belongs to M1 (`PROJECT.md:86`); therefore `emitirConviteLicenca` and `reenviarConviteLicenca` should log the resend safely (without leaking `tokenConvite` or credentials) and return `LicencaResponseDTO` without modifying `EmailService`.
- Existing `DemoDayDataSeeder.java` lines 58 and 80 already contain `"floravel123"` for `MAE`/`PSICOLOGO` demo seeds; M2 must not introduce any new hardcoded password literal for the `RH` user, and should leave existing `MAE`/`PSICOLOGO` lines untouched unless M5 explicitly requests otherwise.
- `LoginResponseDTO` / `AuthService` (`modules/auth/**`) are listed under M1 ownership in `PROJECT.md:86`, though M1 is `DONE`; adding `empresaId` there is strictly additive and non-breaking, and `GET /api/rh/empresas/atual` works independently of it.

---

## 4. Conclusion — Exact M2 Backend Implementation Blueprint

### 4.1 `Usuario.java` & `LoginResponseDTO.java` / `AuthService.java`
1. **`modules/usuario/model/Usuario.java`** (after `tipoPerfil` / `emailVerificado`):
   ```java
   @Column(name = "empresa_id", length = 36)
   private String empresaId;
   ```
2. **`modules/auth/dto/LoginResponseDTO.java`** (optional/recommended additive field):
   - Add `private String empresaId;`
3. **`modules/auth/service/AuthService.java`** (lines 239 and 299):
   - Add `.empresaId(usuario.getEmpresaId())` to both `LoginResponseDTO.builder()` blocks (`autenticar` and `autenticarComGoogle`).

### 4.2 `DemoDayDataSeeder.java`, `application.properties`, `.env.example`
1. **`src/main/resources/application.properties`** (add under Demo / B2B section):
   ```properties
   floravel.demo.rh-email=${FLORAVEL_DEMO_RH_EMAIL:rh@techmaes.com.br}
   floravel.demo.rh-password=${FLORAVEL_DEMO_RH_PASSWORD:}
   ```
2. **`floravel-backend/Floravel/.env.example`**:
   - Document `# FLORAVEL_DEMO_RH_PASSWORD=` as optional local seed password.
3. **`shared/config/DemoDayDataSeeder.java`**:
   - Inject `@Value("${floravel.demo.rh-email:rh@techmaes.com.br}") private String rhDemoEmail;` and `@Value("${floravel.demo.rh-password:}") private String rhDemoPassword;` (using `@RequiredArgsConstructor` — non-final `@Value` fields are NOT included in constructor, so existing Spring wiring and constructors stay intact).
   - Resolve `Empresa empresaDemo = empresaRepository.findByCnpj("12.345.678/0001-90").orElse(null);` (creating it + the 10 licenses if null, reusing existing if already present).
   - Seed / link `TipoPerfil.RH` user:
     - Normalize `String emailRh = rhDemoEmail != null ? rhDemoEmail.trim().toLowerCase() : "rh@techmaes.com.br";`
     - Check `Optional<Usuario> rhExistente = usuarioRepository.findByEmail(emailRh);`
     - If present and `empresaDemo != null` and `(u.getEmpresaId() == null || u.getEmpresaId().isBlank())`: set `u.setEmpresaId(empresaDemo.getId())` and `usuarioRepository.save(u)`.
     - Else if absent and `empresaDemo != null`:
       - If `rhDemoPassword != null && !rhDemoPassword.isBlank()`:
         create and save `Usuario` with `nome = "Gestão RH TechMães"`, `email = emailRh`, `senha = passwordEncoder.encode(rhDemoPassword)`, `tipoPerfil = TipoPerfil.RH`, `emailVerificado = true`, `empresaId = empresaDemo.getId()`.
       - Else: `log.info("[DemoDayDataSeeder] FLORAVEL_DEMO_RH_PASSWORD não configurada; usuário RH demo não criado.");`

### 4.3 `modules/rh` DTOs, Exceptions, Repositories, Service & Controller

1. **Exceptions (`modules/rh/exception/`):**
   - `EmpresaNaoEncontradaException extends RuntimeException` (`static porId(String id)`) -> `404`
   - `LicencaNaoEncontradaException extends RuntimeException` (`static porId(String id)`) -> `404`
   - `AcessoNegadoRhException extends RuntimeException` -> `403`
   - Register all 3 in `shared/exception/GlobalExceptionHandler.java` (`404` in `handleNaoEncontrado`, `403` in new `@ExceptionHandler(AcessoNegadoRhException.class)` returning `ErrorResponseDTO` with `"Acesso Negado"`).

2. **New DTOs (`modules/rh/dto/`):**
   - `EmpresaResponseDTO`: `{ String id, String nome, String cnpj, String status, LocalDateTime dataCadastro }` + `static fromEntity(Empresa)`.
   - `AtualizarEmpresaRequestDTO`:
     - `@NotBlank(message = "O nome da empresa é obrigatório.") @Size(max = 150)` `private String nome;`
     - `@NotBlank(message = "O CNPJ da empresa é obrigatório.") @Pattern(regexp = "^(\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}|\\d{14})$", message = "CNPJ inválido. Informe 14 dígitos ou o formato XX.XXX.XXX/XXXX-XX.")` `private String cnpj;`

3. **Repositories (`modules/rh/repository/`):**
   - `EmpresaRepository`: add `boolean existsByCnpjAndIdNot(String cnpj, String id);`
   - `LicencaColaboradoraRepository`: add `List<LicencaColaboradora> findByEmpresaIdOrderByDataConviteDesc(String empresaId);`

4. **`RhCorporativoService.java` Methods & Rules:**
   Inject `LicencaColaboradoraRepository`, `EmpresaRepository`, `UsuarioRepository` (with `@Slf4j`).
   - Ownership helper `validarPropriedadeEmpresa(String targetEmpresaId, JwtService.JwtClaims claims)`:
     - If `claims == null`, return (for `standaloneSetup` / `enforce-auth=false`; note `obterEmpresaAtual` explicitly requires `claims != null`).
     - Look up `Usuario usuario = usuarioRepository.findById(claims.getUsuarioId()).orElseThrow(() -> new AcessoNegadoRhException("Usuário RH autenticado não encontrado."));`
     - Verify `usuario.getEmpresaId() != null && !usuario.getEmpresaId().isBlank() && usuario.getEmpresaId().equals(targetEmpresaId)`; otherwise throw `new AcessoNegadoRhException("Acesso negado: você só pode acessar recursos da sua própria empresa.")`.
   - `obterEmpresaAtual(JwtService.JwtClaims claims)` (`@Transactional(readOnly = true)`):
     - If `claims == null || claims.getUsuarioId() == null`, throw `AcessoNegadoRhException`.
     - Look up `Usuario` -> require non-blank `usuario.getEmpresaId()`, else throw `AcessoNegadoRhException("Usuário RH não possui empresa corporativa vinculada.")`.
     - Return `EmpresaResponseDTO.fromEntity(empresaRepository.findById(empresaId).orElseThrow(() -> EmpresaNaoEncontradaException.porId(empresaId)))`.
   - `atualizarEmpresa(String empresaId, AtualizarEmpresaRequestDTO dto, JwtService.JwtClaims claims)` (`@Transactional`):
     - `validarPropriedadeEmpresa(empresaId, claims)`.
     - Find `Empresa` by `empresaId` -> `404` `EmpresaNaoEncontradaException`.
     - Normalize `nome = dto.getNome().trim()`, `cnpj = formatarOuManterCnpj(dto.getCnpj().trim())` (if 14 raw digits, format as `XX.XXX.XXX/XXXX-XX` so `Empresa.cnpj` stays consistent and unique across formats).
     - If `empresaRepository.existsByCnpjAndIdNot(cnpj, empresaId)` -> throw `RegraDeNegocioException("Já existe outra empresa cadastrada com este CNPJ.")` (`422`).
     - Update `nome`, `cnpj`, save, return `EmpresaResponseDTO.fromEntity(salva)`.
   - `listarLicencasPorEmpresa(String empresaId, JwtService.JwtClaims claims)` (`@Transactional(readOnly = true)`):
     - `validarPropriedadeEmpresa(empresaId, claims)`.
     - Verify `empresaRepository.existsById(empresaId)` -> else throw `EmpresaNaoEncontradaException.porId(empresaId)`.
     - Return `licencaRepository.findByEmpresaIdOrderByDataConviteDesc(empresaId).stream().map(LicencaResponseDTO::fromEntity).toList()`.
   - `emitirConviteLicenca(ConviteLicencaRequestDTO dto, JwtService.JwtClaims claims)` + 1-arg delegate `emitirConviteLicenca(dto)` (`@Transactional`):
     - `String empresaId = dto.getEmpresaId().trim();`
     - `validarPropriedadeEmpresa(empresaId, claims)`.
     - Verify `empresaRepository.existsById(empresaId)` -> else throw `EmpresaNaoEncontradaException.porId(empresaId)`.
     - Existing duplicate email check -> `422`, create `"PENDENTE"` license with `"FLR-B2B-" + UUID.randomUUID()`, save, return `LicencaResponseDTO`.
   - `reenviarConviteLicenca(String licencaId, JwtService.JwtClaims claims)` (`@Transactional`):
     - Find `LicencaColaboradora` by `licencaId` -> `404` `LicencaNaoEncontradaException`.
     - `validarPropriedadeEmpresa(licenca.getEmpresaId(), claims)`.
     - If `"REVOGADA".equalsIgnoreCase(licenca.getStatus())` -> `422` (`RegraDeNegocioException`).
     - If `"ATIVADA".equalsIgnoreCase(licenca.getStatus())` -> `422` (`RegraDeNegocioException`).
     - Ensure `tokenConvite` is non-blank (generate `"FLR-B2B-" + UUID.randomUUID()` only if null/blank), save if generated, log resend cleanly, return `LicencaResponseDTO.fromEntity(licenca)`.
   - `revogarLicenca(String licencaId, JwtService.JwtClaims claims)` (`@Transactional`):
     - Find `LicencaColaboradora` by `licencaId` -> `404` `LicencaNaoEncontradaException`.
     - `validarPropriedadeEmpresa(licenca.getEmpresaId(), claims)`.
     - If `"REVOGADA".equalsIgnoreCase(licenca.getStatus())` -> `422` (`RegraDeNegocioException("Esta licença já está revogada.")`).
     - Set `status = "REVOGADA"` (preserve `maeId` and `dataAtivacao`), save, return `LicencaResponseDTO.fromEntity(atualizada)`.
   - `reativarLicenca(String licencaId, JwtService.JwtClaims claims)` (`@Transactional`):
     - Find `LicencaColaboradora` by `licencaId` -> `404` `LicencaNaoEncontradaException`.
     - `validarPropriedadeEmpresa(licenca.getEmpresaId(), claims)`.
     - If `!"REVOGADA".equalsIgnoreCase(licenca.getStatus())` -> `422` (`RegraDeNegocioException("Somente licenças revogadas podem ser reativadas.")`).
     - `boolean previamenteAtivada = (licenca.getMaeId() != null && !licenca.getMaeId().isBlank()) || licenca.getDataAtivacao() != null;`
     - Set `status = previamenteAtivada ? "ATIVADA" : "PENDENTE"`, save, return `LicencaResponseDTO.fromEntity(atualizada)`.
   - `ativarLicencaComPortabilidade(AtivacaoLicencaRequestDTO dto)` (`@Transactional`):
     - Keep existing behavior, plus reject `"REVOGADA"` with `422` (`RegraDeNegocioException("Esta licença corporativa foi revogada pela empresa.")`).
   - `gerarRelatorioAgregadoKAnonimato(String empresaId, JwtService.JwtClaims claims)` + 1-arg delegate `gerarRelatorioAgregadoKAnonimato(empresaId)` (`@Transactional(readOnly = true)`):
     - `validarPropriedadeEmpresa(empresaId, claims)`.
     - Verify `empresaRepository.existsById(empresaId)` -> else throw `EmpresaNaoEncontradaException.porId(empresaId)`.
     - Existing K-anonymity calculation (`status == "ATIVADA"`).

5. **`RhCorporativoController.java` Endpoints (`@RequestMapping("/api/rh")`):**
   - `GET /api/rh/empresas/atual` -> `ResponseEntity<EmpresaResponseDTO>`
   - `PUT /api/rh/empresas/{empresaId}` -> `@Valid @RequestBody AtualizarEmpresaRequestDTO` -> `ResponseEntity<EmpresaResponseDTO>`
   - `GET /api/rh/empresas/{empresaId}/licencas` -> `ResponseEntity<List<LicencaResponseDTO>>`
   - `POST /api/rh/licencas/convite` -> `@Valid @RequestBody ConviteLicencaRequestDTO` -> `201 Created` `LicencaResponseDTO`
   - `POST /api/rh/licencas/{licencaId}/reenviar` -> `ResponseEntity<LicencaResponseDTO>`
   - `PATCH /api/rh/licencas/{licencaId}/revogar` -> `ResponseEntity<LicencaResponseDTO>`
   - `PATCH /api/rh/licencas/{licencaId}/reativar` -> `ResponseEntity<LicencaResponseDTO>`
   - `POST /api/rh/licencas/ativar` -> `@Valid @RequestBody AtivacaoLicencaRequestDTO` -> `ResponseEntity<LicencaResponseDTO>`
   - `GET /api/rh/empresas/{empresaId}/relatorio-k-anonimato` -> `ResponseEntity<RelatorioKAnonimatoResponseDTO>`

### 4.4 `JwtAuthInterceptor.java` Rule Update
In `shared/security/JwtAuthInterceptor.java` (lines 107–114):
```java
// 4. Gestão corporativa RH B2B -> apenas RH (exceto ativação de convite pela mãe autenticada)
if (path.startsWith("/api/rh/") && !"/api/rh/licencas/ativar".equals(path)) {
    if (!"RH".equals(role)) {
        escreverErro(response, HttpServletResponse.SC_FORBIDDEN,
                "Acesso Negado", "Recurso restrito ao perfil Gestão RH B2B.");
        return false;
    }
}
```

### 4.5 Automated Tests (`src/test/java/br/com/floravel/floravel/modules/rh/`)
1. **`service/RhCorporativoServiceTest.java`** (`@ExtendWith(MockitoExtension.class)`):
   - Update existing 2 tests with `@Mock EmpresaRepository` and `@Mock UsuarioRepository`.
   - Add unit tests for `obterEmpresaAtual`, `atualizarEmpresa` (success + duplicate CNPJ), `listarLicencasPorEmpresa`, `reenviarConviteLicenca` (success + 422 on `REVOGADA`/`ATIVADA`), `revogarLicenca`, `reativarLicenca` (restoring `PENDENTE` vs `ATIVADA`), `ativarLicencaComPortabilidade` (422 on `REVOGADA`), and anti-IDOR `AcessoNegadoRhException` when `claims` user `empresaId` mismatches.
2. **`controller/RhCorporativoControllerTest.java`** (`@SpringBootTest`, `MockMvcBuilders.webAppContextSetup(wac).build()`):
   - `401` checks on all protected `/api/rh/**` routes without token.
   - `403` role checks for `MAE` and `PSICOLOGO` on `/empresas/atual`, `PUT /empresas/{id}`, `GET /empresas/{id}/licencas`, `POST /licencas/convite`, `POST /licencas/{id}/reenviar`, `PATCH /licencas/{id}/revogar`, `PATCH /licencas/{id}/reativar`, `GET /empresas/{id}/relatorio-k-anonimato`.
   - `200` check for `MAE` on `POST /api/rh/licencas/ativar` (and `422` when license is `REVOGADA`).
   - `403` anti-IDOR checks for RH user of Company A attempting any operation on Company B or Company B's licenses, plus RH user with `empresaId == null` on `/empresas/atual`.
   - Happy path + `400` validation + `404` unknown ID + `422` business rule tests across all 6 new endpoints and existing K-anonymity/invite endpoints.
3. **`DemoDayDataSeederTest.java`** (optional in `modules/rh` or `shared/config` test):
   - Verifies AC4 behavior: no RH user seeded when `rhDemoPassword` is blank; `TipoPerfil.RH` user (`rh@techmaes.com.br`) seeded & linked to `TechMães Brasil S.A.` when `rhDemoPassword` is configured.

---

## 5. Verification Method

1. **Inspect implemented files after M2 coding:**
   - `modules/usuario/model/Usuario.java`
   - `modules/auth/dto/LoginResponseDTO.java`, `modules/auth/service/AuthService.java`
   - `shared/config/DemoDayDataSeeder.java`, `src/main/resources/application.properties`
   - `shared/security/JwtAuthInterceptor.java`, `shared/exception/GlobalExceptionHandler.java`
   - `modules/rh/**` (`controller`, `service`, `dto`, `exception`, `repository`)
   - `src/test/java/br/com/floravel/floravel/modules/rh/**`
2. **Run backend test suite** in `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel`:
   ```powershell
   .\mvnw.cmd clean test
   ```
   Verify 0 failures and 0 errors, including `RhCorporativoServiceTest`, `RhCorporativoControllerTest`, `AuthControllerTest`, and `PsicologoPersistenciaAndSecurityTest`.
3. **AC4 Secret Scan:**
   - Verify no hardcoded password literals were added in `DemoDayDataSeeder.java`, `RhCorporativo*`, or `application.properties`.
4. **Invalidation conditions:** Any changes to `JwtService.JwtClaims` fields, `GlobalExceptionHandler` mappings, or `PROJECT.md` Interface Contract #2 would require updating the corresponding controller/service/interceptor design points above.
