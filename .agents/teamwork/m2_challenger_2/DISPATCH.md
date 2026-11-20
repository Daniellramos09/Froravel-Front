## 2026-11-20T01:37:29Z

You are `m2_challenger_2` (`teamwork_preview_challenger`) adversarially verifying **Milestone M2 (Frontend R2 — `apps/rh/**`)**, Iteration 1.

- **Working Directory**: `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m2_challenger_2`
- **Parent Orchestrator ID**: `189625da-cab0-4c9f-875b-20770dbcc54b`
- **Mandatory Reading First**:
  1. `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\ORIGINAL_REQUEST.md`
  2. `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\PROJECT.md`
  3. `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m2_worker_1\handoff.md`

**Objective**:
Empirically stress-test M2 Frontend (`apps/rh/**`):
1. Run `npm run test:all`, `npm --workspace=@floravel/rh run lint`, `npm run build:all` in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front`.
2. Probe edge cases empirically (e.g. via temporary Vitest probes deleted cleanly afterward):
   - Unauthenticated / wrong-role (`MAE` or `PSICOLOGO` token) auth guard + `#auth=` malformed hash handling.
   - Empty company (`0` licenses -> `0/0`, `0%`, no `NaN%` or crash in Donut/BarChart).
   - `401` / `403` / `500` / network failure on initial load & retry recovery, and during license CRUD (`convite` 422 duplicate, `revogar` error, `reativar`, `reenviar`) + Settings `PUT` (`400`/`422`).
   - Double-submit / rapid clicking on invite modal or Settings save or row action buttons.
   - Verify no `"TechCorp"`, `INITIAL_*`, or fake clinical/billing data leaks into rendered DOM.
3. Deliver explicit verdict **`APPROVE`** or **`REJECT`** in `handoff.md` and `send_message` to `189625da-cab0-4c9f-875b-922f49f35fb2` (actually `189625da-cab0-4c9f-875b-20770dbcc54b`).
