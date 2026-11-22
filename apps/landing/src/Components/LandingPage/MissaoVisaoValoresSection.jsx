import React, { useState } from "react";

export default function MissaoVisaoValoresSection() {
  const [selectedValor, setSelectedValor] = useState(0);

  const valores = [
    {
      nome: "Acolhimento",
      desc: "Criar um espaço seguro, humano e respeitoso, onde cada mãe possa se sentir ouvida e acolhida.",
    },
    {
      nome: "Empatia",
      desc: "Compreender diferentes experiências maternas sem julgamentos.",
    },
    {
      nome: "Escuta",
      desc: "Reconhecer os sentimentos e as necessidades de cada mãe, respeitando sua individualidade.",
    },
    {
      nome: "Inclusão",
      desc: "Construir uma rede acessível a diferentes realidades e formas de viver a maternidade.",
    },
    {
      nome: "Conexão",
      desc: "Aproximar mães de outras mães, profissionais, projetos e redes de apoio que possam fazer parte do seu caminho.",
    },
    {
      nome: "Respeito",
      desc: "Reconhecer que cada maternidade é única e que não existe uma única forma de vivê-la.",
    },
    {
      nome: "Humanização",
      desc: "Manter a mãe, suas necessidades, sentimentos e dignidade no centro das decisões da Florável.",
    },
    {
      nome: "Compromisso social",
      desc: "Contribuir para ampliar o acesso a informação, acolhimento e redes de apoio, especialmente para mães em situação de vulnerabilidade.",
    },
  ];

  return (
    <section
      id="proposito"
      aria-label="Missão, Visão e Valores"
      className="relative bg-[#FCF7F9] py-20 sm:py-28 border-t border-[#E8A9BB]/30 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-left">
        <div className="max-w-3xl mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#516B55] mb-3">
            Missão, Visão & Valores
          </p>
          <h2 className="font-serif text-[32px] sm:text-[44px] lg:text-[52px] font-normal text-[#294D33] leading-[1.08] tracking-[-0.02em]">
            Onde o cuidado materno constrói um futuro{" "}
            <span className="italic text-[#A8435F]">mais seguro e acolhedor.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* CARD 1: MISSÃO */}
          <article className="rounded-2xl bg-white border border-[#294D33]/10 overflow-hidden flex flex-col transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-md">
            <div className="aspect-[16/10] w-full overflow-hidden bg-[#EBF1ED]">
              <img
                src="/img/institucional/institucional-missao.jpg"
                alt="Mãe em acolhimento e cuidado maternal com recém-nascido"
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#294D33] mb-3">
                  Missão
                </h3>
                <p className="text-sm sm:text-base text-[#3A443E] leading-[1.65] font-sans">
                  Acolher, perceber e conectar gestantes e mães no pós-parto, criando um espaço onde possam compartilhar suas experiências, compreender suas necessidades e encontrar informação, redes de apoio, profissionais e outros caminhos de cuidado, para que nenhuma mãe precise atravessar a maternidade sozinha.
                </p>
              </div>
              <p className="mt-6 pt-4 border-t border-[#294D33]/10 text-xs font-medium text-[#516B55]">
                Cuidado Integral Materno
              </p>
            </div>
          </article>

          {/* CARD 2: VISÃO */}
          <article className="rounded-2xl bg-white border border-[#294D33]/10 overflow-hidden flex flex-col transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-md">
            <div className="aspect-[16/10] w-full overflow-hidden bg-[#F4DDE5]">
              <img
                src="/img/institucional/institucional-visao.jpg"
                alt="Psicóloga perinatal em acolhimento e escuta democrática"
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#294D33] mb-3">
                  Visão
                </h3>
                <p className="text-sm sm:text-base text-[#3A443E] leading-[1.65] font-sans">
                  Ser referência em acolhimento materno, contribuindo para uma realidade em que gestantes e mães tenham acesso à informação, apoio e caminhos de cuidado, independentemente de sua condição socioeconômica.
                </p>
              </div>
              <p className="mt-6 pt-4 border-t border-[#294D33]/10 text-xs font-medium text-[#516B55]">
                Acesso Democrático & Saúde
              </p>
            </div>
          </article>

          {/* CARD 3: VALORES */}
          <article className="rounded-2xl bg-[#1F3224] text-[#FCF7F9] border border-[#1F3224] overflow-hidden flex flex-col transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-md">
            <div className="aspect-[16/10] w-full overflow-hidden bg-[#294D33]">
              <img
                src="/img/institucional/institucional-valores.jpg"
                alt="Valores éticos e acolhimento humano da Florável"
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#FCF7F9] mb-4">
                  Valores
                </h3>

                {/* Lista limpa em 2 colunas sem nuvem de pílulas */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-b border-white/15 pb-4 mb-4">
                  {valores.map((v, idx) => {
                    const isSelected = selectedValor === idx;
                    return (
                      <button
                        key={v.nome}
                        type="button"
                        onMouseEnter={() => setSelectedValor(idx)}
                        onClick={() => setSelectedValor(idx)}
                        className={`text-left text-xs sm:text-sm py-1 transition-colors duration-200 cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? "text-[#E8A9BB] font-semibold"
                            : "text-white/70 hover:text-white"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                            isSelected ? "bg-[#E8A9BB]" : "bg-white/25"
                          }`}
                        />
                        <span className="truncate">{v.nome}</span>
                      </button>
                    );
                  })}
                </div>

                <div
                  key={selectedValor}
                  className="min-h-[76px] animate-[fadeIn_0.35s_ease-out]"
                >
                  <p className="text-xs sm:text-sm text-[#E6EFE9]/90 leading-relaxed font-sans">
                    {valores[selectedValor].desc}
                  </p>
                </div>
              </div>

              <p className="mt-4 pt-4 border-t border-white/15 text-xs text-white/65">
                8 Princípios Orientadores
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
