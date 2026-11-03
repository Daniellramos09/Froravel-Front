import React from "react";
import { ArrowRight, Sparkles, Heart, Shield, CheckCircle2 } from "lucide-react";

export default function Sobre() {
  return (
    <section id="sobre" className="relative bg-[#FCF7F9] py-24 sm:py-32 overflow-hidden border-t border-[#E8A9BB]/30">
      
      {/* Flor rosa livre da pasta fotoFlores (afastada do canto com margem suave) */}
      <img
        src="/img/fotoFlores/flor5-removebg-preview.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-10 height-20 right-10 sm:top-30 sm:right-10 lg:top-12 lg:right-140 w-36 sm:w-48 lg:w-50 opacity-90 select-none drop-shadow-sm rotate-12 z-0 transition-all duration-300"
      />
      
      {/* Luz ambiente difusa */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/2 -left-20 w-[38rem] h-[38rem] rounded-full bg-[#F4DDE5]/40 blur-[130px] -z-10" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -bottom-10 right-0 w-[32rem] h-[32rem] rounded-full bg-[#E8A9BB]/20 blur-[120px] -z-10" 
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* ========================================================
            SPLIT-SCREEN EDITORIAL: MANIFESTO EMOCIONAL
        ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* LADO ESQUERDO: Mensagem de Identidade & Acolhimento */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4DDE5] border border-[#E8A9BB]/50 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#294D33] animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#294D33] font-sans">
                Manifesto Florável &bull; Identidade & Cuidado
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[3.25rem] font-normal text-[#294D33] leading-[1.12] tracking-[-0.015em]">
              Antes de ser mãe,{" "}
              <span className="block mt-1 italic font-serif text-[#E8A9BB]">
                você é você.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-[#3A443E] leading-relaxed font-sans font-normal max-w-xl">
              A maternidade transforma tudo ao redor, mas sua essência, suas dores e suas vontades continuam importando. Criamos um refúgio para que você não precise fingir força o tempo todo.
            </p>

            {/* 3 Pílulas de Acolhimento Tátil (Menos texto, mais síntese visual) */}
            <div className="w-full space-y-3 pt-2">
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/80 border border-[#E8A9BB]/40 shadow-xs backdrop-blur-sm transition-transform duration-300 hover:translate-x-1">
                <div className="w-8 h-8 rounded-full bg-[#F4DDE5] text-[#294D33] flex items-center justify-center flex-shrink-0">
                  <Heart size={16} className="fill-[#E8A9BB] text-[#294D33]" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-[#294D33] font-sans">
                  Espaço seguro para acolher o cansaço sem qualquer julgamento
                </p>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/80 border border-[#E8A9BB]/40 shadow-xs backdrop-blur-sm transition-transform duration-300 hover:translate-x-1">
                <div className="w-8 h-8 rounded-full bg-[#F4DDE5] text-[#294D33] flex items-center justify-center flex-shrink-0">
                  <Sparkles size={16} className="text-[#516B55]" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-[#294D33] font-sans">
                  Reconexão com a sua identidade para além da maternidade
                </p>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/80 border border-[#E8A9BB]/40 shadow-xs backdrop-blur-sm transition-transform duration-300 hover:translate-x-1">
                <div className="w-8 h-8 rounded-full bg-[#F4DDE5] text-[#294D33] flex items-center justify-center flex-shrink-0">
                  <Shield size={16} className="text-[#294D33]" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-[#294D33] font-sans">
                  Ferramentas gratuitas validadas pela ciência perinatal
                </p>
              </div>
            </div>

            {/* CTA para a esteira */}
            <div className="pt-2">
              <a
                href="#jornada"
                className="group inline-flex items-center justify-center gap-3 bg-[#294D33] hover:bg-[#1f3c27] text-[#FCF7F9] px-8 py-4 rounded-full text-sm font-medium shadow-md shadow-[#294D33]/20 transition-all duration-300 hover:scale-[1.02]"
              >
                <span>Conhecer o caminho de cuidado</span>
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>

          </div>

          {/* LADO DIREITO: Composição Fotográfica Orgânica com Badge Flutuante */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            
            {/* Círculo de fundo acolhedor */}
            <div className="relative w-full max-w-[420px] sm:max-w-[460px] aspect-[4/4.6] flex items-center justify-center">
              
              {/* Forma orgânica assimétrica de fundo */}
              <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-tr from-[#F4DDE5] via-[#FCF7F9] to-[#E8A9BB]/50 transform rotate-2 border border-[#E8A9BB]/40 shadow-xl shadow-[#E8A9BB]/20 -z-10" />

              {/* Moldura da Fotografia com cantos arredondados editoriais */}
              <div className="w-[94%] h-[94%] rounded-[2.5rem] overflow-hidden bg-white shadow-2xl relative border border-white">
                <img
                  src="/img/fotoMae/fotomae4.jpg"
                  alt="Mulher em momento de pausa serena e autocuidado"
                  className="w-full h-full object-cover object-center transition-transform duration-1000 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/img/maeDescansando.jpg";
                  }}
                />
                {/* Gradiente sutil de iluminação */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#294D33]/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Badge 1: Flutuante Superior Direito (Folder Tab Feel) */}
              <div className="absolute -top-3 -right-2 sm:-right-4 backdrop-blur-md bg-[#FCF7F9]/92 px-4 py-2.5 rounded-2xl shadow-lg shadow-[#294D33]/8 border border-[#E8A9BB] flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#516B55]" />
                <span className="text-xs font-semibold text-[#294D33] font-nunito">
                  Escuta sem Julgamentos
                </span>
              </div>

              {/* Badge 2: Flutuante Inferior Esquerdo (Card com microinteração) */}
              <div className="absolute -bottom-4 -left-2 sm:-left-6 backdrop-blur-md bg-white/95 p-4 rounded-2xl shadow-xl shadow-[#294D33]/10 border border-[#E8A9BB]/60 max-w-[270px] text-left">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-8 h-8 rounded-xl bg-[#F4DDE5] text-[#294D33] flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#294D33] font-nunito">Acolhimento Integral</p>
                    <p className="text-[10px] text-[#516B55] font-sans">Psicologia perinatal humanizada</p>
                  </div>
                </div>
                <div className="w-full bg-[#F4DDE5] h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-[#294D33] h-full w-[85%] rounded-full" />
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
