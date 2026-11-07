import React from "react";
import { ArrowUpRight, HeartHandshake } from "lucide-react";

const MOTHER_VOICES = [
  {
    quote:
      "Eu achava que a vontade de chorar no fim da tarde era fraqueza. A autoavaliação da Florável me mostrou que o que eu sentia tinha nome e que pedir apoio é coragem, não culpa.",
    name: "Camila Moura",
    role: "Puérpera · Bebê de 4 meses",
    tag: "Triagem EPDS & Diário",
    photo: "/img/1.jpg",
  },
  {
    quote:
      "Nas Rodas de Conversa encontrei mulheres que sentiam o mesmo medo da solidão que eu. Pela primeira vez na gravidez, senti que não precisava fingir plenitude o tempo todo.",
    name: "Renata Silveira",
    role: "Gestante · 32ª semana",
    tag: "Rodas Comunitárias",
    photo: "/img/fotoMae/fotomae5.jpg",
  },
  {
    quote:
      "Minha empresa ofereceu a Florável como benefício. O suporte da psicóloga perinatal me deu chão para lidar com a ansiedade da separação e a volta ao escritório.",
    name: "Juliana Ferreira",
    role: "Retorno da licença · 6 meses",
    tag: "Florável Corporativo",
    photo: "/img/3.jpg",
  },
];

export default function OrionixPurposeAndVoices({ onOpenEsgModal }) {
  return (
    <section
      id="orionix-proposito"
      className="py-24 sm:py-32 px-4 sm:px-8 lg:px-12 bg-[#F9F8F6] border-t border-[#294D33]/8"
    >
      <div className="mx-auto max-w-[1560px] space-y-24">
        {/* ===================================================================
            PART 1: PROPÓSITO E IMPACTO SOCIAL (FUNDO DE ACOLHIMENTO ESG)
            (Sem estatísticas inventadas — foco no mecanismo real de impacto)
        =================================================================== */}
        <div className="rounded-[32px] sm:rounded-[40px] bg-[#1F3A27] text-[#FCF7F9] p-8 sm:p-12 lg:p-16 shadow-[0_28px_60px_-20px_rgba(20,40,26,0.3)] relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#D98A9C]/15 blur-[110px]"
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/15">
                <span
                  className="w-2 h-2 rounded-full bg-[#D98A9C]"
                  style={{ boxShadow: "0 0 8px rgba(217, 138, 156, 0.8)" }}
                />
                <span className="text-xs font-medium text-white">
                  Propósito &amp; Impacto Social &middot; Alianças ESG
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] font-normal text-white leading-[1.08] tracking-[-0.025em]">
                Conectando marcas conscientes à{" "}
                <span className="italic font-serif text-[#F4DDE5]">
                  proteção da saúde materna.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl">
                Por meio do <strong className="text-white font-semibold">Fundo de Acolhimento Florável</strong>, empresas parceiras patrocinam sessões psicológicas gratuitas para mães em vulnerabilidade socioeconômica e apoiam a formação continuada em psicologia perinatal.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={onOpenEsgModal}
                  className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-[#D98A9C] hover:bg-[#F4DDE5] text-[#1F3A27] text-xs sm:text-sm font-semibold transition cursor-pointer shadow-md"
                >
                  <span>Ser uma empresa parceira ESG</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>

            {/* Right: 2 Concrete ESG Action Pillars (No Fake Numbers) */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <div className="rounded-3xl bg-white/8 backdrop-blur-xs border border-white/15 p-6 sm:p-7">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-[#F4DDE5] uppercase tracking-wider">
                    Frente Social 01
                  </span>
                  <HeartHandshake size={18} className="text-[#D98A9C]" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-white mb-2">
                  Fundo de Acolhimento Solidário
                </h3>
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                  Custeio direto de atendimentos clínicos perinatais para mulheres que atravessam o puerpério sem recursos financeiros, com prestação de contas transparente.
                </p>
              </div>

              <div className="rounded-3xl bg-white/8 backdrop-blur-xs border border-white/15 p-6 sm:p-7">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-[#F4DDE5] uppercase tracking-wider">
                    Frente Social 02
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#6E9473]" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-white mb-2">
                  Bolsas em Saúde Perinatal
                </h3>
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                  Apoio à capacitação de psicólogas de regiões periféricas para ampliar a escuta qualificada sobre baby blues, depressão pós-parto e luto materno.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            PART 2: RELATOS REAIS DE MÃES (Modeled on Orionix Section - Client)
        =================================================================== */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14 text-left">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#294D33]/8 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#D98A9C]" />
                <span className="text-xs font-medium text-[#1F3A27]">
                  Vozes Reais &middot; Relatos de Mães
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#1F3A27] leading-[1.08] tracking-[-0.03em]">
                Histórias de quem encontrou{" "}
                <span className="italic font-serif text-[#D98A9C]">
                  espaço para respirar.
                </span>
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#3A443E] max-w-md leading-relaxed">
              Mulheres reais que encontraram na Florável acolhimento emocional, rede comunitária e escuta profissional livre de julgamentos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {MOTHER_VOICES.map((voice, idx) => (
              <article
                key={voice.name}
                className="rounded-[28px] sm:rounded-[32px] bg-white border border-[#294D33]/8 p-7 sm:p-9 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_20px_40px_-20px_rgba(41,77,51,0.06)] flex flex-col justify-between text-left"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="px-3.5 py-1 rounded-full bg-[#F4DDE5]/55 text-[11px] font-semibold text-[#294D33]">
                      {voice.tag}
                    </span>
                    <span className="font-mono text-xs text-[#6E9473]">
                      0{idx + 1}
                    </span>
                  </div>

                  <p className="font-serif text-lg sm:text-xl text-[#1F3A27] leading-relaxed mb-8">
                    &ldquo;{voice.quote}&rdquo;
                  </p>
                </div>

                {/* Orionix Divider + Profile Row */}
                <div className="pt-5 border-t border-[#294D33]/10 flex items-center gap-3.5">
                  <img
                    src={voice.photo}
                    alt={voice.name}
                    className="w-12 h-12 rounded-full object-cover border border-[#D98A9C]/60 shrink-0"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/img/1.jpg";
                    }}
                  />
                  <div>
                    <h3 className="text-sm font-bold text-[#1F3A27]">
                      {voice.name}
                    </h3>
                    <p className="text-xs text-[#516B55]">{voice.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
