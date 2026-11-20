# BRIEFING — 2026-11-20T00:34:43Z

## Mission
Perform a read-only technical survey of the Spring Boot backend at `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel` focusing on build/config, R1 (auth/email/password reset), R4 (profile photo upload S3/R2), and test infrastructure.

## 🔒 My Identity
- Archetype: teamwork_preview_explorer
- Roles: explorer, synthesizer
- Working directory: C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\explorer_survey_1
- Original parent: 189625da-cab0-4c9f-875b-20770dbcc54b
- Milestone: Step 0 Survey (Backend)

## 🔒 Key Constraints
- Read-only investigation — do NOT modify any source code files
- Read `ORIGINAL_REQUEST.md` verbatim before starting investigation
- Write `progress.md` and `handoff.md` in working directory
- Send concise `send_message` to `189625da-cab0-4c9f-875b-20770dbcc54b` upon completion

## Current Parent
- Conversation ID: 189625da-cab0-4c9f-875b-20770dbcc54b
- Updated: 2026-11-20T00:37:30Z

## Investigation State
- **Explored paths**: `pom.xml`, `.env.example`, `Dockerfile`, `README.md`, `application.properties`, `application-prod.properties`, `FloravelApplication.java`, `shared/config/*`, `shared/security/*`, `shared/exception/*`, `shared/web/*`, `modules/auth/*`, `modules/usuario/*`, `modules/mae/*`, `modules/psicologo/*`, `modules/rh/*`, `modules/reuniao/*`, `src/test/**`, `.\mvnw.cmd test-compile`, `.\mvnw.cmd test`.
- **Key findings**:
  - Spring Boot 4.1.2 / Java 21; custom `JwtAuthInterceptor` + `JwtService` (HS256) + `spring-security-crypto` (`BCryptPasswordEncoder`), NOT `spring-boot-starter-security`.
  - R1: Email confirmation 6-digit OTP (`TokenConfirmacaoEmail` plaintext) & SMTP `EmailService` exist, but forgot/reset password (BCrypt-hashed 15-min single-use code) and post-confirmation welcome email are completely absent.
  - R4: `fotoUrl` (`VARCHAR(500)`) exists on `Usuario` and `Psicologo`, updated via `PUT /api/maes/{id}` and `PUT /api/psicologos/{id}`. No S3/R2 SDK, storage config, or presigned URL endpoints exist.
  - Tests: 14 test files, 48 tests passing (`.\mvnw.cmd test` in 37s). No `src/test/resources`; tests run against local MySQL `floraveldb` via `application.properties`.
- **Unexplored areas**: None within survey scope (non-R1/R4 domain services like `AgendamentoService`, `PagamentoService`, `TriagemService` not read in detail).

## Key Decisions Made
- Verified baseline build and test suite directly via `.\mvnw.cmd test-compile` and `.\mvnw.cmd test`.
- Documented exact file paths, signatures, endpoints, and gaps in `handoff.md`.

## Artifact Index
- `DISPATCH.md` — Dispatch log
- `BRIEFING.md` — Working memory
- `progress.md` — Liveness heartbeat
- `handoff.md` — Final 5-component survey report
