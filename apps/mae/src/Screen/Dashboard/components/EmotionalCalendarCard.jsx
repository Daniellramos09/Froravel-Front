// src/Screen/Dashboard/components/EmotionalCalendarCard.jsx
// Mapa de humor semanal e acesso ao histórico e à triagem EPDS.
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const WEEK_DAYS = [
  { day: 'Seg', date: '27', tone: 'bg-[#294D33]', label: 'Serena' },
  { day: 'Ter', date: '28', tone: 'bg-[#C88A3B]', label: 'Cansaço' },
  { day: 'Qua', date: '29', tone: 'bg-[#C97C93]', label: 'Conexão' },
  { day: 'Qui', date: '30', tone: 'bg-[#294D33]', label: 'Descanso' },
  { day: 'Sex', date: '31', tone: 'bg-[#516B55]', label: 'Apoio' },
  { day: 'Sáb', date: '01', tone: 'bg-[#294D33]', label: 'Hoje', isToday: true },
  { day: 'Dom', date: '02', tone: 'bg-[#D5CBC6]', label: 'Pendente' },
];

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FCF7F9]';

export default function EmotionalCalendarCard({ onOpenHistory, onOpenScreening }) {
  const [activeDay, setActiveDay] = useState(WEEK_DAYS[5]);

  return (
    <div className="grid gap-6 @2xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] items-start">
      <div>
        <div className="flex items-baseline justify-between gap-4 text-[14px] text-[#4A5E4D]">
          <span>Registros da semana 7</span>
          <span className="tabular-nums font-medium text-[#1F3A27]">5 de 7 dias</span>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-1.5" role="group" aria-label="Dias da semana">
          {WEEK_DAYS.map((item) => {
            const isSelected = activeDay?.day === item.day;
            return (
              <button
                key={item.day}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setActiveDay(item)}
                className={`flex flex-col items-center rounded-md py-2.5 px-1 border transition-colors cursor-pointer ${focusRing} ${
                  isSelected
                    ? 'bg-[#F1E6E1] border-[#294D33] text-[#1F3A27]'
                    : 'border-transparent hover:bg-[#F1E6E1]/60 text-[#4A5E4D]'
                }`}
              >
                <span className="text-[12px] font-medium">{item.day}</span>
                <span className={`my-2 h-3.5 w-3.5 rounded-full ${item.tone}`} aria-hidden="true" />
                <span className="text-[11px] tabular-nums">{item.date}</span>
              </button>
            );
          })}
        </div>

        {activeDay && (
          <p className="mt-3 text-[14px] text-[#4A5E4D]" aria-live="polite">
            {activeDay.day}, dia {activeDay.date}:{' '}
            <strong className="font-medium text-[#1F3A27]">{activeDay.label}</strong>
          </p>
        )}
      </div>

      <div className="rounded-lg bg-[#F1E6E1] p-5">
        <p className="text-[14px] leading-relaxed text-[#2B2829]">
          <strong className="font-medium text-[#1F3A27]">Última triagem EPDS há 14 dias:</strong>{' '}
          escore 6/30 (baixo risco). Recomendamos repetir a cada quinzena.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          <button
            type="button"
            onClick={onOpenHistory}
            className={`inline-flex items-center gap-2 rounded-md bg-[#294D33] px-4 py-2.5 text-[14px] font-medium text-white hover:bg-[#1F3A27] cursor-pointer ${focusRing}`}
          >
            Abrir histórico completo
            <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onOpenScreening}
            className={`text-[14px] font-medium text-[#294D33] underline decoration-[#294D33]/30 underline-offset-4 hover:decoration-[#294D33] rounded-sm cursor-pointer ${focusRing}`}
          >
            Fazer triagem EPDS
          </button>
        </div>
      </div>
    </div>
  );
}
