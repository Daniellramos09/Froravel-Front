// src/Screen/Services/SupportNetworkScreen.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  Video,
  ArrowLeft,
  Clock,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  SearchX,
  GraduationCap,
  HeartHandshake,
  Star,
  MessageSquareHeart,
  ShieldCheck,
} from "lucide-react";

const isLocal = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
const API_BASE = import.meta.env.VITE_API_URL || (isLocal ? "http://localhost:8080" : "");

import FilterToolbar from "./FilterToolbar";
import PsychologistCard from "./PsychologistCard";
import FloravelMedalBadge from "../../Components/Badges/FloravelMedalBadge";

// =========================================================
// MOCK DATA: 6 PROFISSIONAIS CERTIFICADAS COM PATENTES FLORÁVEL
// =========================================================
export const MOCK_PSYCHOLOGISTS = [
  {
    id: 1,
    name: "Dra. Helena Souza",
    crp: "CRP 06/142980",
    spec: "Psicologia Perinatal",
    approach: "Psicanálise",
    education: "Especialista em Psicologia Perinatal e Parentalidade · Instituto Gerar / USP",
    sessionsCompleted: 48,
    rating: 4.9,
    positiveStarsCount: 58,
    patenteNivel: 4,
    patenteNome: "Selo Experiência Perinatal",
    patenteVariant: "guardia",
    patenteTier: "ouro_floravel",
    isNewcomer: false,
    desc: "Um espaço de escuta profunda para acolher você e as transformações da maternidade, respeitando o seu momento e os desafios do puerpério.",
    modality: "Online · 50 min",
    price: 0,
    priceFormatted: "Gratuito (Fundo Florável)",
    isSocial: true,
    verified: true,
    tags: ["Psicologia Perinatal", "Primeira Infância", "Puerpério Seguro"],
    photo: "/img/fotopsicologo/psicologa1.jpg",
  },
  {
    id: 2,
    name: "Dra. Camila Santos",
    crp: "CRP 06/158221",
    spec: "Acolhimento Luto",
    approach: "Fenomenológica-Existencial",
    education: "Mestre em Psicologia Clínica e Acolhimento Perinatal · PUC-SP",
    sessionsCompleted: 36,
    rating: 4.9,
    positiveStarsCount: 44,
    patenteNivel: 3,
    patenteNome: "Selo Escuta Humanizada",
    patenteVariant: "estrelas",
    patenteTier: "rosa_floravel",
    isNewcomer: false,
    desc: "Acolhimento sensível e humanizado para atravessar perdas gestacionais e neonatais, encontrando amparo seguro e sem julgamentos.",
    modality: "Online · 50 min",
    price: 40,
    priceFormatted: "R$ 40,00",
    isSocial: false,
    verified: true,
    tags: ["Acolhimento Luto", "Perda Gestacional", "Apoio Sensível"],
    photo: "/img/fotopsicologo/psicologa2.jpg",
  },
  {
    id: 3,
    name: "Dr. Rafael Lima",
    crp: "CRP 06/129330",
    spec: "Triagem",
    approach: "TCC (Cognitivo-Comportamental)",
    education: "Especialista em Saúde Mental Materna e Triagem Clínica · UNIFESP",
    sessionsCompleted: 42,
    rating: 4.8,
    positiveStarsCount: 51,
    patenteNivel: 4,
    patenteNome: "Selo Facilitador de Rodas",
    patenteVariant: "rodas",
    patenteTier: "esmeralda",
    isNewcomer: false,
    desc: "Escuta inicial, triagem clínica e direcionamento especializado para sobrecarga mental, sintomas ansiosos e ambivalência no puerpério.",
    modality: "Online · 40 min",
    price: 0,
    priceFormatted: "Gratuito (Fundo Florável)",
    isSocial: true,
    verified: true,
    tags: ["Triagem", "Triagem Rápida", "Sobrecarga Mental"],
    photo: "/img/fotopsicologo/psicologos7.jpg",
  },
  {
    id: 4,
    name: "Dra. Beatriz Nogueira",
    crp: "CRP 06/163412",
    spec: "Psicologia Perinatal",
    approach: "TCC (Cognitivo-Comportamental)",
    education: "Pós-graduada em Terapia Cognitivo-Comportamental no Pós-Parto · HC-FMUSP",
    sessionsCompleted: 14,
    rating: 5.0,
    positiveStarsCount: 14,
    patenteNivel: 2,
    patenteNome: "Selo Profissional Credenciada",
    patenteVariant: "nascente",
    patenteTier: "bronze_terra",
    isNewcomer: true,
    desc: "Foco prático em manejo de ansiedade pós-parto, rotinas de sono compartilhado e técnicas de acolhimento emocional para mães recentes.",
    modality: "Online · 50 min",
    price: 60,
    priceFormatted: "R$ 60,00",
    isSocial: false,
    verified: true,
    tags: ["Psicologia Perinatal", "Ansiedade Pós-Parto", "Sono do Bebê"],
    photo: "/img/fotopsicologo/psicologia4.jpg",
  },
  {
    id: 5,
    name: "Dra. Mariana Vasconcelos",
    crp: "CRP 06/171095",
    spec: "Acolhimento Luto",
    approach: "Gestalt-terapia",
    education: "Especialista em Gestalt-Terapia e Vínculos Maternos · Instituto Sedes Sapientiae",
    sessionsCompleted: 34,
    rating: 4.8,
    positiveStarsCount: 39,
    patenteNivel: 3,
    patenteNome: "Selo Acolhimento Solidário",
    patenteVariant: "anjo",
    patenteTier: "prata_salvia",
    isNewcomer: false,
    desc: "Apoio centrado no aqui-e-agora da maternidade atípica, culpa materna e fortalecimento de vínculos afetivos na gestação e pós-parto.",
    modality: "Presencial (SP) ou Online",
    price: 50,
    priceFormatted: "R$ 50,00",
    isSocial: false,
    verified: true,
    tags: ["Acolhimento Luto", "Maternidade Atípica", "Presencial & Online"],
    photo: "/img/fotopsicologo/psicologia1.jpg",
  },
  {
    id: 6,
    name: "Dra. Juliana Mendes Freitas",
    crp: "CRP 06/189204",
    spec: "Psicologia Perinatal",
    approach: "Humanista",
    education: "Especialista em Clínica Materno-Infantil e Psicologia Humanista · Mackenzie",
    sessionsCompleted: 8,
    rating: 5.0,
    positiveStarsCount: 8,
    patenteNivel: 2,
    patenteNome: "Selo Profissional Credenciada",
    patenteVariant: "nascente",
    patenteTier: "bronze_terra",
    isNewcomer: true,
    desc: "Acolhimento empático para mães solos, desafios na amamentação e fortalecimento da autoestima no retorno ao trabalho pós-licença.",
    modality: "Online · 50 min",
    price: 45,
    priceFormatted: "R$ 45,00",
    isSocial: false,
    verified: true,
    tags: ["Psicologia Perinatal", "Retorno ao Trabalho", "Maternidade Solo"],
    photo: "/img/fotopsicologo/download8.jpg",
  },
];

export default function SupportNetworkScreen({
  setActiveTab,
  adicionarAgendamento,
  profEmFoco: externalProfEmFoco,
  setProfEmFoco: externalSetProfEmFoco,
}) {
  const [internalProfEmFoco, setInternalProfEmFoco] = useState(null);
  const profEmFoco =
    externalProfEmFoco !== undefined ? externalProfEmFoco : internalProfEmFoco;
  const setProfEmFoco = externalSetProfEmFoco || setInternalProfEmFoco;

  // Estados de Filtro e Ordenação Justa (Mérito por Patente/Estrelas + Impulso Recém-Chegadas)
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSpecialty, setActiveSpecialty] = useState("Todas");
  const [priceFilter, setPriceFilter] = useState("all");
  const [approachFilter, setApproachFilter] = useState("Todas as Abordagens");
  const [modalityFilter, setModalityFilter] = useState("all");
  const [sortMode, setSortMode] = useState("equilibrio"); // 'equilibrio' | 'patentes' | 'novas' | 'social'

  // Estados de Agendamento
  const [selectedDay, setSelectedDay] = useState(15);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [backendPsychologists, setBackendPsychologists] = useState([]);

  useEffect(() => {
    if (!API_BASE) return;
    fetch(`${API_BASE}/api/psicologos`)
      .then((res) => (res.ok ? res.json() : []))
      .then((lista) => {
        if (Array.isArray(lista)) {
          setBackendPsychologists(lista);
        }
      })
      .catch(() => {});
  }, []);

  const allPsychologists = useMemo(() => {
    const merged = MOCK_PSYCHOLOGISTS.map((mock) => {
      const dbMatch = backendPsychologists.find(
        (b) =>
          (b.crp && mock.crp.includes(b.crp)) ||
          (b.nome && b.nome.toLowerCase() === mock.name.toLowerCase())
      );
      if (!dbMatch) return mock;
      return {
        ...mock,
        backendId: dbMatch.id,
        codigoPublico: dbMatch.codigoPublico || mock.codigoPublico,
        name: dbMatch.nome || mock.name,
        spec: dbMatch.especialidade || mock.spec,
        approach: dbMatch.abordagem || mock.approach,
        desc: dbMatch.biografia || mock.desc,
        fotoUrl: dbMatch.fotoUrl || mock.photo,
        horariosDisponiveis:
          Array.isArray(dbMatch.horariosDisponiveis) && dbMatch.horariosDisponiveis.length > 0
            ? dbMatch.horariosDisponiveis
            : null,
      };
    });

    const extras = backendPsychologists
      .filter(
        (b) =>
          !MOCK_PSYCHOLOGISTS.some(
            (m) =>
              (b.crp && m.crp.includes(b.crp)) ||
              (b.nome && b.nome.toLowerCase() === m.name.toLowerCase())
          )
      )
      .map((b) => ({
        id: b.id,
        backendId: b.id,
        codigoPublico: b.codigoPublico,
        name: b.nome,
        crp: b.crp?.startsWith("CRP") ? b.crp : `CRP ${b.crp || ""}`,
        spec: b.especialidade || "Psicologia Perinatal",
        approach: b.abordagem || "Escuta Acolhedora",
        education: Array.isArray(b.graduacoes) && b.graduacoes.length > 0 ? b.graduacoes[0] : "Psicologia Clínica",
        sessionsCompleted: b.maesAtendidasCount || 1,
        rating: 5.0,
        positiveStarsCount: b.estrelasRecebidasCount || 5,
        patenteNivel: 2,
        patenteNome: "Estrela Nascente",
        patenteVariant: "estrela",
        patenteTier: "ouro_floravel",
        isNewcomer: true,
        desc: b.biografia || "Psicóloga credenciada pela rede Florável.",
        modality: `Online · ${b.duracaoSessaoMinutos || 50} min`,
        price: Number(b.valorConsulta || 0),
        priceFormatted: Number(b.valorConsulta || 0) === 0 ? "Gratuito (Fundo Florável)" : `R$ ${Number(b.valorConsulta).toFixed(2).replace(".", ",")}`,
        isSocial: Number(b.valorConsulta || 0) === 0,
        verified: true,
        tags: [b.especialidade || "Psicologia Perinatal", "Nova na Rede"],
        photo: b.fotoUrl || "/img/fotopsicologo/psicologa1.jpg",
        horariosDisponiveis: Array.isArray(b.horariosDisponiveis) ? b.horariosDisponiveis : ["09:00", "14:30", "18:30"],
      }));

    return [...merged, ...extras];
  }, [backendPsychologists]);

  const diasOutubro = Array.from({ length: 31 }, (_, i) => i + 1);

  const specialties = [
    "Todas",
    "Psicologia Perinatal",
    "Acolhimento Luto",
    "Triagem",
  ];

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (priceFilter !== "all") count++;
    if (approachFilter !== "Todas as Abordagens") count++;
    if (modalityFilter !== "all") count++;
    return count;
  }, [priceFilter, approachFilter, modalityFilter]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setActiveSpecialty("Todas");
    setPriceFilter("all");
    setApproachFilter("Todas as Abordagens");
    setModalityFilter("all");
    setSortMode("equilibrio");
  };

  const filteredProfessionals = useMemo(() => {
    const filtrados = allPsychologists.filter((prof) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        prof.name.toLowerCase().includes(term) ||
        prof.spec.toLowerCase().includes(term) ||
        prof.desc.toLowerCase().includes(term) ||
        (prof.tags && prof.tags.some((t) => t.toLowerCase().includes(term)));

      const matchesSpecialty =
        activeSpecialty === "Todas" || prof.spec === activeSpecialty;

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

      const matchesApproach =
        approachFilter === "Todas as Abordagens" ||
        prof.approach
          .toLowerCase()
          .includes(approachFilter.toLowerCase().split(" ")[0]);

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

    const scoreMerito = (p) =>
      (p.patenteNivel || 1) * 100 + (p.positiveStarsCount || 0) * 2 + (p.rating || 4.8) * 10;

    if (sortMode === "patentes") {
      return [...filtrados].sort((a, b) => scoreMerito(b) - scoreMerito(a));
    }

    if (sortMode === "novas") {
      return [...filtrados].sort((a, b) => {
        if (a.isNewcomer !== b.isNewcomer) return a.isNewcomer ? -1 : 1;
        return (a.sessionsCompleted || 0) - (b.sessionsCompleted || 0);
      });
    }

    if (sortMode === "social") {
      return [...filtrados].sort((a, b) => (a.price || 0) - (b.price || 0));
    }

    // Modo padrão 'equilibrio': Destaca líderes de Patente + Estrelas, mas intercala recém-chegadas
    // nos primeiros lugares para que novas psicólogas consigam seus primeiros atendimentos.
    const veteranas = filtrados
      .filter((p) => !p.isNewcomer)
      .sort((a, b) => scoreMerito(b) - scoreMerito(a));
    const novas = filtrados
      .filter((p) => p.isNewcomer)
      .sort((a, b) => (b.rating || 5) - (a.rating || 5));

    const resultado = [];
    let vIdx = 0;
    let nIdx = 0;
    while (vIdx < veteranas.length || nIdx < novas.length) {
      if (vIdx < veteranas.length) resultado.push(veteranas[vIdx++]);
      if (nIdx < novas.length) resultado.push(novas[nIdx++]); // 2ª posição e posições pares recebem recém-chegada
      if (vIdx < veteranas.length) resultado.push(veteranas[vIdx++]);
    }
    return resultado;
  }, [
    searchTerm,
    activeSpecialty,
    priceFilter,
    approachFilter,
    modalityFilter,
    sortMode,
  ]);

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

      // Notifica o Portal da Psicóloga em tempo real (BroadcastChannel + LocalStorage)
      try {
        const notifPsi = {
          id: Date.now(),
          tipo: "agendamento",
          title: "Nova mãe agendada",
          desc: `Mariana Silva agendou escuta individual com ${profEmFoco.name} para ${selectedDay}/10 às ${selectedTime}.`,
          time: "Agora mesmo",
          lida: false,
          destino: "/agenda",
        };
        const existentes = JSON.parse(localStorage.getItem("floravel_psi_notificacoes") || "[]");
        localStorage.setItem("floravel_psi_notificacoes", JSON.stringify([notifPsi, ...existentes]));
        const bc = new BroadcastChannel("floravel_notificacoes_psi");
        bc.postMessage({ type: "NOVO_AGENDAMENTO", notif: notifPsi });
        bc.close();
      } catch (_) {}

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
  // PERFIL DA PSICÓLOGA E AGENDAMENTO (QUANDO SELECIONADA)
  // =========================================================
  if (profEmFoco) {
    const isSocialPrice =
      profEmFoco.price === 0 ||
      profEmFoco.isSocial ||
      String(profEmFoco.priceFormatted).toLowerCase().includes("gratuito");

    const sessionsCount = profEmFoco.sessionsCompleted || 16;

    // Carrega avaliações salvas pós-reunião + avaliações base da profissional
    const savedReviewsRaw = JSON.parse(localStorage.getItem("floravel_feedbacks_reunioes") || "[]");
    const userReviewsForProf = savedReviewsRaw
      .filter((fb) => !fb.terapeuta || fb.terapeuta.toLowerCase().includes(profEmFoco.name.split(" ")[1]?.toLowerCase() || ""))
      .map((fb) => ({
        id: fb.id,
        author: "Você (Mariana S.)",
        context: fb.reuniao || "Sessão / Roda Florável",
        rating: fb.rating || 5,
        text: fb.achouTexto && fb.achouTexto.trim() && fb.achouTexto.trim().toLowerCase() !== "ok" ? fb.achouTexto.trim() : "",
        expectativa: fb.atendeuExpectativa === "sim" ? "Superou as expectativas" : fb.atendeuExpectativa === "parcialmente" ? "Atendeu em parte" : "Avaliado",
        date: "Recente",
      }));

    const defaultReviews = [
      {
        id: `rev-1-${profEmFoco.id}`,
        author: "Mariana P.",
        context: `Atendimento com ${profEmFoco.name}`,
        rating: 5,
        text: "Saí da sessão com o coração leve pela primeira vez em semanas. A escuta acolhedora e sem julgamentos me ajudou demais no puerpério.",
        expectativa: "Superou as expectativas",
        date: "Há 3 dias",
      },
      {
        id: `rev-2-${profEmFoco.id}`,
        author: "Camila D.",
        context: `Roda & Escuta · ${profEmFoco.spec}`,
        rating: 5,
        text: "Condução extremamente humana e ética. Me senti segura para falar sobre meus medos na maternidade.",
        expectativa: "Superou as expectativas",
        date: "Há 1 semana",
      },
    ];

    const allProfReviews = [...userReviewsForProf, ...defaultReviews];

    return (
      <div className="animate-fadeIn font-dmsans max-w-[1040px] mx-auto pb-16 text-[#2B2829]">
        <button
          type="button"
          onClick={() => setProfEmFoco(null)}
          className="inline-flex items-center gap-2 text-[14px] text-[#516B55] hover:text-[#1F3A27] font-medium transition mb-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] rounded-lg py-1"
        >
          <ArrowLeft size={16} />
          <span>Voltar para a lista de profissionais</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* COLUNA ESQUERDA: PERFIL HUMANO DA PROFISSIONAL */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-[#F5EDE9]/80 rounded-2xl border border-[#E4DAD5] p-6 sm:p-7">
              {/* Foto + Nome + Especialidade */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-start gap-5 pb-6 border-b border-[#E4DAD5]">
                {profEmFoco.photo ? (
                  <img
                    src={profEmFoco.photo}
                    alt={profEmFoco.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-[#E4DAD5]"
                  />
                ) : (
                  <div
                    className="w-24 h-24 rounded-2xl bg-[#EBD9D3] text-[#1F3A27] flex items-center justify-center text-2xl font-medium"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    {profEmFoco.name.slice(0, 2).toUpperCase()}
                  </div>
                )}

                <div>
                  <span className="text-[12px] font-medium text-[#516B55]">
                    {profEmFoco.spec} · {profEmFoco.crp || "CRP 06/142980"}
                  </span>
                  <h1
                    className="text-[26px] sm:text-[28px] font-normal text-[#1F3A27] leading-[1.15] tracking-[-0.02em] mt-1"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    {profEmFoco.name}
                  </h1>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[12px] font-bold whitespace-nowrap">
                      <Star size={12} className="fill-amber-400 text-amber-500" />
                      {Number(profEmFoco.rating || 4.9).toFixed(1)} · {profEmFoco.positiveStarsCount || sessionsCount} estrelas
                    </span>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E4DAD5] text-[11.5px] font-bold text-[#1F3A27]">
                      <FloravelMedalBadge
                        variant={profEmFoco.patenteVariant || "guardia"}
                        tier={profEmFoco.patenteTier || "ouro_floravel"}
                        size={22}
                      />
                      <span>{profEmFoco.patenteNome || "Patente Florável"}</span>
                    </div>
                  </div>
                  <p className="text-[13px] text-[#6B6365] mt-2">
                    Abordagem: <strong className="font-medium text-[#2B2829]">{profEmFoco.approach}</strong>
                  </p>
                </div>
              </div>

              {/* Apresentação pessoal em linguagem humana */}
              <div className="py-5 border-b border-[#E4DAD5]">
                <h2 className="text-[12px] uppercase tracking-[0.06em] text-[#6B6365] font-medium mb-2">
                  Sobre o atendimento
                </h2>
                <p className="text-[14px] sm:text-[15px] text-[#2B2829] leading-[1.6]">
                  {profEmFoco.desc}
                </p>
              </div>

              {/* Formação e Experiência */}
              <div className="py-5 border-b border-[#E4DAD5] space-y-3">
                <h2 className="text-[12px] uppercase tracking-[0.06em] text-[#6B6365] font-medium">
                  Formação e foco clínico
                </h2>
                <div className="flex items-start gap-2.5 text-[13px] text-[#2B2829] leading-relaxed">
                  <GraduationCap
                    size={16}
                    className="text-[#294D33] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    {profEmFoco.education ||
                      "Especialista em Psicologia Perinatal e Saúde Mental Materna"}
                  </span>
                </div>

                {profEmFoco.tags && profEmFoco.tags.length > 0 && (
                  <p className="text-[13px] text-[#6B6365]">
                    Temas de acompanhamento: {profEmFoco.tags.join(" · ")}
                  </p>
                )}
              </div>

              {/* Modalidade e Valor Social */}
              <div className="pt-5 space-y-3">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-[#6B6365] flex items-center gap-1.5">
                    <Video size={15} className="text-[#294D33]" aria-hidden="true" />
                    Modalidade
                  </span>
                  <span className="font-medium text-[#1F3A27]">
                    {profEmFoco.modality || "Online · 50 min"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-[#6B6365]">Valor da sessão</span>
                  {isSocialPrice ? (
                    <span className="px-2.5 py-0.5 rounded-md bg-[#E3EDE5] text-[#1F3A27] font-medium text-[12px]">
                      Gratuito · Fundo Florável
                    </span>
                  ) : (
                    <span className="font-medium text-[#1F3A27] tabular-nums">
                      {profEmFoco.priceFormatted} · Valor social
                    </span>
                  )}
                </div>

                <p className="text-[12px] text-[#6B6365] leading-relaxed pt-1">
                  {isSocialPrice
                    ? "Sessão custeada integralmente pelo Fundo Solidário Florável para mães em acompanhamento."
                    : "Valor social reduzido para mães cadastradas na rede de acolhimento Florável."}
                </p>
              </div>
            </div>

            {/* Indicador de Atendimentos Realizados (inspirado na referência) */}
            <div className="bg-[#E3EDE5]/65 rounded-2xl border border-[#C5D9C9] px-6 py-5 flex items-center justify-between">
              <div>
                <span className="text-[12px] uppercase tracking-[0.06em] text-[#516B55] font-medium block">
                  Acolhimentos na rede
                </span>
                <p
                  className="text-[32px] font-normal text-[#1F3A27] leading-none mt-1.5 tabular-nums"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {sessionsCount}
                </p>
                <span className="text-[12px] text-[#516B55] mt-1 block">
                  sessões realizadas com mães da Florável
                </span>
              </div>

              <div
                className="w-12 h-12 rounded-full bg-[#294D33] text-[#FAF6F3] flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <CheckCircle size={22} />
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA: CALENDÁRIO E SELEÇÃO DE HORÁRIO */}
          <div className="lg:col-span-7 bg-[#FAF6F3] border border-[#E4DAD5] rounded-2xl p-6 sm:p-8">
            {isConfirmed ? (
              <div className="py-16 text-center space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-[#E3EDE5] text-[#1F3A27] flex items-center justify-center mx-auto">
                  <CheckCircle size={32} />
                </div>
                <h3
                  className="text-[24px] font-normal text-[#1F3A27]"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  Encontro agendado com sucesso
                </h3>
                <p className="text-[14px] text-[#6B6365] max-w-md mx-auto leading-relaxed">
                  Sua sessão com {profEmFoco.name} para o dia {selectedDay}/10 às{" "}
                  {selectedTime} foi confirmada. Redirecionando para seus agendamentos...
                </p>
              </div>
            ) : (
              <div
                className={
                  isBooking
                    ? "opacity-50 pointer-events-none transition-opacity"
                    : "transition-opacity"
                }
              >
                <div className="mb-6">
                  <h2
                    className="text-[22px] font-normal text-[#1F3A27] tracking-[-0.015em]"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    Escolha um dia e horário
                  </h2>
                  <p className="text-[13px] text-[#6B6365] mt-1">
                    Se precisar remarcar por conta da rotina com o bebê, basta avisar até 2h antes.
                  </p>
                </div>

                {/* Navegação do Mês */}
                <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#F5EDE9]/70 border border-[#E4DAD5] mb-5">
                  <button
                    type="button"
                    className="p-1 text-[#6B6365] hover:text-[#1F3A27] cursor-pointer"
                    aria-label="Mês anterior"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="font-medium text-[#1F3A27] text-[14px]">
                    Outubro de 2026
                  </span>
                  <button
                    type="button"
                    className="p-1 text-[#6B6365] hover:text-[#1F3A27] cursor-pointer"
                    aria-label="Próximo mês"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                {/* Cabeçalho dos dias da semana */}
                <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-medium text-[#6B6365] uppercase mb-2">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
                    <div key={d}>{d}</div>
                  ))}
                </div>

                {/* Grade de dias com áreas de toque confortáveis para mobile */}
                <div className="grid grid-cols-7 gap-1.5 text-center mb-7">
                  <div className="col-span-4" />
                  {diasOutubro.map((dia) => (
                    <button
                      key={dia}
                      type="button"
                      onClick={() => setSelectedDay(dia)}
                      className={`h-10 w-10 mx-auto rounded-lg flex items-center justify-center text-[13px] font-medium transition cursor-pointer tabular-nums ${
                        selectedDay === dia
                          ? "bg-[#294D33] text-[#FAF6F3]"
                          : "text-[#2B2829] hover:bg-[#F1E6E1]"
                      }`}
                    >
                      {dia}
                    </button>
                  ))}
                </div>

                {/* Seleção de Horários */}
                <div className="border-t border-[#E4DAD5] pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[13px] font-medium text-[#1F3A27]">
                      Horários disponíveis · {selectedDay} de outubro
                    </h3>
                    <span className="text-[12px] text-[#6B6365]">
                      Horário de Brasília
                    </span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 mb-7">
                    {(() => {
                      let slots =
                        Array.isArray(profEmFoco?.horariosDisponiveis) &&
                        profEmFoco.horariosDisponiveis.length > 0
                          ? profEmFoco.horariosDisponiveis
                          : ["09:00", "11:30", "14:30", "16:00", "18:30"];
                      if (profEmFoco?.id === 1) {
                        try {
                          const savedSlots = JSON.parse(localStorage.getItem("floravel_psi_horarios") || "[]");
                          if (Array.isArray(savedSlots) && savedSlots.length > 0) slots = savedSlots;
                        } catch (_) {}
                      }
                      return slots;
                    })().map(
                      (hora) => (
                        <button
                          key={hora}
                          type="button"
                          onClick={() => setSelectedTime(hora)}
                          className={`py-2.5 px-3 rounded-lg border text-[13px] font-medium transition cursor-pointer flex items-center justify-center gap-1.5 tabular-nums ${
                            selectedTime === hora
                              ? "border-[#294D33] bg-[#294D33] text-[#FAF6F3]"
                              : "border-[#E4DAD5] bg-[#F5EDE9]/50 text-[#2B2829] hover:border-[#294D33]/40"
                          }`}
                        >
                          <Clock size={13} aria-hidden="true" />
                          <span>{hora}</span>
                        </button>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmarAgendamento}
                    disabled={!selectedTime || isBooking}
                    className={`w-full py-3.5 px-6 rounded-lg text-[14px] font-medium transition flex items-center justify-center gap-2 cursor-pointer ${
                      !selectedTime
                        ? "bg-[#E4DAD5] text-[#6B6365] cursor-not-allowed"
                        : isBooking
                        ? "bg-[#294D33]/80 text-[#FAF6F3] cursor-wait"
                        : "bg-[#294D33] hover:bg-[#1F3A27] text-[#FAF6F3]"
                    }`}
                  >
                    {isBooking ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Confirmando seu horário...</span>
                      </>
                    ) : (
                      <span>
                        {selectedTime
                          ? `Confirmar agendamento · dia ${selectedDay} às ${selectedTime}`
                          : "Selecione um horário para agendar"}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* SEÇÃO DE FEEDBACKS E AVALIAÇÕES NO PERFIL DA PSICÓLOGA    */}
            {/* ========================================================= */}
            <div className="mt-8 pt-7 border-t border-[#E4DAD5]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#516B55] flex items-center gap-1.5">
                    <MessageSquareHeart size={14} className="text-[#294D33]" />
                    Relatos de Mães Acolhidas
                  </span>
                  <h3
                    className="text-[20px] font-normal text-[#1F3A27] mt-0.5"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    Avaliações sobre {profEmFoco.name}
                  </h3>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E4DAD5] self-start sm:self-auto">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#1F3A27]">4.9 / 5.0</span>
                  <span className="text-[11px] text-[#6B6365]">({allProfReviews.length} relatos)</span>
                </div>
              </div>

              <div className="space-y-3.5">
                {allProfReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E4DAD5] shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(rev.rating)].map((_, idx) => (
                          <Star key={idx} size={14} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#E3EDE5] text-[#1F3A27]">
                        {rev.expectativa}
                      </span>
                    </div>

                    {rev.text ? (
                      <p className="text-[13.5px] text-[#2B2829] leading-relaxed">
                        "{rev.text}"
                      </p>
                    ) : (
                      <p className="text-[12.5px] text-[#6B6365] italic">
                        Avaliação registrada com {rev.rating} estrelas pela participante (sem comentário escrito).
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1 text-[11.5px] text-[#6B6365]">
                      <span className="font-bold text-[#1F3A27]">{rev.author}</span>
                      <span>{rev.context} · {rev.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // VIEW PRINCIPAL: LISTAGEM SIMPLIFICADA E MOBILE-FIRST
  // =========================================================
  return (
    <div className="animate-fadeIn font-dmsans max-w-[1080px] mx-auto pb-16 antialiased text-[#2B2829]">
      {/* Cabeçalho Padronizado com a Tipografia de Rodas de Conversa */}
      <header className="mb-10">
        <p className="text-apoio text-[14px] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
          <HeartHandshake size={16} /> ESCUTA ÉTICA E ESPECIALIZADA
        </p>
        <h1 className="text-[32px] md:text-[40px] font-fraunces font-bold text-primary mb-2">
          Rede de apoio profissional
        </h1>
        <p className="text-gray2 text-[18px]">
          Psicólogas certificadas com atendimento gratuito pelo Fundo Florável ou valores sociais acessíveis. Toque em uma profissional para ver sua abordagem e agendar.
        </p>
      </header>

      {/* Busca e Filtros Simplificados */}
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

      {/* Contador discreto + Seletor de Ordenação Justa */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 text-[13px] text-[#6B6365]">
        <div className="flex items-center gap-3">
          <span className="font-medium">
            {filteredProfessionals.length}{" "}
            {filteredProfessionals.length === 1
              ? "profissional disponível"
              : "profissionais disponíveis"}
          </span>

          {(searchTerm ||
            activeSpecialty !== "Todas" ||
            activeFiltersCount > 0 ||
            sortMode !== "equilibrio") && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[#294D33] font-medium hover:underline cursor-pointer"
            >
              Limpar filtros
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sortMode" className="text-[12px] font-medium text-[#6B6365]">
            Ordenar:
          </label>
          <select
            id="sortMode"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value)}
            className="rounded-full border border-[#E4DAD5] bg-white px-3.5 py-1.5 text-[12px] font-bold text-[#1F3A27] outline-none focus:border-[#294D33] cursor-pointer"
          >
            <option value="equilibrio">Todas as Psicólogas Credenciadas (Ordem Equitativa)</option>
            <option value="patentes">Mais Experiência em Rodas & Acolhimentos</option>
            <option value="novas">Novas na Florável (Oportunidade)</option>
            <option value="social">Gratuitas & Menor Valor</option>
          </select>
        </div>
      </div>

      {/* AVISO ÉTICO CFP PARA AS MÃES (EVITA INTERPRETAÇÃO DE QUALIDADE COMPARATIVA) */}
      <div className="rounded-2xl bg-[#EBF3ED]/80 border border-[#294D33]/20 p-3.5 sm:p-4 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-[#294D33] shrink-0 mt-0.5" />
        <p className="text-[12px] text-stone-700 leading-relaxed">
          <strong className="text-[#1F3A27]">Acolhimento com Responsabilidade Ética (Diretriz CFP):</strong> Todas as psicólogas da Rede Florável possuem CRP ativo e especialização em saúde materna. Os selos certificam áreas de experiência, rodas comunitárias e participação no Fundo Social, não constituindo classificação comparativa de qualidade clínica.
        </p>
      </div>

      {/* Lista de Profissionais: 1 coluna no mobile, 2 colunas em telas amplas */}
      {filteredProfessionals.length === 0 ? (
        <div
          className="py-14 px-6 text-center max-w-md mx-auto bg-[#F5EDE9]/60 rounded-2xl border border-[#E4DAD5] space-y-3"
          role="region"
          aria-label="Nenhuma profissional encontrada"
        >
          <div className="w-12 h-12 rounded-xl bg-[#EBD9D3] text-[#1F3A27] mx-auto flex items-center justify-center">
            <SearchX size={22} aria-hidden="true" />
          </div>
          <h3
            className="text-[20px] font-normal text-[#1F3A27]"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Nenhuma profissional encontrada
          </h3>
          <p className="text-[13px] text-[#6B6365] leading-relaxed">
            Tente buscar por outro termo ou remover os filtros selecionados.
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-lg bg-[#294D33] hover:bg-[#1F3A27] text-[#FAF6F3] text-[13px] font-medium transition cursor-pointer"
            >
              Mostrar todas as profissionais
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
