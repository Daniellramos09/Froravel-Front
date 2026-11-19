import DashboardRh from './DashboardRh'

function hidratarSessaoDoHash() {
  if (typeof window === 'undefined') return;
  const hash = window.location.hash || '';
  if (!hash.startsWith('#auth=')) return;
  try {
    const b64 = decodeURIComponent(hash.slice('#auth='.length));
    const jsonStr = decodeURIComponent(escape(atob(b64)));
    const authData = JSON.parse(jsonStr);
    if (authData && typeof authData === 'object') {
      localStorage.setItem('floravel_rh_sessao', JSON.stringify(authData));
      if (authData.tokenSessao) localStorage.setItem('floravel_jwt', authData.tokenSessao);
      if (authData.codigoPublico) localStorage.setItem('floravel_codigo_publico', authData.codigoPublico);
    }
  } catch (_) {}
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
}

function App() {
  hidratarSessaoDoHash();
  return <DashboardRh />
}

export default App
