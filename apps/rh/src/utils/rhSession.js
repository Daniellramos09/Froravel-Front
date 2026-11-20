import { APP_LINKS, getApiBase } from './appLinks';

export const SESSION_KEY = 'floravel_rh_sessao';
export const JWT_KEY = 'floravel_jwt';
export const PUBLIC_CODE_KEY = 'floravel_codigo_publico';

const DEMO_RH_SESSION = {
  usuarioId: 'demo-rh-1',
  perfilId: 'demo-rh-1',
  codigoPublico: 'FLR-RH01',
  nome: 'Gestão RH Corporativo',
  email: 'rh@techmaes.com.br',
  tipoPerfil: 'RH',
  tokenSessao: 'demo-cloud-rh-jwt',
};

function decodeBase64Utf8(b64) {
  const binary = atob(b64);
  if (typeof TextDecoder !== 'undefined') {
    const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }
  return decodeURIComponent(escape(binary));
}

export function hidratarSessaoDoHash() {
  if (typeof window === 'undefined') return;
  const hash = window.location.hash || '';
  if (!hash.startsWith('#auth=')) return;
  try {
    const b64 = decodeURIComponent(hash.slice('#auth='.length));
    const jsonStr = decodeBase64Utf8(b64);
    const authData = JSON.parse(jsonStr);
    if (authData && typeof authData === 'object') {
      localStorage.setItem(SESSION_KEY, JSON.stringify(authData));
      const normalizedToken =
        typeof authData.tokenSessao === 'string' ? authData.tokenSessao.trim() : '';
      if (normalizedToken) localStorage.setItem(JWT_KEY, normalizedToken);
      const normalizedCode =
        typeof authData.codigoPublico === 'string' ? authData.codigoPublico.trim() : '';
      if (normalizedCode) localStorage.setItem(PUBLIC_CODE_KEY, normalizedCode);
    }
  } catch {
    /* ignore malformed #auth hash */
  }
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
}

export function getStoredJwt() {
  if (typeof window === 'undefined') return null;
  const rawToken = localStorage.getItem(JWT_KEY);
  if (typeof rawToken === 'string' && rawToken.trim().length > 0) {
    return rawToken.trim();
  }
  if (!getApiBase()) {
    return DEMO_RH_SESSION.tokenSessao;
  }
  return null;
}

export function getRhAuthState() {
  if (typeof window === 'undefined') {
    return { token: null, session: null, isAuthenticated: false, isWrongRole: false };
  }
  const token = getStoredJwt();
  let session;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    session = raw ? JSON.parse(raw) : null;
  } catch {
    session = null;
  }
  if (!session && !getApiBase()) {
    session = DEMO_RH_SESSION;
  }
  const role = session?.tipoPerfil ? String(session.tipoPerfil).trim().toUpperCase() : '';
  return {
    token,
    session,
    isAuthenticated: Boolean(token),
    isWrongRole: Boolean(token && role && role !== 'RH'),
  };
}

export function clearRhSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(JWT_KEY);
  localStorage.removeItem(PUBLIC_CODE_KEY);
}

export function getLoginRedirectUrl() {
  return `${APP_LINKS.landing}/login?perfil=rh`;
}

export function logoutAndRedirect(redirectFn) {
  clearRhSession();
  const url = getLoginRedirectUrl();
  if (typeof redirectFn === 'function') {
    redirectFn(url);
  } else if (typeof window !== 'undefined') {
    window.location.href = url;
  }
}

export function getInitials(name) {
  if (!name || typeof name !== 'string') return 'RH';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'RH';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
