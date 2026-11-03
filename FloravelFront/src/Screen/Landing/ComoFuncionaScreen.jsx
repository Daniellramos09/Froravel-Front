import Reveal from "../../Components/Reveal/Reveal";
import SplitText from "../../Components/SplitText/SplitText";
import { ClipboardCheck, HeartHandshake, UserRoundSearch } from "lucide-react";

const steps = [
  {
    icon: ClipboardCheck,
    title: "Avaliação Inicial",
    text: "Responda um quiz rápido e acolhedor para entendermos como você está se sentindo. Sem julgamentos, no seu tempo.",
  },
  {
    icon: HeartHandshake,
    title: "Acolhimento",
    text: "Receba conteúdos personalizados, dicas de bem-estar e o apoio de uma comunidade que realmente entende você.",
  },
  {
    icon: UserRoundSearch,
    title: "Conexão Profissional",
    text: "Conecte-se com psicólogas e profissionais especializados em saúde materna, prontos para te ouvir.",
  },
];

export default function ComoFunciona() {
  return (
    <Reveal className="font-body mx-auto min-h-screen max-w-7xl px-6 py-28 text-[#2f3a36] lg:px-10">
      {/* Cabeçalho */}
      <div className="mb-16 max-w-2xl">
        <div className="mb-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-[#5b6561]">
          <span className="grow-x h-px w-8 bg-[#c98a9d]" />
          <SplitText text="Como Funciona" delay={100} />
        </div>
        <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.8rem)] font-light leading-[1.08]">
          <SplitText text="Sua jornada começa" delay={300} />{" "}
          <span className="italic text-[#a8566f]">
            <SplitText text="com um passo." delay={900} />
          </span>
        </h2>
      </div>

      {/* Passos */}
      <div className="relative grid gap-10 md:grid-cols-3 md:gap-6">
        {/* Linha conectora (desktop) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 top-16 hidden h-px bg-gradient-to-r from-transparent via-[#e6c3cd] to-transparent md:block"
        />

        {steps.map((step, i) => (
          <article
            key={step.title}
            className="fade-up relative flex flex-col items-center text-center"
            style={{ "--d": `${1200 + i * 300}ms` }}
          >
            {/* Número do passo */}
            <span className="font-display mb-4 text-sm uppercase tracking-[0.25em] text-[#c98a9d]">
              Passo {i + 1}
            </span>

            {/* Ícone */}
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/80 shadow-lg shadow-rose-200/40 backdrop-blur-sm ring-1 ring-[#f0d5dc]">
              <step.icon className="h-9 w-9 text-[#a8566f]" strokeWidth={1.4} />
            </div>

            {/* Conteúdo */}
            <h3 className="font-display text-2xl leading-snug">{step.title}</h3>
            <p className="mt-3 max-w-xs leading-relaxed text-[#6d7571]">{step.text}</p>
          </article>
        ))}
      </div>
    </Reveal>
  );
}

