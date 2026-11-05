import React, { useState, useMemo } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  Bell,
  Download,
  Menu,
  X,
  ChevronLeft,
  ShieldCheck,
  Activity,
  Calendar,
  TrendingUp,
  Heart,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  HeartHandshake,
  FileSpreadsheet,
  FileCheck2,
  ExternalLink,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// Telas Internas do Dashboard B2B
import Sidebar from "./Sidebar";
import LicensesScreen from "./screens/LicensesScreen";
import HealthReportsScreen from "./screens/HealthReportsScreen";
import BillingScreen from "./screens/BillingScreen";
import SettingsScreen from "./screens/SettingsScreen";

// ==========================================
// PALETA DE CORES CORPORATIVA FLORÁVEL
// ==========================================
const COLORS = {
  sage: "#73937E",       // Verde Sálvia primário
  sageLight: "#8FA89B",  // Verde Sálvia suave
  sageBg: "#EBF3EE",     // Fundo sálvia sutil
  rose: "#E8A9B8",       // Rosa suave acento
  roseLight: "#FCE7F0",  // Rosa fundo suave
  roseDeep: "#C96E82",   // Rosa escuro / Alerta clínico
  yellow: "#E8BA85",     // Amarelo moderado
  yellowBg: "#FDF4E7",   // Fundo amarelo suave
  textDark: "#1F2937",   // Slate 800
  textMuted: "#6B7280",  // Slate 500
};

// ==========================================
// DADOS MOCADOS - RECHARTS & KPIS
// ==========================================
const emotionalRiskData = [
  { name: "Risco Baixo / Saudável", value: 60, color: COLORS.sageLight },
  { name: "Risco Moderado", value: 25, color: COLORS.yellow },
  { name: "Alerta Clínico", value: 15, color: COLORS.roseDeep },
];

const wellBeingTimelineData = [
  { month: "Jan", humor: 62, energia: 48 },
  { month: "Fev", humor: 69, energia: 54 },
  { month: "Mar", humor: 64, energia: 56 },
  { month: "Abr", humor: 78, energia: 68 },
  { month: "Mai", humor: 73, energia: 67 },
  { month: "Jun", humor: 84, energia: 74 },
];

const challengesData = [
  { label: "Conciliação Trabalho-Família", percentage: 85 },
  { label: "Privação de Sono", percentage: 70 },
  { label: "Sentimento de Culpa", percentage: 55 },
  { label: "Dificuldade com Amamentação", percentage: 40 },
  { label: "Readequação de Funções", percentage: 30 },
];

// ==========================================
// TOOLTIP CUSTOMIZADO - GRÁFICO DE BEM-ESTAR
// ==========================================
const CustomAreaTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-slate-100 text-xs">
        <p className="font-semibold text-slate-800 mb-1.5">{label}</p>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E8A9B8]" />
          <span className="text-slate-600">Humor (Diário):</span>
          <span className="font-bold text-slate-800">{payload[0]?.value} pts</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#73937E]" />
          <span className="text-slate-600">Nível de Energia:</span>
          <span className="font-bold text-slate-800">{payload[1]?.value} pts</span>
        </div>
      </div>
    );
  }
  return null;
};

// ==========================================
// TOOLTIP CUSTOMIZADO - DONUT DE RISCO
// ==========================================
const CustomDonutTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-100 text-xs max-w-xs">
        <p className="font-semibold text-slate-800">{data.name}</p>
        <p className="text-lg font-bold mt-0.5" style={{ color: data.payload.color }}>
          {data.value}% da equipe
        </p>
        <p className="text-[11px] text-slate-500 mt-1 leading-tight">
          Medição agregada calculada via Escala de Depressão Pós-Parto de Edimburgo (EPDS).
        </p>
      </div>
    );
  }
  return null;
};

// ==========================================
// COMPONENTE PRINCIPAL DO DASHBOARD
// ==========================================
export default function DashboardRh() {
  const [activeMenu, setActiveMenu] = useState("inicio");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Exibe feedback temporário ao exportar
  const handleExport = (format) => {
    setShowExportMenu(false);
    setToastMessage(`Relatório gerado em formato ${format} com sucesso!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#FCF7F9] font-sans text-stone-800 flex flex-col lg:flex-row antialiased">
      {/* ========================================================= */}
      {/* TOAST DE NOTIFICAÇÃO (FEEDBACK DE AÇÃO)                   */}
      {/* ========================================================= */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 bg-[#1F3224] text-white px-5 py-3 rounded-xl shadow-xl text-sm animate-fade-in border border-white/10">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navegação Lateral (Sidebar) com Acessibilidade WCAG */}
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* ========================================================= */}
      {/* CONTEÚDO PRINCIPAL (HEADER + KPIS + GRÁFICOS + INSIGHTS)  */}
      {/* ========================================================= */}
      <main className="flex-1 flex flex-col min-w-0 pb-16">
        {/* TOP BAR / CABEÇALHO */}
        <header className="sticky top-0 bg-[#FCF7F9]/90 backdrop-blur-md z-30 px-6 lg:px-10 py-4 flex items-center justify-between border-b border-stone-200/60">
          <div className="flex items-center gap-3">
            {/* Botão Menu Hambúrguer (Mobile) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-stone-600 bg-white border border-stone-200 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33]"
              aria-label="Abrir menu lateral"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Botão Voltar para o Portal Principal (Landing Page) */}
            <a
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4DDE5]/80 hover:bg-[#F4DDE5] text-xs font-semibold text-[#294D33] transition-colors shadow-2xs"
              title="Voltar à Landing Page principal"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Portal Principal</span>
            </a>

            {/* Breadcrumb interno */}
            {activeMenu !== "inicio" && (
              <button
                onClick={() => setActiveMenu("inicio")}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:text-[#294D33] hover:border-stone-300 transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33]"
              >
                <span>Voltar ao Overview</span>
              </button>
            )}
          </div>

          {/* Lado Direito: Data, Notificações, Exportar e Avatar */}
          <div className="flex items-center gap-3 md:gap-4">
            <span className="hidden md:inline-block text-xs font-medium text-slate-500">
              Quinta-feira, 15 de outubro de 2026
            </span>

            {/* Botão de Exportar Relatório */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-[#73937E]" />
                <span className="hidden sm:inline">Exportar Relatório</span>
              </button>

              {/* Dropdown de Exportação */}
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-40 text-xs animate-fade-in">
                  <button
                    onClick={() => handleExport("PDF")}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-[#FCE7F0]/40 rounded-xl transition-colors font-medium text-left"
                  >
                    <FileCheck2 className="w-4 h-4 text-[#C96E82]" />
                    <span>Relatório Executivo (.PDF)</span>
                  </button>
                  <button
                    onClick={() => handleExport("CSV")}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-[#EBF3EE] rounded-xl transition-colors font-medium text-left"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-[#73937E]" />
                    <span>Dados Agregados (.CSV)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Notificações */}
            <button
              title="Notificações"
              className="relative p-2 rounded-full bg-white border border-slate-200/80 text-slate-500 hover:text-slate-800 transition-colors shadow-2xs"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C96E82]" />
            </button>

            {/* Avatar RH */}
            <div className="w-8 h-8 rounded-full bg-[#FCE7F0] border border-[#F4C4D4] text-[#C96E82] font-bold text-xs flex items-center justify-center">
              TC
            </div>
          </div>
        </header>

        {/* CONTAINER DO DASHBOARD */}
        <div className="px-6 lg:px-10 pt-6 space-y-6 max-w-7xl">
          {activeMenu === "inicio" && (
            <>
              {/* ========================================================= */}
              {/* BANNER PRIVACIDADE (LGPD) & BOAS-VINDAS                   */}
              {/* ========================================================= */}
          <div className="space-y-4">
            <div>
              <h2
                className="text-2xl sm:text-3xl font-normal text-slate-900 tracking-tight flex items-center gap-2"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Olá, TechCorp Brasil!
                <span className="text-[#C96E82] text-xl sm:text-2xl">🤍</span>
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Como você está se sentindo hoje? Submeta abaixo o painel de
                saúde emocional agregada das colaboradoras.
              </p>
            </div>

            {/* Banner LGPD */}
            <div className="inline-flex flex-wrap items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-slate-200/90 text-xs text-slate-600 shadow-2xs">
              <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-[#73937E]" />
                Modo de Anonimato Ativo:
              </span>
              <span>
                Os dados abaixo representam o agregado de{" "}
                <strong>42 colaboradoras ativas</strong>. Nenhuma informação
                individual pode ser identificada.
              </span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SEÇÃO 1: CARDS DE KPI (GRID DE 4 COLUNAS)                 */}
          {/* ========================================================= */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4.5">
            {/* Card 1: Licenças Ativas */}
            <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md">
              <div
                aria-hidden="true"
                className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-[#FCE7F0]/80 to-transparent blur-xl pointer-events-none"
              />
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500">
                    Licenças Ativas
                  </span>
                  <Users className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex items-baseline gap-1.5 my-2">
                  <span className="text-3xl font-bold text-slate-900">42</span>
                  <span className="text-sm font-medium text-slate-400">/ 50</span>
                </div>
                {/* Barra de Progresso */}
                <div className="mt-2">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-[#73937E] to-[#E8A9B8]"
                      style={{ width: "84%" }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 mt-1.5 block">
                    84% das licenças em uso
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Taxa de Engajamento */}
            <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500">
                    Taxa de Engajamento
                  </span>
                  <Activity className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex items-center gap-3 my-2">
                  <span className="text-3xl font-bold text-slate-900">78%</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    <TrendingUp className="w-3 h-3" />
                    +5% vs. mês anterior
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 leading-tight">
                  Colaboradoras ativas no diário ou terapia nos últimos 7 dias.
                </p>
              </div>
            </div>

            {/* Card 3: Índice de Risco (Escala de Edimburgo) */}
            <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">
                      Índice de Risco
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Escala de Edimburgo
                    </span>
                  </div>
                  <Heart className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex items-center gap-3 my-2">
                  <span className="text-3xl font-bold text-slate-900">11,2</span>
                  <span className="text-[11px] font-semibold text-[#B26A00] bg-[#FDF4E7] px-2.5 py-0.5 rounded-full border border-[#E8BA85]/40">
                    Atenção Moderada
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 leading-tight">
                  Média agregada da equipe (EPDS de 0 a 30 pontos).
                </p>
              </div>
            </div>

            {/* Card 4: Sessões Realizadas */}
            <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500">
                    Sessões Realizadas
                  </span>
                  <Calendar className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex items-baseline gap-2 my-2">
                  <span className="text-3xl font-bold text-slate-900">124</span>
                  <span className="text-xs font-medium text-slate-500">
                    sessões no mês
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 leading-tight">
                  Atendimentos psicológicos subsidiados pela empresa.
                </p>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* SEÇÃO 2: GRÁFICOS PRINCIPAIS (GRID DE 2 COLUNAS)          */}
          {/* ========================================================= */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Gráfico A: Termômetro Emocional (Donut Chart) */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      Termômetro Emocional da Equipe
                    </h3>
                    <span className="text-xs text-slate-400">
                      (Escala de Edimburgo)
                    </span>
                  </div>
                  <div
                    title="A Escala de Depressão Pós-Parto de Edimburgo (EPDS) é o padrão ouro clínico para triagem emocional materna."
                    className="cursor-help p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </div>
                </div>

                {/* Donut Chart Recharts */}
                <div className="relative h-56 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <RechartsTooltip content={<CustomDonutTooltip />} />
                      <Pie
                        data={emotionalRiskData}
                        cx="50%"
                        cy="50%"
                        innerRadius={62}
                        outerRadius={88}
                        paddingAngle={4}
                        dataKey="value"
                        isAnimationActive={true}
                        animationDuration={1000}
                      >
                        {emotionalRiskData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Centro do Donut */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-slate-800">42</span>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                      Mães
                    </span>
                  </div>
                </div>
              </div>

              {/* Legenda Customizada com Proporções */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                {emotionalRiskData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-slate-600">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-800">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gráfico B: Evolução do Bem-Estar (Linha / Área Suave) */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Evolução do Bem-Estar
                    </h3>
                    <span className="text-xs text-slate-400">
                      (Últimos 6 meses)
                    </span>
                  </div>

                  {/* Legenda das Linhas */}
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E8A9B8]" />
                      <span className="text-slate-600">Humor</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#73937E]" />
                      <span className="text-slate-600">Nível de Energia</span>
                    </div>
                  </div>
                </div>

                {/* Gráfico Area Recharts */}
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={wellBeingTimelineData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorHumor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#E8A9B8" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#E8A9B8" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="colorEnergia" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#73937E" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#73937E" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#F1F5F9"
                      />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94A3B8", fontSize: 12 }}
                      />
                      <YAxis
                        domain={[0, 100]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94A3B8", fontSize: 12 }}
                      />
                      <RechartsTooltip content={<CustomAreaTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="humor"
                        stroke="#C96E82"
                        strokeWidth={2.4}
                        fillOpacity={1}
                        fill="url(#colorHumor)"
                        isAnimationActive={true}
                        animationDuration={1200}
                      />
                      <Area
                        type="monotone"
                        dataKey="energia"
                        stroke="#73937E"
                        strokeWidth={2.4}
                        fillOpacity={1}
                        fill="url(#colorEnergia)"
                        isAnimationActive={true}
                        animationDuration={1200}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Nota de rodapé da evolução */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Eixo: Pontuação média agregada (0 a 100 pts)</span>
                <span className="font-semibold text-emerald-700">
                  ↑ Tendência de alta (+18% no semestre)
                </span>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* SEÇÃO 3: INSIGHTS DE NEGÓCIO (GRID 2 COLUNAS: 2:1)        */}
          {/* ========================================================= */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Coluna Maior: Mapeamento de Desafios (Dores Frequentes) */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Mapeamento de Desafios
                    </h3>
                    <span className="text-xs text-slate-400">
                      (Dores mais relatadas nos diários anonimizados)
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                    Últimos 30 dias
                  </span>
                </div>

                {/* Lista de Barras de Desafio */}
                <div className="space-y-4 pt-1">
                  {challengesData.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="font-medium text-slate-700">
                          {item.label}
                        </span>
                        <span className="font-bold text-slate-800">
                          {item.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-[#FCE7F0]/60 h-3 rounded-full overflow-hidden p-0.5">
                        <div
                          className="h-full rounded-full transition-all duration-1000 bg-[#8FA89B]"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-slate-500">
                <span>Dados processados por Processamento de Linguagem Natural (PLN).</span>
                <button className="text-[#C96E82] font-semibold hover:underline inline-flex items-center gap-1">
                  Ver detalhes anonimizados <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Coluna Menor: Insights e Ações da IA */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#FCE7F0]/70 via-white to-white rounded-2xl p-6 border border-[#F4C4D4]/60 shadow-sm flex flex-col justify-between">
              <div>
                {/* Header IA */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-[#C96E82] text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#C96E82]">
                    Insights & Ações Sugeridas pela IA
                  </h3>
                </div>

                {/* Lista de Recomendações */}
                <div className="space-y-3.5">
                  {/* Card Insight 1 */}
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3.5 border border-slate-100 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B26A00] bg-[#FDF4E7] px-2 py-0.5 rounded-full inline-block mb-1.5">
                      Padrão de Exaustão
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 mb-1">
                      Pico de exaustão detectado às quintas-feiras
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong>Ação sugerida:</strong> Avaliar a implementação de
                      <em> &ldquo;Sextas-feiras sem reuniões&rdquo;</em> para as
                      mães recentes, reduzindo a sobrecarga mental.
                    </p>
                  </div>

                  {/* Card Insight 2 */}
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3.5 border border-slate-100 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1.5">
                      Oportunidade de Treinamento
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 mb-1">
                      Adesão às Masterclasses de Limites subiu 40%
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong>Ação sugerida:</strong> Abordar a gestão de expectativas
                      e fronteiras corporativas no próximo ciclo de avaliação de
                      desempenho.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botão de Solicitação RH */}
              <div className="pt-4 mt-4 border-t border-slate-100/80">
                <button
                  onClick={() =>
                    alert(
                      "Solicitação enviada para a equipe de especialistas corporativos da Florável!"
                    )
                  }
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1F3224] hover:bg-[#516B55] text-white text-xs font-bold shadow-md shadow-[#1F3224]/15 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Agendar Workshop com Especialista Florável</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>
            </div>
          </section>
            </>
          )}

          {/* ========================================================= */}
          {/* TELAS INTERNAS DO DASHBOARD B2B FLORÁVEL CORPORATE        */}
          {/* ========================================================= */}
          {activeMenu === "licencas" && (
            <LicensesScreen onTriggerToast={setToastMessage} />
          )}

          {activeMenu === "relatorios" && (
            <HealthReportsScreen onTriggerToast={setToastMessage} />
          )}

          {activeMenu === "faturamento" && (
            <BillingScreen onTriggerToast={setToastMessage} />
          )}

          {activeMenu === "config" && (
            <SettingsScreen onTriggerToast={setToastMessage} />
          )}
        </div>
      </main>
    </div>
  );
}
