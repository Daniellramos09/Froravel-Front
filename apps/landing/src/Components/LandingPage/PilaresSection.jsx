import React from "react";

function PilarAcolherIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-12 h-12 sm:w-14 sm:h-14" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="28" fill="#F4DDE5" fillOpacity="0.65" />
      <path
        d="M32 47C32 47 16 37.5 16 25.5C16 20.8 19.6 17 24.2 17C27.4 17 30.2 18.9 32 21.6C33.8 18.9 36.6 17 39.8 17C44.4 17 48 20.8 48 25.5C48 37.5 32 47 32 47Z"
        stroke="#A8435F"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#FFFFFF"
        fillOpacity="0.7"
      />
      <path
        d="M24 31.5C26.5 34.5 29.5 36.2 32 37.5C34.5 36.2 37.5 34.5 40 31.5"
        stroke="#294D33"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="32" cy="27" r="2.2" fill="#294D33" />
    </svg>
  );
}

function PilarPerceberIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-12 h-12 sm:w-14 sm:h-14" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="28" fill="#EBF3ED" />
      <path
        d="M12 32C16.5 23.5 23.8 19 32 19C40.2 19 47.5 23.5 52 32C47.5 40.5 40.2 45 32 45C23.8 45 16.5 40.5 12 32Z"
        stroke="#294D33"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#FFFFFF"
        fillOpacity="0.8"
      />
      <circle cx="32" cy="32" r="7.5" stroke="#516B55" strokeWidth="2" fill="#F4DDE5" fillOpacity="0.65" />
      <circle cx="32" cy="32" r="3" fill="#294D33" />
      <path d="M32 12V15M21 15L22.8 17.5M43 15L41.2 17.5" stroke="#6E9473" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PilarConectarIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-12 h-12 sm:w-14 sm:h-14" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="28" fill="#F1E6E1" />
      <path
        d="M22 25L32 19L42 25M20 39L32 45L44 39M20 27V37M44 27V37"
        stroke="#516B55"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="18" r="4.5" fill="#FFFFFF" stroke="#294D33" strokeWidth="2.2" />
      <circle cx="19" cy="32" r="4.5" fill="#F4DDE5" stroke="#A8435F" strokeWidth="2.2" />
      <circle cx="45" cy="32" r="4.5" fill="#F4DDE5" stroke="#A8435F" strokeWidth="2.2" />
      <circle cx="32" cy="45" r="4.5" fill="#FFFFFF" stroke="#294D33" strokeWidth="2.2" />
      <circle cx="32" cy="32" r="5" fill="#294D33" />
      <circle cx="32" cy="32" r="2" fill="#FCF7F9" />
    </svg>
  );
}

export default function PilaresSection() {
  const pilares = [
    {
      step: "01",
      title: "Acolher",
      desc: "Criar um espaço de escuta, troca e pertencimento, onde mães possam compartilhar experiências e perceber que não precisam passar pela maternidade sozinhas.",
      IconComponent: PilarAcolherIcon,
    },
    {
      step: "02",
      title: "Perceber",
      desc: "Ajudar cada mãe a olhar também para si, reconhecer seus sentimentos e necessidades e encontrar informações que façam sentido para o momento que está vivendo.",
      IconComponent: PilarPerceberIcon,
    },
    {
      step: "03",
      title: "Conectar",
      desc: "Aproximar mães de profissionais, redes de apoio, projetos parceiros, recursos e serviços que possam ajudá-las quando precisarem de outros caminhos de cuidado.",
      IconComponent: PilarConectarIcon,
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

        {/* Grade dos 3 Pilares com medalhões ilustrados autorais */}
        <div className="sr-group grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 lg:gap-16 text-left">
          {pilares.map((pilar) => {
            const IconComponent = pilar.IconComponent;
            return (
              <div
                key={pilar.step}
                className="group flex flex-col items-start transition-all duration-300"
              >
                <div className="mb-7 w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-white border border-[#E4DAD5] flex items-center justify-center shadow-[0px_4px_20px_-6px_rgba(41,77,51,0.12)] transition-transform duration-500 ease-out group-hover:scale-105">
                  <IconComponent />
                </div>

                <h3 className="font-serif text-[28px] sm:text-[34px] lg:text-[40px] font-normal text-[#1F3A27] leading-[1.12] tracking-[-0.02em] mb-3">
                  {pilar.title}
                </h3>

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
