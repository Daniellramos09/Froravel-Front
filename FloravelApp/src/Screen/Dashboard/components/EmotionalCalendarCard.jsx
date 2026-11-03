import { useState } from 'react';
import { Calendar, ChevronRight, Info, CheckCircle2 } from 'lucide-react';

const WEEK_DAYS = [
  { day: 'Seg', date: '27', color: 'bg-[#294D33]', label: 'Serena' },
  { day: 'Ter', date: '28', color: 'bg-amber-400', label: 'Cansaço' },
  { day: 'Qua', date: '29', color: 'bg-[#E8A9BB]', label: 'Conexão' },
  { day: 'Qui', date: '30', color: 'bg-[#294D33]', label: 'Descanso' },
  { day: 'Sex', date: '31', color: 'bg-[#516B55]', label: 'Apoio' },
  { day: 'Sáb', date: '01', color: 'bg-[#294D33]', label: 'Hoje', isToday: true },
  { day: 'Dom', date: '02', color: 'bg-stone-300', label: 'Pendente' },
];

export default function EmotionalCalendarCard({ onOpenHistory, onOpenScreening }) {
  const [activeDay, setActiveDay] = useState(WEEK_DAYS[5]); // Hoje

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        {/* HEADER */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#EBF3ED] text-[#294D33] flex items-center justify-center shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#294D33] block">
                Escala de Edimburgo (EPDS)
              </span>
              <h3 className="text-[20px] font-fraunces font-bold text-[#2B2829] leading-tight">
                Seu Mapa de Humor
              </h3>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EBF3ED] text-[#294D33]">
            <CheckCircle2 size={12} />
            Semana 7
          </span>
        </div>

        <p className="text-[13px] text-stone-600 leading-relaxed mb-5">
          Acompanhamento do seu ritmo emocional diário para identificar oscilações hormonais e sobrecargas no puerpério.
        </p>

        {/* DIAS DA SEMANA */}
        <div className="bg-[#FCF7F9] rounded-2xl p-4 border border-stone-100 mb-5">
          <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-3">
            <span>Registros da semana</span>
            <span className="text-[#294D33]">5 de 7 dias preenchidos</span>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {WEEK_DAYS.map((item, idx) => {
              const isSelected = activeDay?.day === item.day;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveDay(item)}
                  className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
                    isSelected ? 'bg-white shadow-xs ring-1 ring-[#294D33]/40' : 'hover:bg-white/60'
                  }`}
                  title={`${item.day}: ${item.label}`}
                >
                  <span className="text-[11px] font-medium text-stone-500 mb-1.5">{item.day}</span>
                  <div className="relative">
                    <span className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full inline-block ${item.color}`} />
                    {item.isToday && (
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#E8A9BB] rounded-full ring-1 ring-white" />
                    )}
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1">{item.date}</span>
                </button>
              );
            })}
          </div>

          {activeDay && (
            <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between text-[12px]">
              <span className="text-stone-700 font-medium">
                {activeDay.day}: <strong>{activeDay.label}</strong>
              </span>
              <span className="text-[10px] text-stone-400">Toque para ver histórico</span>
            </div>
          )}
        </div>

        {/* INDICADOR SUTIL (EPDS HÁ 14 DIAS) */}
        <div 
          onClick={onOpenScreening}
          className="rounded-2xl p-3 bg-stone-50 border border-stone-100 mb-5 flex items-start gap-2.5 cursor-pointer hover:bg-stone-100/70 transition"
        >
          <Info size={15} className="text-[#294D33] shrink-0 mt-0.5" />
          <p className="text-[12px] text-stone-600 leading-snug">
            <strong>Última triagem (EPDS) há 14 dias:</strong> escore estável em 6/30 (baixo risco). Triagem quinzenal recomendada.
          </p>
        </div>
      </div>

      {/* BOTÃO VAZADO */}
      <button
        type="button"
        onClick={onOpenHistory}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-[#294D33] text-[#294D33] font-bold text-[14px] hover:bg-[#294D33] hover:text-white transition-all active:scale-[0.98] cursor-pointer group"
      >
        <span>Abrir Histórico</span>
        <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
}
