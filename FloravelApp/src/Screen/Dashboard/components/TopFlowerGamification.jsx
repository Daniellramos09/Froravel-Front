// src/Screen/Dashboard/components/TopFlowerGamification.jsx
import { Share2, Sparkles } from 'lucide-react';

export default function TopFlowerGamification({ flowersCount = 12, targetFlowers = 15, onOpenInvite }) {
  const remaining = Math.max(0, targetFlowers - flowersCount);
  const progressPercent = Math.min(100, Math.round((flowersCount / targetFlowers) * 100));

  return (
    <div className="bg-white border border-stone-200/90 rounded-3xl p-3.5 sm:px-5 sm:py-3 shadow-xs hover:shadow-sm transition-all duration-300 flex flex-wrap items-center justify-between gap-3 sm:gap-6">
      {/* Ícone e Saldo de Flores com visual claro */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#F4DDE5] text-[#294D33] flex items-center justify-center text-2xl shrink-0 shadow-2xs">
          🌸
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-fraunces font-bold text-[#294D33] text-xl sm:text-2xl leading-tight">
              {flowersCount} Flores
            </span>
            <span className="text-[10px] font-extrabold text-[#294D33] uppercase tracking-wider bg-[#EBF3ED] px-2 py-0.5 rounded-full border border-[#294D33]/15">
              Solidárias
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 font-medium leading-tight mt-0.5">
            Faltam <strong className="text-[#294D33] font-bold">{remaining} flores</strong> para 1 consulta gratuita
          </p>
        </div>
      </div>

      {/* Progresso visual e Ação de convite com excelente feedback */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden md:flex flex-col items-end gap-1 w-24">
          <span className="text-xs text-stone-500 font-bold">{flowersCount}/{targetFlowers}</span>
          <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#294D33] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenInvite}
          className="group/btn bg-[#294D33] hover:bg-[#1e3b26] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-2xl transition-all shadow-xs hover:shadow-md hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <Share2 size={15} className="transition-transform duration-300 group-hover/btn:rotate-12" />
          <span>Indicar Mãe</span>
        </button>
      </div>
    </div>
  );
}
