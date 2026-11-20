// src/pages/Recursos/Recursos.jsx
import Reveal from "../../Components/Reveal/Reveal";
import SplitText from "../../Components/SplitText/SplitText";

const items = [
  { n: "01", title: "Apoio contínuo", text: "Acesse conteúdos focados no bem-estar e na saúde mental para o seu dia a dia." },
  { n: "02", title: "Profissionais", text: "Encontre profissionais especializados e agende seus atendimentos com facilidade." },
  { n: "03", title: "Comunidade", text: "Compartilhe experiências em um ambiente seguro e de escuta ativa." },
];

export default function Recursos() {
  return (
    <Reveal className="font-body mx-auto min-h-screen max-w-7xl px-6 py-28 text-[#2f3a36] lg:px-10">
      <div className="mb-14 max-w-2xl">
        <div className="mb-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-[#5b6561]">
          <span className="grow-x h-px w-8 bg-[#c98a9d]" />
          <SplitText text="Recursos" delay={100} />
        </div>
        <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.8rem)] font-light leading-[1.08]">
          <SplitText text="Tudo o que você precisa," delay={300} />{" "}
          <span className="italic text-[#a8566f]"><SplitText text="em um só lugar." delay={1000} /></span>
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {items.map((it, i) => (
          <article key={it.n}
            className="fade-up rounded-[28px] bg-white/70 p-8 shadow-xl shadow-rose-200/40 backdrop-blur-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            style={{ "--d": `${1400 + i * 250}ms` }}>
            <span className="font-display text-4xl italic text-[#c98a9d]">{it.n}</span>
            <h3 className="font-display mt-4 text-2xl">{it.title}</h3>
            <p className="mt-2 leading-relaxed text-[#6d7571]">{it.text}</p>
          </article>
        ))}
      </div>
    </Reveal>
  );
}