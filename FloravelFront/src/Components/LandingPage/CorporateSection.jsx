import React, { useState } from "react";
import { APP_LINKS } from "../../utils/appLinks";
import { X } from "lucide-react";

export default function CorporateSection() {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoSent, setDemoSent] = useState(false);

  // Bento-Grid com métricas corporativas requeridas
  const corporateMetrics = [
    {
      kpi: "82% Retenção",
      title: "Preservação de Talentos",
      desc: "Mais retenção no primeiro ano pós-parto e menos turnover de profissionais qualificadas.",
      badge: "ESG & Retenção"
    },
    {
      kpi: "4x de ROI",
      title: "Retorno Comprovado",
      desc: "Cada US$ 1 em suporte emocional gera US$ 4 em produtividade e menos absenteísmo (OMS).",
      badge: "Produtividade"
    },
    {
      kpi: "100% Anônimo",
      title: "Conformidade LGPD",
      desc: "Relatórios apenas agregados. Nenhum dado individual é exposto.",
      badge: "Privacidade Total"
    }
  ];

  const plans = [
    {
      name: "PME",
      desc: "Para empresas de 50 a 200 colaboradores",
      price: "R$ 990",
      period: "/mês",
      badge: "Essencial",
      features: [
        "Lote de até 10 licenças ativas",
        "Dashboard de indicadores agregados",
        "Triagem Edimburgo automatizada",
        "Suporte direto ao RH"
      ]
    },
    {
      name: "Mid-Market",
      desc: "Para 200 a 1.000 colaboradores",
      price: "R$ 3.500",
      period: "/mês",
      badge: "Mais Escolhido",
      highlight: true,
      features: [
        "Lote de até 50 licenças ativas",
        "1 Roda de Conversa exclusiva mensal",
        "Filtros departamentais anônimos",
        "Gerente de Contas (CSM) dedicado"
      ]
    },
    {
      name: "Enterprise",
      desc: "Acima de 1.000 colaboradores",
      price: "Sob Consulta",
      period: "",
      badge: "Customizado",
      features: [
        "Licenças customizadas sob demanda",
        "Integração SSO e API de RH",
        "Relatórios executivos e consultoria ESG",
        "SLA prioritário e compliance total"
      ]
    }
  ];

  return (
    <section 
      id="corporate" 
      className="pt-24 sm:pt-32 pb-12 sm:pb-16 bg-[#FCF7F9] relative overflow-hidden border-t border-[#E8A9BB]/30"
    >
      {/* Luz ambiente de fundo */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-10 right-10 w-[42rem] h-[42rem] rounded-full bg-[#F4DDE5]/30 blur-[140px] -z-10" 
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* CABEÇALHO */}
        <div className="sr-group max-w-3xl mb-16 sm:mb-20 text-left">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[3.25rem] font-normal text-[#294D33] leading-[1.12] tracking-[-0.015em]">
            Apoie suas colaboradoras no retorno ao trabalho.{" "}
            <span className="italic font-serif text-[#E8A9BB] block sm:inline">
              Com métricas reais de clima.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#3A443E] leading-relaxed font-sans font-normal max-w-2xl">
            Apoio à maternidade com indicadores agregados, menos turnover pós-licença e privacidade total.
          </p>
        </div>

        {/* ========================================================
            BENTO-GRID CORPORATIVO COM AS 3 MÉTRICAS ESSENCIAIS
        ======================================================== */}
        <div className="sr-group grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {corporateMetrics.map((item) => (
            <div 
              key={item.kpi}
              className="liquid-glass p-8 rounded-[2.5rem] transition-all duration-300 text-left flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#F4DDE5] text-[#294D33] border border-[#E8A9BB]/40">
                  {item.badge}
                </span>

                <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#294D33] mt-5 mb-1.5">
                  {item.kpi}
                </h3>

                <h4 className="text-sm font-bold text-[#294D33] font-nunito mb-2">
                  {item.title}
                </h4>

                <p className="text-xs text-[#3A443E] leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E8A9BB]/30 flex items-center gap-1.5 text-[11px] font-semibold text-[#516B55]">
                <span>Impacto medido e certificado</span>
              </div>
            </div>
          ))}
        </div>

        {/* ========================================================
            REPRESENTAÇÃO VISUAL DO DASHBOARD DE RH CORPORATIVO
        ======================================================== */}
        <div className="liquid-glass sr rounded-[2.5rem] p-7 sm:p-10 mb-16 text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8A9BB]/30">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#294D33]" />
                <h3 className="font-serif text-2xl font-normal text-[#294D33]">
                  Dashboard Executivo de RH
                </h3>
              </div>
              <p className="text-xs text-[#516B55] mt-0.5 font-sans">
                Indicadores agregados &bull; Dados 100% anonimizados (LGPD)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={APP_LINKS.rh}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#F4DDE5] text-[#294D33] text-xs font-semibold hover:bg-[#E8A9BB]/60 transition"
              >
                <span>Ver demonstração interativa</span>
              </a>
            </div>
          </div>

          {/* Mini Painel de Métricas do RH */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            <div className="liquid-chip p-5 rounded-2xl">
              <p className="text-[11px] font-semibold text-[#516B55] uppercase tracking-wider">Adesão ao Programa</p>
              <p className="text-2xl font-serif text-[#294D33] mt-1 font-normal">94,2%</p>
              <p className="text-[10px] text-[#294D33] mt-1 flex items-center gap-1 font-semibold">
                +12% vs. último trimestre
              </p>
            </div>

            <div className="liquid-chip p-5 rounded-2xl">
              <p className="text-[11px] font-semibold text-[#516B55] uppercase tracking-wider">Índice de Sobrecarga</p>
              <p className="text-2xl font-serif text-[#294D33] mt-1 font-normal">Sob Controle</p>
              <p className="text-[10px] text-[#516B55] mt-1">78% relatam alívio semanal</p>
            </div>

            <div className="liquid-chip p-5 rounded-2xl">
              <p className="text-[11px] font-semibold text-[#516B55] uppercase tracking-wider">Retorno ao Trabalho</p>
              <p className="text-2xl font-serif text-[#294D33] mt-1 font-normal">86,5%</p>
              <p className="text-[10px] text-[#294D33] mt-1">Sem interrupção de carreira</p>
            </div>

            <div className="liquid-chip p-5 rounded-2xl">
              <p className="text-[11px] font-semibold text-[#516B55] uppercase tracking-wider">Privacidade</p>
              <p className="text-2xl font-serif text-[#294D33] mt-1 font-normal">LGPD Blindada</p>
              <p className="text-[10px] text-[#516B55] mt-1">Nenhum dado pessoal exposto</p>
            </div>
          </div>

        </div>

        {/* ========================================================
            PLANOS CORPORATIVOS ESTRUTURADOS (MODELO ORIONIX PRICING)
        ======================================================== */}
        <div className="sr text-left mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#294D33]/10 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_-8px_rgba(0,0,0,0.06)] mb-4">
            <span
              className="w-2 h-2 rounded-full bg-[#E8A9BB]"
              style={{ boxShadow: "0 0 8px rgba(232, 169, 187, 0.9)" }}
            />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] text-[#294D33]">
              Planos Corporativos
            </span>
          </div>

          <h3 className="font-serif text-[30px] sm:text-[40px] lg:text-[48px] font-normal text-[#294D33] leading-[1.1] tracking-[-0.02em]">
            Escolha o plano que melhor{" "}
            <span className="italic font-serif text-[#D98A9C] block sm:inline">
              atende à sua empresa.
            </span>
          </h3>
          <p className="mt-3 text-sm sm:text-base text-[#516B55] font-sans max-w-xl">
            Implementação em menos de 48 horas, com comunicação interna pronta para o RH e métricas anonimizadas.
          </p>
        </div>

        <div className="sr-group grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((p) => {
            const isDark = p.name === "Enterprise";

            return (
              <div 
                key={p.name}
                className={`rounded-t-[28px] rounded-b-[48px] p-8 sm:p-10 flex flex-col justify-between text-left transition-all duration-300 ${
                  isDark
                    ? "bg-[#16281B] text-white shadow-[0px_0px_0px_1px_rgba(0,0,0,0.04),0px_1px_2px_0px_rgba(0,0,0,0.08),0px_4px_6px_0px_rgba(0,0,0,0.04),0px_40px_40px_-24px_rgba(0,0,0,0.2)]"
                    : "bg-white text-[#294D33] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.04),0px_1px_2px_0px_rgba(0,0,0,0.08),0px_4px_6px_0px_rgba(0,0,0,0.04),0px_40px_40px_-24px_rgba(0,0,0,0.08)]"
                }`}
              >
                <div>
                  {/* Ícone Geométrico de 4 Pontos (Estilo Orionix) */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="grid grid-cols-2 gap-1 w-6 h-6">
                      <span className={`w-2.5 h-2.5 rounded-full ${isDark ? "bg-[#E8A9BB]" : "bg-[#294D33]"}`} />
                      <span className={`w-2.5 h-2.5 rounded-full ${isDark ? "bg-[#E8A9BB]/60" : "bg-[#294D33]/60"}`} />
                      <span className={`w-2.5 h-2.5 rounded-full ${isDark ? "bg-[#E8A9BB]/60" : "bg-[#294D33]/60"}`} />
                      <span className={`w-2.5 h-2.5 rounded-full ${isDark ? "bg-[#E8A9BB]" : "bg-[#294D33]"}`} />
                    </div>

                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                        isDark
                          ? "bg-white/10 text-[#E8A9BB]"
                          : p.highlight
                          ? "bg-[#F4DDE5] text-[#294D33]"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {p.badge}
                    </span>
                  </div>

                  <h4 className={`font-serif text-[26px] sm:text-[30px] font-normal ${isDark ? "text-white" : "text-[#1F3A27]"}`}>
                    {p.name}
                  </h4>
                  <p className={`text-xs sm:text-sm font-sans mt-1 ${isDark ? "text-[#A4B3A8]" : "text-[#516B55]"}`}>
                    {p.desc}
                  </p>

                  <div className={`my-6 pb-6 border-b ${isDark ? "border-white/10" : "border-[#E8A9BB]/30"}`}>
                    <span className={`font-serif text-3xl sm:text-4xl font-normal ${isDark ? "text-white" : "text-[#294D33]"}`}>
                      {p.price}
                    </span>
                    {p.period && (
                      <span className={`text-xs sm:text-sm ml-1.5 ${isDark ? "text-[#A4B3A8]" : "text-[#516B55]"}`}>
                        {p.period}
                      </span>
                    )}
                  </div>

                  <ul className="space-y-3.5 text-xs sm:text-sm font-sans mb-8">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className={`mt-0.5 text-xs ${isDark ? "text-[#E8A9BB]" : "text-[#294D33]"}`}>
                          ✦
                        </span>
                        <span className={isDark ? "text-[#E4DDD5]" : "text-[#3A443E]"}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDemoModal(true)}
                  className={`w-full py-4 rounded-full text-xs font-semibold uppercase tracking-wider transition cursor-pointer shadow-sm ${
                    isDark
                      ? "bg-white text-[#16281B] hover:bg-[#F4DDE5]"
                      : p.highlight
                      ? "bg-[#294D33] text-white hover:bg-[#1f3c27]"
                      : "bg-[#F4DDE5] text-[#294D33] hover:bg-[#E8A9BB]"
                  }`}
                >
                  Solicitar Proposta Comercial
                </button>
              </div>
            );
          })}
        </div>

      </div>

      {/* ========================================================
          MODAL DE DEMONSTRAÇÃO CORPORATIVA
      ======================================================== */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#294D33]/40 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-[#FCF7F9] rounded-[2rem] p-6 sm:p-8 shadow-2xl border border-[#E8A9BB]/60">
            <button
              onClick={() => { setShowDemoModal(false); setDemoSent(false); }}
              className="absolute top-5 right-5 text-[#516B55] hover:text-[#294D33] hover:bg-[#F4DDE5] p-2 rounded-full transition"
            >
              <X size={20} />
            </button>

            {!demoSent ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDemoSent(true);
                }}
                className="space-y-4 text-left"
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#294D33]">
                    Florável Corporate
                  </span>
                  <h3 className="font-serif text-2xl font-normal text-[#294D33] mt-1">
                    Agende uma Apresentação Executiva
                  </h3>
                  <p className="text-xs text-[#3A443E] mt-1 font-sans">
                    Conheça a plataforma corporativa e veja os indicadores agregados de retenção e clima.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#294D33] mb-1">Nome Completo</label>
                  <input
                    required
                    type="text"
                    placeholder="Seu nome"
                    className="w-full px-4 py-3 rounded-2xl border border-[#E8A9BB]/60 bg-white text-sm focus:border-[#294D33] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#294D33] mb-1">Empresa</label>
                    <input
                      required
                      type="text"
                      placeholder="Nome da sua empresa"
                      className="w-full px-4 py-3 rounded-2xl border border-[#E8A9BB]/60 bg-white text-sm focus:border-[#294D33] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#294D33] mb-1">Nº de Colaboradores</label>
                    <select className="w-full px-4 py-3 rounded-2xl border border-[#E8A9BB]/60 bg-white text-sm focus:border-[#294D33] focus:outline-none">
                      <option>50 a 200</option>
                      <option>200 a 1.000</option>
                      <option>Mais de 1.000</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#294D33] mb-1">E-mail Corporativo</label>
                  <input
                    required
                    type="email"
                    placeholder="voce@empresa.com"
                    className="w-full px-4 py-3 rounded-2xl border border-[#E8A9BB]/60 bg-white text-sm focus:border-[#294D33] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#294D33] text-white text-sm font-semibold hover:bg-[#1f3c27] shadow-md transition mt-2 cursor-pointer"
                >
                  Solicitar contato do time corporativo
                </button>
              </form>
            ) : (
              <div className="text-center py-6">
                <h3 className="font-serif text-2xl font-normal text-[#294D33] mb-2">
                  Solicitação enviada com sucesso!
                </h3>
                <p className="text-sm text-[#3A443E] leading-relaxed mb-6 font-sans">
                  Nosso consultor de sustentabilidade parental entrará em contato em até 24 horas úteis com a proposta e o acesso demonstrativo ao Dashboard.
                </p>
                <button
                  onClick={() => { setShowDemoModal(false); setDemoSent(false); }}
                  className="py-3 px-8 rounded-full bg-[#294D33] text-white text-sm font-semibold hover:bg-[#1f3c27] transition cursor-pointer"
                >
                  Concluir
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </section>
  );
}
