import React, { useState, useEffect, useRef } from "react";

const JOURNEY_STEPS = [
  {
    number: "01",
    stepLabel: "Acolher",
    title: "Você também merece ser cuidada.",
    description:
      "Um espaço seguro e livre de julgamentos para soltar o peso da rotina e validar o que você sente desde o primeiro acesso.",
    tags: [
      "Validação Emocional",
      "Pausa de 1 Minuto",
      "Escuta sem Julgamentos",
    ],
    image: "/img/hero-woman-serene.jpg",
    fallbackImage: "/img/fotoMae/fotomae2.jpg",
  },
  {
    number: "02",
    stepLabel: "Perceber",
    title: "Entender o que você sente é o primeiro passo.",
    description:
      "Reconheça suas emoções no seu próprio ritmo com o diário confidencial e a autoavaliação acolhedora.",
    tags: [
      "Triagem EPDS (OMS)",
      "Diário Confidencial",
      "Check-in Emocional",
    ],
    image: "/img/maeDescansando.jpg",
    fallbackImage: "/img/fotoMae/fotomae1.jpg",
  },
  {
    number: "03",
    stepLabel: "Conectar",
    title: "Você não precisa passar por isso sozinha.",
    description:
      "Caminhe ao lado de outras mães em rodas semanais gratuitas e encontre psicólogas perinatais a valor social.",
    tags: [
      "Rodas de Conversa",
      "Psicólogas Perinatais",
      "Valor Social",
    ],
    image: "/img/fotopsicologo/psicologia-terapia.jpg",
    fallbackImage: "/img/maeconversando.jpg",
  },
  {
    number: "04",
    stepLabel: "Florescer",
    title: "Florescer além da maternidade.",
    description:
      "Fortaleça sua identidade, autonomia e bem-estar contínuo para muito além do cuidar materno.",
    tags: [
      "Identidade & Autonomia",
      "Cápsula do Tempo",
      "Bem-estar Contínuo",
    ],
    image: "/img/1.jpg",
    fallbackImage: "/img/fotoMae/fotomae6.jpg",
  },
];

// Ângulo entre os números no arco circular (idêntico ao Section - Service do Orionix)
const STEP_ANGLE_DEG = 30;
const MOBILE_STEP_ANGLE_DEG = 20;

export default function JourneySection() {
  const [activeStep, setActiveStep] = useState(0);
  const [rotationDeg, setRotationDeg] = useState(0);
  const [mobileRotationDeg, setMobileRotationDeg] = useState(0);
  const itemRefs = useRef([]);

  useEffect(() => {
    let rafId = null;

    const updateScrollProgress = () => {
      const items = itemRefs.current.filter(Boolean);
      if (items.length < 2) return;

      const viewportCenter = window.innerHeight * 0.5;
      const firstRect = items[0].getBoundingClientRect();
      const lastRect = items[items.length - 1].getBoundingClientRect();

      const firstCenter = firstRect.top + firstRect.height * 0.5;
      const lastCenter = lastRect.top + lastRect.height * 0.5;
      const totalSpan = lastCenter - firstCenter;

      if (totalSpan > 0) {
        // Progresso contínuo de 0 (primeiro item no centro) a 1 (último item no centro)
        const progress = (viewportCenter - firstCenter) / totalSpan;
        const clamped = Math.max(0, Math.min(1, progress));

        const maxAngle = (JOURNEY_STEPS.length - 1) * STEP_ANGLE_DEG; // 90deg
        const maxMobileAngle = (JOURNEY_STEPS.length - 1) * MOBILE_STEP_ANGLE_DEG; // 60deg

        // O círculo roda contínua e instantaneamente acompanhando cada pixel do scroll
        setRotationDeg(-clamped * maxAngle);
        setMobileRotationDeg(-clamped * maxMobileAngle);

        // Identifica qual item está mais próximo do centro para destacar e trocar a imagem
        let closestIdx = 0;
        let minDistance = Infinity;

        items.forEach((el, idx) => {
          const rect = el.getBoundingClientRect();
          const itemCenter = rect.top + rect.height * 0.5;
          const distance = Math.abs(itemCenter - viewportCenter);
          if (distance < minDistance) {
            minDistance = distance;
            closestIdx = idx;
          }
        });

        setActiveStep((prev) => (prev !== closestIdx ? closestIdx : prev));
      }
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        updateScrollProgress();
        rafId = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollToStep = (index) => {
    setActiveStep(index);
    const target = itemRefs.current[index];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section
      id="jornada"
      aria-label="Jornada da Mãe · Como a Florável caminha com você"
      className="relative bg-[#FCF7F9] border-t border-[#E8A9BB]/30 overflow-x-clip"
    >
      {/* =====================================================================
          TÍTULO DIRETO E LIMPO ACIMA DO SCROLL
      ===================================================================== */}
      <div className="mx-auto max-w-[1560px] px-6 lg:px-12 pt-16 sm:pt-24 pb-4 text-left">
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] text-[#6E9473] mb-2">
          Jornada da Mãe
        </p>
        <h2 className="font-serif text-[32px] sm:text-[44px] lg:text-[56px] font-normal text-[#294D33] leading-[1.08] tracking-[-0.025em]">
          Como a Florável{" "}
          <span className="italic font-serif text-[#D98A9C]">
            caminha com você.
          </span>
        </h2>
      </div>

      {/* =====================================================================
          MOBILE / TABLET: SELETOR DE ETAPAS (TABS LIMPAS SEM ARCO STICKY)
      ===================================================================== */}
      <div className="lg:hidden mx-auto max-w-[1560px] px-6 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 no-scrollbar">
          {JOURNEY_STEPS.map((st, idx) => {
            const isAct = idx === activeStep;
            return (
              <button
                key={st.number}
                type="button"
                onClick={() => scrollToStep(idx)}
                className={`shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                  isAct
                    ? "bg-[#294D33] text-white shadow-xs"
                    : "bg-white text-[#294D33]/80 border border-[#294D33]/12 hover:border-[#294D33]/30"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    isAct ? "bg-[#D98A9C]" : "bg-[#294D33]/30"
                  }`}
                />
                <span>{st.number}. {st.stepLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          ESTRUTURA FIEL AO ORIONIX (SECTION - SERVICE):
          - Coluna Esquerda (span 2): Sticky 100vh com Círculo de 780px e números 01..04
          - Coluna Central (span 6): Scroll natural contínuo com foco ativo / blur suave
          - Coluna Direita (span 4): Sticky 100vh com Fotografia limpa sincronizada
      ===================================================================== */}
      <div className="mx-auto max-w-[1560px] px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start relative">
          {/* 1. COLUNA ESQUERDA: PROGRESS WRAP (STICKY) */}
          <div className="hidden lg:flex lg:col-span-2 sticky top-0 h-screen items-center justify-end overflow-visible select-none">
            <div
              className="relative w-[780px] h-[780px] rounded-full border border-[#294D33]/14 shrink-0 transition-transform duration-100 ease-out"
              style={{
                transform: `rotate(${rotationDeg}deg)`,
              }}
            >
              {JOURNEY_STEPS.map((st, idx) => {
                const isAct = idx === activeStep;
                const angle = idx * STEP_ANGLE_DEG;

                return (
                  <div
                    key={st.number}
                    style={{ transform: `rotate(${angle}deg)` }}
                    className="absolute top-1/2 left-0 right-0 -mt-[19px] h-[38px] pointer-events-none"
                  >
                    {/* Ponto indicador ativo na borda direita do círculo */}
                    <button
                      type="button"
                      onClick={() => scrollToStep(idx)}
                      aria-label={`Ir para etapa ${st.number}`}
                      className="pointer-events-auto absolute top-1/2 -translate-y-1/2 left-[771px] w-[18px] h-[18px] rounded-full flex items-center justify-center transition-opacity duration-500 cursor-pointer"
                      style={{
                        border: "1px solid rgba(217, 138, 156, 0.42)",
                        opacity: isAct ? 1 : 0,
                      }}
                    >
                      <span
                        className="w-[10px] h-[10px] rounded-full bg-[#D98A9C]"
                        style={{
                          boxShadow: "0 0 6px 0px rgba(217, 138, 156, 0.75)",
                        }}
                      />
                    </button>

                    {/* Número externo ao círculo (01, 02, 03, 04) */}
                    <button
                      type="button"
                      onClick={() => scrollToStep(idx)}
                      className={`pointer-events-auto absolute top-1/2 -translate-y-1/2 right-[-46px] font-serif text-[26px] leading-[1.4] tracking-[-0.02em] transition-colors duration-500 cursor-pointer ${
                        isAct
                          ? "text-[#294D33] font-normal"
                          : "text-[#A4A4A4] hover:text-[#294D33]/65 font-normal"
                      }`}
                    >
                      {st.number}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. COLUNA CENTRAL: SERVICE COLUMN (SCROLL NATURAL FLUIDO) */}
          <div className="lg:col-span-6 flex flex-col items-center py-4 lg:pt-[14vh] lg:pb-[24vh]">
            {JOURNEY_STEPS.map((st, idx) => {
              const isAct = idx === activeStep;
              return (
                <div
                  key={st.number}
                  ref={(el) => (itemRefs.current[idx] = el)}
                  onClick={() => scrollToStep(idx)}
                  className={`w-full max-w-[460px] py-8 sm:py-12 lg:py-20 transition-all duration-500 cursor-pointer text-left border-b border-[#294D33]/8 lg:border-b-0 last:border-b-0 ${
                    isAct
                      ? "opacity-100 blur-none"
                      : "opacity-100 lg:opacity-40 lg:blur-[4px] hover:opacity-100 lg:hover:opacity-65"
                  }`}
                >
                  {/* Badge da Etapa no Mobile */}
                  <div className="lg:hidden flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#294D33] text-white font-serif text-xs font-semibold">
                      {st.number}
                    </span>
                    <span className="text-xs font-semibold tracking-wider uppercase text-[#6E9473]">
                      Passo {st.number} · {st.stepLabel}
                    </span>
                  </div>

                  {/* Foto editorial no mobile */}
                  <div className="lg:hidden mb-4 aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-xs border border-[#294D33]/8 bg-[#F4DDE5]/20">
                    <img
                      src={st.image}
                      alt={st.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = st.fallbackImage;
                      }}
                    />
                  </div>

                  {/* Título e texto */}
                  <div className="space-y-3 lg:space-y-4">
                    <h3 className="font-serif text-[24px] sm:text-[30px] lg:text-[42px] font-normal text-[#294D33] leading-[1.14] tracking-[-0.02em]">
                      {st.title}
                    </h3>

                    <p className="text-[15px] sm:text-base lg:text-[17px] text-[#3A443E] leading-[1.6] font-sans font-normal">
                      {st.description}
                    </p>
                  </div>

                  {/* Tags com sombra suave */}
                  <div className="flex flex-wrap gap-2 mt-4 lg:mt-7">
                    {st.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3.5 py-1.5 rounded-full bg-white text-xs font-medium text-[#294D33] border border-[#294D33]/8 shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_1px_2px_0_rgba(0,0,0,0.06)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3. COLUNA DIREITA: ILLUSTRATION COLUMN (STICKY, IMAGEM PURA SEM TEXTOS) */}
          <div className="hidden lg:flex lg:col-span-4 sticky top-0 h-screen items-center justify-end">
            <div className="relative w-full max-w-[440px] aspect-square">
              {JOURNEY_STEPS.map((st, idx) => {
                const isAct = idx === activeStep;
                return (
                  <div
                    key={st.number}
                    aria-hidden={!isAct}
                    className={`absolute inset-0 rounded-[28px] overflow-hidden shadow-[0_24px_48px_-16px_rgba(41,77,51,0.14)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isAct
                        ? "opacity-100 scale-100 z-10"
                        : "opacity-0 scale-[0.84] pointer-events-none z-0"
                    }`}
                  >
                    <img
                      src={st.image}
                      alt={st.title}
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = st.fallbackImage;
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
