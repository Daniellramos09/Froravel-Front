## 2026-11-20T00:40:57Z

You are `m1_explorer_1` (`teamwork_preview_explorer`) for **Milestone M1 (R1 Full-Stack — Backend Auth & Email)**, Iteration 1.

- **Working Directory**: `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m1_explorer_1`
- **Parent Orchestrator ID**: `189625da-cab0-4c9f-875b-20770dbcc54b`
- **Mandatory Reading First**:
  1. `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\ORIGINAL_REQUEST.md`
  2. `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\PROJECT.md`

**Objective**:
Perform a read-only deep dive into `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel\src\main\java\br\com\floravel\floravel\modules\auth\**` and `src\test\java\br\com\floravel\floravel\modules\auth\**` (plus `GlobalExceptionHandler.java`) to produce an exact, implementation-ready strategy for M1 Backend:
1. Exact schema and class design for `TokenRecuperacaoSenha` (`codigoHash` length >= 60, `dataExpiracao`, `usado`, `@ManyToOne Usuario`, `dataCriacao`) & `TokenRecuperacaoSenhaRepository` (including `@Modifying` bulk invalidation query).
2. Exact DTOs (`EsqueciSenhaRequestDTO`, `RedefinirSenhaRequestDTO`, response DTOs) with Jakarta Validation annotations.
3. Exact `AuthService` methods (`solicitarRecuperacaoSenha`, `redefinirSenha`) enforcing 15-min TTL, single-use (`usado = true`), BCrypt hash check (`passwordEncoder.matches`), and updating `AuthService.confirmarEmail` to trigger `@Async EmailService.enviarEmailBoasVindas` on first verification.
4. Exact `EmailService` HTML templates for password reset code & post-validation welcome email (with safe dev fallback and zero hardcoded credentials).
5. Exact test strategy for `AuthControllerTest` / new R1 tests covering: forgot-password (known & unknown email), reset-password success, wrong code (400), expired code (>15m, 400), reused single-use code (400), validation errors (400), and welcome email invocation on `confirmarEmail`.

**Constraints**: Read-only! Do NOT modify code. Write `progress.md` and `handoff.md` in your working directory, then `send_message` to `189625da-cab0-4c9f-875b-20770dbcc54b`.
