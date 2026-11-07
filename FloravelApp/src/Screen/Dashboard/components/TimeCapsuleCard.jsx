// src/Screen/Dashboard/components/TimeCapsuleCard.jsx
// Cápsula do tempo: resumo da carta guardada e acesso ao modal para escrever ou abrir.
import { Lock, PenLine } from 'lucide-react';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FCF7F9]';

export default function TimeCapsuleCard({ onWriteLetter, onViewCapsule }) {
  const totalDays = 365;
  const daysPassed = 181;
  const daysLeft = 184;
  const progressPercent = Math.round((daysPassed / totalDays) * 100);

  return (
    <div className="grid gap-6 @2xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] items-start">
      <div>
        <p className="text-[14px] text-[#4A5E4D]">
          1 carta guardada para o 1º ano do bebê
        </p>
        <blockquote className="mt-2 font-fraunces text-[20px] leading-[1.35] text-[#1F3A27] max-w-[44ch]">
          “Filho, hoje te vi dormir no meu peito em silêncio. Quero que leia isto quando fizer 1 ano...”
        </blockquote>
      </div>

      <div className="rounded-lg bg-[#F1E6E1] p-5">
        <div className="flex items-baseline justify-between gap-2 text-[14px]">
          <span className="font-medium text-[#1F3A27] tabular-nums">Abre em {daysLeft} dias</span>
          <span className="text-[#4A5E4D]">12 mai 2027</span>
        </div>

        <div
          className="mt-2.5 h-1.5 w-full rounded-full bg-[#DED3CE] overflow-hidden"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Tempo decorrido até a abertura da cápsula"
        >
          <div
            className="h-full bg-[#294D33] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onWriteLetter}
            className={`inline-flex items-center gap-2 rounded-md bg-[#294D33] px-4 py-2.5 text-[14px] font-medium text-white hover:bg-[#1F3A27] cursor-pointer ${focusRing}`}
          >
            <PenLine size={15} strokeWidth={1.75} aria-hidden="true" />
            Escrever nova carta
          </button>

          <button
            type="button"
            onClick={onViewCapsule}
            className={`inline-flex items-center gap-1.5 text-[14px] font-medium text-[#294D33] underline decoration-[#294D33]/30 underline-offset-4 hover:decoration-[#294D33] rounded-sm cursor-pointer ${focusRing}`}
          >
            <Lock size={14} strokeWidth={1.75} aria-hidden="true" />
            Ver cápsula
          </button>
        </div>
      </div>
    </div>
  );
}
