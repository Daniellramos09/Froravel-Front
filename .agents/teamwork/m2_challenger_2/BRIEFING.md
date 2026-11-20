# BRIEFING — 2026-11-20T01:37:29Z

## Mission
Adversarially verify Milestone M2 Frontend R2 (`apps/rh/**`) for correctness, edge cases, error handling, auth guard, double-submit prevention, and absence of mock/clinical/billing data leaks.

## 🔒 My Identity
- Archetype: Empirical Challenger (`teamwork_preview_challenger`)
- Roles: critic, specialist
- Working directory: C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m2_challenger_2
- Original parent: 189625da-cab0-4c9f-875b-20770dbcc54b
- Milestone: M2 (Frontend R2 — `apps/rh/**`)
- Instance: 1 of 1

## 🔒 Key Constraints
- Review-only — do NOT modify implementation code
- Temporary Vitest probes in `apps/rh` must be deleted cleanly afterward
- `.agents/teamwork/` must contain only metadata (no source/tests/data)
- Never trust worker claims without empirical verification
- Must deliver explicit verdict (`APPROVE` or `REJECT`) in `handoff.md` and `send_message`

## Current Parent
- Conversation ID: 189625da-cab0-4c9f-875b-20770dbcc54b
- Updated: 2026-11-20T01:37:29Z

## Review Scope
- **Files to review**: `apps/rh/**`
- **Interface contracts**: `.agents/teamwork/PROJECT.md`, `.agents/teamwork/ORIGINAL_REQUEST.md`
- **Review criteria**: Build/test/lint pass, auth guard & `#auth=` hash edge cases, 0-license empty state (`0/0`, `0%`, no `NaN%`/crash), HTTP `401`/`403`/`422`/`500`/network error & retry recovery, double-submit / rapid clicking safety, no `"TechCorp"`, `INITIAL_*`, or fake clinical/billing data leaks.

## Key Decisions Made
- Starting baseline verification and source code inspection of `apps/rh/**`.

## Attack Surface
- **Hypotheses tested**: [pending]
- **Vulnerabilities found**: [pending]
- **Untested angles**: [pending]

## Loaded Skills
- None specified in dispatch.

## Artifact Index
- `DISPATCH.md` — Dispatch message log
- `BRIEFING.md` — Persistent working memory
- `progress.md` — Liveness heartbeat
- `handoff.md` — Final 5-component verification report
