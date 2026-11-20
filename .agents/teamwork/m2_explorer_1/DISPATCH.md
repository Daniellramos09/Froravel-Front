# DISPATCH Log — m2_explorer_1

## 2026-11-20T01:20:50Z
From: `189625da-cab0-4c9f-875b-20770dbcc54b` (Parent Orchestrator)

You are `m2_explorer_1` (`teamwork_preview_explorer`) for **Milestone M2 (R2 Full-Stack — Backend RH Corporativo)**, Iteration 1.

- **Working Directory**: `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m2_explorer_1`
- **Parent Orchestrator ID**: `189625da-cab0-4c9f-875b-20770dbcc54b`
- **Mandatory Reading First**:
  1. `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\ORIGINAL_REQUEST.md`
  2. `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\PROJECT.md`
  3. `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\explorer_survey_2\handoff.md`

**Objective**:
Perform a read-only deep dive into `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel` (`modules/rh/**`, `modules/usuario/**`, `shared/config/DemoDayDataSeeder.java`, `shared/security/JwtAuthInterceptor.java`, `modules/auth/service/AuthService.java`, `modules/auth/dto/LoginResponseDTO.java`, `modules/rh/service/RhCorporativoServiceTest.java`) to design the exact M2 Backend implementation:
1. `Usuario.java` (`empresaId` nullable VARCHAR(36)) + `LoginResponseDTO` / `AuthService` (if `empresaId` should be exposed in login response, or `GET /api/rh/empresas/atual` via `UsuarioRepository` — verify cleanly!).
2. `DemoDayDataSeeder.java`: inspect how existing demo users (`MAE`, `PSICOLOGO`) are seeded and check how to seed a `TipoPerfil.RH` user linked to `TechMães Brasil S.A.` without violating AC4 (no hardcoded secret/password literals in source code — e.g. reading from `@Value("${floravel.demo.rh-password:}")` or `DemoDayDataSeeder` pattern!).
3. Exact `RhCorporativoController` & `RhCorporativoService` methods/DTOs:
   - `GET /api/rh/empresas/atual`
   - `PUT /api/rh/empresas/{empresaId}`
   - `GET /api/rh/empresas/{empresaId}/licencas`
   - `POST /api/rh/licencas/{licencaId}/reenviar`
   - `PATCH /api/rh/licencas/{licencaId}/revogar`
   - `PATCH /api/rh/licencas/{licencaId}/reativar`
   - Verify `empresaId` validation & anti-IDOR ownership check (RH user's `empresaId` matches `{empresaId}`).
   - Verify `JwtAuthInterceptor.java`: ensure `/api/rh/licencas/{id}/reenviar`, `/revogar`, `/reativar` require `RH` role (`403` for `MAE` / `PSICOLOGO`), while `/api/rh/licencas/ativar` stays accessible to authenticated mothers (`MAE`).
4. Exact unit + full-MVC `MockMvcBuilders.webAppContextSetup` tests for `modules/rh/**`.

Write `progress.md` and `handoff.md` in your working directory, then `send_message` to `189625da-cab0-4c9f-875b-20770dbcc54b`.
