import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Minus, ArrowLeft, ArrowRight, HeartHandshake } from "lucide-react";

const PSYCHOLOGISTS = [
  {
    id: "mariana-costa",
    nome: "Dra. Mariana Costa",
    cargo: "Psicóloga Perinatal",
    subtitulo: "Depressão Pós-Parto & Ansiedade",
    crp: "CRP 06/14829",
    foto: "/img/fotopsicologo/psicologa1.jpg",
    cardBg: "bg-[#F4DDE5]",
    photoBg: "bg-[#294D33]",
    mensagem:
      "Você não precisa dar conta de tudo em silêncio. No puerpério, sentir exaustão ou tristeza não te faz menos mãe — significa apenas que você também precisa de colo, escuta e cuidado especializado.",
    social: "Vagas sociais a R$ 40",
  },
  {
    id: "beatriz-albuquerque",
    nome: "Dra. Beatriz Albuquerque",
    cargo: "Psicóloga Clínica",
    subtitulo: "Luto Parental & Tentantes",
    crp: "CRP 06/18921",
    foto: "/img/fotopsicologo/psicologa2.jpg",
    cardBg: "bg-[#EBF1ED]",
    photoBg: "bg-[#516B55]",
    mensagem:
      "Cada história materna carrega pausas, medos e recomeços que merecem ser validados. Meu compromisso é construir com você um espaço ético, seguro e livre de qualquer julgamento.",
    social: "Atendimento online acolhedor",
  },
  {
    id: "camila-nogueira",
    nome: "Dra. Camila Nogueira",
    cargo: "Psicóloga Perinatal",
    subtitulo: "Transição de Carreira & Puerpério",
    crp: "CRP 06/20144",
    foto: "/img/fotopsicologo/psicologia4.jpg",
    cardBg: "bg-[#F4DDE5]",
    photoBg: "bg-[#1F3224]",
    mensagem:
      "Tornar-se mãe transforma quem você é, mas não apaga a mulher que existe em você. Vamos juntas resgatar sua identidade, seus limites e sua saúde emocional no retorno ao trabalho e à rotina.",
    social: "Vagas sociais a R$ 40",
  },
  {
    id: "helena-souza",
    nome: "Dra. Helena Souza",
    cargo: "Mediadora de Rodas",
    subtitulo: "Vínculo Mãe-Bebê & Rede de Apoio",
    crp: "CRP 06/142980",
    foto: "/img/fotopsicologo/psicologia1.jpg",
    cardBg: "bg-[#EBF1ED]",
    photoBg: "bg-[#294D33]",
    mensagem:
      "Quando uma mulher compartilha o que sente em uma roda segura, outras mães percebem que não estão sozinhas. A escuta em comunidade cura a solidão silenciosa da maternidade.",
    social: "Rodas gratuitas semanais",
  },
  {
    id: "juliana-martins",
    nome: "Dra. Juliana Martins",
    cargo: "Psicóloga Obstétrica",
    subtitulo: "Gestação de Risco & Medo do Parto",
    crp: "CRP 06/17305",
    foto: "/img/fotopsicologo/download8.jpg",
    cardBg: "bg-[#F4DDE5]",
    photoBg: "bg-[#516B55]",
    mensagem:
      "Medo e insegurança na gestação não precisam ser silenciados. Cuidar das suas emoções antes do parto fortalece sua confiança e protege a sua saúde mental no pós-parto.",
    social: "Vagas sociais a R$ 40",
  },
  {
    id: "rafael-mendes",
    nome: "Dr. Rafael Mendes",
    cargo: "Psicólogo Clínico",
    subtitulo: "Parentalidade & Rede Familiar",
    crp: "CRP 06/16542",
    foto: "/img/fotopsicologo/psicologos7.jpg",
    cardBg: "bg-[#EBF1ED]",
    photoBg: "bg-[#1F3224]",
    mensagem:
      "Acolher quem cuida transforma toda a família. Trabalhamos juntos para reconstruir limites saudáveis, descanso possível e apoio emocional real na rotina com o bebê.",
    social: "Atendimento online acolhedor",
  },
];

const LOOP_PSYCHOLOGISTS = [
  ...PSYCHOLOGISTS.map((p) => ({ ...p, loopKey: `a-${p.id}` })),
  ...PSYCHOLOGISTS.map((p) => ({ ...p, loopKey: `b-${p.id}` })),
];

export default function PsychologistsFlipSection() {
  const [flippedIds, setFlippedIds] = useState({});
  const [hoveredId, setHoveredId] = useState(null);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const scrollContainerRef = useRef(null);
  const manualScrollUntilRef = useRef(0);

  const toggleCard = (id) => {
    setFlippedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Loop contínuo lento e suave (pausa automaticamente ao passar o mouse, virar card ou usar as setas)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let rafId = null;
    let accum = 0;
    const SPEED_PX_PER_FRAME = 0.32;

    const tick = () => {
      const hasFlipped = Object.values(flippedIds).some(Boolean);
      const isManualScrolling = Date.now() < manualScrollUntilRef.current;
      if (!isCarouselPaused && !hoveredId && !hasFlipped && !isManualScrolling) {
        accum += SPEED_PX_PER_FRAME;
        if (accum >= 1) {
          const step = Math.floor(accum);
          accum -= step;
          container.scrollLeft += step;
          const half = container.scrollWidth / 2;
          if (half > 0 && container.scrollLeft >= half) {
            container.scrollLeft -= half;
          }
        }
      }
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [isCarouselPaused, hoveredId, flippedIds]);

  const scrollByCard = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const step = 334;
    const half = container.scrollWidth / 2;

    // Pausa o auto-scroll durante a transição das setas para não cancelar o scrollBy
    manualScrollUntilRef.current = Date.now() + 750;

    if (direction === "prev" && container.scrollLeft <= step && half > 0) {
      container.scrollLeft += half;
    } else if (direction === "next" && half > 0 && container.scrollLeft + step >= half) {
      container.scrollLeft -= half;
    }

    container.scrollBy({
      left: direction === "next" ? step : -step,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-20 sm:py-28 bg-white border-t border-[#E8A9BB]/25 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Cabeçalho centralizado inspirado na referência */}
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#516B55] font-sans mb-3">
            Rede Clínica Verificada
          </p>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.9rem] font-normal text-[#294D33] leading-[1.12] tracking-[-0.015em]">
            Escuta feita por quem entende{" "}
            <span className="italic text-[#A8435F]">a sua fase</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#516B55] font-sans leading-relaxed">
            Passe o mouse sobre o card ou toque no botão <strong className="text-[#294D33]">+</strong> para ler a mensagem de acolhimento dela para você.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/profissionais"
              className="inline-flex items-center gap-2 rounded-full bg-[#294D33] text-[#FCF7F9] hover:bg-[#1f3c27] px-6 py-3 text-sm font-semibold transition shadow-sm font-sans"
            >
              <span>Ver rede e modelo clínico</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Carrossel horizontal de Flip Cards (Loop Infinito Lento) */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsCarouselPaused(true)}
          onMouseLeave={() => setIsCarouselPaused(false)}
          onTouchStart={() => setIsCarouselPaused(true)}
          onTouchEnd={() => setIsCarouselPaused(false)}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          {LOOP_PSYCHOLOGISTS.map((psi) => {
            const isFlipped = hoveredId === psi.loopKey || !!flippedIds[psi.loopKey];

            return (
              <div
                key={psi.loopKey}
                onMouseEnter={() => setHoveredId(psi.loopKey)}
                onMouseLeave={() => setHoveredId(null)}
                className="shrink-0 w-[290px] sm:w-[310px] h-[440px] [perspective:1200px]"
              >
                <div
                  className={`relative w-full h-full transition-transform duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] ${
                    isFlipped ? "[transform:rotateY(180deg)]" : ""
                  }`}
                >
                  {/* FRENTE DO CARD */}
                  <div
                    className={`absolute inset-0 rounded-[1.5rem] ${psi.cardBg} p-4 flex flex-col justify-between border border-[#294D33]/10 shadow-sm [backface-visibility:hidden]`}
                  >
                    {/* Área da Foto */}
                    <div className="relative w-full h-[265px] rounded-2xl overflow-hidden bg-[#294D33]">
                      <img
                        src={psi.foto}
                        alt={psi.nome}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/img/fotoMae/fotomae1.jpg";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1F3224]/35 via-transparent to-transparent pointer-events-none" />

                      {/* Botão circular + no canto superior direito */}
                      <button
                        type="button"
                        onClick={() => toggleCard(psi.loopKey)}
                        aria-label={`Ler mensagem de ${psi.nome}`}
                        className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white text-[#294D33] hover:bg-[#FCF7F9] shadow-md flex items-center justify-center transition-transform duration-200 hover:scale-110 cursor-pointer"
                      >
                        <Plus size={18} strokeWidth={2.4} />
                      </button>

                      {/* Tag sutil no rodapé da foto */}
                      <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold text-[#294D33] font-sans">
                        {psi.crp}
                      </span>
                    </div>

                    {/* Informações na base do card */}
                    <div className="pt-4 text-left">
                      <h3 className="font-serif text-xl font-semibold text-[#294D33] leading-tight">
                        {psi.nome}
                      </h3>
                      <p className="text-sm font-medium text-[#516B55] mt-1 font-sans">
                        {psi.subtitulo}
                      </p>
                      <p className="text-xs font-semibold text-[#A8435F] mt-1.5 font-sans">
                        {psi.social}
                      </p>
                    </div>
                  </div>

                  {/* VERSO DO CARD (MENSAGEM DO PSICÓLOGO) */}
                  <div
                    className={`absolute inset-0 rounded-[1.75rem] ${psi.cardBg} p-6 flex flex-col justify-between border border-[#294D33]/20 shadow-md [transform:rotateY(180deg)] [backface-visibility:hidden]`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#294D33]/15">
                        <div className="text-left">
                          <h3 className="font-serif text-xl font-semibold text-[#294D33] leading-tight">
                            {psi.nome}
                          </h3>
                          <p className="text-xs font-medium text-[#516B55] mt-0.5 font-sans">
                            {psi.cargo} &bull; {psi.crp}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleCard(psi.loopKey)}
                          aria-label={`Voltar para foto de ${psi.nome}`}
                          className="w-10 h-10 rounded-full bg-white text-[#294D33] hover:bg-[#FCF7F9] shadow-sm flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-110 cursor-pointer"
                        >
                          <Minus size={18} strokeWidth={2.4} />
                        </button>
                      </div>

                      <div className="mt-5 text-left">
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#A8435F] mb-2">
                          <HeartHandshake size={14} />
                          <span>Mensagem para você</span>
                        </div>
                        <p className="font-serif italic text-[15px] sm:text-base text-[#294D33] leading-relaxed">
                          “{psi.mensagem}”
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#294D33]/10 flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#516B55] font-sans">
                        {psi.social}
                      </span>
                      <Link
                        to="/cadastro"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#294D33] text-white px-4 py-2 text-xs font-semibold hover:bg-[#1f3c27] transition"
                      >
                        <span>Agendar</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Setas de navegação abaixo (como na referência) */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => scrollByCard("prev")}
            aria-label="Especialista anterior"
            className="w-11 h-11 rounded-full border border-[#E8A9BB] bg-white text-[#294D33] hover:bg-[#F4DDE5] flex items-center justify-center transition cursor-pointer shadow-2xs"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard("next")}
            aria-label="Próxima especialista"
            className="w-11 h-11 rounded-full border border-[#E8A9BB] bg-white text-[#294D33] hover:bg-[#F4DDE5] flex items-center justify-center transition cursor-pointer shadow-2xs"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
