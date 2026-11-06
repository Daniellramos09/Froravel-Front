import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HeroLanding from './Components/HeroLanding/HeroLanding';

import ScrollToTop from './Components/Layout/ScrollToTop';
import Layout from './Components/Layout/Layout';
import { AccessibilityProvider } from './Components/Accessibility/AccessibilityContext';

// Landing (Início, Sobre, Recursos e Contato numa página só)
import Landing from './Screen/Landing/Landing';

// Auth
import Cadastro from './Screen/Auth/CadastroScreen';
import Login from './Screen/Auth/LoginScreen';

function App() {
  return (
    <AccessibilityProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Landing page com Header e Footer gerais */}
          <Route path="/" element={<Layout><Landing /></Layout>} />

          {/* Telas sem header/footer (apenas formulário centralizado) */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          {/* Qualquer endereço inexistente volta para a landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AccessibilityProvider>
  );
}

export default App;
