import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { APP_LINKS } from "../../../utils/appLinks";

const TRANSFORMATION_STEPS = [
  {
    step: "01",
    label: "Descompressão Imediata",
    before: "Sobrecarga constante e sensação de precisar dar conta de tudo sozinha.",
    after: "Pausas guiadas de 1 minuto e check-in emocional sem obrigação de rotina.",
    accent: "#D98A9C",
  },
  {
    step: "02",
    label: "Clareza sem Diagnósticos Frios",
    before: "Culpa silenciosa ao sentir tristeza, exaustão ou ambivalência no puerpério.",
    after: "Autoavaliação acolhedora baseada na Escala de Edimburgo (EPDS) e diário seguro.",
    accent: "#6E9473",
  },
  {
    step: "03",
    label: "Rede Viva e Acompanhamento",
    before: "Isolamento materno e dificuldade de encontrar psicólogas especializadas.",
    after: "Rodas de conversa gratuitas entre mães e terapia perinatal com valor social.",
    accent: "#294D33",
  },
];

const PLATFORM_PILLARS = [
  {
    id: "diario",
    index: "01",
    category: "Autocuidado Diário",
    title: "Diário Emocional & Mapa de Leveza",
    description:
      "Um refúgio íntimo para desabafar no seu ritmo. Sem notificações invasivas, sem metas de frequência e com criptografia de ponta a ponta.",
    chips: ["100% Gratuito", "Criptografia Total", "Sem Metas Diárias"],
    ctaLabel: "Começar meu diário",
    ctaHref: "/cadastro",
    isInternal: true,
    surface: "bg-white",
  },
  {
    id: "epds",
    index: "02",
    category: "Ciência & Rastreio",
    title: "Triagem Acolhedora EPDS (OMS)",
    description:
      "Rastreio confidencial de 3 minutos baseado na Escala de Depressão Pós-Parto de Edimburgo para compreender o nível da sua sobrecarga emocional.",
    chips: ["Escala Validada OMS", "Sigilo Absoluto", "Orientação Imediata"],
    ctaLabel: "Fazer triagem gratuita",
    isTriagemModal: true,
    surface: "bg-[#F4DDE5]/40",
  },
  {
    id: "rodas",
    index: "03",
    category: "Comunidade Materna",
    title: "Rodas de Conversa Semanais",
    description:
      "Encontros virtuais ao vivo entre mães, mediados por psicólogas perinatais, para trocar vivências reais sem tabus nem julgamentos.",
    chips: ["Quartas às 19h", "Acesso Gratuito", "Mediação Clínica"],
    ctaLabel: "Participar da próxima roda",
    ctaHref: "/cadastro",
    isInternal: true,
    surface: "bg-white",
  },
  {
    id: "capsula",
    index: "04",
    category: "Memória & Identidade",
    title: "Cápsula do Tempo (Cofre de 365 Dias)",
    description:
      "Escreva uma carta para a mulher que você será daqui a 1 ano. Guardamos em cofre digital lacrado e entregamos quando o ciclo se completar.",
    chips: ["Lacrada por 1 Ano", "Resgate de Identidade", "Disponível no App"],
    ctaLabel: "Escrever minha carta",
    ctaHref: APP_LINKS.mae,
    isInternal: false,
    surface: "bg-[#EBF1ED]/75",
  },
];

export default function OrionixTransformationPillars({ onOpenTriagem }) {
  return (
    <section
      id="orionix-pilares"
      className="py-24 sm:py-32 px-4 sm:px-8 lg:px-12 bg-[#F9F8F6] border-t border-[#294D33]/8"
    >
      <div className="mx-auto max-w-[1560px] space-y-24">
        {/* ===================================================================
            PART 1: ORIONIX "SECTION - PROGRESS" ADAPTATION
            ("Da sobrecarga silenciosa ao espaço de respiro em 3 movimentos")
        =================================================================== */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14 text-left">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#294D33]/8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_-8px_rgba(0,0,0,0.06)]">
                <span
                  className="w-2 h-2 rounded-full bg-[#6E9473]"
                  style={{ boxShadow: "0 0 6px rgba(110, 148, 115, 0.7)" }}
                />
                <span className="text-xs font-medium text-[#1F3A27]">
                  Transformação Real &middot; Do Peso ao Respiro
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] font-normal text-[#1F3A27] leading-[1.08] tracking-[-0.03em]">
                Da sobrecarga silenciosa{" "}
                <span className="italic font-serif text-[#6E9473] block sm:inline">
                  à clareza emocional.
                </span>
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#3A443E] max-w-md leading-relaxed">
              Cada ferramenta da Florável foi desenhada para caber na rotina real de quem cuida, respeitando o seu tempo e a sua energia.
            </p>
          </div>

          {/* 3-Column Orionix Progress Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRANSFORMATION_STEPS.map((item) => (
              <div
                key={item.step}
                className="rounded-[28px] bg-white border border-[#294D33]/8 p-7 sm:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_20px_40px_-20px_rgba(41,77,51,0.07)] flex flex-col justify-between text-left"
              >
                <div>
                  {/* Orionix Step Icon/Dot Header */}
                  <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#294D33]/8">
                    <span className="font-mono text-xs font-semibold text-[#516B55] tracking-widest">
                      MOVIMENTO {item.step}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map((dotIdx) => (
                        <span
                          key={dotIdx}
                          className="w-2 h-2 rounded-full transition-colors"
                          style={{
                            backgroundColor:
                              dotIdx < Number(item.step)
                                ? item.accent
                                : "rgba(41, 77, 51, 0.14)",
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <h3 className="font-serif text-2xl text-[#1F3A27] mb-4">
                    {item.label}
                  </h3>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-[#F9F8F6] border border-[#294D33]/6">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-[#656565] mb-1">
                        Como costuma pesar
                      </p>
                      <p className="text-xs sm:text-sm text-[#3A443E] leading-relaxed">
                        {item.before}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#EBF1ED]/60 border border-[#6E9473]/25">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-[#294D33] font-semibold mb-1">
                        Com a Florável
                      </p>
                      <p className="text-xs sm:text-sm text-[#1F3A27] font-medium leading-relaxed">
                        {item.after}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===================================================================
            PART 2: PILARES DA PLATAFORMA (ORIONIX BENTO & CAPSULE SHOWCASE)
        =================================================================== */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 text-left">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#294D33]/8 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#D98A9C]" />
                <span className="text-xs font-medium text-[#1F3A27]">
                  Pilares da Plataforma &middot; Ecossistema Materno
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1F3A27] leading-[1.1] tracking-[-0.025em]">
                Tudo o que você precisa,{" "}
                <span className="italic font-serif text-[#D98A9C]">
                  em um só lugar.
                </span>
              </h2>
            </div>

            <div className="flex items-center gap-2.5 bg-white px-4 py-2.5 rounded-full border border-[#294D33]/10 shadow-2xs">
              <Sparkles className="w-4 h-4 text-[#D98A9C]" />
              <span className="text-xs font-medium text-[#294D33]">
                Programa de Flores Solidárias integrado ao seu autocuidado
              </span>
            </div>
          </div>

          {/* 2x2 Orionix Architectural Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {PLATFORM_PILLARS.map((pillar) => (
              <div
                key={pillar.id}
                className={`${pillar.surface} rounded-[28px] sm:rounded-[32px] border border-[#294D33]/10 p-7 sm:p-9 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_20px_40px_-20px_rgba(41,77,51,0.06)] flex flex-col justify-between text-left transition-all duration-300 hover:border-[#294D33]/25`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <span className="px-3.5 py-1 rounded-full bg-white text-[11px] font-semibold text-[#294D33] border border-[#294D33]/10">
                      {pillar.category}
                    </span>
                    <span className="font-mono text-sm text-[#6E9473] font-semibold">
                      /{pillar.index}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#1F3A27] leading-snug mb-3">
                    {pillar.title}
                  </h3>

                  <p className="text-sm sm:text-[15px] text-[#3A443E] leading-relaxed mb-6">
                    {pillar.description}
                  </p>

                  {/* Orionix Pill Chips */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {pillar.chips.map((chip) => (
                      <span
                        key={chip}
                        className="px-3.5 py-1.5 rounded-full bg-white text-xs font-medium text-[#1F3A27] border border-[#294D33]/8 shadow-2xs"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-5 border-t border-[#294D33]/10 flex items-center justify-between">
                  {pillar.isTriagemModal ? (
                    <button
                      type="button"
                      onClick={onOpenTriagem}
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#294D33] hover:text-[#6E9473] transition cursor-pointer"
                    >
                      <span>{pillar.ctaLabel}</span>
                      <ArrowUpRight size={16} />
                    </button>
                  ) : pillar.isInternal ? (
                    <Link
                      to={pillar.ctaHref}
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#294D33] hover:text-[#6E9473] transition"
                    >
                      <span>{pillar.ctaLabel}</span>
                      <ArrowUpRight size={16} />
                    </Link>
                  ) : (
                    <a
                      href={pillar.ctaHref}
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#294D33] hover:text-[#6E9473] transition"
                    >
                      <span>{pillar.ctaLabel}</span>
                      <ArrowUpRight size={16} />
                    </a>
                  )}

                  <span className="text-[11px] text-[#516B55]">Espaço da Mãe</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
