import React, { useState } from "react";
import useParallax from "../../Components/Effects/useParallax";

const PILARES_SOBRE = [
  {
    num: "01",
    titulo: "Acolhimento do cansaço, sem julgamento",
    detalhe:
      "Um espaço seguro para falar da exaustão real, das dúvidas e das madrugadas difíceis sem precisar parecer forte.",
  },
  {
    num: "02",
    titulo: "Reconexão com a sua identidade",
    detalhe:
      "Cuidar de quem cuida: resgatando seus desejos, limites e autonomia para além do papel materno.",
  },
  {
    num: "03",
    titulo: "Ferramentas gratuitas validadas pela ciência",
    detalhe:
      "Diário emocional criptografado, triagem EPDS (OMS) e rodas semanais mediadas por psicólogas perinatais.",
  },
];

export default function Sobre() {
  const fotoRef = useParallax();
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section
      id="sobre"
      className="relative bg-[#FCF7F9] py-20 sm:py-28 overflow-hidden border-t border-[#E8A9BB]/30"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LADO ESQUERDO: Mensagem de Identidade & Lista Interativa com Feedback Real */}
          <div className="sr-group lg:col-span-6 flex flex-col items-start text-left space-y-6">
            <h2 className="font-serif text-[34px] sm:text-[46px] lg:text-[56px] font-normal text-[#294D33] leading-[1.06] tracking-[-0.025em]">
              Antes de ser mãe,{" "}
              <span className="block mt-1 italic font-serif text-[#A8435F]">
                você é você.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-[#3A443E] leading-relaxed font-sans max-w-xl">
              A maternidade transforma tudo, mas suas vontades continuam importando. Aqui você não precisa fingir força o tempo todo.
            </p>

            {/* Itens interativos com feedback visual e expansão suave */}
            <div className="w-full divide-y divide-[#294D33]/12 border-y border-[#294D33]/12">
              {PILARES_SOBRE.map((item, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <button
                    key={item.num}
                    type="button"
                    onMouseEnter={() => setActiveIdx(idx)}
                    onClick={() => setActiveIdx(idx)}
                    className={`w-full py-4 px-3 text-left transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer ${
                      isActive ? "bg-white/85" : "hover:bg-white/45"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-baseline gap-3.5">
                        <span
                          className={`font-serif text-lg transition-colors duration-300 ${
                            isActive ? "text-[#A8435F]" : "text-[#516B55]"
                          }`}
                        >
                          {item.num}
                        </span>
                        <p className="text-sm sm:text-base font-medium text-[#294D33] font-sans">
                          {item.titulo}
                        </p>
                      </div>
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 transition-all duration-300 ${
                          isActive ? "bg-[#A8435F] scale-125" : "bg-[#294D33]/20"
                        }`}
                      />
                    </div>

                    <div
                      className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isActive ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <p className="overflow-hidden pl-8 text-xs sm:text-sm text-[#516B55] leading-relaxed font-sans">
                        {item.detalhe}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <a
                href="#proposito"
                className="group inline-flex items-center justify-center gap-3 bg-[#294D33] hover:bg-[#1f3c27] text-[#FCF7F9] px-8 py-4 rounded-full text-sm font-medium shadow-sm transition-all duration-300"
              >
                <span>Conhecer nossa essência</span>
              </a>
            </div>
          </div>

          {/* LADO DIREITO: Fotografia Editorial Limpa (sem widgets/badges flutuantes artificiais) */}
          <div className="sr lg:col-span-6 relative flex justify-center items-center" style={{ "--sr-i": 1 }}>
            <div className="relative w-full max-w-[460px] aspect-[4/4.6] rounded-2xl overflow-hidden bg-white shadow-lg border border-[#294D33]/10">
              <div ref={fotoRef} className="absolute inset-x-0 -inset-y-[8%]">
                <img
                  src="/img/fotoMae/fotomae4.jpg"
                  alt="Mulher em momento de pausa serena e autocuidado"
                  className="w-full h-full object-cover object-center transition-transform duration-1000 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/img/maeDescansando.jpg";
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F3224]/30 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-[#FCF7F9]">
                <span className="text-xs font-medium tracking-wide bg-[#1F3224]/65 backdrop-blur-sm px-3.5 py-1.5 rounded-full">
                  Escuta sem julgamentos • Psicologia Perinatal
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
