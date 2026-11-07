import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { APP_LINKS } from "../../../utils/appLinks";

const MARQUEE_PHRASES = [
  "Um espaço para você respirar",
  "Escuta perinatal sem julgamentos",
  "Antes de ser mãe, existe você",
  "Triagem clínica EPDS confidencial",
  "Você também merece ser cuidada",
];

export default function OrionixHero({ onOpenTriagem }) {
  return (
    <section
      id="orionix-hero"
      className="relative pt-20 sm:pt-24 pb-10 px-2 sm:px-4 lg:px-6 bg-[#F9F8F6] overflow-x-clip"
    >
      {/* =====================================================================
          1. ORIONIX MONUMENTAL FRAMED HERO CONTAINER (border-radius: 40px)
      ===================================================================== */}
      <div className="mx-auto max-w-[1560px] rounded-[28px] sm:rounded-[40px] bg-[#F3EFEA] border border-[#294D33]/8 shadow-[0_2px_4px_rgba(0,0,0,0.03),0_32px_64px_-24px_rgba(41,77,51,0.10)] relative overflow-hidden min-h-[82svh] flex flex-col justify-between">
        {/* Subtle Warm Botanical Texture on Background */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
          <img
            src="/img/fotoheader/header22.png"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-right opacity-25"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 82% 45%, rgba(217,138,156,0.16) 0%, rgba(243,239,234,0.92) 56%, rgba(249,248,246,0.98) 100%)",
            }}
          />
        </div>

        {/* Top Bar inside Hero Frame */}
        <div className="relative z-10 px-6 sm:px-12 lg:px-16 pt-8 sm:pt-11 flex flex-wrap items-center justify-between gap-3">
          {/* Orionix Signature Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#294D33]/8 shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.05)]">
            <span
              className="w-2 h-2 rounded-full bg-[#D98A9C] shrink-0"
              style={{ boxShadow: "0 0 8px rgba(217, 138, 156, 0.7)" }}
            />
            <span className="text-xs font-medium text-[#294D33] tracking-tight">
              Saúde emocional materna &middot; Escuta clínica e afeto
            </span>
          </div>

          <span className="hidden md:inline-block text-xs font-medium text-[#516B55] bg-white/85 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-[#294D33]/8">
            Protagonismo da mulher em cada fase do puerpério
          </span>
        </div>

        {/* Center Content Grid — Expressive Typography Left + Mother Protagonist Portrait Right */}
        <div className="relative z-10 px-6 sm:px-12 lg:px-16 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column (7 cols): Orionix Display Typography */}
          <div className="lg:col-span-7 text-left">
            <p className="text-sm sm:text-base font-medium text-[#516B55] mb-4 tracking-tight">
              Quando nasce um bebê, nasce também uma mulher que precisa de colo, tempo e escuta real.
            </p>

            {/* Orionix Hero Title Structure: Fraunces Display + Inline Highlight Box ("Intro") */}
            <h1 className="font-serif text-[clamp(2.35rem,5.6vw,4.95rem)] font-normal text-[#1F3A27] leading-[1.04] tracking-[-0.035em]">
              <span className="block">Maternidade real,</span>
              <span className="inline-flex flex-wrap items-baseline gap-x-3 gap-y-2 mt-1.5">
                <span>sem julgamentos.</span>
                <span className="inline-block px-4 sm:px-5 py-1 sm:py-1.5 rounded-2xl bg-[#294D33]/8 border border-[#294D33]/12 italic font-serif text-[#294D33]">
                  Existe você.
                </span>
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-[#3A443E] leading-[1.55] max-w-xl font-normal">
              Um espaço de acolhimento emocional pensado para a mãe. Reconheça o que você sente, registre seus dias sem cobranças e conecte-se com psicólogas perinatais no seu próprio ritmo.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                type="button"
                onClick={onOpenTriagem}
                className="group inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full bg-[#294D33] hover:bg-[#1B3322] text-[#FCF7F9] text-sm sm:text-[15px] font-semibold transition-all duration-300 shadow-[0_12px_32px_-8px_rgba(41,77,51,0.35)] hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Fazer autoavaliação gratuita</span>
                <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight size={14} />
                </span>
              </button>

              <a
                href="#orionix-jornada"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-white hover:bg-[#F4DDE5]/50 text-[#294D33] border border-[#294D33]/12 text-sm sm:text-[15px] font-semibold transition-all duration-300 shadow-2xs"
              >
                <span>Conhecer a Jornada da Mãe</span>
              </a>
            </div>
          </div>

          {/* Right Column (5 cols): Editorial Portrait of the Mother as Protagonist */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[440px]">
              {/* Main Portrait Frame */}
              <div className="relative aspect-[4/4.3] rounded-[28px] sm:rounded-[32px] overflow-hidden bg-white p-2.5 border border-[#294D33]/10 shadow-[0_24px_48px_-16px_rgba(31,58,39,0.16)]">
                <div className="relative w-full h-full rounded-[22px] sm:rounded-[24px] overflow-hidden">
                  <img
                    src="/img/hero-woman-serene.jpg"
                    alt="Mulher serena em momento de pausa e cuidado emocional"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F3A27]/60 via-transparent to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 backdrop-blur-md p-3.5 border border-white shadow-md flex items-center justify-between gap-3 text-left">
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-wider text-[#6E9473] font-semibold">
                        01 &middot; Acolher
                      </p>
                      <p className="font-serif text-sm sm:text-base text-[#1F3A27]">
                        &ldquo;Você também merece ser cuidada.&rdquo;
                      </p>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D98A9C] shrink-0" />
                  </div>
                </div>
              </div>

              {/* Floating Secondary Maternal Badge (Top Left) */}
              <div className="hidden sm:flex absolute -top-4 -left-6 items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border border-[#294D33]/10 shadow-[0_12px_28px_-8px_rgba(0,0,0,0.12)]">
                <img
                  src="/img/fotoMae/fotomae5.jpg"
                  alt=""
                  className="w-9 h-9 rounded-full object-cover border border-[#D98A9C]"
                />
                <div className="text-left">
                  <p className="text-xs font-bold text-[#1F3A27]">Espaço da Mãe</p>
                  <p className="text-[10px] text-[#516B55]">Diário, pausa e escuta perinatal</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orionix Hero Bottom Bar (Metadata Left + Center Cue + Quick Access Right) */}
        <div className="relative z-10 px-6 sm:px-12 lg:px-16 py-5 border-t border-[#294D33]/10 bg-white/75 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#3A443E]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6E9473] shrink-0" />
            <span className="font-semibold text-[#294D33]">Triagem Validada (EPDS)</span>
            <span className="text-[#516B55]">&middot; Escala científica confidencial (OMS)</span>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-xs text-[#516B55]">
            <span>Diário Emocional 100% Gratuito</span>
            <span>&bull;</span>
            <span>Psicólogas com CRP Ativo</span>
            <span>&bull;</span>
            <span>Rodas Semanais Ao Vivo</span>
          </div>

          <a
            href={APP_LINKS.mae}
            className="inline-flex items-center gap-1.5 font-semibold text-[#294D33] hover:text-[#6E9473] transition-colors"
          >
            <span>Entrar no Espaço da Mãe</span>
            <ArrowRight size={13} />
          </a>
        </div>
      </div>

      {/* =====================================================================
          2. ORIONIX CONTINUOUS SLIDING TEXT & EDITORIAL SHOWCASE STRIP
             (Modeled on Orionix Section - Clients + Section - Reels)
      ===================================================================== */}
      <div className="mx-auto max-w-[1560px] mt-8">
        <div className="relative rounded-[28px] sm:rounded-[32px] bg-white border border-[#294D33]/8 p-6 sm:p-8 lg:p-10 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_20px_40px_-20px_rgba(41,77,51,0.07)] overflow-hidden">
          {/* Continuous Marquee Band */}
          <div className="w-full max-w-full overflow-hidden py-2 border-b border-[#294D33]/8 mb-8 select-none">
            <div className="orionix-marquee-track flex items-center gap-10 whitespace-nowrap">
              {[...MARQUEE_PHRASES, ...MARQUEE_PHRASES].map((phrase, idx) => (
                <div key={idx} className="inline-flex items-center gap-10">
                  <span className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-[#294D33]/85 tracking-tight">
                    {phrase}
                  </span>
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-[#D98A9C] shrink-0"
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Editorial Trio Below Sliding Text: Mother Protagonism & Real Context */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 space-y-3 text-left">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#6E9473]">
                <Sparkles size={13} className="text-[#D98A9C]" />
                <span>Cuidado centrado na mulher</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1F3A27] leading-[1.15] tracking-tight">
                O foco quase sempre vai todo para o bebê.{" "}
                <span className="italic text-[#6E9473]">A Florável olha para você.</span>
              </h2>
              <p className="text-sm text-[#3A443E] leading-relaxed">
                Construímos uma jornada contínua que começa na validação silenciosa do seu cansaço e evolui até a escuta clínica especializada e o fortalecimento da sua rede.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-[#F9F8F6] p-4 border border-[#294D33]/8 flex flex-col justify-between text-left">
                <span className="font-mono text-xs text-[#6E9473] font-semibold">01 / ESCUTA</span>
                <p className="font-serif text-lg text-[#294D33] mt-3 leading-snug">
                  Sem cobrança de produtividade materna
                </p>
                <p className="text-xs text-[#516B55] mt-1.5">
                  Check-in gentil e diário livre de metas ou ofensivas diárias.
                </p>
              </div>

              <div className="rounded-2xl bg-[#F4DDE5]/45 p-4 border border-[#D98A9C]/30 flex flex-col justify-between text-left">
                <span className="font-mono text-xs text-[#A8435F] font-semibold">02 / CIÊNCIA</span>
                <p className="font-serif text-lg text-[#294D33] mt-3 leading-snug">
                  Rastreio com Escala de Edimburgo
                </p>
                <p className="text-xs text-[#3A443E] mt-1.5">
                  Compreenda sinais de sobrecarga e baby blues com acolhimento.
                </p>
              </div>

              <div className="rounded-2xl bg-[#EBF1ED] p-4 border border-[#6E9473]/25 flex flex-col justify-between text-left">
                <span className="font-mono text-xs text-[#294D33] font-semibold">03 / REDE</span>
                <p className="font-serif text-lg text-[#294D33] mt-3 leading-snug">
                  Psicólogas perinatais &amp; rodas vivas
                </p>
                <p className="text-xs text-[#3A443E] mt-1.5">
                  Atendimento com valor social e encontros semanais gratuitos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
