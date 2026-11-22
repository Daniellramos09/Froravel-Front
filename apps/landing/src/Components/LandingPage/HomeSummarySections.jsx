import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Plus, Minus, Quote } from "lucide-react";

/**
 * Bloco 2 da Nova Home: Contexto breve e humano sobre a necessidade do cuidado materno.
 */
export function ContextoHomeSection() {
  return (
    <section id="contexto" className="py-16 sm:py-24 bg-[#FCF7F9] border-t border-[#E8A9BB]/25">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 text-left space-y-5">
            <p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#516B55] font-sans">
              Antes de ser mãe, você é você
            </p>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.8rem] font-normal text-[#294D33] leading-[1.12] tracking-[-0.015em]">
              Cuidar de quem cuida não deveria ser{" "}
              <span className="italic text-[#A8435F]">um privilégio.</span>
            </h2>

            <p className="text-base sm:text-lg text-[#3A443E] leading-relaxed font-sans max-w-xl">
              Muitas mulheres atravessam a gestação e o puerpério em silêncio, entre cobranças irreais e exaustão. A Florável nasce para oferecer acolhimento contínuo, triagem segura e escuta profissional acessível desde os primeiros sinais.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/sobre"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#294D33] hover:text-[#516B55] transition group font-sans"
              >
                <span>Conhecer nossa história e propósito</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-[2rem] overflow-hidden border border-[#E8A9BB]/50 shadow-lg bg-white aspect-[16/10]">
              <img
                src="/img/fotoMae/fotomae4.jpg"
                alt="Mãe acolhida em ambiente sereno e natural"
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/img/fotoMae/fotomae1.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#294D33]/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 bg-[#FCF7F9]/92 backdrop-blur-md rounded-2xl p-4 border border-[#E8A9BB]/40 text-left">
                <p className="text-xs sm:text-sm font-medium text-[#294D33] font-sans">
                  Um espaço confidencial para respirar, registrar seus sentimentos e encontrar apoio real no seu próprio ritmo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Bloco 4 da Nova Home: Prévia resumida de Como a Florável Ajuda (padrão editorial expansível 148.fr).
 */
export function ComoAjudaPreviewSection() {
  const [activeIdx, setActiveIdx] = useState(null);
  const [mobileIdx, setMobileIdx] = useState(0);

  const previews = [
    {
      shortTitle: "Diário & Triagem",
      tag: "Gratuito",
      title: "Diário Emocional & Triagem",
      desc: "Registre seu humor em segundos e acompanhe seu bem-estar com a Escala de Edimburgo (EPDS) para identificar sobrecarga emocional cedo.",
      features: ["Escala EPDS", "Registro em segundos", "100% Gratuito"],
      to: "/explorar",
      cta: "Explorar ferramentas",
      bg: "bg-[#F4DDE5]",
      text: "text-[#294D33]",
      subText: "text-[#3A443E]",
      pillBg: "bg-white/75 text-[#294D33] border-[#294D33]/10",
      ctaClass: "bg-[#294D33] text-[#FCF7F9] hover:bg-[#1f3c27]",
      iconBtnClass: "bg-white/85 text-[#294D33] hover:bg-white",
    },
    {
      shortTitle: "Rodas de Conversa",
      tag: "Comunidade Segura",
      title: "Rodas de Conversa",
      desc: "Encontros semanais mediados por psicólogas perinatais para compartilhar vivências reais da maternidade sem medo de julgamentos.",
      features: ["Mediação Clínica", "Encontros Semanais", "Acesso Aberto"],
      to: "/explorar",
      cta: "Ver como funciona",
      bg: "bg-[#EBF1ED]",
      text: "text-[#294D33]",
      subText: "text-[#3A443E]",
      pillBg: "bg-white/80 text-[#294D33] border-[#294D33]/10",
      ctaClass: "bg-[#294D33] text-[#FCF7F9] hover:bg-[#1f3c27]",
      iconBtnClass: "bg-white/85 text-[#294D33] hover:bg-white",
    },
    {
      shortTitle: "Rede Clínica",
      tag: "Clínica Social",
      title: "Rede de Psicólogas Perinatais",
      desc: "Atendimento online com profissionais verificadas pelo CRP e vagas sociais acessíveis a partir de R$ 40, viabilizadas por cuidado solidário.",
      features: ["CRP Verificado", "Vagas a R$ 40", "Atendimento Online"],
      to: "/profissionais",
      cta: "Conhecer a rede",
      bg: "bg-[#294D33]",
      text: "text-[#FCF7F9]",
      subText: "text-[#E6EFE9]/85",
      pillBg: "bg-white/10 text-[#FCF7F9] border-white/15",
      ctaClass: "bg-[#E8A9BB] text-[#1F3224] hover:bg-[#f2bccb]",
      iconBtnClass: "bg-white/15 text-[#FCF7F9] hover:bg-white/25",
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-[#FCF7F9] border-t border-[#E8A9BB]/25">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#516B55] font-sans">
              Como a Florável ajuda
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-normal text-[#294D33] leading-tight">
              Cuidado prático para o seu dia a dia
            </h2>
          </div>

          <Link
            to="/explorar"
            className="inline-flex items-center gap-2 rounded-full border border-[#294D33]/25 bg-white hover:bg-[#F4DDE5]/50 text-[#294D33] px-5 py-2.5 text-sm font-semibold transition shrink-0 self-start md:self-auto"
          >
            <span>Explorar todos os recursos</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Desktop: Painéis horizontais expansíveis sem reflow de texto */}
        <div
          className="hidden lg:flex gap-4 h-[430px]"
          onMouseLeave={() => setActiveIdx(null)}
        >
          {previews.map((item, idx) => {
            const isActive = activeIdx === idx;
            const flexClass =
              activeIdx === null ? "flex-1" : isActive ? "flex-[3.2]" : "flex-[0.85]";

            return (
              <div
                key={item.title}
                onMouseEnter={() => setActiveIdx(idx)}
                onClick={() => setActiveIdx((prev) => (prev === idx ? null : idx))}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveIdx((prev) => (prev === idx ? null : idx));
                  }
                }}
                aria-expanded={isActive}
                className={`relative rounded-[1.75rem] ${item.bg} ${item.text} transition-[flex-grow,flex-basis] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden cursor-pointer text-left ${flexClass}`}
              >
                {/* Botão + / - fixo no topo direito */}
                <span
                  className={`absolute top-7 right-7 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${item.iconBtnClass}`}
                  aria-hidden="true"
                >
                  {isActive ? <Minus size={18} /> : <Plus size={18} />}
                </span>

                {/* Estado recolhido (quando mouse não está ou outro card está aberto): título vertical + tag */}
                <div
                  className={`absolute inset-0 p-8 flex flex-col justify-between transition-opacity duration-300 ease-out ${
                    isActive ? "opacity-0 pointer-events-none delay-0" : "opacity-100 delay-150"
                  }`}
                >
                  <span
                    className={`self-start px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      item.pillBg
                    } ${activeIdx === null ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
                  >
                    {item.tag}
                  </span>

                  <span className="font-serif text-xl tracking-wide [writing-mode:vertical-rl] rotate-180 select-none self-start">
                    {item.shortTitle}
                  </span>
                </div>

                {/* Estado expandido: largura interna fixa para zero esticamento/reflow de letras */}
                <div
                  className={`absolute inset-y-0 left-0 w-[490px] xl:w-[540px] p-8 flex flex-col justify-between transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive
                      ? "opacity-100 translate-y-0 delay-150"
                      : "opacity-0 translate-y-2 pointer-events-none delay-0"
                  }`}
                >
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${item.pillBg}`}
                    >
                      {item.tag}
                    </span>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <h3 className="font-serif text-3xl font-normal leading-tight mb-3">
                        {item.title}
                      </h3>
                      <p className={`text-sm sm:text-base leading-relaxed font-sans ${item.subText}`}>
                        {item.desc}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {item.features.map((feat) => (
                        <span
                          key={feat}
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${item.pillBg}`}
                        >
                          {feat}
                        </span>
                      ))}
                    </div>

                    <div>
                      <Link
                        to={item.to}
                        onClick={(e) => e.stopPropagation()}
                        className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${item.ctaClass}`}
                      >
                        <span>{item.cta}</span>
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile/Tablet: Accordion vertical limpo */}
        <div className="lg:hidden flex flex-col gap-4">
          {previews.map((item, idx) => {
            const isActive = mobileIdx === idx;
            return (
              <div
                key={item.title}
                onClick={() => setMobileIdx((prev) => (prev === idx ? -1 : idx))}
                className={`rounded-[1.5rem] ${item.bg} ${item.text} p-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] text-left cursor-pointer`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 block mb-1">
                      {item.tag}
                    </span>
                    <h3 className="font-serif text-xl font-semibold">{item.title}</h3>
                  </div>
                  <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${item.iconBtnClass}`}>
                    {isActive ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </div>

                {isActive && (
                  <div className="mt-4 space-y-4">
                    <p className={`text-sm leading-relaxed font-sans ${item.subText}`}>
                      {item.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.features.map((feat) => (
                        <span
                          key={feat}
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${item.pillBg}`}
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={item.to}
                      onClick={(e) => e.stopPropagation()}
                      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${item.ctaClass}`}
                    >
                      <span>{item.cta}</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * Bloco 5 da Nova Home: 1 Depoimento em destaque + Convite Final ("Para que nenhuma mãe floresça sozinha").
 */
export function ConviteFinalSection() {
  return (
    <section className="py-20 sm:py-28 bg-[#294D33] text-[#FCF7F9] relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#E8A9BB]/15 blur-[120px]"
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-12 text-center space-y-12">
        {/* 1 Depoimento em Destaque (conforme documentação UI/UX) */}
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/15 p-7 sm:p-9 text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src="/img/fotoMae/fotomae.jpg"
              alt="Mariana S., mãe participante"
              className="w-16 h-16 rounded-full object-cover border-2 border-[#E8A9BB] shrink-0"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/img/fotoMae/fotomae1.jpg";
              }}
            />
            <div className="space-y-2">
              <Quote size={20} className="text-[#E8A9BB]" />
              <p className="font-serif italic text-base sm:text-lg text-white/95 leading-relaxed">
                “Na primeira roda de conversa eu só chorei. Foi o primeiro lugar onde ninguém tentou me corrigir ou dizer o que eu devia sentir. Só me acolheram.”
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <span className="text-xs font-semibold text-[#E8A9BB] font-sans">
                  Mariana S. &bull; Mãe do Bento (4 meses)
                </span>
                <Link
                  to="/impacto"
                  className="text-xs font-semibold text-white/85 hover:text-[#E8A9BB] underline underline-offset-4 transition"
                >
                  Ler mais depoimentos e impacto →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Convite Final */}
        <div className="space-y-6">
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white leading-[1.12] tracking-[-0.02em]">
            Para que nenhuma mãe{" "}
            <span className="italic text-[#E8A9BB]">floresça sozinha.</span>
          </h2>

          <p className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto font-sans">
            Comece gratuitamente o seu diário emocional ou explore nossos caminhos para profissionais, empresas e apoiadores.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/cadastro"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-[#E8A9BB] text-[#1F3224] hover:bg-[#F4DDE5] px-8 py-4 text-base font-bold transition shadow-lg"
            >
              <span>Começar minha jornada gratuita</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/explorar"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 text-white px-7 py-4 text-base font-semibold transition"
            >
              <span>Explorar caminhos</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
