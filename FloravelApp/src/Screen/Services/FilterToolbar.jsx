// src/Screen/Services/FilterToolbar.jsx
// Barra de busca e filtros simplificados para a Rede de Apoio (mobile-first).
import React, { useState, useId } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FCF7F9]';

export default function FilterToolbar({
  searchTerm,
  setSearchTerm,
  activeSpecialty,
  setActiveSpecialty,
  specialties = ['Todas', 'Psicologia Perinatal', 'Acolhimento Luto', 'Triagem'],
  priceFilter,
  setPriceFilter,
  approachFilter,
  setApproachFilter,
  modalityFilter,
  setModalityFilter,
  onResetFilters,
  activeFiltersCount = 0,
}) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const searchInputId = useId();
  const approachSelectId = useId();

  const priceOptions = [
    { id: 'all', label: 'Qualquer valor' },
    { id: 'social', label: 'Gratuito (Fundo Florável)' },
    { id: 'under50', label: 'Até R$ 50' },
    { id: 'under80', label: 'Até R$ 80' },
    { id: 'under120', label: 'R$ 80 a R$ 120' },
  ];

  const approachOptions = [
    'Todas as Abordagens',
    'Psicanálise',
    'TCC (Cognitivo-Comportamental)',
    'Gestalt-terapia',
    'Humanista',
    'Fenomenológica-Existencial',
  ];

  const modalityOptions = [
    { id: 'all', label: 'Online ou presencial' },
    { id: 'online', label: 'Apenas online' },
    { id: 'presential', label: 'Presencial (SP)' },
  ];

  const isFreeOnly = priceFilter === 'social';

  return (
    <div className="space-y-3.5 mb-7">
      {/* Linha 1: Busca + botão de filtro */}
      <div className="flex items-stretch gap-2.5">
        <div className="relative flex-1">
          <label htmlFor={searchInputId} className="sr-only">
            Buscar por nome ou especialidade
          </label>
          <Search
            size={18}
            strokeWidth={1.75}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4A5E4D] pointer-events-none"
            aria-hidden="true"
          />
          <input
            id={searchInputId}
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar psicóloga ou tema..."
            className={`w-full rounded-lg border border-[#D9CFCB] bg-white py-3 pl-10 pr-9 text-[15px] text-[#2B2829] placeholder-[#756F72] transition-colors focus:border-[#294D33] ${focusRing}`}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              aria-label="Limpar busca"
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-[#4A5E4D] hover:text-[#1F3A27] cursor-pointer ${focusRing}`}
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsFiltersOpen((v) => !v)}
          aria-expanded={isFiltersOpen}
          aria-controls="painel-filtros-rede"
          className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-[14px] font-medium shrink-0 cursor-pointer transition-colors ${focusRing} ${
            isFiltersOpen || activeFiltersCount > 0
              ? 'bg-[#294D33] border-[#294D33] text-white'
              : 'bg-white border-[#D9CFCB] text-[#2B2829] hover:border-[#294D33]'
          }`}
        >
          <SlidersHorizontal size={16} strokeWidth={1.75} aria-hidden="true" />
          <span>Filtrar</span>
          {activeFiltersCount > 0 && (
            <span className="tabular-nums text-[13px] opacity-90">({activeFiltersCount})</span>
          )}
        </button>
      </div>

      {/* Linha 2: Especialidades rápidas + atalho para atendimento gratuito */}
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtros rápidos">
        {specialties.map((spec) => {
          const isActive = activeSpecialty === spec;
          return (
            <button
              key={spec}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveSpecialty(spec)}
              className={`rounded-md border px-3.5 py-2 text-[14px] font-medium cursor-pointer transition-colors ${focusRing} ${
                isActive
                  ? 'bg-[#294D33] border-[#294D33] text-white'
                  : 'bg-transparent border-[#D9CFCB] text-[#2B2829] hover:border-[#294D33]'
              }`}
            >
              {spec}
            </button>
          );
        })}

        <button
          type="button"
          aria-pressed={isFreeOnly}
          onClick={() => setPriceFilter(isFreeOnly ? 'all' : 'social')}
          className={`rounded-md border px-3.5 py-2 text-[14px] font-medium cursor-pointer transition-colors ${focusRing} ${
            isFreeOnly
              ? 'bg-[#294D33] border-[#294D33] text-white'
              : 'bg-[#E3EDE5] border-[#C5D8C9] text-[#1F3A27] hover:border-[#294D33]'
          }`}
        >
          Gratuito · Fundo Florável
        </button>
      </div>

      {/* Painel de filtros complementar, enxuto e direto */}
      {isFiltersOpen && (
        <div
          id="painel-filtros-rede"
          role="region"
          aria-label="Filtros de valor, modalidade e abordagem"
          className="rounded-xl border border-[#E4DAD5] bg-[#F1E6E1]/75 p-5 space-y-5 animate-fadeIn"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Valor da sessão */}
            <div>
              <p className="text-[13px] font-medium text-[#1F3A27] mb-2">Valor da sessão</p>
              <div className="flex flex-wrap gap-1.5">
                {priceOptions.map((opt) => {
                  const selected = priceFilter === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setPriceFilter(opt.id)}
                      className={`rounded-md border px-3 py-2 text-[13px] font-medium cursor-pointer transition-colors ${focusRing} ${
                        selected
                          ? 'bg-[#294D33] border-[#294D33] text-white'
                          : 'bg-white border-[#D9CFCB] text-[#2B2829] hover:border-[#294D33]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modalidade */}
            <div>
              <p className="text-[13px] font-medium text-[#1F3A27] mb-2">Modalidade</p>
              <div className="flex flex-wrap gap-1.5">
                {modalityOptions.map((mod) => {
                  const selected = modalityFilter === mod.id;
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setModalityFilter(mod.id)}
                      className={`rounded-md border px-3 py-2 text-[13px] font-medium cursor-pointer transition-colors ${focusRing} ${
                        selected
                          ? 'bg-[#294D33] border-[#294D33] text-white'
                          : 'bg-white border-[#D9CFCB] text-[#2B2829] hover:border-[#294D33]'
                      }`}
                    >
                      {mod.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Abordagem */}
            <div>
              <label
                htmlFor={approachSelectId}
                className="block text-[13px] font-medium text-[#1F3A27] mb-2"
              >
                Abordagem terapêutica
              </label>
              <select
                id={approachSelectId}
                value={approachFilter}
                onChange={(e) => setApproachFilter(e.target.value)}
                className={`w-full rounded-md border border-[#D9CFCB] bg-white px-3 py-2.5 text-[14px] text-[#2B2829] cursor-pointer ${focusRing}`}
              >
                {approachOptions.map((appr) => (
                  <option key={appr} value={appr}>
                    {appr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E4DAD5]">
            <button
              type="button"
              onClick={onResetFilters}
              className={`text-[13px] font-medium text-[#294D33] underline decoration-[#294D33]/30 underline-offset-4 hover:decoration-[#294D33] rounded-sm cursor-pointer ${focusRing}`}
            >
              Redefinir filtros
            </button>
            <button
              type="button"
              onClick={() => setIsFiltersOpen(false)}
              className={`rounded-md bg-[#294D33] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#1F3A27] cursor-pointer ${focusRing}`}
            >
              Concluir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
