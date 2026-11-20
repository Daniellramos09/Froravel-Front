## 2026-11-20T01:03:44Z

You are `m1_iter2_explorer_2` (`teamwork_preview_explorer`) for **Milestone M1, Iteration 2** (Frontend R1 Remediation Planning).

- **Working Directory**: `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m1_iter2_explorer_2`
- **Parent Orchestrator ID**: `189625da-cab0-4c9f-875b-20770dbcc54b`
- **Mandatory Reading First**:
  1. `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\ORIGINAL_REQUEST.md`
  2. `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\PROJECT.md`
  3. `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m1_challenger_2\handoff.md`
  4. `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\m1_reviewer_2\handoff.md`

**Objective**:
Investigate `apps/landing/src/Screen/Auth/EmailConfirmationFlow.jsx`, `PasswordRecoveryFlow.jsx`, and `LoginScreen.jsx` to produce an exact fix strategy for ALL `m1_challenger_2` findings (plus `m1_reviewer_2` non-blocking polish items):
1. Remove tokenless `maeCriada` fallback (`fallbackSessionData`) when `/api/auth/login` fails after email confirmation — only consider a session valid if `sessionToUse?.tokenSessao` is present; otherwise show clear login-required notice, `"Ir para o Login"`, call `onClose?.()` + switch `LoginScreen` to login mode with prefilled email + `navigate('/login?email=...')`.
2. Add synchronous `useRef` in-flight double-submit guards on all form/resend handlers in `PasswordRecoveryFlow.jsx`, `EmailConfirmationFlow.jsx`, and `LoginScreen.jsx`.
3. Update `extrairMensagemErro` in both components so non-empty `errJson.validationErrors` takes priority over generic `errJson.message`.
4. Add `maxLength={72}` on password inputs in `PasswordRecoveryFlow.jsx` (matching backend BCrypt 72-byte cap), clear `infoMessage` when toggling back in `PasswordRecoveryFlow`, and add `role="dialog" aria-modal="true"` on the modals in `LoginScreen.jsx`.
5. Specify exact permanent Vitest regression tests for all 3 Challenger bugs.

Write `progress.md` and `handoff.md` in your working directory, then `send_message` to `189625da-cab0-4c9f-875b-20770dbcc54b`.
