import React from "react";
import { ArrowUpRight } from "lucide-react";

const EDITORIAL_CARDS = [
  {
    index: "01",
    title: "Antes de ser mãe, você é você.",
    subtitle: "Reconexão com a própria identidade",
    description:
      "A maternidade transforma a rotina, o corpo e o sono, mas suas vontades, limites e sentimentos continuam importando. Aqui você não precisa fingir força o tempo todo.",
    tag: "Identidade Materna",
    image: "/img/fotoMae/fotomae5.jpg",
    fallback: "/img/maeDescansando.jpg",
    alt: "Mulher em momento de pausa serena e reconexão consigo mesma",
    span: "lg:col-span-7",
    aspect: "aspect-[16/11]",
  },
  {
    index: "02",
    title: "O cansaço invisível merece escuta real.",
    subtitle: "Acolhimento sem romantização",
    description:
      "Sentir ambivalência, exaustão ou vontade de chorar no fim da tarde não é fraqueza. A Florável oferece um lugar seguro para dar nome ao que pesa.",
    tag: "Puerpério Real",
    image: "/img/maeDescansando.jpg",
    fallback: "/img/hero-woman-serene.jpg",
    alt: "Mãe respirando com tranquilidade em um ambiente acolhedor",
    span: "lg:col-span-5",
    aspect: "aspect-[4/3.6]",
  },
];

export default function OrionixManifesto() {
  return (
    <section
      id="orionix-manifesto"
      className="py-20 sm:py-28 px-4 sm:px-8 lg:px-12 bg-[#F9F8F6]"
    >
      <div className="mx-auto max-w-[1560px]">
        {/* Orionix Section Header: Pill + Expressive Fraunces Title + Right Context */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-14 sm:mb-18">
          <div className="lg:col-span-7 text-left space-y-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#294D33]/8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_-8px_rgba(0,0,0,0.06)]">
              <span
                className="w-2 h-2 rounded-full bg-[#D98A9C]"
                style={{ boxShadow: "0 0 6px rgba(217, 138, 156, 0.65)" }}
              />
              <span className="text-xs font-medium text-[#1F3A27]">
                Nossa Proposta &middot; A Mãe no Centro
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-[3.35rem] font-normal text-[#1F3A27] leading-[1.08] tracking-[-0.03em]">
              Cuidar de quem cuida não é luxo.{" "}
              <span className="italic font-serif text-[#6E9473]">
                É necessidade vital.
              </span>
            </h2>
          </div>

          <div className="lg:col-span-5 text-left lg:pl-6">
            <p className="text-base sm:text-[17px] text-[#3A443E] leading-relaxed">
              Não somos um aplicativo sobre o desenvolvimento do bebê ou listas de enxoval. A Florável nasceu para proteger a saúde emocional da mulher que atravessa a gestação, o puerpério e o retorno à própria rotina.
            </p>
          </div>
        </div>

        {/* Orionix Asymmetric Project/Editorial Row (7 cols + 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {EDITORIAL_CARDS.map((card) => (
            <article
              key={card.index}
              className={`${card.span} group rounded-[28px] sm:rounded-[32px] bg-white border border-[#294D33]/8 p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_24px_48px_-24px_rgba(41,77,51,0.08)] flex flex-col justify-between transition-all duration-500 hover:border-[#6E9473]/35`}
            >
              {/* Framed Image with Orionix Thumbnail Wrap feel */}
              <div
                className={`relative w-full ${card.aspect} rounded-[20px] sm:rounded-[24px] overflow-hidden bg-[#F4DDE5]/30`}
              >
                <img
                  src={card.image}
                  alt={card.alt}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = card.fallback;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F3A27]/35 via-transparent to-transparent pointer-events-none" />

                {/* Top Floating Tag */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/92 backdrop-blur-md text-xs font-semibold text-[#1F3A27] shadow-xs">
                  <span className="font-mono text-[11px] text-[#6E9473]">{card.index}</span>
                  <span>&middot;</span>
                  <span>{card.tag}</span>
                </div>
              </div>

              {/* Orionix Card Bottom Meta Row */}
              <div className="pt-5 px-2 pb-1 text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="max-w-xl">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#6E9473] mb-1">
                    {card.subtitle}
                  </p>
                  <h3 className="font-serif text-2xl sm:text-[1.75rem] font-normal text-[#1F3A27] leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-sm text-[#3A443E] leading-relaxed mt-2">
                    {card.description}
                  </p>
                </div>

                <a
                  href="#orionix-jornada"
                  className="w-11 h-11 rounded-full bg-[#F9F8F6] group-hover:bg-[#294D33] text-[#294D33] group-hover:text-white border border-[#294D33]/10 flex items-center justify-center shrink-0 transition-colors duration-300"
                  aria-label={`Explorar: ${card.title}`}
                >
                  <ArrowUpRight size={18} />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* 3 Tactile Principles Strip (Orionix Hairline Grid) */}
        <div className="mt-8 rounded-[28px] bg-white border border-[#294D33]/8 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-[#294D33]/8 text-left">
          <div className="pt-4 first:pt-0 md:pt-0 md:px-4 first:md:pl-0">
            <div className="flex items-center gap-2 text-xs font-mono text-[#6E9473] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#6E9473]" />
              <span>PRINCÍPIO 01</span>
            </div>
            <h4 className="font-serif text-xl text-[#1F3A27] mt-2">
              Acolhimento do cansaço sem julgamentos
            </h4>
            <p className="text-xs sm:text-sm text-[#3A443E] mt-1.5 leading-relaxed">
              Um ambiente protegido de comparações e conselhos não solicitados, onde cada sentimento materno é legítimo.
            </p>
          </div>

          <div className="pt-4 md:pt-0 md:px-6">
            <div className="flex items-center gap-2 text-xs font-mono text-[#D98A9C] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#D98A9C]" />
              <span>PRINCÍPIO 02</span>
            </div>
            <h4 className="font-serif text-xl text-[#1F3A27] mt-2">
              Ferramentas gratuitas baseadas em evidências
            </h4>
            <p className="text-xs sm:text-sm text-[#3A443E] mt-1.5 leading-relaxed">
              Do Diário Emocional criptografado à Escala de Depressão Pós-Parto de Edimburgo (EPDS), sempre em linguagem acolhedora.
            </p>
          </div>

          <div className="pt-4 md:pt-0 md:px-6">
            <div className="flex items-center gap-2 text-xs font-mono text-[#294D33] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#294D33]" />
              <span>PRINCÍPIO 03</span>
            </div>
            <h4 className="font-serif text-xl text-[#1F3A27] mt-2">
              Ponte ética entre mães, psicólogas e empresas
            </h4>
            <p className="text-xs sm:text-sm text-[#3A443E] mt-1.5 leading-relaxed">
              Conectamos o cuidado individual da mãe à rede de psicologia perinatal e ao apoio corporativo no retorno ao trabalho.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
