# Handoff Report — `m2_explorer_3` (Milestone M2: R2 E2E Contract, LGPD & Secrets Alignment)

**Summary:** Cross-checking `tests/e2e/` (`auth-fixtures.mjs`, `tier1`–`tier4`) against `PROJECT.md § Interface Contracts #2`, `DemoDayDataSeeder.java`, `JwtAuthInterceptor.java`, and `modules/rh/**` confirms exact alignment on DTO field names and K-anonymity rules (`k >= 5`), while uncovering **5 critical implementation/security gaps** that must be handled in M2 to pass `R2.T1–T6`, `R2.B1–B6`, `T3.C2`, `T4.S2`, and `T4.S5`: (1) seeding `rh@techmaes.com.br` linked to `Empresa` via `Usuario.empresaId` using externalized `@Value` default password, (2) fixing `JwtAuthInterceptor` coverage on `/api/rh/licencas/{id}/reenviar|revogar|reativar` (`R2.B2` expects `403`), (3) enforcing company existence + cross-tenant ownership (`R2.B5` expects `403/404/422`, not `200 []`), (4) blocking `REVOGADA` license activation while preserving `maeId` on revoke so `reativar` restores `ATIVADA` vs `PENDENTE`, and (5) removing mock EPDS/Edimburgo values and unsafe denominators in `apps/rh`.

---

## 1. Observation

### 1.1 E2E Expectations for RH Login & Endpoints (`tests/e2e/`)
- **`tests/e2e/helpers/config.mjs:27-34`** and **`tests/e2e/helpers/auth-fixtures.mjs:27-40`** (`loginSeededRh()`):
  - Tries `POST /api/auth/login` with `E2E_RH_EMAIL` (if set), then `'rh@techmaes.com.br'`, `'rh@floravel.com.br'`, `'gestao.rh@techmaes.com.br'`, using `process.env.E2E_RH_PASSWORD || 'floravel123'`.
  - Requires `res.status === 200`, `res.json.tokenSessao` (non-empty), `res.json.tipoPerfil === 'RH'`, and (`tier1-features.e2e.mjs:162-165` `R1.T6`) `res.json.usuarioId`.
- **`GET /api/rh/empresas/atual`** (`tier1-features.e2e.mjs:173-181`, `tier2-boundaries.e2e.mjs:150,179`, `PROJECT.md:55`):
  - Expects `200 OK` with `{ id, nome, cnpj, status, dataCadastro }` for `RH`; `401` unauthenticated (`R2.B1`); `403` for `MAE`/`PSICOLOGO` (`R2.B2`).
  - Currently **absent** from `RhCorporativoController.java:1-37`. `Usuario.java:18-68` has **no `empresaId` field**.
- **`PUT /api/rh/empresas/{empresaId}`** (`tier1-features.e2e.mjs:183-206`, `PROJECT.md:56`):
  - Sends `{ nome, cnpj }` -> expects `200 OK` with updated `EmpresaResponseDTO` (`id`, `nome`, `cnpj`, `status`, `dataCadastro`).
  - Currently **absent** from `RhCorporativoController.java`.
- **`GET /api/rh/empresas/{empresaId}/licencas`** (`tier1-features.e2e.mjs:208-224`, `tier2-boundaries.e2e.mjs:151,182,273-276`, `tier3-combinations.e2e.mjs:114-118`, `PROJECT.md:57`):
  - Expects `200 OK` array of `LicencaResponseDTO` (`id, empresaId, nomeColaboradora, emailCorporativo, departamento, status, tokenConvite, dataConvite, dataAtivacao, garantiaSigiloLgpd`), non-empty for seeded company.
  - `R2.B5` (`tier2-boundaries.e2e.mjs:273-276`) queries `/api/rh/empresas/00000000-0000-0000-0000-000000000000/licencas` and asserts `[403, 404, 422].includes(crossTenant.status)`.
  - Currently **absent** from `RhCorporativoController.java`.
- **`POST /api/rh/licencas/convite`** (`tier1-features.e2e.mjs:226-247`, `tier2-boundaries.e2e.mjs:153,185,205-266`, `PROJECT.md:58`):
  - Expects `201 Created` (`status: 'PENDENTE'`, `tokenConvite` matching `/^FLR-B2B-/`); `422` on duplicate `empresaId + emailCorporativo` (`R2.B3`); `400` on invalid email or blank fields (`R2.B4`); `401` unauth; `403` non-RH.
  - Existing `RhCorporativoController.java:22-25` + `RhCorporativoService.java:26-47` + `ConviteLicencaRequestDTO.java:14-25` + `GlobalExceptionHandler.java:56-79` already satisfy `201`, `422`, `400`. However, `RhCorporativoService.emitirConviteLicenca` does **not** check if `dto.getEmpresaId()` exists or belongs to the authenticated RH user.
- **`POST /api/rh/licencas/{licencaId}/reenviar`** (`tier1-features.e2e.mjs:248-254`, `tier4-scenarios.e2e.mjs:154-157`, `PROJECT.md:59`):
  - Expects `200 OK` returning `LicencaResponseDTO` with matching `id` and `status: 'PENDENTE'`.
  - Currently **absent** from `RhCorporativoController.java`.
- **`PATCH /api/rh/licencas/{licencaId}/revogar` & `/reativar`** (`tier1-features.e2e.mjs:257-289`, `tier2-boundaries.e2e.mjs:162,197-201,278-282`, `tier4-scenarios.e2e.mjs:159-166`, `PROJECT.md:60-61`):
  - `revogar` -> `200 OK`, `status: 'REVOGADA'`.
  - `reativar` -> `200 OK`, `status: 'PENDENTE'` (or `'ATIVADA'` if `maeId != null` per `PROJECT.md:61`).
  - `R2.B2` (`tier2-boundaries.e2e.mjs:197-201`) calls `PATCH /api/rh/licencas/fake-id/revogar` as `MAE` and `PSICOLOGO` and asserts `status === 403`.
  - `R2.B5` (`tier2-boundaries.e2e.mjs:278-282`) calls `PATCH /api/rh/licencas/00000000-0000-0000-0000-000000000001/revogar` as `RH` and asserts `[403, 404, 422]`.
  - **Interceptor Gap (`JwtAuthInterceptor.java:108`)**: Currently checks ONLY `if (path.startsWith("/api/rh/empresas/") || "/api/rh/licencas/convite".equals(path))`. Routes `/api/rh/licencas/{id}/reenviar`, `/revogar`, `/reativar` are **unprotected by role** in `JwtAuthInterceptor`! (And `PROJECT.md:24` lists `/api/rh/licencas/**` RH role protection under F10/M3, even though M2's `R2.B2` test requires it immediately).
- **`POST /api/rh/licencas/ativar`** (`tier3-combinations.e2e.mjs:105-111`, `PROJECT.md:54`):
  - Called by authenticated `MAE` with `{ tokenConvite, maeId }` -> `200 OK`, `status: 'ATIVADA'`.
  - Existing `RhCorporativoService.java:50-65` only blocks `"ATIVADA".equalsIgnoreCase(licenca.getStatus())`; it does **not** reject `"REVOGADA"` licenses (`line 55`) and does **not** verify `dto.getMaeId()` matches authenticated `MAE`'s `perfilId`.
- **`GET /api/rh/empresas/{empresaId}/relatorio-k-anonimato`** (`tier1-features.e2e.mjs:291-313`, `tier2-boundaries.e2e.mjs:285-303`, `tier3-combinations.e2e.mjs:120-133`, `tier4-scenarios.e2e.mjs:169-175`, `PROJECT.md:62`):
  - Expects `empresaId`, `parametroKMinimo: 5`, `totalLicencasEmitidas`, `totalLicencasAtivadas`, `taxaAdesaoPercentual`, `setoresElegiveis` (`colaboradorasAtivas >= 5`, `agrupadoPorKAnonimato: false`), `indiceGeralAgrupadoKAnonimato` (`agrupadoPorKAnonimato: true`), `diretrizCompliance`.
  - Existing `RhCorporativoService.java:72-120` returns `0/0` (`taxaAdesao = 0.0`) with `200 OK` even if `empresaId` does not exist or belongs to another company.

### 1.2 `DemoDayDataSeeder.java` & `T4.S5` Secret Scan Rules
- **`DemoDayDataSeeder.java:53-183`**:
  - Lines 54-73 seed `mariana.silva@email.com` (`TipoPerfil.MAE`) with `.senha(passwordEncoder.encode("floravel123"))` (line 58).
  - Lines 76-136 seed `helena.souza@floravel.com.br` (`TipoPerfil.PSICOLOGO`) with `.senha(passwordEncoder.encode("floravel123"))` (line 80).
  - Lines 139-182 seed `Empresa` `"TechMães Brasil S.A."` (CNPJ `"12.345.678/0001-90"`, `status: "ATIVA"`) and 10 `ATIVADA` `LicencaColaboradora` rows: `Engenharia` (6), `Jurídico` (2), `Design` (2).
  - Currently **zero** `TipoPerfil.RH` users are seeded.
- **`tier4-scenarios.e2e.mjs:273-317` (`T4.S5`)**:
  - Scans `Froravel-Front/apps`, `Froravel-Front/packages`, and `floravel-backend/Floravel/src/main` (`.js/.jsx/.mjs/.cjs/.ts/.tsx/.java/.properties/.yml/.yaml`).
  - Global `secretRules` (`lines 280-288`):
    - `AWS Access Key ID`: `/\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g`
    - `Private Key Block`: `/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g`
    - `GitHub/Slack/Stripe Token`: `/\b(?:ghp_[A-Za-z0-9]{20,}|xoxb-[A-Za-z0-9-]{10,}|sk_live_[A-Za-z0-9]{16,})\b/g`
    - `Hardcoded S3/R2/JWT Secret Literal in Code`: `/(?:accessKeyId|secretAccessKey|secretKey|jwtSecret)\s*[:=]\s*["'][^"'${}]{12,}["']/g`
  - `frontendOnlyRules` (`lines 290-295`, applied only to `Froravel-Front/{apps,packages}`):
    - `Hardcoded Demo Password Literal in Frontend`: `/(?:senha|password)\s*[:=]\s*["']floravel123["']/gi`
  - `grep_search` across `Froravel-Front/apps` found `0` matches for `floravel123`; across `floravel-backend/Floravel/src/main` found `OpenApiSwaggerController.java:81,94,106` and `DemoDayDataSeeder.java:58,80` (none trigger `T4.S5`'s `secretRules`, though `ORIGINAL_REQUEST.md:30` AC4 states "Nenhuma credencial ou chave secreta hardcoded no código-fonte").

### 1.3 LGPD K-Anonymity & `apps/rh` Audit
- **`RhCorporativoService.java:72-120`** & **`LicencaResponseDTO.java:13-40`**:
  - `LicencaResponseDTO` omits `maeId` (only returns `id, empresaId, nomeColaboradora, emailCorporativo, departamento, status, tokenConvite, dataConvite, dataAtivacao, garantiaSigiloLgpd`).
  - `RelatorioKAnonimatoResponseDTO` filters only `ATIVADA` licenses (`line 78`), puts departments with `>= 5` active licenses into `setoresElegiveis` (`agrupadoPorKAnonimato = false`), and sums departments with `< 5` active licenses into `indiceGeralAgrupadoKAnonimato` (`agrupadoPorKAnonimato = true`). Zero `edimburgoScore`, `cpf`, or `maeId` fields exist in `/api/rh/**` DTOs.
  - Note `T4.S2` (`tier4-scenarios.e2e.mjs:171-174`) checks `JSON.stringify(report.json).toLowerCase()` does not contain `'edimburgoscore'`, `'cpf'`, or invited employee's `emailCorporativo`.
- **`apps/rh/src/DashboardRh.jsx`** & **`apps/rh/src/screens/HealthReportsScreen.jsx`** & **`LicensesScreen.jsx`**:
  - `DashboardRh.jsx:60-81, 348-372, 400-476` currently render hardcoded mock `"Escala de Edimburgo"` (`11,2`, `60%/25%/15%`), `"TechCorp Brasil"`, and `"42 / 50"`.
  - `LicensesScreen.jsx:130, 300` hardcodes `totalAllocated = 50` and `94%` adherence.

---

## 2. Logic Chain

1. **RH Seeding & Secret Scan Alignment (`DemoDayDataSeeder` ↔ `T4.S5` / AC4)**:
   - `loginSeededRh()` (`config.mjs:31`) defaults to `rh@techmaes.com.br` with password `'floravel123'` when `E2E_AUTO_START_BACKEND=true` runs without custom `E2E_RH_*` env vars.
   - `DemoDayDataSeeder.java:139` currently skips the `Empresa` block when `findByCnpj("12.345.678/0001-90")` is non-empty. Therefore, `DemoDayDataSeeder` must first resolve or create `Empresa emp` (`findByCnpj(...).orElseGet(...)`) so `emp.getId()` is always available even against an already-populated DB, and then ensure `rh@techmaes.com.br` (`TipoPerfil.RH`, `emailVerificado = true`, `empresaId = emp.getId()`) exists and has `empresaId` linked.
   - Using `@Value("${floravel.seed.demo-password:floravel123}") private String demoSeedPassword;` (or `${FLORAVEL_DEMO_PASSWORD:floravel123}`) in `DemoDayDataSeeder` satisfies both: (a) zero extra env vars needed for `E2E_AUTO_START_BACKEND=true`, and (b) avoids adding a new hardcoded password literal in Java while staying 100% immune to `T4.S5` (`secretRules` + `frontendOnlyRules`). In `apps/rh`, no demo password literal must ever be added (`frontendOnlyRules`).

2. **Authorization & Anti-IDOR Enforcement (`JwtAuthInterceptor` ↔ `R2.B1`, `R2.B2`, `R2.B5`)**:
   - `R2.B2` (`tier2-boundaries.e2e.mjs:197-201`) fails if `JwtAuthInterceptor.java:108` is not updated to also guard `/api/rh/licencas/{id}/reenviar`, `/revogar`, and `/reativar` (i.e., guard `/api/rh/**` for `role == "RH"` except `POST /api/rh/licencas/ativar`, which is for `MAE` / authenticated callers).
   - `R2.B5` (`tier2-boundaries.e2e.mjs:273-283`) requires `[403, 404, 422]` for non-existent/foreign `empresaId` and `licencaId`. If `RhCorporativoService` does not verify that `empresaId` exists AND equals the authenticated RH user's `empresaId` (from `Usuario.empresaId` via JWT `claims.getUsuarioId()`), `GET /empresas/{fakeId}/licencas` would return `200 []` and `GET /relatorio-k-anonimato` would return `200` with `0/0`, failing `R2.B5` and creating a cross-company IDOR vulnerability.

3. **License State Transitions & LGPD Guarantees**:
   - `RhCorporativoService.ativarLicencaComPortabilidade()` (`line 55`) only checks `"ATIVADA"`, allowing a `"REVOGADA"` token to be activated. Blocking `"REVOGADA"` prevents bypassed revocation.
   - `PROJECT.md:61` requires `reativar` to restore `"ATIVADA"` if `maeId != null` else `"PENDENTE"`. Therefore `revogar` must preserve `licenca.maeId` on the entity (while never exposing `maeId` in `LicencaResponseDTO`).
   - Empty company (`0` licenses) divides `totalAtivadas / totalEmitidas` only when `totalEmitidas > 0` on the backend (`0.0%`), but `apps/rh` must also compute `total > 0 ? Math.round((active / total) * 100) : 0` to avoid `NaN%` / `0/0` UI errors, and must remove all mock EPDS / Edimburgo clinical figures in favor of aggregate K-anonymity metrics.

---

## 3. Caveats

- **Ownership Boundary Note (`JwtAuthInterceptor.java`)**: `PROJECT.md:87-88` lists `JwtAuthInterceptor.java` under M3 ownership (F10), while `PROJECT.md:24` mentions `/api/rh/licencas/**` RH role protection under F10. However, M2's own `R2.B2` boundary test (`tier2-boundaries.e2e.mjs:197-201`) already exercises `PATCH /api/rh/licencas/fake-id/revogar` expecting `403`. Either M2 updates `JwtAuthInterceptor.java:108` now (recommended) or M2 cannot pass `tier2-boundaries.e2e.mjs` `R2.B2` until M3.
- **No runtime execution performed**: Findings are based on static inspection of `tests/e2e/`, `floravel-backend`, and `Froravel-Front/apps/rh` (read-only investigation).
- **Resend on non-pending licenses**: `PROJECT.md:59` does not explicitly specify status codes when calling `/reenviar` on an `ATIVADA` or `REVOGADA` license; rejecting `REVOGADA` (and optionally `ATIVADA`) with `RegraDeNegocioException` (`422`) is safer, as `T4.S2` and `R2.T4` only resend `PENDENTE` invites.

---

## 4. Conclusion

The E2E contracts in `tests/e2e/` (`R1.T6`, `R2.T1–T6`, `R2.B1–B6`, `T3.C2`, `T4.S2`, `T4.S5`) align cleanly with `PROJECT.md § Interface Contracts #2`, provided M2 implements the following concrete requirements and edge-case safeguards:

| Area | Actionable Requirement / Edge Case Guard | Target Files |
|---|---|---|
| **1. Seeded RH User & Secrets** | Add nullable `empresaId` on `Usuario`. In `DemoDayDataSeeder`, resolve-or-create `"TechMães Brasil S.A."` (`12.345.678/0001-90`), seed `rh@techmaes.com.br` (`TipoPerfil.RH`, `emailVerificado=true`, `empresaId=emp.getId()`), and read seed password via `@Value("${floravel.seed.demo-password:floravel123}")` so `E2E_AUTO_START_BACKEND=true` works without extra env vars and passes `T4.S5` / AC4. | `Usuario.java`, `DemoDayDataSeeder.java` |
| **2. Missing M2 Endpoints** | Implement `GET /api/rh/empresas/atual`, `PUT /api/rh/empresas/{empresaId}`, `GET /api/rh/empresas/{empresaId}/licencas`, `POST /api/rh/licencas/{licencaId}/reenviar`, `PATCH /api/rh/licencas/{licencaId}/revogar`, `PATCH /api/rh/licencas/{licencaId}/reativar` matching `PROJECT.md` DTOs (`EmpresaResponseDTO`, `LicencaResponseDTO`). | `RhCorporativoController.java`, `RhCorporativoService.java`, `modules/rh/dto/**` |
| **3. Role AuthZ & Anti-IDOR** | Protect `/api/rh/**` (except `POST /api/rh/licencas/ativar`) for `role == "RH"` in `JwtAuthInterceptor.java:108` (`403` for `MAE`/`PSICOLOGO`, satisfying `R2.B2`). Verify `empresaId` exists and matches the authenticated RH user's `empresaId` across all `/empresas/{empresaId}*`, `/convite`, and `/licencas/{licencaId}*` endpoints (`403`/`404`, never `200 []`, satisfying `R2.B5`). Verify `MAE` `perfilId` on `/ativar`. | `JwtAuthInterceptor.java`, `RhCorporativoController.java`, `RhCorporativoService.java` |
| **4. License State Edge Cases** | In `ativarLicencaComPortabilidade`, reject `"REVOGADA"` with `422` (`RegraDeNegocioException`). In `revogar`, preserve `maeId` on entity so `reativar` sets `"ATIVADA"` if `maeId != null` else `"PENDENTE"`. Reject `reenviar` on `"REVOGADA"` (and `"ATIVADA"`) with `422`. | `RhCorporativoService.java` |
| **5. LGPD & `0/0` / `0%` Safety** | Keep `maeId` out of `LicencaResponseDTO`. Ensure `relatorio-k-anonimato` only exposes `>= 5` active departments in `setoresElegiveis` and aggregates `< 5` into `indiceGeralAgrupadoKAnonimato` with `0.0` adherence when `totalEmitidas == 0`. In `apps/rh`, remove all mocked EPDS/Edimburgo clinical scores/charts (`DashboardRh.jsx`, `HealthReportsScreen.jsx`), replace hardcoded `50`/`94%` (`LicensesScreen.jsx`), and guard `0/0` division by zero. | `RhCorporativoService.java`, `LicencaResponseDTO.java`, `apps/rh/src/**` |

---

## 5. Verification Method

After M2 implementation is complete, independently verify using:

1. **Backend unit/integration tests**:
   ```powershell
   cd C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel
   .\mvnw.cmd clean test
   ```
   Confirm `0` failures and `0` errors.

2. **Frontend build & unit tests**:
   ```powershell
   cd C:\Users\danie\PROA\projetoDemoDay\Froravel-Front
   npm run build:all
   ```
   Confirm `0` errors across `landing`, `mae`, `psicologo`, `rh`.

3. **E2E Suite (R2 + Secrets + Build Gates)**:
   ```powershell
   cd C:\Users\danie\PROA\projetoDemoDay\Froravel-Front
   $env:E2E_AUTO_START_BACKEND="true"
   node tests/e2e/run-e2e.mjs --tier=1,2,3,4 --filter="R1.T6|R2\.|T3\.C2|T4\.S2|T4\.S4|T4\.S5"
   ```
   Confirm 100% pass on:
   - `R1.T6` (seeded `RH` login)
   - `R2.T1`–`R2.T6` (RH company/license lifecycle & K-anonymity)
   - `R2.B1`–`R2.B6` (401, 403 for `MAE`/`PSICOLOGO` incl. `/revogar`, 422 duplicate, 400 validation, 403/404/422 cross-tenant IDOR, `<5` K-anonymity masking)
   - `T3.C2` (RH invite -> Mother activate -> K-anonymity update)
   - `T4.S2` (RH corporate journey & zero PII/EPDS leak)
   - `T4.S4` & `T4.S5` (`build:all` + zero hardcoded secret violations)

4. **Invalidation Conditions**:
   - Any `200` response on `/api/rh/empresas/00000000-0000-0000-0000-000000000000/licencas` or non-`403` response on `PATCH /api/rh/licencas/fake-id/revogar` with `MAE`/`PSICOLOGO` JWT invalidates M2 security compliance.
   - Any occurrence of `floravel123` matched by `/(?:senha|password)\s*[:=]\s*["']floravel123["']/gi` in `Froravel-Front/{apps,packages}` or `accessKeyId|secretAccessKey|secretKey|jwtSecret` literal in backend/frontend invalidates `T4.S5`.
