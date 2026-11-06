// src/Screen/DashboardRh/screens/HealthReportsScreen.jsx
import React, { useState } from "react";
import {
  Download,
  FileCheck2,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";

// Dados Fictícios de Risco x Adesão por Departamento (Barras Empilhadas)
const departmentRiskStackedData = [
  { dept: "Engenharia", baixoRisco: 65, riscoModerado: 25, alertaClinico: 10 },
  { dept: "Design", baixoRisco: 70, riscoModerado: 20, alertaClinico: 10 },
  { dept: "Operações", baixoRisco: 50, riscoModerado: 35, alertaClinico: 15 },
  { dept: "Marketing", baixoRisco: 60, riscoModerado: 30, alertaClinico: 10 },
  { dept: "Vendas", baixoRisco: 55, riscoModerado: 30, alertaClinico: 15 },
];

// Dados Fictícios de Evolução do Esgotamento x Recuperação (Linha Dupla)
const burnoutEvolutionData = [
  { mes: "Mai", esgotamento: 74, recuperacao: 42 },
  { mes: "Jun", esgotamento: 68, recuperacao: 51 },
  { mes: "Jul", esgotamento: 62, recuperacao: 60 },
  { mes: "Ago", esgotamento: 55, recuperacao: 68 },
  { mes: "Set", esgotamento: 49, recuperacao: 76 },
  { mes: "Out", esgotamento: 41, recuperacao: 84 },
];

// Tooltip de Alto Contraste
const HighContrastStackedTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div 
        className="bg-stone-900 text-white p-3 rounded-xl shadow-xl border border-stone-800 text-xs font-sans"
        role="tooltip"
      >
        <p className="font-bold text-stone-100 mb-1 border-b border-stone-800 pb-1">
          {label}
        </p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-3 text-emerald-300">
            <span>Baixo Risco:</span>
            <span className="font-bold">{payload[0]?.value}%</span>
          </div>
          <div className="flex items-center justify-between gap-3 text-amber-300">
            <span>Risco Moderado:</span>
            <span className="font-bold">{payload[1]?.value}%</span>
          </div>
          <div className="flex items-center justify-between gap-3 text-rose-300">
            <span>Alerta Clínico:</span>
            <span className="font-bold">{payload[2]?.value}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const HighContrastLineTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div 
        className="bg-stone-900 text-white p-3 rounded-xl shadow-xl border border-stone-800 text-xs font-sans"
        role="tooltip"
      >
        <p className="font-bold text-stone-100 mb-1 border-b border-stone-800 pb-1">
          {label}
        </p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4 text-rose-300">
            <span>Esgotamento:</span>
            <span className="font-bold">{payload[0]?.value} pts</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-emerald-300">
            <span>Recuperação:</span>
            <span className="font-bold">{payload[1]?.value} pts</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function HealthReportsScreen({ onTriggerToast }) {
  const [period, setPeriod] = useState("30d");
  const [isExporting, setIsExporting] = useState(false);
  const [localToast, setLocalToast] = useState(null);

  const triggerNotification = (message) => {
    if (onTriggerToast) {
      onTriggerToast(message);
    } else {
      setLocalToast(message);
      setTimeout(() => setLocalToast(null), 3500);
    }
  };

  const handleExportPdf = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      triggerNotification("Relatório Executivo (.PDF) gerado com sucesso!");
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12 font-sans antialiased text-stone-800 animate-fadeIn">
      {/* Toast Local */}
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

      {/* ========================================================= */}
      {/* 1. HEADER ENXUTO (TÍTULO + DROPDOWN PERÍODO + EXPORTAR)   */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 
          className="text-2xl sm:text-3xl font-bold text-[#294D33] tracking-tight"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Relatórios
        </h1>

        <div className="flex items-center gap-2.5">
          {/* Dropdown Compacto de Período */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3.5 py-2 rounded-full border border-stone-200 bg-white text-xs font-semibold text-stone-700 cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33]"
            aria-label="Selecionar período do relatório"
          >
            <option value="30d">Últimos 30 dias</option>
            <option value="3m">Últimos 3 meses</option>
            <option value="6m">Últimos 6 meses</option>
            <option value="1y">Último ano</option>
          </select>

          {/* Botão Exportar PDF */}
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#294D33] hover:bg-[#1e3c27] text-white text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2"
            aria-label="Exportar relatório em PDF"
          >
            {isExporting ? (
              <>
                <RefreshCw size={13} className="animate-spin text-white" aria-hidden="true" />
                <span>Exportando...</span>
              </>
            ) : (
              <>
                <FileCheck2 size={14} aria-hidden="true" />
                <span>Exportar PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. FOCO NOS GRÁFICOS: GRID DE 2 COLUNAS LADO A LADO       */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* GRÁFICO 1: BARRAS EMPILHADAS (RISCO X TRATAMENTO) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-100 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 
                className="text-sm sm:text-base font-bold text-[#294D33]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Risco vs. Adesão ao Tratamento
              </h3>
              <span className="text-[10px] font-bold text-[#516B55] uppercase tracking-wider bg-stone-50 px-2 py-0.5 rounded-full">
                Por Setor
              </span>
            </div>

            <div 
              className="h-72 w-full"
              role="graphics-document"
              aria-label="Gráfico de barras empilhadas demonstrando a distribuição de risco por setor"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentRiskStackedData}
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                  <XAxis 
                    dataKey="dept" 
                    tick={{ fill: "#516B55", fontSize: 11 }} 
                    axisLine={{ stroke: "#E7E5E4" }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: "#516B55", fontSize: 11 }} 
                    unit="%" 
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip content={<HighContrastStackedTooltip />} />
                  <Legend 
                    wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
                    formatter={(val) => {
                      if (val === "baixoRisco") return "Baixo Risco";
                      if (val === "riscoModerado") return "Moderado";
                      if (val === "alertaClinico") return "Alerta Clínico";
                      return val;
                    }}
                  />
                  <Bar dataKey="baixoRisco" stackId="a" fill="#73937E" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="riscoModerado" stackId="a" fill="#E8BA85" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="alertaClinico" stackId="a" fill="#C96E82" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* GRÁFICO 2: LINHA DUPLA (EVOLUÇÃO DO ESGOTAMENTO) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-100 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 
                className="text-sm sm:text-base font-bold text-[#294D33]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Evolução do Esgotamento
              </h3>
              <span className="text-[10px] font-bold text-[#516B55] uppercase tracking-wider bg-stone-50 px-2 py-0.5 rounded-full">
                Linha Temporal
              </span>
            </div>

            <div 
              className="h-72 w-full"
              role="graphics-document"
              aria-label="Gráfico de linha dupla demonstrando a evolução de esgotamento e recuperação"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={burnoutEvolutionData}
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                  <XAxis 
                    dataKey="mes" 
                    tick={{ fill: "#516B55", fontSize: 11 }} 
                    axisLine={{ stroke: "#E7E5E4" }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: "#516B55", fontSize: 11 }} 
                    domain={[0, 100]}
                    unit=" pts"
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip content={<HighContrastLineTooltip />} />
                  <Legend 
                    wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
                    formatter={(val) => {
                      if (val === "esgotamento") return "Índice de Esgotamento";
                      if (val === "recuperacao") return "Recuperação / Acolhimento";
                      return val;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="esgotamento" 
                    stroke="#C96E82" 
                    strokeWidth={2.5} 
                    dot={{ r: 3, fill: "#C96E82" }}
                    activeDot={{ r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="recuperacao" 
                    stroke="#294D33" 
                    strokeWidth={2.5} 
                    dot={{ r: 3, fill: "#294D33" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
