import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import ScrollProgress from "../../Components/Effects/ScrollProgress";
import useScrollReveal from "../../Components/Effects/useScrollReveal";
import HeroSection from "../../Components/LandingPage/HeroSection";
import {
  ContextoHomeSection,
  ComoAjudaPreviewSection,
  ConviteFinalSection,
} from "../../Components/LandingPage/HomeSummarySections";
import PilaresSection from "../../Components/LandingPage/PilaresSection";
import PsychologistsFlipSection from "../../Components/LandingPage/PsychologistsFlipSection";

export default function Landing() {
  const { state } = useLocation();
  const rootRef = useRef(null);
  useScrollReveal(rootRef);

  // Rola até a seção caso tenha vindo de outra rota com state.scrollTo
  useEffect(() => {
    if (state?.scrollTo) {
      const el = document.getElementById(state.scrollTo);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [state]);

  return (
    <div ref={rootRef} className="bg-[#FCF7F9] text-[#294D33] selection:bg-[#F4DDE5] selection:text-[#294D33]">
      <ScrollProgress />

      {/* 1. Hero — Mensagem curta de acolhimento + CTA principal */}
      <section id="inicio">
        <HeroSection />
      </section>

      {/* 2. Contexto — Breve apresentação da necessidade de cuidado materno */}
      <ContextoHomeSection />

      {/* 3. Três Pilares — Acolher, Perceber e Conectar */}
      <section id="pilares">
        <PilaresSection />
      </section>

      {/* 4. Como a Florável ajuda + Psicólogos (Flip Cards com + e mensagem de acolhimento) */}
      <section id="recursos">
        <ComoAjudaPreviewSection />
      </section>

      <section id="psicologos">
        <PsychologistsFlipSection />
      </section>

      {/* 5. Depoimento em destaque + Convite Final ("Para que nenhuma mãe floresça sozinha") */}
      <ConviteFinalSection />
    </div>
  );
}
