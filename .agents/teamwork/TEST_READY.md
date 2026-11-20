# TEST_READY — Florável Opaque-Box E2E Test Suite (Tiers 1–4)

> **Status:** `READY`  
> **Published:** 2026-11-20T00:47:30Z  
> **Specification:** `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\TEST_INFRA.md`  
> **Suite Root:** `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\tests\e2e\`

---

## 1. Suite Inventory & Scenario Counts

| Tier | File | Scope | Scenarios |
|---|---|---|---:|
| **Tier 1** | `tests/e2e/tier1-features.e2e.mjs` | Feature Coverage across R1 (6), R2 (6), R3 (6), R4 (5) | **23** |
| **Tier 2** | `tests/e2e/tier2-boundaries.e2e.mjs` | Boundary, Authz, Validation & Corner Cases across R1 (6), R2 (6), R3 (6), R4 (6) | **24** |
| **Tier 3** | `tests/e2e/tier3-combinations.e2e.mjs` | Cross-feature & multi-actor workflows (R1 lifecycle, R2+Mae activation, R4+profile sync, R3 cross-portal SSE) | **4** |
| **Tier 4** | `tests/e2e/tier4-scenarios.e2e.mjs` | Real-world end-to-end journeys (3) + `npm run build:all` gate (1) + zero hardcoded secrets scan (1) | **5** |
| **Total** | | **All F1–F14 contracts covered** | **56** |

---

## 2. How to Run (M5 Acceptance Gate)

```powershell
# From C:\Users\danie\PROA\projetoDemoDay\Froravel-Front

# 1. Dry-run & syntax verification (no running backend required):
node tests/e2e/run-e2e.mjs --dry-run

# 2. Full E2E run against a running Spring Boot server on http://localhost:8080:
node tests/e2e/run-e2e.mjs

# 3. Full E2E run auto-starting Spring Boot & capturing dev email fallback logs for full OTP verification:
$env:E2E_AUTO_START_BACKEND="true"; node tests/e2e/run-e2e.mjs

# 4. Run selective tiers or skip frontend rebuild in iterative API runs:
node tests/e2e/run-e2e.mjs --tier=1,2 --skip-builds
```

---

## 3. Baseline Verification Results (Pre-M1..M4 Implementation)
- **Syntax & Runner Dry-Run (`node --check` + `--dry-run`):** `PASS` (exit 0, all 4 tier files validated).
- **Tier 4 Production Build Gate (`T4.S4` — `npm run build:all` across `landing`, `mae`, `psicologo`, `rh`):** `PASS` (2/2 in `11.71s`, all 4 `dist/index.html` artifacts present).
- **Tier 4 Secrets Scan (`T4.S5`):** `PASS` (0 hardcoded secret violations across `Froravel-Front/{apps,packages}` and `floravel-backend/Floravel/src/main`).
- **Tiers 1–3 + Tier 4 API Journeys (`T4.S1`–`T4.S3`):** Ready for execution against M1–M4 completed implementation in Milestone M5.
