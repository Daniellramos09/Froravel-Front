# Project: Florável — Production Completion (Blocks R1–R4)

## Architecture
- **Frontend Monorepo (`C:\Users\danie\PROA\projetoDemoDay\Froravel-Front`)**: npm workspaces (`apps/landing`, `apps/mae`, `apps/psicologo`, `apps/rh`, `packages/shared`). Plain JavaScript/JSX, React 19, Vite 8, Tailwind CSS v4. Shared `@floravel/shared` provides `APP_LINKS`, `getApiBase()`, `navigateToApp()`, design tokens, and cross-app helpers. Auth propagates via `#auth=<base64>` hash into `localStorage` (`floravel_jwt`, `floravel_mae_sessao`, `floravel_psi_sessao`, `floravel_rh_sessao`).
- **Backend (`C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel`)**: Java 21 / Spring Boot 4.1.2 modular monolith (`br.com.floravel.floravel.modules.*` + `shared.*`). Uses custom `HandlerInterceptor` (`JwtAuthInterceptor` + HS256 `JwtService`) and `spring-security-crypto` (`BCryptPasswordEncoder`) instead of `spring-boot-starter-security`.
- **Dual Track**:
  - **Implementation Track (M1–M5)**: 4 vertical full-stack milestones (one per requirement block R1–R4) + Final E2E Acceptance & Tier 5 Hardening Milestone (M5).
  - **E2E Testing Track**: Independent opaque-box test suite derived from `ORIGINAL_REQUEST.md` and the Interface Contracts below, publishing `TEST_INFRA.md` and `TEST_READY.md` in `.agents/teamwork/`.

## Feature Inventory
Every feature from `ORIGINAL_REQUEST.md` and Step 0 Survey is assigned to a milestone:

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Password Reset Request (`POST /api/auth/esqueci-senha`) | Generate 6-digit `SecureRandom` code, store BCrypt hash in `TokenRecuperacaoSenha` (15-min TTL, single-use, invalidates prior tokens), send email asynchronously (`EmailService`) | M1 | R1, Survey 1 |
| F2 | Password Reset Confirm (`POST /api/auth/redefinir-senha`) | Validate email + 6-digit code against BCrypt hash, enforce 15-min TTL & single-use (`usado=true`), encode new password with BCrypt, return 400 on invalid/expired/reused code | M1 | R1, Survey 1 |
| F3 | Post-Validation Welcome Email | Send `@Async` HTML welcome/confirmation email via `EmailService` inside `AuthService.confirmarEmail` when `emailVerificado` transitions to `true` | M1 | R1, Survey 1 |
| F4 | Frontend Shared Test Runner & R1 (`apps/landing`) | Configure Vitest + Testing Library in root `package.json`, implement real forgot/reset password flow (modal + `/esqueci-senha`, `/redefinir-senha`, `/confirmar-email`), post-cadastro email confirmation + welcome UX, fix `salvarSessaoLocal` for `rh`, remove any hardcoded credential literal, and add R1 automated tests (backend + frontend) | M1 | R1, AC3, AC4 |
| F5 | RH Company Discovery & User Link | Add nullable `empresaId` on `Usuario`, add `GET /api/rh/empresas/atual` & `PUT /api/rh/empresas/{empresaId}`, seed demo `TipoPerfil.RH` user in `DemoDayDataSeeder` without hardcoded secret violations | M2 | R2, Survey 2 |
| F6 | RH License Lifecycle Endpoints | Add `GET /api/rh/empresas/{empresaId}/licencas`, `POST /api/rh/licencas/{id}/reenviar`, `PATCH /api/rh/licencas/{id}/revogar`, `PATCH /api/rh/licencas/{id}/reativar` enforcing `RH` role & `empresaId` ownership | M2 | R2, Survey 2 |
| F7 | Frontend R2 (`apps/rh`) & R2 Tests | Replace all mocked data in `DashboardRh.jsx`, `Sidebar.jsx`, `LicensesScreen.jsx`, `HealthReportsScreen.jsx`, `SettingsScreen.jsx`, `BillingScreen.jsx` with real HTTP calls to `/api/rh/*`, loading/error/safe fallback states, auth guard/logout, plus automated R2 backend + frontend tests | M2 | R2, Survey 3 |
| F8 | Room-Scoped Live Room & Participant Tracking | Refactor `SalaAoVivoController` + `SalaReuniaoService` to key state by `salaId` (`statusSala`, `disjuntorAcionado`, `participantes`, `mensagens`, `jitsiRoomName`), add `/entrar` and `/sair` endpoints while preserving legacy `/api/sala-ao-vivo/*` default room | M3 | R3, Survey 2 |
| F9 | Real-Time SSE Notifications (`SseEmitter`) | Add `GET /api/sala-ao-vivo/{salaId}/eventos` streaming `CONNECTED`, `PARTICIPANT_JOINED`, `PARTICIPANT_LEFT`, `ROOM_STATUS_CHANGED`, `CHAT_MESSAGE`, `DISJUNTOR_ACIONADO` + periodic heartbeats and clean emitter lifecycle cleanup | M3 | R3, Survey 2 |
| F10 | SSE Security, Async & CORS Configuration | Update `CorsConfig` (`Last-Event-ID`, `Cache-Control`), `JwtAuthInterceptor` (`DispatcherType.ASYNC`/`ERROR` bypass, optional `?token=` parsing on SSE `GET`, `/api/rh/licencas/**` RH role protection), `application.properties` async timeout | M3 | R3, Survey 2 |
| F11 | Frontend R3 (`apps/psicologo` & `apps/mae`) & R3 Tests | Add `@floravel/shared` SSE helper, integrate Jitsi Meet SDK in `SalaAcolhimento.jsx` & `MeetingRoomModal.jsx` + real-time `EventSource` SSE notifications (arrival chime + toast/banner when `MAE` or `PSICOLOGO` enters/leaves), replacing 3s `setTimeout` and cross-origin `BroadcastChannel`, plus automated R3 backend + frontend tests | M3 | R3, Survey 3 |
| F12 | S3 / Cloudflare R2 Presigned URL Service | Add AWS SDK v2 `software.amazon.awssdk:s3` to `pom.xml`, externalized `floravel.storage.*` props (zero hardcoded secrets, R2 `endpoint` + `pathStyleAccess`), `StorageService` validating image MIME (`image/jpeg`, `image/png`, `image/webp`) & size (`<= 5MB`), `POST /api/usuarios/me/foto/presigned-url` & `POST /api/storage/presigned-url` | M4 | R4, Survey 1 |
| F13 | Authenticated Profile Photo Persistence & Frontend R4 | Add `GET /api/usuarios/me` & `PATCH /api/usuarios/me/foto` updating `Usuario.fotoUrl` (and syncing `Psicologo.fotoUrl` for psychologists) for all roles (`MAE`, `PSICOLOGO`, `RH`), add `@floravel/shared` upload helper, replace `URL.createObjectURL` (`PerfilScreen.jsx`) & Base64 `FileReader` (`PerfilConfiguracoes.jsx`), sync `apps/mae/src/App.jsx` avatar/name, fix `SupportNetworkScreen.jsx:230` (`photo:`), add RH avatar sync, plus automated R4 backend + frontend tests | M4 | R4, Survey 1, Survey 3 |
| F14 | Full Build, E2E Suite (Tiers 1–4) & Tier 5 Hardening | Verify `npm run build:all` (0 errors), `.\mvnw.cmd clean test` (0 failures), zero hardcoded secrets scan, pass 100% E2E Tiers 1–4, then execute Tier 5 adversarial coverage hardening | M5 | AC1–AC4 |

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | R1 Full-Stack — E-mail, Password Reset & Shared Test Infra | F1, F2, F3, F4 (`modules/auth/**`, `Froravel-Front/package.json`, `apps/landing/**`) | none | DONE |
| M2 | R2 Full-Stack — Dashboard RH Live Integration | F5, F6, F7 (`modules/rh/**`, `Usuario.java`, `DemoDayDataSeeder.java`, `JwtAuthInterceptor.java` RH rules, `apps/rh/**`) | M1 (for `package.json` Vitest) | BLOCKED: Quota 429 during M2 verification gate (m2_worker_1 complete) |
| M3 | R3 Full-Stack — SalaAcolhimento Jitsi Meet & SSE | F8, F9, F10, F11 (`modules/reuniao/**`, `JwtAuthInterceptor`, `CorsConfig`, `application.properties`, `packages/shared`, `apps/psicologo/SalaAcolhimento`, `apps/mae/MeetingRoomModal`) | M2 | PLANNED |
| M4 | R4 Full-Stack — Profile Photo Upload (S3 / Cloudflare R2) | F12, F13 (`pom.xml`, `modules/storage/**`, `modules/usuario/**`, `application.properties`, `.env.example`, `packages/shared`, `apps/mae` Profile/App/SupportNetwork, `apps/psicologo` PerfilConfiguracoes, `apps/rh` Sidebar avatar) | M3 | PLANNED |
| M5 | Final Milestone — E2E Pass (Tiers 1–4) & Tier 5 Hardening | F14 (Full build/test/secrets gate + E2E Tiers 1–4 + Tier 5 adversarial coverage hardening) | M1, M2, M3, M4, E2E_READY | PLANNED |

## Interface Contracts

### 1. Auth & Password Recovery (`modules/auth` ↔ `apps/landing`)
- `POST /api/auth/esqueci-senha`
  - Request: `{ "email": "string" }`
  - Response `200 OK`: `{ "mensagem": "string", "email": "string", "expiracaoMinutos": 15 }` (does not leak account existence on unknown email)
- `POST /api/auth/redefinir-senha`
  - Request: `{ "email": "string", "codigo": "6 digits", "novaSenha": "string (min 6)" }`
  - Response `200 OK`: `{ "redefinida": true, "mensagem": "string", "email": "string" }`
  - Errors `400 Bad Request` (`ErrorResponseDTO`): `CodigoInvalidoException` (wrong/unknown/already-used) or `CodigoExpiradoException` (>15 min) or validation failure.
- `POST /api/auth/confirmar-email` (existing)
  - Behavior: On first verification, marks `emailVerificado=true`, `token.usado=true`, and triggers `@Async EmailService.enviarEmailBoasVindas(email, nome)`.

### 2. RH Corporativo (`modules/rh` ↔ `apps/rh`)
All endpoints except `/api/rh/licencas/ativar` require `Authorization: Bearer <jwt>` with `role == "RH"`.
- `GET /api/rh/empresas/atual` -> `200 OK`: `{ "id": "uuid", "nome": "string", "cnpj": "string", "status": "string", "dataCadastro": "datetime" }`
- `PUT /api/rh/empresas/{empresaId}` -> Request: `{ "nome": "string", "cnpj": "string" }` -> `200 OK` updated `EmpresaResponseDTO`.
- `GET /api/rh/empresas/{empresaId}/licencas` -> `200 OK`: `List<LicencaResponseDTO>` (`id, empresaId, nomeColaboradora, emailCorporativo, departamento, status ["PENDENTE"|"ATIVADA"|"REVOGADA"], tokenConvite, dataConvite, dataAtivacao, garantiaSigiloLgpd`).
- `POST /api/rh/licencas/convite` -> Request: `{ "empresaId", "nomeColaboradora", "emailCorporativo", "departamento" }` -> `201 Created`: `LicencaResponseDTO`.
- `POST /api/rh/licencas/{licencaId}/reenviar` -> `200 OK`: `LicencaResponseDTO`.
- `PATCH /api/rh/licencas/{licencaId}/revogar` -> `200 OK`: `LicencaResponseDTO` (`status = "REVOGADA"`).
- `PATCH /api/rh/licencas/{licencaId}/reativar` -> `200 OK`: `LicencaResponseDTO` (`status = "PENDENTE"` or `"ATIVADA"` if `maeId != null`).
- `GET /api/rh/empresas/{empresaId}/relatorio-k-anonimato` -> `200 OK`: `RelatorioKAnonimatoResponseDTO` (existing).

### 3. Reunião, Jitsi & SSE (`modules/reuniao` ↔ `apps/psicologo`, `apps/mae`)
- `GET /api/sala-ao-vivo/{salaId}/eventos` (`text/event-stream`, optional `?token=<jwt>` query param):
  - Events: `CONNECTED`, `PARTICIPANT_JOINED`, `PARTICIPANT_LEFT`, `ROOM_STATUS_CHANGED`, `CHAT_MESSAGE`, `DISJUNTOR_ACIONADO`.
- `GET /api/sala-ao-vivo/{salaId}/estado` -> `200 OK`: `EstadoSalaResponseDTO` (`salaId`, `jitsiRoomName`, `statusSala`, `disjuntorAcionado`, `usuarioIsoladoDisjuntor`, `participantes`, `mensagens`).
- `POST /api/sala-ao-vivo/{salaId}/entrar` -> `{ "usuarioId"?: "string", "perfilId"?: "string", "nome": "string", "role": "MAE"|"PSICOLOGO" }` -> `200 OK`: `EstadoSalaResponseDTO` (broadcasts `PARTICIPANT_JOINED`).
- `POST /api/sala-ao-vivo/{salaId}/sair` -> `{ "usuarioId"?: "string", "perfilId"?: "string", "nome"?: "string", "role"?: "MAE"|"PSICOLOGO" }` -> `200 OK`: `EstadoSalaResponseDTO` (broadcasts `PARTICIPANT_LEFT`).
- `POST /api/sala-ao-vivo/{salaId}/status`, `/mensagens`, `/disjuntor` -> room-scoped mutations broadcasting SSE events.
- Legacy `/api/sala-ao-vivo/{estado,status,mensagens,disjuntor}` continue delegating to `"default"` room.
- Jitsi Room Name rule: `jitsiRoomName = "floravel-acolhimento-" + sanitized(salaId)`.

### 4. Profile Photo Storage S3 / R2 (`modules/storage`, `modules/usuario` ↔ `apps/mae`, `apps/psicologo`, `apps/rh`)
All endpoints require `Authorization: Bearer <jwt>`.
- `POST /api/usuarios/me/foto/presigned-url` (also aliased at `POST /api/storage/presigned-url`):
  - Request: `{ "fileName": "string", "contentType": "image/jpeg|image/png|image/webp", "fileSizeBytes": number (1..5242880) }`
  - Response `200 OK`: `{ "uploadUrl": "string", "publicUrl": "string", "objectKey": "string", "expiresInSeconds": 300, "method": "PUT", "requiredHeaders": { "Content-Type": "string" } }`
- `PATCH /api/usuarios/me/foto`:
  - Request: `{ "fotoUrl": "https://..." (max 500 chars) }`
  - Response `200 OK`: `{ "usuarioId": "string", "fotoUrl": "string", "mensagem": "string" }`
- `GET /api/usuarios/me`:
  - Response `200 OK`: `{ "usuarioId": "string", "perfilId": "string", "codigoPublico": "string", "nome": "string", "email": "string", "fotoUrl": "string|null", "tipoPerfil": "MAE|PSICOLOGO|RH", "empresaId": "string|null" }`

## Code Layout & Write Ownership
- **M1 owns**: `floravel-backend/Floravel/src/main/java/.../modules/auth/**`, `src/test/java/.../modules/auth/**`, `Froravel-Front/package.json`, `package-lock.json`, `apps/landing/**`.
- **M2 owns**: `floravel-backend/Floravel/src/main/java/.../modules/rh/**`, `modules/usuario/model/Usuario.java`, `shared/config/DemoDayDataSeeder.java`, `src/test/java/.../modules/rh/**`, `Froravel-Front/apps/rh/**`.
- **M3 owns**: `floravel-backend/Floravel/src/main/java/.../modules/reuniao/**`, `shared/security/JwtAuthInterceptor.java`, `shared/config/CorsConfig.java`, `application.properties` (async timeout), `src/test/java/.../modules/reuniao/**`, `Froravel-Front/packages/shared/**` (SSE helper), `apps/psicologo/src/Screen/SalaAcolhimento.jsx`, `apps/mae/src/Components/Meeting/MeetingRoomModal.jsx`, `apps/psicologo/package.json`, `apps/mae/package.json` + R3 frontend tests.
- **M4 owns**: `floravel-backend/Floravel/pom.xml`, `modules/storage/**`, `modules/usuario/**` (controller/service/dto), `application.properties` (storage), `.env.example`, `src/test/java/.../modules/{storage,usuario}/**`, `Froravel-Front/packages/shared/**` (photo upload helper), `apps/mae/src/Screen/Profile/**`, `apps/mae/src/App.jsx`, `apps/mae/src/Screen/Services/SupportNetworkScreen.jsx`, `apps/psicologo/src/Screen/PerfilConfiguracoes.jsx`, `apps/psicologo/src/Context/PsiAccessibilityContext.jsx`, `apps/rh/src/Sidebar.jsx` (avatar) + R4 frontend tests.
- **E2E Testing Track owns**: `.agents/teamwork/TEST_INFRA.md`, `.agents/teamwork/TEST_READY.md`, `Froravel-Front/tests/e2e/**`.
