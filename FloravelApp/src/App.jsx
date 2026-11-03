// src/App.jsx
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Home, ClipboardList, HeartHandshake, MessageSquare, Calendar, Bell,
  LogOut, ArrowRight, ChevronLeft, BookOpen, Eye
} from 'lucide-react';

// IMPORTANDO AS TELAS
import DashboardScreen from './Screen/Dashboard/DashboardScreen';
import CheckInScreen from './Screen/Dashboard/CheckInScreen';
import AgendamentoScreen from './Screen/Services/AgendamentoScreen';
import RedeApoioScreen from './Screen/Services/ApoioScreen';
import ComunidadeScreen from './Screen/Community/ComunidadeScreen';
import PerfilScreen from './Screen/Profile/PerfilScreen';
import BibliotecaScreen from './Screen/Community/BibliotecaScreen';
import AjudaScreen from './Screen/Services/AjudaScreen';
import AcessibilidadeScreen from './Screen/Accessibility/AcessibilidadeScreen';

// CONTEXTO E BARRA DE ACESSIBILIDADE
import {
  AccessibilityProvider,
  useAccessibility,
} from './Components/Accessibility/AccessibilityContext';
import AccessibilityQuickBar from './Components/Accessibility/AccessibilityQuickBar';

// ITEM DE NAVEGAÇÃO COM FEEDBACK TÁTIL E HOVER VISÍVEL
const NavItem = ({ icon, label, active, onClick, badge }) => (
  <button
    type="button"
    onClick={onClick}
    className={`group relative w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-[16px] font-medium transition-all duration-200 font-dmsans cursor-pointer select-none active:scale-[0.98] ${
      active
        ? 'bg-[#F4DDE5] text-[#294D33] font-bold shadow-xs border border-[#E8A9BB]/40'
        : 'text-stone-700 hover:bg-[#F4DDE5]/45 hover:text-[#294D33]'
    }`}
  >
    {/* Barra vertical de destaque no hover e ativo */}
    <span
      className={`absolute left-0 top-2.5 bottom-2.5 w-1.5 rounded-r-full transition-all duration-300 ${
        active
          ? 'bg-[#294D33] scale-y-100 opacity-100'
          : 'bg-[#E8A9BB] scale-y-0 opacity-0 group-hover:scale-y-100 group-hover:opacity-100'
      }`}
    />

    <div className="flex items-center gap-3.5">
      <span
        className={`transition-all duration-200 ${
          active
            ? 'text-[#294D33] scale-105'
            : 'text-stone-500 group-hover:text-[#294D33] group-hover:scale-110'
        }`}
      >
        {icon}
      </span>
      <span className="transition-transform duration-200 group-hover:translate-x-1">
        {label}
      </span>
    </div>

    {badge && (
      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#294D33] text-white shadow-2xs group-hover:scale-105 transition-transform">
        {badge}
      </span>
    )}
  </button>
);

// MODAL DE LOGOUT COM PORTAL CENTRALIZADO
const LogoutModal = ({ isOpen, onConfirm, onCancel }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn"
      onClick={onCancel}
    >
      <div 
        className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center font-dmsans border border-stone-100 text-[#2B2829]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 rounded-full bg-[#F4DDE5] text-red-600 mx-auto flex items-center justify-center mb-4 shadow-xs">
          <LogOut size={28} />
        </div>
        <h3 className="text-[24px] font-fraunces font-bold text-[#2B2829] mb-2">Sair da conta?</h3>
        <p className="text-[14px] text-stone-600 mb-8 font-medium">Tem certeza de que deseja sair do seu espaço seguro?</p>
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
};

const POSSIBLE_NOTIFICATIONS = [
  { id: 1, title: "Lembrete de Autocuidado 🌸", desc: "Já bebeu água hoje? O seu corpo precisa de hidratação.", time: "Há 10 min", color: "text-[#E8A9BB]", bg: "bg-[#F4DDE5]" },
  { id: 2, title: "Novo artigo disponível 📚", desc: "Publicamos: 'Como lidar com o choro no fim da tarde'.", time: "Há 1 hora", color: "text-[#294D33]", bg: "bg-[#FCF7F9]" },
  { id: 3, title: "Roda de Conversa 👥", desc: "O grupo 'Mães de primeira viagem' tem 2 vagas abertas.", time: "Há 3 horas", color: "text-[#516B55]", bg: "bg-[#EBF3ED]" },
  { id: 4, title: "Mensagem da Rede 💌", desc: "Pedir ajuda é um ato de coragem.", time: "Ontem", color: "text-amber-600", bg: "bg-amber-50" }
];

function AppContent() {
  // 1. ESTADOS DE NAVEGAÇÃO
  const [activeTab, setActiveTab] = useState('home');
  const [history, setHistory] = useState(['home']);

  // 2. ESTADOS DOS MODAIS/MENUS
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [currentNotifs, setCurrentNotifs] = useState([]);
  const [hasUnread, setHasUnread] = useState(true);
  const notifRef = useRef(null);

  // 3. ESTADOS GLOBAIS DE CONSULTAS
  const [agendamentosGlobais, setAgendamentosGlobais] = useState([]);
  const [profEmFoco, setProfEmFoco] = useState(null);

  // 4. CONTEXTO DE ACESSIBILIDADE
  const {
    getFilterStyle,
    getFontSizeClass,
    reducedMotion,
    expandedSpacing,
  } = useAccessibility();

  // Fecha notificações ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setIsNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenNotifications = () => {
    if (!isNotifOpen) {
      const quantity = Math.floor(Math.random() * 3) + 1;
      const shuffled = [...POSSIBLE_NOTIFICATIONS].sort(() => 0.5 - Math.random());
      setCurrentNotifs(shuffled.slice(0, quantity));
      setHasUnread(false);
    }
    setIsNotifOpen(!isNotifOpen);
  };

  const handleTabChange = (newTab) => {
    if (newTab !== activeTab) {
      setHistory(prev => [...prev, newTab]);
      setActiveTab(newTab);
    }
  };

  const handleGoBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setActiveTab(newHistory[newHistory.length - 1]);
    }
  };

  const getScreenTitle = () => {
    switch (activeTab) {
      case 'home':
        return 'Painel Principal';
      case 'quiz':
        return 'Diário & Triagem';
      case 'network':
        return 'Rede de Apoio';
      case 'groups':
        return 'Rodas de Conversa';
      case 'booking':
        return 'Meus Agendamentos';
      case 'library':
        return 'Biblioteca & Conteúdos';
      case 'help':
        return 'Central de Ajuda';
      case 'perfil':
        return 'Meu Perfil';
      case 'accessibility':
        return 'Acessibilidade & Inclusão';
      default:
        return 'Florável';
    }
  };

  return (
    <div
      className={`flex h-screen bg-[#FCF7F9] font-dmsans text-[#2B2829] relative overflow-hidden transition-all duration-300 ${getFilterStyle()} ${getFontSizeClass()} ${
        reducedMotion ? 'reduce-motion' : ''
      } ${expandedSpacing ? 'spacing-expanded' : ''}`}
    >
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onConfirm={() => (window.location.href = '/')}
        onCancel={() => setIsLogoutModalOpen(false)}
      />

      {/* SIDEBAR LATERAL ESQUERDA COM FEEDBACK VISUAL PREMIUM */}
      <aside className="w-76 bg-white border-r border-stone-100 shadow-sm flex flex-col justify-between py-6 px-4 z-30 flex-shrink-0">
        <div className="overflow-y-auto pr-1">
          {/* LOGOTIPO */}
          <div 
            className="flex items-center gap-3 px-4 mb-7 cursor-pointer group"
            onClick={() => handleTabChange('home')}
          >
            <img 
              src="/LogoFin.png" 
              alt="Logo Florável" 
              className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-[28px] font-fraunces text-[#294D33] font-bold tracking-tight transition-opacity duration-300 group-hover:opacity-85">
              florável
            </span>
          </div>

          <nav className="space-y-1.5">
            <NavItem icon={<Home size={21} />} label="Início" active={activeTab === 'home'} onClick={() => handleTabChange('home')} />
            <NavItem icon={<ClipboardList size={21} />} label="Diário & Triagem" active={activeTab === 'quiz'} onClick={() => handleTabChange('quiz')} />
            <NavItem icon={<HeartHandshake size={21} />} label="Rede de Apoio" active={activeTab === 'network'} onClick={() => handleTabChange('network')} />
            <NavItem icon={<MessageSquare size={21} />} label="Rodas de Conversa" active={activeTab === 'groups'} onClick={() => handleTabChange('groups')} />
            <NavItem icon={<Calendar size={21} />} label="Meus Agendamentos" active={activeTab === 'booking'} onClick={() => handleTabChange('booking')} />
            <NavItem icon={<BookOpen size={21} />} label="Biblioteca & Conteúdos" active={activeTab === 'library'} onClick={() => handleTabChange('library')} />
            
            {/* ITEM: ACESSIBILIDADE */}
            <NavItem
              icon={<Eye size={21} />}
              label="Acessibilidade"
              active={activeTab === 'accessibility'}
              onClick={() => handleTabChange('accessibility')}
              badge="Novo"
            />
          </nav>

          {/* CARD DE ACOLHIMENTO RÁPIDO COM FEEDBACK DE HOVER ELEVADO */}
          <div
            className="mt-6 bg-[#F4DDE5] p-5 rounded-3xl mx-1 cursor-pointer transition-all duration-300 border border-[#E8A9BB]/30 hover:border-[#E8A9BB]/70 hover:shadow-md hover:-translate-y-1 group"
            onClick={() => handleTabChange('help')}
          >
            <div className="w-10 h-10 rounded-2xl bg-white/80 text-[#294D33] flex items-center justify-center mb-3 shadow-2xs group-hover:scale-110 transition-transform">
              <HeartHandshake className="text-[#294D33]" size={22} />
            </div>
            <p className="text-[15px] font-bold text-[#2B2829] mb-1">Você não está sozinha.</p>
            <p className="text-[13px] text-stone-700 mb-3.5 leading-relaxed font-medium">
              Estamos aqui para acolher você a qualquer hora.
            </p>
            <button className="text-[#294D33] text-[14px] font-bold flex items-center gap-1.5 group-hover:gap-2.5 transition-all cursor-pointer">
              <span>Preciso de ajuda</span>
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
          </div>
        </div>

        {/* RODAPÉ DO PERFIL COM HOVER E FEEDBACK VISÍVEL */}
        <div className="flex items-center justify-between px-2 pt-4 border-t border-stone-100">
          <div 
            className="flex items-center gap-3 p-1.5 -ml-1 rounded-2xl hover:bg-[#F4DDE5]/40 transition-all duration-200 cursor-pointer group flex-1 mr-2" 
            onClick={() => handleTabChange('perfil')}
          >
            <div className="w-11 h-11 rounded-full bg-[#F4DDE5] text-[#294D33] flex items-center justify-center font-bold text-[15px] border border-[#E8A9BB]/40 shadow-2xs group-hover:scale-105 transition-transform">
              MS
            </div>
            <div className="min-w-0">
              <p className="text-[15px] font-bold text-[#2B2829] group-hover:text-[#294D33] transition leading-tight truncate">
                Mariana Silva
              </p>
              <p className="text-[12px] text-stone-500 font-medium">Puerpério • Semana 7</p>
            </div>
          </div>
          <button 
            onClick={() => setIsLogoutModalOpen(true)} 
            className="p-2.5 text-stone-400 hover:text-red-600 hover:bg-red-50 hover:scale-110 active:scale-95 transition-all duration-200 rounded-xl cursor-pointer shrink-0"
            title="Sair da conta"
          >
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL (MAIN CONTENT) */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#FCF7F9]">

        {/* CABEÇALHO SUPERIOR */}
        <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-stone-100 shadow-xs z-20">
          <div className="flex items-center gap-3 text-[15px]">
            <button 
              className="p-2 border border-stone-200 rounded-xl hover:bg-[#FCF7F9] hover:border-stone-300 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95" 
              onClick={handleGoBack} 
              disabled={history.length <= 1}
              title="Voltar"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-bold text-[#294D33] text-base sm:text-lg">
              {getScreenTitle()}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* BARRA RÁPIDA DE ACESSIBILIDADE NO TOPO */}
            <AccessibilityQuickBar
              activeTab={activeTab}
              onOpenAccessibilityTab={() => handleTabChange('accessibility')}
            />

            {/* NOTIFICAÇÕES */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={handleOpenNotifications} 
                className="relative p-2.5 rounded-2xl text-stone-600 hover:bg-[#FCF7F9] hover:text-[#294D33] transition cursor-pointer active:scale-95"
                title="Notificações"
              >
                <Bell size={21} />
                {hasUnread && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#E8A9BB] rounded-full ring-2 ring-white"></span>
                )}
              </button>
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden animate-fadeIn z-50">
                  <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                    <h4 className="font-bold text-[#2B2829] text-[15px]">Notificações</h4>
                    <span className="text-[12px] text-[#294D33] font-bold">Tudo lido</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {currentNotifs.map(n => (
                      <div key={n.id} className="p-4 border-b border-stone-50 hover:bg-[#FCF7F9] cursor-pointer transition">
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
              className="w-10 h-10 rounded-full bg-[#F4DDE5] text-[#294D33] flex items-center justify-center font-bold text-[14px] cursor-pointer hover:ring-2 hover:ring-[#294D33]/30 hover:scale-105 active:scale-95 transition-all" 
              onClick={() => handleTabChange('perfil')}
              title="Meu Perfil"
            >
              MS
            </div>
          </div>
        </header>

        {/* ÁREA DINÂMICA DE CONTEÚDO */}
        <div className="flex-1 overflow-y-auto scroll-smooth p-6 sm:p-8 lg:px-12 xl:px-16 pb-20 bg-[#FCF7F9]">
          {activeTab === 'home' && (
            <DashboardScreen setActiveTab={handleTabChange} userName="Mariana" />
          )}
          {activeTab === 'quiz' && <CheckInScreen setActiveTab={handleTabChange} />}
          {activeTab === 'groups' && <ComunidadeScreen />}
          {activeTab === 'help' && <AjudaScreen />}
          {activeTab === 'perfil' && <PerfilScreen />}
          {activeTab === 'library' && <BibliotecaScreen />}

          {/* SEÇÃO DE ACESSIBILIDADE */}
          {activeTab === 'accessibility' && <AcessibilidadeScreen />}

          {/* AS DUAS TELAS QUE COMPARTILHAM MEMÓRIA GLOBAL */}
          {activeTab === 'booking' && (
            <AgendamentoScreen
              setActiveTab={handleTabChange}
              agendamentos={agendamentosGlobais}
              cancelarAgendamento={(id) => setAgendamentosGlobais(prev => prev.filter(a => a.id !== id))}
            />
          )}
          {activeTab === 'network' && (
            <RedeApoioScreen
              setActiveTab={handleTabChange}
              adicionarAgendamento={(novo) => setAgendamentosGlobais(prev => [...prev, novo])}
              profEmFoco={profEmFoco}
              setProfEmFoco={setProfEmFoco}
            />
          )}
        </div>

      </main>
    </div>
  );
}

export default function App() {
  return (
    <AccessibilityProvider>
      <AppContent />
    </AccessibilityProvider>
  );
}
