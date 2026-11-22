import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookHeart, Users, HeartHandshake, Quote, Sparkles } from "lucide-react";

/**
 * Bloco 2 da Nova Home: Contexto breve e humano sobre a necessidade do cuidado materno.
 */
export function ContextoHomeSection() {
  return (
    <section id="contexto" className="py-16 sm:py-24 bg-[#FCF7F9] border-t border-[#E8A9BB]/25">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 text-left space-y-5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4DDE5] text-[#294D33] text-[11px] uppercase tracking-[0.2em] font-semibold font-sans">
              Antes de ser mãe, você é você
            </span>

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
 * Bloco 4 da Nova Home: Prévia resumida de Como a Florável Ajuda (com links para Explorar).
 */
export function ComoAjudaPreviewSection() {
  const previews = [
    {
      icon: BookHeart,
      tag: "Gratuito",
      title: "Diário Emocional & Triagem",
      desc: "Registre seu humor em segundos e acompanhe seu bem-estar com a Escala de Edimburgo (EPDS).",
      to: "/explorar",
      cta: "Explorar ferramentas",
      bg: "bg-[#F4DDE5]/55",
    },
    {
      icon: Users,
      tag: "Comunidade Segura",
      title: "Rodas de Conversa",
      desc: "Encontros semanais mediados por psicólogas para compartilhar vivências sem medo de julgamentos.",
      to: "/explorar",
      cta: "Ver como funciona",
      bg: "bg-[#EBF1ED]/80",
    },
    {
      icon: HeartHandshake,
      tag: "Clínica Social",
      title: "Rede de Psicólogas Perinatais",
      desc: "Atendimento online com profissionais verificadas pelo CRP e vagas sociais acessíveis a partir de R$ 40.",
      to: "/profissionais",
      cta: "Conhecer a rede",
      bg: "bg-[#F4DDE5]/55",
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-[#FCF7F9] border-t border-[#E8A9BB]/25">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#516B55] font-sans">
              <Sparkles size={13} className="text-[#A8435F]" />
              Como a Florável ajuda
            </span>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {previews.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`rounded-[1.75rem] ${item.bg} p-7 border border-[#E8A9BB]/40 flex flex-col justify-between text-left transition hover:-translate-y-1 hover:shadow-md`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-2xl bg-white text-[#294D33] flex items-center justify-center shadow-2xs">
                      <Icon size={21} />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/85 text-[11px] font-bold text-[#294D33]">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-[#294D33] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#3A443E] leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>

                <Link
                  to={item.to}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-[#294D33] hover:text-[#A8435F] transition group"
                >
                  <span>{item.cta}</span>
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </Link>
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
