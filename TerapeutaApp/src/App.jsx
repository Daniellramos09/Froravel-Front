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

export default function App() {
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