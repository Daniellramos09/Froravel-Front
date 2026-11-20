import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ScrollToTop from './Components/Layout/ScrollToTop';
import Layout from './Components/Layout/Layout';
import { AccessibilityProvider } from './Components/Accessibility/AccessibilityContext';

// Landing (Início, Sobre, Recursos e Contato numa página só)
import Landing from './Screen/Landing/Landing';
import NovaLandingScreen from './Screen/NovaLanding/NovaLandingScreen';

// Auth
import Cadastro from './Screen/Auth/CadastroScreen';
import Login from './Screen/Auth/LoginScreen';
import { EsqueciSenhaScreen, RedefinirSenhaScreen } from './Screen/Auth/PasswordRecoveryFlow';
import { ConfirmarEmailScreen } from './Screen/Auth/EmailConfirmationFlow';

export function AppRoutes() {
  return (
    <Routes>
      {/* Landing page com Header e Footer gerais */}
      <Route path="/" element={<Layout><Landing /></Layout>} />

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
