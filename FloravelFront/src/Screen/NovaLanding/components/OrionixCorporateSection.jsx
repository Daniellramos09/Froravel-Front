import React from "react";
import { ArrowUpRight, ShieldCheck, Check } from "lucide-react";
import { APP_LINKS } from "../../../utils/appLinks";

const CORPORATE_PILLARS = [
  {
    tag: "Retenção & Cultura",
    title: "Apoio da gestação ao retorno da licença",
    description:
      "O período pós-licença é um dos momentos mais sensíveis para a permanência de mulheres nas organizações. A Florável oferece suporte emocional contínuo para uma transição saudável.",
  },
  {
    tag: "Governança & Privacidade",
    title: "Indicadores 100% agregados e anônimos (LGPD)",
    description:
      "O RH acompanha a adesão ao programa e o clima emocional materno em relatórios consolidados, sem jamais expor relatos individuais, diários ou prontuários clínicos.",
  },
  {
    tag: "Cuidado Integrado",
    title: "Rodas corporativas e rede perinatal",
    description:
      "Suas colaboradoras recebem acesso imediato ao Espaço da Mãe, triagem preventiva EPDS, rodas de conversa e sessões com psicólogas perinatais.",
  },
];

const CORPORATE_PLANS = [
  {
    id: "pme",
    badge: "Essencial",
    name: "Plano PME",
    subtitle: "Para empresas de 50 a 200 colaboradores",
    price: "R$ 990",
    unit: "/mês",
    featured: false,
    features: [
      "Lote de até 10 licenças maternas ativas",
      "Acesso integral ao Espaço da Mãe e Diário",
      "Triagem preventiva com Escala de Edimburgo",
      "Painel de indicadores agregados para o RH",
      "Kit de comunicação interna de boas-vindas",
    ],
  },
  {
    id: "mid",
    badge: "Mais Escolhido",
    name: "Plano Mid-Market",
    subtitle: "Para organizações de 200 a 1.000 colaboradores",
    price: "R$ 3.500",
    unit: "/mês",
    featured: true,
    features: [
      "Lote de até 50 licenças maternas ativas",
      "1 Roda de Conversa exclusiva mensal com psicóloga",
      "Recortes departamentais 100% anonimizados (LGPD)",
      "Acompanhamento de retorno pós-licença",
      "Gerente de sucesso dedicado ao time de Pessoas",
    ],
  },
  {
    id: "enterprise",
    badge: "Customizado",
    name: "Plano Enterprise",
    subtitle: "Acima de 1.000 colaboradores",
    price: "Sob Consulta",
    unit: "",
    featured: false,
    features: [
      "Licenças dimensionadas sob demanda",
      "Integração com plataformas de RH e SSO",
      "Relatórios executivos para comitês de ESG e D&I",
      "Trilhas de sensibilização para lideranças",
      "Atendimento prioritário e SLA dedicado",
    ],
  },
];

export default function OrionixCorporateSection({ onOpenCorporateModal }) {
  return (
    <section
      id="orionix-corporativo"
      className="py-24 sm:py-32 px-4 sm:px-8 lg:px-12 bg-[#F9F8F6] border-t border-[#294D33]/8"
    >
      <div className="mx-auto max-w-[1560px]">
        {/* Orionix Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-7 text-left space-y-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#294D33]/8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_-8px_rgba(0,0,0,0.06)]">
              <span
                className="w-2 h-2 rounded-full bg-[#D98A9C]"
                style={{ boxShadow: "0 0 6px rgba(217, 138, 156, 0.7)" }}
              />
              <span className="text-xs font-medium text-[#1F3A27]">
                Para Empresas e RH &middot; Florável Corporativo
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-[3.35rem] font-normal text-[#1F3A27] leading-[1.08] tracking-[-0.03em]">
              Benefício corporativo de{" "}
              <span className="italic font-serif text-[#D98A9C]">
                saúde mental materna.
              </span>
            </h2>
          </div>

          <div className="lg:col-span-5 text-left lg:pl-6 space-y-4">
            <p className="text-sm sm:text-base text-[#3A443E] leading-relaxed">
              Empresas contratam a Florável para acolher colaboradoras gestantes, puérperas e mães no retorno ao trabalho, fortalecendo a cultura de cuidado com governança e privacidade total.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenCorporateModal}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#294D33] hover:bg-[#1B3322] text-white text-xs sm:text-sm font-semibold transition cursor-pointer"
              >
                <span>Solicitar demonstração para o RH</span>
                <ArrowUpRight size={15} />
              </button>
              <a
                href={APP_LINKS.rh}
                className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full bg-white hover:bg-[#F4DDE5]/40 text-[#294D33] border border-[#294D33]/12 text-xs sm:text-sm font-semibold transition"
              >
                <span>Abrir Dashboard RH</span>
              </a>
            </div>
          </div>
        </div>

        {/* 3 Value Cards + HR Dashboard Preview Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {CORPORATE_PILLARS.map((item, idx) => (
            <div
              key={item.title}
              className="rounded-[28px] bg-white border border-[#294D33]/8 p-7 sm:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_20px_40px_-20px_rgba(41,77,51,0.06)] text-left flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="px-3 py-1 rounded-full bg-[#F4DDE5]/55 text-[11px] font-semibold text-[#294D33]">
                    {item.tag}
                  </span>
                  <span className="font-mono text-xs text-[#6E9473] font-semibold">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-[#1F3A27] leading-snug mb-2.5">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#3A443E] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-[#294D33]/8 flex items-center gap-2 text-xs font-medium text-[#516B55]">
                <ShieldCheck size={15} className="text-[#6E9473]" />
                <span>Implementação simples com apoio ao RH</span>
              </div>
            </div>
          ))}
        </div>

        {/* Orionix "Section - Pricing" Adapted to Florável Corporate Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {CORPORATE_PLANS.map((plan) => {
            const isDark = plan.featured;
            return (
              <div
                key={plan.id}
                className={`rounded-[32px] p-7 sm:p-9 flex flex-col justify-between text-left border transition-all duration-300 ${
                  isDark
                    ? "bg-[#1B3122] text-white border-[#1B3122] shadow-[0_28px_56px_-16px_rgba(27,49,34,0.32)]"
                    : "bg-white text-[#1F3A27] border-[#294D33]/10 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_20px_40px_-20px_rgba(41,77,51,0.06)]"
                }`}
              >
                <div>
                  {/* Top Row: Badge + Orionix 3-Dot Indicator */}
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <span
                      className={`px-3.5 py-1 rounded-full text-xs font-semibold ${
                        isDark
                          ? "bg-white/12 text-[#F4DDE5] border border-white/15"
                          : "bg-[#F9F8F6] text-[#294D33] border border-[#294D33]/10"
                      }`}
                    >
                      {plan.badge}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#D98A9C]" />
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isDark ? "bg-white/60" : "bg-[#6E9473]"
                        }`}
                      />
                    </div>
                  </div>

                  <h3
                    className={`font-serif text-2xl sm:text-3xl font-normal ${
                      isDark ? "text-white" : "text-[#1F3A27]"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm mt-1 ${
                      isDark ? "text-white/70" : "text-[#516B55]"
                    }`}
                  >
                    {plan.subtitle}
                  </p>

                  {/* Price Block */}
                  <div
                    className={`my-6 py-5 border-y ${
                      isDark ? "border-white/12" : "border-[#294D33]/10"
                    } flex items-baseline gap-1.5`}
                  >
                    <span className="font-serif text-3xl sm:text-4xl font-normal">
                      {plan.price}
                    </span>
                    {plan.unit && (
                      <span
                        className={`text-xs ${
                          isDark ? "text-white/65" : "text-[#516B55]"
                        }`}
                      >
                        {plan.unit}
                      </span>
                    )}
                  </div>

                  {/* Benefits List */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat) => (
                      <li
                        key={feat}
                        className={`flex items-start gap-2.5 text-xs sm:text-sm ${
                          isDark ? "text-white/85" : "text-[#3A443E]"
                        }`}
                      >
                        <Check
                          size={15}
                          className={`mt-0.5 shrink-0 ${
                            isDark ? "text-[#D98A9C]" : "text-[#6E9473]"
                          }`}
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={onOpenCorporateModal}
                  className={`w-full py-4 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-2 ${
                    isDark
                      ? "bg-white hover:bg-[#F4DDE5] text-[#1B3122]"
                      : "bg-[#294D33] hover:bg-[#1B3122] text-white"
                  }`}
                >
                  <span>Solicitar proposta comercial</span>
                  <ArrowUpRight size={15} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
