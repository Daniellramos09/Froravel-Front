import React from "react";

export default function PilaresSection() {
  const pilares = [
    {
      step: "01",
      title: "Acolher",
      desc: "Criar um espaço de escuta, troca e pertencimento, onde mães possam compartilhar experiências e perceber que não precisam passar pela maternidade sozinhas.",
      image: "/img/pilares/pilar-acolher.jpg",
      alt: "Ilustração 3D editorial representando acolhimento materno",
    },
    {
      step: "02",
      title: "Perceber",
      desc: "Ajudar cada mãe a olhar também para si, reconhecer seus sentimentos e necessidades e encontrar informações que façam sentido para o momento que está vivendo.",
      image: "/img/pilares/pilar-perceber.jpg",
      alt: "Ilustração 3D editorial representando autopercepção e cuidado",
    },
    {
      step: "03",
      title: "Conectar",
      desc: "Aproximar mães de profissionais, redes de apoio, projetos parceiros, recursos e serviços que possam ajudá-las quando precisarem de outros caminhos de cuidado.",
      image: "/img/pilares/pilar-conectar.jpg",
      alt: "Ilustração 3D editorial representando conexão com rede de apoio",
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

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Cabeçalho */}
        <div className="sr-group max-w-3xl mb-14 sm:mb-20 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#516B55] mb-3 font-sans">
            Nossos Pilares
          </p>

          <h2 className="font-serif text-[32px] sm:text-[44px] lg:text-[56px] font-normal text-[#294D33] leading-[1.08] tracking-[-0.025em]">
            Da sobrecarga ao acolhimento{" "}
            <span className="italic font-serif text-[#D98A9C] block sm:inline">
              em 3 pilares essenciais.
            </span>
          </h2>
        </div>

        {/* Grade dos 3 Pilares com medalhões 3D editoriais */}
        <div className="sr-group grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 lg:gap-16 text-left">
          {pilares.map((pilar) => (
            <div
              key={pilar.step}
              className="group flex flex-col items-start transition-all duration-300"
            >
              <div className="mb-7 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white border border-[#E4DAD5] overflow-hidden p-1.5 flex items-center justify-center shadow-[0px_4px_20px_-6px_rgba(41,77,51,0.12)] transition-transform duration-500 ease-out group-hover:scale-105">
                <img
                  src={pilar.image}
                  alt={pilar.alt}
                  className="w-full h-full object-cover rounded-full"
                  loading="lazy"
                />
              </div>

              <h3 className="font-serif text-[28px] sm:text-[34px] lg:text-[40px] font-normal text-[#1F3A27] leading-[1.12] tracking-[-0.02em] mb-3">
                {pilar.title}
              </h3>

              <p className="text-[15px] sm:text-base lg:text-[17px] text-[#4A5E4D] leading-[1.6] font-sans max-w-md">
                {pilar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
