import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ArrowRight, PhoneCall } from "lucide-react";
import FloravelLogo from "../../../Components/Common/FloravelLogo";
import { APP_LINKS } from "../../../utils/appLinks";

const FAQ_ITEMS = [
  {
    order: "1",
    question: "A Florável é gratuita para as mães?",
    answer:
      "Sim. O acesso ao Espaço da Mãe, ao Diário Emocional criptografado, à Pausa Guiada de 1 minuto, à Cápsula do Tempo e às Rodas de Conversa semanais é 100% gratuito. Quando desejar sessões individuais com psicólogas perinatais, você encontra valores sociais acessíveis ou cobertura pelo benefício corporativo da sua empresa.",
  },
  {
    order: "2",
    question: "Como funciona a autoavaliação baseada na Escala de Edimburgo (EPDS)?",
    answer:
      "A Escala de Depressão Pós-Parto de Edimburgo (EPDS) é um instrumento reconhecido pela OMS para rastreio emocional no período perinatal. Na Florável, ela é apresentada de forma acolhedora e confidencial em cerca de 3 minutos, ajudando você a reconhecer sinais de sobrecarga sem diagnósticos frios.",
  },
  {
    order: "3",
    question: "Meus registros no Diário Emocional são realmente privados?",
    answer:
      "Absolutamente. Seus desabafos no Diário Emocional e na Cápsula do Tempo são protegidos por criptografia e pertencem exclusivamente a você. Mesmo quando a mãe utiliza a Florável como benefício corporativo, a empresa jamais tem acesso a qualquer dado individual.",
  },
  {
    order: "4",
    question: "Sou psicóloga perinatal. Como funciona o credenciamento e o repasse?",
    answer:
      "Psicólogas com CRP ativo e atuação em saúde materna pagam apenas uma assinatura fixa de R$ 29,90/mês e recebem 100% do valor das consultas realizadas, sem taxas de intermediação. Além disso, podem mediar Rodas de Conversa e acumular Flores que isentam a mensalidade.",
  },
  {
    order: "5",
    question: "Como minha empresa pode contratar o Florável Corporativo para o RH?",
    answer:
      "A implementação é feita em até 48 horas para empresas de qualquer porte (PME, Mid-Market ou Enterprise). Suas colaboradoras gestantes e no pós-parto ganham acesso imediato à plataforma, enquanto o RH acompanha indicadores agregados de adesão e bem-estar em total conformidade com a LGPD.",
  },
  {
    order: "6",
    question: "O que fazer se eu estiver passando por um momento de crise intensa agora?",
    answer:
      "A Florável é uma plataforma de acolhimento contínuo e prevenção, mas não substitui atendimento emergencial. Se você estiver em crise aguda neste momento, ligue gratuitamente para o CVV (Centro de Valorização da Vida) pelo número 188 — o atendimento é sigiloso e funciona 24 horas em todo o Brasil.",
  },
];

export default function OrionixFaqAndFooter({ onOpenTriagem, onOpenCorporateModal }) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (idx) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  };

  return (
    <>
      {/* =====================================================================
          08 — PERGUNTAS FREQUENTES (Orionix "FAQ List" Reproduction)
      ===================================================================== */}
      <section
        id="orionix-faq"
        className="py-24 sm:py-32 px-4 sm:px-8 lg:px-12 bg-[#F9F8F6] border-t border-[#294D33]/8"
      >
        <div className="mx-auto max-w-[1560px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Orionix Pill + Title + CVV Care Box */}
            <div className="lg:col-span-5 text-left space-y-6 lg:sticky lg:top-28">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#294D33]/8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_-8px_rgba(0,0,0,0.06)]">
                <span
                  className="w-2 h-2 rounded-full bg-[#D98A9C]"
                  style={{ boxShadow: "0 0 6px rgba(217, 138, 156, 0.7)" }}
                />
                <span className="text-xs font-medium text-[#1F3A27]">
                  FAQ &middot; Dúvidas Frequentes
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#1F3A27] leading-[1.08] tracking-[-0.03em]">
                Dúvidas?
                <br />
                <span className="italic font-serif text-[#6E9473]">
                  Estamos aqui para acolher.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-[#3A443E] leading-relaxed max-w-md">
                Reunimos as principais respostas para mães, psicólogas perinatais e equipes de Recursos Humanos.
              </p>

              {/* Immediate Emotional Crisis Note (CVV 188) */}
              <div className="rounded-3xl bg-white border border-[#D98A9C]/40 p-6 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#294D33]">
                  <PhoneCall size={14} className="text-[#D98A9C]" />
                  <span>Precisa de escuta urgente agora?</span>
                </div>
                <p className="text-xs text-[#3A443E] leading-relaxed">
                  Em caso de crise emocional intensa, ligue gratuitamente para o{" "}
                  <strong className="text-[#1F3A27]">CVV pelo telefone 188</strong>{" "}
                  (atendimento 24h e sigiloso em todo o Brasil).
                </p>
              </div>
            </div>

            {/* Right Column: Orionix Numbered Accordion List */}
            <div className="lg:col-span-7">
              <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-[#294D33]/8 px-6 sm:px-9 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_20px_40px_-20px_rgba(41,77,51,0.06)] divide-y divide-[#294D33]/10">
                {FAQ_ITEMS.map((item, idx) => {
                  const isOpen = openIndex === idx;
                  return (
                    <div key={item.order} className="py-6 text-left">
                      <button
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        aria-expanded={isOpen}
                        className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group"
                      >
                        <div className="flex items-baseline gap-5 sm:gap-7">
                          {/* Orionix Order Number (opacity 0.35) */}
                          <span className="font-serif text-lg sm:text-xl text-[#1F3A27]/35 group-hover:text-[#6E9473] transition-colors w-5 shrink-0">
                            {item.order}
                          </span>
                          <span className="font-serif text-lg sm:text-xl text-[#1F3A27] group-hover:text-[#294D33] leading-snug">
                            {item.question}
                          </span>
                        </div>

                        <span
                          className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                            isOpen
                              ? "bg-[#294D33] text-white border-[#294D33] rotate-180"
                              : "bg-[#F9F8F6] text-[#294D33] border-[#294D33]/12 group-hover:bg-[#F4DDE5]/50"
                          }`}
                        >
                          <ChevronDown size={16} />
                        </span>
                      </button>

                      {isOpen && (
                        <div className="pl-10 sm:pl-12 pr-4 pt-3.5">
                          <p className="text-sm sm:text-[15px] text-[#3A443E] leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          09 — CTA FINAL & RODAPÉ (Orionix "CTA Wrapper" + Footer)
      ===================================================================== */}
      <footer className="pt-8 pb-16 px-2 sm:px-4 lg:px-6 bg-[#F9F8F6]">
        <div className="mx-auto max-w-[1560px] space-y-14">
          {/* Orionix Dark Rounded CTA Wrapper (border-radius: 32px) */}
          <div className="rounded-[28px] sm:rounded-[36px] bg-[#1B3122] text-white p-8 sm:p-12 lg:p-16 border border-[#294D33]/20 shadow-[0_32px_64px_-20px_rgba(20,38,25,0.35)] relative overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#6E9473]/25 blur-[110px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 right-10 w-80 h-80 rounded-full bg-[#D98A9C]/20 blur-[100px]"
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Orionix "Text White" Dot + Headline + White Pill Button */}
              <div className="lg:col-span-7 text-left space-y-6">
                <div className="inline-flex items-center gap-2.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-[#D98A9C]"
                    style={{ boxShadow: "0 0 8px #D98A9C" }}
                  />
                  <span className="text-xs sm:text-sm font-medium text-white/90 tracking-wide">
                    Sobrecarga &rarr; Espaço para Respirar
                  </span>
                </div>

                <h2 className="font-serif text-3xl sm:text-5xl lg:text-[3.5rem] font-normal text-white leading-[1.06] tracking-[-0.03em]">
                  Você cuida de tantas vidas.
                  <br />
                  <span className="italic font-serif text-[#F4DDE5]">
                    Deixe a Florável cuidar de você.
                  </span>
                </h2>

                <p className="text-sm sm:text-base text-white/75 max-w-xl leading-relaxed">
                  Comece hoje pelo seu check-in emocional gratuito, faça a triagem confidencial ou leve a Florável para as mães da sua organização.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <button
                    type="button"
                    onClick={onOpenTriagem}
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-white hover:bg-[#F4DDE5] text-[#1B3122] text-sm font-semibold transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.18)] cursor-pointer"
                  >
                    <span>Fazer autoavaliação gratuita</span>
                    <ArrowRight size={16} />
                  </button>

                  <a
                    href={APP_LINKS.mae}
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white/10 hover:bg-white/18 text-white border border-white/20 text-sm font-semibold transition"
                  >
                    <span>Entrar no Espaço da Mãe</span>
                  </a>

                  <button
                    type="button"
                    onClick={onOpenCorporateModal}
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-white/80 hover:text-white text-xs sm:text-sm font-medium transition cursor-pointer"
                  >
                    <span>Falar com consultor RH &rarr;</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Serene Maternal Frame */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[420px] aspect-[4/3.1] rounded-3xl overflow-hidden border border-white/15 bg-[#294D33]">
                  <img
                    src="/img/2.jpg"
                    alt="Mulher em momento tranquilo de pausa e acolhimento"
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/img/maeDescansando.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1B3122]/75 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                    <span className="font-serif italic text-base text-[#F4DDE5]">
                      &ldquo;Florescer além da maternidade.&rdquo;
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px]">
                      100% Gratuito
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Editorial Multi-Column Footer */}
          <div className="px-4 sm:px-8 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#294D33]/10 text-left">
              <div className="lg:col-span-2 space-y-4">
                <FloravelLogo />
                <p className="text-sm text-[#3A443E] leading-relaxed max-w-sm">
                  Ecossistema de saúde emocional materna: acolhimento contínuo, triagem especializada EPDS, rodas comunitárias e psicologia perinatal.
                </p>
                <p className="text-xs font-medium text-[#516B55]">
                  Plataforma em estrita conformidade com a LGPD e diretrizes éticas do CFP.
                </p>
              </div>

              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F3A27]">
                  Jornada &amp; Seções
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-[#516B55]">
                  <li>
                    <a href="#orionix-hero" className="hover:text-[#294D33]">
                      Início
                    </a>
                  </li>
                  <li>
                    <a href="#orionix-manifesto" className="hover:text-[#294D33]">
                      Nossa Proposta
                    </a>
                  </li>
                  <li>
                    <a href="#orionix-jornada" className="hover:text-[#294D33]">
                      Jornada da Mãe (01–04)
                    </a>
                  </li>
                  <li>
                    <a href="#orionix-pilares" className="hover:text-[#294D33]">
                      Pilares da Plataforma
                    </a>
                  </li>
                  <li>
                    <a href="#orionix-faq" className="hover:text-[#294D33]">
                      Perguntas Frequentes
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F3A27]">
                  Portais Integrados
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-[#516B55]">
                  <li>
                    <a href={APP_LINKS.mae} className="hover:text-[#294D33]">
                      Espaço da Mãe
                    </a>
                  </li>
                  <li>
                    <a href={APP_LINKS.terapeuta} className="hover:text-[#294D33]">
                      Portal do Terapeuta
                    </a>
                  </li>
                  <li>
                    <a href={APP_LINKS.rh} className="hover:text-[#294D33]">
                      Dashboard RH Corporativo
                    </a>
                  </li>
                  <li>
                    <Link to="/login" className="hover:text-[#294D33]">
                      Entrar na Conta
                    </Link>
                  </li>
                  <li>
                    <Link to="/cadastro" className="hover:text-[#294D33]">
                      Criar Conta Gratuita
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F3A27]">
                  Versões &amp; Suporte
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-[#516B55]">
                  <li>
                    <Link to="/" className="font-semibold text-[#294D33] hover:underline">
                      Ver Landing Page Clássica (/)
                    </Link>
                  </li>
                  <li>
                    <Link to="/nova" className="text-[#6E9473]">
                      Versão Editorial Orionix (/nova)
                    </Link>
                  </li>
                  <li className="pt-2 text-xs text-[#3A443E]">
                    <strong className="block text-[#1F3A27]">Apoio Imediato 24h:</strong>
                    CVV — Ligue 188 (Gratuito)
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#516B55]">
              <p>© {new Date().getFullYear()} Florável Saúde Materna. Todos os direitos reservados.</p>
              <p>Desenvolvido com rigor clínico, escuta e afeto para mulheres reais.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
