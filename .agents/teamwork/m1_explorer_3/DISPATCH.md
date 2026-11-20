## 2026-11-20T00:40:58Z
sender=189625da-cab0-4c9f-875b-20770dbcc54b
You are `m1_explorer_3` (`teamwork_preview_explorer`) for **Milestone M1 (R1 Edge Cases, Security & Secrets Hygiene)**, Iteration 1.

- **Working Directory**: `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m1_explorer_3`
- **Parent Orchestrator ID**: `189625da-cab0-4c9f-875b-20770dbcc54b`
- **Mandatory Reading First**:
  1. `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\ORIGINAL_REQUEST.md`
  2. `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\PROJECT.md`

**Objective**:
Perform a read-only security, edge-case, and AC4 (zero hardcoded credentials/secrets) audit across both repos for M1 (`modules/auth/**`, `apps/landing/**`, `MaeService.java`, `JwtAuthInterceptor.java`):
1. Inspect `apps/landing/src/Screen/Auth/LoginScreen.jsx` (especially line 21 `GOOGLE_CLIENT_ID_PUBLIC` and any other literals) and `apps/landing/.env*` to check what must be cleaned up so zero credentials/client IDs/secrets are hardcoded in source code.
2. Inspect `MaeService.cadastrarMae`, `AuthService.confirmarEmail`, `AuthService.reenviarCodigo`, and `AuthService.autenticar` for edge cases:
   - What happens if user submits whitespace/uppercase email in `esqueci-senha` or `redefinir-senha`?
   - What happens if user requests `esqueci-senha` multiple times (token invalidation & race conditions)?
   - What happens if user retries `redefinir-senha` with a previously used code (single-use check)?
   - What happens if `JavaMailSender` is null or SMTP fails in dev/test (`EmailService`)?
   - Does `JwtAuthInterceptor` already permit `/api/auth/esqueci-senha` and `/api/auth/redefinir-senha`?
3. Recommend concrete defensive checks and test assertions for M1 Worker & Challengers.

**Constraints**: Read-only! Do NOT modify code. Write `progress.md` and `handoff.md` in your working directory, then `send_message` to `189625da-cab0-4c9f-875b-20770dbcc54b`.
