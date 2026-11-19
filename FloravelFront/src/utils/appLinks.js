// src/utils/appLinks.js

/**
 * Mapeamento centralizado de rotas e aplicações integradas da plataforma Florável.
 * Permite navegação fluida entre a Landing Page, Painel da Mãe, Área do Terapeuta e Dashboard RH.
 */
const isLocalEnvironment =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export function getApiBase() {
  return import.meta.env.VITE_API_URL || (isLocalEnvironment ? 'http://localhost:8080' : '');
}

export const APP_LINKS = {
  // Landing Page principal
  landing:
    import.meta.env.VITE_LANDING_URL ||
    (isLocalEnvironment ? 'http://localhost:5173' : 'https://froravel-lading.vercel.app'),

  // Painel da Mãe (FloravelApp)
  mae:
    import.meta.env.VITE_MAE_APP_URL ||
    (isLocalEnvironment ? 'http://localhost:5174' : 'https://floravel.vercel.app'),

  // Painel do Terapeuta / Psicólogo (TerapeutaApp)
  terapeuta:
    import.meta.env.VITE_TERAPEUTA_APP_URL ||
    (isLocalEnvironment ? 'http://localhost:5175' : 'https://floravel-terapeuta.vercel.app'),

  // Dashboard RH Corporativo (DashboardRh)
  rh:
    import.meta.env.VITE_RH_APP_URL ||
    (isLocalEnvironment ? 'http://localhost:5176' : 'https://floravel-rh.vercel.app'),
};

/**
 * Redireciona o usuário para a interface solicitada, transferindo sessão/JWT
 * de forma segura via hash fragment (#auth=...) sem expor em logs de servidor.
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

