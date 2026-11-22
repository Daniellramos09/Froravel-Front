import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Stethoscope, Building2, HandHeart } from "lucide-react";
import useScrollReveal from "../../Components/Effects/useScrollReveal";
import Sobre from "./SobreScreen";
import MissaoVisaoValoresSection from "../../Components/LandingPage/MissaoVisaoValoresSection";
import JourneySection from "../../Components/LandingPage/JourneySection";
import FeaturesBentoSection from "../../Components/LandingPage/FeaturesBentoSection";
import ProfessionalsSection from "../../Components/LandingPage/ProfessionalsSection";
import PsychologistsFlipSection from "../../Components/LandingPage/PsychologistsFlipSection";
import CorporateSection from "../../Components/LandingPage/CorporateSection";
import PartnershipSection from "../../Components/LandingPage/PartnershipSection";
import Depoimentos from "./DepoimentosScreen";
import Contato from "./ContatoScreen";

function PageShell({ children }) {
  const rootRef = useRef(null);
  useScrollReveal(rootRef);
  return (
    <div ref={rootRef} className="bg-[#FCF7F9] text-[#294D33] pt-20 sm:pt-24 selection:bg-[#F4DDE5] selection:text-[#294D33]">
      {children}
    </div>
  );
}

/**
 * Rota /explorar — Hub de caminhos para Mães, Profissionais, Empresas e Apoiadores + Jornada & Recursos completos.
 */
export function ExplorarPage() {
  const caminhos = [
    {
      titulo: "Espaço da Mãe",
      desc: "Diário emocional, triagem EPDS e rodas gratuitas.",
      to: "/cadastro",
    },
    {
      titulo: "Psicologia Perinatal",
      desc: "Rede ética com repasse justo e vagas sociais.",
      to: "/profissionais",
    },
    {
      titulo: "Florável Corporate (B2B)",
      desc: "Acolhimento pós-licença e indicadores com K-Anonimato.",
      to: "/empresas",
    },
    {
      titulo: "Impacto Social & ESG",
      desc: "Fundo solidário e histórias reais de transformação.",
      to: "/impacto",
    },
  ];

  return (
    <PageShell>
      <section className="py-12 sm:py-16 bg-[#FCF7F9]">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="max-w-2xl text-left mb-10">
            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#294D33] leading-[1.1]">
              Escolha o caminho ideal para{" "}
              <span className="italic text-[#A8435F]">o seu momento.</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caminhos.map((item, idx) => (
              <Link
                key={item.titulo}
                to={item.to}
                className="group rounded-2xl bg-white/80 hover:bg-white border border-[#294D33]/10 hover:border-[#294D33]/25 px-6 py-5 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-sm flex items-center justify-between gap-4 text-left"
              >
                <div className="flex items-baseline gap-4 min-w-0">
                  <span className="font-serif text-2xl text-[#A8435F]/75 group-hover:text-[#A8435F] transition-colors duration-300 shrink-0">
                    0{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-serif text-xl font-normal text-[#294D33] leading-snug">
                      {item.titulo}
                    </h2>
                    <p className="mt-1 text-sm text-[#516B55] font-sans truncate">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <span className="w-9 h-9 rounded-full border border-[#294D33]/15 text-[#294D33] group-hover:bg-[#294D33] group-hover:text-white group-hover:border-[#294D33] flex items-center justify-center shrink-0 transition-all duration-300">
                  <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <JourneySection />
      <FeaturesBentoSection />
    </PageShell>
  );
}

/**
 * Rota /sobre — Manifesto, história, missão, visão e valores.
 */
export function SobrePage() {
  return (
    <PageShell>
      <Sobre />
      <MissaoVisaoValoresSection />
    </PageShell>
  );
}

/**
 * Rota /profissionais — Psicólogos com Flip Cards + Modelo de repasse justo e credenciamento.
 */
export function ProfissionaisPage() {
  return (
    <PageShell>
      <PsychologistsFlipSection />
      <ProfessionalsSection />
    </PageShell>
  );
}

/**
 * Rota /empresas — Florável Corporate (B2B, RH, ROI e LGPD).
 */
export function EmpresasPage() {
  return (
    <PageShell>
      <CorporateSection />
    </PageShell>
  );
}

/**
 * Rota /impacto — Parcerias ESG, Apoie a Florável e Depoimentos completos.
 */
export function ImpactoPage() {
  return (
    <PageShell>
      <PartnershipSection />
      <Depoimentos />
    </PageShell>
  );
}

/**
 * Rota /contato — Canal de contato e suporte.
 */
export function ContatoPage() {
  return (
    <PageShell>
      <Contato />
    </PageShell>
  );
}
