// src/Screen/Dashboard/components/HomeCheckIn.jsx
// Check-in emocional: um toque, e a interface responde ao que ela sente.
import { useState } from 'react';
import { Check } from 'lucide-react';

const MOOD_OPTIONS = [
  { id: 'calm', label: 'Em paz' },
  { id: 'tired', label: 'Cansada' },
  { id: 'overwhelmed', label: 'Sobrecarregada' },
  { id: 'grateful', label: 'Acolhida' },
  { id: 'sensitive', label: 'Sensível' },
];

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FCF7F9]';

const linkBtn = `font-medium text-[#294D33] underline decoration-[#294D33]/30 underline-offset-4 hover:decoration-[#294D33] rounded-sm cursor-pointer ${focusRing}`;

export default function HomeCheckIn({
  currentMood,
  onSelectMood,
  onOpenDiary,
  onStartPause,
  onGoNetwork,
  onGoHelp,
  onGoQuiz,
}) {
  const [selected, setSelected] = useState(currentMood || null);

  const choose = (mood) => {
    setSelected(mood.id);
    if (onSelectMood) onSelectMood(mood);
  };

  // Resposta acolhedora conforme o sentimento escolhido
  const response = () => {
    switch (selected) {
      case 'calm':
      case 'grateful':
        return (
          <>
            Que bom. Se quiser, guarde este momento.{' '}
            <button type="button" onClick={onOpenDiary} className={linkBtn}>
              Escrever no diário
            </button>
          </>
        );
      case 'tired':
        return (
          <>
            Cansaço não é falha. Um minuto de pausa pode aliviar.{' '}
            <button type="button" onClick={onStartPause} className={linkBtn}>
              Fazer a pausa
            </button>
          </>
        );
      case 'overwhelmed':
        return (
          <>
            Você não precisa atravessar isso sozinha.{' '}
            <button type="button" onClick={onGoNetwork} className={linkBtn}>
              Falar com uma psicóloga
            </button>
            <span aria-hidden="true" className="mx-2 text-[#4A5E4D]/50">·</span>
            <button type="button" onClick={onGoHelp} className={linkBtn}>
              Ajuda agora
            </button>
          </>
        );
      case 'sensitive':
        return (
          <>
            Sentir muito também é cuidar. Quer colocar em palavras?{' '}
            <button type="button" onClick={onOpenDiary} className={linkBtn}>
              Escrever no diário
            </button>
          </>
        );
      default:
        return (
          <>
            Só você vê esta resposta.{' '}
            <button type="button" onClick={onOpenDiary} className={linkBtn}>
              Abrir diário emocional
            </button>
            {onGoQuiz && (
              <>
                <span aria-hidden="true" className="mx-2 text-[#4A5E4D]/50">·</span>
                <button type="button" onClick={onGoQuiz} className={linkBtn}>
                  Triagem EPDS
                </button>
              </>
            )}
          </>
        );
    }
  };

  return (
    <section aria-labelledby="checkin-titulo">
      <h2
        id="checkin-titulo"
        className="font-fraunces text-[28px] @5xl:text-[30px] leading-[1.15] tracking-[-0.015em] text-[#1F3A27]"
      >
        Como você está agora?
      </h2>

      <p className="mt-2 text-[15px] leading-relaxed text-[#4A5E4D] max-w-[46ch]">
        Toque em como se sente hoje. Suas respostas ficam salvas para você acompanhar seu próprio ritmo.
      </p>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Escolha como você está">
        {MOOD_OPTIONS.map((mood) => {
          const isSelected = selected === mood.id;
          return (
            <button
              key={mood.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => choose(mood)}
              className={`inline-flex items-center gap-2 rounded-md border px-4 py-3 text-[15px] font-medium cursor-pointer transition-colors ${focusRing} ${
                isSelected
                  ? 'bg-[#294D33] border-[#294D33] text-white'
                  : 'bg-transparent border-[#D9CFCB] text-[#2B2829] hover:border-[#294D33] hover:text-[#294D33]'
              }`}
            >
              {isSelected && <Check size={16} strokeWidth={2} aria-hidden="true" />}
              {mood.label}
            </button>
          );
        })}
      </div>

      <p className="mt-5 min-h-[28px] text-[15px] leading-relaxed text-[#4A5E4D]" aria-live="polite">
        {response()}
      </p>
    </section>
  );
}
