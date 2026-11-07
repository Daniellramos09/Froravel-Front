import React from "react";
import { HeartHandshake, Eye, Network } from "lucide-react";

export default function PilaresSection() {
  const pilares = [
    {
      step: "01",
      title: "Acolher",
      desc: "Criar um espaço de escuta, troca e pertencimento, onde mães possam compartilhar experiências e perceber que não precisam passar pela maternidade sozinhas.",
      icon: HeartHandshake,
      accent: "#E8A9BB",
      accentBg: "#F4DDE5",
    },
    {
      step: "02",
      title: "Perceber",
      desc: "Ajudar cada mãe a olhar também para si, reconhecer seus sentimentos e necessidades e encontrar informações que façam sentido para o momento que está vivendo.",
      icon: Eye,
      accent: "#6E9473",
      accentBg: "#EBF3ED",
    },
    {
      step: "03",
      title: "Conectar",
      desc: "Aproximar mães de profissionais, redes de apoio, projetos parceiros, recursos e serviços que possam ajudá-las quando precisarem de outros caminhos de cuidado.",
      icon: Network,
      accent: "#294D33",
      accentBg: "#E4DAD5",
    },
  ];

  return (
    <section
      id="pilares"
      aria-label="Nossos pilares"
      className="relative bg-[#FCF7F9] py-20 sm:py-28 lg:py-32 border-t border-[#E8A9BB]/30 overflow-hidden"
    >
      {/* Luz ambiente difusa */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[46rem] h-[36rem] rounded-full bg-[#F4DDE5]/30 blur-[140px] -z-10"
      />

      <div className="max-w-[1560px] mx-auto px-6 lg:px-12 relative z-10">
        {/* Cabeçalho inspirado em Orionix: 'From Complexity to Clarity in 3 Steps' */}
        <div className="sr-group max-w-3xl mb-14 sm:mb-20 text-left">
          {/* Top Badge com Ponto Rosa / Verde */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#294D33]/10 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_-8px_rgba(0,0,0,0.06)] mb-5">
            <span
              className="w-2 h-2 rounded-full bg-[#E8A9BB]"
              style={{ boxShadow: "0 0 8px rgba(232, 169, 187, 0.9)" }}
            />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] text-[#294D33]">
              Nossos Pilares
            </span>
          </div>

          <h2 className="font-serif text-[32px] sm:text-[44px] lg:text-[56px] font-normal text-[#294D33] leading-[1.08] tracking-[-0.025em]">
            Da sobrecarga ao acolhimento{" "}
            <span className="italic font-serif text-[#D98A9C] block sm:inline">
              em 3 pilares essenciais.
            </span>
          </h2>
        </div>

        {/* Grade dos 3 Pilares (idêntica ao Orionix Project Grid: ícones circulares 96px com sombra multi-camada) */}
        <div className="sr-group grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 lg:gap-16 text-left">
          {pilares.map((pilar) => {
            const Icon = pilar.icon;
            return (
              <div
                key={pilar.step}
                className="group flex flex-col items-start transition-all duration-300"
              >
                {/* Ícone Circular 96px com box-shadow multicamada do Orionix */}
                <div className="mb-7 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white flex items-center justify-center shadow-[0px_0px_0px_1px_rgba(0,0,0,0.04),0px_1px_2px_0px_rgba(0,0,0,0.08),0px_4px_6px_0px_rgba(0,0,0,0.04),0px_24px_40px_-16px_rgba(0,0,0,0.08)] transition-transform duration-500 ease-out group-hover:scale-105">
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-colors duration-300"
                    style={{ backgroundColor: pilar.accentBg }}
                  >
                    <Icon
                      size={24}
                      strokeWidth={1.8}
                      style={{ color: pilar.accent }}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </div>

                {/* Título do Pilar (Fraunces 40px no desktop, 30px no mobile) */}
                <h3 className="font-serif text-[28px] sm:text-[34px] lg:text-[40px] font-normal text-[#1F3A27] leading-[1.12] tracking-[-0.02em] mb-3">
                  {pilar.title}
                </h3>

                {/* Descrição com tipografia Orionix */}
                <p className="text-[15px] sm:text-base lg:text-[17px] text-[#4A5E4D] leading-[1.6] font-sans max-w-md">
                  {pilar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
