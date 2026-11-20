/**
 * @floravel/shared - appLinks.js
 * Mapeamento centralizado de rotas e aplicações integradas da plataforma Florável.
 * Conecta os 4 portais: Landing Page, Área da Mãe, Área do Psicólogo e Dashboard RH.
 */

const isLocalEnvironment =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export function getApiBase() {
  return (
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
    (isLocalEnvironment ? 'http://localhost:8080' : '')
  );
}

export const APP_LINKS = {
  // 1. Landing Page Institucional (apps/landing)
  landing:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_LANDING_URL) ||
    (isLocalEnvironment ? 'http://localhost:5173' : 'https://froravel-front.vercel.app'),

  // 2. Área da Mãe / PWA (apps/mae)
  mae:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_MAE_APP_URL) ||
    (isLocalEnvironment ? 'http://localhost:5174' : 'https://floravel-mae.vercel.app'),

  // 3. Portal do Terapeuta / Psicólogo (apps/psicologo)
  terapeuta:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_TERAPEUTA_APP_URL) ||
    (isLocalEnvironment ? 'http://localhost:5175' : 'https://psicologo-blue.vercel.app'),

  // 4. Dashboard RH Corporativo B2B (apps/rh)
  rh:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_RH_APP_URL) ||
    (isLocalEnvironment ? 'http://localhost:5176' : 'https://rh-lilac-two.vercel.app'),
};

/**
 * Redireciona o usuário para o portal desejado, transferindo sessão/JWT via hash fragment
 * @param {'landing' | 'mae' | 'terapeuta' | 'rh'} appKey
 * @param {object | null} sessionData
 */
export function navigateToApp(appKey, sessionData = null) {
  const baseTarget = APP_LINKS[appKey] || '/';
  let target = baseTarget;

  if (sessionData && typeof sessionData === 'object') {
    try {
      const json = JSON.stringify(sessionData);
      const b64 = btoa(unescape(encodeURIComponent(json)));
      target = `${baseTarget}#auth=${encodeURIComponent(b64)}`;
    } catch (_) {}
  }

  window.location.href = target;
}
