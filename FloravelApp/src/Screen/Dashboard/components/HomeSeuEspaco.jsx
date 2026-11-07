// src/Screen/Dashboard/components/HomeSeuEspaco.jsx
// Faixa compacta "Seu espaço" no final da página inicial: reúne Microvitória,
// Recado de Outra Mãe, Cápsula do Tempo e Mapa de Humor sem sobrecarregar o fluxo principal.
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import MicroVitoriaCard from './MicroVitoriaCard';
import MuralSolidarioCard from './MuralSolidarioCard';
import TimeCapsuleCard from './TimeCapsuleCard';
import EmotionalCalendarCard from './EmotionalCalendarCard';

const ITEMS = [
  {
    id: 'microvitoria',
    title: 'Microvitória do dia',
    summary: 'Um passo possível hoje',
  },
  {
    id: 'recado',
    title: 'Recado de outra mãe',
    summary: 'Mural solidário entre mães',
  },
  {
    id: 'capsula',
    title: 'Cápsula do tempo',
    summary: '1 carta · abre em 184 dias',
  },
  {
    id: 'mapa',
    title: 'Mapa de humor',
    summary: 'Semana 7 · 5 de 7 dias',
  },
];

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-inset';

export default function HomeSeuEspaco({
  onCelebrateMicroVitoria,
  onSendFlowerMural,
  onOpenCapsuleModal,
  onOpenHistoryModal,
  onOpenScreening,
}) {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId((curr) => (curr === id ? null : id));
  };

  return (
    <section aria-labelledby="seu-espaco-titulo">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="seu-espaco-titulo"
          className="font-fraunces text-[28px] @5xl:text-[32px] leading-[1.12] tracking-[-0.015em] text-[#1F3A27]"
        >
          Seu espaço
        </h2>
        <p className="text-[14px] text-[#4A5E4D]">
          Memórias, trocas entre mães e acompanhamento emocional quando você quiser abrir.
        </p>
      </div>

      {/* Faixa compacta de 4 itens + área expansível */}
      <div
        className="mt-6 rounded-xl border border-[#E4DAD5] bg-[#F1E6E1]/65 overflow-hidden"
        role="region"
        aria-label="Recursos do seu espaço"
      >
        <div className="grid grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-4 gap-px bg-[#E4DAD5]">
          {ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-expanded={isOpen}
                aria-controls={`painel-${item.id}`}
                onClick={() => toggle(item.id)}
                className={`group flex items-start justify-between gap-3 p-5 text-left transition-colors cursor-pointer ${focusRing} ${
                  isOpen ? 'bg-[#E9DCD5]' : 'bg-[#F5EDE9] hover:bg-[#EFE3DD]'
                }`}
              >
                <span className="min-w-0">
                  <span className="block font-fraunces text-[19px] leading-snug text-[#1F3A27]">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-[13.5px] leading-snug text-[#4A5E4D]">
                    {item.summary}
                  </span>
                </span>

                <ChevronDown
                  size={18}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className={`mt-1 shrink-0 text-[#294D33] transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Painéis expansíveis (mantidos montados para preservar o estado da sessão) */}
        <div
          id="painel-microvitoria"
          hidden={openId !== 'microvitoria'}
          className="border-t border-[#E4DAD5] bg-[#FCF7F9] p-6 @xl:p-8"
        >
          <MicroVitoriaCard onCelebrate={onCelebrateMicroVitoria} />
        </div>

        <div
          id="painel-recado"
          hidden={openId !== 'recado'}
          className="border-t border-[#E4DAD5] bg-[#FCF7F9] p-6 @xl:p-8"
        >
          <MuralSolidarioCard onSendFlower={onSendFlowerMural} />
        </div>

        <div
          id="painel-capsula"
          hidden={openId !== 'capsula'}
          className="border-t border-[#E4DAD5] bg-[#FCF7F9] p-6 @xl:p-8"
        >
          <TimeCapsuleCard
            onWriteLetter={onOpenCapsuleModal}
            onViewCapsule={onOpenCapsuleModal}
          />
        </div>

        <div
          id="painel-mapa"
          hidden={openId !== 'mapa'}
          className="border-t border-[#E4DAD5] bg-[#FCF7F9] p-6 @xl:p-8"
        >
          <EmotionalCalendarCard
            onOpenHistory={onOpenHistoryModal}
            onOpenScreening={onOpenScreening}
          />
        </div>
      </div>
    </section>
  );
}
