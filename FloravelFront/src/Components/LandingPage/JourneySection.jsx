import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Leaf, 
  HeartHandshake, 
  Flower2, 
  ShieldCheck, 
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { APP_LINKS } from "../../utils/appLinks";

// Ícone botânico minimalista de Flor Fechada (Botão) para o Nó 01
function FlowerBudIcon({ className = "w-6 h-6", strokeWidth = 1.8 }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 22V14" />
      <path d="M12 18C10 17 9 15 9 14" />
      <path d="M12 14C8.5 12 7 8 8 5C9 3 11 3 12 6C13 3 15 3 16 5C17 8 15.5 12 12 14Z" />
      <path d="M12 6V11" strokeDasharray="1 1" />
    </svg>
  );
}

export default function JourneySection() {
  const [activeStep, setActiveStep] = useState(0);

  // 4 etapas com texto enxuto e direto (sem sobrecarga visual)
  const steps = [
    {
      id: "01",
      number: "01",
      title: "01. Dar nome ao que sente",
      tag: "Triagem EPDS",
      desc: "Autoavaliação de 3 minutos para reconhecer o que você sente sem julgamentos.",
      icon: FlowerBudIcon,
      isApex: false,
      img: "/img/fotoMae/fotomae2.jpg",
      highlight: "Escala científica confidencial da OMS"
    },
    {
      id: "02",
      number: "02",
      title: "02. Um espaço diário",
      tag: "Diário Emocional",
      desc: "Refúgio íntimo para desabafar no seu ritmo, sem obrigação de frequência.",
      icon: Leaf,
      isApex: false,
      img: "/img/fotoMae/fotomae1.jpg", // Nova foto para 'Um espaço diário'
      highlight: "Criptografia total e sem metas diárias"
    },
    {
      id: "03",
      number: "03",
      title: "03. Caminhar acompanhada",
      tag: "Rodas e Terapia",
      desc: "Rodas semanais gratuitas e apoio 1:1 com psicólogas perinatais.",
      icon: HeartHandshake,
      isApex: false,
      img: "/img/fotopsicologo/psicologia-terapia.jpg",
      highlight: "Encontros ao vivo todas as quartas às 19h"
    },
    {
      id: "04",
      number: "04",
      title: "04. Florescer além da maternidade",
      tag: "O Ápice: Reencontro",
      desc: "Resgate da sua identidade, potência e autonomia além do cuidar materno.",
      icon: Flower2,
      isApex: true,
      img: "/img/fotoMae/fotomae6.jpg",
      highlight: "Cápsula do tempo para resgate em 1 ano"
    }
  ];

  return (
    <section 
      id="jornada" 
      className="relative py-20 sm:py-28 bg-[#FCF7F9] overflow-hidden border-t border-[#E8A9BB]/30"
    >
      {/* Flor decorativa livre no canto superior direito */}
      

      {/* Flor secundária livre no canto inferior esquerdo */}
      <img
        src="/img/fotoFlores/florong-removebg-preview.png"
        alt=""
        aria-hidden="true"
        className="flor-sway-b pointer-events-none absolute -bottom-14 -left-10 w-36 sm:w-52 opacity-60 select-none drop-shadow-xs -rotate-12 z-0"
      />

      {/* Luz ambiente suave */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[40rem] h-[30rem] rounded-full bg-[#F4DDE5]/30 blur-[130px] -z-10" 
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 w-full">
        
        {/* CABEÇALHO CONCISO */}
        <div className="sr-group max-w-2xl mb-12 sm:mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4DDE5] border border-[#E8A9BB]/50 shadow-xs mb-3">
            <span className="w-2 h-2 rounded-full bg-[#294D33]" />
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#294D33] font-sans">
              A Jornada da Mãe &bull; Linha do Tempo
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[3rem] font-normal text-[#294D33] leading-[1.15] tracking-[-0.015em]">
            Como a Florável{" "}
            <span className="italic font-serif text-[#E8A9BB]">
              caminha com você.
            </span>
          </h2>

          <p className="mt-3 text-base text-[#3A443E] leading-relaxed font-sans max-w-xl">
            Uma esteira simples e no seu tempo. Um passo por vez, sem pressa nem cobrança.
          </p>
        </div>

        {/* ========================================================
            TRILHA HORIZONTAL (LINHA DO TEMPO) - CARDS MINIMALISTAS
        ======================================================== */}
        <div className="relative mb-12">
          
          {/* Linha conectora contínua no desktop */}
          <div 
            aria-hidden="true" 
            className="hidden lg:block absolute top-[40px] left-[7%] right-[7%] h-[2px] bg-gradient-to-r from-[#E8A9BB]/60 via-[#516B55]/40 to-[#294D33] z-0" 
          />

          {/* Grade dos 4 Nós */}
          <div className="sr-group grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeStep === idx;
              const isApex = step.isApex;

              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  className={`group text-left cursor-pointer transition-all duration-300 flex flex-col justify-between p-6 rounded-[2rem] border relative ${
                    isApex
                      ? "bg-white border-[#294D33] shadow-lg shadow-[#294D33]/10 ring-1 ring-[#294D33]/25"
                      : isSelected
                      ? "bg-white border-[#294D33] shadow-md shadow-[#294D33]/5"
                      : "bg-white/80 hover:bg-white border-[#E8A9BB]/60 hover:border-[#294D33]/50 shadow-xs"
                  }`}
                >
                  {/* Topo do Card: Ícone do Nó + Tag */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div 
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-xs ${
                          isApex
                            ? "bg-[#294D33] text-[#FCF7F9] ring-3 ring-[#E8A9BB]/40"
                            : isSelected
                            ? "bg-[#294D33] text-white"
                            : "bg-[#F4DDE5] text-[#294D33] group-hover:bg-[#294D33] group-hover:text-white"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <span 
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          isApex
                            ? "bg-[#294D33] text-white border-[#294D33]"
                            : "bg-[#FCF7F9] text-[#294D33] border-[#E8A9BB]/60"
                        }`}
                      >
                        {step.tag}
                      </span>
                    </div>

                    {/* Título & Descrição Enxuta */}
                    <h3 
                      className={`font-serif text-lg sm:text-xl font-normal leading-snug mb-2 transition-colors ${
                        isApex ? "text-[#294D33] font-semibold" : "text-[#294D33]"
                      }`}
                    >
                      {step.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#3A443E] leading-relaxed font-sans">
                      {step.desc}
                    </p>
                  </div>

                  {/* Rodapé do Card */}
                  <div className="mt-5 pt-3 border-t border-[#E8A9BB]/30 flex items-center justify-between text-xs font-semibold">
                    <span className={isApex ? "text-[#294D33]" : "text-[#516B55]"}>
                      {isApex ? "✨ O Ápice" : `Passo ${step.number}`}
                    </span>
                    <span className="text-[#294D33] group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5 text-[11px]">
                      {isSelected ? "Em foco" : "Ver"}
                      <ChevronRight size={13} />
                    </span>
                  </div>

                  {/* Badge de destaque superior do ápice */}
                  {isApex && (
                    <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[#294D33] text-white text-[9px] font-bold uppercase tracking-widest shadow-xs">
                      Ápice &bull; Autonomia
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* ========================================================
            CARD COMPACTO DE PRÉVIA VISUAL DA ETAPA ATIVA
        ======================================================== */}
        <div className="sr rounded-[2rem] bg-white border border-[#E8A9BB]/80 p-5 sm:p-7 shadow-sm text-left relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Foto Real Reduzida e Polida */}
            <div className="md:col-span-4 relative">
              <div className="w-full aspect-[16/10] sm:aspect-[4/2.8] rounded-2xl overflow-hidden border border-stone-100 shadow-xs relative">
                <img
                  src={steps[activeStep].img}
                  alt={steps[activeStep].title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>

            {/* Conteúdo Conciso da Etapa com Ação */}
            <div className="md:col-span-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#516B55]">
                  Passo {steps[activeStep].number} &bull; {steps[activeStep].tag}
                </span>
                <h4 className="font-serif text-xl sm:text-2xl font-normal text-[#294D33] mt-0.5">
                  {steps[activeStep].title}
                </h4>
                <p className="text-xs sm:text-sm text-[#3A443E] mt-1 font-sans">
                  {steps[activeStep].highlight}
                </p>
              </div>

              <div className="flex-shrink-0 flex items-center gap-2.5">
                <a
                  href={APP_LINKS.mae}
                  className="inline-flex items-center gap-2 py-3 px-6 rounded-full bg-[#294D33] hover:bg-[#1f3c27] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-xs hover:scale-102"
                >
                  <span>Acessar Espaço da Mãe</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
