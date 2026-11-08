// Estrutura do Portal do Terapeuta, no mesmo padrão do Espaço da Mãe:
// menu lateral branco, cabeçalho com título da tela, área de conteúdo rosada e barra inferior no celular.
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, ChevronLeft, LogOut, Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { menuItems } from './menuItems';
import InstallAppButton from '../Pwa/InstallAppButton';

const TITULOS = {
  '/painel': 'Visão geral',
  '/agenda': 'Agenda e sessões',
  '/maes': 'Mães atendidas',
  '/sala': 'Sala de acolhimento',
};

const NOTIFICACOES = [
  { id: 1, title: 'Roda de hoje às 18:00', desc: '"Os primeiros meses" tem 3 de 5 vagas preenchidas.', time: 'Há 20 min' },
  { id: 2, title: 'Nova mãe na sua lista', desc: 'Juliana Costa agendou uma escuta individual no sábado.', time: 'Há 2 horas' },
  { id: 3, title: 'EPDS registrada', desc: 'Mariana Silva respondeu a triagem demonstrativa.', time: 'Ontem' },
];

// Modal de saída, igual ao do Espaço da Mãe
function LogoutModal({ isOpen, onConfirm, onCancel }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-titulo"
        className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center font-dmsans border border-stone-100 text-[#2B2829]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 rounded-full bg-[#F4DDE5] text-red-600 mx-auto flex items-center justify-center mb-4 shadow-xs">
          <LogOut size={28} />
        </div>
        <h3 id="logout-titulo" className="text-[24px] font-fraunces font-bold text-[#2B2829] mb-2">
          Sair da conta?
        </h3>
        <p className="text-[14px] text-stone-600 mb-8 font-medium">Você vai voltar para a página inicial da Florável.</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-full border border-stone-200 text-stone-700 font-bold hover:bg-stone-50 transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-6 py-3 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition shadow-sm cursor-pointer"
          >
            Sim, sair
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function DashboardLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const notifRef = useRef(null);
  const contentRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const landingUrl = import.meta.env.VITE_LANDING_URL || 'http://localhost:5173';

  // O conteúdo rola dentro da área principal: volta ao topo a cada troca de tela
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  // Fecha as notificações ao clicar fora
  useEffect(() => {
    const fechar = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotifOpen(false);
    };
    document.addEventListener('mousedown', fechar);
    return () => document.removeEventListener('mousedown', fechar);
  }, []);

  const abrirNotificacoes = () => {
    setIsNotifOpen((v) => !v);
    setHasUnread(false);
  };

  const podeVoltar = pathname !== '/painel';

  return (
    <div className="flex h-dvh bg-[#FCF7F9] font-dmsans text-[#2B2829] relative overflow-hidden">
      <LogoutModal
        isOpen={isLogoutOpen}
        onConfirm={() => (window.location.href = landingUrl)}
        onCancel={() => setIsLogoutOpen(false)}
      />

      {/* MENU LATERAL NO COMPUTADOR */}
      <aside className="hidden lg:flex w-76 bg-white border-r border-stone-100 shadow-sm flex-col justify-between py-6 px-4 z-30 flex-shrink-0">
        <Sidebar onLogout={() => setIsLogoutOpen(true)} />
      </aside>

      {/* GAVETA NO CELULAR */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs animate-fadeIn" onClick={() => setIsMenuOpen(false)} />
          <aside className="relative w-76 max-w-[85vw] bg-white h-full flex flex-col justify-between py-6 px-4 z-10 shadow-xl">
            <Sidebar
              onNavigate={() => setIsMenuOpen(false)}
              onClose={() => setIsMenuOpen(false)}
              onLogout={() => {
                setIsMenuOpen(false);
                setIsLogoutOpen(true);
              }}
            />
          </aside>
        </div>
      )}

      <main className="flex-1 min-w-0 flex flex-col h-dvh overflow-hidden bg-[#FCF7F9]">
        {/* CABEÇALHO SUPERIOR */}
        <header className="h-16 sm:h-20 flex-shrink-0 flex items-center justify-between gap-2 px-3 sm:px-8 bg-white border-b border-stone-100 shadow-xs z-20">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 border border-stone-200 rounded-xl text-[#294D33] hover:bg-[#FCF7F9] transition cursor-pointer active:scale-95"
              aria-label="Abrir menu de navegação"
            >
              <Menu size={20} />
            </button>
            <button
              type="button"
              className="hidden sm:inline-flex p-2 border border-stone-200 rounded-xl hover:bg-[#FCF7F9] hover:border-stone-300 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95"
              onClick={() => (window.history.state?.idx > 0 ? navigate(-1) : navigate('/painel'))}
              disabled={!podeVoltar}
              title="Voltar"
              aria-label="Voltar"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-bold text-[#294D33] text-[15px] sm:text-lg truncate">
              {TITULOS[pathname] || 'Portal do Terapeuta'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-4 flex-shrink-0">
            <InstallAppButton className="p-2.5 sm:px-4 bg-[#294D33] text-white hover:bg-[#1f3c27]" />

            {/* NOTIFICAÇÕES */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={abrirNotificacoes}
                className="relative p-2 sm:p-2.5 rounded-2xl text-stone-600 hover:bg-[#FCF7F9] hover:text-[#294D33] transition cursor-pointer active:scale-95"
                title="Notificações"
                aria-label="Notificações"
              >
                <Bell size={20} />
                {hasUnread && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#E8A9BB] rounded-full ring-2 ring-white" />
                )}
              </button>
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden animate-fadeIn z-50">
                  <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                    <h4 className="font-bold text-[#2B2829] text-[15px]">Notificações</h4>
                    <span className="text-[12px] text-[#294D33] font-bold">Tudo lido</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {NOTIFICACOES.map((n) => (
                      <div key={n.id} className="p-4 border-b border-stone-50 hover:bg-[#FCF7F9] transition">
                        <p className="text-[14px] font-bold text-[#2B2829]">{n.title}</p>
                        <p className="text-[13px] text-stone-600 mt-0.5">{n.desc}</p>
                        <span className="text-[11px] text-stone-400 mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AVATAR */}
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F4DDE5] text-[#294D33] flex items-center justify-center font-bold text-[13px] sm:text-[14px]"
              title="Dra. Helena Souza"
            >
              HS
            </div>
          </div>
        </header>

        {/* CONTEÚDO DA TELA */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto scroll-smooth p-4 sm:p-8 lg:px-12 xl:px-16 pb-24 lg:pb-20 bg-[#FCF7F9]"
        >
          <div className="w-full max-w-6xl mx-auto animate-fadeIn" key={pathname}>
            <Outlet />
          </div>
        </div>

        {/* BARRA INFERIOR NO CELULAR */}
        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E4DAD5] px-2 py-1.5 flex items-center justify-around"
          aria-label="Navegação principal mobile"
        >
          {menuItems.map(({ path, short, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[11px] font-medium transition cursor-pointer ${
                  isActive ? 'text-[#1F3A27] font-bold bg-[#F4DDE5]/60' : 'text-[#6B6365] hover:text-[#1F3A27]'
                }`
              }
            >
              <Icon size={19} />
              <span className="mt-0.5">{short}</span>
            </NavLink>
          ))}
        </nav>
      </main>
    </div>
  );
}
