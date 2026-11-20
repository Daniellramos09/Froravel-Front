# BRIEFING — 2026-11-20T00:46:00Z

## Mission
Read-only deep dive into `floravel-backend` auth module, tests, and `GlobalExceptionHandler.java` to design an exact, implementation-ready strategy for Milestone M1 (R1 Backend Auth & Email).

## 🔒 My Identity
- Archetype: teamwork_preview_explorer
- Roles: explorer, synthesizer
- Working directory: `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m1_explorer_1`
- Original parent: `189625da-cab0-4c9f-875b-20770dbcc54b`
- Milestone: M1 (R1 Full-Stack — Backend Auth & Email)

## 🔒 Key Constraints
- Read-only investigation — do NOT implement or modify source code
- Write `progress.md` and `handoff.md` in working directory
- Zero hardcoded credentials; follow existing repo patterns and conventions

## Current Parent
- Conversation ID: `189625da-cab0-4c9f-875b-20770dbcc54b`
- Updated: 2026-11-20T00:46:00Z

## Investigation State
- **Explored paths**:
  - `floravel-backend/Floravel/pom.xml`
  - `floravel-backend/Floravel/src/main/java/.../modules/auth/**` (all 14 files)
  - `floravel-backend/Floravel/src/main/java/.../shared/exception/{GlobalExceptionHandler,ErrorResponseDTO}.java`
  - `floravel-backend/Floravel/src/main/java/.../shared/security/{JwtAuthInterceptor,JwtService}.java`
  - `floravel-backend/Floravel/src/main/java/.../shared/config/{SecurityBeansConfig,WebMvcSecurityConfig,DemoDayDataSeeder,CorsConfig}.java`
  - `floravel-backend/Floravel/src/main/java/.../modules/usuario/model/Usuario.java`
  - `floravel-backend/Floravel/src/main/resources/application*.properties`
  - `floravel-backend/Floravel/src/test/java/.../{AuthControllerTest,MaeControllerTest,PsicologoPersistenciaAndSecurityTest,ValidacaoGovernoTest,PsicologoServiceTest}.java`
  - `floravel-backend/Floravel/target/surefire-reports/TEST-...AuthControllerTest.xml`
  - `Froravel-Front/apps/landing/src/Screen/Auth/LoginScreen.jsx`
- **Key findings**:
  - `GlobalExceptionHandler` already maps `CodigoInvalidoException` and `CodigoExpiradoException` to HTTP 400 (`"Código Inválido"`, `"Código Expirado"`), `MethodArgumentNotValidException` to HTTP 400 (`"Dados Inválidos"`), and `RegraDeNegocioException` to HTTP 422.
  - `JwtAuthInterceptor` already whitelists `/api/auth/**`.
  - `@EnableAsync` is active on `FloravelApplication`; `PasswordEncoder` (`BCryptPasswordEncoder`) is provided by `SecurityBeansConfig`.
  - Tests run against MySQL (`floraveldb` via `application.properties`) and call `usuarioRepository.deleteAll()` in `setUp()`, requiring `tokenRecuperacaoSenhaRepository.deleteAll()` cleanup before `usuarioRepository.deleteAll()` to avoid FK violations.
  - `TokenRecuperacaoSenha` must store `codigoHash` (`length = 100 >= 60`), so `AuthService.redefinirSenha` must fetch by email (`usado = false`) and validate with `passwordEncoder.matches(...)` rather than SQL equality.
- **Unexplored areas**: None within M1 backend scope.

## Key Decisions Made
- Throw `CodigoInvalidoException` (400) rather than `RegraDeNegocioException` (422) on unknown email / missing active token during `redefinirSenha`.
- Validate `passwordEncoder.matches(codigo, token.getCodigoHash())` before checking `token.isExpirado()` so wrong codes on expired tokens still return `"Código Inválido"` without leaking token state.
- Recommended `@MockitoSpyBean` + `ArgumentCaptor` + `timeout(...)` in `AuthControllerTest` plus fast Mockito unit tests in `AuthServiceTest` / `EmailServiceTest`.

## Artifact Index
- `DISPATCH.md` — Recorded dispatch instructions
- `BRIEFING.md` — Situational awareness index
- `progress.md` — Liveness heartbeat and step tracker
- `handoff.md` — Final 5-component implementation strategy report for M1 Backend
