import { useState, useEffect, useCallback } from "react";
import {
  FileCheck2,
  FileSpreadsheet,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  Lock,
  AlertTriangle,
  LogIn,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  obterEmpresaAtual,
  obterRelatorioKAnonimato,
  RhApiError,
} from "../services/rhApi";
import { formatCsvRow } from "../utils/csvExport";

const HighContrastSectorTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const item = payload[0]?.payload;
    return (
      <div
        className="bg-stone-900 text-white p-3 rounded-xl shadow-xl border border-stone-800 text-xs font-sans"
        role="tooltip"
      >
        <p className="font-bold text-stone-100 mb-1 border-b border-stone-800 pb-1">
          {label}
        </p>
        <p className="text-emerald-300 font-bold">
          {payload[0]?.value} colaboradora(s) ativa(s)
        </p>
        <p className="text-stone-300 text-[11px] mt-1">
          {item?.agrupado ? "Agrupado por K-Anonimato (< K)" : "Setor elegível (≥ K)"}
        </p>
      </div>
    );
  }
  return null;
};

export default function HealthReportsScreen({
  empresaId: propEmpresaId,
  company: propCompany,
  relatorio: propRelatorio,
  parentLoading = false,
  parentError = null,
  onRetry,
  onLogout,
  onTriggerToast,
}) {
  const isControlledByParent = propRelatorio !== undefined;

  const [localCompany, setLocalCompany] = useState(propCompany || null);
  const [localRelatorio, setLocalRelatorio] = useState(propRelatorio || null);
  const [standaloneLoading, setStandaloneLoading] = useState(!isControlledByParent);
  const [standaloneError, setStandaloneError] = useState(null);
  const [localToast, setLocalToast] = useState(null);

  const loadStandalonePayload = useCallback(async () => {
    let targetEmpresaId = propEmpresaId;
    let emp = propCompany || null;
    if (!targetEmpresaId) {
      emp = await obterEmpresaAtual();
      targetEmpresaId = emp.id;
    }
    const rel = await obterRelatorioKAnonimato(targetEmpresaId);
    return { emp, rel };
  }, [propEmpresaId, propCompany]);

  const fetchStandaloneReport = useCallback(async () => {
    setStandaloneLoading(true);
    setStandaloneError(null);
    try {
      const { emp, rel } = await loadStandalonePayload();
      setLocalCompany(emp);
      setLocalRelatorio(rel);
    } catch (err) {
      setStandaloneError(
        err instanceof RhApiError
          ? { message: err.message, isAuthError: err.isAuthError }
          : {
              message: "Não foi possível carregar o relatório de K-Anonimato.",
              isAuthError: false,
            }
      );
    } finally {
      setStandaloneLoading(false);
    }
  }, [loadStandalonePayload]);

  useEffect(() => {
    if (isControlledByParent) return undefined;
    let active = true;
    loadStandalonePayload()
      .then(({ emp, rel }) => {
        if (!active) return;
        setLocalCompany(emp);
        setLocalRelatorio(rel);
        setStandaloneError(null);
      })
      .catch((err) => {
        if (!active) return;
        setStandaloneError(
          err instanceof RhApiError
            ? { message: err.message, isAuthError: err.isAuthError }
            : {
                message: "Não foi possível carregar o relatório de K-Anonimato.",
                isAuthError: false,
              }
        );
      })
      .finally(() => {
        if (active) setStandaloneLoading(false);
      });
    return () => {
      active = false;
    };
  }, [isControlledByParent, loadStandalonePayload]);

  const relatorio = isControlledByParent ? propRelatorio : localRelatorio;
  const company = propCompany || localCompany;
  const loading = isControlledByParent ? parentLoading : standaloneLoading;
  const rawError = isControlledByParent ? parentError : standaloneError;
  const activeError =
    typeof rawError === "string" ? { message: rawError, isAuthError: false } : rawError;
  const errorMessage = activeError?.message || null;

  const triggerNotification = (message) => {
    if (onTriggerToast) {
      onTriggerToast(message);
    } else {
      setLocalToast(message);
      setTimeout(() => setLocalToast(null), 3500);
    }
  };

  const parametroK = relatorio?.parametroKMinimo ?? 5;
  const setoresElegiveis = Array.isArray(relatorio?.setoresElegiveis)
    ? relatorio.setoresElegiveis
    : [];
  const indiceAgrupado = relatorio?.indiceGeralAgrupadoKAnonimato ?? null;
  const totalEmitidas = relatorio?.totalLicencasEmitidas ?? 0;
  const totalAtivadas = relatorio?.totalLicencasAtivadas ?? 0;
  const taxaAdesao =
    relatorio?.taxaAdesaoPercentual ??
    (totalEmitidas > 0 ? Math.round((totalAtivadas / totalEmitidas) * 1000) / 10 : 0);

  const chartData = [
    ...setoresElegiveis.map((s) => ({
      setor: s.nomeSetor,
      colaboradoras: s.colaboradorasAtivas,
      agrupado: false,
    })),
    ...(indiceAgrupado && indiceAgrupado.colaboradorasAtivas > 0
      ? [
          {
            setor: `Índice Geral (K<${parametroK})`,
            colaboradoras: indiceAgrupado.colaboradorasAtivas,
            agrupado: true,
          },
        ]
      : []),
  ];

  const handleExportCsv = () => {
    const rows = [
      formatCsvRow(["Setor", "ColaboradorasAtivas", "AgrupadoPorKAnonimato"]),
      ...setoresElegiveis.map((s) =>
        formatCsvRow([
          s.nomeSetor,
          s.colaboradorasAtivas,
          s.agrupadoPorKAnonimato ? "SIM" : "NAO",
        ])
      ),
      ...(indiceAgrupado && indiceAgrupado.colaboradorasAtivas > 0
        ? [
            formatCsvRow([
              indiceAgrupado.nomeSetor,
              indiceAgrupado.colaboradorasAtivas,
              "SIM",
            ]),
          ]
        : []),
    ];
    const csvContent = rows.join("\n");
    if (typeof URL !== "undefined" && typeof URL.createObjectURL === "function") {
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `relatorio-k-anonimato-${company?.id || "empresa"}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    triggerNotification("Relatório anonimizado (.CSV) exportado com sucesso!");
  };

  const handleExportPdf = () => {
    if (typeof window !== "undefined" && typeof window.print === "function") {
      window.print();
    }
    triggerNotification("Impressão / PDF do relatório K-Anonimato iniciada.");
  };

  return (
    <div className="space-y-6 pb-12 font-sans antialiased text-stone-800 animate-fadeIn">
      {localToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-6 right-6 z-50 flex items-center gap-2.5 bg-[#294D33] text-white px-5 py-3 rounded-2xl shadow-xl text-xs sm:text-sm border border-white/10 animate-fade-in"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
          <span>{localToast}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1
          className="text-2xl sm:text-3xl font-bold text-[#294D33] tracking-tight"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Relatórios de Saúde & K-Anonimato
        </h1>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => (onRetry ? onRetry() : fetchStandaloneReport())}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-200 bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50 transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} aria-hidden="true" />
            <span>Atualizar</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={!relatorio || loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-stone-200 bg-white text-xs font-bold text-[#294D33] hover:bg-stone-50 transition cursor-pointer disabled:opacity-50"
          >
            <FileSpreadsheet size={14} aria-hidden="true" />
            <span>Exportar CSV</span>
          </button>

          <button
            type="button"
            onClick={handleExportPdf}
            disabled={!relatorio || loading}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#294D33] hover:bg-[#1e3c27] text-white text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2"
            aria-label="Exportar relatório em PDF"
          >
            <FileCheck2 size={14} aria-hidden="true" />
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>

      {loading && (
        <div
          data-testid="reports-loading"
          aria-busy="true"
          className="space-y-4 animate-pulse"
        >
          <div className="h-20 bg-white rounded-2xl border border-stone-100" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-white rounded-2xl border border-stone-100" />
            <div className="h-80 bg-white rounded-2xl border border-stone-100" />
          </div>
        </div>
      )}

      {!loading && errorMessage && (
        <div
          role="alert"
          data-testid="reports-error"
          className="bg-white border border-red-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#9B1C1C] shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs sm:text-sm text-[#9B1C1C] font-medium">{errorMessage}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {activeError?.isAuthError && onLogout && (
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
              onClick={() => (onRetry ? onRetry() : fetchStandaloneReport())}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-200 bg-white text-stone-700 text-xs font-bold hover:bg-stone-50 transition cursor-pointer shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Tentar novamente</span>
            </button>
          </div>
        </div>
      )}

      {!loading && !errorMessage && relatorio && (
        <>
          {/* BANNER K-ANONIMATO */}
          <div className="rounded-2xl bg-[#EBF3ED] border border-[#294D33]/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#294D33] shrink-0 mt-0.5" />
              <div className="text-xs text-[#1F3A27] leading-relaxed">
                <strong>Muralha de Fogo & K-Anonimato Ativo (K ≥ {parametroK}):</strong>{" "}
                {relatorio.diretrizCompliance ||
                  "Departamentos com menos de 5 colaboradoras ativas são agrupados no Índice Geral para impedir identificação por eliminação."}
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#294D33] text-[11px] font-bold shrink-0 border border-[#294D33]/15">
              <Lock size={12} /> Sigilo LGPD 100%
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* GRÁFICO 1: DISTRIBUIÇÃO SETORIAL K-ANONIMATO */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-100 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className="text-sm sm:text-base font-bold text-[#294D33]"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    Distribuição Setorial (K ≥ {parametroK})
                  </h3>
                  <span className="text-[10px] font-bold text-[#516B55] uppercase tracking-wider bg-stone-50 px-2 py-0.5 rounded-full">
                    Dados ao vivo
                  </span>
                </div>

                {chartData.length === 0 ? (
                  <div className="h-72 flex items-center justify-center text-xs text-stone-400 text-center">
                    Nenhuma colaboradora ativa registrada até o momento.
                  </div>
                ) : (
                  <div
                    className="h-72 w-full"
                    role="graphics-document"
                    aria-label="Gráfico de barras de colaboradoras ativas por setor com proteção K-Anonimato"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                        <XAxis
                          dataKey="setor"
                          tick={{ fill: "#516B55", fontSize: 11 }}
                          axisLine={{ stroke: "#E7E5E4" }}
                          tickLine={false}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fill: "#516B55", fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <RechartsTooltip content={<HighContrastSectorTooltip />} />
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
            </div>

            {/* PAINEL 2: TELEMETRIA CLÍNICA INDISPONÍVEL (LGPD) + RESUMO AGREGADO */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-100 shadow-2xs flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3
                    className="text-sm sm:text-base font-bold text-[#294D33]"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    Telemetria Clínica Longitudinal Indisponível
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#294D33] bg-[#F4DDE5] px-2.5 py-0.5 rounded-full">
                    <Lock size={11} />
                    Muralha de Fogo LGPD
                  </span>
                </div>

                <p className="text-xs text-[#516B55] leading-relaxed">
                  Scores de triagem clínica (Escala de Edimburgo), registros emocionais e evoluções individuais de esgotamento são protegidos por sigilo ético e não são expostos em APIs corporativas ao RH.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[#FCF7F9] border border-stone-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#516B55] block">
                    Licenças Emitidas
                  </span>
                  <span className="text-xl font-bold text-[#294D33]">
                    {totalEmitidas}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FCF7F9] border border-stone-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#516B55] block">
                    Licenças Ativadas
                  </span>
                  <span className="text-xl font-bold text-[#294D33]">
                    {totalAtivadas}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FCF7F9] border border-stone-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#516B55] block">
                    Taxa de Adesão
                  </span>
                  <span className="text-xl font-bold text-[#03543F]">
                    {taxaAdesao}%
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FCF7F9] border border-stone-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#516B55] block">
                    Agrupadas (&lt; K{parametroK})
                  </span>
                  <span className="text-xl font-bold text-[#516B55]">
                    {indiceAgrupado?.colaboradorasAtivas ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
