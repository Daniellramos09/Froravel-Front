import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ScrollToTop from './Components/Layout/ScrollToTop';
import Layout from './Components/Layout/Layout';
import { AccessibilityProvider } from './Components/Accessibility/AccessibilityContext';

// Landing (Porta de entrada enxuta) e Páginas Redistribuídas
import Landing from './Screen/Landing/Landing';
import NovaLandingScreen from './Screen/NovaLanding/NovaLandingScreen';
import {
  ExplorarPage,
  SobrePage,
  ProfissionaisPage,
  EmpresasPage,
  ImpactoPage,
  ContatoPage,
} from './Screen/Landing/SubPages';

// Auth
import Cadastro from './Screen/Auth/CadastroScreen';
import Login from './Screen/Auth/LoginScreen';
import { EsqueciSenhaScreen, RedefinirSenhaScreen } from './Screen/Auth/PasswordRecoveryFlow';
import { ConfirmarEmailScreen } from './Screen/Auth/EmailConfirmationFlow';

export function AppRoutes() {
  return (
    <Routes>
      {/* Landing page enxuta (Hero, Contexto, 3 Pilares, Prévia/Psicólogos, Convite Final) */}
      <Route path="/" element={<Layout><Landing /></Layout>} />

      {/* Páginas dedicadas com todo o conteúdo redistribuído */}
      <Route path="/explorar" element={<Layout><ExplorarPage /></Layout>} />
      <Route path="/sobre" element={<Layout><SobrePage /></Layout>} />
      <Route path="/profissionais" element={<Layout><ProfissionaisPage /></Layout>} />
      <Route path="/empresas" element={<Layout><EmpresasPage /></Layout>} />
      <Route path="/impacto" element={<Layout><ImpactoPage /></Layout>} />
      <Route path="/contato" element={<Layout><ContatoPage /></Layout>} />

      {/* Nova Landing Page paralela inspirada no Orionix Framer */}
      <Route path="/nova" element={<NovaLandingScreen />} />

      {/* Telas sem header/footer (apenas formulário centralizado) */}
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/esqueci-senha" element={<EsqueciSenhaScreen />} />
      <Route path="/redefinir-senha" element={<RedefinirSenhaScreen />} />
      <Route path="/confirmar-email" element={<ConfirmarEmailScreen />} />

      {/* Qualquer endereço inexistente volta para a landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AccessibilityProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes />
      </BrowserRouter>
    </AccessibilityProvider>
  );
}

export default App;
