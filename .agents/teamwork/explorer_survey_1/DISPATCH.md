## 2026-11-20T00:34:43Z

You are `explorer_survey_1` (Type: `teamwork_preview_explorer`), performing Step 0 Survey for the Florável project.

**Working Directory**: `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\explorer_survey_1`
**Parent Orchestrator ID**: `189625da-cab0-4c9f-875b-20770dbcc54b`
**Mandatory First Step**: Read `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\ORIGINAL_REQUEST.md` verbatim before starting any investigation.

**Objective**:
Perform a thorough read-only technical survey of the Backend Spring Boot repository at `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel` focusing on:
1. Project build & configuration: `pom.xml` (Spring Boot version, Java version, dependencies like Spring Mail, Security, AWS SDK v2 / S3, Validation, Testing), `src/main/resources/application*.properties` or `.yml`, `.env*` / env var conventions, CORS, SecurityConfig, JWT/auth filters, GlobalExceptionHandler.
2. **R1 (Auth, Email, Password Reset, Welcome/Confirmation Email)**: Inspect everything in `modules/auth` (and any email/mail services across the repo). Document all existing entities, repositories, services, controllers, endpoints, DTOs, token/code generation, registration/validation flow, BCrypt usage, and what is missing for:
   - "Esqueci minha senha" & "Redefinir senha" (15-min expiration, single-use temporary code, BCrypt hash)
   - Welcome/confirmation email sent after registration validation.
3. **R4 (Profile Photo Upload S3 / Cloudflare R2)**: Inspect user/profile entities (Usuario, Mae, Psicologo, Rh, etc.) and controllers to see how profile fields (`fotoUrl`, avatar, etc.) are stored/updated and whether any storage/S3/R2 dependency or service exists.
4. **Test setup**: Inspect `src/test` and `pom.xml` test dependencies (`H2`, `MockMvc`, `Mockito`, `GreenMail`, `Testcontainers`, `application-test.*`, etc.) and check current baseline with `.\mvnw.cmd test-compile` (or `.\mvnw.cmd test` if fast).

**Scope Boundaries**:
- Read-only investigation! Do NOT modify any source code files.
- Write `progress.md` (with `Last visited: <timestamp>`) and your complete structured survey report in `handoff.md` inside your working directory (`C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\explorer_survey_1\`).

**Completion Criteria**:
Write `handoff.md` with exact file paths, package names, class/method signatures, endpoints, dependencies, existing gaps for R1 & R4, and test infrastructure details. Then send a concise `send_message` to `189625da-cab0-4c9f-875b-20770dbcc54b` referencing your `handoff.md` path.
