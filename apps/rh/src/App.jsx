import { useState } from "react";
import { ShieldAlert, LogOut } from "lucide-react";
import DashboardRh from "./DashboardRh";
import {
  hidratarSessaoDoHash,
  getRhAuthState,
  logoutAndRedirect,
} from "./utils/rhSession";

const DEMO_RH_SESSION = {
  usuarioId: "demo-rh",
  perfilId: "demo-rh",
  nome: "Gestão RH TechMães (Demo)",
  email: "rh@techmaes.com.br",
  tipoPerfil: "RH",
  isDemo: true,
};

function App() {
  const [authState] = useState(() => {
    hidratarSessaoDoHash();
    return getRhAuthState();
  });

  if (authState.isWrongRole) {
    return (
      <main className="min-h-screen bg-[#FCF7F9] flex items-center justify-center p-6 font-sans text-stone-800 antialiased">
        <div
          role="alert"
          data-testid="rh-auth-guard"
          className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200 shadow-sm text-center space-y-5"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FDE8E8] text-[#9B1C1C] mx-auto flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h1
              className="text-xl font-bold text-[#294D33]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Acesso restrito ao perfil Gestão RH
            </h1>
            <p className="text-sm text-[#516B55] leading-relaxed">
              A sessão atual pertence a outro perfil da plataforma. Entre com uma conta corporativa RH para continuar.
            </p>
          </div>
          <button
            type="button"
            onClick={() => logoutAndRedirect()}
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-full bg-[#294D33] hover:bg-[#1e3a27] text-white text-sm font-bold transition shadow-xs cursor-pointer"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span>Sair e entrar com conta RH</span>
          </button>
        </div>
      </main>
    );
  }

  const isDemoMode = !authState.isAuthenticated || !authState.token;

  return (
    <DashboardRh
      session={isDemoMode ? DEMO_RH_SESSION : authState.session}
      isDemoMode={isDemoMode}
      onLogout={() => logoutAndRedirect()}
    />
  );
}

export default App;
