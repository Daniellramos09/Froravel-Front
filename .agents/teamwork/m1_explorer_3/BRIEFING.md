# BRIEFING — 2026-11-20T00:45:00Z

## Mission
Perform a read-only security, edge-case, and AC4 (zero hardcoded credentials/secrets) audit across `Froravel-Front` (`apps/landing/**`) and `floravel-backend/Floravel` (`modules/auth/**`, `MaeService.java`, `JwtAuthInterceptor.java`, `EmailService`) for Milestone M1 (R1).

## 🔒 My Identity
- Archetype: teamwork_preview_explorer
- Roles: Explorer (Investigation & Synthesis)
- Working directory: C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m1_explorer_3
- Original parent: 189625da-cab0-4c9f-875b-20770dbcc54b
- Milestone: M1 (R1 Edge Cases, Security & Secrets Hygiene)

## 🔒 Key Constraints
- Read-only investigation — do NOT modify source code
- Write `progress.md` and `handoff.md` in working directory
- Report back via `send_message` to `189625da-cab0-4c9f-875b-20770dbcc54b`

## Current Parent
- Conversation ID: 189625da-cab0-4c9f-875b-20770dbcc54b
- Updated: 2026-11-20T00:45:00Z

## Investigation State
- **Explored paths**:
  - `apps/landing/src/Screen/Auth/LoginScreen.jsx`, `CadastroScreen.jsx`, `ConsentPrivacy.jsx`, `App.jsx`, `Api/axios.js`, `utils/appLinks.js`, `index.html`, `vite.config.js`, `package.json`, `.env`, `.env.example`, `.gitignore`
  - `apps/landing/src/Screen/NovaLanding/components/OrionixModals.jsx`
  - `packages/shared/src/appLinks.js`, `apps/mae/.env`, `apps/psicologo/.env`, root `.gitignore`, root `package.json`
  - `floravel-backend/Floravel/src/main/java/.../modules/auth/**` (`AuthController`, `AuthService`, `EmailService`, `GoogleOAuthClient`, `TokenConfirmacaoEmail`, `TokenConfirmacaoEmailRepository`, DTOs, Exceptions)
  - `modules/mae/service/MaeService.java`, `dto/CadastroMaeRequestDTO.java`, `dto/MaeResponseDTO.java`
  - `modules/usuario/model/Usuario.java`, `repository/UsuarioRepository.java`
  - `shared/security/JwtAuthInterceptor.java`, `JwtService.java`, `AesGcmAttributeConverter.java`, `shared/config/WebMvcSecurityConfig.java`, `DemoDayDataSeeder.java`, `shared/exception/GlobalExceptionHandler.java`, `shared/web/OpenApiSwaggerController.java`
  - `src/main/resources/application.properties`, `application-prod.properties`, `.env`, `.env.example`, `.gitignore`, `pom.xml`
  - `src/test/java/.../modules/auth/controller/AuthControllerTest.java`, `MaeControllerTest.java`, `FloravelApplicationTests.java`
- **Key findings**:
  - `LoginScreen.jsx:19-21` hardcodes a real Google OAuth Client ID (`339469409890-1g5vn0mmj2hir5ishgi0kh2q47rglfb2.apps.googleusercontent.com`) which violates AC4 and blocks the dynamic `/api/auth/oauth/google/config` fetch at lines 118-128.
  - `apps/landing/.env` (untracked/gitignored) also holds that Client ID; Vite embeds `VITE_*` vars into `dist/` during build.
  - `LoginScreen.jsx:131` `salvarSessaoLocal` omits `'rh'` -> stores RH session in `floravel_mae_sessao` instead of `floravel_rh_sessao`.
  - Bean Validation `@Email` on DTOs rejects un-trimmed whitespace BEFORE service `.trim().toLowerCase()` runs; trimming in DTO setter/Jackson + service + frontend avoids 400s on `" user@email.com "`.
  - `TokenConfirmacaoEmailRepository.invalidarTokensAnteriores` lacks `clearAutomatically = true, flushAutomatically = true`; concurrent `esqueci-senha` / `redefinir-senha` calls need atomic single-use marking (`UPDATE ... SET usado = true WHERE id = :id AND usado = false`) and BCrypt hash verification in Java (cannot query by BCrypt hash).
  - `EmailService` handles `mailSender == null` and SMTP exceptions cleanly without throwing, but logs plaintext OTP at INFO level before SMTP attempt and interpolates `nome` into HTML unescaped.
  - `JwtAuthInterceptor.ehRotaPublica:121` already permits `/api/auth/**` (including `/api/auth/esqueci-senha` and `/api/auth/redefinir-senha`).
- **Unexplored areas**:
  - `apps/mae/src`, `apps/psicologo/src`, `apps/rh/src` full file-by-file inspection (scanned via regex for secrets; clean).

## Key Decisions Made
- Completed read-only audit across all M1 target files and cross-repo secrets checks.

## Artifact Index
- `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m1_explorer_3\DISPATCH.md` — Dispatch log
- `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m1_explorer_3\BRIEFING.md` — Situational awareness
- `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m1_explorer_3\progress.md` — Liveness heartbeat
- `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m1_explorer_3\handoff.md` — 5-component security & edge-case audit report
