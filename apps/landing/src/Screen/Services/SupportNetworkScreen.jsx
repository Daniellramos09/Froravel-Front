// src/Screen/Services/SupportNetworkScreen.jsx
import React, { useState, useMemo } from "react";
import {
  HeartHandshake,
  Search,
  Video,
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Users,
  SearchX,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import FilterToolbar from "./FilterToolbar";
import PsychologistCard from "./PsychologistCard";

// =========================================================
// MOCK DATA: 6 PROFISSIONAIS CERTIFICADAS
// Preços acessíveis calibrados para mães de baixa renda (R$ 30 a R$ 120, foco <= R$ 80)
// =========================================================
export const MOCK_PSYCHOLOGISTS = [
  {
    id: 1,
    name: "Dra. Helena Souza",
    crp: "CRP 06/142980",
    spec: "Psicologia Perinatal",
    approach: "Psicanálise",
    desc: "Um espaço de escuta profunda para acolher você e as transformações da maternidade, respeitando o seu momento e os desafios do puerpério.",
    modality: "Online · 50 min",
    price: 0,
    priceFormatted: "Gratuito (Fundo Florável)",
    isSocial: true,
    verified: true,
    tags: ["Psicologia Perinatal", "Primeira Infância", "Puerpério Seguro"],
    photo: "/img/1.jpg",
  },
  {
    id: 2,
    name: "Dra. Camila Santos",
    crp: "CRP 06/158221",
    spec: "Acolhimento Luto",
    approach: "Fenomenológica-Existencial",
    desc: "Acolhimento sensível e humanizado para atravessar perdas gestacionais e neonatais, encontrando amparo seguro e sem julgamentos.",
    modality: "Online · 50 min",
    price: 40,
    priceFormatted: "R$ 40,00",
    isSocial: false,
    verified: true,
    tags: ["Acolhimento Luto", "Perda Gestacional", "Apoio Sensível"],
    photo: "/img/2.jpg",
  },
  {
    id: 3,
    name: "Dr. Rafael Lima",
    crp: "CRP 06/129330",
    spec: "Triagem",
    approach: "TCC (Cognitivo-Comportamental)",
    desc: "Escuta inicial, triagem clínica e direcionamento especializado para sobrecarga mental, sintomas ansiosos e ambivalência no puerpério.",
    modality: "Online · 40 min",
    price: 0,
    priceFormatted: "Gratuito (Fundo Florável)",
    isSocial: true,
    verified: true,
    tags: ["Triagem", "Triagem Rápida", "Sobrecarga Mental"],
    photo: "/img/3.jpg",
  },
  {
    id: 4,
    name: "Dra. Beatriz Nogueira",
    crp: "CRP 06/163412",
    spec: "Psicologia Perinatal",
    approach: "TCC (Cognitivo-Comportamental)",
    desc: "Foco prático em manejo de ansiedade pós-parto, rotinas de sono compartilhado e técnicas de acolhimento emocional para mães recentes.",
    modality: "Online · 50 min",
    price: 60,
    priceFormatted: "R$ 60,00",
    isSocial: false,
    verified: true,
    tags: ["Psicologia Perinatal", "Ansiedade Pós-Parto", "Sono do Bebê"],
    photo: "/img/4.jpg",
  },
  {
    id: 5,
    name: "Dra. Mariana Vasconcelos",
    crp: "CRP 06/171095",
    spec: "Acolhimento Luto",
    approach: "Gestalt-terapia",
    desc: "Apoio centrado no aqui-e-agora da maternidade atípica, culpa materna e fortalecimento de vínculos afetivos na gestação e pós-parto.",
    modality: "Presencial (SP) ou Online",
    price: 50,
    priceFormatted: "R$ 50,00",
    isSocial: false,
    verified: true,
    tags: ["Acolhimento Luto", "Maternidade Atípica", "Presencial & Online"],
    photo: "/img/5.jpg",
  },
  {
    id: 6,
    name: "Dra. Juliana Mendes Freitas",
    crp: "CRP 06/189204",
    spec: "Psicologia Perinatal",
    approach: "Humanista",
    desc: "Acolhimento empático para mães solos, desafios na amamentação e fortalecimento da autoestima no retorno ao trabalho pós-licença.",
    modality: "Online · 50 min",
    price: 75,
    priceFormatted: "R$ 75,00",
    isSocial: false,
    verified: true,
    tags: ["Psicologia Perinatal", "Retorno ao Trabalho", "Maternidade Solo"],
    photo: "/img/6.jpg",
  },
];

export default function SupportNetworkScreen({
  setActiveTab,
  adicionarAgendamento,
  profEmFoco: externalProfEmFoco,
  setProfEmFoco: externalSetProfEmFoco,
}) {
  // Controle de estado para permitir funcionamento isolado ou acoplado
  const [internalProfEmFoco, setInternalProfEmFoco] = useState(null);
  const profEmFoco = externalProfEmFoco !== undefined ? externalProfEmFoco : internalProfEmFoco;
  const setProfEmFoco = externalSetProfEmFoco || setInternalProfEmFoco;

  // Estados de Filtro
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSpecialty, setActiveSpecialty] = useState("Todas");
  const [priceFilter, setPriceFilter] = useState("all");
  const [approachFilter, setApproachFilter] = useState("Todas as Abordagens");
  const [modalityFilter, setModalityFilter] = useState("all");

  // Estados de Agendamento
  const [selectedDay, setSelectedDay] = useState(15);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Dias do mês de exemplo (31 dias)
  const diasOutubro = Array.from({ length: 31 }, (_, i) => i + 1);

  // Lista de especialidades únicas para as pílulas
  const specialties = [
    "Todas",
    "Psicologia Perinatal",
    "Acolhimento Luto",
    "Triagem",
  ];

  // Cálculo de Filtros Ativos para exibição na badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (priceFilter !== "all") count++;
    if (approachFilter !== "Todas as Abordagens") count++;
    if (modalityFilter !== "all") count++;
    return count;
  }, [priceFilter, approachFilter, modalityFilter]);

  // Limpeza de todos os filtros
  const handleResetFilters = () => {
    setSearchTerm("");
    setActiveSpecialty("Todas");
    setPriceFilter("all");
    setApproachFilter("Todas as Abordagens");
    setModalityFilter("all");
  };

  // Filtragem multi-critério
  const filteredProfessionals = useMemo(() => {
    return MOCK_PSYCHOLOGISTS.filter((prof) => {
      // 1. Busca livre por nome, especialidade, bio ou tags
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        prof.name.toLowerCase().includes(term) ||
        prof.spec.toLowerCase().includes(term) ||
        prof.desc.toLowerCase().includes(term) ||
        (prof.tags && prof.tags.some((t) => t.toLowerCase().includes(term)));

      // 2. Especialidade (Pílulas rápidas)
      const matchesSpecialty =
        activeSpecialty === "Todas" || prof.spec === activeSpecialty;

      // 3. Preço Social
      let matchesPrice = true;
      if (priceFilter === "social") {
        matchesPrice = prof.isSocial || prof.price === 0;
      } else if (priceFilter === "under50") {
        matchesPrice = prof.price > 0 && prof.price <= 50;
      } else if (priceFilter === "under80") {
        matchesPrice = prof.price > 0 && prof.price <= 80;
      } else if (priceFilter === "under120") {
        matchesPrice = prof.price >= 80 && prof.price <= 120;
      }

      // 4. Abordagem psicológica
      const matchesApproach =
        approachFilter === "Todas as Abordagens" ||
        prof.approach.toLowerCase().includes(approachFilter.toLowerCase().split(" ")[0]);

      // 5. Modalidade
      let matchesModality = true;
      if (modalityFilter === "online") {
        matchesModality = prof.modality.toLowerCase().includes("online");
      } else if (modalityFilter === "presential") {
        matchesModality = prof.modality.toLowerCase().includes("presencial");
      }

      return (
        matchesSearch &&
        matchesSpecialty &&
        matchesPrice &&
        matchesApproach &&
        matchesModality
      );
    });
  }, [searchTerm, activeSpecialty, priceFilter, approachFilter, modalityFilter]);

  // Ação de confirmar agendamento
  const handleConfirmarAgendamento = () => {
    if (!selectedTime || !profEmFoco) return;

    setIsBooking(true);

    setTimeout(() => {
      const novoEncontro = {
        id: Date.now(),
        profId: profEmFoco.id,
        profName: profEmFoco.name,
        spec: profEmFoco.spec,
        date: `${selectedDay}/10/2026`,
        time: selectedTime,
        type: "Consulta · Apoio Psicológico Social",
        status: "CONFIRMADO",
      };

      if (adicionarAgendamento) {
        adicionarAgendamento(novoEncontro);
      }

      setIsBooking(false);
      setIsConfirmed(true);

      setTimeout(() => {
        setProfEmFoco(null);
        setIsConfirmed(false);
        setSelectedTime(null);
        if (setActiveTab) {
          setActiveTab("booking");
        }
      }, 2500);
    }, 1200);
  };

  // =========================================================
  // SE ESTIVER EM FOCO DE AGENDAMENTO COM UM PROFISSIONAL:
  // =========================================================
  if (profEmFoco) {
    return (
      <div className="animate-fadeIn font-dmsans max-w-5xl mx-auto pb-16">
        <button
          type="button"
          onClick={() => setProfEmFoco(null)}
          className="inline-flex items-center gap-2 text-sm text-[#516B55] hover:text-[#294D33] font-bold transition mb-8 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] rounded-lg px-2 py-1"
        >
          <ArrowLeft size={16} />
          <span>Voltar para a rede de apoio</span>
        </button>

        <h1 
          className="text-3xl md:text-4xl font-bold text-[#294D33] mb-2"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Um encontro para cuidar de você
        </h1>
        <p className="text-[#516B55] text-base sm:text-lg mb-10">
          Escolha um dia e horário que se ajustem confortavelmente à sua rotina com o bebê.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Coluna Esquerda: Dados do Profissional */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4">
              {profEmFoco.photo ? (
                <img
                  src={profEmFoco.photo}
                  alt={profEmFoco.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#E8A9BB] shadow-sm"
                />
              ) : (
                <div 
                  className="w-20 h-20 rounded-full bg-[#FCE7F0] text-[#294D33] flex items-center justify-center text-2xl font-bold shadow-sm"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {profEmFoco.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <h2 
                  className="text-2xl font-bold text-[#294D33]"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {profEmFoco.name}
                </h2>
                <p className="text-xs text-stone-400 font-mono">{profEmFoco.crp || "CRP 06/142980"}</p>
                <p className="text-xs font-bold text-[#E8A9BB] mt-0.5">{profEmFoco.spec}</p>
              </div>
            </div>

            <p className="text-sm text-stone-600 leading-relaxed">
              {profEmFoco.desc}
            </p>

            {/* Tags da profissional */}
            {profEmFoco.tags && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {profEmFoco.tags.map((t) => (
                  <span key={t} className="px-2.5 py-0.5 rounded-full text-xs bg-[#FCF7F9] text-[#294D33] border border-[#E8A9BB]/40 font-medium">
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="p-4 rounded-2xl bg-[#FCF7F9] border border-[#F4C4D4]/40 space-y-2 text-xs text-[#516B55]">
              <div className="flex items-center gap-2 font-bold text-[#294D33]">
                <Video size={16} />
                <span>Atendimento confidencial via vídeo · 50 minutos</span>
              </div>
              <p>Ambiente seguro e criptografado de ponta a ponta.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#DEF7EC] border border-[#DEF7EC] text-xs text-[#03543F]">
              <div className="flex items-center justify-between font-bold">
                <span>Investimento da Sessão:</span>
                <span className="text-sm">{profEmFoco.priceFormatted || "Valor Social"}</span>
              </div>
              <p className="text-[11px] mt-1 text-emerald-800">
                {profEmFoco.price === 0 || profEmFoco.isSocial
                  ? "Atendimento 100% gratuito viabilizado pelo Fundo Solidário Florável."
                  : "Valor social acessível viabilizado para mães acolhidas pela rede Florável."}
              </p>
            </div>
          </div>

          {/* Coluna Direita: Seletor de Data e Horários */}
          <div className="lg:col-span-3 bg-white border border-stone-100 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
            {isConfirmed ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 animate-fadeIn">
                <div className="w-20 h-20 rounded-full bg-[#DEF7EC] text-[#03543F] flex items-center justify-center mb-6 animate-bounce">
                  <CheckCircle size={40} />
                </div>
                <h3 
                  className="text-2xl font-bold text-[#294D33] mb-2"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  Encontro agendado com sucesso!
                </h3>
                <p className="text-sm text-[#516B55]">
                  Enviamos as instruções e o link da chamada para o seu e-mail. Redirecionando para sua agenda...
                </p>
              </div>
            ) : (
              <div className={isBooking ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
                <div className="flex items-center justify-between mb-6">
                  <button type="button" className="p-1 text-stone-400 hover:text-stone-700" aria-label="Mês anterior">
                    <ChevronLeft size={20} />
                  </button>
                  <span className="font-bold text-stone-800 text-sm sm:text-base">Outubro de 2026</span>
                  <button type="button" className="p-1 text-stone-400 hover:text-stone-700" aria-label="Próximo mês">
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-bold text-[#516B55] uppercase mb-3">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
                    <div key={d}>{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-y-2.5 gap-x-1.5 text-center mb-8">
                  <div className="col-span-4" />
                  {diasOutubro.map((dia) => (
                    <button
                      key={dia}
                      type="button"
                      onClick={() => setSelectedDay(dia)}
                      className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center text-xs font-semibold transition cursor-pointer ${
                        selectedDay === dia
                          ? "bg-[#294D33] text-white shadow-md transform scale-105"
                          : "text-stone-700 hover:bg-[#FCE7F0]"
                      }`}
                    >
                      {dia}
                    </button>
                  ))}
                </div>

                <div className="border-t border-stone-100 pt-6">
                  <h4 className="font-bold text-[#294D33] text-xs uppercase tracking-wider mb-3">
                    Horários disponíveis para o dia {selectedDay} de Outubro:
                  </h4>
                  <div className="flex flex-wrap gap-2.5 mb-6">
                    {["09:00", "11:30", "14:30", "16:00", "18:30"].map((hora) => (
                      <button
                        key={hora}
                        type="button"
                        onClick={() => setSelectedTime(hora)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-bold transition cursor-pointer ${
                          selectedTime === hora
                            ? "border-[#294D33] bg-[#294D33] text-white shadow-sm"
                            : "border-stone-200 text-stone-700 hover:border-[#E8A9BB] hover:bg-[#FCF7F9]"
                        }`}
                      >
                        <Clock size={13} />
                        <span>{hora}</span>
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmarAgendamento}
                    disabled={!selectedTime || isBooking}
                    className={`w-full py-3.5 rounded-full text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                      !selectedTime
                        ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                        : isBooking
                        ? "bg-[#294D33]/70 text-white cursor-wait"
                        : "bg-[#294D33] hover:bg-[#1e3c27] text-white hover:scale-[1.01] active:scale-95"
                    }`}
                  >
                    {isBooking ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Confirmando agendamento seguro...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirmar Agendamento</span>
                        <CheckCircle size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // VIEW PRINCIPAL: BARRA DE FERRAMENTAS + GRADE DE CARDS (GRID)
  // =========================================================
  return (
    <div className="animate-fadeIn font-dmsans pb-16 antialiased text-stone-800">
      {/* ========================================================= */}
      {/* CABEÇALHO ACOLHEDOR DA REDE DE APOIO                      */}
      {/* ========================================================= */}
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCE7F0] text-[#294D33] text-xs font-bold uppercase tracking-wider mb-3 border border-[#E8A9BB]/40 shadow-2xs">
          <HeartHandshake size={15} className="text-[#294D33]" aria-hidden="true" />
          <span>Escuta que acolhe mães</span>
        </div>

        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#294D33] tracking-tight mb-2"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Sua rede de apoio
        </h1>

        <p className="text-stone-600 text-sm sm:text-base max-w-2xl leading-relaxed">
          Encontre profissionais certificadas em saúde mental materna com valores sociais acessíveis e apoio do Fundo Florável. No seu tempo, com acolhimento e sem julgamentos.
        </p>
      </header>

      {/* ========================================================= */}
      {/* BARRA DE BUSCA E FILTROS AVANÇADOS (COMPONENT ISOLADO)    */}
      {/* ========================================================= */}
      <FilterToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeSpecialty={activeSpecialty}
        setActiveSpecialty={setActiveSpecialty}
        specialties={specialties}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        approachFilter={approachFilter}
        setApproachFilter={setApproachFilter}
        modalityFilter={modalityFilter}
        setModalityFilter={setModalityFilter}
        onResetFilters={handleResetFilters}
        activeFiltersCount={activeFiltersCount}
      />

      {/* ========================================================= */}
      {/* BARRA DE RESULTADOS / CONTADOR                            */}
      {/* ========================================================= */}
      <div className="flex items-center justify-between mb-6 text-xs sm:text-sm text-[#516B55]">
        <div>
          Mostrando <strong className="text-[#294D33]">{filteredProfessionals.length}</strong>{" "}
          profissional(is) com valores acessíveis
        </div>

        {(searchTerm || activeSpecialty !== "Todas" || activeFiltersCount > 0) && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-[#294D33] font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Limpar filtros aplicados</span>
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* GRADE DE CARTÕES DOS PROFISSIONAIS (GRID RESPONSIVO)      */}
      {/* ========================================================= */}
      {filteredProfessionals.length === 0 ? (
        /* EMPTY STATE ACOLHEDOR */
        <div 
          className="py-16 px-6 text-center max-w-md mx-auto bg-white rounded-3xl border border-stone-100 shadow-sm space-y-4"
          role="region"
          aria-label="Nenhuma profissional encontrada"
        >
          <div className="w-16 h-16 rounded-3xl bg-[#FCE7F0] text-[#294D33] mx-auto flex items-center justify-center shadow-xs">
            <SearchX size={32} aria-hidden="true" />
          </div>
          <div>
            <h3 
              className="text-xl font-bold text-[#294D33]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Nenhuma profissional encontrada
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1.5 leading-relaxed">
              Tente ajustar seus termos de busca ou remover alguns filtros de preço e modalidade.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-6 py-2.5 rounded-full bg-[#294D33] hover:bg-[#1e3c27] text-white text-xs font-bold transition shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33]"
            >
              Limpar todos os filtros
            </button>
          </div>
        </div>
      ) : (
        /* GRID CARDS: 1 col no mobile, 2 no tablet, 3 no desktop */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredProfessionals.map((prof) => (
            <PsychologistCard
              key={prof.id}
              professional={prof}
              onSelectAgenda={(p) => setProfEmFoco(p)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
