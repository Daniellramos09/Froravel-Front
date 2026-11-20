## 2026-11-20T01:25:34Z

You are `m2_worker_1` (`teamwork_preview_worker`) implementing **Milestone M2: R2 Full-Stack — Dashboard RH Live Integration**.

- **Working Directory**: `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m2_worker_1`
- **Parent Orchestrator ID**: `189625da-cab0-4c9f-875b-20770dbcc54b`

**Mandatory Reading First**:
1. `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\ORIGINAL_REQUEST.md`
2. `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\PROJECT.md`
3. Explorer Blueprints:
   - `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m2_explorer_1\handoff.md`
   - `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m2_explorer_2\handoff.md`
   - `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m2_explorer_3\handoff.md`

**Exclusive Write Ownership**:
- Backend (`C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel`): `modules/rh/**`, `modules/usuario/model/Usuario.java`, additive `empresaId` in `modules/auth/dto/LoginResponseDTO.java` & `AuthService.java`, `shared/config/DemoDayDataSeeder.java`, `shared/security/JwtAuthInterceptor.java` (RH rules), `shared/exception/GlobalExceptionHandler.java` (RH exceptions), `application.properties` & `.env.example` (`floravel.demo.rh-*` props), and `src/test/java/br/com/floravel/floravel/modules/rh/**`.
- Frontend (`C:\Users\danie\PROA\projetoDemoDay\Froravel-Front`): `apps/rh/**` only.
- Do NOT touch `apps/landing/**`, `apps/mae/**`, `apps/psicologo/**`, `packages/shared/**`, `tests/e2e/**`, or `PROJECT.md`.
