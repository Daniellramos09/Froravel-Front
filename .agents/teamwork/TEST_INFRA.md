# Test Infrastructure & E2E Specification — Florável Platform (Blocks R1–R4)

> **Track:** E2E Testing Track (Independent, Requirement-Driven, Opaque-Box)  
> **Sources of Truth:** `ORIGINAL_REQUEST.md`, `PROJECT.md` (Interface Contracts & Feature Inventory F1–F14)  
> **Suite Location:** `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\tests\e2e\`

---

## 1. Feature Inventory (F1–F14 Coverage Matrix)

| ID | Feature | Requirement | Milestone | Covered In Tiers |
|---|---|---|---|---|
| **F1** | Password Reset Request (`POST /api/auth/esqueci-senha`) | R1 | M1 | Tier 1 (R1), Tier 2 (R1), Tier 3, Tier 4 |
| **F2** | Password Reset Confirm (`POST /api/auth/redefinir-senha`) | R1 | M1 | Tier 1 (R1), Tier 2 (R1), Tier 3, Tier 4 |
| **F3** | Post-Validation Welcome Email (`POST /api/auth/confirmar-email`) | R1 | M1 | Tier 1 (R1), Tier 3, Tier 4 |
| **F4** | Frontend R1 (`apps/landing` flows, `salvarSessaoLocal`, no secret literals) | R1, AC3, AC4 | M1 | Tier 4 (Build & Secrets Gate) |
| **F5** | RH Company Discovery & User Link (`GET /api/rh/empresas/atual`, `PUT /api/rh/empresas/{id}`, RH seed) | R2 | M2 | Tier 1 (R2), Tier 2 (R2), Tier 3, Tier 4 |
| **F6** | RH License Lifecycle (`GET licencas`, `POST convite`, `POST reenviar`, `PATCH revogar/reativar`, K-anonymity) | R2 | M2 | Tier 1 (R2), Tier 2 (R2), Tier 3, Tier 4 |
| **F7** | Frontend R2 (`apps/rh` real API wiring, safe fallbacks, auth guard) | R2 | M2 | Tier 4 (Build & Secrets Gate) |
| **F8** | Room-Scoped Live Room & Participant Tracking (`/{salaId}/estado`, `/entrar`, `/sair`, `/status`, `/mensagens`, `/disjuntor`) | R3 | M3 | Tier 1 (R3), Tier 2 (R3), Tier 3, Tier 4 |
| **F9** | Real-Time SSE Notifications (`GET /api/sala-ao-vivo/{salaId}/eventos`) | R3 | M3 | Tier 1 (R3), Tier 2 (R3), Tier 3, Tier 4 |
| **F10** | SSE Security, Async & CORS Config (`Last-Event-ID`, `Cache-Control`, `?token=`, `ASYNC` dispatch) | R3 | M3 | Tier 1 (R3), Tier 2 (R3), Tier 3 |
| **F11** | Frontend R3 (`apps/psicologo` & `apps/mae` Jitsi + SSE integration) | R3 | M3 | Tier 4 (Build & Secrets Gate) |
| **F12** | S3 / Cloudflare R2 Presigned URL Service (`POST /api/usuarios/me/foto/presigned-url`, `/api/storage/presigned-url`) | R4 | M4 | Tier 1 (R4), Tier 2 (R4), Tier 3, Tier 4 |
| **F13** | Authenticated Profile Photo Persistence (`GET /api/usuarios/me`, `PATCH /api/usuarios/me/foto`) & Frontend R4 | R4 | M4 | Tier 1 (R4), Tier 2 (R4), Tier 3, Tier 4 |
| **F14** | Full Build, E2E Suite (Tiers 1–4) & Tier 5 Hardening | AC1–AC4 | M5 | Tier 4 (All-Apps Build & Secrets Gate) |

---

## 2. Test Architecture

### 2.1 Isolation & Zero-Dependency Design
- **Runtime:** Node.js `>= 22` (verified on `v24.21.0`) using built-in `node:test` and `node:assert/strict`, native `fetch`, `AbortController`, and `ReadableStream`/`TextDecoder` for SSE parsing.
- **Independent Package:** `tests/e2e/package.json` (`"type": "module"`, `"private": true`, zero external `dependencies`/`devDependencies`). Root `Froravel-Front/package.json`, `package-lock.json`, `apps/*`, `packages/*`, and `floravel-backend/Floravel/src/main` are **never modified** by the E2E suite.
- **Opaque-Box Testing:** All API assertions interact exclusively over HTTP/SSE contracts documented in `PROJECT.md` and `ORIGINAL_REQUEST.md` without importing backend classes or querying internal database tables directly.

### 2.2 Directory Layout
```text
Froravel-Front/tests/e2e/
├── package.json                  # Independent package manifest (zero external deps)
├── run-e2e.mjs                   # CLI runner (supports --tier, --dry-run, --skip-builds, auto-start backend)
├── helpers/
│   ├── config.mjs                # Env config (E2E_API_BASE, seeded credentials, timeouts)
│   ├── http-client.mjs           # JSON/CORS/SSE fetch helpers + unique synthetic generators
│   ├── email-otp.mjs             # Opaque-box OTP/welcome email inbox reader (log sink / Mailtrap API)
│   └── auth-fixtures.mjs         # Signup, login, and role-token helpers (MAE, PSICOLOGO, RH)
├── tier1-features.e2e.mjs        # Tier 1: Core feature coverage (>=5 per block R1–R4)
├── tier2-boundaries.e2e.mjs      # Tier 2: Boundary, authz, validation & corner cases (>=5 per block R1–R4)
├── tier3-combinations.e2e.mjs    # Tier 3: Cross-feature & multi-actor workflows
└── tier4-scenarios.e2e.mjs       # Tier 4: Real-world E2E journeys + build & secrets gates (>=5 scenarios)
```

### 2.3 Email OTP & Welcome Verification Strategy (Opaque-Box)
- When `E2E_AUTO_START_BACKEND=true` (or `E2E_BACKEND_LOG_FILE` is provided), `run-e2e.mjs` captures the backend console output (`EmailService` dev fallback `[FLORÁVEL EMAIL - DEV / DEMO DAY FALLBACK]` and welcome email logs) and reads the 6-digit code sent to the synthetic test recipient.
- Alternatively, if `E2E_MAILTRAP_API_TOKEN` + `E2E_MAILTRAP_INBOX_ID` are set, `email-otp.mjs` polls the Mailtrap sandbox inbox API.
- If no email sink is configured against a pre-running external server, non-OTP contracts still execute unconditionally while OTP-inbox-dependent steps report a clear diagnostic skip (`t.skip`) rather than silently passing as facades.

### 2.4 Backend Lifecycle Modes
1. **External Running Backend (default):** `E2E_API_BASE=http://localhost:8080 node tests/e2e/run-e2e.mjs`
2. **Managed Auto-Start Backend:** `E2E_AUTO_START_BACKEND=true node tests/e2e/run-e2e.mjs` — spawns `.\mvnw.cmd spring-boot:run`, waits for `GET /api/health` -> `200 UP`, runs selected tiers while capturing email fallback logs, and cleanly terminates the backend process tree on exit.

---

## 3. Tier 1–4 Scenario Inventory

### Tier 1 — Feature Coverage (`tier1-features.e2e.mjs`) — 23 Scenarios (>=5 per block)
- **Block R1 (6 tests):**
  1. `POST /api/auth/esqueci-senha` returns `200 OK` with `{ mensagem, email, expiracaoMinutos: 15 }` for existing account.
  2. `POST /api/auth/esqueci-senha` returns `200 OK` with identical safe structure for unknown email (no account enumeration leak).
  3. `POST /api/auth/redefinir-senha` resets password with emailed 6-digit code (`200 OK`, `{ redefinida: true }`) and allows login with the new password.
  4. `POST /api/maes` signup sets `emailVerificado: false`, `POST /api/auth/confirmar-email` verifies account (`verificado: true`), and welcome email is dispatched.
  5. `POST /api/auth/reenviar-codigo` issues a fresh 6-digit confirmation code (`verificado: false`) and supersedes the prior code.
  6. `POST /api/auth/login` authenticates seeded `MAE`, `PSICOLOGO`, and `RH` accounts returning JWT `tokenSessao`, `usuarioId`, `perfilId`, `codigoPublico`, `tipoPerfil`.
- **Block R2 (6 tests):**
  1. `GET /api/rh/empresas/atual` returns the authenticated RH user's company (`id`, `nome`, `cnpj`, `status`, `dataCadastro`).
  2. `PUT /api/rh/empresas/{empresaId}` updates company `nome`/`cnpj` (`200 OK`) and restores original metadata cleanly.
  3. `GET /api/rh/empresas/{empresaId}/licencas` returns `LicencaResponseDTO[]` with `id`, `empresaId`, `status`, `tokenConvite`, `garantiaSigiloLgpd`.
  4. `POST /api/rh/licencas/convite` creates `PENDENTE` license (`201 Created`, `FLR-B2B-*`) and `POST /api/rh/licencas/{id}/reenviar` succeeds (`200 OK`).
  5. `PATCH /api/rh/licencas/{id}/revogar` sets `REVOGADA` and `PATCH /api/rh/licencas/{id}/reativar` restores active/pending status.
  6. `GET /api/rh/empresas/{empresaId}/relatorio-k-anonimato` returns `parametroKMinimo: 5`, `setoresElegiveis` (`>=5`), `indiceGeralAgrupadoKAnonimato` (`<5`), and `diretrizCompliance`.
- **Block R3 (6 tests):**
  1. `GET /api/sala-ao-vivo/{salaId}/estado` returns room-scoped state with `salaId` and `jitsiRoomName` matching `floravel-acolhimento-<sanitized>`.
  2. `GET /api/sala-ao-vivo/{salaId}/eventos` returns `text/event-stream` and emits `CONNECTED` event on connect.
  3. `POST /api/sala-ao-vivo/{salaId}/entrar` and `/sair` update `participantes` and broadcast `PARTICIPANT_JOINED` / `PARTICIPANT_LEFT` over SSE.
  4. `POST /api/sala-ao-vivo/{salaId}/mensagens` persists message and broadcasts `CHAT_MESSAGE` over SSE.
  5. `POST /api/sala-ao-vivo/{salaId}/status` and `/disjuntor` broadcast `ROOM_STATUS_CHANGED` and `DISJUNTOR_ACIONADO` over SSE.
  6. Legacy `GET /api/sala-ao-vivo/estado` remains functional for the `"default"` room.
- **Block R4 (5 tests):**
  1. `POST /api/usuarios/me/foto/presigned-url` returns valid presigned URL payload for `image/jpeg` (`expiresInSeconds: 300`, `method: "PUT"`, `requiredHeaders`).
  2. `POST /api/usuarios/me/foto/presigned-url` supports `image/png` and `image/webp`.
  3. `POST /api/storage/presigned-url` alias satisfies identical presigned URL contract.
  4. `PATCH /api/usuarios/me/foto` persists `https://...` `fotoUrl` for `MAE`, `PSICOLOGO`, and `RH` roles.
  5. `GET /api/usuarios/me` returns authenticated user metadata (`usuarioId`, `perfilId`, `codigoPublico`, `fotoUrl`, `tipoPerfil`, `empresaId`) reflecting the updated `fotoUrl`.

### Tier 2 — Boundary & Corner Cases (`tier2-boundaries.e2e.mjs`) — 24 Scenarios (>=5 per block)
- **Block R1 (6 tests):** Wrong 6-digit reset code (`400`), reused reset code (`400`), non-6-digit/malformed code (`400`), malformed/blank email in `/esqueci-senha` (`400`), short password `<6` chars in `/redefinir-senha` (`400`), requesting a new reset code invalidates prior code (`400` on old code) + expired-code error contract check (`400`).
- **Block R2 (6 tests):** Unauthenticated RH endpoints (`401`), `MAE` & `PSICOLOGO` denied on RH endpoints (`403`), duplicate invite in same company (`422`), invalid invite payload fields (`400`), unknown `empresaId`/`licencaId` access rejected (`403`/`404`/`422`), K-anonymity privacy guarantee ensuring departments with `<5` active licenses never appear in `setoresElegiveis`.
- **Block R3 (6 tests):** Cross-room isolation (`salaA` events/messages/disjuntor do not leak to `salaB`), Jitsi `salaId` sanitization against special chars/path traversal, CORS `OPTIONS` preflight with `Last-Event-ID` and `Cache-Control` headers, blank/whitespace chat message ignored, optional `?token=<jwt>` SSE query param & clean disconnect, multi-subscriber SSE broadcast resilience when one subscriber disconnects.
- **Block R4 (6 tests):** Unauthenticated `/api/usuarios/me*` & `/api/storage/presigned-url` (`401`), rejected MIME types (`image/svg+xml`, `application/pdf`, `text/plain`, `application/octet-stream` -> `400`/`422`), oversized `>5MB` (`5242881` -> `400`/`422`) vs exact `5MB` (`5242880` -> `200`), zero-byte/negative file sizes (`0`, `-1` -> `400`/`422`), non-HTTP(S) & `>500` char `fotoUrl` (`javascript:`, `data:`, `ftp://`, `file://` -> `400`/`422`), path-traversal `fileName` (`../../etc/passwd.jpg`) sanitized or rejected cleanly.

### Tier 3 — Cross-Feature Combinations (`tier3-combinations.e2e.mjs`) — 4 Scenarios
1. **R1 Full Account Lifecycle:** `POST /api/maes` -> `confirmar-email` (+ welcome email) -> `esqueci-senha` -> `redefinir-senha` -> old password fails login -> new password succeeds login.
2. **R2 + Mae License Activation:** RH discovers `empresaId` -> invites employee -> Mother registers & calls `POST /api/rh/licencas/ativar` -> RH license list shows `ATIVADA` & K-anonymity adherence rate updates accurately.
3. **R4 + Multi-Role Profile Sync:** Authenticated `MAE` and `PSICOLOGO` generate presigned URLs -> `PATCH /api/usuarios/me/foto` -> `GET /api/usuarios/me` + `GET /api/maes/{id}` / `GET /api/psicologos/{id}` reflect the persisted `fotoUrl`.
4. **R3 Cross-Portal Realtime Notification:** Mother & Psychologist open independent SSE streams on the same `salaId` -> Psychologist joins -> Mother receives `PARTICIPANT_JOINED` -> Mother joins -> Psychologist receives `PARTICIPANT_JOINED` -> chat message exchanged -> Mother leaves -> Psychologist receives `PARTICIPANT_LEFT`.

### Tier 4 — Real-World Application Scenarios (`tier4-scenarios.e2e.mjs`) — 5 Scenarios
1. **Journey 1 — Mother End-to-End Onboarding, Recovery & Avatar Update** (`validar-identidade` -> `maes` signup -> email confirmation -> password reset -> login -> presigned URL + photo save -> `GET /api/usuarios/me`).
2. **Journey 2 — Corporate RH Lifecycle & LGPD K-Anonymity Audit** (RH login -> `empresas/atual` -> update & restore company -> invite 2 -> resend 1 -> revoke & reactivate 1 -> verify K-anonymity report contains zero individual clinical/PII data).
3. **Journey 3 — Live Welcoming Room Session with Escudo Florável Disjuntor** (Psychologist starts SSE -> `AO_VIVO` -> Mother joins -> chat -> `DISJUNTOR_ACIONADO` -> resume `AO_VIVO` -> clean leave).
4. **Journey 4 — Frontend Monorepo Production Build Gate** (`npm run build:all` across `landing`, `mae`, `psicologo`, `rh` exits `0` and produces `dist/index.html` for all 4 apps).
5. **Journey 5 — Zero Hardcoded Secrets & Contract Hygiene Scan** (Static scan across `Froravel-Front/{apps,packages}` and `floravel-backend/Floravel/src/main` verifying zero hardcoded AWS keys, private keys, API tokens, or frontend credential literals).

---

## 4. Coverage Thresholds & Acceptance Criteria

| Metric | Required Threshold | Verification Method |
|---|---|---|
| **Tier 1 Feature Pass Rate** | 100% (all R1–R4 blocks, >=5 scenarios/block) | `node tests/e2e/run-e2e.mjs --tier=1` |
| **Tier 2 Boundary Pass Rate** | 100% (all R1–R4 blocks, >=5 scenarios/block) | `node tests/e2e/run-e2e.mjs --tier=2` |
| **Tier 3 Combination Pass Rate** | 100% (4 cross-feature workflows) | `node tests/e2e/run-e2e.mjs --tier=3` |
| **Tier 4 Real-World Pass Rate** | 100% (5 journeys incl. `build:all` & secrets scan) | `node tests/e2e/run-e2e.mjs --tier=4` |
| **Frontend Production Build** | 0 errors across `landing`, `mae`, `psicologo`, `rh` | `npm run build:all` |
| **Hardcoded Secrets** | 0 violations | Tier 4 Journey 5 static scan |

---

## 5. How to Run
```powershell
# From C:\Users\danie\PROA\projetoDemoDay\Froravel-Front
node tests/e2e/run-e2e.mjs --help
node tests/e2e/run-e2e.mjs --dry-run

# Against a running backend on http://localhost:8080:
node tests/e2e/run-e2e.mjs

# Auto-starting the Spring Boot backend (captures dev email fallback logs for full R1 OTP tests):
$env:E2E_AUTO_START_BACKEND="true"; node tests/e2e/run-e2e.mjs

# Run specific tiers or skip frontend build in fast API loops:
node tests/e2e/run-e2e.mjs --tier=1,2 --skip-builds
```
