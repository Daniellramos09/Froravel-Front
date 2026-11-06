// src/Screen/Services/FilterToolbar.jsx
import React, { useState, useId } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Check,
  ChevronDown,
  DollarSign,
  Brain,
  Video,
  Sparkles,
  Heart,
} from "lucide-react";

export default function FilterToolbar({
  searchTerm,
  setSearchTerm,
  activeSpecialty,
  setActiveSpecialty,
  specialties = ["Todas", "Psicologia Perinatal", "Acolhimento Luto", "Triagem"],
  priceFilter,
  setPriceFilter,
  approachFilter,
  setApproachFilter,
  modalityFilter,
  setModalityFilter,
  onResetFilters,
  activeFiltersCount = 0,
}) {
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const searchInputId = useId();

  // Opções de preço alinhadas com foco em acolhimento social (faixa até R$ 80 e máx R$ 120)
  const priceOptions = [
    { id: "all", label: "Todos os Valores" },
    { id: "social", label: "Gratuito (Fundo Florável)" },
    { id: "under50", label: "Até R$ 50 (Muito Acessível)" },
    { id: "under80", label: "Até R$ 80 (Foco Social)" },
    { id: "under120", label: "R$ 80 a R$ 120" },
  ];

  // Opções de abordagem psicológica
  const approachOptions = [
    "Todas as Abordagens",
    "Psicanálise",
    "TCC (Cognitivo-Comportamental)",
    "Gestalt-terapia",
    "Humanista",
    "Fenomenológica-Existencial",
  ];

  // Opções de modalidade
  const modalityOptions = [
    { id: "all", label: "Todas" },
    { id: "online", label: "Apenas Online" },
    { id: "presential", label: "Presencial & Online" },
  ];

  return (
    <div className="space-y-4 mb-8">
      {/* ========================================================= */}
      {/* LINHA 1: BARRA DE PESQUISA LARGA + BOTÃO FILTROS AVANÇADOS */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Barra de Pesquisa Livre */}
        <div className="relative flex-1">
          <label htmlFor={searchInputId} className="sr-only">
            Buscar por nome, especialidade ou tema
          </label>
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id={searchInputId}
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, especialidade (ex: retorno ao trabalho, puerpério)..."
            className="w-full bg-white border border-stone-200 rounded-2xl py-3.5 pl-12 pr-10 text-sm sm:text-base text-stone-800 placeholder-stone-400 shadow-2xs focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2 transition"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33]"
              aria-label="Limpar pesquisa"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Botão de Filtros Avançados */}
        <button
          type="button"
          onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
          aria-expanded={isAdvancedFiltersOpen}
          aria-controls="advanced-filters-panel"
          className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border text-sm font-bold transition-all shadow-2xs shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2 ${
            isAdvancedFiltersOpen || activeFiltersCount > 0
              ? "bg-[#294D33] text-white border-[#294D33]"
              : "bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50"
          }`}
        >
          <SlidersHorizontal size={17} aria-hidden="true" />
          <span>Filtros Avançados</span>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#E8A9BB] text-[#294D33] font-extrabold text-[11px] flex items-center justify-center ml-0.5">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* ========================================================= */}
      {/* PAINEL EXPANSÍVEL DE FILTROS AVANÇADOS                    */}
      {/* ========================================================= */}
      {isAdvancedFiltersOpen && (
        <div
          id="advanced-filters-panel"
          className="bg-white rounded-3xl p-6 border border-stone-100 shadow-md space-y-6 animate-fadeIn"
          role="region"
          aria-label="Opções de filtros avançados"
        >
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-[#294D33]" aria-hidden="true" />
              <h4 className="text-base font-bold text-[#294D33]" style={{ fontFamily: "'Fraunces', serif" }}>
                Filtros Acessíveis
              </h4>
            </div>

            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="text-xs font-semibold text-[#516B55] hover:text-[#294D33] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={12} />
                  <span>Limpar todos</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsAdvancedFiltersOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                aria-label="Fechar filtros avançados"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* FILTRO 1: Preço da Sessão (Foco Social e Baixa Renda) */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign size={14} className="text-[#294D33]" aria-hidden="true" />
                <span>Faixa de Preço (Foco Social)</span>
              </label>

              <div className="flex flex-col gap-1.5">
                {priceOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPriceFilter(opt.id)}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition border cursor-pointer flex items-center justify-between ${
                      priceFilter === opt.id
                        ? "bg-[#FCF7F9] text-[#294D33] border-[#E8A9BB] shadow-2xs font-bold"
                        : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {priceFilter === opt.id && (
                      <Check size={14} className="text-[#294D33]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* FILTRO 2: Abordagem Psicológica */}
            <div className="space-y-2.5">
              <label 
                htmlFor="select-approach"
                className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5"
              >
                <Brain size={14} className="text-[#294D33]" aria-hidden="true" />
                <span>Abordagem Psicológica</span>
              </label>

              <div className="space-y-2">
                <select
                  id="select-approach"
                  value={approachFilter}
                  onChange={(e) => setApproachFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 bg-white font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] cursor-pointer"
                >
                  {approachOptions.map((appr) => (
                    <option key={appr} value={appr}>
                      {appr}
                    </option>
                  ))}
                </select>

                <p className="text-[11px] text-stone-500 leading-relaxed bg-[#FCF7F9] p-3 rounded-xl border border-[#F4C4D4]/30">
                  Todas as psicólogas são certificadas no ciclo gravídico-puerperal e credenciadas ativas no Conselho Federal de Psicologia (CFP).
                </p>
              </div>
            </div>

            {/* FILTRO 3: Modalidade (Apenas Online vs Presencial) */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Video size={14} className="text-[#294D33]" aria-hidden="true" />
                <span>Modalidade</span>
              </label>

              <div className="flex flex-col gap-1.5">
                {modalityOptions.map((mod) => (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => setModalityFilter(mod.id)}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition border cursor-pointer flex items-center justify-between ${
                      modalityFilter === mod.id
                        ? "bg-[#FCF7F9] text-[#294D33] border-[#E8A9BB] shadow-2xs font-bold"
                        : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <span>{mod.label}</span>
                    {modalityFilter === mod.id && (
                      <Check size={14} className="text-[#294D33]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* LINHA 2: PÍLULAS DE ESPECIALIDADE RÁPIDA (TAGS HORIZONTAIS) */}
      {/* ========================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-1 hidden sm:inline">
          Especialidade:
        </span>
        {specialties.map((spec) => {
          const isActive = activeSpecialty === spec;
          return (
            <button
              key={spec}
              type="button"
              onClick={() => setActiveSpecialty(spec)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2 ${
                isActive
                  ? "bg-[#E8A9BB] text-[#294D33] shadow-xs"
                  : "bg-white text-stone-600 border border-stone-200 hover:border-[#E8A9BB] hover:bg-[#FCF7F9]"
              }`}
            >
              {spec}
            </button>
          );
        })}
      </div>
    </div>
  );
}
