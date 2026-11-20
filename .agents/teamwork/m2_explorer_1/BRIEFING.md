# BRIEFING — 2026-11-20T01:25:00Z

## Mission
Design the exact M2 Backend implementation for R2 (RH Corporativo) via read-only deep dive into `floravel-backend/Floravel`.

## 🔒 My Identity
- Archetype: Explorer (`teamwork_preview_explorer`)
- Roles: Investigation, Synthesis
- Working directory: `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m2_explorer_1`
- Original parent: `189625da-cab0-4c9f-875b-20770dbcc54b`
- Milestone: M2 (R2 Full-Stack — Backend RH Corporativo), Iteration 1

## 🔒 Key Constraints
- Read-only investigation — do NOT modify backend or frontend source code
- Write only to `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m2_explorer_1`
- Respect AC4 (no hardcoded secret/password literals in source code) and M2 code layout ownership in `PROJECT.md`

## Current Parent
- Conversation ID: `189625da-cab0-4c9f-875b-20770dbcc54b`
- Updated: 2026-11-20T01:25:00Z

## Investigation State
- **Explored paths**:
  - `modules/rh/**` (`RhCorporativoController`, `RhCorporativoService`, `Empresa`, `LicencaColaboradora`, repositories, DTOs)
  - `modules/usuario/**` (`Usuario`, `UsuarioRepository`, `TipoPerfil`)
  - `modules/auth/**` (`AuthController`, `AuthService`, `LoginResponseDTO`, `EmailService`)
  - `shared/**` (`DemoDayDataSeeder`, `JwtAuthInterceptor`, `JwtService`, `GlobalExceptionHandler`, `ErrorResponseDTO`, `WebMvcSecurityConfig`, `CpfUtil`, `OpenApiSwaggerController`)
  - `src/main/resources/application.properties`, `application-prod.properties`, `.env.example`, `pom.xml`
  - `src/test/java/**` (`RhCorporativoServiceTest`, `PsicologoPersistenciaAndSecurityTest`, `AuthControllerTest`, `AuthServiceTest`, `MaeControllerTest`)
  - `apps/rh/src/**` & `apps/landing/src/Screen/Auth/LoginScreen.jsx` & `tests/e2e/helpers/config.mjs` (read-only cross-check)
- **Key findings**:
  - `GlobalExceptionHandler` has `@ExceptionHandler(Exception.class)` -> `500`, so new domain exceptions (`EmpresaNaoEncontradaException`, `LicencaNaoEncontradaException`, `AcessoNegadoRhException`) must be registered in `GlobalExceptionHandler`.
  - `JwtAuthInterceptor.java:108` misses `/api/rh/licencas/{id}/reenviar`, `/revogar`, `/reativar`; changing condition to `(path.startsWith("/api/rh/") && !"/api/rh/licencas/ativar".equals(path))` protects all RH routes while keeping `/ativar` open to `MAE`.
  - `DemoDayDataSeeder` seeds `"ATIVADA"` licenses with `dataAtivacao != null` and `maeId = null`, so `reativar` must check `maeId != null || dataAtivacao != null`.
  - E2E config probes `rh@techmaes.com.br`; `DemoDayDataSeeder` can seed it using `@Value("${floravel.demo.rh-password:}")` without violating AC4.
- **Unexplored areas**: Runtime test execution (`mvnw.cmd test` deferred to implementer/verifier).

## Key Decisions Made
- Add nullable `empresaId` (`VARCHAR(36)`) to `Usuario` + expose `empresaId` in `LoginResponseDTO` (`AuthService`), while resolving `GET /api/rh/empresas/atual` and anti-IDOR ownership checks authoritatively via `UsuarioRepository` + `ATTR_JWT_CLAIMS`.
- Enforce anti-IDOR `empresaId` checks in `RhCorporativoService` returning `403` (`AcessoNegadoRhException`), keeping 1-arg service delegates for unit test compatibility.

## Artifact Index
- `DISPATCH.md` — Recorded dispatch instructions
- `BRIEFING.md` — Persistent working memory
- `progress.md` — Liveness heartbeat and step tracker
- `handoff.md` — Complete 5-component M2 backend design report
