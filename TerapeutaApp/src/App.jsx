import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AppLayout from './Components/Layout/AppLayout';
import DashboardLayout from './Components/Sidebar/DashboardLayout';
import Painel from './Screen/Painel';
import Agenda from './Screen/Agenda';
import MaesAtendidas from './Screen/MaesAtendidas';
import SalaAcolhimento from './Screen/SalaAcolhimento';
import Comunidade from './Screen/Comunidade';
import PerfilConfiguracoes from './Screen/PerfilConfiguracoes';
import AcessibilidadeClinica from './Screen/AcessibilidadeClinica';
import { PsiAccessibilityProvider } from './Components/Accessibility/PsiAccessibilityContext';

function hidratarSessaoDoHash() {
  if (typeof window === 'undefined') return;
  const hash = window.location.hash || '';
  if (!hash.startsWith('#auth=')) return;
  try {
    const b64 = decodeURIComponent(hash.slice('#auth='.length));
    const jsonStr = decodeURIComponent(escape(atob(b64)));
    const authData = JSON.parse(jsonStr);
    if (authData && typeof authData === 'object') {
      localStorage.setItem('floravel_psi_sessao', JSON.stringify(authData));
      if (authData.tokenSessao) localStorage.setItem('floravel_jwt', authData.tokenSessao);
      if (authData.codigoPublico) localStorage.setItem('floravel_codigo_publico', authData.codigoPublico);
    }
  } catch (_) {}
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
}

export default function App() {
  hidratarSessaoDoHash();
  return (
    <PsiAccessibilityProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route element={<DashboardLayout />}>
              <Route path="/painel" element={<Painel />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/maes" element={<MaesAtendidas />} />
              <Route path="/sala" element={<SalaAcolhimento />} />
              <Route path="/comunidade" element={<Comunidade />} />
              <Route path="/perfil" element={<PerfilConfiguracoes />} />
              <Route path="/acessibilidade" element={<AcessibilidadeClinica />} />
            </Route>

            <Route path="/" element={<Navigate to="/painel" replace />} />
            <Route path="*" element={<Navigate to="/painel" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PsiAccessibilityProvider>
  );
}