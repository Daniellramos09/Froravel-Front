import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Stethoscope, Building2, HandHeart, Sparkles } from "lucide-react";
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
      icon: Heart,
      publico: "Mães & Gestantes",
      titulo: "Acolhimento, Diário e Rodas",
      desc: "Triagem confidencial (EPDS), diário emocional gratuito, rodas de conversa semanais e psicólogas acessíveis.",
      to: "/cadastro",
      cta: "Acessar Espaço da Mãe",
      bg: "bg-[#F4DDE5]/70",
      border: "border-[#E8A9BB]",
    },
    {
      icon: Stethoscope,
      publico: "Profissionais",
      titulo: "Psicologia Perinatal com Propósito",
      desc: "Honorários de R$ 40 a R$ 200, apenas 5% de taxa da plataforma, vagas sociais e captação ética via rodas.",
      to: "/profissionais",
      cta: "Para Profissionais",
      bg: "bg-[#EBF1ED]",
      border: "border-[#516B55]/30",
    },
    {
      icon: Building2,
      publico: "Empresas & RH",
      titulo: "Florável Corporate (B2B)",
      desc: "Retenção de talentos no pós-licença, indicadores agregados de clima (K-Anonimato) e conformidade LGPD.",
      to: "/empresas",
      cta: "Para Empresas",
      bg: "bg-white",
      border: "border-[#E8A9BB]/50",
    },
    {
      icon: HandHeart,
      publico: "Parceiros & Apoiadores",
      titulo: "Impacto Social & ESG",
      desc: "Apoie o Fundo Social Florável, patrocine atendimentos gratuitos e conheça depoimentos reais de transformação.",
      to: "/impacto",
      cta: "Apoiar e ver Impacto",
      bg: "bg-[#F4DDE5]/45",
      border: "border-[#E8A9BB]/60",
    },
  ];

  return (
    <PageShell>
      <section className="py-14 sm:py-20 bg-[#FCF7F9]">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="max-w-3xl text-left mb-12">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4DDE5] text-[#294D33] text-[11px] uppercase tracking-[0.2em] font-semibold">
              <Sparkles size={13} />
              Explorar a Florável
            </span>
            <h1 className="mt-4 font-serif text-3xl sm:text-5xl font-normal text-[#294D33] leading-[1.1]">
              Escolha o caminho ideal para{" "}
              <span className="italic text-[#A8435F]">o seu momento.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#3A443E] leading-relaxed font-sans">
              Reunimos aqui todos os recursos da plataforma, a jornada completa da mãe e as áreas dedicadas para especialistas, empresas e apoiadores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {caminhos.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.publico}
                  to={item.to}
                  className={`rounded-[1.75rem] ${item.bg} border ${item.border} p-6 flex flex-col justify-between text-left transition hover:-translate-y-1 hover:shadow-md group`}
                >
                  <div>
                    <div className="w-11 h-11 rounded-2xl bg-white text-[#294D33] flex items-center justify-center shadow-2xs mb-4">
                      <Icon size={21} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#516B55]">
                      {item.publico}
                    </span>
                    <h2 className="mt-1 font-serif text-xl font-semibold text-[#294D33] leading-snug">
                      {item.titulo}
                    </h2>
                    <p className="mt-2 text-sm text-[#3A443E] leading-relaxed font-sans">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-[#294D33] group-hover:text-[#A8435F] transition">
                    <span>{item.cta}</span>
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
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
