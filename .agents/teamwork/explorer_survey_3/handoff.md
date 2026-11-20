# Step 0 Technical Survey — Florável Frontend Monorepo (`Froravel-Front`)

**Executive Summary:** `Froravel-Front` is an npm-workspaces JavaScript/JSX monorepo (React 19, Vite 8, Tailwind CSS v4, no TypeScript, no test runner installed) with four Vite SPAs (`landing`, `mae`, `psicologo`, `rh`) sharing `@floravel/shared`. `npm run build:all` currently passes with 0 errors, while R1–R4 features are largely mocked or use ephemeral/polling placeholders (`LoginScreen` forgot-password modal is a local state stub; `apps/rh` makes zero HTTP calls; `SalaAcolhimento` & `MeetingRoomModal` use `BroadcastChannel` + `setInterval` polling instead of Jitsi/SSE; profile photos use `URL.createObjectURL` in `mae` and Base64 DataURLs in `psicologo`).

---

## 1. Observation

### 1.1 Monorepo Structure, Build & Test Tooling
- **Root manifest** (`C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\package.json:1-25`):
  - Workspace manager: **npm workspaces** (`"workspaces": ["apps/*", "packages/*"]`), root `devDependencies`: `concurrently ^9.1.2`.
  - Scripts: `dev:{landing,mae,psicologo,rh}`, `build:{landing,mae,psicologo,rh}`, `build:all` (`npm run build --workspaces --if-present`), `lint:all` (`npm run lint --workspaces --if-present`). **No `test` script exists at root or in any workspace.**
- **Apps & Configs**:
  - `apps/landing` (`@floravel/landing`): Vite `8.3.0`, React `19.2.8`, `react-router-dom ^7.18.4`, `axios ^1.20.0`, `lucide-react`, `lenis`, `@tailwindcss/vite ^4.3.3`. Port `5173` (`apps/landing/vite.config.js:12`). Has `vercel.json` SPA rewrite (`apps/landing/vercel.json:1-4`).
  - `apps/mae` (`@floravel/mae`): Vite `8.3.0`, `vite-plugin-pwa ^2.0.0`, React `19.2.8`, `react-router-dom ^7.18.4`, `lucide-react`, `@tailwindcss/vite ^4.3.3`. Port `5174` (`apps/mae/vite.config.js:65`). Has `vercel.json`.
  - `apps/psicologo` (`@floravel/psicologo`): Vite `8.3.4`, `vite-plugin-pwa ^2.0.0`, React `19.3.1`, `react-router-dom ^7.18.4`, `lucide-react`, `@tailwindcss/vite ^4.3.3`. Port `5175` (`apps/psicologo/vite.config.js:50`). Has `vercel.json`.
  - `apps/rh` (`@floravel/rh`): Vite `8.3.6`, React `19.3.1`, `recharts ^3.10.1`, `lucide-react`, `@tailwindcss/vite ^4.3.5` (**no `react-router-dom`**, **no `vercel.json`**). Port `5176` (`apps/rh/vite.config.js:12`).
- **TypeScript / Tests**: Zero `tsconfig.json` files; all source files are `.js`/`.jsx`. Zero test runners (no Vitest, Jest, Playwright, Testing Library) in root or workspace `package.json` files. ESLint 10 (`eslint.config.js`) is configured per app.
- **Environment files**:
  - `apps/landing/.env.example` & `.env`: `VITE_API_URL=http://localhost:8080`, `VITE_GOOGLE_CLIENT_ID=...`.
  - `apps/mae/.env.example`: `VITE_API_URL=http://localhost:8080`. `apps/mae/.env` sets `VITE_LANDING_URL`, `VITE_MAE_APP_URL`, `VITE_TERAPEUTA_APP_URL`, `VITE_RH_APP_URL` (note: `VITE_API_URL` is absent in `apps/mae/.env`, falling back to `http://localhost:8080` only on `localhost`/`127.0.0.1`).
  - `apps/psicologo/.env.example` & `.env`: same pattern as `apps/mae`.
  - `apps/rh/.env.example`: `VITE_API_URL=http://localhost:8080`. No `.env` file exists in `apps/rh`.
- **Shared Package (`packages/shared`)**:
  - `packages/shared/package.json:1-13` exports `.`, `./appLinks`, `./tokens` (`"type": "module"`, plain JS).
  - `packages/shared/src/appLinks.js:11-58`: defines `getApiBase()` (reads `import.meta.env?.VITE_API_URL` or `'http://localhost:8080'` locally, else `''`), `APP_LINKS` (`landing`, `mae`, `terapeuta`, `rh`), and `navigateToApp(appKey, sessionData)` which serializes `sessionData` as Base64 into `#auth=<b64>` URL hash fragment.
  - `packages/shared/src/tokens.js:6-34`: `FLORAVEL_COLORS` and `FLORAVEL_FONTS`.
  - Note: No shared API client, Axios wrapper, or auth context lives in `packages/shared`. `apps/landing/src/Api/axios.js:1-7` has an unused `axios.create({ // baseURL: import.meta.env.VITE_API_URL })`. All API calls across apps use raw `fetch(...)` with inline `const API_BASE = ...` and `localStorage.getItem('floravel_jwt')`.
- **Auth State Hydration**:
  - `apps/mae/src/App.jsx:605-620`, `apps/psicologo/src/App.jsx:14-29`, `apps/rh/src/App.jsx:3-18` all define `hidratarSessaoDoHash()`, reading `#auth=` from `window.location.hash` and writing `floravel_mae_sessao` / `floravel_psi_sessao` / `floravel_rh_sessao`, `floravel_jwt` (`authData.tokenSessao`), and `floravel_codigo_publico` (`authData.codigoPublico`) into `localStorage`.
- **Baseline Build**:
  - Executed `npm run build:all` in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front`: exited with code `0`. All 4 workspaces built cleanly (`landing`: 1.79s, `mae`: 634ms + PWA SW, `psicologo`: 542ms + PWA SW, `rh`: 735ms), with Vite chunk-size warnings (>500 kB) on `landing`, `mae`, and `rh`.

---

### 1.2 R1 — `apps/landing` (Auth, Registration, Password Recovery, Email Flow)
- **Routing (`apps/landing/src/App.jsx:22-35`)**:
  - `/`: `<Layout><Landing /></Layout>`
  - `/nova`: `<NovaLandingScreen />`
  - `/login`: `<LoginScreen />`
  - `/cadastro`: `<CadastroScreen />` (renders `<LoginScreen initialMode="cadastro" />`, `apps/landing/src/Screen/Auth/CadastroScreen.jsx:1-5`)
  - `*`: `<Navigate to="/" replace />`
  - **No `/esqueci-senha`, `/redefinir-senha`, or `/validar-email` routes exist.**
- **Login & OAuth (`apps/landing/src/Screen/Auth/LoginScreen.jsx`)**:
  - Standard login (`handleLoginSubmit`, lines `228-265`): `POST ${API_BASE}/api/auth/login` with `{ email, senha }`. Saves session via `salvarSessaoLocal(authData, papel)` (`lines 130-139`) and calls `navigateToApp(papel, authData)`. Note: `salvarSessaoLocal` maps `'terapeuta'` -> `'floravel_psi_sessao'` and everything else (including `'rh'`) -> `'floravel_mae_sessao'` (line `131`).
  - Google OAuth (`lines 118-202`): `GET ${API_BASE}/api/auth/oauth/google/config` and `POST ${API_BASE}/api/auth/oauth/google` with `{ idToken, tipoPerfil }`. Note: hardcoded fallback `GOOGLE_CLIENT_ID_PUBLIC` on line `21`.
- **Registration (`handleCadastroSubmit`, `lines 393-474`)**:
  - Validates CPF/age against `POST ${API_BASE}/api/governo/validar-identidade` (`lines 337-375`) with local fallback (`simularFallbackGovernoLocal`, `lines 290-335`).
  - Only `papel === 'mae'` submits to backend: `POST ${API_BASE}/api/maes` (`lines 450-469`) with `{ nome, email, cpf, senha, dataNascimento, responsavel }`. On `2xx`, immediately calls `salvarSessaoLocal(maeCriada, 'mae')` and `navigateToApp('mae', maeCriada)` — **no email confirmation/welcome notification screen or code validation step exists**.
- **Forgot / Reset Password (`lines 78-80, 284-287, 596-605, 1040-1103`)**:
  - Clicking `"Esqueceu a senha?"` opens `showForgotModal`.
  - `handleForgotSubmit` (`lines 284-287`) is a **pure UI stub**: `e.preventDefault(); setForgotSent(true);` — makes **no HTTP call**, has **no error/loading states**, and has **no 6-digit code input or new-password reset step/screen**.

---

### 1.3 R2 — `apps/rh` (Dashboard RH & Sub-views)
**Zero HTTP calls exist anywhere in `apps/rh/src/`.** No `getApiBase()` or `fetch` or `axios` is used. Auth hydration in `apps/rh/src/App.jsx:3-18` stores `floravel_rh_sessao` and `floravel_jwt` in `localStorage`, which are never read by any component.

| File | Mocked Data / Constants | Exact Shape & Values | UI / Action Gaps |
|---|---|---|---|
| `apps/rh/src/DashboardRh.jsx` | Hardcoded header, banner, 4 KPI cards (`lines 204, 248-250, 267-393`), `emotionalRiskData` (`lines 60-64`), `wellBeingTimelineData` (`lines 66-73`), `challengesData` (`lines 75-81`), 2 AI insights (`lines 642-669`) | - Header/Banner: `"TechCorp Brasil"`, `"TC"`, `42 colaboradoras ativas`, `42 / 50` (84%), `78%` (+5%), `11,2` (EPDS), `124` sessões.<br>- `emotionalRiskData`: `[{ name, value, color }]` (60/25/15).<br>- `wellBeingTimelineData`: `[{ month, humor, energia }]` (Jan–Jun).<br>- `challengesData`: `[{ label, percentage }]` (5 items). | Export PDF/CSV (`handleExport`, `lines 138-142`) shows toast only; Bell button (`lines 239-245`) is non-interactive; "Ver detalhes anonimizados" (`line 620`) has no handler; "Agendar Workshop" (`line 676`) calls `window.alert(...)`. |
| `apps/rh/src/Sidebar.jsx` | Static manager profile (`lines 143-177`) | `"TechCorp RH"`, `"admin@techcorp.com.br"`, `"TC"`. | Clicking profile switches to `"config"`; logout icon does not clear session/redirect. |
| `apps/rh/src/screens/LicensesScreen.jsx` | `INITIAL_COLLABORATORS` (`lines 20-85`), `totalAllocated = 50` (`line 130`), `Taxa de Adesão = 94%` (`line 300`) | `[{ id, name, email, department, inviteDate, status: 'active' \| 'pending' \| 'revoked' }]` (8 items). | All CRUD (`handleResendInvite`, `handleRevoke`, `handleReactivate`, `handleSendInvite`, `lines 136-192`) mutates local React state only; `handleCopyLink` (`line 144`) copies hardcoded `https://floravel.com.br/convite?token=${colab.id}`. |
| `apps/rh/src/screens/HealthReportsScreen.jsx` | `departmentRiskStackedData` (`lines 24-30`), `burnoutEvolutionData` (`lines 33-40`) | - `[{ dept, baixoRisco, riscoModerado, alertaClinico }]` (5 depts, K>=5 grouped).<br>- `[{ mes, esgotamento, recuperacao }]` (Mai–Out). | `period` selector (`"30d" \| "3m" \| "6m" \| "1y"`, `line 100`) does not re-fetch or alter data; `handleExportPdf` (`lines 113-119`) uses `setTimeout(1500)` + toast. |
| `apps/rh/src/screens/BillingScreen.jsx` | `INITIAL_INVOICES` (`lines 16-58`), `cardLastDigits = "4092"` (`line 64`), plan card (`lines 272-304`) | `[{ id, refMonth, dueDate, amount, status: 'failed' \| 'paid', errorMessage?, nfNumber }]` (5 items). | `handleRetryPayment` (`lines 84-97`) uses `setTimeout(1500)`; `handleDownloadNf` & `handleSaveCard` are local state/toast only. |
| `apps/rh/src/screens/SettingsScreen.jsx` | `INITIAL_ADMINS` (`lines 18-33`), `companyForm` (`lines 39-46`), `notifications` (`lines 56-61`) | - `companyForm`: `{ companyName, tradingName, cnpj, rhContactEmail, phone, address }`.<br>- `admins`: `[{ id, name, email, role, status }]`.<br>- `notifications`: `{ emailWeeklyDigest, burnoutAlertThreshold, licenseCapacityAlert, smsSecurityAlert }`. | `handleSaveChanges` (`lines 125-135`), `handleAddAdmin`, `handleRemoveAdmin` mutate local state + `setTimeout(1200)` only. |

---

### 1.4 R3 — `apps/psicologo` & `apps/mae` (`SalaAcolhimento`, Video/Audio, Notifications)
- **Jitsi SDK Status**: **Not installed anywhere.** Zero references to `@jitsi/react-sdk`, `JitsiMeetExternalAPI`, or `external_api.js` in `package.json`, `index.html`, or `src/` across all apps.
- **SSE (`EventSource`) Status**: **Zero `EventSource` or SSE usage anywhere in the monorepo.**
- **`apps/psicologo/src/Screen/SalaAcolhimento.jsx`**:
  - Uses mocked session list `SESSOES_AGENDADAS_SALA` (`lines 134-202`) with string IDs (`'roda-primeiros-meses'`, `'ind-mariana'`, `'ind-camila'`, `'ind-juliana'`) and mocked `participantes`.
  - Captures local webcam only (`navigator.mediaDevices.getUserMedia({ video: true, audio: false })` via `psiCamManager`, `lines 69-109`) — **no remote audio/video streaming (no WebRTC/Jitsi)**.
  - Plays Web Audio API chime (`playSoftArrivalChime`, `lines 39-66`) when `notificarEntradaMae()` is called; currently triggered by a simulated 3-second `setTimeout` on call start (`lines 300-305`) or `BroadcastChannel('floravel_sala_ao_vivo')` event `PARTICIPANT_JOINED` (`lines 328-330`).
  - Syncs chat and room status via `BroadcastChannel('floravel_sala_ao_vivo')` + `setInterval` polling every `2500ms` to `GET ${API_BASE}/api/sala-ao-vivo/estado` (`lines 334-350`), `POST ${API_BASE}/api/sala-ao-vivo/status` (`lines 288, 408`), and `POST ${API_BASE}/api/sala-ao-vivo/mensagens` (`line 390`). **None of those `/api/sala-ao-vivo/*` calls pass an `Authorization: Bearer` header or room identifier.**
  - Note: Line `434` (`PATCH ${API_BASE}/api/maes/demo-mae/sinalizar-menor`) *does* attach `Authorization: Bearer ${token}`.
- **`apps/mae/src/Components/Meeting/MeetingRoomModal.jsx`**:
  - Opened from `AgendamentoScreen.jsx:19-27` (individual sessions) and `ComunidadeScreen.jsx:115-123` (group "Rodas").
  - Also captures local webcam only (`camManager` with `audio: false`, `lines 14-54`), displays static `<img>` placeholders for therapist and other mothers (`lines 209-247`), and hardcodes room label `flo-roda-segura` (`line 901`).
  - Polls `GET ${API_BASE}/api/sala-ao-vivo/estado` every `1500ms` (`lines 177-195`) and posts chat to `POST ${API_BASE}/api/sala-ao-vivo/mensagens` (`lines 311-315`) alongside `BroadcastChannel('floravel_sala_ao_vivo')` (`lines 160-175, 305-308`). **No `Authorization` header, no room ID param, and no `PARTICIPANT_JOINED` emission when `stage` transitions to `'in_call'`.**
- **Notifications**:
  - `apps/psicologo/src/Components/Sidebar/DashboardLayout.jsx:22-59, 117-197`: reads/persists `floravel_psi_notificacoes` in `localStorage` and listens to same-origin `BroadcastChannel('floravel_notificacoes_psi')` for `NOVO_AGENDAMENTO` (emitted by `apps/mae/src/Screen/Services/SupportNetworkScreen.jsx:429-431`). No backend fetch or SSE subscription.
  - `apps/mae/src/App.jsx:131-136, 188-196`: shuffles static `POSSIBLE_NOTIFICATIONS` on click; no backend or SSE notifications.

---

### 1.5 R4 — Profile Photo Upload Across Apps
- **`apps/mae/src/Screen/Profile/PerfilScreen.jsx`** (`lines 10-53, 108-133`):
  - Renders `<img src={avatar} ... />` (defaults to `/img/ilustracoes/florescer.jpg`).
  - `handleFileChange` (`lines 30-39`) uses `URL.createObjectURL(file)` — **ephemeral in-memory blob URL**, lost on reload, **zero size/type validation** beyond `accept="image/*"`, and **zero backend upload/persistence**.
  - `handleSubmit` (`lines 48-53`) only sets `isSaved(true)` locally (does not call `PUT/PATCH /api/maes/...` or update `floravel_mae_sessao`).
  - `apps/mae/src/App.jsx` lines `347` and `495` hardcode `src="/img/ilustracoes/florescer.jpg"` and `"Mariana Silva"` in both sidebar and header instead of reading from session/profile state.
- **`apps/psicologo/src/Screen/PerfilConfiguracoes.jsx`** (`lines 33, 47-59, 301-353`) & **`PsiAccessibilityContext.jsx`** (`lines 55-133`):
  - `handlePhotoUpload` (`PerfilConfiguracoes.jsx:47-59`) reads file via `FileReader.readAsDataURL(file)` (Base64 string), sets `form.fotoUrl`, and immediately calls `updatePsiProfile({ fotoUrl: reader.result })`, which writes to `localStorage` (`floravel_psi_profile`) and sends `PUT ${API_BASE}/api/psicologos/${merged.id}` with `{ ..., fotoUrl: merged.fotoUrl }` (`PsiAccessibilityContext.jsx:123-130`) with `Authorization: Bearer ${token}`. No file size/type validation beyond `accept="image/*"`.
  - Sidebar (`apps/psicologo/src/Components/Sidebar/Sidebar.jsx:125`) and Header (`DashboardLayout.jsx:396`) read `psiProfile?.fotoUrl`.
  - **Field mapping bug observed** in `apps/mae/src/Screen/Services/SupportNetworkScreen.jsx:230`: `merged` maps `fotoUrl: dbMatch.fotoUrl || mock.photo` instead of `photo: dbMatch.fotoUrl || mock.photo`, whereas `PsychologistCard.jsx:51` renders `professional.photo` (so backend `fotoUrl` updates for mocked psychologists are ignored in the mother's Support Network list).
- **`apps/rh`**:
  - No profile screen or photo upload component exists; `DashboardRh.jsx:248-250` and `Sidebar.jsx:152-157` render static `"TC"` initials. `SettingsScreen.jsx` manages company profile, admins, and notification toggles only.
- **`packages/shared`**: No shared upload or avatar component exists.

---

## 2. Logic Chain
1. **Tooling & Shared Layer**: Because all 4 apps use plain JS/JSX with Vite 8 and `@floravel/shared` only contains `appLinks.js` and `tokens.js`, there is no centralized `axios` instance, auth interceptor, or test runner. Any shared SSE/S3-upload/auth helpers can either live in `packages/shared` (exported via `packages/shared/package.json`) or per-app services, and adding frontend automated tests (if required by Acceptance Criteria) will require installing a test runner such as `vitest` + `@testing-library/react`.
2. **R1 Gap**: `LoginScreen.jsx` already integrates `/api/auth/login`, `/api/auth/oauth/google`, `/api/governo/validar-identidade`, and `/api/maes`, but `showForgotModal` is a non-functional stub and post-registration jumps directly to `apps/mae` without email confirmation/welcome-email feedback or reset-password routes (`/esqueci-senha`, `/redefinir-senha`). Note also `salvarSessaoLocal` (`LoginScreen.jsx:131`) saves RH sessions under `floravel_mae_sessao` instead of `floravel_rh_sessao` if accessed locally on Landing.
3. **R2 Gap**: `apps/rh` is completely disconnected from the backend (`0` HTTP requests, no `.env`, `DashboardRh.jsx` + all 4 sub-screens rely on static arrays, `setTimeout`, and `alert`). Every section (KPIs, EPDS donut, well-being timeline, challenges, AI insights, licenses CRUD, health reports, billing, settings) must be wired to `RhCorporativoController` endpoints with loading/error states and safe fallbacks, plus reading `floravel_jwt` for `Authorization: Bearer` headers.
4. **R3 Gap**: Currently neither `apps/psicologo` nor `apps/mae` has real audio/video transmission or SSE. `SalaAcolhimento.jsx` and `MeetingRoomModal.jsx` rely on `BroadcastChannel` (same-origin tabs only — which **fails across ports `5174` vs `5175` locally and across distinct Vercel domains in production!**) and unauthenticated `/api/sala-ao-vivo/*` polling. Replacing the fake video stage with Jitsi Meet SDK (`@jitsi/react-sdk` or Jitsi External API script) keyed by deterministic/backend-issued room names, and replacing `setTimeout`/cross-origin `BroadcastChannel` with SSE (`EventSource` or `fetch`-based SSE stream if `Authorization` headers are required, since native `EventSource` cannot send custom headers) will enable real multi-user video/audio and live arrival notifications.
5. **R4 Gap**: Both `apps/mae` (`URL.createObjectURL`) and `apps/psicologo` (inline Base64 DataURL in `PUT /api/psicologos/{id}`) lack real object storage upload. Integrating Presigned URL upload requires client-side image type/size validation, requesting a Presigned URL from the backend (with `Authorization: Bearer`), uploading the binary `File` directly via `PUT <presignedUrl>`, persisting the resulting public/object URL on the user profile, and updating `apps/mae/src/App.jsx` + `SupportNetworkScreen.jsx:230` so the uploaded photo actually renders in headers/sidebars/cards.

---

## 3. Caveats
- **Backend repository not surveyed**: Per dispatch scope, only `Froravel-Front` was inspected; exact Spring Boot endpoint paths, DTO field names, and `RhCorporativoController` / `modules/auth` / `modules/reuniao` / S3 contracts must be verified against `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel`.
- **Lint not executed**: `npm run build:all` was run and verified (`exit 0`), whereas `npm run lint:all` was not executed.
- **Uninspected secondary screens**: Non-R1..R4 screens (e.g., `NovaLandingScreen.jsx`, `BibliotecaScreen.jsx`, `FeedScreen.jsx`, `HomeHero.jsx`) were not read in full; `grep_search` confirmed none of them reference Jitsi, `EventSource`, `sala-ao-vivo`, or `fotoUrl`.
- **Note on `LoginScreen.jsx:21`**: A Google OAuth Client ID string (`339469409890-...apps.googleusercontent.com`, public OAuth client ID) is present as a fallback literal in `LoginScreen.jsx` and in `apps/landing/.env`; verify against the acceptance criterion for no hardcoded credentials if needed.

---

## 4. Conclusion
1. **Build baseline is green**: `npm run build:all` passes (`0` errors across all 4 apps), but **no frontend test runner** is configured.
2. **R1 (`apps/landing`)**: Implement real API calls in `LoginScreen.jsx`'s forgot-password modal and add a reset-password code/password flow (and route(s) in `apps/landing/src/App.jsx` if standalone link/page is used), plus post-registration email confirmation/welcome-email UX and fixing `salvarSessaoLocal` for `rh`.
3. **R2 (`apps/rh`)**: Create `.env` (or ensure `getApiBase()` from `@floravel/shared` is used), add a service layer sending `Authorization: Bearer ${localStorage.getItem('floravel_jwt')}`, and replace hardcoded mocks in `DashboardRh.jsx`, `LicensesScreen.jsx`, `HealthReportsScreen.jsx`, `BillingScreen.jsx`, and `SettingsScreen.jsx` with `RhCorporativoController` HTTP calls + loading/error/fallback states.
4. **R3 (`apps/psicologo` & `apps/mae`)**: Install/load Jitsi Meet SDK in `apps/psicologo` and `apps/mae`, wire `SalaAcolhimento.jsx` and `MeetingRoomModal.jsx` to real room names/IDs from the backend, and add an authenticated SSE consumer for real-time room arrival notifications (replacing the 3s `setTimeout` and broken cross-origin `BroadcastChannel` assumption).
5. **R4 (`apps/mae`, `apps/psicologo`, optionally `apps/rh`)**: Replace `URL.createObjectURL` (`PerfilScreen.jsx`) and Base64 `FileReader` (`PerfilConfiguracoes.jsx`) with client-side image validation + Presigned URL `PUT` upload + profile persistence, wire `apps/mae/src/App.jsx` header/sidebar avatar to session/profile state, and fix `SupportNetworkScreen.jsx:230` (`photo:` vs `fotoUrl:`).

---

## 5. Verification Method
- **Build check**: Run `npm run build:all` from `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front` — verified exit code `0` at survey time.
- **Inspect key files directly**:
  - Monorepo & shared: `package.json`, `packages/shared/src/appLinks.js`
  - R1: `apps/landing/src/App.jsx`, `apps/landing/src/Screen/Auth/LoginScreen.jsx:78-80,284-287,450-469,1040-1103`
  - R2: `apps/rh/src/DashboardRh.jsx`, `apps/rh/src/screens/{LicensesScreen,HealthReportsScreen,BillingScreen,SettingsScreen}.jsx`
  - R3: `apps/psicologo/src/Screen/SalaAcolhimento.jsx`, `apps/mae/src/Components/Meeting/MeetingRoomModal.jsx`, `apps/psicologo/src/Components/Sidebar/DashboardLayout.jsx`
  - R4: `apps/mae/src/Screen/Profile/PerfilScreen.jsx`, `apps/mae/src/App.jsx:345-351,489-499`, `apps/psicologo/src/Screen/PerfilConfiguracoes.jsx:47-59`, `apps/mae/src/Screen/Services/SupportNetworkScreen.jsx:230`
- **Invalidation conditions**: Any changes to `package.json` dependencies, `packages/shared/src/*`, or the listed screen/component files after `2026-11-20T00:39:00Z` require re-verifying the affected section.
