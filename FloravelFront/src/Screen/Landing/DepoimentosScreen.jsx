import React from "react";

export default function DepoimentosScreen() {
  const testimonials = [
    {
      nome: "Camila Moura",
      tempo: "Puérpera (bebê de 4 meses)",
      foto: "/img/fotoMae/fotomae.jpg",
      texto: "Eu achava que a vontade de chorar no fim da tarde era fraqueza. A autoavaliação da Florável me mostrou que o que eu sentia tinha nome e que pedir apoio é coragem, não culpa.",
      badge: "Triagem & Diário",
      tagBg: "bg-[#F4DDE5] text-[#294D33]"
    },
    {
      nome: "Renata Silveira",
      tempo: "Gestante (32ª semana)",
      foto: "/img/fotoMae/fotomae1.jpg",
      texto: "Nas Rodas de Conversa encontrei mulheres que sentiam o mesmo medo da solidão que eu. Pela primeira vez na gravidez, senti que não precisava fingir plenitude o tempo todo.",
      badge: "Roda Comunitária",
      tagBg: "bg-[#FCF7F9] text-[#294D33]"
    },
    {
      nome: "Juliana Ferreira",
      tempo: "Retorno da licença (6 meses)",
      foto: "/img/fotoMae/fotomae3.jpg",
      texto: "Minha empresa ofereceu a Florável como benefício. O suporte da psicóloga perinatal me deu chão para lidar com a ansiedade da separação e a volta ao escritório.",
      badge: "Florável Corporate",
      tagBg: "bg-[#F4DDE5] text-[#294D33]"
    }
  ];

  return (
    <section id="depoimentos" className="relative pt-12 sm:pt-16 pb-24 sm:pb-32 bg-[#FCF7F9] overflow-hidden border-t border-[#E8A9BB]/30">
      
      {/* Luz ambiente difusa */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute bottom-10 left-1/3 w-[36rem] h-[36rem] rounded-full bg-[#F4DDE5]/35 blur-[130px] -z-10" 
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 w-full">
        
        {/* Cabeçalho */}
        <div className="sr-group text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[3.25rem] font-normal text-[#294D33] leading-[1.12] tracking-[-0.015em]">
            Histórias de quem encontrou{" "}
            <span className="italic font-serif text-[#E8A9BB]">
              espaço para respirar.
            </span>
          </h2>

          <p className="mt-4 text-base text-[#3A443E] leading-relaxed font-sans font-normal">
            Relatos de mulheres que transformaram sua maternidade com escuta profissional e sem julgamentos.
          </p>
        </div>

        {/* CARDS DE DEPOIMENTO COM FOTOS REAIS EM FORMATO DE PASTA */}
        <div className="sr-group grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.nome}
              className="pt-4 relative group"
            >
              {/* Folder Tab Mini */}
              <div className="liquid-chip absolute top-0 left-6 z-10 px-3.5 py-1 rounded-t-xl text-[10px] font-bold text-[#294D33] uppercase tracking-wider font-nunito">
                {item.badge}
              </div>

              {/* Corpo do Card */}
              <div className="liquid-glass rounded-3xl rounded-tl-sm p-7 sm:p-8 transition-all duration-300 flex flex-col justify-between text-left h-full">
                
                <div>

                  <p className="text-sm sm:text-[0.95rem] text-[#294D33] leading-relaxed font-sans italic mb-8">
                    &ldquo;{item.texto}&rdquo;
                  </p>
                </div>

                {/* Identificação da Mãe com Foto Real */}
                <div className="pt-4 border-t border-[#E8A9BB]/30 flex items-center gap-3.5">
                  <img
                    src={item.foto}
                    alt={item.nome}
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#E8A9BB]/60 shadow-xs"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/img/1.jpg";
                    }}
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[#294D33] font-nunito">{item.nome}</h4>
                    <p className="text-xs text-[#516B55] font-sans">{item.tempo}</p>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
