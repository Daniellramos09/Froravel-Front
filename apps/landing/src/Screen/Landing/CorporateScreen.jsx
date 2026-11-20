import React, { useState } from "react";
import { APP_LINKS } from "../../utils/appLinks";
import {
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  ShieldCheck, 
  BarChart3, 
  Users, 
  ArrowRight,
  ExternalLink,
  PieChart as PieChartIcon,
  Layers,
  Sparkles,
  Lock
} from "lucide-react";
import { BotanicalBranch } from "../../Components/Common/BotanicalDecor";

const dadosMercado = [
  {
    kpi: "6 a 9 meses",
    title: "Custo de Reposição de Talentos",
    description: "A perda de uma colaboradora após o retorno ao trabalho custa entre 6 a 9 meses do salário nominal da função em processos seletivos e rescisões.",
    source: "Fonte: SHRM",
    badge: "Impacto Financeiro Direto",
    borderColor: "border-[#C96E82]/30"
  },
  {
    kpi: "400% (4x)",
    title: "Retorno do Investimento (ROI)",
    description: "Cada US$ 1 aplicado em suporte emocional corporativo gera um retorno de US$ 4 em produtividade comprovada e redução direta de faltas.",
    source: "Fonte: OMS",
    badge: "Produtividade & Absenteísmo",
    borderColor: "border-[#73937E]/40"
  },
  {
    kpi: "2º no Mundo",
    title: "Índice Crítico de Burnout",
    description: "O Brasil é o 2º país do mundo em esgotamento profissional, cenário severamente agravado pela sobrecarga parental e privação crônica de sono.",
    source: "Fonte: ISMA-BR",
    badge: "Urgência de Clima",
    borderColor: "border-[#E8BA85]/40"
  },
  {
    kpi: "> 80%",
    title: "Eficácia Comprovada em Retenção",
    description: "Empresas com programas de suporte parental ativo alcançam taxas de retenção superiores a 80% no primeiro ano pós-parto.",
    source: "Maternidade Sustentável",
    badge: "Retenção de Lideranças",
    borderColor: "border-[#73937E]/40"
  }
];

const planosCorporativos = [
  {
    nome: "Plano PME",
    porte: "50 a 200 colaboradores",
    preco: "R$ 990",
    periodo: "/mês",
    descricao: "Ideal para empresas em consolidação que desejam apoiar suas primeiras gestantes e puérperas com estrutura profissional.",
    itens: [
      "Lote de até 10 licenças ativas",
      "Dashboard Básico de RH",
      "Triagem Edimburgo automatizada",
      "Suporte via e-mail corporativo"
    ],
    destaque: false,
    cta: "Contratar PME"
  },
  {
    nome: "Plano Mid-Market",
    porte: "200 a 1.000 colaboradores",
    preco: "R$ 3.500",
    periodo: "/mês",
    descricao: "Perfeito para médias e grandes operações com metas ativas de retenção feminina e indicadores de Diversidade & Inclusão.",
    itens: [
      "Lote de até 50 licenças ativas",
      "Dashboard com filtros departamentais",
      "1 Roda de Conversa exclusiva mensal para o time",
      "Relatórios de risco agregado trimestrais",
      "Gerente de Sucesso (CSM) dedicado"
    ],
    destaque: true,
    tag: "Mais Escolhido por RHs",
    cta: "Escolher Mid-Market"
  },
  {
    nome: "Plano Enterprise",
    porte: "Acima de 1.000 colaboradores",
    preco: "Sob Consulta",
    periodo: "",
    descricao: "Ecossistema completo com integração direta aos sistemas de folha/RH e arquitetura dedicada de saúde mental.",
    itens: [
      "Licenças customizadas sob demanda",
      "Integração SSO / API direta de RH",
      "Relatórios executivos e consultoria ESG",
      "Masterclasses exclusivas de liderança parental",
      "SLA prioritário e compliance avançado"
    ],
    destaque: false,
    cta: "Falar com Consultor"
  }
];

export default function CorporateScreen() {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoSent, setDemoSent] = useState(false);

  return (
    <section id="corporate" className="relative py-24 sm:py-32 bg-[#FAFAF9] overflow-hidden border-t border-[#F4C4D4]/30">
      
      {/* Detalhes botânicos sutis */}
      <div className="absolute top-8 right-6 pointer-events-none opacity-30">
        <BotanicalBranch variant="sage" size={150} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        
        {/* ========================================================
            CABEÇALHO DA SEÇÃO CORPORATE
        ======================================================== */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#27272A] leading-tight">
            Retenha talentos femininos.{" "}
            <span className="italic text-[#73937E] block sm:inline">
              Transforme o pós-licença maternidade em um ativo sustentável.
            </span>
          </h2>

          <p className="mt-5 text-lg text-[#52525B] leading-relaxed font-body">
            Inteligência de dados e apoio clínico para reduzir o turnover, mitigar o presenteísmo e cumprir metas reais de ESG.
          </p>
        </div>

        {/* ========================================================
            PAINEL DE EVIDÊNCIAS E DADOS DE MERCADO
        ======================================================== */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-display text-2xl font-medium text-[#27272A] flex items-center gap-2">
              <span>Evidências e Custos do Desamparo Parental</span>
            </h3>
            <span className="text-xs font-semibold text-[#73937E] uppercase tracking-wider hidden sm:inline">
              Dados Globais & Nacionais
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dadosMercado.map((item, idx) => (
              <div
                key={item.title}
                className={`rounded-3xl bg-white p-7 shadow-xs border ${item.borderColor} hover:shadow-xl transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#FAFAF9] text-[#52525B] inline-block mb-4">
                    {item.badge}
                  </span>
                  <div className="font-display text-3xl sm:text-4xl font-semibold text-[#2F3A36] mb-2">
                    {item.kpi}
                  </div>
                  <h4 className="text-base font-semibold text-[#27272A] mb-2 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#52525B] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-medium text-gray-400">
                  <span>{item.source}</span>
                  <BarChart3 size={14} className="text-[#73937E]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================
            O PRODUTO: DASHBOARD DE GESTÃO DE SAÚDE MENTAL + LGPD
        ======================================================== */}
        <div className="rounded-3xl bg-gradient-to-br from-white via-[#FAFAF9] to-[#EBF3EE]/40 p-8 sm:p-12 border border-[#73937E]/25 shadow-xl mb-24 relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Texto Explicativo e Garantia LGPD */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF3EE] text-[#73937E] text-xs font-bold uppercase tracking-wider">
                <BarChart3 size={14} />
                Inteligência Preditiva em Tempo Real
              </div>

              <h3 className="font-display text-2xl sm:text-4xl font-medium text-[#27272A] leading-tight">
                Dashboard Executivo para RHs Estratégicos
              </h3>

              <p className="text-sm sm:text-base text-[#52525B] leading-relaxed font-body">
                Visualize indicadores agregados essenciais sem violar a intimidade das suas colaboradoras. Decisões baseadas em dados clínicos populacionais para desenhar ações de clima de alto impacto.
              </p>

              {/* Métricas Consolidadas Apresentadas */}
              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF3EE] text-[#73937E] flex items-center justify-center font-bold text-sm">
                    84%
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#27272A] uppercase tracking-wide">Taxa de Engajamento</h5>
                    <p className="text-xs text-[#52525B]">Aderência diária ao acompanhamento e rodas de apoio</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FDF2F5] text-[#C96E82] flex items-center justify-center font-bold text-sm">
                    EPDS
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#27272A] uppercase tracking-wide">Risco Agregado (Edimburgo)</h5>
                    <p className="text-xs text-[#52525B]">Identificação precoce de sobrecarga antes de afastar a colaboradora</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF3EE] text-[#73937E] flex items-center justify-center font-bold text-sm">
                    MAP
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#27272A] uppercase tracking-wide">Mapeamento de Desafios</h5>
                    <p className="text-xs text-[#52525B]">Privação de sono, rede de apoio e retorno ao trabalho</p>
                  </div>
                </div>
              </div>

              {/* Box de Garantia LGPD Conforme Diretriz */}
              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#73937E]/30 flex items-start gap-3">
                <ShieldCheck size={24} className="text-[#73937E] flex-shrink-0 mt-0.5" />
                <div>
                  <h6 className="text-xs font-bold text-[#27272A] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    Garantia Absoluta de Privacidade (LGPD)
                  </h6>
                  <p className="text-xs text-[#52525B] leading-relaxed">
                    Nenhum dado pessoal, diário ou prontuário é acessível pelo empregador. O RH visualiza unicamente percentuais de grupo para ações de clima organizacional, assegurando sigilo ético inviolável.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <a
                  href={APP_LINKS.rh}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#2F3A36] hover:bg-[#1F3224] text-white text-sm font-semibold shadow-md transition-all duration-300 hover:scale-105"
                >
                  <span>Explorar Painel RH Interativo</span>
                  <ExternalLink size={16} />
                </a>
                <button
                  onClick={() => setShowDemoModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-gray-50 text-[#27272A] border border-gray-300 text-sm font-semibold transition"
                >
                  Agendar demonstração corporativa
                </button>
              </div>

            </div>

            {/* Mockup Visual Interativo do Dashboard */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 relative">
                
                {/* Header Mockup */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-[#C96E82]" />
                    <div className="w-3 h-3 rounded-full bg-[#E8BA85]" />
                    <div className="w-3 h-3 rounded-full bg-[#73937E]" />
                    <span className="text-xs font-semibold text-gray-400 ml-2">Painel de Gestão &bull; Florável RH</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#73937E] bg-[#EBF3EE] px-2.5 py-0.5 rounded-full">
                    Dados Agregados
                  </span>
                </div>

                {/* Cards Mini KPIs */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="p-3 rounded-xl bg-[#FAFAF9] border border-gray-100">
                    <p className="text-[10px] text-gray-500 font-medium">Licenças Ativas</p>
                    <p className="text-lg font-bold text-[#27272A]">48/50</p>
                    <span className="text-[9px] text-[#73937E] font-semibold">96% uso ativo</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAFAF9] border border-gray-100">
                    <p className="text-[10px] text-gray-500 font-medium">Risco Baixo</p>
                    <p className="text-lg font-bold text-[#73937E]">68%</p>
                    <span className="text-[9px] text-gray-500 font-semibold">Zona Segura</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAFAF9] border border-gray-100">
                    <p className="text-[10px] text-gray-500 font-medium">Retenção Pós-Licença</p>
                    <p className="text-lg font-bold text-[#2F3A36]">94%</p>
                    <span className="text-[9px] text-[#73937E] font-semibold">+18% vs mercado</span>
                  </div>
                </div>

                {/* Gráfico Visual Mock */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FAFAF9] to-white border border-gray-100 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-[#27272A]">Evolução do Índice de Bem-Estar</span>
                    <span className="text-[10px] text-gray-400">Últimos 6 meses</span>
                  </div>
                  <div className="h-28 flex items-end gap-2 pt-2">
                    {[45, 52, 60, 68, 75, 82, 88].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div 
                          className="w-full rounded-t-lg bg-[#73937E] transition-all duration-500 hover:opacity-80"
                          style={{ height: `${h}%` }}
                        />
                        <span className="text-[9px] text-gray-400">M{i+1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nota de rodapé da simulação */}
                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-100">
                  <span className="flex items-center gap-1 text-[#73937E]">
                    <Lock size={12} /> Criptografia de ponta a ponta
                  </span>
                  <span>Atualizado hoje</span>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* ========================================================
            TABELA RESUMIDA DE PLANOS CORPORATIVOS
        ======================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#73937E]">
            Modelos de Contratação B2B
          </span>
          <h3 className="font-display text-3xl sm:text-4xl font-medium text-[#27272A] mt-2">
            Planos adaptados ao tamanho da sua equipe
          </h3>
          <p className="text-sm text-[#52525B] mt-3">
            Comece em lotes controlados e amplie a cobertura conforme as demandas do seu calendário de gestações.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {planosCorporativos.map((plano, idx) => (
            <div
              key={plano.nome}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                plano.destaque
                  ? "bg-white border-2 border-[#73937E] shadow-2xl scale-[1.03] z-20"
                  : "bg-white/80 border border-gray-200 shadow-sm hover:border-[#73937E]/40"
              }`}
            >
              {plano.destaque && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#73937E] text-white text-[11px] font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-sm">
                  {plano.tag}
                </div>
              )}

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {plano.porte}
                </span>
                <h4 className="font-display text-2xl font-medium text-[#27272A] mt-1 mb-3">
                  {plano.nome}
                </h4>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="font-display text-4xl font-bold text-[#2F3A36]">
                    {plano.preco}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {plano.periodo}
                  </span>
                </div>
                <p className="text-xs text-[#52525B] leading-relaxed mb-6">
                  {plano.descricao}
                </p>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  {plano.itens.map((it, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-[#27272A]">
                      <CheckCircle size={15} className="text-[#73937E] flex-shrink-0 mt-0.5" />
                      <span>{it}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setShowDemoModal(true)}
                  className={`w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                    plano.destaque
                      ? "bg-[#2F3A36] text-white hover:bg-[#1F3224] shadow-md"
                      : "bg-[#FAFAF9] text-[#27272A] border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {plano.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ========================================================
          MODAL DE DEMONSTRAÇÃO CORPORATIVA
      ======================================================== */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#27272A]/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-[#FAFAF9] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#73937E]/40">
            <button
              onClick={() => { setShowDemoModal(false); setDemoSent(false); }}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700"
            >
              ✕
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
                  <span className="text-xs font-bold uppercase tracking-wider text-[#73937E]">
                    Florável Corporate
                  </span>
                  <h3 className="font-display text-2xl font-medium text-[#27272A] mt-1">
                    Agendar Demonstração Corporativa
                  </h3>
                  <p className="text-xs text-[#52525B] mt-1">
                    Converse com nossos especialistas em saúde mental perinatal e conheça o painel de métricas.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#27272A] mb-1">Seu Nome</label>
                  <input
                    required
                    type="text"
                    placeholder="Nome e Sobrenome"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-[#73937E] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#27272A] mb-1">Empresa</label>
                    <input
                      required
                      type="text"
                      placeholder="Nome da Empresa"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-[#73937E] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#27272A] mb-1">Nº Colaboradores</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-[#73937E] focus:outline-none">
                      <option>50 a 200</option>
                      <option>200 a 1.000</option>
                      <option>Acima de 1.000</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#27272A] mb-1">E-mail Corporativo</label>
                  <input
                    required
                    type="email"
                    placeholder="voce@suaempresa.com.br"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-[#73937E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#27272A] mb-1">Telefone / WhatsApp</label>
                  <input
                    required
                    type="tel"
                    placeholder="(11) 99999-9999"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-[#73937E] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#2F3A36] text-white text-sm font-semibold hover:bg-[#1F3224] shadow-md transition mt-2"
                >
                  Confirmar agendamento
                </button>
              </form>
            ) : (
              <div className="text-center py-6">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#EBF3EE] text-[#73937E] flex items-center justify-center mb-4">
                  <CheckCircle size={30} />
                </div>
                <h3 className="font-display text-2xl font-medium text-[#27272A] mb-2">
                  Demonstração solicitada!
                </h3>
                <p className="text-sm text-[#52525B] leading-relaxed mb-6">
                  Nosso consultor corporativo entrará em contato em breve para apresentar a simulação de ROI personalizada para a sua empresa.
                </p>
                <button
                  onClick={() => { setShowDemoModal(false); setDemoSent(false); }}
                  className="py-3 px-8 rounded-full bg-[#2F3A36] text-white text-sm font-semibold hover:bg-[#1F3224] transition"
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </section>
  );
}
