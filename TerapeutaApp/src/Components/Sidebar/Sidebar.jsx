// Conteúdo do menu lateral do Portal do Terapeuta, no mesmo padrão visual do Espaço da Mãe.
// O DashboardLayout coloca este conteúdo fixo ao lado (computador) ou em uma gaveta (celular).
import { NavLink } from 'react-router-dom';
import { HeartHandshake, LogOut, X } from 'lucide-react';
import { menuItems } from './menuItems';

// Item de navegação com barra lateral de destaque, igual ao app da Mãe
function NavItem({ to, icon: Icon, label, onNavigate }) {
  return (
    <NavLink
      to={to}
      end
      onClick={onNavigate}
      className={({ isActive }) =>
        `group relative w-full flex items-center px-4 py-3.5 rounded-2xl text-[15px] font-medium transition-all duration-200 font-dmsans cursor-pointer select-none active:scale-[0.98] ${
          isActive
            ? 'bg-[#F4DDE5] text-[#294D33] font-bold shadow-xs border border-[#E8A9BB]/40'
            : 'text-stone-700 hover:bg-[#F4DDE5]/45 hover:text-[#294D33]'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`absolute left-0 top-2.5 bottom-2.5 w-1.5 rounded-r-full transition-all duration-300 ${
              isActive
                ? 'bg-[#294D33] scale-y-100 opacity-100'
                : 'bg-[#E8A9BB] scale-y-0 opacity-0 group-hover:scale-y-100 group-hover:opacity-100'
            }`}
          />
          <span className="flex items-center gap-3.5">
            <span
              className={`transition-all duration-200 ${
                isActive
                  ? 'text-[#294D33] scale-105'
                  : 'text-stone-500 group-hover:text-[#294D33] group-hover:scale-110'
              }`}
            >
              <Icon size={20} />
            </span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">{label}</span>
          </span>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ onNavigate, onClose, onLogout }) {
  const landingUrl = import.meta.env.VITE_LANDING_URL || 'http://localhost:5173';

  return (
    <>
      <div className="overflow-y-auto pr-1">
        {/* LOGOTIPO */}
        <div className="flex items-center justify-between px-4 mb-4">
          <NavLink to="/painel" onClick={onNavigate} className="flex items-center gap-3 group">
            <img
              src="/img/fotoheader/logo.png"
              alt="Logo Florável"
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-[26px] font-fraunces text-[#294D33] font-bold tracking-tight transition-opacity duration-300 group-hover:opacity-85">
              florável
            </span>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#294D33] text-white">
              Psi
            </span>
          </NavLink>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl text-stone-500 hover:bg-stone-100 cursor-pointer"
              aria-label="Fechar menu"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Atalho para o Portal Principal */}
        <a
          href={landingUrl}
          className="flex items-center justify-between px-3.5 py-2 mx-2 mb-5 rounded-xl text-xs font-semibold text-[#516B55] bg-[#FCF7F9] hover:bg-[#F4DDE5]/60 border border-[#E8A9BB]/40 transition"
          title="Voltar para a Landing Page principal"
        >
          <span>← Portal Principal</span>
          <span className="text-[10px] text-stone-400">Início</span>
        </a>

        <nav className="space-y-1.5" aria-label="Menu do consultório">
          {menuItems.map((item) => (
            <NavItem key={item.path} to={item.path} icon={item.icon} label={item.name} onNavigate={onNavigate} />
          ))}
        </nav>

        {/* CARD DE ACOLHIMENTO */}
        <div className="mt-6 bg-[#F4DDE5] p-5 rounded-3xl mx-1 border border-[#E8A9BB]/30">
          <div className="w-10 h-10 rounded-2xl bg-white/80 text-[#294D33] flex items-center justify-center mb-3 shadow-2xs">
            <HeartHandshake size={20} />
          </div>
          <p className="text-[15px] font-bold text-[#2B2829] mb-1">Cuidar de quem cuida.</p>
          <p className="text-[13px] text-stone-700 leading-relaxed font-medium">
            Um ambiente clínico de acolhimento seguro, para você e para as mães.
          </p>
        </div>
      </div>

      {/* RODAPÉ DO PERFIL */}
      <div className="flex items-center justify-between px-2 pt-4 border-t border-stone-100">
        <div className="flex items-center gap-3 p-1.5 -ml-1 flex-1 mr-2 min-w-0">
          <div className="w-11 h-11 rounded-full bg-[#F4DDE5] text-[#294D33] flex items-center justify-center font-bold text-[15px] border border-[#E8A9BB]/40 shadow-2xs shrink-0">
            HS
          </div>
          <div className="min-w-0">
            <p className="text-[15px] font-bold text-[#2B2829] leading-tight truncate">Dra. Helena Souza</p>
            <p className="text-[12px] text-stone-500 font-medium">CRP 06/142980</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="p-2.5 text-stone-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 rounded-xl cursor-pointer shrink-0"
          title="Sair da conta"
          aria-label="Sair da conta"
        >
          <LogOut size={20} />
        </button>
      </div>
    </>
  );
}
