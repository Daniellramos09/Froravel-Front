# BRIEFING — 2026-11-20T00:36:45Z

## Mission
Perform a read-only technical survey of the Spring Boot backend at `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel` for R2 (RH Dashboard Integration), R3 (SalaAcolhimento Video/Audio & Real-time SSE Notifications), and Architecture & Shared Code.

## 🔒 My Identity
- Archetype: explorer_survey_2 (teamwork_preview_explorer)
- Roles: Investigation, Synthesis
- Working directory: C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\explorer_survey_2
- Original parent: 189625da-cab0-4c9f-875b-20770dbcc54b
- Milestone: Step 0 Survey

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- Write `progress.md` (with `Last visited: <timestamp>`) and `handoff.md` in working directory
- Send concise `send_message` to `189625da-cab0-4c9f-875b-20770dbcc54b` referencing `handoff.md`

## Current Parent
- Conversation ID: 189625da-cab0-4c9f-875b-20770dbcc54b
- Updated: 2026-11-20T00:36:45Z

## Investigation State
- **Explored paths**:
  - `pom.xml`, `application.properties`, `application-prod.properties`, `.env.example`, `SWAGGER_API_DOCS.md`, `FloravelApplication.java`
  - `modules/rh/**` + `RhCorporativoServiceTest.java`
  - `modules/reuniao/**`
  - `shared/**` (`WebMvcSecurityConfig`, `CorsConfig`, `SecurityBeansConfig`, `DemoDayDataSeeder`, `JwtAuthInterceptor`, `JwtService`, `GlobalExceptionHandler`, `ErrorResponseDTO`, `RegraDeNegocioException`, `AesGcmAttributeConverter`, `JsonStringListConverter`, `CodigoPublicoUtil`, `CpfUtil`, `HealthController`, `OpenApiSwaggerController`)
  - `modules/usuario/**`, `modules/auth/**`, `modules/agendamento/**`, `modules/rodaconversa/**`, `modules/denuncia/**`, `modules/feedback/**`, `modules/mae/model/Mae.java`, `modules/psicologo/model/Psicologo.java`
  - Frontend cross-check: `apps/rh/src/**`, `apps/psicologo/src/Screen/SalaAcolhimento.jsx`, `apps/mae/src/Components/Meeting/MeetingRoomModal.jsx`, `apps/landing/src/Screen/Auth/LoginScreen.jsx`, `packages/shared/src/appLinks.js`
- **Key findings**:
  - R2: `RhCorporativoController` has only 3 endpoints (`POST /api/rh/licencas/convite`, `POST /api/rh/licencas/ativar`, `GET /api/rh/empresas/{empresaId}/relatorio-k-anonimato`). Missing: license listing/revoke/resend endpoints, `GET /api/rh/empresas` / `empresaId` on RH user/JWT, and no `TipoPerfil.RH` user seeded in `DemoDayDataSeeder`. `apps/rh` is 100% hardcoded mock data (`TechCorp Brasil`, `42/50` licenses, clinical/billing/settings mocks).
  - R3: Zero SSE/WebSocket infrastructure exists. `SalaAoVivoController` (`/api/sala-ao-vivo/*`) holds single global in-memory state (`statusSala`, `disjuntorAcionado`, `mensagens`) without room IDs or participant join/leave tracking. `SalaReuniao` JPA entity has no controller/service. `JwtAuthInterceptor` uses `Authorization: Bearer` only (`EventSource` cannot send custom headers); `CorsConfig.allowedHeaders` lacks `Last-Event-ID` and `Cache-Control`.
- **Unexplored areas**: None within R2/R3/Architecture scope (non-R2/R3 modules like `pagamento`, `triagem`, `onboarding`, `validacaogoverno` only checked at controller mapping level).

## Key Decisions Made
- Cross-referenced backend DTOs/controllers against frontend `apps/rh`, `SalaAcolhimento.jsx`, and `MeetingRoomModal.jsx` to produce actionable gap list for R2 & R3.

## Artifact Index
- DISPATCH.md — Recorded parent dispatch
- BRIEFING.md — Persistent working memory
- progress.md — Heartbeat and step log
- handoff.md — Final 5-component survey report
