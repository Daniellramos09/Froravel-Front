# M2 Frontend Design Report — `apps/rh` Live Integration & Test Suite

**Core Finding:** `apps/rh` currently makes zero HTTP calls, fails `eslint .` on `src/App.jsx:16`, and displays hardcoded `"TechCorp Brasil"` / `42 / 50` / clinical EPDS / billing / admin mocks across all 6 UI files. Replacing those mocks requires a dedicated `src/services/rhApi.js` + `src/utils/rhSession.js`, wiring all company/license/K-anonymity UI directly to `RhCorporativoController` endpoints with explicit loading/error/retry states, rendering transparent **LGPD-firewalled / unavailable** panels for clinical/billing/multi-admin sections (never faking mock data as live API data), and adding Vitest + Testing Library setup with `ResizeObserver` polyfill for Recharts.

---

## 1. Observation

### 1.1 Workspace Tooling, Lint Baseline & Shared Infrastructure
- **Root `package.json` (`Froravel-Front/package.json:21,24-32`)**: Already has `vitest ^5.1.1`, `@testing-library/react ^16.3.3`, `@testing-library/jest-dom ^8.0.0`, `@testing-library/user-event ^14.6.13`, `@testing-library/dom ^10.4.2`, `jsdom ^31.0.1`, and `"test:all": "npm run test --workspaces --if-present"`.
- **M1 Reference Config (`apps/landing/`)**:
  - `apps/landing/vitest.config.js:1-22`: uses `@vitejs/plugin-react`, `environment: 'jsdom'`, `css: false`, `setupFiles: ['./src/test/setup.js']`, `include: ['src/**/*.{test,spec}.{js,jsx}']`.
  - `apps/landing/src/test/setup.js:1-10`: imports `@testing-library/jest-dom/vitest`, calls `cleanup()`, `localStorage.clear()`, `vi.restoreAllMocks()` in `afterEach`.
  - `apps/landing/eslint.config.js:21-26`: disables `react-refresh/only-export-components` for `**/*.{test,spec}.{js,jsx}` and `src/test/**/*.{js,jsx}`.
- **`apps/rh` Current Config**:
  - `apps/rh/package.json:6-11`: defines `dev`, `build`, `lint`, `preview`; **no `test` or `test:watch` script**; depends on `@floravel/shared: "*"`, `react ^19.3.1`, `recharts ^3.10.1`, `lucide-react ^1.70.0`.
  - `apps/rh/eslint.config.js:1-22`: flat ESLint 10 config (`js.configs.recommended`, `reactHooks`, `reactRefresh`), no test override yet.
  - `apps/rh/vite.config.js:11-13`: dev server port `5176`.
  - `apps/rh/.env.example:1-3`: sets `VITE_API_URL=http://localhost:8080`. No `.env` file exists in `apps/rh` (relying on `getApiBase()` fallback on `localhost`).
  - **Baseline Lint Failure Verified**: Running `npm --workspace=@floravel/rh run lint` exited with code `1`:
    ```text
    C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\apps\rh\src\App.jsx
      16:12  error  '_' is defined but never used  no-unused-vars
      16:15  error  Empty block statement          no-empty
    ```
- **Shared Package (`packages/shared/src/appLinks.js:11-58`, `apps/rh/src/utils/appLinks.js:1-7`)**:
  - `getApiBase()` returns `import.meta.env?.VITE_API_URL || (isLocalEnvironment ? 'http://localhost:8080' : '')`.
  - `APP_LINKS` provides `landing`, `mae`, `terapeuta`, `rh`. `apps/rh/src/utils/appLinks.js` re-exports `* from '@floravel/shared'` plus `LANDING_URL = APP_LINKS.landing`.

### 1.2 Auth Session & Backend Contracts Verified
- **Session Storage (`apps/landing/src/Screen/Auth/LoginScreen.jsx:22-26,158-167`, `apps/rh/src/App.jsx:3-18`)**:
  - Cross-app hash hydration (`#auth=<base64>`) writes:
    - `floravel_rh_sessao`: JSON serialized `LoginResponseDTO` (`{ usuarioId, perfilId, codigoPublico, nome, email, tipoPerfil, emailVerificado, tokenSessao, mensagem }`, verified in `LoginResponseDTO.java:10-21`).
    - `floravel_jwt`: JWT string (`authData.tokenSessao`).
    - `floravel_codigo_publico`: opaque public ID (`authData.codigoPublico`).
- **M2 Backend Endpoints (`PROJECT.md:53-62`, `RhCorporativoController.java`, `JwtAuthInterceptor.java:107-114`)**:
  - All `/api/rh/empresas/**` and `/api/rh/licencas/**` (except public `/api/rh/licencas/ativar`) require `Authorization: Bearer <jwt>` with `role == "RH"`.
  - `GET /api/rh/empresas/atual` → `200 OK`: `{ id, nome, cnpj, status, dataCadastro }` (`Empresa.java:16-36`).
  - `PUT /api/rh/empresas/{empresaId}` → Request `{ nome, cnpj }` → `200 OK`: updated `EmpresaResponseDTO`.
  - `GET /api/rh/empresas/{empresaId}/licencas` → `200 OK`: `LicencaResponseDTO[]` (`id, empresaId, nomeColaboradora, emailCorporativo, departamento, status ["PENDENTE"|"ATIVADA"|"REVOGADA"], tokenConvite, dataConvite, dataAtivacao, garantiaSigiloLgpd`, verified in `LicencaResponseDTO.java:15-24`).
  - `POST /api/rh/licencas/convite` → Request `{ empresaId, nomeColaboradora, emailCorporativo, departamento }` (`ConviteLicencaRequestDTO.java:12-26`) → `201 Created`: `LicencaResponseDTO`.
  - `POST /api/rh/licencas/{licencaId}/reenviar` → `200 OK`: `LicencaResponseDTO`.
  - `PATCH /api/rh/licencas/{licencaId}/revogar` → `200 OK`: `LicencaResponseDTO` (`status = "REVOGADA"`).
  - `PATCH /api/rh/licencas/{licencaId}/reativar` → `200 OK`: `LicencaResponseDTO` (`status = "PENDENTE"` or `"ATIVADA"`).
  - `GET /api/rh/empresas/{empresaId}/relatorio-k-anonimato` → `200 OK`: `RelatorioKAnonimatoResponseDTO` (`empresaId, parametroKMinimo, totalLicencasEmitidas, totalLicencasAtivadas, taxaAdesaoPercentual, setoresElegiveis: [{ nomeSetor, colaboradorasAtivas, agrupadoPorKAnonimato }], indiceGeralAgrupadoKAnonimato: { nomeSetor, colaboradorasAtivas, agrupadoPorKAnonimato }, diretrizCompliance`, verified in `RelatorioKAnonimatoResponseDTO.java:12-22`, `SetorAgregadoDTO.java:10-15`).
  - **Seeded Demo Data Alignment (`DemoDayDataSeeder.java:139-182`)**: Seeded company is `"TechMães Brasil S.A."` (`cnpj: "12.345.678/0001-90"`), with departments `"Engenharia"` (6 active), `"Jurídico"` (2 active), and `"Design"` (2 active).
- **Backend Error Contract (`ErrorResponseDTO.java:16-26`, `GlobalExceptionHandler.java:39-160`, `JwtAuthInterceptor.java:147-154`)**:
  - Returns JSON `{ timestamp?, status, error, message, path?, validationErrors?: Record<string, string> }`.
  - `401` (`JwtAuthInterceptor`): missing/invalid/expired JWT (`Token de autenticação Bearer ausente.` / `Sua sessão expirou ou o token JWT é inválido.`).
  - `403` (`JwtAuthInterceptor`): non-RH role (`Recurso restrito ao perfil Gestão RH B2B.`) or cross-company access.
  - `400`: `@Valid` `MethodArgumentNotValidException` with `validationErrors` map.
  - `422`: `RegraDeNegocioException` (e.g., duplicate invite email in `RhCorporativoService.java:30-32`).

### 1.3 Mock Inventory & Gaps in `apps/rh/src/`
| File | Hardcoded Mocks Observed | Structural / UX Gaps |
|---|---|---|
| `App.jsx` (`1-26`) | None, but has `catch (_) {}` lint error (`line 16`) | No auth session guard (`floravel_jwt` / `RH` role check); no logout handler passed down. |
| `Sidebar.jsx` (`142-177`) | `"TechCorp RH"`, `"admin@techcorp.com.br"`, `"TC"`, `aria-label="Opções do perfil de usuário: TechCorp RH"` | Entire footer is one `<button>` navigating to `"config"`; `<LogOut>` is inside a non-interactive `<div>` (`lines 171-176`) and does nothing; `"Conhecer planos extras"` points to dead `#agendar` (`line 134`). |
| `DashboardRh.jsx` (`60-81, 204, 248-393, 450, 568, 620, 642-688`) | `"Quinta-feira, 15 de outubro de 2026"`, `"TechCorp Brasil"`, `"TC"`, `"42 colaboradoras ativas"`, `42 / 50` (`84%`), `78%` (`+5%`), `11,2` EPDS, `124` sessões, `emotionalRiskData` (`60/25/15`), `wellBeingTimelineData` (Jan–Jun), `challengesData` (`85/70/55/40/30`), 2 fake AI cards | `handleExport` (`138-142`) only shows toast without downloading anything; Bell button (`239-245`) is dead; `"Ver detalhes anonimizados"` (`620`) has no `onClick`; `"Agendar Workshop"` (`676`) calls `window.alert(...)`; zero API calls, loading, or error states. |
| `LicensesScreen.jsx` (`20-85, 130, 144, 300, 360-368, 612-619`) | `INITIAL_COLLABORATORS` (8 items), `totalAllocated = 50`, `Taxa de Adesão = 94%`, hardcoded `https://floravel.com.br/convite?token=${colab.id}` | Department select hardcodes `"Engenharia de Software"` / `"Design & UX"` which do not match seeded `"Engenharia"`, `"Jurídico"`, `"Design"`; all CRUD mutates local state only; invite modal has no loading/disabled submit state or backend error display. |
| `HealthReportsScreen.jsx` (`24-40, 100, 113-119`) | `departmentRiskStackedData` (clinical risk per dept — violates LGPD firewall concept!) and `burnoutEvolutionData` (Mai–Out) | `period` dropdown (`100`) does nothing; `handleExportPdf` (`113-119`) fakes `setTimeout(1500)`; no `RelatorioKAnonimatoResponseDTO` fetch. |
| `SettingsScreen.jsx` (`18-61, 125-171, 223`) | `INITIAL_ADMINS` (`"Tatiana Camargo"`, `"Rodrigo Mendonça"`), `companyForm` (`"TechCorp Brasil..."`, `"12.345.678/0001-90"`), `notifications` toggles | `handleSaveChanges` uses `setTimeout(1200)`; form includes fields (`tradingName`, `rhContactEmail`, `phone`, `address`) not backed by `Empresa.java` (`nome`, `cnpj` only); `INITIAL_ADMINS` and `notifications` have no backend endpoints. |
| `BillingScreen.jsx` (`16-58, 64-72, 84-110, 272-342`) | `INITIAL_INVOICES` (5 fake invoices incl. failed Oct 2026 / `NF-e #89211`), `cardLastDigits = "4092"`, `"TECHCORP BRASIL SERVICOS"`, `"Plano Mid-Market"`, `"50 Licenças"` | `handleRetryPayment` uses `setTimeout(1500)`; zero backend billing/invoice endpoints exist in `RhCorporativoController`. |

---

## 2. Logic Chain

1. **Error & Auth Handling Contract (`rhApi.js`)**: Because `ErrorResponseDTO` can return either a `validationErrors` map (`400`) or a `message` string (`401`/`403`/`404`/`409`/`422`/`500`), while `fetch()` itself throws `TypeError` on network loss, `rhApi.js` must centralize `requestJson()` using `getApiBase()`, attach `Authorization: Bearer ${localStorage.getItem('floravel_jwt')}`, parse JSON defensively (`res.json().catch(() => null)`), and throw a typed `RhApiError` distinguishing `status === 401` (`isAuthError`), `status === 403` (`isForbidden`), `status === 0` (`isNetworkError`), and `validationErrors`.
2. **Company Discovery Without `localStorage.empresaId`**: Because `LoginResponseDTO` does not guarantee `empresaId`, `DashboardRh` must first call `GET /api/rh/empresas/atual` (`obterEmpresaAtual()`) to resolve `empresa.id`, then call `Promise.all([obterRelatorioKAnonimato(empresa.id), listarLicencas(empresa.id)])`.
3. **LGPD & Unavailable Panel Integrity (No Silent Mock Fallbacks)**: Backend `RhCorporativoController` intentionally provides only company metadata, license lifecycle CRUD, and K-anonymity (`K >= 5`) sector/adherence aggregates. Individual EPDS risk splits, longitudinal burnout/mood scores, AI diary insights, multi-admin management, notification channel toggles, and billing/NF-e have no backend endpoints (and individual clinical telemetry is barred by the LGPD firewall). Therefore, replacing mocks means:
   - Live backend panels render **strictly from API state** with loading skeletons and an explicit error banner + retry button on failure (never falling back to `"TechCorp Brasil"` or `42 / 50`).
   - Clinical/AI, multi-admin/notification prefs, and billing panels render **explicit LGPD-firewalled / unavailable notices** backed by real company/session/adherence metadata where applicable.
4. **Cross-Screen Synchronization & Standalone Testability**: If `DashboardRh` fetches `{ company, relatorio, licenses }` once and passes them + refresh/mutation callbacks (`onCompanyUpdated`, `onLicensesChanged`, `onRetry`) to `LicensesScreen`, `HealthReportsScreen`, `SettingsScreen`, and `BillingScreen`, switching sidebar tabs stays instant and consistent; meanwhile, letting `LicensesScreen`, `HealthReportsScreen`, and `SettingsScreen` accept optional `empresaId` / initial props and fall back to fetching via `rhApi` when mounted standalone enables clean isolated component unit tests.
5. **Recharts in jsdom**: `DashboardRh` and `HealthReportsScreen` wrap charts in `<ResponsiveContainer>`. Without a `globalThis.ResizeObserver` stub in `apps/rh/src/test/setup.js`, Vitest jsdom tests mounting `DashboardRh` or `HealthReportsScreen` will throw or fail to render charts cleanly.

---

## 3. Exact M2 Frontend Implementation Design

### 3.1 New Service & Session Modules

#### A. `apps/rh/src/utils/rhSession.js`
- `SESSION_KEY = 'floravel_rh_sessao'`, `JWT_KEY = 'floravel_jwt'`, `PUBLIC_CODE_KEY = 'floravel_codigo_publico'`.
- `hidratarSessaoDoHash()`: reads `#auth=` from `window.location.hash`, decodes Base64 UTF-8 JSON, stores `floravel_rh_sessao`, `floravel_jwt` (`authData.tokenSessao`), `floravel_codigo_publico` (`authData.codigoPublico`), strips hash via `window.history.replaceState`. Uses `catch { /* ignore malformed #auth hash */ }` (fixes ESLint `no-unused-vars` & `no-empty`).
- `getRhAuthState()`:
  - Reads `token = localStorage.getItem(JWT_KEY)` and parses `session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')`.
  - Returns `{ token, session, isAuthenticated: Boolean(token), isWrongRole: Boolean(token && session?.tipoPerfil && String(session.tipoPerfil).toUpperCase() !== 'RH') }`.
- `clearRhSession()`: removes `floravel_rh_sessao`, `floravel_jwt`, `floravel_codigo_publico` from `localStorage`.
- `getLoginRedirectUrl()`: returns `${APP_LINKS.landing}/login?perfil=rh`.
- `logoutAndRedirect(redirectFn)`: calls `clearRhSession()`; calls `redirectFn ? redirectFn(url) : (window.location.href = url)`.
- `getInitials(name)`: derives 2-letter uppercase initials safely (fallback `'RH'`).

#### B. `apps/rh/src/services/rhApi.js`
- Imports `getApiBase` from `@floravel/shared`.
- Exports `RhApiError extends Error`:
  ```js
  export class RhApiError extends Error {
    constructor(message, { status = 0, error = '', validationErrors = null, path = '' } = {}) {
      super(message);
      this.name = 'RhApiError';
      this.status = status;
      this.error = error;
      this.validationErrors = validationErrors;
      this.path = path;
      this.isAuthError = status === 401;
      this.isForbidden = status === 403;
      this.isNetworkError = status === 0;
    }
  }
  ```
- `extractErrorMessage(payload, status)`:
  1. If `payload?.validationErrors` object has non-empty string values, return first message.
  2. Else return `payload?.message || payload?.mensagem`.
  3. Else status-specific Portuguese defaults (`401`: `'Sessão expirada ou não autenticada. Faça login novamente.'`, `403`: `'Acesso restrito ao perfil Gestão RH B2B.'`, `404`: `'Recurso corporativo não encontrado.'`, `>=500`: `'Erro interno no servidor Florável. Tente novamente.'`).
- `rhFetch(path, options = {})`:
  - Reads `token = localStorage.getItem('floravel_jwt')`.
  - If `!token`, throws `new RhApiError('Sessão não autenticada. Faça login para acessar o painel RH.', { status: 401, error: 'Não Autorizado' })` without issuing an unauthenticated request (or optionally sends if caller passes `token`, wait: throwing `401` immediately when `!token` is clean and deterministic).
  - Builds headers `{ Accept: 'application/json', Authorization: \`Bearer ${token}\`, ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers }`.
  - Wraps `fetch(\`${getApiBase()}${path}\`, ...)` in `try/catch`: on network error, throws `new RhApiError('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.', { status: 0, error: 'NetworkError' })`.
  - Parses JSON safely (`await response.json().catch(() => null)`). If `!response.ok`, throws `new RhApiError(extractErrorMessage(data, response.status), { status: response.status, error: data?.error || '', validationErrors: data?.validationErrors || null, path: data?.path || path })`.
  - Returns parsed JSON.
- Exported API functions:
  - `obterEmpresaAtual()` → `GET /api/rh/empresas/atual`
  - `atualizarEmpresa(empresaId, { nome, cnpj })` → `PUT /api/rh/empresas/${encodeURIComponent(empresaId)}`
  - `listarLicencas(empresaId)` → `GET /api/rh/empresas/${encodeURIComponent(empresaId)}/licencas`
  - `emitirConviteLicenca({ empresaId, nomeColaboradora, emailCorporativo, departamento })` → `POST /api/rh/licencas/convite`
  - `reenviarConviteLicenca(licencaId)` → `POST /api/rh/licencas/${encodeURIComponent(licencaId)}/reenviar`
  - `revogarLicenca(licencaId)` → `PATCH /api/rh/licencas/${encodeURIComponent(licencaId)}/revogar`
  - `reativarLicenca(licencaId)` → `PATCH /api/rh/licencas/${encodeURIComponent(licencaId)}/reativar`
  - `obterRelatorioKAnonimato(empresaId)` → `GET /api/rh/empresas/${encodeURIComponent(empresaId)}/relatorio-k-anonimato`

### 3.2 Component-by-Component Replacement Plan

1. **`apps/rh/src/App.jsx`**:
   - Call `hidratarSessaoDoHash()` once during initialization (lazy state initializer or before initial render).
   - Maintain `authState = getRhAuthState()`.
   - **Auth Guard**:
     - If `!authState.isAuthenticated`: render an accessible Auth Guard card (`role="alert"`, `data-testid="rh-auth-guard"`) explaining `"Sessão corporativa necessária"` with primary CTA `<a href={getLoginRedirectUrl()}>Ir para Login RH</a>`.
     - If `authState.isWrongRole`: render `"Acesso restrito ao perfil Gestão RH"` with button `"Sair e entrar com conta RH"` calling `logoutAndRedirect()`.
     - Otherwise render `<DashboardRh session={authState.session} onLogout={() => logoutAndRedirect()} />`.

2. **`apps/rh/src/Sidebar.jsx`**:
   - Props: `activeMenu`, `setActiveMenu`, `mobileMenuOpen`, `setMobileMenuOpen`, `session`, `company`, `onLogout`.
   - Remove `"TechCorp RH"`, `"admin@techcorp.com.br"`, `"TC"`.
   - Render `displayName = session?.nome || company?.nome || 'Gestão RH'`, `displayEmail = session?.email || 'Portal Corporativo'`, `initials = getInitials(displayName)`.
   - Split profile button (navigates to `"config"`, `aria-label={\`Configurações do perfil: ${displayName}\`}`) and separate `<button type="button" onClick={onLogout} aria-label="Sair do painel RH" title="Sair">` with `<LogOut />`.
   - Wire `"Conhecer planos extras"` `<button>` (instead of dead `<a href="#agendar">`) to `handleNavClick('faturamento')`.

3. **`apps/rh/src/DashboardRh.jsx`**:
   - Dynamic formatted PT-BR date in header (`Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' })`).
   - State: `{ company, relatorio, licenses, loading, error, isRefreshing }`.
   - `loadDashboardData()`:
     - Calls `obterEmpresaAtual()` → then `Promise.all([obterRelatorioKAnonimato(emp.id), listarLicencas(emp.id)])`.
     - On `RhApiError`: stores `{ message, status, isAuthError, isForbidden, isNetworkError }` in `error`. If `401`, error banner includes **"Fazer login novamente"** button (calling `onLogout()`), alongside **"Tentar novamente"** for network/5xx errors.
   - **Loading UI**: Skeleton cards (`data-testid="dashboard-loading"`, `aria-busy="true"`) while `loading && !company`.
   - **Error UI**: Explicit `role="alert"` banner (`data-testid="dashboard-error"`) with `error.message` and **"Tentar novamente"** button (`onClick={loadDashboardData}`), never showing fake `"TechCorp Brasil"` / `42 / 50` numbers!
   - **Live Overview (`activeMenu === 'inicio' && !loading && company`)**:
     - Greeting: `Olá, ${company.nome}!` (header avatar initials from `session?.nome || company.nome`).
     - LGPD Banner: displays `relatorio.diretrizCompliance`, `relatorio.parametroKMinimo` (`K >= 5`), and `${relatorio.totalLicencasAtivadas} colaboradora(s) ativa(s)`.
     - **4 KPI Cards (100% live)**:
       1. `Licenças Ativadas`: `${relatorio.totalLicencasAtivadas}` `/ ${relatorio.totalLicencasEmitidas}` + progress bar `${relatorio.taxaAdesaoPercentual}%`.
       2. `Taxa de Adesão`: `${relatorio.taxaAdesaoPercentual}%` (`Convites ativados sobre o total emitido`).
       3. `Setores com K ≥ ${relatorio.parametroKMinimo}`: `${relatorio.setoresElegiveis.length}` + `${relatorio.indiceGeralAgrupadoKAnonimato?.colaboradorasAtivas ?? 0} colaboradoras agrupadas (< K)`.
       4. `Status dos Convites`: `${pendingCount}` pendentes (`${revokedCount} revogadas` · Sigilo LGPD ativo).
     - **Chart A (Donut — Status das Licenças)**: Real counts from `licenses`: `Ativadas`, `Pendentes`, `Revogadas` (center shows `licenses.length` `Licenças`). Empty state if `licenses.length === 0`.
     - **Chart B (BarChart — Distribuição por Setor K-Anonimato)**: Real bars from `relatorio.setoresElegiveis` + `relatorio.indiceGeralAgrupadoKAnonimato` (if `colaboradorasAtivas > 0`).
     - **Section 3 (Clinical & AI Safe Fallback)**: Replaces `challengesData` and hardcoded AI cards with an explicit **Muralha de Fogo LGPD & Telemetria Clínica Protegida** panel stating that temas de diário (PLN), pontuações EPDS individuais e insights clínicos não são expostos ao RH (`K >= 5` / sem endpoint clínico corporativo). `"Ver detalhes anonimizados"` button navigates to `setActiveMenu("relatorios")`; workshop button opens an in-app toast instead of `window.alert(...)`.
     - **Export**: `handleExport('CSV')` downloads real anonymized K-anonymity CSV (`Setor;ColaboradorasAtivas;AgrupadoKAnonimato`) via `Blob` + `URL.createObjectURL`; `handleExport('PDF')` triggers `window.print?.()` + toast.
     - **Child Screens**: Pass `empresaId={company?.id}`, `company`, `relatorio`, `licenses`, `session`, `parentLoading={loading}`, `parentError={error}`, `onRetry={loadDashboardData}`, `onLicensesUpdated={refreshLicensesAndReport}`, `onCompanyUpdated={setCompany}`, `onTriggerToast={setToastMessage}`.

4. **`apps/rh/src/screens/LicensesScreen.jsx`**:
   - Remove `INITIAL_COLLABORATORS`, `totalAllocated = 50`, `94%`, and `https://floravel.com.br/convite?token=${colab.id}`.
   - Support both parent-supplied `{ empresaId, licenses, relatorio, onLicensesUpdated }` and standalone fetching via `obterEmpresaAtual()` + `listarLicencas(empresaId)` when props are omitted.
   - Normalize status badges cleanly for backend values:
     - `'ATIVADA'` → `'Ativa'` (emerald badge)
     - `'PENDENTE'` → `'Pendente'` (amber badge)
     - `'REVOGADA'` → `'Revogada'` (stone badge)
   - Dynamic department list: merge seeded/standard options (`Engenharia`, `Jurídico`, `Design`, `Engenharia de Software`, `Design & UX`, `Operações & Logística`, `Marketing Corporativo`, `Recursos Humanos`, `Vendas & Parcerias`, `Finanças & Controladoria`) with any distinct `departamento` values returned by `licenses`; allow free text or selection in Invite Modal (`<input list=...>` or `<select>` + custom option) so any department works.
   - Micro-cards (100% live):
     1. `Licenças Ativadas`: `{activeCount}` `/ {licenses.length}`
     2. `Convites Pendentes`: `{pendingCount}`
     3. `Licenças Revogadas`: `{revokedCount}`
     4. `Taxa de Adesão`: `{adherenceRate}%` (computed from `relatorio?.taxaAdesaoPercentual ?? (licenses.length ? Math.round((activeCount / licenses.length) * 1000) / 10 : 0)`).
   - Loading state (`data-testid="licenses-loading"`), error banner (`role="alert"`) with `"Tentar novamente"`, empty list state vs filtered empty state.
   - Real CRUD handlers (`busyId` / `isSubmitting` disable duplicate clicks):
     - **Invite**: `emitirConviteLicenca({ empresaId, nomeColaboradora, emailCorporativo, departamento })` → updates list + calls `onLicensesUpdated`; on `RhApiError` (`400`/`422`), keeps modal open and renders `err.message` in `role="alert"`.
     - **Resend**: `reenviarConviteLicenca(colab.id)` → updates item + shows toast (or error banner on `RhApiError`).
     - **Revoke**: `revogarLicenca(colab.id)` → updates row to `'REVOGADA'` + refreshes report + shows toast.
     - **Reactivate**: `reativarLicenca(colab.id)` → updates row to returned `status` (`'PENDENTE'` or `'ATIVADA'`) + refreshes report + shows toast.
     - **Copy Link**: copies `${APP_LINKS.landing}/cadastro?perfil=mae&convite=${encodeURIComponent(colab.tokenConvite)}` via `navigator.clipboard?.writeText(...)`. Formats `dataConvite` in `pt-BR`.

5. **`apps/rh/src/screens/HealthReportsScreen.jsx`**:
   - Remove `departmentRiskStackedData` and `burnoutEvolutionData`.
   - Uses `relatorio` from props (or fetches `obterEmpresaAtual()` → `obterRelatorioKAnonimato(id)` when standalone). Includes refresh button + loading skeleton + `role="alert"` error banner with retry.
   - **Chart 1**: Real Recharts `BarChart` of `setoresElegiveis` + `indiceGeralAgrupadoKAnonimato` (`colaboradorasAtivas` per sector, labeled `K ≥ 5` vs `Agrupado K < 5`).
   - **Panel 2 (Safe Fallback)**: Replaces fake `burnoutEvolutionData` with an explicit **Telemetria Clínica Longitudinais Indisponível (Muralha de Fogo LGPD)** card + real aggregate metrics summary (`totalLicencasEmitidas`, `totalLicencasAtivadas`, `taxaAdesaoPercentual%`, `parametroKMinimo`).
   - `handleExportPdf` / CSV: exports real anonymized JSON/CSV snapshot via `Blob` (or `window.print?.()`) instead of `setTimeout(1500)`.

6. **`apps/rh/src/screens/SettingsScreen.jsx`**:
   - Remove hardcoded TechCorp defaults, `INITIAL_ADMINS`, and `setTimeout(1200)`.
   - Hydrates `companyForm` (`nome`, `cnpj`) from `company` prop or `obterEmpresaAtual()`. Shows loading skeleton + error banner with retry on fetch failure.
   - Tab `company`: edits `nome` and `cnpj` (validates 14 digits), displays read-only `status` and `dataCadastro`, submits via `atualizarEmpresa(companyId, { nome, cnpj })`. Handles `RhApiError` in `role="alert"`, calls `onCompanyUpdated(updated)`, resets `isModified`.
   - Tab `admins` & Tab `notifications`: safe fallback — displays currently logged-in RH user (`session?.nome`, `session?.email`, `session?.codigoPublico`) with explicit notice that multi-admin provisioning and automated notification preferences are unavailable via API in this version (no fake `INITIAL_ADMINS` or fake `setTimeout` persistence).

7. **`apps/rh/src/screens/BillingScreen.jsx`**:
   - Remove `INITIAL_INVOICES`, `cardLastDigits = "4092"`, `"Plano Mid-Market"`, `"50 Licenças"`, and `setTimeout(1500)`.
   - Safe fallback: renders real company billing identity (`company.nome`, `company.cnpj`, `company.status`, `${relatorio?.totalLicencasAtivadas ?? 0} licenças ativas de ${relatorio?.totalLicencasEmitidas ?? 0} emitidas`) alongside an explicit **"Integração de Faturamento Indisponível"** card explaining that invoices, NF-e downloads, and payment card management are not connected to a billing gateway in this environment.

### 3.3 Vitest + Testing Library Setup & Test Plan

- **`apps/rh/package.json`**: add `"test": "vitest run"`, `"test:watch": "vitest"`.
- **`apps/rh/vitest.config.js`**: mirror `apps/landing/vitest.config.js` with `url: 'http://localhost:5176/'`, `env: { VITE_API_URL: 'http://localhost:8080' }`, `css: false`, `setupFiles: ['./src/test/setup.js']`.
- **`apps/rh/src/test/setup.js`**:
  - Import `@testing-library/jest-dom/vitest`, `afterEach` cleanup (`cleanup()`, `localStorage.clear()`, `vi.restoreAllMocks()`).
  - Polyfill `globalThis.ResizeObserver` (class with `observe()`, `unobserve()`, `disconnect()`) so Recharts `<ResponsiveContainer>` renders without throwing in jsdom.
  - Mock `navigator.clipboard` fallback if undefined in jsdom so `Copy Link` tests work cleanly.
- **`apps/rh/eslint.config.js`**: add override disabling `react-refresh/only-export-components` for `**/*.{test,spec}.{js,jsx}` and `src/test/**/*.{js,jsx}`.
- **Automated Test Suites (`apps/rh/src/**/__tests__/*.test.jsx` or `*.test.js`)**:
  1. `src/services/__tests__/rhApi.test.js`:
     - Attaches `Authorization: Bearer <floravel_jwt>` and uses `getApiBase()`.
     - Throws `401` `RhApiError` when `floravel_jwt` is missing or backend returns `401` `ErrorResponseDTO`.
     - Parses `403` `ErrorResponseDTO` (`isForbidden: true`), `400` `validationErrors`, `422` `RegraDeNegocioException`, and network failure (`TypeError` → `isNetworkError: true`).
     - Covers all 8 endpoints (`obterEmpresaAtual`, `atualizarEmpresa`, `listarLicencas`, `emitirConviteLicenca`, `reenviarConviteLicenca`, `revogarLicenca`, `reativarLicenca`, `obterRelatorioKAnonimato`).
  2. `src/__tests__/AppAndDashboard.test.jsx`:
     - Auth Guard: blocks access when `floravel_jwt` is absent or `tipoPerfil !== 'RH'`.
     - Loading state (`dashboard-loading`) while promises are pending.
     - Live rendering: displays backend `company.nome` (e.g. `"TechMães Brasil S.A."`), real `totalLicencasAtivadas / totalLicencasEmitidas`, `taxaAdesaoPercentual`, K-anonymity compliance banner, Sidebar gestor name/email — and asserts `"TechCorp"` / `"42 / 50"` never appear.
     - Logout button in `Sidebar` clears `floravel_rh_sessao`, `floravel_jwt`, `floravel_codigo_publico`.
     - Error + Retry states: `401`, `403`, `500`, and network error banners with working **"Tentar novamente"** button recovering into live data.
     - Safe fallback assertions: clinical/AI and billing views display LGPD-firewalled / unavailable notices rather than fabricated clinical/invoice numbers.
  3. `src/screens/__tests__/LicensesScreen.test.jsx`:
     - Renders loading state, then real licenses (`ATIVADA`, `PENDENTE`, `REVOGADA`) and live counts + adherence %.
     - Search, status filter, and department filter (including seeded `"Engenharia"`, `"Jurídico"`, `"Design"`).
     - Invite collaborator modal (`POST /api/rh/licencas/convite`): success adds row and refreshes; `422` duplicate email displays `ErrorResponseDTO.message` inside modal.
     - Row actions: `Reenviar Convite`, `Revogar` (`PATCH /revogar` → status `"Revogada"`), `Reativar` (`PATCH /reativar`), and `Copiar Link` (verifies real `tokenConvite` in clipboard string, not `colab.id`).
     - Error + retry banner on `500`/network failure.
  4. `src/screens/__tests__/SettingsAndReports.test.jsx`:
     - `SettingsScreen`: loads company `nome`/`cnpj`, validates invalid CNPJ (`!== 14` digits), saves via `PUT /api/rh/empresas/{id}` (`200 OK`) and surfaces `400`/`403` `ErrorResponseDTO`, shows safe fallback in Admins & Notifications tabs without `"Tatiana Camargo"`.
     - `HealthReportsScreen`: renders backend `setoresElegiveis` + `indiceGeralAgrupadoKAnonimato` and explicit LGPD clinical-unavailable notice; handles `500`/retry cleanly.

---

## 4. Caveats
- **Backend M2 Changes Concurrent**: `m2_explorer_1` is designing the backend M2 additions (`GET /api/rh/empresas/atual`, `PUT /api/rh/empresas/{id}`, `GET .../licencas`, `POST .../reenviar`, `PATCH .../revogar`, `PATCH .../reativar`, `DemoDayDataSeeder` RH user). All frontend contracts above strictly follow `PROJECT.md:53-62`, which must remain synchronized with the M2 worker's backend implementation.
- **Recharts Width/Height in jsdom**: `ResponsiveContainer` logs a benign width/height `0` warning in jsdom if container dimensions are `0`; if noisy in test output, `setup.js` or per-test mock/dimension stub can handle it cleanly without masking real component logic.
- **Lint Gate Scope**: `apps/rh/src/App.jsx:16` currently breaks `npm --workspace=@floravel/rh run lint`; fixing `hidratarSessaoDoHash()` is included in the M2 plan so `npm run lint:all` passes cleanly.

---

## 5. Conclusion
`apps/rh` is ready for M2 implementation once the 8 endpoints in `PROJECT.md:53-62` are targeted via `src/services/rhApi.js` and `src/utils/rhSession.js`, all hardcoded `"TechCorp Brasil"` / clinical / billing / admin mocks are replaced with live backend bindings + explicit LGPD/unavailable fallback states, `App.jsx`/`Sidebar.jsx` enforce RH auth guard and real logout, and Vitest + Testing Library tests cover loading, CRUD, error/retry (`401`/`403`/`422`/`500`/network), and safe fallbacks.

---

## 6. Verification Method
After implementing M2 in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\apps\rh`:
1. Run unit & component tests:
   `npm --workspace=@floravel/rh run test` (and `npm run test:all` at repo root) → expect 0 failures.
2. Run lint & production build:
   `npm --workspace=@floravel/rh run lint` and `npm run build:all` → expect exit code `0` (0 ESLint errors, 0 build errors).
3. Static mock/secret hygiene check across `apps/rh/src`:
   Confirm zero occurrences of `"TechCorp"`, `INITIAL_COLLABORATORS`, `INITIAL_INVOICES`, `INITIAL_ADMINS`, `floravel.com.br/convite`, or hardcoded credentials.
4. **Invalidation conditions**: Any change to the DTO field names or URL paths in `RhCorporativoController` (`PROJECT.md:53-62`) invalidates `rhApi.js` and its test fixtures.
