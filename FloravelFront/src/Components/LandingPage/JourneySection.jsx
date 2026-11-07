import React, { useState, useEffect, useRef } from "react";

const JOURNEY_STEPS = [
  {
    number: "01",
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
  const itemRefs = useRef([]);

  useEffect(() => {
    let rafId = null;

    const updateActiveStep = () => {
      const viewportCenter = window.innerHeight * 0.5;
      let closestIdx = 0;
      let minDistance = Infinity;

      itemRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const itemCenter = rect.top + rect.height * 0.5;
        const distance = Math.abs(itemCenter - viewportCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = idx;
        }
      });

      setActiveStep((prev) => (prev !== closestIdx ? closestIdx : prev));
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        updateActiveStep();
        rafId = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateActiveStep();

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
      <div className="mx-auto max-w-[1560px] px-6 lg:px-12 pt-16 sm:pt-24 pb-2 text-left">
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] text-[#6E9473] mb-2">
          Jornada da Mãe
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-[3rem] font-normal text-[#294D33] leading-[1.12] tracking-[-0.02em]">
          Como a Florável{" "}
          <span className="italic font-serif text-[#D98A9C]">
            caminha com você.
          </span>
        </h2>
      </div>

      {/* =====================================================================
          MOBILE / TABLET: ARCO SUPERIOR + ETAPAS ENXUTAS
      ===================================================================== */}
      <div className="lg:hidden sticky top-16 z-20 bg-[#FCF7F9]/90 backdrop-blur-md border-b border-[#294D33]/8 h-20 flex items-start justify-center overflow-hidden">
        <div
          className="relative w-[500px] h-[500px] rounded-full border border-[#294D33]/15 shrink-0 -mt-[446px] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transform: `rotate(${-activeStep * MOBILE_STEP_ANGLE_DEG}deg)`,
          }}
        >
          {JOURNEY_STEPS.map((st, idx) => {
            const isAct = idx === activeStep;
            const angle = idx * MOBILE_STEP_ANGLE_DEG;
            return (
              <div
                key={st.number}
                style={{ transform: `rotate(${angle}deg)` }}
                className="absolute inset-y-0 left-1/2 -ml-[18px] w-[36px] pointer-events-none"
              >
                <button
                  type="button"
                  onClick={() => scrollToStep(idx)}
                  aria-label={`Ir para passo ${st.number}`}
                  className="pointer-events-auto absolute bottom-[-9px] left-1/2 -translate-x-1/2 w-[18px] h-[18px] rounded-full flex items-center justify-center transition-opacity duration-500 cursor-pointer"
                  style={{
                    border: "1px solid rgba(217, 138, 156, 0.45)",
                    opacity: isAct ? 1 : 0,
                  }}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D98A9C] shadow-[0_0_6px_rgba(217,138,156,0.75)]" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToStep(idx)}
                  className={`pointer-events-auto absolute -bottom-9 left-1/2 -translate-x-1/2 font-serif transition-colors duration-500 cursor-pointer ${
                    isAct
                      ? "text-lg font-medium text-[#294D33]"
                      : "text-sm text-[#A4A4A4]"
                  }`}
                >
                  {st.number}
                </button>
              </div>
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
              className="relative w-[780px] h-[780px] rounded-full border border-[#294D33]/14 shrink-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transform: `rotate(${-activeStep * STEP_ANGLE_DEG}deg)`,
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
                  className={`w-full max-w-[460px] py-6 sm:py-10 lg:py-20 transition-all duration-500 cursor-pointer text-left ${
                    isAct
                      ? "opacity-100 blur-none"
                      : "opacity-45 lg:opacity-40 lg:blur-[4px] hover:opacity-65"
                  }`}
                >
                  {/* Layout compacto no mobile: imagem menor + título e frase curta */}
                  <div className="lg:hidden mb-4 aspect-[16/10] w-full rounded-[20px] overflow-hidden shadow-xs">
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

                  {/* Título e texto enxuto (igual ao Service Item do Orionix) */}
                  <div className="space-y-2.5 lg:space-y-4">
                    <h3 className="font-serif text-xl sm:text-2xl lg:text-[2.6rem] font-normal text-[#294D33] leading-[1.12] tracking-[-0.025em]">
                      {st.title}
                    </h3>

                    <p className="text-sm sm:text-base text-[#3A443E] leading-[1.5] font-sans">
                      {st.description}
                    </p>
                  </div>

                  {/* Tags limpas com a sombra suave do Orionix (ocultas no mobile para não poluir) */}
                  <div className="hidden sm:flex flex-wrap gap-2 mt-5 lg:mt-7">
                    {st.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3.5 py-2 rounded-full bg-white text-xs font-medium text-[#294D33] shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.08),0_4px_6px_0_rgba(0,0,0,0.04),0_24px_40px_-16px_rgba(0,0,0,0.08)]"
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
