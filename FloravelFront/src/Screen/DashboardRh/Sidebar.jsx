// src/Screen/DashboardRh/Sidebar.jsx
import React from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  X,
  HeartHandshake,
} from "lucide-react";

export default function Sidebar({
  activeMenu = "inicio",
  setActiveMenu,
  mobileMenuOpen = false,
  setMobileMenuOpen,
}) {
  const menuItems = [
    { id: "inicio", label: "Página inicial", icon: LayoutDashboard },
    { id: "licencas", label: "Gestão de Licenças", icon: Users },
    { id: "relatorios", label: "Relatórios de Saúde", icon: FileText },
    { id: "faturamento", label: "Faturamento", icon: CreditCard },
    { id: "config", label: "Configurações", icon: Settings },
  ];

  const handleNavClick = (id) => {
    if (setActiveMenu) setActiveMenu(id);
    if (setMobileMenuOpen) setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Overlay escuro de fundo no Mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Menu Lateral Fixo / Drawer Responsivo */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-white border-r border-stone-100 flex flex-col justify-between p-6 z-50 transition-transform duration-300 ease-in-out shrink-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full justify-between">
          <div>
            {/* Logo da Marca Florável Corporate */}
            <div className="flex items-center justify-between pb-8">
              <div className="flex items-center gap-3">
                <img
                  src="/img/fotoheader/logo.png"
                  alt="Logo Florável"
                  className="w-10 h-10 object-contain drop-shadow-2xs"
                />
                <div>
                  <h1
                    className="text-lg font-bold tracking-tight text-[#294D33] leading-tight"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    florável
                  </h1>
                  <span className="text-[11px] tracking-wider uppercase font-semibold text-stone-400 block -mt-0.5">
                    corporate
                  </span>
                </div>
              </div>

              {/* Botão de Fechar no Mobile */}
              <button
                className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 transition-colors focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2 outline-none"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Fechar menu"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Navegação Semântica com Lista <ul> e <li> */}
            <nav aria-label="Menu Principal do Corporate">
              <ul className="space-y-1.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.id;

                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => handleNavClick(item.id)}
                        aria-current={isActive ? "page" : undefined}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out relative outline-none cursor-pointer group text-sm font-medium text-left ${
                          isActive
                            ? "bg-[#F4DDE5] text-[#294D33] font-semibold before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-2/3 before:bg-[#294D33] before:rounded-r-md"
                            : "text-[#516B55] hover:bg-[#F4DDE5]/40 hover:translate-x-1 group-hover:text-[#294D33]"
                        } focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2`}
                      >
                        <Icon
                          className={`w-4 h-4 transition-colors shrink-0 ${
                            isActive
                              ? "text-[#294D33]"
                              : "text-[#516B55] group-hover:text-[#294D33]"
                          }`}
                          aria-hidden="true"
                        />
                        <span className="truncate">{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Área Inferior da Sidebar */}
          <div className="pt-6 space-y-4">
            {/* Card "Ofereça apoio" */}
            <div className="bg-[#FCF7F9] border border-[#E8A9BB]/40 rounded-2xl p-4 transition-all hover:bg-[#F4DDE5]/30 group">
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#294D33] mb-2.5 shadow-2xs">
                <HeartHandshake className="w-4 h-4" aria-hidden="true" />
              </div>
              <h4 
                className="text-xs font-bold text-[#294D33] mb-1"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Ofereça apoio
              </h4>
              <p className="text-[11px] text-[#516B55] leading-relaxed mb-2.5">
                Cuidando de quem faz a sua equipe acontecer. Conheça novos planos corporativos.
              </p>
              <a
                href="#agendar"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#294D33] hover:underline transition-all group-hover:translate-x-1 focus-visible:ring-2 focus-visible:ring-[#294D33] rounded"
              >
                <span>Conhecer planos extras</span>
                <span className="text-xs leading-none" aria-hidden="true">→</span>
              </a>
            </div>

            {/* Perfil do Gestor de RH: Botão Interativo com foco acessível */}
            <button
              type="button"
              aria-label="Opções do perfil de usuário: TechCorp RH"
              onClick={() => {
                if (setActiveMenu) setActiveMenu("config");
              }}
              className="w-full pt-3 pb-1 px-2 border-t border-stone-100 flex items-center justify-between hover:bg-stone-50 rounded-xl transition-colors cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div 
                  className="w-8 h-8 rounded-full bg-[#F4DDE5] text-[#294D33] font-bold text-xs flex items-center justify-center border border-[#E8A9BB]/40 shrink-0"
                  aria-hidden="true"
                >
                  TC
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                    <span className="text-xs font-bold text-stone-800 truncate">
                      TechCorp RH
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 block truncate">
                    admin@techcorp.com.br
                  </span>
                </div>
              </div>

              <div
                title="Configurações e Logout"
                className="p-1 text-stone-400 hover:text-stone-700 transition-colors shrink-0"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
              </div>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

