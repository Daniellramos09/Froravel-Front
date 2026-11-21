// Estrutura do Portal do Terapeuta, no mesmo padrão do Espaço da Mãe:
// menu lateral branco, cabeçalho com título da tela, área de conteúdo rosada e barra inferior no celular.
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, ChevronLeft, LogOut, Menu, Volume2, Sun, Eye } from 'lucide-react';
import Sidebar from './Sidebar';
import { menuItems } from './menuItems';
import InstallAppButton from '../Pwa/InstallAppButton';
import { usePsiAccessibility } from '../Accessibility/PsiAccessibilityContext';

const TITULOS = {
  '/painel': 'Visão geral',
  '/agenda': 'Agenda e sessões',
  '/maes': 'Mães atendidas',
  '/sala': 'Sala de acolhimento',
  '/comunidade': 'Comunidade',
  '/perfil': 'Perfil & Selos de Credibilidade',
  '/acessibilidade': 'Acessibilidade Clínica',
};

const NOTIFICACOES_INICIAIS = [
  {
    id: 1,
    tipo: 'agendamento',
    title: 'Nova mãe agendada',
    desc: 'Mariana Silva agendou escuta individual para Quinta-feira às 14:30.',
    time: 'Agora mesmo',
    lida: false,
    destino: '/agenda',
  },
  {
    id: 2,
    tipo: 'roda',
    title: 'Roda de hoje às 18:00',
    desc: '"Os primeiros meses" tem 3 de 5 vagas preenchidas.',
    time: 'Há 20 min',
    lida: false,
    destino: '/sala',
  },
  {
    id: 3,
    tipo: 'agendamento',
    title: 'Nova mãe na sua lista',
    desc: 'Juliana Costa agendou uma escuta individual no sábado às 10:00.',
    time: 'Há 2 horas',
    lida: true,
    destino: '/maes',
  },
  {
    id: 4,
    tipo: 'eca',
    title: 'Sinalização ECA & Consentimento',
    desc: 'Camila Ramos (16 anos) possui autorização ativa do responsável legal (ECA Art. 17).',
    time: 'Ontem',
    lida: true,
    destino: '/maes',
  },
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
  const [notificacoes, setNotificacoes] = useState(() => {
    try {
      const saved = localStorage.getItem('floravel_psi_notificacoes');
      return saved ? JSON.parse(saved) : NOTIFICACOES_INICIAIS;
    } catch {
      return NOTIFICACOES_INICIAIS;
    }
  });
  const unreadCount = notificacoes.filter((n) => !n.lida).length;
  const notifRef = useRef(null);
  const contentRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isLocal =
    typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const landingUrl =
    import.meta.env.VITE_LANDING_URL || (isLocal ? 'http://localhost:5173' : 'https://froravel-front.vercel.app');
  const {
    psiProfile,
    cycleFontSize,
    colorFilter,
    setColorFilter,
    isSpeaking,
    toggleClinicalVoiceSummary,
    getFontSizeClass,
    getFilterClass,
    reducedMotion,
    expandedSpacing,
  } = usePsiAccessibility();

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

  // Persiste notificações e escuta novos agendamentos enviados em tempo real
  useEffect(() => {
    try {
      localStorage.setItem('floravel_psi_notificacoes', JSON.stringify(notificacoes));
    } catch {}
  }, [notificacoes]);

  useEffect(() => {
    let bc = null;
    try {
      bc = new BroadcastChannel('floravel_notificacoes_psi');
      bc.onmessage = (ev) => {
        if (ev.data?.type === 'NOVO_AGENDAMENTO' && ev.data?.notif) {
          setNotificacoes((prev) => [{ ...ev.data.notif, id: Date.now(), lida: false }, ...prev]);
        }
      };
    } catch {}
    return () => {
      if (bc) bc.close();
    };
  }, []);

  const abrirNotificacoes = () => {
    setIsNotifOpen((v) => !v);
  };

  const marcarTodasComoLidas = () => {
    setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })));
  };

  const handleCliqueNotificacao = (n) => {
    setNotificacoes((prev) =>
      prev.map((item) => (item.id === n.id ? { ...item, lida: true } : item))
    );
    setIsNotifOpen(false);
    if (n.destino) navigate(n.destino);
  };

  const podeVoltar = pathname !== '/painel';

  return (
    <div
      className={`flex h-dvh bg-[#FCF7F9] font-dmsans text-[#2B2829] relative overflow-hidden ${getFilterClass()} ${getFontSizeClass()} ${
        reducedMotion ? 'reduce-motion' : ''
      } ${expandedSpacing ? 'spacing-expanded' : ''}`}
    >
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

          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            <InstallAppButton className="p-2 sm:px-3.5 bg-[#294D33] text-white hover:bg-[#1f3c27]" />

            {/* BARRA RÁPIDA DE ACESSIBILIDADE CLÍNICA PARA A PSICÓLOGA */}
            <div className="hidden md:flex items-center gap-1 bg-[#FCF7F9] border border-[#E4DAD5] rounded-full px-2 py-1">
              <button
                type="button"
                onClick={toggleClinicalVoiceSummary}
                className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                  isSpeaking
                    ? 'bg-red-600 text-white'
                    : 'text-[#294D33] hover:bg-[#EBF3ED]'
                }`}
                title="Ouvir resumo da agenda por voz (descanso ocular entre sessões)"
              >
                <Volume2 size={14} />
                <span>{isSpeaking ? 'Parar' : 'Ouvir Agenda'}</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setColorFilter(colorFilter === 'sepia_clinico' ? 'none' : 'sepia_clinico')
                }
                className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                  colorFilter === 'sepia_clinico'
                    ? 'bg-[#294D33] text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
                title="Modo Consultório (Filtro de Luz Quente anti-fadiga ocular)"
              >
                <Sun size={13} />
                <span>Consultório</span>
              </button>

              <button
                type="button"
                onClick={() => cycleFontSize(-1)}
                className="px-2 py-1 rounded-full text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
                title="Diminuir fonte"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => cycleFontSize(1)}
                className="px-2 py-1 rounded-full text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
                title="Aumentar fonte"
              >
                A+
              </button>

              <button
                type="button"
                onClick={() => navigate('/acessibilidade')}
                className="p-1.5 rounded-full text-[#294D33] hover:bg-[#EBF3ED] cursor-pointer"
                title="Abrir painel de Acessibilidade Clínica"
              >
                <Eye size={14} />
              </button>
            </div>

            {/* NOTIFICAÇÕES */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={abrirNotificacoes}
                className="relative p-2 sm:p-2.5 rounded-2xl text-stone-600 hover:bg-[#FCF7F9] hover:text-[#294D33] transition cursor-pointer active:scale-95"
                title="Notificações de agendamentos e acolhimentos"
                aria-label="Notificações"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-[#294D33] text-white text-[10px] font-bold rounded-full ring-2 ring-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {isNotifOpen && (
                <div className="fixed left-3 right-3 sm:left-auto sm:right-0 top-18 sm:top-full mt-2 sm:w-96 max-w-sm sm:max-w-none mx-auto sm:mx-0 bg-white rounded-3xl shadow-2xl border border-[#EFE9EB] overflow-hidden animate-fadeIn z-50">
                  <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-[#FCF7F9]">
                    <div>
                      <h4 className="font-fraunces font-bold text-[#1F3A27] text-[16px]">Notificações</h4>
                      <p className="text-[11px] text-stone-500">
                        {unreadCount > 0 ? `${unreadCount} não lida(s)` : 'Tudo atualizado'}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={marcarTodasComoLidas}
                        className="text-[11px] text-[#294D33] font-bold hover:underline cursor-pointer"
                      >
                        Marcar como lidas
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-stone-50">
                    {notificacoes.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => handleCliqueNotificacao(n)}
                        className={`w-full text-left p-4 hover:bg-[#FCF7F9] transition cursor-pointer flex items-start gap-3 ${
                          !n.lida ? 'bg-[#EBF3ED]/30' : ''
                        }`}
                      >
                        <span
                          className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                            !n.lida ? 'bg-[#294D33]' : 'bg-stone-300'
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[13.5px] font-bold text-[#1F3A27] truncate">{n.title}</p>
                            <span className="text-[10px] text-stone-400 shrink-0">{n.time}</span>
                          </div>
                          <p className="text-[12.5px] text-stone-600 mt-0.5 leading-snug">{n.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AVATAR (CLICÁVEL PARA ABRIR PERFIL & MEDALHAS) */}
            <button
              type="button"
              onClick={() => navigate('/perfil')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-[#F4DDE5] text-[#294D33] flex items-center justify-center font-bold text-[13px] sm:text-[14px] border border-[#E8A9BB] cursor-pointer hover:ring-2 hover:ring-[#294D33] transition"
              title={`${psiProfile?.nome || 'Dra. Helena Souza'} — Abrir Perfil & Medalhas`}
            >
              {psiProfile?.fotoUrl ? (
                <img src={psiProfile.fotoUrl} alt={psiProfile.nome} className="w-full h-full object-cover" />
              ) : (
                'HS'
              )}
            </button>
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
          className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E4DAD5] px-1 py-1.5 flex items-center justify-around overflow-x-auto scrollbar-none"
          aria-label="Navegação principal mobile"
        >
          {menuItems.map(({ path, short, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-1.5 min-w-[48px] rounded-xl text-[10px] sm:text-[11px] font-medium transition cursor-pointer shrink-0 ${
                  isActive ? 'text-[#1F3A27] font-bold bg-[#F4DDE5]/70 shadow-2xs' : 'text-[#6B6365] hover:text-[#1F3A27]'
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              <span className="mt-0.5 leading-tight truncate">{short}</span>
            </NavLink>
          ))}
        </nav>
      </main>
    </div>
  );
}
