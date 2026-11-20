// src/Screen/Dashboard/components/MicroVitoriaCard.jsx
// Microvitória do dia: celebrar um pequeno passo, sem cobrança.
import { useState } from 'react';
import { Check } from 'lucide-react';

const VITORIAS_OPCOES = [
  { id: 'banho', label: 'Tomei banho e lavei o cabelo' },
  { id: 'cafe', label: 'Bebi um café ainda quente' },
  { id: 'ajuda', label: 'Pedi ajuda sem sentir culpa' },
  { id: 'sono', label: 'Descansei 30 min enquanto o bebê dormia' },
  { id: 'respiro', label: 'Apenas respirei fundo e acolhi meu cansaço' },
];

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FCF7F9]';

export default function MicroVitoriaCard({ onCelebrate }) {
  const [vitoriaSelecionada, setVitoriaSelecionada] = useState(null);
  const [jaPontuou, setJaPontuou] = useState(false);

  const handleSelect = (vitoria) => {
    setVitoriaSelecionada(vitoria.id);
    if (!jaPontuou) {
      setJaPontuou(true);
      if (onCelebrate) onCelebrate(vitoria);
    }
  };

  return (
    <div>
      <p className="text-[16px] text-[#4A5E4D]">Qual pequeno passo você conseguiu dar hoje?</p>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Microvitórias">
        {VITORIAS_OPCOES.map((item) => {
          const isSelected = vitoriaSelecionada === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => handleSelect(item)}
              className={`inline-flex items-center gap-2 rounded-md border px-3.5 py-2.5 text-[15px] text-left cursor-pointer transition-colors ${focusRing} ${
                isSelected
                  ? 'bg-[#294D33] border-[#294D33] text-white'
                  : 'border-[#D9CFCB] text-[#2B2829] hover:border-[#294D33] hover:text-[#294D33]'
              }`}
            >
              {isSelected && <Check size={15} strokeWidth={2} aria-hidden="true" />}
              {item.label}
            </button>
          );
        })}
      </div>

      <p className="mt-4 min-h-[24px] text-[15px] text-[#294D33] font-medium" aria-live="polite">
        {vitoriaSelecionada ? 'Isso conta, e muito. Você ganhou 1 flor solidária.' : ''}
      </p>
    </div>
  );
}
