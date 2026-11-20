# M1 Frontend Investigation & Implementation Strategy (`Froravel-Front` / `apps/landing`)

**Summary:** Verified exact React 19 + Vite 8 compatible Vitest 5.1.1 / Testing Library 16.3.3 / jsdom 31.0.1 configuration for the npm-workspaces monorepo, designed the complete R1 auth UI/routing architecture (`PasswordRecoveryFlow`, `EmailConfirmationFlow`, `/esqueci-senha`, `/redefinir-senha`, `/confirmar-email`, modal integration, post-cadastro JWT exchange, `salvarSessaoLocal` `'rh'` fix, and credential literal removal), and specified a full Vitest test plan covering success and error states.

---

## 1. Observation

### 1.1 Monorepo, Runtime & Package Compatibility
- **Runtime**: `node -v` -> `v24.21.0`; `npm -v` -> `11.19.0`.
- **Root manifest** (`C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\package.json:1-26`):
  - `"workspaces": ["apps/*", "packages/*"]`
  - `"build:all": "npm run build --workspaces --if-present"` (`line 19`)
  - `"lint:all": "npm run lint --workspaces --if-present"` (`line 20`)
  - Only `concurrently: ^9.1.2` in `devDependencies`; no `test` or `test:all` script exists.
- **Workspace Versions**:
  - `apps/landing/package.json:18-32`: `react ^19.2.8`, `react-dom ^19.2.8`, `react-router-dom ^7.18.4`, `vite ^8.3.0`, `@vitejs/plugin-react ^6.1.1`, `@tailwindcss/vite ^4.3.3`, `eslint ^10.10.0`.
  - `apps/mae/package.json:16-30`: `react ^19.2.8`, `vite ^8.3.0`.
  - `apps/psicologo/package.json:16-30`: `react ^19.3.1`, `vite ^8.3.4`.
  - `apps/rh/package.json:16-30`: `react ^19.3.1`, `vite ^8.3.6`.
- **Verified npm Registry Peer Dependencies**:
  - `vitest@5.1.1`: `peerDependencies: { vite: '^6.4.0 || ^7.0.0 || ^8.0.0', jsdom: '*', '@types/node': '^22.0.0 || >=24.0.0' }`
  - `@testing-library/react@16.3.3`: `peerDependencies: { react: '^18.0.0 || ^19.0.0', 'react-dom': '^18.0.0 || ^19.0.0', '@testing-library/dom': '^10.0.0' }`
  - `@testing-library/jest-dom@8.0.0`: `peerDependencies: { vitest: '>=5 <6', '@testing-library/dom': '>=10 <11' }`
  - `@testing-library/user-event@14.6.13`: `peerDependencies: { '@testing-library/dom': '>=7.21.4' }`
  - `@testing-library/dom@10.4.2`
  - `jsdom@31.0.1`: `engines: { node: '^22.22.2 || ^24.15.0 || >=26.0.0' }`
- **ESLint Config** (`apps/landing/eslint.config.js:7-21`):
  - Applies `js.configs.recommended`, `reactHooks.configs.flat.recommended`, `reactRefresh.configs.vite` to `**/*.{js,jsx}` with `globals.browser`.

### 1.2 Shared Package (`packages/shared`) & Landing Config
- `packages/shared/package.json:1-13`: `"type": "module"`, exports `.`, `./appLinks`, `./tokens`. Workspace symlink verified at `node_modules/@floravel/shared`.
- `packages/shared/src/appLinks.js:7-16`:
  ```js
  const isLocalEnvironment =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  export function getApiBase() {
    return (
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
      (isLocalEnvironment ? 'http://localhost:8080' : '')
    );
  }
  ```
- `packages/shared/src/appLinks.js:45-58`: `navigateToApp(appKey, sessionData)` encodes `sessionData` as Base64 into `${baseTarget}#auth=${encodeURIComponent(b64)}` and assigns `window.location.href = target`. `APP_LINKS.rh` maps to `VITE_RH_APP_URL` or `'http://localhost:5176'` locally / `'https://floravel-rh.vercel.app'` in prod.
- `apps/landing/src/utils/appLinks.js:1`: `export * from '@floravel/shared';`.
- `apps/landing/vite.config.js:1-14`: Uses `defineConfig` from `'vite'` with `plugins: [react(), tailwindcss()]`, `server: { port: 5173 }`.
- `apps/landing/index.html:133-136`: Removes `#page-loader` immediately whenever `location.pathname !== "/"`, so auth routes open directly without loader delay.

### 1.3 Current `apps/landing` Auth & Routing State
- `apps/landing/src/App.jsx:22-35`: Defines `/`, `/nova`, `/login`, `/cadastro`, and `*` (`<Navigate to="/" replace />`). No `/esqueci-senha`, `/redefinir-senha`, or `/confirmar-email` routes exist.
- `apps/landing/src/Screen/Auth/CadastroScreen.jsx:1-5`: Renders `<LoginScreen initialMode="cadastro" />`.
- `apps/landing/src/Screen/Auth/LoginScreen.jsx`:
  - **Line 18**: `const API_BASE = getApiBase();` — evaluated once at module load time.
  - **Lines 19-21**: `const GOOGLE_CLIENT_ID_PUBLIC = import.meta.env.VITE_GOOGLE_CLIENT_ID || '339469409890-1g5vn0mmj2hir5ishgi0kh2q47rglfb2.apps.googleusercontent.com';` (hardcoded fallback literal; lines `118-128` already fetch `${API_BASE}/api/auth/oauth/google/config` when `!googleClientId`).
  - **Lines 130-139**:
    ```js
    const salvarSessaoLocal = (authData, papelAtual) => {
      const chave = papelAtual === 'terapeuta' ? 'floravel_psi_sessao' : 'floravel_mae_sessao';
    ```
    Bug: `papelAtual === 'rh'` writes to `'floravel_mae_sessao'` instead of `'floravel_rh_sessao'`. Meanwhile `apps/rh/src/App.jsx:12` reads/writes `'floravel_rh_sessao'`.
  - **Lines 170-171** (Google OAuth) & **252-254** (email/password login): Call `salvarSessaoLocal(authData, papel)` and `navigateToApp(papel, authData)` using only UI tab state `papel`, ignoring `authData.tipoPerfil` (`"MAE" | "PSICOLOGO" | "RH"`).
  - **Lines 78-80, 284-287, 596-605, 1040-1103**: `handleForgotSubmit` is a stub (`e.preventDefault(); setForgotSent(true);`) with no `fetch`, no loading/error state, and no 6-digit code + new password step.
  - **Lines 450-469**: On `POST ${API_BASE}/api/maes` `201 Created`, immediately calls `salvarSessaoLocal(maeCriada, 'mae'); navigateToApp('mae', maeCriada);` without email confirmation.

### 1.4 Backend Contracts Verified (`floravel-backend/Floravel`)
- `MaeService.java:48-146` & `MaeResponseDTO.java:16-64`: `POST /api/maes` triggers `authService.gerarEEnviarCodigoConfirmacao(maeSalva.getUsuario())` (line 143) and returns `MaeResponseDTO` (`id, usuarioId, codigoPublico, nome, email, tipoPerfil, emailVerificado: false, ...`) — **no `tokenSessao` JWT is returned by `POST /api/maes`**.
- `AuthController.java:45-57`, `AuthService.java:73-168`, `ConfirmarEmailResponseDTO.java:10-14`:
  - `POST /api/auth/confirmar-email` (`{ email, codigo }`) -> `200 OK`: `{ verificado: true, mensagem, email }`; `400 Bad Request` (`ErrorResponseDTO`) on invalid (`CodigoInvalidoException`) or expired (`CodigoExpiradoException`) code.
  - `POST /api/auth/reenviar-codigo` (`{ email }`) -> `200 OK`: `{ verificado, mensagem, email }`.
  - `POST /api/auth/login` (`{ email, senha }`) -> `200 OK`: `LoginResponseDTO` (`usuarioId, perfilId, codigoPublico, nome, email, tipoPerfil, emailVerificado, tokenSessao, mensagem`). Note: `autenticar` does not block unverified accounts, so login works and issues a JWT immediately after confirmation.
- `PROJECT.md` Interface Contracts §1 (`lines 42-51`):
  - `POST /api/auth/esqueci-senha` (`{ email }`) -> `200 OK`: `{ mensagem, email, expiracaoMinutos: 15 }`.
  - `POST /api/auth/redefinir-senha` (`{ email, codigo, novaSenha }`) -> `200 OK`: `{ redefinida: true, mensagem, email }`; `400 Bad Request` (`ErrorResponseDTO`: `{ status, error, message, validationErrors? }`).

---

## 2. Logic Chain

1. **Test Runner Choice & Monorepo Integration**:
   - Because all apps run React `19.2.8`–`19.3.1` and Vite `8.3.0`–`8.3.6` on Node `24.21.0`, installing `vitest@^5.1.1`, `@testing-library/react@^16.3.3`, `@testing-library/jest-dom@^8.0.0`, `@testing-library/user-event@^14.6.13`, `@testing-library/dom@^10.4.2`, and `jsdom@^31.0.1` in root `package.json` `devDependencies` satisfies every peerDependency cleanly and hoists once for M1 (`apps/landing`), M2 (`apps/rh`), M3 (`apps/psicologo`, `apps/mae`), and M4.
   - Adding `"test:all": "npm run test --workspaces --if-present"` to root `package.json` allows M1 to run `apps/landing` tests immediately while workspaces without `"test"` are safely skipped until M2–M4 add theirs.
   - Keeping `apps/landing/vite.config.js` untouched and creating a dedicated `apps/landing/vitest.config.js` guarantees `npm run build:all` (`vite build`) and Vercel deployments never execute test config or import `vitest/config`.
2. **Deterministic `API_BASE` in Vitest**:
   - Because `packages/shared/src/appLinks.js` computes `isLocalEnvironment` at import time and `LoginScreen.jsx:18` caches `const API_BASE = getApiBase();` at module evaluation time, default `jsdom` (`about:blank`) would make `API_BASE === ''` if `.env` is absent (e.g., CI). Setting `environmentOptions: { jsdom: { url: 'http://localhost:5173/' } }` and `test.env: { VITE_API_URL: 'http://localhost:8080' }` in `apps/landing/vitest.config.js` ensures `API_BASE` is always `'http://localhost:8080'`.
3. **Post-Cadastro Confirmation & JWT Acquisition**:
   - Since `POST /api/maes` returns `MaeResponseDTO` without `tokenSessao`, `LoginScreen.jsx` must NOT navigate to `apps/mae` on `201 Created`. Instead, it transitions into the email confirmation step (`EmailConfirmationFlow`), keeping `{ email, nome, senha, maeData }` in React component state (never `localStorage`).
   - Once `POST /api/auth/confirmar-email` returns `200 OK`, the flow automatically calls `POST /api/auth/login` with `{ email, senha }` (when `senha` is in memory from cadastro) to obtain a full `LoginResponseDTO` with `tokenSessao`, saves it via `salvarSessaoLocal(authData, 'mae')`, and displays the welcome confirmation card with CTA `"Acessar Espaço da Mãe"` (`navigateToApp('mae', authData)`). On standalone `/confirmar-email` (no password in memory), the CTA routes to `/login?email=...`.
4. **Shared Auth Recovery Components for Routes + Modal**:
   - Extracting `PasswordRecoveryFlow.jsx` and `EmailConfirmationFlow.jsx` inside `apps/landing/src/Screen/Auth/` allows `/esqueci-senha`, `/redefinir-senha`, `/confirmar-email`, and `LoginScreen`'s modal/post-cadastro views to share identical state machines, API calls, validation, and error handling without duplicating code inside the 1,107-line `LoginScreen.jsx`.
5. **RH Session Key & Redirect Fix + Credential Literal Removal**:
   - Mapping `SESSAO_STORAGE_KEYS = { mae: 'floravel_mae_sessao', terapeuta: 'floravel_psi_sessao', rh: 'floravel_rh_sessao' }` and resolving `papelDestino` from `authData?.tipoPerfil` with fallback to `papel` fixes RH local storage and cross-app `#auth=` redirect even if the user didn't click the RH tab before submitting.
   - Replacing `LoginScreen.jsx:21` fallback string with `''` satisfies AC4 ("zero hardcoded credentials") while preserving Google Sign-In via `VITE_GOOGLE_CLIENT_ID` or `/api/auth/oauth/google/config`.

---

## 3. Caveats

- `npm run test` has not been executed yet because no test runner is installed (read-only phase).
- `apps/landing/src/Api/axios.js` is unused across `apps/landing`; all auth calls in `LoginScreen.jsx` use native `fetch`, so the new auth flows should also use native `fetch` for consistency and straightforward `vi.spyOn(globalThis, 'fetch')` mocking.
- `LoginScreen.jsx` uses `window.location.href` inside `navigateToApp`; in `jsdom` 31, assigning `window.location.href` logs a navigation error unless `@floravel/shared` / `../../utils/appLinks` is mocked in tests using `vi.mock(..., async (importOriginal) => ...)`.

---

## 4. Conclusion (Implementation-Ready Strategy)

### 4.1 Exact Shared Vitest + RTL + jsdom Configuration

1. **Root `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\package.json`**:
   - Add scripts:
     ```json
     "test:all": "npm run test --workspaces --if-present",
     "test:landing": "npm --workspace=@floravel/landing run test"
     ```
   - Add `devDependencies`:
     ```json
     "devDependencies": {
       "@testing-library/dom": "^10.4.2",
       "@testing-library/jest-dom": "^8.0.0",
       "@testing-library/react": "^16.3.3",
       "@testing-library/user-event": "^14.6.13",
       "concurrently": "^9.1.2",
       "jsdom": "^31.0.1",
       "vitest": "^5.1.1"
     }
     ```
2. **`apps/landing/package.json`**:
   - Add scripts:
     ```json
     "test": "vitest run",
     "test:watch": "vitest"
     ```
3. **`apps/landing/vitest.config.js`** (new file; keeps `vite.config.js` untouched so `npm run build:all` is unaffected):
   ```js
   import { defineConfig } from 'vitest/config';
   import react from '@vitejs/plugin-react';

   export default defineConfig({
     plugins: [react()],
     test: {
       environment: 'jsdom',
       environmentOptions: {
         jsdom: {
           url: 'http://localhost:5173/',
         },
       },
       env: {
         VITE_API_URL: 'http://localhost:8080',
       },
       css: false,
       setupFiles: ['./src/test/setup.js'],
       include: ['src/**/*.{test,spec}.{js,jsx}'],
     },
   });
   ```
4. **`apps/landing/src/test/setup.js`** (new file):
   ```js
   import '@testing-library/jest-dom/vitest';
   import { cleanup } from '@testing-library/react';
   import { afterEach, vi } from 'vitest';

   afterEach(() => {
     cleanup();
     localStorage.clear();
     vi.restoreAllMocks();
   });
   ```
5. **`apps/landing/eslint.config.js`**:
   - Add override so `npm run lint:all` passes on test files & setup:
     ```js
     {
       files: ['**/*.{test,spec}.{js,jsx}', 'src/test/**/*.{js,jsx}'],
       rules: {
         'react-refresh/only-export-components': 'off',
       },
     },
     ```
   - All tests should import `{ describe, it, expect, vi, beforeEach }` explicitly from `'vitest'` and use `globalThis` instead of `global`.

---

### 4.2 Exact UI, Routing & Session Design in `apps/landing`

#### A. `apps/landing/src/App.jsx`
- Export `AppRoutes` (wrapping `<Routes>`) and `App` (wrapping `<AccessibilityProvider><BrowserRouter><ScrollToTop /><AppRoutes /></BrowserRouter></AccessibilityProvider>`) so tests can render `<AppRoutes />` inside `<MemoryRouter>` cleanly.
- Add 3 routes alongside `/login` and `/cadastro`:
  ```jsx
  <Route path="/esqueci-senha" element={<EsqueciSenhaScreen />} />
  <Route path="/redefinir-senha" element={<RedefinirSenhaScreen />} />
  <Route path="/confirmar-email" element={<ConfirmarEmailScreen />} />
  ```

#### B. `apps/landing/src/Screen/Auth/PasswordRecoveryFlow.jsx`
- Component `<PasswordRecoveryFlow initialStep="request" initialEmail="" initialCode="" isModal={false} onClose onSuccessLogin />`:
  - **Step `'request'` ("Esqueci minha senha")**:
    - Input `#recovery-email` (`type="email"`, `required`, prefilled with `initialEmail`).
    - Submit calls `POST ${API_BASE}/api/auth/esqueci-senha` with `{ email: emailLimpo }`.
    - States: `loading` (disables button, label `"Enviando código..."`), `error` (`role="alert"`, reads `errJson.message || errJson.mensagem || fallback`).
    - On `200 OK`: stores `infoMessage` (`data.mensagem`), transitions `step` -> `'reset'`.
    - Secondary link `"Já tenho o código de 6 dígitos"` -> `setStep('reset')`.
  - **Step `'reset'` ("Redefinir senha")**:
    - Inputs:
      - `#reset-email` (`type="email"`, `required`)
      - `#reset-codigo` (`type="text"`, `inputMode="numeric"`, `maxLength={6}`, digits-only `.replace(/\D/g, '').slice(0, 6)`)
      - `#reset-nova-senha` (`type={showPass ? 'text' : 'password'}`, `minLength={6}`)
      - `#reset-confirmar-senha` (`type={showPass ? 'text' : 'password'}`, `minLength={6}`) with show/hide toggle.
    - Client-side validation before `fetch`:
      - Valid non-empty email
      - `/^\d{6}$/.test(codigo)` -> `"Informe o código numérico de 6 dígitos enviado por e-mail."`
      - `novaSenha.length >= 6` -> `"A nova senha deve ter no mínimo 6 caracteres."`
      - `novaSenha === confirmarSenha` -> `"As senhas não conferem. Verifique e tente novamente."`
    - Submit calls `POST ${API_BASE}/api/auth/redefinir-senha` with `{ email: emailLimpo, codigo: codigoLimpo, novaSenha }`.
    - States: `loading` (`"Redefinindo senha..."`), `error` (`role="alert"` displaying `errJson.message || errJson.mensagem || Object.values(errJson.validationErrors || {})[0] || 'Código inválido ou expirado.'`).
    - Secondary action `"Reenviar código"` calls `POST ${API_BASE}/api/auth/esqueci-senha`.
    - On `200 OK`: transitions `step` -> `'success'`.
  - **Step `'success'`**:
    - Displays `CheckCircle`, `"Senha redefinida com sucesso!"`, and button `"Ir para o Login"` (calls `onSuccessLogin?.(emailLimpo)` in modal mode, or `navigate('/login?email=' + encodeURIComponent(emailLimpo))` in page mode).
- Route wrapper screens (can be separate files or exported as pure components from `PasswordRecoveryFlow.jsx`, keeping no non-component exports in `.jsx`):
  - `EsqueciSenhaScreen`: reads `?email=` via `useSearchParams()`, renders centered Florável card with link back to `/login` + `<PasswordRecoveryFlow initialStep="request" ... />`.
  - `RedefinirSenhaScreen`: reads `?email=` and `?codigo=` via `useSearchParams()`, renders centered Florável card with `<PasswordRecoveryFlow initialStep="reset" ... />`.

#### C. `apps/landing/src/Screen/Auth/EmailConfirmationFlow.jsx`
- Component `<EmailConfirmationFlow initialEmail="" initialCode="" nome="" pendingAuthCredentials={null} fallbackSessionData={null} isModal={false} onClose onEnterMaeApp />`:
  - **Step `'verify'`**:
    - Displays target email (editable input `#confirm-email` if `initialEmail` wasn't locked by post-cadastro, or read-only/editable prefilled input), plus `#confirm-codigo` (`inputMode="numeric"`, `maxLength={6}`, digits-only).
    - Client validation: email required + `/^\d{6}$/.test(codigo)` before `fetch`.
    - Submit button `"Confirmar e-mail"` -> `POST ${API_BASE}/api/auth/confirmar-email` with `{ email, codigo }`.
    - Secondary button `"Reenviar código"` -> `POST ${API_BASE}/api/auth/reenviar-codigo` with `{ email }`, showing loading (`"Reenviando..."`), info banner (`data.mensagem`), or `role="alert"` error.
    - Error handling: `role="alert"` renders `errJson.message || errJson.mensagem || 'Código inválido ou expirado.'`.
    - On `200 OK` (`verificado: true` or `res.ok`):
      - If `pendingAuthCredentials?.senha` is present (post-cadastro flow), automatically executes `POST ${API_BASE}/api/auth/login` with `{ email, senha: pendingAuthCredentials.senha }` to obtain `LoginResponseDTO` (with `tokenSessao` JWT). Calls `onEnterMaeApp?.(loginData, /* autoSaveOnly */ true)` or stores `sessionToUse = loginData`, falling back to `fallbackSessionData` if login fails.
      - Transitions `step` -> `'welcome'`.
  - **Step `'welcome'`**:
    - Renders celebratory Florável card (`CheckCircle` / `Sparkles`): `"E-mail confirmado! Boas-vindas à Florável"` + personalized greeting (`nome`) + note that a welcome email was sent.
    - Primary CTA:
      - If `sessionToUse` exists (post-cadastro): `"Entrar no Espaço Florável"` -> saves session via `salvarSessaoLocal(sessionToUse, 'mae')` and calls `navigateToApp('mae', sessionToUse)`.
      - If standalone `/confirmar-email` without active session: `"Ir para o Login"` -> navigates to `/login?email=${encodeURIComponent(email)}`.
- `ConfirmarEmailScreen`: reads `?email=` and `?codigo=` from `useSearchParams()`, renders centered page layout wrapping `<EmailConfirmationFlow />`.

#### D. `apps/landing/src/Screen/Auth/LoginScreen.jsx` Changes
1. **Remove hardcoded credential literal (`lines 19-21`)**:
   ```js
   const GOOGLE_CLIENT_ID_PUBLIC = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
   ```
2. **Fix `salvarSessaoLocal` & role resolution (`lines 130-139, 170-171, 252-254`)**:
   ```js
   const SESSAO_STORAGE_KEYS = {
     mae: 'floravel_mae_sessao',
     terapeuta: 'floravel_psi_sessao',
     rh: 'floravel_rh_sessao',
   };

   function resolverPapelDestino(tipoPerfil, papelFallback) {
     const norm = String(tipoPerfil || '').toUpperCase();
     if (norm === 'RH') return 'rh';
     if (norm === 'PSICOLOGO' || norm === 'TERAPEUTA') return 'terapeuta';
     if (norm === 'MAE') return 'mae';
     return papelFallback;
   }

   const salvarSessaoLocal = (authData, papelAtual) => {
     const chave = SESSAO_STORAGE_KEYS[papelAtual] || 'floravel_mae_sessao';
     localStorage.setItem(chave, JSON.stringify(authData));
     if (authData?.tokenSessao) {
       localStorage.setItem('floravel_jwt', authData.tokenSessao);
     }
     if (authData?.codigoPublico) {
       localStorage.setItem('floravel_codigo_publico', authData.codigoPublico);
     }
   };
   ```
   - Both `handleLoginSubmit` and Google OAuth callback compute `const papelDestino = resolverPapelDestino(authData?.tipoPerfil, papel);`, call `salvarSessaoLocal(authData, papelDestino);` and `navigateToApp(papelDestino, authData);`.
   - Initialize `email` from `searchParams.get('email') || ''` so redirects from `/redefinir-senha` and `/confirmar-email` prefill the login form.
3. **Replace stub `showForgotModal` (`lines 78-80, 284-287, 1040-1103`)**:
   - Remove `forgotSent`, `forgotEmail`, and stub `handleForgotSubmit`.
   - Render `<PasswordRecoveryFlow isModal initialEmail={email} onClose={() => setShowForgotModal(false)} onSuccessLogin={(recoveredEmail) => { if (recoveredEmail) setEmail(recoveredEmail); setShowForgotModal(false); }} />` inside the modal overlay.
   - Add a subtle link inside the modal footer or login screen to `/esqueci-senha` if desired, while keeping modal UX seamless.
4. **Post-cadastro confirmation modal/panel (`lines 455-461`)**:
   - Add state `pendingConfirmation` (`null | { email, nome, senha, maeCriada }`).
   - On `POST /api/maes` `201 Created`:
     ```js
     const maeCriada = await res.json();
     setCarregandoCadastro(false);
     setPendingConfirmation({
       email: maeCriada.email || formCadastro.email.trim().toLowerCase(),
       nome: maeCriada.nome || formCadastro.nome.trim(),
       senha: formCadastro.senha,
       maeCriada,
     });
     ```
   - When `pendingConfirmation` is non-null, render modal overlay containing `<EmailConfirmationFlow isModal initialEmail={pendingConfirmation.email} nome={pendingConfirmation.nome} pendingAuthCredentials={{ email: pendingConfirmation.email, senha: pendingConfirmation.senha }} fallbackSessionData={pendingConfirmation.maeCriada} onClose={() => setPendingConfirmation(null)} onEnterMaeApp={(sessionData) => { salvarSessaoLocal(sessionData, 'mae'); navigateToApp('mae', sessionData); }} />`.

---

### 4.3 Exact Automated Vitest Test Plan (`apps/landing`)

All test files mock `../../utils/appLinks` via `vi.mock('../../utils/appLinks', async (importOriginal) => { const actual = await importOriginal(); return { ...actual, getApiBase: () => 'http://localhost:8080', navigateToApp: vi.fn() }; })` (avoiding ESM `vi.spyOn` issues and `jsdom` navigation errors) and stub `globalThis.fetch = vi.fn(...)`.

| Test File | Test Cases (Success & Error States) |
|---|---|
| `src/Screen/Auth/__tests__/PasswordRecoveryFlow.test.jsx` | 1. **Request success**: submits email -> asserts loading disabled state -> `POST /api/auth/esqueci-senha` `{ email }` -> transitions to 6-digit code + new password step.<br>2. **Request error**: `500`/`400` response renders `role="alert"` and stays on Step 1; network failure renders connection error.<br>3. **Reset client validation**: blocks non-6-digit code, password `< 6` chars, and mismatched confirmation password without calling `fetch`.<br>4. **Reset success**: submits 6-digit code + matching passwords -> `POST /api/auth/redefinir-senha` `{ email, codigo, novaSenha }` -> renders success message -> `"Ir para o Login"` invokes `onSuccessLogin(email)`.<br>5. **Reset expired/invalid code (`400`)**: server returns `CodigoExpiradoException` / `CodigoInvalidoException` JSON (`{ status: 400, message: '...' }`) -> displays error alert and stays on reset form.<br>6. **Resend code**: clicking `"Reenviar código"` triggers `POST /api/auth/esqueci-senha`. |
| `src/Screen/Auth/__tests__/EmailConfirmationFlow.test.jsx` | 1. **Client validation**: rejects `< 6` digit code before calling `fetch`.<br>2. **Confirm success + welcome**: `POST /api/auth/confirmar-email` `{ email, codigo }` returns `200 { verificado: true }` -> renders welcome confirmation screen.<br>3. **Confirm invalid/expired code (`400`)**: renders `role="alert"` with backend `message`.<br>4. **Resend code success & error**: `POST /api/auth/reenviar-codigo` `{ email }` -> renders confirmation banner on `200`, or `role="alert"` on error. |
| `src/Screen/Auth/__tests__/LoginScreen.test.jsx` | 1. **RH session & redirect**: selecting `Gestão RH` + login `200` (`tipoPerfil: 'RH'`, `tokenSessao: 'jwt-rh'`) -> writes `'floravel_rh_sessao'` (NOT `'floravel_mae_sessao'`), `'floravel_jwt'`, and calls `navigateToApp('rh', ...)`.<br>2. **Server role resolution**: login returning `tipoPerfil: 'RH'` routes to `'floravel_rh_sessao'` and `navigateToApp('rh', ...)` even from default tab.<br>3. **Forgot modal integration**: clicking `"Esqueceu a senha?"` opens recovery modal prefilled with email, completes reset, closes modal and updates login email.<br>4. **Post-cadastro confirmation & auto-login**: submitting valid mãe registration (`POST /api/maes` `201`) opens email confirmation modal instead of redirecting immediately -> entering 6-digit code calls `POST /api/auth/confirmar-email` + `POST /api/auth/login` -> saves `'floravel_mae_sessao'` + `'floravel_jwt'` -> clicking `"Entrar no Espaço Florável"` calls `navigateToApp('mae', loginData)`. |
| `src/__tests__/AppRoutes.test.jsx` | 1. Renders `<AppRoutes />` in `<MemoryRouter initialEntries={['/esqueci-senha?email=ana@test.com']}>`, `['/redefinir-senha?email=ana@test.com&codigo=123456']`, and `['/confirmar-email?email=ana@test.com']`, asserting each route renders its dedicated screen instead of redirecting to `/`. |

---

## 5. Verification Method

Once M1 implementation is applied in `Froravel-Front`:
1. **Install dependencies**: Run `npm install` in `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front`.
2. **Run all frontend unit/integration tests**:
   ```powershell
   npm run test:all
   ```
   Expected: `@floravel/landing` Vitest suite passes with 0 failures and 0 errors, covering all cases in §4.3.
3. **Run full monorepo build**:
   ```powershell
   npm run build:all
   ```
   Expected: All 4 workspaces (`@floravel/landing`, `@floravel/mae`, `@floravel/psicologo`, `@floravel/rh`) build cleanly with exit code `0`.
4. **Run lint check**:
   ```powershell
   npm run lint:all
   ```
   Expected: 0 lint errors across all workspaces.
5. **Hardcoded secrets check**:
   - Inspect `apps/landing/src/Screen/Auth/LoginScreen.jsx:19-21` to confirm `GOOGLE_CLIENT_ID_PUBLIC` defaults to `''` and no client secrets, passwords, or OAuth client ID literals remain in source.
6. **Invalidation conditions**:
   - If `apps/landing/vite.config.js` is modified instead of creating `vitest.config.js`, re-verify `npm run build:all` and Vercel production bundle integrity.
   - If backend `AuthService.confirmarEmail` or `redefinirSenha` changes DTO field names (`email`, `codigo`, `novaSenha`, `message`), update `PasswordRecoveryFlow.jsx` / `EmailConfirmationFlow.jsx` and corresponding test assertions.
