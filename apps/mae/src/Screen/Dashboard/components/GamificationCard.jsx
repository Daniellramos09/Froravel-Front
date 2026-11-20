import { HeartHandshake, Share2, Sparkles, Gift, ArrowRight } from 'lucide-react';

export default function GamificationCard({ onGenerateLink, flowersCount = 12, targetFlowers = 15 }) {
  const progressPercent = Math.min(100, Math.round((flowersCount / targetFlowers) * 100));
  const flowersRemaining = Math.max(0, targetFlowers - flowersCount);

  return (
    <div className="bg-[#EBF3ED] rounded-3xl p-6 sm:p-7 border border-[#294D33]/15 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden group">
      {/* Detalhes de iluminação suave */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#294D33]/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-[#F4DDE5]/40 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10">
        {/* HEADER DO CARD */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#294D33] shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <HeartHandshake size={24} className="text-[#294D33]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#294D33] block">
                Mãe Apoia Mãe
              </span>
              <h3 className="text-[20px] font-fraunces font-bold text-[#2B2829] leading-tight">
                Rede de Acolhimento
              </h3>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-[#294D33] shadow-xs">
            <Sparkles size={12} className="text-amber-500" />
            Nível Florir
          </span>
        </div>

        {/* STATUS EM DESTAQUE: 12 FLORES ACUMULADAS 🌸 */}
        <div className="bg-white rounded-2xl p-4 border border-[#294D33]/10 mb-4 shadow-xs">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                Seu Saldo Solidário
              </span>
              <div className="text-[24px] sm:text-[26px] font-fraunces font-bold text-[#294D33] flex items-center gap-2">
                <span>{flowersCount} Flores Acumuladas</span>
                <span className="text-[22px]">🌸</span>
              </div>
            </div>
          </div>

          {/* BARRA DE PROGRESSO PARA A SESSÃO GRATUITA */}
          <div className="space-y-1.5 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between text-[11px] font-medium text-stone-600">
              <span className="text-stone-700">Meta: 1 Sessão de Terapia Gratuita</span>
              <span className="font-bold text-[#294D33]">{flowersCount}/{targetFlowers} Flores</span>
            </div>

            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#516B55] to-[#294D33] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-[11px] text-stone-500 flex items-center gap-1">
              <Gift size={12} className="text-[#294D33] shrink-0" />
              Faltam apenas <strong className="text-[#294D33] font-bold">{flowersRemaining} flores</strong> para resgatar sua consulta psicológica.
            </p>
          </div>
        </div>

        {/* EXPLICAÇÃO CURTA */}
        <p className="text-[13px] text-stone-700 leading-relaxed mb-4">
          Convide uma mãe e ganhe flores para trocar por sessões de terapia gratuitas.
        </p>

        {/* IMPACTO SOCIAL */}
        <div className="flex items-center gap-2 text-[11px] text-[#294D33] font-medium bg-white/60 px-3 py-1.5 rounded-xl mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#294D33]" />
          <span>Você já proporcionou apoio a 3 mães da comunidade</span>
        </div>
      </div>

      {/* BOTÃO SÓLIDO #294D33: GERAR LINK DE CONVITE */}
      <div className="pt-2 relative z-10">
        <button
          type="button"
          onClick={onGenerateLink}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#294D33] hover:bg-[#1f3b26] text-white font-bold text-[14px] shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] cursor-pointer group/btn"
        >
          <Share2 size={16} className="transition-transform group-hover/btn:rotate-12" />
          <span>Gerar Link de Convite</span>
          <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
