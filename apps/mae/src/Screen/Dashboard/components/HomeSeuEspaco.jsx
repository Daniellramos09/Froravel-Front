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
    title: 'Microvitória',
    desktopTitle: 'Microvitória do dia',
    summary: 'Um passo hoje',
  },
  {
    id: 'recado',
    title: 'Mural de mães',
    desktopTitle: 'Recado de outra mãe',
    summary: 'Troca solidária',
  },
  {
    id: 'capsula',
    title: 'Cápsula',
    desktopTitle: 'Cápsula do tempo',
    summary: 'Abre em 184d',
  },
  {
    id: 'mapa',
    title: 'Mapa de humor',
    desktopTitle: 'Mapa de humor',
    summary: '5 de 7 dias',
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
          className="font-fraunces text-[22px] @3xl:text-[28px] @5xl:text-[32px] leading-[1.12] tracking-[-0.015em] text-[#1F3A27]"
        >
          Seu espaço
        </h2>
        <p className="hidden @xl:block text-[14px] text-[#4A5E4D]">
          Memórias, trocas entre mães e acompanhamento emocional quando você quiser abrir.
        </p>
      </div>

      {/* Grade 2x2 compacta no mobile e 4 colunas no desktop */}
      <div
        className="mt-3.5 @3xl:mt-6 rounded-2xl @xl:rounded-xl border border-[#E4DAD5] bg-[#F1E6E1]/65 overflow-hidden"
        role="region"
        aria-label="Recursos do seu espaço"
      >
        <div className="grid grid-cols-2 @4xl:grid-cols-4 gap-px bg-[#E4DAD5]">
          {ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-expanded={isOpen}
                aria-controls={`painel-${item.id}`}
                onClick={() => toggle(item.id)}
                className={`group flex items-start justify-between gap-2 p-3.5 @xl:p-5 text-left transition-colors cursor-pointer ${focusRing} ${
                  isOpen ? 'bg-[#E9DCD5]' : 'bg-[#F5EDE9] hover:bg-[#EFE3DD]'
                }`}
              >
                <span className="min-w-0">
                  <span className="block font-fraunces text-[16px] @xl:text-[19px] leading-snug text-[#1F3A27]">
                    <span className="@xl:hidden">{item.title}</span>
                    <span className="hidden @xl:inline">{item.desktopTitle}</span>
                  </span>
                  <span className="mt-0.5 @xl:mt-1 block text-[12px] @xl:text-[13.5px] leading-snug text-[#4A5E4D]">
                    {item.summary}
                  </span>
                </span>

                <ChevronDown
                  size={16}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className={`mt-0.5 shrink-0 text-[#294D33] transition-transform duration-200 ${
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
          className="border-t border-[#E4DAD5] bg-[#FCF7F9] p-4 @xl:p-8"
        >
          <MicroVitoriaCard onCelebrate={onCelebrateMicroVitoria} />
        </div>

        <div
          id="painel-recado"
          hidden={openId !== 'recado'}
          className="border-t border-[#E4DAD5] bg-[#FCF7F9] p-4 @xl:p-8"
        >
          <MuralSolidarioCard onSendFlower={onSendFlowerMural} />
        </div>

        <div
          id="painel-capsula"
          hidden={openId !== 'capsula'}
          className="border-t border-[#E4DAD5] bg-[#FCF7F9] p-4 @xl:p-8"
        >
          <TimeCapsuleCard
            onWriteLetter={onOpenCapsuleModal}
            onViewCapsule={onOpenCapsuleModal}
          />
        </div>

        <div
          id="painel-mapa"
          hidden={openId !== 'mapa'}
          className="border-t border-[#E4DAD5] bg-[#FCF7F9] p-4 @xl:p-8"
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
