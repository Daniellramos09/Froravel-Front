import React, { useState } from "react";
import { APP_LINKS } from "../../utils/appLinks";
import {
  Building2,
  TrendingUp, 
  CheckCircle, 
  ShieldCheck, 
  ExternalLink, 
  ArrowRight,
  X,
  Sparkles,
  Lock
} from "lucide-react";

export default function CorporateSection() {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoSent, setDemoSent] = useState(false);

  // Bento-Grid com métricas corporativas requeridas
  const corporateMetrics = [
    {
      kpi: "82% Retenção",
      title: "Preservação de Talentos",
      desc: "Retenção superior no primeiro ano pós-parto, reduzindo o turnover de lideranças e profissionais qualificadas.",
      badge: "ESG & Retenção"
    },
    {
      kpi: "4x de ROI",
      title: "Retorno Comprovado",
      desc: "Cada US$ 1 investido em suporte emocional gera US$ 4 em produtividade e redução direta de absenteísmo (OMS).",
      badge: "Produtividade"
    },
    {
      kpi: "100% Anônimo",
      title: "Conformidade LGPD",
      desc: "Relatórios de risco exclusivamente agregados. Nenhum dado individual de colaboradora é jamais exposto.",
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
      className="py-24 sm:py-32 bg-[#FCF7F9] relative overflow-hidden border-t border-[#E8A9BB]/30"
    >
      {/* ========================================================
          FOTOS DE FLORES LIVRES (SEM MOLDURA, SOLTAS NOS CANTOS)
      ======================================================== */}
      <img
        src="/img/fotoFlores/flor6-removebg-preview.png"
        alt=""
        aria-hidden="true"
        className="flor-sway pointer-events-none absolute top-25 right-10 w-44 sm:w-60 opacity-75 select-none drop-shadow-sm -rotate-70 z-0 -scale-x-125 scale-125"
      />

      <img
        src="/img/fotoFlores/florong-removebg-preview.png"
        alt=""
        aria-hidden="true"
        className="flor-sway-b pointer-events-none absolute -bottom-10 -right-7 w-44 sm:w-64 opacity-70 select-none drop-shadow-xs rotate-12 z-0 scale-90"
      />

      {/* Luz ambiente de fundo */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-10 right-10 w-[42rem] h-[42rem] rounded-full bg-[#F4DDE5]/30 blur-[140px] -z-10" 
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* CABEÇALHO */}
        <div className="sr-group max-w-3xl mb-16 sm:mb-20 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4DDE5] border border-[#E8A9BB]/50 shadow-xs mb-4">
            <Building2 size={14} className="text-[#294D33]" />
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#294D33] font-sans">
              Florável Corporate &bull; B2B Sustentabilidade Parental
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[3.25rem] font-normal text-[#294D33] leading-[1.12] tracking-[-0.015em]">
            Apoie suas colaboradoras no retorno ao trabalho.{" "}
            <span className="italic font-serif text-[#E8A9BB] block sm:inline">
              Com métricas reais de clima.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#3A443E] leading-relaxed font-sans font-normal max-w-2xl">
            Apoio estruturado à maternidade com indicadores agregados, redução comprovada de turnover pós-licença e proteção integral à privacidade das colaboradoras.
          </p>
        </div>

        {/* ========================================================
            BENTO-GRID CORPORATIVO COM AS 3 MÉTRICAS ESSENCIAIS
        ======================================================== */}
        <div className="sr-group grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {corporateMetrics.map((item) => (
            <div 
              key={item.kpi}
              className="p-8 rounded-[2.5rem] bg-white border border-[#E8A9BB] shadow-sm hover:shadow-md transition-all duration-300 text-left flex flex-col justify-between"
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
                <ShieldCheck size={13} className="text-[#294D33]" />
                <span>Impacto medido e certificado</span>
              </div>
            </div>
          ))}
        </div>

        {/* ========================================================
            REPRESENTAÇÃO VISUAL DO DASHBOARD DE RH CORPORATIVO
        ======================================================== */}
        <div className="sr rounded-[2.5rem] bg-white border border-[#E8A9BB] p-7 sm:p-10 shadow-lg shadow-[#294D33]/5 mb-16 text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8A9BB]/30">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#294D33]" />
                <h3 className="font-serif text-2xl font-normal text-[#294D33]">
                  Dashboard Executivo de RH
                </h3>
              </div>
              <p className="text-xs text-[#516B55] mt-0.5 font-sans">
                Indicadores agregados &bull; Dados 100% anonimizados em conformidade rigorosa com a LGPD
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={APP_LINKS.rh}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#F4DDE5] text-[#294D33] text-xs font-semibold hover:bg-[#E8A9BB]/60 transition"
              >
                <span>Ver demonstração interativa</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Mini Painel de Métricas do RH */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            <div className="bg-[#FCF7F9] p-5 rounded-2xl border border-[#E8A9BB]/50">
              <p className="text-[11px] font-semibold text-[#516B55] uppercase tracking-wider">Adesão ao Programa</p>
              <p className="text-2xl font-serif text-[#294D33] mt-1 font-normal">94,2%</p>
              <p className="text-[10px] text-[#294D33] mt-1 flex items-center gap-1 font-semibold">
                <TrendingUp size={11} /> +12% vs. último trimestre
              </p>
            </div>

            <div className="bg-[#FCF7F9] p-5 rounded-2xl border border-[#E8A9BB]/50">
              <p className="text-[11px] font-semibold text-[#516B55] uppercase tracking-wider">Índice de Sobrecarga</p>
              <p className="text-2xl font-serif text-[#294D33] mt-1 font-normal">Sob Controle</p>
              <p className="text-[10px] text-[#516B55] mt-1">78% relatam alívio semanal</p>
            </div>

            <div className="bg-[#FCF7F9] p-5 rounded-2xl border border-[#E8A9BB]/50">
              <p className="text-[11px] font-semibold text-[#516B55] uppercase tracking-wider">Retorno ao Trabalho</p>
              <p className="text-2xl font-serif text-[#294D33] mt-1 font-normal">86,5%</p>
              <p className="text-[10px] text-[#294D33] mt-1">Sem interrupção de carreira</p>
            </div>

            <div className="bg-[#FCF7F9] p-5 rounded-2xl border border-[#E8A9BB]/50">
              <p className="text-[11px] font-semibold text-[#516B55] uppercase tracking-wider">Privacidade</p>
              <p className="text-2xl font-serif text-[#294D33] mt-1 font-normal">LGPD Blindada</p>
              <p className="text-[10px] text-[#516B55] mt-1">Nenhum dado pessoal exposto</p>
            </div>
          </div>

        </div>

        {/* ========================================================
            PLANOS CORPORATIVOS ESTRUTURADOS
        ======================================================== */}
        <div className="sr text-left mb-6">
          <h3 className="font-serif text-2xl font-normal text-[#294D33]">
            Planos Corporativos Estruturados
          </h3>
          <p className="text-xs text-[#516B55] font-sans">
            Implementação ágil em menos de 48 horas com material de comunicação interna pronto para o RH.
          </p>
        </div>

        <div className="sr-group grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div 
              key={p.name}
              className={`rounded-[2.5rem] p-8 flex flex-col justify-between text-left transition border ${
                p.highlight
                  ? "bg-[#F4DDE5]/50 border-[#294D33] shadow-lg shadow-[#294D33]/10"
                  : "bg-white border-[#E8A9BB] shadow-sm hover:shadow-md"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white text-[#294D33] border border-[#E8A9BB]/50">
                    {p.badge}
                  </span>
                  {p.highlight && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#294D33]">
                      ★ Mais Procurado
                    </span>
                  )}
                </div>

                <h4 className="font-serif text-2xl font-normal text-[#294D33]">{p.name}</h4>
                <p className="text-xs text-[#516B55] font-sans mt-0.5">{p.desc}</p>

                <div className="my-5 pb-5 border-b border-[#E8A9BB]/30">
                  <span className="font-serif text-3xl font-normal text-[#294D33]">{p.price}</span>
                  <span className="text-xs text-[#516B55] ml-1">{p.period}</span>
                </div>

                <ul className="space-y-2.5 text-xs text-[#3A443E] font-sans mb-6">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-[#294D33] flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setShowDemoModal(true)}
                className={`w-full py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                  p.highlight
                    ? "bg-[#294D33] text-white hover:bg-[#1f3c27] shadow-sm"
                    : "bg-[#FCF7F9] text-[#294D33] border border-[#E8A9BB] hover:bg-[#F4DDE5]"
                }`}
              >
                Solicitar Proposta Comercial
              </button>
            </div>
          ))}
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
                <div className="w-14 h-14 mx-auto rounded-full bg-[#F4DDE5] text-[#294D33] flex items-center justify-center mb-4">
                  <CheckCircle size={30} />
                </div>
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
