import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Bell,
  Download,
  Menu,
  ChevronLeft,
  ShieldCheck,
  Activity,
  Lock,
  Sparkles,
  CheckCircle2,
  FileSpreadsheet,
  FileCheck2,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
  LogIn,
  Layers,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import Sidebar from "./Sidebar";
import LicensesScreen from "./screens/LicensesScreen";
import HealthReportsScreen from "./screens/HealthReportsScreen";
import BillingScreen from "./screens/BillingScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { LANDING_URL } from "./utils/appLinks";
import { getInitials } from "./utils/rhSession";
import {
  obterEmpresaAtual,
  obterRelatorioKAnonimato,
  listarLicencas,
  RhApiError,
} from "./services/rhApi";

const COLORS = {
  sage: "#73937E",
  sageLight: "#8FA89B",
  rose: "#E8A9B8",
  roseDeep: "#C96E82",
  yellow: "#E8BA85",
  stone: "#A8A29E",
};

const CustomDonutTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-100 text-xs max-w-xs">
        <p className="font-semibold text-slate-800">{data.name}</p>
        <p className="text-lg font-bold mt-0.5" style={{ color: data.payload.color }}>
          {data.value} licença(s)
        </p>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-100 text-xs">
        <p className="font-semibold text-slate-800 mb-1">{label}</p>
        <p className="font-bold text-[#294D33]">
          {payload[0]?.value} colaboradora(s) ativa(s)
        </p>
      </div>
    );
  }
  return null;
};

function formatTodayPtBr() {
  try {
    const formatted = new Intl.DateTimeFormat("pt-BR", { dateStyle: "full" }).format(new Date());
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  } catch {
    return new Date().toLocaleDateString("pt-BR");
  }
}

export default function DashboardRh({ session = null, onLogout }) {
  const [activeMenu, setActiveMenu] = useState("inicio");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [company, setCompany] = useState(null);
  const [relatorio, setRelatorio] = useState(null);
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const showToast = useCallback((message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const fetchDashboardPayload = useCallback(async () => {
    const emp = await obterEmpresaAtual();
    const [rel, licList] = await Promise.all([
      obterRelatorioKAnonimato(emp.id),
      listarLicencas(emp.id),
    ]);
    return { emp, rel, licList: Array.isArray(licList) ? licList : [] };
  }, []);

  const applyFetchError = useCallback((err) => {
    if (err instanceof RhApiError) {
      setError({
        message: err.message,
        status: err.status,
        isAuthError: err.isAuthError,
        isForbidden: err.isForbidden,
        isNetworkError: err.isNetworkError,
      });
    } else {
      setError({
        message: "Não foi possível carregar os dados corporativos.",
        status: 0,
        isAuthError: false,
        isForbidden: false,
        isNetworkError: true,
      });
    }
  }, []);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { emp, rel, licList } = await fetchDashboardPayload();
      setCompany(emp);
      setRelatorio(rel);
      setLicenses(licList);
    } catch (err) {
      applyFetchError(err);
    } finally {
      setLoading(false);
    }
  }, [fetchDashboardPayload, applyFetchError]);

  const companyId = company?.id;

  const refreshLicensesAndReport = useCallback(async () => {
    if (!companyId) return;
    try {
      const [rel, licList] = await Promise.all([
        obterRelatorioKAnonimato(companyId),
        listarLicencas(companyId),
      ]);
      setRelatorio(rel);
      setLicenses(Array.isArray(licList) ? licList : []);
    } catch (err) {
      if (err instanceof RhApiError) {
        showToast(err.message);
      }
    }
  }, [companyId, showToast]);

  useEffect(() => {
    let active = true;
    fetchDashboardPayload()
      .then(({ emp, rel, licList }) => {
        if (!active) return;
        setCompany(emp);
        setRelatorio(rel);
        setLicenses(licList);
        setError(null);
      })
      .catch((err) => {
        if (active) applyFetchError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [fetchDashboardPayload, applyFetchError]);

  const handleExport = (format) => {
    setShowExportMenu(false);
    if (format === "CSV") {
      const rows = [
        ["Setor", "ColaboradorasAtivas", "AgrupadoPorKAnonimato"].join(";"),
        ...(relatorio?.setoresElegiveis || []).map((s) =>
          [s.nomeSetor, s.colaboradorasAtivas, s.agrupadoPorKAnonimato ? "SIM" : "NAO"].join(";")
        ),
        ...(relatorio?.indiceGeralAgrupadoKAnonimato?.colaboradorasAtivas > 0
          ? [
              [
                relatorio.indiceGeralAgrupadoKAnonimato.nomeSetor,
                relatorio.indiceGeralAgrupadoKAnonimato.colaboradorasAtivas,
                "SIM",
              ].join(";"),
            ]
          : []),
      ];
      const csvContent = rows.join("\n");
      if (typeof URL !== "undefined" && typeof URL.createObjectURL === "function") {
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `floravel-k-anonimato-${company?.id || "empresa"}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      showToast("Dados anonimizados exportados em CSV com sucesso!");
      return;
    }

    if (typeof window !== "undefined" && typeof window.print === "function") {
      window.print();
    }
    showToast("Impressão / PDF do relatório executivo iniciada.");
  };

  const activeCount = licenses.filter((l) => String(l.status).toUpperCase() === "ATIVADA").length;
  const pendingCount = licenses.filter((l) => String(l.status).toUpperCase() === "PENDENTE").length;
  const revokedCount = licenses.filter((l) => String(l.status).toUpperCase() === "REVOGADA").length;

  const totalEmitidas = relatorio?.totalLicencasEmitidas ?? licenses.length;
  const totalAtivadas = relatorio?.totalLicencasAtivadas ?? activeCount;
  const taxaAdesao =
    relatorio?.taxaAdesaoPercentual ??
    (totalEmitidas > 0 ? Math.round((totalAtivadas / totalEmitidas) * 1000) / 10 : 0);
  const parametroK = relatorio?.parametroKMinimo ?? 5;
  const setoresElegiveis = relatorio?.setoresElegiveis ?? [];
  const indiceAgrupado = relatorio?.indiceGeralAgrupadoKAnonimato ?? null;

  const licenseStatusChartData = [
    { name: "Ativadas", value: activeCount, color: COLORS.sage },
    { name: "Pendentes", value: pendingCount, color: COLORS.yellow },
    { name: "Revogadas", value: revokedCount, color: COLORS.stone },
  ].filter((item) => item.value > 0);

  const sectorChartData = [
    ...setoresElegiveis.map((s) => ({
      setor: s.nomeSetor,
      colaboradoras: s.colaboradorasAtivas,
    })),
    ...(indiceAgrupado && indiceAgrupado.colaboradorasAtivas > 0
      ? [
          {
            setor: `Agrupado (K<${parametroK})`,
            colaboradoras: indiceAgrupado.colaboradorasAtivas,
          },
        ]
      : []),
  ];

  const headerInitials = getInitials(session?.nome || company?.nome || "RH");
  const todayFormatted = formatTodayPtBr();

  return (
    <div className="min-h-screen bg-[#FCF7F9] font-sans text-stone-800 flex flex-col lg:flex-row antialiased">
      {/* Toast de Notificação */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-6 right-6 z-50 flex items-center gap-2.5 bg-[#1F3224] text-white px-5 py-3 rounded-xl shadow-xl text-sm animate-fade-in border border-white/10"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navegação Lateral */}
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        session={session}
        company={company}
        onLogout={onLogout}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col min-w-0 pb-16">
        {/* TOP BAR */}
        <header className="sticky top-0 bg-[#FCF7F9]/90 backdrop-blur-md z-30 px-6 lg:px-10 py-4 flex items-center justify-between border-b border-stone-200/60">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-stone-600 bg-white border border-stone-200 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33]"
              aria-label="Abrir menu lateral"
            >
              <Menu className="w-5 h-5" />
            </button>

            <a
              href={LANDING_URL}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4DDE5]/80 hover:bg-[#F4DDE5] text-xs font-semibold text-[#294D33] transition-colors shadow-2xs"
              title="Voltar à Landing Page principal"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Portal Principal</span>
            </a>

            {activeMenu !== "inicio" && (
              <button
                type="button"
                onClick={() => setActiveMenu("inicio")}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:text-[#294D33] hover:border-stone-300 transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] cursor-pointer"
              >
                <span>Voltar ao Overview</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <span className="hidden md:inline-block text-xs font-medium text-slate-500">
              {todayFormatted}
            </span>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={!company}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#73937E]" />
                <span className="hidden sm:inline">Exportar Relatório</span>
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-40 text-xs animate-fade-in">
                  <button
                    type="button"
                    onClick={() => handleExport("PDF")}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-[#FCE7F0]/40 rounded-xl transition-colors font-medium text-left cursor-pointer"
                  >
                    <FileCheck2 className="w-4 h-4 text-[#C96E82]" />
                    <span>Relatório Executivo (.PDF)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport("CSV")}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-[#EBF3EE] rounded-xl transition-colors font-medium text-left cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-[#73937E]" />
                    <span>Dados Agregados (.CSV)</span>
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              title="Avisos de Privacidade e Adesão"
              aria-label="Avisos de Privacidade e Adesão"
              onClick={() =>
                showToast(
                  pendingCount > 0
                    ? `Existem ${pendingCount} convite(s) corporativo(s) pendente(s) de ativação.`
                    : "Todos os convites corporativos estão atualizados."
                )
              }
              className="relative p-2 rounded-full bg-white border border-slate-200/80 text-slate-500 hover:text-slate-800 transition-colors shadow-2xs cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {pendingCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C96E82]" />
              )}
            </button>

            <div
              className="w-8 h-8 rounded-full bg-[#FCE7F0] border border-[#F4C4D4] text-[#C96E82] font-bold text-xs flex items-center justify-center"
              aria-label={`Perfil ${session?.nome || company?.nome || "RH"}`}
            >
              {headerInitials}
            </div>
          </div>
        </header>

        {/* CONTAINER */}
        <div className="px-6 lg:px-10 pt-6 space-y-6 max-w-7xl">
          {activeMenu === "inicio" && (
            <>
              {loading && !company && (
                <div
                  data-testid="dashboard-loading"
                  aria-busy="true"
                  className="space-y-6 animate-pulse"
                >
                  <div className="space-y-2">
                    <div className="h-8 w-64 bg-stone-200/80 rounded-xl" />
                    <div className="h-4 w-96 bg-stone-200/60 rounded-lg" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((idx) => (
                      <div
                        key={idx}
                        className="h-32 bg-white rounded-2xl border border-stone-100 p-5"
                      >
                        <div className="h-3 w-24 bg-stone-200 rounded mb-4" />
                        <div className="h-8 w-20 bg-stone-200 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  data-testid="dashboard-error"
                  className="bg-white border border-red-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FDE8E8] text-[#9B1C1C] flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#9B1C1C]">
                        Não foi possível carregar o painel corporativo
                      </h3>
                      <p className="text-xs text-stone-600 mt-1">{error.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {error.isAuthError && onLogout && (
                      <button
                        type="button"
                        onClick={onLogout}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#294D33] text-white text-xs font-bold hover:bg-[#1e3a27] transition cursor-pointer"
                      >
                        <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Fazer login novamente</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={loadDashboardData}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-200 bg-white text-stone-700 text-xs font-bold hover:bg-stone-50 transition cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Tentar novamente</span>
                    </button>
                  </div>
                </div>
              )}

              {!loading && !error && company && (
                <>
                  {/* BANNER PRIVACIDADE (LGPD) & BOAS-VINDAS */}
                  <div className="space-y-4">
                    <div>
                      <h2
                        className="text-2xl sm:text-3xl font-normal text-slate-900 tracking-tight flex items-center gap-2"
                        style={{ fontFamily: "'Fraunces', serif" }}
                      >
                        Olá, {company.nome}!
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">
                        Acompanhe em tempo real a adesão ao programa de saúde emocional materna com proteção K-Anonimato.
                      </p>
                    </div>

                    <div className="inline-flex flex-wrap items-center gap-2.5 px-4 py-2 rounded-2xl bg-white border border-slate-200/90 text-xs text-slate-600 shadow-2xs">
                      <span className="inline-flex items-center gap-1 font-bold text-[#294D33]">
                        <ShieldCheck className="w-4 h-4 text-[#73937E]" />
                        K-Anonimato (K ≥ {parametroK}) Ativo:
                      </span>
                      <span>
                        <strong>{totalAtivadas} colaboradora(s) ativa(s)</strong>.{" "}
                        {relatorio?.diretrizCompliance ||
                          "Nenhuma informação clínica individual é acessível ao RH."}
                      </span>
                    </div>
                  </div>

                  {/* SEÇÃO 1: 4 KPIS REAIS */}
                  <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4.5">
                    {/* Card 1: Licenças Ativadas */}
                    <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md">
                      <div
                        aria-hidden="true"
                        className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-[#FCE7F0]/80 to-transparent blur-xl pointer-events-none"
                      />
                      <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-slate-500">
                            Licenças Ativadas
                          </span>
                          <Users className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="flex items-baseline gap-1.5 my-2">
                          <span className="text-3xl font-bold text-slate-900">{totalAtivadas}</span>
                          <span className="text-sm font-medium text-slate-400">
                            / {totalEmitidas}
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-[#73937E] to-[#E8A9B8]"
                              style={{ width: `${Math.min(100, Math.max(0, taxaAdesao))}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-medium text-slate-400 mt-1.5 block">
                            {taxaAdesao}% das licenças emitidas
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Taxa de Adesão */}
                    <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md">
                      <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-slate-500">
                            Taxa de Adesão
                          </span>
                          <Activity className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="flex items-center gap-3 my-2">
                          <span className="text-3xl font-bold text-slate-900">{taxaAdesao}%</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2 leading-tight">
                          Convites ativados sobre o total emitido pela empresa.
                        </p>
                      </div>
                    </div>

                    {/* Card 3: Setores Elegíveis K >= 5 */}
                    <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md">
                      <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-slate-500">
                            Setores com K ≥ {parametroK}
                          </span>
                          <Layers className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="flex items-baseline gap-2 my-2">
                          <span className="text-3xl font-bold text-slate-900">
                            {setoresElegiveis.length}
                          </span>
                          <span className="text-xs font-medium text-slate-500">
                            elegíveis
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2 leading-tight">
                          {indiceAgrupado?.colaboradorasAtivas ?? 0} colaboradora(s) agrupada(s) no índice geral (&lt; K).
                        </p>
                      </div>
                    </div>

                    {/* Card 4: Status dos Convites */}
                    <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md">
                      <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-slate-500">
                            Status dos Convites
                          </span>
                          <Lock className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="flex items-baseline gap-2 my-2">
                          <span className="text-3xl font-bold text-slate-900">{pendingCount}</span>
                          <span className="text-xs font-medium text-slate-500">
                            pendentes
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2 leading-tight">
                          {revokedCount} revogada(s) · Sigilo LGPD ativo
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* SEÇÃO 2: GRÁFICOS COM DADOS REAIS */}
                  <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Gráfico A: Status das Licenças */}
                    <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-sm font-bold text-slate-900">
                              Status das Licenças
                            </h3>
                            <span className="text-xs text-slate-400">
                              Distribuição operacional da carteira corporativa
                            </span>
                          </div>
                        </div>

                        {licenseStatusChartData.length === 0 ? (
                          <div className="h-56 flex flex-col items-center justify-center text-center text-xs text-slate-400">
                            <p>Nenhuma licença emitida até o momento.</p>
                            <button
                              type="button"
                              onClick={() => setActiveMenu("licencas")}
                              className="mt-2 font-bold text-[#294D33] hover:underline cursor-pointer"
                            >
                              Convidar primeira colaboradora
                            </button>
                          </div>
                        ) : (
                          <div className="relative h-56 w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <RechartsTooltip content={<CustomDonutTooltip />} />
                                <Pie
                                  data={licenseStatusChartData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={62}
                                  outerRadius={88}
                                  paddingAngle={4}
                                  dataKey="value"
                                  isAnimationActive={false}
                                >
                                  {licenseStatusChartData.map((entry, index) => (
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

                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                              <span className="text-2xl font-bold text-slate-800">
                                {licenses.length}
                              </span>
                              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                                Licenças
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-100 space-y-2">
                        {[
                          { label: "Ativadas", count: activeCount, color: COLORS.sage },
                          { label: "Pendentes", count: pendingCount, color: COLORS.yellow },
                          { label: "Revogadas", count: revokedCount, color: COLORS.stone },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-slate-600">{item.label}</span>
                            </div>
                            <span className="font-bold text-slate-800">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Gráfico B: Distribuição por Setor (K-Anonimato) */}
                    <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                          <div>
                            <h3 className="text-sm font-bold text-slate-900">
                              Distribuição por Setor (K-Anonimato)
                            </h3>
                            <span className="text-xs text-slate-400">
                              Setores com K ≥ {parametroK} exibidos individualmente; menores agrupados
                            </span>
                          </div>
                        </div>

                        {sectorChartData.length === 0 ? (
                          <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                            Nenhuma licença ativada para exibir distribuição setorial.
                          </div>
                        ) : (
                          <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={sectorChartData}
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                              >
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  vertical={false}
                                  stroke="#F1F5F9"
                                />
                                <XAxis
                                  dataKey="setor"
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{ fill: "#64748B", fontSize: 12 }}
                                />
                                <YAxis
                                  allowDecimals={false}
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{ fill: "#64748B", fontSize: 12 }}
                                />
                                <RechartsTooltip content={<CustomBarTooltip />} />
                                <Bar
                                  dataKey="colaboradoras"
                                  fill="#73937E"
                                  radius={[6, 6, 0, 0]}
                                  isAnimationActive={false}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Parâmetro mínimo de anonimato: K = {parametroK}</span>
                        <button
                          type="button"
                          onClick={() => setActiveMenu("relatorios")}
                          className="font-semibold text-[#294D33] hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Abrir relatório K-Anonimato</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* SEÇÃO 3: MURALHA DE FOGO LGPD & TELEMETRIA CLÍNICA PROTEGIDA */}
                  <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#EBF3EE] text-[#294D33] flex items-center justify-center shrink-0">
                          <Lock className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            Muralha de Fogo LGPD & Telemetria Clínica Protegida
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            Para proteger o sigilo ético (CFP/LGPD), respostas de triagem clínica, diários emocionais e histórico de sessões nunca são disponibilizados ao RH. Este painel exibe exclusivamente métricas administrativas e contagens agregadas com K-Anonimato (K ≥ {parametroK}).
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Contrato B2B: CNPJ {company.cnpj} · Status {company.status}</span>
                        <button
                          type="button"
                          onClick={() => setActiveMenu("relatorios")}
                          className="text-[#C96E82] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Ver detalhes anonimizados</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="lg:col-span-5 bg-gradient-to-br from-[#FCE7F0]/70 via-white to-white rounded-2xl p-6 border border-[#F4C4D4]/60 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-lg bg-[#C96E82] text-white flex items-center justify-center shadow-xs">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#C96E82]">
                            Apoio Corporativo & Gestão de Convites
                          </h3>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Utilize a aba de licenças para emitir novos convites corporativos ou acompanhar a adesão dos setores com privacidade garantida.
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100/80 flex flex-col sm:flex-row gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveMenu("licencas")}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-[#294D33] hover:bg-[#1e3a27] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                        >
                          Gerenciar Licenças
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            showToast(
                              "Solicitação de workshop registrada para atendimento corporativo Florável."
                            )
                          }
                          className="flex-1 py-2.5 px-4 rounded-xl bg-[#1F3224] hover:bg-[#516B55] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                        >
                          Solicitar Workshop
                        </button>
                      </div>
                    </div>
                  </section>
                </>
              )}
            </>
          )}

          {activeMenu === "licencas" && (
            <LicensesScreen
              empresaId={company?.id}
              licenses={licenses}
              relatorio={relatorio}
              parentLoading={loading}
              parentError={error}
              onRetry={loadDashboardData}
              onLicensesUpdated={refreshLicensesAndReport}
              onTriggerToast={showToast}
            />
          )}

          {activeMenu === "relatorios" && (
            <HealthReportsScreen
              empresaId={company?.id}
              company={company}
              relatorio={relatorio}
              parentLoading={loading}
              parentError={error}
              onRetry={loadDashboardData}
              onTriggerToast={showToast}
            />
          )}

          {activeMenu === "faturamento" && (
            <BillingScreen
              company={company}
              relatorio={relatorio}
              onTriggerToast={showToast}
            />
          )}

          {activeMenu === "config" && (
            <SettingsScreen
              company={company}
              session={session}
              parentLoading={loading}
              parentError={error}
              onRetry={loadDashboardData}
              onCompanyUpdated={setCompany}
              onTriggerToast={showToast}
            />
          )}
        </div>
      </main>
    </div>
  );
}
