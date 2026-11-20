## 2026-11-20T01:37:29Z
You are `m2_challenger_1` (`teamwork_preview_challenger`) adversarially verifying **Milestone M2 (Backend R2 — `modules/rh/**` & Security)**, Iteration 1.

- **Working Directory**: `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m2_challenger_1`
- **Parent Orchestrator ID**: `189625da-cab0-4c9f-875b-20770dbcc54b`
- **Mandatory Reading First**:
  1. `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\ORIGINAL_REQUEST.md`
  2. `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\PROJECT.md`
  3. `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m2_worker_1\handoff.md`

**Objective**:
Empirically stress-test M2 Backend (`modules/rh/**`, `JwtAuthInterceptor`, `DemoDayDataSeeder`, `GlobalExceptionHandler`):
1. Perform static inspection first, then run `.\mvnw.cmd test "-Dtest=Rh*,DemoDayDataSeederRhTest"` (WITHOUT `clean`, retrying once if transient concurrent DB cleanup occurs) + any ephemeral adversarial probes (cleaned up afterward!) to probe:
   - Cross-tenant IDOR: RH of Company A calling `/empresas/{companyB}/*`, `/licencas/convite` with `companyB`, `/licencas/{companyBLicencaId}/reenviar|revogar|reativar` -> must be `403` (never `200`).
   - Non-existent UUIDs (`empresaId` / `licencaId`) -> `403`/`404` (never `200 []` or `500`).
   - Non-RH (`MAE`, `PSICOLOGO`) tokens on every `/api/rh/**` endpoint except `/api/rh/licencas/ativar` -> `403`.
   - `ativarLicencaComPortabilidade` on `REVOGADA` license -> `422`.
   - `revogar` -> `reativar` on both `PENDENTE` and `ATIVADA` (including seeded `maeId == null && dataAtivacao != null`) licenses.
   - K-anonymity (`< 5` departments masked, `0/0` empty company -> `0.0%`, zero PII/EPDS/maeId in responses).
   - `PUT /api/rh/empresas/{id}` CNPJ formatting, duplicate CNPJ (`422`), invalid CNPJ (`400`).
2. Deliver explicit verdict **`APPROVE`** or **`REJECT`** in `handoff.md` and `send_message` to `189625da-cab0-4c9f-875b-20770dbcc54b`.
