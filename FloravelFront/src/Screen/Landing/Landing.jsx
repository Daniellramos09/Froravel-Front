import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import ScrollProgress from "../../Components/Effects/ScrollProgress";
import BrandMarquee from "../../Components/Effects/BrandMarquee";
import useScrollReveal from "../../Components/Effects/useScrollReveal";
import HeroSection from "../../Components/LandingPage/HeroSection";
import Sobre from "./SobreScreen";
import JourneySection from "../../Components/LandingPage/JourneySection";
import FeaturesBentoSection from "../../Components/LandingPage/FeaturesBentoSection";
import ProfessionalsSection from "../../Components/LandingPage/ProfessionalsSection";
import CorporateSection from "../../Components/LandingPage/CorporateSection";
import PartnershipSection from "../../Components/LandingPage/PartnershipSection";
import Depoimentos from "./DepoimentosScreen";
import Contato from "./ContatoScreen";
 
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

      {/* 1. Hero Section Editorial (Preservada com círculo botânico & figura recortada) */}
      <section id="inicio">
        <HeroSection />
      </section>

      <BrandMarquee />

      {/* 2. Manifesto Emocional & Filosofia da Marca (Split-Screen de alto impacto visual) */}
      <section id="sobre">
        <Sobre />
      </section>

      {/* 3. A Jornada da Mãe (Visual, intuitiva, ilustrada com setas, mockups e folder cards) */}
      <section id="jornada">
        <JourneySection />
      </section>

      {/* 4. Funcionalidades da Plataforma (Bento Grid Editorial & Seletor de Humor Interativo) */}
      <section id="recursos">
        <FeaturesBentoSection />
      </section>

      {/* 5. Clínica com Propósito (Para Psicólogos e Terapeutas B2B2C com fotos reais) */}
      <section id="psicologos">
        <ProfessionalsSection />
      </section>

      {/* 6. Florável Corporate (B2B - Mini Dashboard RH & Retenção de Talentos) */}
      <section id="corporate">
        <CorporateSection />
      </section>

      {/* 7. Alianças ESG e Patrocínios Sociais (Bloco Imersivo Verde Escuro #294D33) */}
      <section id="esg">
        <PartnershipSection />
      </section>

      {/* 8. Vozes Reais & Depoimentos (Cards com fotos reais de mães da pasta fotoMae) */}
      <section id="depoimentos">
        <Depoimentos />
      </section>

      {/* 9. Canal de Contato & Acolhimento */}
      <section id="contato">
        <Contato />
      </section>

    </div>
  );
}
