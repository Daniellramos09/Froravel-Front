import React from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { APP_LINKS } from "../../../utils/appLinks";

const PARTNER_PILLARS = [
  {
    index: "01",
    badge: "100% de Repasse",
    title: "Mensalidade fixa de R$ 29,90",
    description:
      "Sem comissão sobre suas sessões: o valor integral de cada consulta particular ou social permanece com a profissional.",
  },
  {
    index: "02",
    badge: "Captação Ética",
    title: "Vitrine viva nas Rodas de Conversa",
    description:
      "Conduza encontros temáticos semanais com mães e crie vínculo terapêutico genuíno, dentro das diretrizes éticas do CFP.",
  },
  {
    index: "03",
    badge: "Autoridade Clínica",
    title: "Selos de Especialização Perinatal",
    description:
      "Destaque sua formação em saúde materna, luto parental, tentantes e puerpério para mães que buscam escuta qualificada.",
  },
  {
    index: "04",
    badge: "Reconhecimento",
    title: "Programa de Flores & Benefícios",
    description:
      "Assiduidade, acolhimento social e participação nas rodas geram Flores que se convertem em isenção de mensalidade e destaque.",
  },
];

const CREDENTIALED_PSYCHOLOGISTS = [
  {
    name: "Dra. Mariana Costa",
    crp: "CRP 06/14829",
    specialty: "Depressão Pós-Parto & Ansiedade Perinatal",
    photo: "/img/fotopsicologo/psicologa1.jpg",
    tag: "Saúde Perinatal · USP",
  },
  {
    name: "Dra. Beatriz Albuquerque",
    crp: "CRP 06/18921",
    specialty: "Luto Parental, Tentantes & Gestação",
    photo: "/img/fotopsicologo/psicologa2.jpg",
    tag: "Acolhimento Perinatal",
  },
  {
    name: "Dra. Camila Nogueira",
    crp: "CRP 06/20144",
    specialty: "Puerpério & Retorno da Licença-Maternidade",
    photo: "/img/fotopsicologo/psicologia4.jpg",
    tag: "Carreira & Maternidade",
  },
  {
    name: "Dra. Helena Vasconcelos",
    crp: "CRP 06/22410",
    specialty: "Vínculo Materno & Rede de Apoio Familiar",
    photo: "/img/fotopsicologo/psicologia1.jpg",
    tag: "Clínica Materna",
  },
];

export default function OrionixPsychologists({ onOpenPartnerModal }) {
  return (
    <section
      id="orionix-psicologos"
      className="py-24 sm:py-32 px-4 sm:px-8 lg:px-12 bg-[#EBF1ED]/70 border-t border-[#294D33]/10"
    >
      <div className="mx-auto max-w-[1560px]">
        {/* Orionix Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-7 text-left space-y-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#294D33]/10 shadow-2xs">
              <span
                className="w-2 h-2 rounded-full bg-[#6E9473]"
                style={{ boxShadow: "0 0 6px rgba(110, 148, 115, 0.7)" }}
              />
              <span className="text-xs font-medium text-[#1F3A27]">
                Para Psicólogos &middot; Rede de Acolhimento Perinatal
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-[3.35rem] font-normal text-[#1F3A27] leading-[1.08] tracking-[-0.03em]">
              Clínica com propósito.{" "}
              <span className="italic font-serif text-[#6E9473]">
                Conecte-se a quem precisa da sua escuta.
              </span>
            </h2>
          </div>

          <div className="lg:col-span-5 text-left lg:pl-6 space-y-4">
            <p className="text-sm sm:text-base text-[#3A443E] leading-relaxed">
              A Florável aproxima psicólogos especializados em saúde mental materna de mães que buscam atendimento acessível, humanizado e livre de barreiras burocráticas.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenPartnerModal}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#294D33] hover:bg-[#1B3322] text-white text-xs sm:text-sm font-semibold transition shadow-sm cursor-pointer"
              >
                <span>Quero ser profissional parceiro</span>
                <ArrowUpRight size={15} />
              </button>
              <a
                href={APP_LINKS.terapeuta}
                className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full bg-white hover:bg-[#F9F8F6] text-[#294D33] border border-[#294D33]/15 text-xs sm:text-sm font-semibold transition"
              >
                <span>Portal do Terapeuta</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4 Partner Value Cards + Featured Clinical Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch mb-12">
          {/* Left: 2x2 Partner Pillars */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PARTNER_PILLARS.map((pillar) => (
              <div
                key={pillar.index}
                className="rounded-[28px] bg-white border border-[#294D33]/8 p-6 sm:p-7 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_16px_32px_-16px_rgba(41,77,51,0.06)] flex flex-col justify-between text-left"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <span className="px-3 py-1 rounded-full bg-[#F9F8F6] text-[11px] font-semibold text-[#294D33] border border-[#294D33]/10">
                      {pillar.badge}
                    </span>
                    <span className="font-mono text-xs text-[#6E9473] font-semibold">
                      /{pillar.index}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl text-[#1F3A27] leading-snug mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#3A443E] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 mt-5 border-t border-[#294D33]/8 flex items-center gap-1.5 text-xs font-medium text-[#516B55]">
                  <CheckCircle2 size={14} className="text-[#6E9473]" />
                  <span>Conformidade CFP &amp; LGPD</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Featured Psychologist Editorial Card (Orionix Portrait Showcase) */}
          <div className="lg:col-span-5 rounded-[32px] bg-[#1F3A27] text-[#FCF7F9] p-6 sm:p-8 shadow-[0_24px_48px_-16px_rgba(20,40,26,0.28)] flex flex-col justify-between text-left relative overflow-hidden">
            <div className="relative w-full aspect-[4/3.4] rounded-2xl overflow-hidden bg-[#294D33] mb-6 border border-white/10">
              <img
                src="/img/fotopsicologo/psicologa1.jpg"
                alt="Dra. Mariana Costa, Psicóloga Perinatal Credenciada"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/img/dra-mariana-psicologa.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F3A27]/80 via-transparent to-transparent" />

              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 text-[#1F3A27] text-[11px] font-semibold">
                CRP Verificado &middot; 06/14829
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[#F4DDE5] font-semibold">
                    Especialista em Puerpério
                  </p>
                  <h3 className="font-serif text-2xl text-white">
                    Dra. Mariana Costa
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#D98A9C] text-[#1F3A27] text-xs font-bold">
                  Valor Social
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-white/85 leading-relaxed">
                &ldquo;Na Florável consigo dedicar horários da minha agenda a mães no puerpério com repasse integral, sem intermediários retendo parte da consulta.&rdquo;
              </p>

              <div className="pt-3 border-t border-white/12 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <span className="text-xs text-white/70">
                  Credenciamento aberto para psicólogos com CRP ativo
                </span>
                <button
                  type="button"
                  onClick={onOpenPartnerModal}
                  className="px-5 py-2.5 rounded-full bg-white hover:bg-[#F4DDE5] text-[#1F3A27] text-xs font-semibold transition cursor-pointer"
                >
                  Credenciar meu perfil
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Roster Strip: Real Psychologists from /img/fotopsicologo/ */}
        <div className="rounded-[28px] bg-white border border-[#294D33]/8 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 text-left">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-[#6E9473] font-semibold">
                Catálogo de Especialistas
              </p>
              <h3 className="font-serif text-xl sm:text-2xl text-[#1F3A27]">
                Profissionais da Rede de Apoio Florável
              </h3>
            </div>
            <a
              href={APP_LINKS.mae}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#294D33] hover:text-[#6E9473]"
            >
              <span>Ver agenda completa na Rede de Apoio</span>
              <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CREDENTIALED_PSYCHOLOGISTS.map((psy) => (
              <div
                key={psy.name}
                className="p-4 rounded-2xl bg-[#F9F8F6] border border-[#294D33]/8 flex items-center gap-3.5 text-left"
              >
                <img
                  src={psy.photo}
                  alt={psy.name}
                  className="w-14 h-14 rounded-2xl object-cover object-top border border-[#D98A9C]/50 shrink-0"
                />
                <div className="min-w-0">
                  <span className="inline-block text-[10px] font-semibold text-[#6E9473] uppercase tracking-wider">
                    {psy.crp}
                  </span>
                  <h4 className="font-serif text-base text-[#1F3A27] truncate">
                    {psy.name}
                  </h4>
                  <p className="text-xs text-[#3A443E] truncate">{psy.specialty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
