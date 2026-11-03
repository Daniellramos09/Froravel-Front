// src/Screen/Dashboard/components/MicroVitoriaCard.jsx
import { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';

const VITORIAS_OPCOES = [
  { id: 'banho', emoji: '🛁', label: 'Tomei banho e lavei o cabelo' },
  { id: 'cafe', emoji: '☕', label: 'Bebi um café ainda quente' },
  { id: 'ajuda', emoji: '🤝', label: 'Pedi ajuda sem sentir culpa' },
  { id: 'sono', emoji: '👶', label: 'Descansei 30 min enquanto o bebê dormia' },
  { id: 'respiro', emoji: '🌿', label: 'Apenas respirei fundo e acolhi meu cansaço' },
];

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
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        {/* HEADER */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#EBF3ED] text-[#294D33] flex items-center justify-center text-xl">
              ✨
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#294D33] block">
                Sem Cobranças
              </span>
              <h3 className="text-2xl font-fraunces font-bold text-[#2B2829] leading-tight">
                Microvitória do Dia
              </h3>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EBF3ED] text-[#294D33]">
            +1 Flor 🌸
          </span>
        </div>

        <p className="text-[15px] text-stone-600 font-medium leading-relaxed mb-4">
          Qual pequeno passo você conseguiu dar hoje?
        </p>

        {/* LISTA DE OPÇÕES COM FONTES MAIORES E CLIQUE FÁCIL */}
        <div className="space-y-2.5 mb-4">
          {VITORIAS_OPCOES.map((item) => {
            const isSelected = vitoriaSelecionada === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-[14px] sm:text-[15px] font-medium transition-all duration-200 border text-left cursor-pointer ${
                  isSelected
                    ? 'bg-[#EBF3ED] border-[#294D33] text-[#294D33] font-bold shadow-xs scale-[1.01]'
                    : 'bg-stone-50/80 border-stone-200/80 text-stone-800 hover:bg-white hover:border-[#294D33]/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.emoji}</span>
                  <span>{item.label}</span>
                </div>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-[#294D33] text-white flex items-center justify-center shrink-0">
                    <Check size={13} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* FEEDBACK ACOLHEDOR */}
      {vitoriaSelecionada ? (
        <div className="p-3.5 rounded-2xl bg-[#FCF7F9] border border-[#E8A9BB]/40 text-center animate-fadeIn">
          <p className="text-sm text-[#294D33] font-bold flex items-center justify-center gap-1.5">
            <Sparkles size={16} className="text-[#E8A9BB]" />
            Isso é gigante! Você ganhou +1 Flor Solidária 🌸
          </p>
        </div>
      ) : (
        <p className="text-xs text-stone-400 text-center pt-1">
          Toque em uma opção para celebrar.
        </p>
      )}
    </div>
  );
}
