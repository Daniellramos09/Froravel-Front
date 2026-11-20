import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./NovaLandingOrionix.css";
import SmoothScroll from "../../Components/Effects/SmoothScroll";
import OrionixNavbar from "./components/OrionixNavbar";
import OrionixHero from "./components/OrionixHero";
import OrionixManifesto from "./components/OrionixManifesto";
import OrionixMotherJourney from "./components/OrionixMotherJourney";
import OrionixTransformationPillars from "./components/OrionixTransformationPillars";
import OrionixPsychologists from "./components/OrionixPsychologists";
import OrionixCorporateSection from "./components/OrionixCorporateSection";
import OrionixPurposeAndVoices from "./components/OrionixPurposeAndVoices";
import OrionixFaqAndFooter from "./components/OrionixFaqAndFooter";
import {
  TriagemModal,
  PartnerModal,
  CorporateEsgModal,
} from "./components/OrionixModals";

export default function NovaLandingScreen() {
  const { hash } = useLocation();
  const [triagemOpen, setTriagemOpen] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [corpEsgModal, setCorpEsgModal] = useState({
    open: false,
    mode: "corporate",
  });

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace("#", "");
      const timer = setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "instant", block: "start" });
        }
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [hash]);

  return (
    <SmoothScroll>
      <div className="orionix-landing-root min-h-screen bg-[#F9F8F6] text-[#1F3A27] font-sans selection:bg-[#F4DDE5] selection:text-[#1F3A27]">
        {/* 01. Navegação Estilo Orionix */}
        <OrionixNavbar onOpenTriagem={() => setTriagemOpen(true)} />

        <main>
          {/* 01. Hero Editorial + Faixa Contínua (MÃE) */}
          <OrionixHero onOpenTriagem={() => setTriagemOpen(true)} />

          {/* 02. Apresentação da Proposta & Protagonismo da Mãe */}
          <OrionixManifesto />

          {/* 03/04. SEÇÃO INTERATIVA PRINCIPAL — JORNADA DA MÃE (Sticky Scroll 01 -> 04) */}
          <OrionixMotherJourney onOpenTriagem={() => setTriagemOpen(true)} />

          {/* 05. Transformação & Pilares da Plataforma */}
          <OrionixTransformationPillars onOpenTriagem={() => setTriagemOpen(true)} />

          {/* 06. Para Psicólogos — Rede de Acolhimento Perinatal */}
          <OrionixPsychologists onOpenPartnerModal={() => setPartnerOpen(true)} />

          {/* 07. Para Empresas e RH — Florável Corporativo */}
          <OrionixCorporateSection
            onOpenCorporateModal={() =>
              setCorpEsgModal({ open: true, mode: "corporate" })
            }
          />

          {/* 08. Propósito, Impacto Social (ESG) & Relatos Reais */}
          <OrionixPurposeAndVoices
            onOpenEsgModal={() => setCorpEsgModal({ open: true, mode: "esg" })}
          />

          {/* 09. Perguntas Frequentes (FAQ) + CTA Final & Rodapé */}
          <OrionixFaqAndFooter
            onOpenTriagem={() => setTriagemOpen(true)}
            onOpenCorporateModal={() =>
              setCorpEsgModal({ open: true, mode: "corporate" })
            }
          />
        </main>

        {/* Modais Interativos do Ecossistema */}
        <TriagemModal
          isOpen={triagemOpen}
          onClose={() => setTriagemOpen(false)}
        />
        <PartnerModal
          isOpen={partnerOpen}
          onClose={() => setPartnerOpen(false)}
        />
        <CorporateEsgModal
          isOpen={corpEsgModal.open}
          mode={corpEsgModal.mode}
          onClose={() => setCorpEsgModal({ open: false, mode: "corporate" })}
        />
      </div>
    </SmoothScroll>
  );
}
