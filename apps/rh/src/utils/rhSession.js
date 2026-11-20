import { APP_LINKS } from './appLinks';

export const SESSION_KEY = 'floravel_rh_sessao';
export const JWT_KEY = 'floravel_jwt';
export const PUBLIC_CODE_KEY = 'floravel_codigo_publico';

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
      if (authData.tokenSessao) localStorage.setItem(JWT_KEY, authData.tokenSessao);
      if (authData.codigoPublico) localStorage.setItem(PUBLIC_CODE_KEY, authData.codigoPublico);
    }
  } catch {
    /* ignore malformed #auth hash */
  }
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
}

export function getRhAuthState() {
  if (typeof window === 'undefined') {
    return { token: null, session: null, isAuthenticated: false, isWrongRole: false };
  }
  const token = localStorage.getItem(JWT_KEY);
  let session;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    session = raw ? JSON.parse(raw) : null;
  } catch {
    session = null;
  }
  const role = session?.tipoPerfil ? String(session.tipoPerfil).toUpperCase() : '';
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
