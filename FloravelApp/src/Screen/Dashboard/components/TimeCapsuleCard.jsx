// src/Screen/Dashboard/components/TimeCapsuleCard.jsx
import { Mail, Lock, Clock, PenLine } from 'lucide-react';

export default function TimeCapsuleCard({ onWriteLetter, onViewCapsule }) {
  const totalDays = 365;
  const daysPassed = 181;
  const daysLeft = 184;
  const progressPercent = Math.round((daysPassed / totalDays) * 100);

  return (
    <div className="bg-[#F4DDE5] rounded-3xl p-6 sm:p-8 border border-[#E8A9BB]/40 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden group">
      {/* Detalhes de fundo em degradê suave */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-[#E8A9BB]/25 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10">
        {/* HEADER COM ÍCONE E TÍTULO MAIOR */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#E8A9BB] shadow-xs flex items-center justify-center shrink-0">
              <Mail size={22} className="text-[#E8A9BB] stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#9C5369] block">
                Memórias para o Futuro
              </span>
              <h3 className="text-2xl font-fraunces font-bold text-[#2B2829] leading-tight">
                Cápsula do Tempo
              </h3>
            </div>
          </div>

          <button 
            type="button"
            onClick={onViewCapsule}
            className="w-9 h-9 rounded-full bg-white/80 text-[#9C5369] flex items-center justify-center shrink-0 cursor-pointer hover:bg-white transition shadow-2xs" 
            title="Cápsula lacrada"
          >
            <Lock size={16} />
          </button>
        </div>

        {/* Texto resumido e direto */}
        <p className="text-[15px] font-medium text-[#7A4A58] leading-relaxed mb-5">
          Guarde sentimentos de hoje para serem lidos no primeiro ano do seu bebê.
        </p>

        {/* STATUS DA CARTA COM CONTADOR EM DESTAQUE */}
        <div 
          onClick={onViewCapsule}
          className="bg-white/85 backdrop-blur-sm rounded-2xl p-4.5 border border-white/70 mb-6 shadow-xs cursor-pointer hover:bg-white transition"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E8A9BB] animate-ping" />
            <p className="text-base font-bold text-[#2B2829]">
              1 carta guardada com amor
            </p>
          </div>

          <p className="text-sm text-stone-600 italic line-clamp-2 leading-relaxed mb-4">
            “Filho, hoje te vi dormir no meu peito em silêncio. Quero que leia isto quando fizer 1 ano...”
          </p>

          {/* CRONÔMETRO VISÍVEL */}
          <div className="space-y-2 pt-2 border-t border-stone-200/60">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
              <span className="flex items-center gap-1.5 text-[#9C5369] text-sm font-bold">
                <Clock size={15} /> Abre em {daysLeft} dias
              </span>
              <span className="text-stone-500">12 de Maio de 2027</span>
            </div>

            <div className="w-full h-2 bg-stone-200/70 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#E8A9BB] to-[#294D33] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* BOTÃO COM LETRAS GRANDES */}
      <button
        type="button"
        onClick={onWriteLetter}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl bg-white hover:bg-[#294D33] text-[#294D33] hover:text-white font-bold text-base shadow-xs hover:shadow transition-all active:scale-[0.98] cursor-pointer group"
      >
        <PenLine size={18} className="text-[#E8A9BB] group-hover:text-white transition-colors" />
        <span>Escrever Carta</span>
      </button>
    </div>
  );
}
