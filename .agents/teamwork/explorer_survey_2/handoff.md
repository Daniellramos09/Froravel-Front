# Step 0 Technical Survey — Florável Backend (R2, R3 & Architecture)

**Summary:** The Florável Spring Boot 4.1.2 (Java 21) backend implements a clean Package-by-Domain architecture (`13` feature modules + `shared`), custom HS256 JWT `HandlerInterceptor` auth (without Spring Security), and partial foundations for R2 and R3. For **R2 (RH Dashboard)**, `RhCorporativoController` exposes only 3 endpoints (`convite`, `ativar`, `relatorio-k-anonimato`) and lacks license listing/revocation/company discovery endpoints, an `empresaId` link on RH users/JWTs, and a seeded RH user—while `apps/rh` is 100% hardcoded mock data. For **R3 (SalaAcolhimento & SSE)**, no SSE/WebSocket infrastructure exists; `SalaAoVivoController` maintains a single global in-memory state with no room scoping or participant presence tracking, `JwtAuthInterceptor` only reads `Authorization: Bearer` headers (incompatible with browser `EventSource`), and `CorsConfig` omits `Last-Event-ID`/`Cache-Control`.

---

## 1. Observation

### 1.1 Tech Stack & Build Configuration
- **File:** `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel\pom.xml`
  - Spring Boot Parent `4.1.2`, Java `21` (lines 7–30).
  - Starters: `spring-boot-starter-data-jpa`, `spring-boot-starter-validation`, `spring-boot-starter-mail`, `spring-boot-starter-webmvc`, `spring-boot-h2console`, `spring-security-crypto` (lines 33–86). **No `spring-boot-starter-security`, `spring-boot-starter-websocket`, or `spring-boot-starter-webflux`** is declared.
  - Databases: `h2` + `mysql-connector-j` (lines 60–69).
- **File:** `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel\src\main\resources\application.properties`
  - `server.port=${PORT:8080}` (line 3), `spring.jpa.open-in-view=false` (line 20).
  - `spring.jackson.date-format=yyyy-MM-dd HH:mm:ss`, `spring.jackson.time-zone=America/Sao_Paulo` (lines 23–24).
  - Security flags: `floravel.security.enforce-auth=${FLORAVEL_SECURITY_ENFORCE_AUTH:true}` (line 69), `jwt-expiration-hours=24` (line 68).
  - **No `spring.mvc.async.request-timeout`** is configured.
- **File:** `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel\src\main\java\br\com\floravel\floravel\FloravelApplication.java`
  - Annotated with `@EnableAsync` and `@SpringBootApplication` (lines 7–8).

### 1.2 Architecture & Package Structure
Root package: `br.com.floravel.floravel` (`src/main/java/br/com/floravel/floravel/`):

| Package | Purpose | Controller Base Path |
|---|---|---|
| `modules/agendamento` | 1:1 appointments (`Agendamento`) | `/api/agendamentos` |
| `modules/auth` | Login, Google OAuth2, Email OTP (`TokenConfirmacaoEmail`, `EmailService`) | `/api/auth` |
| `modules/denuncia` | Reports, Velocity Checks, Circuit Breaker (`Denuncia`) | `/api/denuncias` |
| `modules/feedback` | Meeting & platform feedback (`FeedbackReuniao`, `FeedbackPlataforma`) | `/api/feedbacks` |
| `modules/mae` | Mother profile & ECA Art. 17 legal guardian (`Mae`, `ResponsavelLegal`) | `/api/maes` |
| `modules/onboarding` | Mother onboarding flow | `/api/onboarding` |
| `modules/pagamento` | Payment webhook & 2h refund policy | `/api/pagamentos` |
| `modules/psicologo` | Psychologist profile & schedule (`Psicologo`) | `/api/psicologos` |
| `modules/reuniao` | Live room in-memory sync + `SalaReuniao` JPA entity | `/api/sala-ao-vivo` |
| `modules/rh` | B2B companies, employee licenses, K-Anonymity report | `/api/rh` |
| `modules/rodaconversa` | Support circles (`RodaDeConversa`, `ParticipanteRoda`) | `/api/rodas-conversa` |
| `modules/triagem` | EPDS screening & Crisis Protocol #10 | `/api/triagens` |
| `modules/usuario` | Base `Usuario` entity & `TipoPerfil` enum | *(no controller)* |
| `modules/validacaogoverno` | CPF/birth/sex validation (Simulado / SERPRO) | `/api/governo` |
| `shared/config` | `CorsConfig`, `WebMvcSecurityConfig`, `SecurityBeansConfig`, `DemoDayDataSeeder` | — |
| `shared/exception` | `GlobalExceptionHandler`, `ErrorResponseDTO`, `RegraDeNegocioException` | — |
| `shared/persistence` | `JsonStringListConverter` | — |
| `shared/security` | `JwtAuthInterceptor`, `JwtService`, `AesGcmAttributeConverter` | — |
| `shared/util` | `CodigoPublicoUtil` (`FLR-XXXXXX`), `CpfUtil` | — |
| `shared/web` | `HealthController`, `OpenApiSwaggerController` | `/api/health`, `/swagger-ui.html`, `/v3/api-docs` |

### 1.3 Shared Code & Exception Handling
- `GlobalExceptionHandler` (`shared/exception/GlobalExceptionHandler.java:30-162`): `@RestControllerAdvice` returning `ErrorResponseDTO` (`timestamp`, `status`, `error`, `message`, `path`, `validationErrors`).
  - `404`: `MaeNaoEncontradaException`, `OnboardingNaoEncontradoException`, `RodaNaoEncontradaException`, `NoResourceFoundException`.
  - `409`: `EmailJaCadastradoException`, `MaeJaInscritaException`, `DataIntegrityViolationException`.
  - `422`: `RegraDeNegocioException`, `RodaLotadaException`.
  - `400`: `MethodArgumentNotValidException` (populates `validationErrors` map), `CodigoInvalidoException`, `CodigoExpiradoException`, `TriagemInvalidaException`, `HttpMessageNotReadableException`, `MethodArgumentTypeMismatchException`, `MissingServletRequestParameterException`.
  - `405`: `HttpRequestMethodNotSupportedException`.
  - `500`: `Exception`.
- `JwtService` (`shared/security/JwtService.java:69-153`): Stateless HMAC-SHA256 JWT with claims `sub` (`usuarioId`), `perfilId`, `codigoPublico`, `role` (`MAE` | `PSICOLOGO` | `RH`), `iat`, `exp`.
- `Usuario` (`modules/usuario/model/Usuario.java:18-68`): UUID `id`, `codigoPublico` (`FLR-XXXXXX`), `nome`, `email` (unique), `senha` (BCrypt), `telefone` (AES-256-GCM via `AesGcmAttributeConverter`), `fotoUrl`, `cidade`, `estado`, `tipoPerfil` (`TipoPerfil`: `MAE`, `PSICOLOGO`, `RH`), `emailVerificado`, `dataCriacao`. **No `empresaId` field.**

### 1.4 R2 — RH Module (`modules/rh`) Complete Inventory

**Controller:** `RhCorporativoController` (`modules/rh/controller/RhCorporativoController.java:15-36`, `@RequestMapping("/api/rh")`):

1. **`POST /api/rh/licencas/convite`** (lines 22–25)
   - **Auth/Role:** JWT required; `JwtAuthInterceptor.java:108-114` restricts to `role == "RH"` (`403` otherwise).
   - **Request Body (`ConviteLicencaRequestDTO`, `modules/rh/dto/ConviteLicencaRequestDTO.java:12-26`):**
     - `empresaId` (`String`, `@NotBlank`)
     - `nomeColaboradora` (`String`, `@NotBlank`)
     - `emailCorporativo` (`String`, `@NotBlank`, `@Email`)
     - `departamento` (`String`, `@NotBlank`)
   - **Response (`201 Created`, `LicencaResponseDTO`, `modules/rh/dto/LicencaResponseDTO.java:13-40`):**
     - `id`, `empresaId`, `nomeColaboradora`, `emailCorporativo`, `departamento`, `status` (`"PENDENTE"`), `tokenConvite` (`"FLR-B2B-" + UUID.randomUUID()`), `dataConvite`, `dataAtivacao`, `garantiaSigiloLgpd`.
   - **Errors:** `422` (`RegraDeNegocioException`) if `existsByEmpresaIdAndEmailCorporativo` is true (`RhCorporativoService.java:30-32`). Note: does **not** verify if `empresaId` exists in `EmpresaRepository` and does **not** send an invite email.

2. **`POST /api/rh/licencas/ativar`** (lines 27–30)
   - **Auth/Role:** JWT required (not in `ehRotaPublica`), **any authenticated role** (not restricted to `RH` at `JwtAuthInterceptor.java:108`, since mothers activate their invite).
   - **Request Body (`AtivacaoLicencaRequestDTO`, `modules/rh/dto/AtivacaoLicencaRequestDTO.java:11-18`):**
     - `tokenConvite` (`String`, `@NotBlank`)
     - `maeId` (`String`, `@NotBlank`)
   - **Response (`200 OK`, `LicencaResponseDTO`):** sets `status = "ATIVADA"`, `maeId`, `dataAtivacao = LocalDateTime.now()`.
   - **Errors:** `422` if token not found or already `"ATIVADA"`.

3. **`GET /api/rh/empresas/{empresaId}/relatorio-k-anonimato`** (lines 32–35)
   - **Auth/Role:** JWT required; `JwtAuthInterceptor.java:108-114` restricts to `role == "RH"`.
   - **Path Param:** `empresaId` (`String`). Query params: **none**.
   - **Response (`200 OK`, `RelatorioKAnonimatoResponseDTO`, `modules/rh/dto/RelatorioKAnonimatoResponseDTO.java:12-22`):**
     - `empresaId` (`String`)
     - `parametroKMinimo` (`int`, `5`)
     - `totalLicencasEmitidas` (`long`)
     - `totalLicencasAtivadas` (`long`)
     - `taxaAdesaoPercentual` (`double`, 1 decimal place)
     - `setoresElegiveis` (`List<SetorAgregadoDTO>`: `{ nomeSetor, colaboradorasAtivas, agrupadoPorKAnonimato: false }` for departments with `>= 5` active licenses)
     - `indiceGeralAgrupadoKAnonimato` (`SetorAgregadoDTO`: `{ nomeSetor: "Índice Geral da Empresa (Setores Agrupados por K-Anonimato < 5)", colaboradorasAtivas, agrupadoPorKAnonimato: true }`)
     - `diretrizCompliance` (`String`)

**Entities & Repositories in `modules/rh`:**
- `Empresa` (`modules/rh/model/Empresa.java:16-36`, table `empresas`): `id` (UUID), `nome`, `cnpj` (unique), `status` (`"ATIVA"`), `dataCadastro`.
- `LicencaColaboradora` (`modules/rh/model/LicencaColaboradora.java:22-61`, table `licencas_colaboradoras`): `id` (UUID), `empresaId`, `nomeColaboradora`, `emailCorporativo`, `departamento`, `status` (`"PENDENTE"` / `"ATIVADA"`), `tokenConvite` (unique), `dataConvite`, `dataAtivacao`, `maeId`.
- `EmpresaRepository` (`modules/rh/repository/EmpresaRepository.java:11-13`): `findByCnpj(String cnpj)`.
- `LicencaColaboradoraRepository` (`modules/rh/repository/LicencaColaboradoraRepository.java:12-16`): `findByEmpresaId(String)`, `findByTokenConvite(String)`, `existsByEmpresaIdAndEmailCorporativo(String, String)`.
- `DemoDayDataSeeder` (`shared/config/DemoDayDataSeeder.java:139-182`): seeds `"TechMães Brasil S.A."` (CNPJ `"12.345.678/0001-90"`) with 10 `"ATIVADA"` licenses (6 Engenharia, 2 Jurídico, 2 Design). **Does NOT seed any `TipoPerfil.RH` user.**

**Frontend `apps/rh` Cross-Check (`DashboardRh.jsx`, `LicensesScreen.jsx`, `HealthReportsScreen.jsx`, `BillingScreen.jsx`, `SettingsScreen.jsx`):**
- `apps/rh` currently has **zero** `fetch` calls and **zero** references to `/api/rh` (`grep_search` returned 0 results).
- `DashboardRh.jsx` hardcodes `"TechCorp Brasil"`, `42 / 50` active licenses, `78%` engagement, `11,2` EPDS average, `124` sessions, Donut chart (`emotionalRiskData`), Area chart (`wellBeingTimelineData`), `challengesData`, and AI insights.
- `LicensesScreen.jsx` hardcodes `INITIAL_COLLABORATORS` (8 items, statuses `'active' | 'pending' | 'revoked'`), `totalAllocated = 50`, and local-only handlers for invite (`{ name, email, department }` — no `empresaId`), resend invite, copy link, revoke, and reactivate.
- `HealthReportsScreen.jsx` hardcodes `departmentRiskStackedData` (with per-sector EPDS risk %) and `burnoutEvolutionData`.
- `BillingScreen.jsx` and `SettingsScreen.jsx` use local mock state (invoices, credit card, company profile, RH admins, notification toggles).
- `apps/rh/src/App.jsx:3-22` hydrates `floravel_rh_sessao` and `floravel_jwt` from `#auth=` URL hash, with no login redirect/guard if unauthenticated.

### 1.5 R3 — Reuniao Module (`modules/reuniao`), Security, CORS & Frontend Cross-Check

**`modules/reuniao` Classes (complete list — only 3 files exist):**
1. `SalaAoVivoController` (`modules/reuniao/controller/SalaAoVivoController.java:15-103`, `@RequestMapping("/api/sala-ao-vivo")`):
   - Holds **single global in-memory state** (not keyed by room ID):
     - `AtomicReference<String> statusSala = "PRONTA"` (line 21)
     - `AtomicBoolean disjuntorAcionado = false` (line 22)
     - `AtomicReference<String> usuarioIsoladoDisjuntor = null` (line 23)
     - `CopyOnWriteArrayList<MensagemSalaDTO> mensagens` pre-seeded with 3 messages (lines 24–28)
   - Endpoints:
     - `GET /api/sala-ao-vivo/estado` -> `EstadoSalaResponseDTO(statusSala, disjuntorAcionado, usuarioIsoladoDisjuntor, mensagens)` (lines 30–38).
     - `POST /api/sala-ao-vivo/status` -> `@RequestBody Map<String, String>` (`status`, defaults to `"AO_VIVO"`; resets `disjuntorAcionado` when `"AO_VIVO"`) (lines 40–49).
     - `POST /api/sala-ao-vivo/mensagens` -> `@RequestBody Map<String, Object>` (`remetente`, `texto`, `isHost`) (lines 51–62).
     - `POST /api/sala-ao-vivo/disjuntor` -> `@RequestBody Map<String, String>` (`alvo`) (lines 64–78).
2. `SalaReuniao` (`modules/reuniao/model/SalaReuniao.java:16-48`, table `salas_reuniao`):
   - Fields: `id` (UUID), `titulo`, `tipo`, `psicologo` (`@ManyToOne(LAZY)`), `referenciaId`, `status` (`"AGENDADA"`), `linkSala`, `dataInicio`, `dataFim`.
   - Referenced **only** by `FeedbackReuniao` / `FeedbackService` (`modules/feedback/service/FeedbackService.java:34`). No controller, service, DTO, or seeder exists for `SalaReuniao`.
3. `SalaReuniaoRepository` (`modules/reuniao/repository/SalaReuniaoRepository.java:11-13`): `List<SalaReuniao> findByStatus(String status);`.

**Existing SSE / WebSocket / Notification Infrastructure:**
- **None.** `grep_search` for `SseEmitter|EventSource|WebSocket|SimpMessagingTemplate|ServerSentEvent` returned 0 matches across `src/`.

**Related Room/Session Modules:**
- `RodaDeConversaController` (`modules/rodaconversa/controller/RodaDeConversaController.java:18`): `@RequestMapping("/api/rodas-conversa")` (note: `JwtAuthInterceptor.java:140` whitelists `/api/rodas`, which does **not** match `/api/rodas-conversa`! And `SWAGGER_API_DOCS.md:55` documents `/api/rodas-de-conversa`).
- `AgendamentoController` (`modules/agendamento/controller/AgendamentoController.java:17`): `@RequestMapping("/api/agendamentos")`, generates `linkSessao = "https://floravel.com.br/app/atendimento/" + UUID.randomUUID()` (`AgendamentoService.java:44`).

**Security & CORS Impact on SSE:**
- `WebMvcSecurityConfig` (`shared/config/WebMvcSecurityConfig.java:16-19`): registers `JwtAuthInterceptor` on `/api/**`.
- `JwtAuthInterceptor` (`shared/security/JwtAuthInterceptor.java`):
  - Line 124: `/api/sala-ao-vivo/` is **public** (`path.startsWith("/api/sala-ao-vivo/")`).
  - Lines 45–50: All non-public `/api/**` routes strictly require `Authorization: Bearer <token>` header (`request.getHeader("Authorization")`). Query param `?token=` is **not** parsed.
  - Line 30: `preHandle` does not check `DispatcherType.ASYNC` (if an async/SSE request on a protected route re-dispatches or times out, `preHandle` executes again).
- `CorsConfig` (`shared/config/CorsConfig.java:23-29`):
  - `allowedOriginPatterns`: `https://floravel.vercel.app`, `https://*.vercel.app`, `http://localhost:5173..5176`, `http://127.0.0.1:5173..5176`.
  - `allowedMethods`: `GET, POST, PUT, PATCH, DELETE, OPTIONS`.
  - `allowedHeaders`: `"Authorization", "Content-Type", "X-Requested-With", "X-Webhook-Signature"`. **Missing `"Last-Event-ID"` and `"Cache-Control"`** (which browser `EventSource` / fetch-SSE clients send on reconnect/no-cache).

**Frontend `SalaAcolhimento.jsx` & `MeetingRoomModal.jsx` Cross-Check:**
- `apps/psicologo/src/Screen/SalaAcolhimento.jsx`:
  - Uses local `getUserMedia({ video: true, audio: false })` preview + avatar placeholders for mothers (no Jitsi/WebRTC peer media).
  - Uses hardcoded `SESSOES_AGENDADAS_SALA` (lines 134–202).
  - Simulates mother arrival with a 3s `setTimeout` (`SalaAcolhimento.jsx:300-305`) + `BroadcastChannel('floravel_sala_ao_vivo')` + `setInterval` polling `GET /api/sala-ao-vivo/estado` every `2500ms` (lines 334–350).
- `apps/mae/src/Components/Meeting/MeetingRoomModal.jsx`:
  - Uses local `getUserMedia` + `BroadcastChannel('floravel_sala_ao_vivo')` + `setInterval` polling `GET /api/sala-ao-vivo/estado` every `1500ms` (lines 177–195).

---

## 2. Logic Chain

1. **R2 Integration Blockers:**
   - Because `RhCorporativoController` only exposes `POST /api/rh/licencas/convite`, `POST /api/rh/licencas/ativar`, and `GET /api/rh/empresas/{empresaId}/relatorio-k-anonimato` (Observation 1.4), `apps/rh` **cannot** currently fetch the list of invited/active/revoked licenses (`LicensesScreen`), fetch company metadata (`SettingsScreen`), resend/revoke licenses, or discover the RH user's `empresaId` after login.
   - Because `DemoDayDataSeeder` seeds `TechMães Brasil S.A.` (`Empresa` + 10 `LicencaColaboradora`) without any `TipoPerfil.RH` `Usuario`, and `Usuario` has no `empresaId` field (Observation 1.3 & 1.4), an authenticated RH session cannot dynamically obtain `empresaId` from `LoginResponseDTO` or `JwtClaims`.
   - Because `RelatorioKAnonimatoResponseDTO` returns only license counts, adherence percentage, and K-anonymity department counts (`>= 5` vs `< 5`), `DashboardRh` and `HealthReportsScreen` **can** replace license/adherence/department-count mocks with `GET /api/rh/empresas/{empresaId}/relatorio-k-anonimato`, while clinical charts (EPDS donut, mood/energy timeline, challenges, AI insights) and billing/settings remain either guarded by the LGPD firewall or unbacked by backend endpoints (requiring either new backend endpoints or explicit fallback/scoped display).

2. **R3 SSE & Room Lifecycle Blockers:**
   - Because `SalaAoVivoController` uses single global `AtomicReference`/`CopyOnWriteArrayList` fields and has no `salaId` path/query parameter, all sessions share one room state, and there is no participant join/leave tracking (`MAE` / `PSICOLOGO` entering/exiting) to emit real-time events from (Observation 1.5).
   - Because `modules/reuniao` has zero `SseEmitter` / event-bus infrastructure, both `SalaAcolhimento.jsx` and `MeetingRoomModal.jsx` rely on `setInterval` HTTP polling (2.5s / 1.5s), `BroadcastChannel` (same-origin browser tabs only — fails across ports `5174` vs `5175`!), and a hardcoded 3s `setTimeout` simulation.
   - Because `JwtAuthInterceptor` only inspects `Authorization: Bearer` headers and `CorsConfig.allowedHeaders` omits `Last-Event-ID` and `Cache-Control` (Observation 1.5):
     - If the SSE stream endpoint is placed under a protected route, native browser `EventSource` will fail `401` unless either `?token=<jwt>` query-param auth is supported on the SSE route (or `@microsoft/fetch-event-source` / `fetch` stream with `Authorization` header is used).
     - Even on public routes (`/api/sala-ao-vivo/**`), `EventSource` reconnects across origins (`5174`/`5175` -> `8080`) send `Last-Event-ID`, which would fail CORS preflight unless added to `CorsConfig`.
     - `JwtAuthInterceptor` should skip `DispatcherType.ASYNC` / `ERROR` to avoid re-running auth on async SSE completion/timeout, and `SseEmitter` should configure an explicit timeout + heartbeat to avoid container/proxy 30s timeouts.

3. **Role Mapping (`MAE`, `PSICOLOGO`, `RH`) Across Modules:**
   - `TipoPerfil` (`MAE`, `PSICOLOGO`, `RH`) is stored on `Usuario.tipoPerfil`, encoded into `JwtService` `role` claim, and enforced in `JwtAuthInterceptor` (Observation 1.3).
   - `MAE` and `PSICOLOGO` have dedicated profile tables (`maes`, `psicologos`) whose UUIDs become `perfilId` in JWT; `RH` has **no** dedicated profile table and falls back to `usuario.getId()` (`AuthService.java:148-153`).
   - Note minor existing route discrepancy: `RodaDeConversaController` is mapped to `/api/rodas-conversa`, whereas `JwtAuthInterceptor.java:140` whitelists `/api/rodas` (making `GET /api/rodas-conversa` require a JWT unexpectedly).

---

## 3. Caveats

- Non-R2/R3 domain modules (`pagamento`, `triagem`, `onboarding`, `validacaogoverno`) were only inspected at the `@RequestMapping` level (`grep_search`) and via `SWAGGER_API_DOCS.md`; internal services/DTOs of those modules were not read in full.
- `.\mvnw.cmd test` was not executed during this read-only survey; test files (`RhCorporativoServiceTest.java`, `PsicologoPersistenciaAndSecurityTest.java`) were inspected via `view_file` only.
- Note on `RodaDeConversaController` vs `JwtAuthInterceptor` vs `SWAGGER_API_DOCS.md`: three different paths appear (`/api/rodas-conversa` in controller, `/api/rodas` in `JwtAuthInterceptor`, `/api/rodas-de-conversa` in Swagger docs); this only affects R3 if `SalaAcolhimento` fetches scheduled `RodaDeConversa` items from the backend.

---

## 4. Conclusion

### Concrete Gaps to Address for R2 (RH Dashboard Integration)
1. **Backend (`modules/rh`, `modules/usuario`, `DemoDayDataSeeder`):**
   - Add `GET /api/rh/empresas` (or link `Usuario.empresaId` / include `empresaId` in `LoginResponseDTO` & `JwtClaims`, or provide `GET /api/rh/empresas/atual`) so `apps/rh` can resolve the active `empresaId` dynamically without hardcoding.
   - Add `GET /api/rh/empresas/{empresaId}/licencas` returning `List<LicencaResponseDTO>` so `LicensesScreen.jsx` can load real licenses from DB.
   - Add license lifecycle actions if needed by `LicensesScreen`: e.g. `PATCH /api/rh/licencas/{id}/revogar` / `reativar` (supporting `"REVOGADA"` status) and `POST /api/rh/licencas/{id}/reenviar` (and optionally wire `EmailService` on invite/resend).
   - Seed a demo `TipoPerfil.RH` user in `DemoDayDataSeeder` linked to `TechMães Brasil S.A.` (`12.345.678/0001-90`) so RH login works out-of-the-box.
   - Enforce `empresaId` ownership in `JwtAuthInterceptor` / `RhCorporativoService` if multi-tenant RH users are supported.
2. **Frontend (`apps/rh`):**
   - Create an API client service using `getApiBase()` + `localStorage.getItem('floravel_jwt')` (`Authorization: Bearer ...`), loading/error states, and safe fallback when offline/unconfigured.
   - Wire `DashboardRh.jsx` and `HealthReportsScreen.jsx` to `GET /api/rh/empresas/{empresaId}/relatorio-k-anonimato` (replacing hardcoded `"TechCorp Brasil"`, license KPIs, adherence %, and K-anonymity sector breakdown; keeping LGPD-firewalled clinical/AI charts clearly marked or safely scoped).
   - Wire `LicensesScreen.jsx` to list licenses (`GET`), send invites (`POST /api/rh/licencas/convite` with `empresaId`), and handle status mapping (`ATIVADA` / `PENDENTE` / `REVOGADA`).

### Concrete Gaps to Address for R3 (`SalaAcolhimento` Video/Audio & SSE)
1. **Backend (`modules/reuniao` & `shared`):**
   - Refactor `SalaAoVivoController` (or add a dedicated `SalaReuniaoService` / `SseNotificacaoService`) to manage **room-scoped state** keyed by `salaId` (`ConcurrentHashMap<String, SalaEstado>`), tracking active participants (`usuarioId`, `perfilId`, `nome`, `role`: `MAE` | `PSICOLOGO`, `joinedAt`), `statusSala`, `disjuntorAcionado`, and `mensagens`.
   - Implement **SSE endpoint** using Spring MVC `SseEmitter`:
     - e.g., `GET /api/sala-ao-vivo/{salaId}/eventos` (or `/stream`) emitting named events (`CONNECTED`, `PARTICIPANT_JOINED`, `PARTICIPANT_LEFT`, `ROOM_STATUS_CHANGED`, `CHAT_MESSAGE`, `DISJUNTOR_ACIONADO`, `HEARTBEAT`).
     - Implement participant presence endpoints: `POST /api/sala-ao-vivo/{salaId}/entrar` and `POST /api/sala-ao-vivo/{salaId}/sair` (plus room-scoped `/estado`, `/status`, `/mensagens`, `/disjuntor`, preserving backward-compatible `/api/sala-ao-vivo/*` if needed).
     - Handle `onCompletion`, `onTimeout`, `onError` cleanly on `SseEmitter` (removing dead emitters from `CopyOnWriteArrayList`/`ConcurrentHashMap` to prevent memory leaks) and send periodic heartbeat comments/events; set `spring.mvc.async.request-timeout` or `new SseEmitter(0L)` / `300_000L`.
   - **Security & CORS updates:**
     - Decide auth model for `/api/sala-ao-vivo/**`: if authenticated (recommended), update `JwtAuthInterceptor` to accept `?token=<jwt>` query param on SSE `GET` endpoints (since browser `EventSource` cannot set `Authorization` header) OR use `fetch`-based SSE on frontend; also bypass `DispatcherType.ASYNC` in `JwtAuthInterceptor.preHandle`.
     - Add `"Last-Event-ID"` and `"Cache-Control"` to `CorsConfig.allowedHeaders`.
2. **Frontend (`apps/psicologo/src/Screen/SalaAcolhimento.jsx` & `apps/mae/src/Components/Meeting/MeetingRoomModal.jsx`):**
   - Replace `setTimeout` simulated mother arrival and `setInterval` polling with `EventSource` (or `fetch` SSE) subscribed to `/api/sala-ao-vivo/{salaId}/eventos`, triggering `playSoftArrivalChime()` and banner updates on real `PARTICIPANT_JOINED` events (`MAE` or `PSICOLOGO`).
   - Call `/entrar` and `/sair` on room join/leave (including `beforeunload` / `navigator.sendBeacon` or cleanup on unmount).
   - Integrate Jitsi Meet External API / iframe (`meet.jit.si` or configured domain) for real video/audio instead of local-only `getUserMedia` + static avatars.

---

## 5. Verification Method

To independently verify every observation in this report:
1. **Inspect backend RH & Reuniao files:**
   - `modules/rh/controller/RhCorporativoController.java`
   - `modules/rh/service/RhCorporativoService.java`
   - `modules/rh/dto/*.java` and `modules/rh/model/*.java`
   - `modules/reuniao/controller/SalaAoVivoController.java`, `modules/reuniao/model/SalaReuniao.java`
   - `shared/security/JwtAuthInterceptor.java`, `shared/security/JwtService.java`, `shared/config/CorsConfig.java`, `shared/config/DemoDayDataSeeder.java`
2. **Run backend baseline test suite** (in `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel`):
   ```powershell
   .\mvnw.cmd test
   ```
3. **Verify absence of SSE/WebSocket and `/api/rh` frontend usage:**
   - Search `floravel-backend\Floravel\src` for `SseEmitter|EventSource|WebSocket`.
   - Search `Froravel-Front\apps\rh\src` for `/api/rh` or `fetch(`.
4. **Invalidation conditions:** Any commits made after `2026-11-20T00:36:00Z` to `floravel-backend\Floravel` or `Froravel-Front` adding RH endpoints, RH seed users, or `SseEmitter` controllers will supersede the corresponding gap items above.
