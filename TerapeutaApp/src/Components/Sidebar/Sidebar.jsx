import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  Calendar,
  Users,
  Video,
  Flower2,
  HeartHandshake,
  LogOut,
  ArrowLeft,
  Home,
} from 'lucide-react';
import InstallAppButton from '../Pwa/InstallAppButton';

const menuItems = [
  { name: 'Visão geral', path: '/painel', icon: LayoutGrid },
  { name: 'Agenda', path: '/agenda', icon: Calendar },
  { name: 'Mães atendidas', path: '/maes', icon: Users },
  { name: 'Sala de acolhimento', path: '/sala', icon: Video },
];

export default function Sidebar({ isOpen, onClose }) {
  const landingUrl = import.meta.env.VITE_LANDING_URL || 'http://localhost:5173';

  return (
    <>
    {isOpen && (
      <div className="md:hidden fixed inset-0 z-40 bg-black/40" onClick={onClose} aria-hidden="true" />
    )}
    {/* No computador fica fixa ao lado; no celular abre pelo botão de menu, por cima do conteúdo */}
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] overflow-y-auto transition-transform duration-300 md:sticky md:top-0 md:z-auto md:max-w-none md:translate-x-0 h-dvh md:h-screen flex flex-shrink-0 flex-col justify-between gap-6 bg-white border-r border-[#f0e4e4] px-6 py-8 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div>
        {/* Logo com link direto para Landing Page */}
        <div 
          className="px-2 mb-6 cursor-pointer group"
          onClick={() => (window.location.href = landingUrl)}
          title="Voltar para a página inicial da Florável"
        >
          <div className="flex items-center gap-2.5">
            <img 
              src="/img/fotoheader/logo.png" 
              alt="Logo Florável" 
              className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-2xl font-bold text-[#9b4f55] tracking-tight group-hover:opacity-85 transition-opacity">
              florável
            </span>
            <span className="text-[10px] font-semibold bg-[#f3d5da] text-[#9b4f55] px-2 py-0.5 rounded-full">
              PSI
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1 ml-10 flex items-center gap-1 font-medium">
            <span>Área profissional</span>
            <span className="text-gray-400 group-hover:text-[#9b4f55] transition-colors">← Início</span>
          </p>
        </div>

        {/* Atalho Rápido para a Landing Page */}
        <a
          href={landingUrl}
          className="flex items-center gap-2.5 px-3.5 py-2 mb-4 rounded-xl text-xs font-semibold text-[#516B55] bg-[#FCF7F9] hover:bg-[#F4DDE5]/60 border border-[#E8A9BB]/40 transition"
        >
          <Home size={14} className="text-[#294D33]" />
          <span>Voltar para o Portal Principal</span>
        </a>

        {/* Menu */}
        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] px-2 mb-3">
          Seu consultório
        </p>

        <nav className="space-y-1.5">
          {menuItems.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-[14px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#f3d5da] text-[#4a2327] font-semibold shadow-2xs'
                    : 'text-gray-600 hover:bg-[#faf3f3]'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Rodapé */}
      <div className="space-y-4">
        {/* No celular o botão fica na barra superior */}
        <div className="hidden md:block">
          <InstallAppButton className="w-full py-2.5 bg-[#f3d5da] text-[#9b4f55] hover:bg-[#ecc6cd]" />
        </div>

        <div className="rounded-3xl bg-[#e1e8d5] p-4">
          <HeartHandshake className="w-5 h-5 text-[#4f6340] mb-2" />
          <p className="text-sm font-bold text-[#3b4a2f]">Cuidar de quem cuida</p>
          <p className="text-xs text-[#5c6b4f] mt-1 leading-relaxed">
            Ambiente clínico de acolhimento seguro.
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-[#f0e4e4] pt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f3d5da] text-[#9b4f55] font-bold flex items-center justify-center text-sm">
              HS
            </div>
            <div>
              <p className="text-sm font-bold text-[#4a2327]">Dra. Helena Souza</p>
              <p className="text-xs text-gray-500">CRP 06/142980</p>
            </div>
          </div>
          <button 
            onClick={() => (window.location.href = landingUrl)}
            className="text-gray-400 hover:text-[#9b4f55] p-2 rounded-xl hover:bg-stone-50 transition cursor-pointer" 
            title="Sair e voltar à página inicial"
            aria-label="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}
