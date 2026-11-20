import React, { useState } from "react";
import { Sparkles, Shield, Heart, Users, ChevronRight } from "lucide-react";

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
      className="relative bg-[#FCF7F9] py-20 sm:py-28 lg:py-32 border-t border-[#E8A9BB]/30 overflow-hidden"
    >
      {/* Luz ambiente difusa */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[52rem] h-[38rem] rounded-full bg-[#F4DDE5]/30 blur-[150px] -z-10"
      />

      <div className="max-w-[1560px] mx-auto px-6 lg:px-12 relative z-10 text-center">
        {/* Top Badge no centro (estilo Orionix 'CLIENT VOICES') */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#294D33]/10 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_-8px_rgba(0,0,0,0.06)] mb-6 mx-auto">
          <span
            className="w-2 h-2 rounded-full bg-[#E8A9BB]"
            style={{ boxShadow: "0 0 8px rgba(232, 169, 187, 0.9)" }}
          />
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] text-[#294D33]">
            Missão, Visão & Valores
          </span>
        </div>

        {/* Título expressivo no centro */}
        <h2 className="font-serif text-[32px] sm:text-[44px] lg:text-[56px] font-normal text-[#294D33] leading-[1.08] tracking-[-0.025em] max-w-4xl mx-auto mb-16 sm:mb-20">
          Onde o cuidado materno constrói um futuro{" "}
          <span className="italic font-serif text-[#D98A9C]">
            mais seguro e acolhedor.
          </span>
        </h2>

        {/* Composição dos 3 Cards (inspirados na disposição dos cards de depoimentos do Orionix) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch text-left">
          {/* CARD 1: MISSÃO */}
          <div className="rounded-[32px] sm:rounded-[40px] bg-white p-7 sm:p-9 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.04),0px_1px_2px_0px_rgba(0,0,0,0.08),0px_4px_6px_0px_rgba(0,0,0,0.04),0px_24px_40px_-16px_rgba(0,0,0,0.08)] flex flex-col justify-between transition-transform duration-500 hover:-translate-y-1">
            <div>
              {/* Foto circular no topo */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mx-auto mb-6 shadow-md border-2 border-white">
                <img
                  src="/img/hero-woman-serene.jpg"
                  alt="Mãe em momento sereno"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="text-center mb-5">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6E9473] bg-[#EBF3ED] px-3 py-1 rounded-full">
                  Nosso Propósito Central
                </span>
                <h3 className="font-serif text-[28px] sm:text-[34px] font-normal text-[#1F3A27] mt-3">
                  Missão
                </h3>
              </div>

              <p className="text-[15px] sm:text-base text-[#3A443E] leading-[1.65] font-sans">
                Acolher, perceber e conectar gestantes e mães no pós-parto,
                criando um espaço onde possam compartilhar suas experiências,
                compreender suas necessidades e encontrar informação, redes de
                apoio, profissionais e outros caminhos de cuidado, para que
                nenhuma mãe precise atravessar a maternidade sozinha.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#294D33]/8 flex items-center justify-between text-xs font-semibold text-[#516B55]">
              <span>Cuidado Integral Materno</span>
              <span className="font-serif text-sm text-[#294D33]">01 / 03</span>
            </div>
          </div>

          {/* CARD 2: VISÃO */}
          <div className="rounded-[32px] sm:rounded-[40px] bg-white p-7 sm:p-9 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.04),0px_1px_2px_0px_rgba(0,0,0,0.08),0px_4px_6px_0px_rgba(0,0,0,0.04),0px_24px_40px_-16px_rgba(0,0,0,0.08)] flex flex-col justify-between transition-transform duration-500 hover:-translate-y-1">
            <div>
              {/* Foto circular no topo */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mx-auto mb-6 shadow-md border-2 border-white">
                <img
                  src="/img/fotopsicologo/psicologia-terapia.jpg"
                  alt="Psicóloga perinatal em acolhimento"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="text-center mb-5">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#D98A9C] bg-[#F4DDE5] px-3 py-1 rounded-full">
                  Onde Queremos Chegar
                </span>
                <h3 className="font-serif text-[28px] sm:text-[34px] font-normal text-[#1F3A27] mt-3">
                  Visão
                </h3>
              </div>

              <p className="text-[15px] sm:text-base text-[#3A443E] leading-[1.65] font-sans">
                Ser referência em acolhimento materno, contribuindo para uma
                realidade em que gestantes e mães tenham acesso à informação,
                apoio e caminhos de cuidado, independentemente de sua condição
                socioeconômica.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#294D33]/8 flex items-center justify-between text-xs font-semibold text-[#516B55]">
              <span>Acesso Democrático & Saúde</span>
              <span className="font-serif text-sm text-[#294D33]">02 / 03</span>
            </div>
          </div>

          {/* CARD 3: VALORES (COM SELEÇÃO INTERATIVA DOS 8 PILARES) */}
          <div className="rounded-[32px] sm:rounded-[40px] bg-[#1F3224] text-white p-7 sm:p-9 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.04),0px_1px_2px_0px_rgba(0,0,0,0.08),0px_4px_6px_0px_rgba(0,0,0,0.04),0px_40px_40px_-24px_rgba(0,0,0,0.12)] flex flex-col justify-between transition-transform duration-500 hover:-translate-y-1">
            <div>
              {/* Emblema circular no topo */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#294D33] flex items-center justify-center mx-auto mb-6 shadow-inner border border-white/10">
                <Sparkles size={40} className="text-[#E8A9BB]" />
              </div>

              <div className="text-center mb-5">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#E8A9BB] bg-white/10 px-3 py-1 rounded-full">
                  Nossa Conduta Ética
                </span>
                <h3 className="font-serif text-[28px] sm:text-[34px] font-normal text-white mt-3">
                  Valores
                </h3>
              </div>

              {/* Pílulas dos 8 valores */}
              <div className="flex flex-wrap gap-1.5 mb-4 justify-center">
                {valores.map((v, idx) => (
                  <button
                    key={v.nome}
                    type="button"
                    onClick={() => setSelectedValor(idx)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      selectedValor === idx
                        ? "bg-[#E8A9BB] text-[#1F3224] shadow-xs"
                        : "bg-white/10 text-white/85 hover:bg-white/20"
                    }`}
                  >
                    {v.nome}
                  </button>
                ))}
              </div>

              {/* Descrição do valor selecionado */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 min-h-[96px] flex flex-col justify-center">
                <p className="text-xs uppercase tracking-wider text-[#E8A9BB] font-bold mb-1">
                  {valores[selectedValor].nome}
                </p>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-sans">
                  {valores[selectedValor].desc}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
              <span>8 Princípios Orientadores</span>
              <span className="font-serif text-sm text-[#E8A9BB]">03 / 03</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
