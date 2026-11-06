// src/utils/appLinks.js

/**
 * Mapeamento centralizado de rotas e aplicações integradas da plataforma Florável.
 * Permite navegação fluida entre a Landing Page, Painel da Mãe, Área do Terapeuta e Dashboard RH.
 */
export const APP_LINKS = {
  // Landing Page principal
  landing: import.meta.env.VITE_LANDING_URL || 'http://localhost:5173',

  // Painel da Mãe (FloravelApp)
  mae: import.meta.env.VITE_MAE_APP_URL || 'http://localhost:5174',

  // Painel do Terapeuta / Psicólogo (TerapeutaApp)
  terapeuta: import.meta.env.VITE_TERAPEUTA_APP_URL || 'http://localhost:5175',

  // Dashboard RH Corporativo (DashboardRh)
  rh: import.meta.env.VITE_RH_APP_URL || 'http://localhost:5176',
};

/**
 * Redireciona o usuário para a interface solicitada.
 * @param {'landing' | 'mae' | 'terapeuta' | 'rh'} appKey
 */
export function navigateToApp(appKey) {
  const target = APP_LINKS[appKey] || '/';
  if (target.startsWith('/')) {
    window.location.href = target;
  } else {
    window.location.href = target;
  }
}

