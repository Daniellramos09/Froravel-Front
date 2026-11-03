import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  X, 
  Activity, 
  Check, 
  Smile, 
  Lock, 
  Calendar, 
  Smartphone,
  ChevronDown,
  Layers
} from "lucide-react";

// ========================================================
// 4 NOVOS HEADERS EDITORIAIS SEM MOLDURA (PASTA FOTOHEADER)
// ========================================================
const EDITORIAL_HEADERS = [
  {
    id: "header1",
    label: "Header 1",
    shortLabel: "Camomilas",
    icon: "🌸",
    photo: "/img/fotoheader/header1.jpg",
    fallback: "/img/fotoMae/fotomae1.jpg",
    alt: "Gestante serena com vestido drapeado branco e buquê de camomilas sob luz solar",
    tag: "Acolhimento & Luz Solar",
    badge: "Luz Solar • Camomilas Naturais"
  },
  {
    id: "header2",
    label: "Header 2",
    shortLabel: "Margaridas",
    icon: "🌼",
    photo: "/img/fotoheader/header2.jpg",
    fallback: "/img/fotoMae/fotomae2.jpg",
    alt: "Ventre materno acolhido com bouquet generoso de margaridas brancas",
    tag: "Delicadeza & Conexão Afetiva",
    badge: "Buquê de Margaridas • Presença Real"
  },
  {
    id: "header3",
    label: "Header 3",
    shortLabel: "Flor Silvestre",
    icon: "🌿",
    photo: "/img/fotoheader/header3.jpg",
    fallback: "/img/fotoMae/fotomae3.jpg",
    alt: "Mãe em repouso ao ar livre segurando delicada flor amarela com sombra botânica",
    tag: "Pausa, Respiro & Serenidade",
    badge: "Flor Silvestre • Repouso & Calma"
  },
  {
    id: "header4",
    label: "Header 4",
    shortLabel: "Flores Vivas",
    icon: "🌷",
    photo: "/img/fotoheader/header4.jpg",
    fallback: "/img/fotoMae/fotomae4.jpg",
    alt: "Ventre materno com flores coloridas em tons de rosa e amarelo e sombras botânicas",
    tag: "Vida, Afeto & Transformação",
    badge: "Flores do Campo • Sensibilidade Real"
  },
  {
    id: "header5",
    label: "Header 5",
    shortLabel: "Magnólia",
    icon: "✨",
    photo: "/img/fotoheader/header5.jpg",
    fallback: "/img/fotoMae/fotomae5.jpg",
    alt: "Perfil sereno de mulher grávida na cortina translúcida segurando magnólia",
    tag: "Silêncio & Suavidade",
    badge: "Perfil Delicado • Flor de Magnólia"
  }
];

export default function HeroSection({ onOpenQuiz }) {
  // Controle do Header Ativo (Padrão: header1 dos novos editoriais)
  const [activeHeaderId, setActiveHeaderId] = useState(() => {
    try {
      return localStorage.getItem("floravel_editorial_header") || "header1";
    } catch {
      return "header1";
    }
  });

  // Modo de exibição: 'editorial' (os 4 novos) ou 'legacy' (as versões anteriores para comparação)
  const [activeMode, setActiveMode] = useState(() => {
    try {
      const savedMode = localStorage.getItem("floravel_hero_mode");
      return savedMode === "legacy" ? "legacy" : "editorial";
    } catch {
      return "editorial";
    }
  });

  const [legacyVariant, setLegacyVariant] = useState(() => {
    try {
      return localStorage.getItem("floravel_hero_variant") || "hero3";
    } catch {
      return "hero3";
    }
  });

  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);

  // Troca de Header Editorial
  const handleSelectHeader = (headerId) => {
    setActiveHeaderId(headerId);
    setActiveMode("editorial");
    try {
      localStorage.setItem("floravel_editorial_header", headerId);
      localStorage.setItem("floravel_hero_mode", "editorial");
    } catch (e) {
      console.error(e);
    }
  };

  // Troca para modelos legados
  const handleSelectLegacy = (variantName) => {
    setLegacyVariant(variantName);
    setActiveMode("legacy");
    try {
      localStorage.setItem("floravel_hero_variant", variantName);
      localStorage.setItem("floravel_hero_mode", "legacy");
    } catch (e) {
      console.error(e);
    }
  };

  // Header editorial atualmente selecionado
  const currentEditorial = EDITORIAL_HEADERS.find(h => h.id === activeHeaderId) || EDITORIAL_HEADERS[0];

  // Questionário de Acolhimento e Triagem (Escala de Edimburgo simplificada)
  const edinburghQuestions = [
    {
      question: "Nos últimos dias, como você tem se sentido em relação à sobrecarga da maternidade?",
      options: [
        "Consigo encontrar momentos de respiro e serenidade.",
        "Sinto cansaço ocasional, mas reorganizo minha rotina.",
        "Frequentemente sinto que não dou conta de tudo.",
        "Sinto uma sobrecarga constante e isolamento silencioso."
      ]
    },
    {
      question: "Quando pensa no momento atual, como está a sua cobrança interna?",
      options: [
        "Consigo ser paciente e compassiva comigo mesma.",
        "Às vezes me culpo, mas logo consigo retomar.",
        "Sinto culpa frequente por não atingir expectativas ideais.",
        "Sinto que estou falhando o tempo todo e temo julgamentos."
      ]
    },
    {
      question: "Você tem encontrado um espaço seguro para expressar o que realmente sente?",
      options: [
        "Sim, tenho uma rede acolhedora e atenta.",
        "Tenho pessoas próximas, mas nem sempre compreendem.",
        "Guardo para mim mesma para não preocupar ninguém.",
        "Não tenho ninguém com quem conversar sem medo de cobranças."
      ]
    }
  ];

  const handleNext = () => {
    if (currentStep < edinburghQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedAnswer(null);
    } else {
      setQuizFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setShowModal(false);
    setCurrentStep(0);
    setSelectedAnswer(null);
    setQuizFinished(false);
  };

  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex flex-col justify-center pt-24 pb-16 lg:pt-28 lg:pb-16 overflow-hidden bg-[#FCF7F9]">
      
      {/* =========================================================================
          MODO 1: NOVOS HEADERS EDITORIAIS SEM MOLDURA (FOTO COBRINDO A DIREITA)
      ========================================================================= */}
      {activeMode === "editorial" && (
        <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
          {/* A foto cobre o lado direito de ponta a ponta (sem moldura, sem bordas brancas) */}
          <img
            src={currentEditorial.photo}
            alt={currentEditorial.alt}
            key={currentEditorial.id}
            className="absolute top-0 right-0 w-full lg:w-[60%] xl:w-[55%] h-full object-cover object-[75%_center] lg:object-[center_15%] transition-opacity duration-700 animate-fadeIn"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = currentEditorial.fallback;
            }}
          />

          {/* Transição botânica suave: gradiente sutil fundindo a foto ao canvas da esquerda */}
          <div className="hidden lg:block absolute inset-y-0 left-[35%] w-[30%] bg-gradient-to-r from-[#FCF7F9] via-[#FCF7F9]/80 to-transparent pointer-events-none" />
          <div className="block lg:hidden absolute inset-0 bg-gradient-to-t from-[#FCF7F9] via-[#FCF7F9]/85 to-transparent pointer-events-none" />
          
          {/* Luz ambiente difusa no canto superior esquerdo */}
          <div className="absolute -top-24 -left-24 w-[36rem] h-[36rem] rounded-full bg-[#F4DDE5]/50 blur-[130px] pointer-events-none" />
        </div>
      )}

      {/* Glow para modo legado */}
      {activeMode === "legacy" && (
        <>
          <div 
            aria-hidden="true" 
            className="pointer-events-none absolute -top-24 -left-24 w-[36rem] h-[36rem] rounded-full bg-[#F4DDE5]/45 blur-[130px] -z-10" 
          />
          <div 
            aria-hidden="true" 
            className="pointer-events-none absolute top-1/4 right-[-5%] w-[42rem] h-[42rem] rounded-full bg-[#E8A9BB]/25 blur-[140px] -z-10" 
          />
        </>
      )}

      {/* =========================================================================
          BARRA INTERATIVA DE SELEÇÃO DOS HEADERS (FOTOHEADER)
      ========================================================================= */}
      <div className="relative z-30 mx-auto w-full max-w-7xl px-6 lg:px-12 mb-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 p-2.5 rounded-3xl lg:rounded-full bg-white/90 backdrop-blur-xl border border-[#E8A9BB]/60 shadow-md shadow-[#294D33]/5">
          
          {/* Rótulo de Identificação */}
          <div className="flex items-center gap-2.5 px-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#294D33] animate-pulse" />
            <span className="text-xs uppercase tracking-wider font-bold text-[#294D33] font-sans">
              Fotos Oficiais ({EDITORIAL_HEADERS.length} Headers Sem Moldura):
            </span>
          </div>

          {/* Botões dos 4 (+1) Headers da pasta fotoheader */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {EDITORIAL_HEADERS.map((h) => {
              const isActive = activeMode === "editorial" && activeHeaderId === h.id;
              return (
                <button
                  key={h.id}
                  onClick={() => handleSelectHeader(h.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs transition-all duration-300 cursor-pointer font-sans flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#294D33] text-[#FCF7F9] font-semibold shadow-xs scale-102"
                      : "bg-transparent text-[#516B55] hover:text-[#294D33] hover:bg-[#F4DDE5]/60"
                  }`}
                >
                  <span>{h.icon}</span>
                  <span className="font-semibold">{h.label}:</span>
                  <span className="hidden sm:inline font-normal">{h.shortLabel}</span>
                </button>
              );
            })}

            {/* Separador e botão de acesso aos modelos anteriores */}
            <div className="h-4 w-px bg-[#E8A9BB]/60 mx-1 hidden sm:block" />

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleSelectLegacy("hero3")}
                title="Ver o layout Split-Screen anterior com mockup de celular"
                className={`px-2.5 py-1 rounded-full text-[11px] transition-all cursor-pointer font-sans ${
                  activeMode === "legacy" && legacyVariant === "hero3"
                    ? "bg-[#E8A9BB] text-[#294D33] font-bold"
                    : "text-[#516B55]/80 hover:text-[#294D33] hover:bg-[#F4DDE5]/40"
                }`}
              >
                📱 Split
              </button>
              <button
                onClick={() => handleSelectLegacy("hero1")}
                title="Ver o layout com Círculo Botânico anterior"
                className={`px-2.5 py-1 rounded-full text-[11px] transition-all cursor-pointer font-sans ${
                  activeMode === "legacy" && legacyVariant === "hero1"
                    ? "bg-[#E8A9BB] text-[#294D33] font-bold"
                    : "text-[#516B55]/80 hover:text-[#294D33] hover:bg-[#F4DDE5]/40"
                }`}
              >
                🌿 Círculo
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* =========================================================================
          NOVA DIREÇÃO SOLICITADA:
          FOTO SEM MOLDURA NA DIREITA + TEXTO NA ESQUERDA COM FUNDO DESFOCADO
      ========================================================================= */}
      {activeMode === "editorial" && (
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 w-full animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[540px]">
            
            {/* COLUNA ESQUERDA: TEXTO COM FUNDO DESFOCADO (BACKDROP-BLUR PARA LEITURA CRISTALINA) */}
            <div className="lg:col-span-7 xl:col-span-6 z-20">
              <div className="relative rounded-[2.5rem] bg-[#FCF7F9]/86 backdrop-blur-2xl border border-white/80 p-7 sm:p-10 lg:p-12 shadow-2xl shadow-[#294D33]/6 transition-all duration-300">
                
                {/* Glow interno suave */}
                <div className="absolute -top-8 -left-8 w-44 h-44 bg-[#F4DDE5]/70 rounded-full blur-3xl pointer-events-none -z-10" />

                {/* Tag Superior */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4DDE5] border border-[#E8A9BB]/50 shadow-xs mb-5">
                  <span className="w-2 h-2 rounded-full bg-[#294D33] animate-pulse" />
                  <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#294D33] font-sans">
                    {currentEditorial.tag}
                  </span>
                </div>

                {/* Headline em Fraunces (Line-height 1.1x) */}
                <h1 className="font-serif text-[2.45rem] sm:text-[3.25rem] lg:text-[3.8rem] font-normal leading-[1.1] text-[#294D33] tracking-[-0.02em]">
                  Maternidade real <br className="hidden sm:inline" />
                  sem julgamentos.{" "}
                  <span className="block mt-2 font-serif italic text-[#E8A9BB]">
                    Um espaço para você respirar.
                  </span>
                </h1>

                {/* Linha Divisória Fina */}
                <div className="w-16 h-[1.5px] bg-[#E8A9BB] my-5" />

                {/* Texto de Apoio em DM Sans (Line-height 1.4x) */}
                <p className="text-base sm:text-lg text-[#3A443E] leading-[1.4] font-sans font-normal max-w-xl">
                  Apoio emocional contínuo, triagem especializada e acolhimento clínico no seu próprio ritmo. 
                  Você cuida de tantas coisas;{" "}
                  <strong className="font-semibold text-[#294D33]">deixe a Florável cuidar de você.</strong>
                </p>

                {/* Botões de Ação CTAs */}
                <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <button
                    onClick={() => setShowModal(true)}
                    className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#294D33] text-[#FCF7F9] hover:bg-[#1f3c27] hover:shadow-lg hover:shadow-[#294D33]/25 px-8 py-4 text-[17px] font-medium transition-all duration-300 hover:scale-[1.02] cursor-pointer font-sans"
                  >
                    <span>Fazer autoavaliação gratuita</span>
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>

                  <a
                    href="#jornada"
                    className="inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] border-[#E8A9BB] bg-white/70 hover:bg-[#F4DDE5]/50 text-[#294D33] px-7 py-4 text-[17px] font-medium transition-all duration-300 text-center font-sans"
                  >
                    Conhecer a jornada
                  </a>
                </div>

                {/* Linha de Apoio & Validação Clínica */}
                <div className="mt-8 pt-5 border-t border-[#E8A9BB]/30 flex flex-wrap items-center gap-4 text-xs text-[#516B55] font-sans">
                  <span className="flex items-center gap-1.5 font-medium text-[#294D33]">
                    <CheckCircle2 size={15} className="text-[#294D33]" />
                    Triagem Validada (EPDS)
                  </span>
                  <span>&bull;</span>
                  <span>Diário Emocional 100% Gratuito</span>
                  <span>&bull;</span>
                  <span>Psicólogas com CRP Ativo</span>
                </div>

              </div>
            </div>

            {/* COLUNA DIREITA: FOTO TOTALMENTE NÍTIDA E SEM MOLDURA */}
            <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 items-end justify-end h-full min-h-[500px] pointer-events-none pb-4 pr-2">
              {/* Badge Flutuante Translúcido em Harmonia Botânica */}
              <div className="backdrop-blur-md bg-white/85 border border-white/80 px-4 py-2.5 rounded-full shadow-lg shadow-[#294D33]/10 flex items-center gap-2.5 pointer-events-auto transition-transform hover:scale-102">
                <span className="w-2.5 h-2.5 rounded-full bg-[#294D33] animate-pulse" />
                <span className="text-xs font-semibold text-[#294D33] font-nunito tracking-wide">
                  {currentEditorial.badge}
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          VARIAÇÃO ANTERIOR: SPLIT-SCREEN PRODUTO & EMOÇÃO
      ========================================================================= */}
      {activeMode === "legacy" && legacyVariant === "hero3" && (
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 w-full animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            <div className="lg:col-span-6 flex flex-col items-start text-left z-20 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4DDE5] border border-[#E8A9BB]/50 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#294D33]" />
                <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#294D33] font-sans">
                  Espaço de Acolhimento e Saúde Perinatal
                </span>
              </div>

              <h1 className="font-serif text-[2.75rem] sm:text-[3.5rem] lg:text-[4.2rem] font-normal leading-[1.08] text-[#294D33] tracking-[-0.02em]">
                Um espaço para cuidar{" "}
                <span className="block mt-1.5 font-serif italic text-[#E8A9BB]">
                  de quem cuida.
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-[#3A443E] leading-[1.4] font-sans font-normal max-w-xl">
                Acolhimento emocional, ferramentas de autocuidado e apoio especializado para você viver a maternidade no seu próprio tempo.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={() => setShowModal(true)}
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#294D33] text-[#FCF7F9] hover:bg-[#1f3c27] hover:shadow-lg hover:shadow-[#294D33]/25 px-8 py-4 text-base font-medium transition-all duration-300 hover:scale-[1.02] cursor-pointer font-sans"
                >
                  <span>Começar minha jornada</span>
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                <a
                  href="#recursos"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] border-[#E8A9BB] bg-transparent text-[#294D33] hover:bg-[#F4DDE5]/50 px-7 py-4 text-base font-medium transition-all duration-300 text-center font-sans"
                >
                  Conhecer a plataforma
                </a>
              </div>

              <div className="pt-4 border-t border-[#E8A9BB]/30 flex flex-wrap items-center gap-4 text-xs text-[#516B55] font-sans">
                <span className="flex items-center gap-1.5 font-medium text-[#294D33]">
                  <CheckCircle2 size={15} className="text-[#294D33]" />
                  Triagem Validada (EPDS)
                </span>
                <span>&bull;</span>
                <span>Diário Emocional 100% Gratuito</span>
                <span>&bull;</span>
                <span>Psicólogas com CRP Ativo</span>
              </div>

            </div>

            <div className="lg:col-span-6 relative flex items-center justify-center min-h-[460px] sm:min-h-[520px]">
              
              <div className="relative w-full max-w-[480px] h-[500px] sm:h-[540px] flex items-center justify-center">

                <div className="absolute top-2 right-2 sm:right-4 w-[72%] sm:w-[70%] h-[88%] rounded-[2.5rem] overflow-hidden bg-white border border-[#E8A9BB]/50 shadow-xl shadow-[#294D33]/8">
                  <img
                    src="/img/fotoMae/fotomae1.jpg"
                    alt="Mulher grávida serena em momento de acolhimento e afeto"
                    className="w-full h-full object-cover object-center transition-transform duration-1000 hover:scale-103"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/img/fotoMae/fotomae5.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#294D33]/30 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute top-4 right-4 backdrop-blur-md bg-white/85 px-3 py-1 rounded-full border border-white text-[10px] font-bold text-[#294D33] uppercase tracking-wider font-nunito shadow-xs">
                    Maternidade Real
                  </div>
                </div>

                <div className="absolute bottom-2 left-2 sm:left-4 z-20 w-[240px] sm:w-[265px] rounded-[2.8rem] bg-[#1a1f1b] p-2.5 shadow-2xl shadow-[#294D33]/25 border-2 border-stone-800 transition-transform duration-500 hover:-translate-y-1">
                  
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-[#1a1f1b] rounded-full z-30" />
                  
                  <div className="relative rounded-[2.2rem] overflow-hidden bg-[#FCF7F9] p-4 pt-7 text-left border border-[#E8A9BB]/40">
                    
                    <div className="flex justify-between items-center text-[9px] font-semibold text-[#516B55] mb-2 px-1">
                      <span>09:41</span>
                      <div className="flex items-center gap-1">
                        <span className="w-2.5 h-1.5 bg-[#294D33] rounded-xs" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-[9px] uppercase font-bold tracking-wider text-[#516B55]">Florável App</span>
                        <h4 className="font-serif text-sm font-normal text-[#294D33] leading-tight">Olá, Mariana ♡</h4>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-[#F4DDE5] text-[#294D33] flex items-center justify-center text-[10px] font-bold">
                        M
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-2xl border border-[#E8A9BB]/40 shadow-xs mb-2.5">
                      <p className="text-[10px] font-semibold text-[#294D33] mb-1 font-nunito">Como você está hoje?</p>
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-[9px] p-1 rounded-lg bg-[#F4DDE5] text-[#294D33] font-medium flex items-center justify-center gap-0.5">
                          🌿 Calma
                        </span>
                        <span className="text-[9px] p-1 rounded-lg bg-[#FCF7F9] text-[#516B55] border border-stone-100 flex items-center justify-center gap-0.5">
                          ☀️ Plena
                        </span>
                        <span className="text-[9px] p-1 rounded-lg bg-[#FCF7F9] text-[#516B55] border border-stone-100 flex items-center justify-center gap-0.5">
                          🌧️ Cansaço
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#294D33] text-white p-3 rounded-2xl shadow-xs">
                      <div className="flex justify-between items-center text-[9px] font-medium mb-1 text-[#E8A9BB]">
                        <span>Triagem EPDS</span>
                        <span className="bg-[#516B55] px-1.5 py-0.2 rounded-full text-[8px]">Etapa 1/3</span>
                      </div>
                      <p className="text-[10px] font-serif font-normal leading-snug mb-1.5">
                        "Consigo encontrar momentos de respiro?"
                      </p>
                      <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden mb-1.5">
                        <div className="bg-[#E8A9BB] h-full w-[75%]" />
                      </div>
                      <div className="flex items-center justify-between text-[8px] text-white/80">
                        <span>🔒 100% Confidencial</span>
                        <span className="font-semibold text-[#E8A9BB]">Avançar →</span>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="absolute top-4 left-0 sm:-left-4 z-30 backdrop-blur-md bg-white/92 px-3.5 py-2 rounded-2xl border border-[#E8A9BB] shadow-lg shadow-[#294D33]/8 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#F4DDE5] text-[#294D33] flex items-center justify-center flex-shrink-0">
                    <Heart size={12} className="fill-[#E8A9BB] text-[#294D33]" />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-[#294D33] font-nunito leading-tight">Espaço Seguro</p>
                    <p className="text-[9px] text-[#516B55] leading-tight">Escuta sem julgamentos</p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          VARIAÇÃO ANTERIOR: BOTÂNICA RECORTADA (CÍRCULO E FOLHAGENS)
      ========================================================================= */}
      {activeMode === "legacy" && legacyVariant === "hero1" && (
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 w-full animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            <div className="lg:col-span-7 flex flex-col items-start text-left z-20">
              
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#F4DDE5] shadow-xs mb-6 border border-[#E8A9BB]/40">
                <span className="w-2 h-2 rounded-full bg-[#294D33] animate-pulse" />
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#294D33] font-sans">
                  ESPAÇO DE ACOLHIMENTO E SAÚDE PERINATAL
                </span>
              </div>

              <h1 className="font-serif text-[2.75rem] sm:text-[3.6rem] lg:text-[4.35rem] font-normal leading-[1.12] text-[#294D33] tracking-[-0.015em]">
                Maternidade real sem julgamentos.{" "}
                <span className="block mt-1 font-serif italic text-[#E8A9BB]">
                  Um espaço para você respirar.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg sm:text-[1.2rem] text-[#3A443E] leading-relaxed font-sans font-normal">
                Apoio emocional contínuo, triagem especializada e acolhimento clínico no seu próprio ritmo. 
                Você cuida de tantas coisas;{" "}
                <strong className="font-semibold text-[#294D33]">deixe a Florável cuidar de você.</strong>
              </p>

              <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={() => setShowModal(true)}
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#294D33] text-[#FCF7F9] hover:bg-[#1f3c27] hover:shadow-lg hover:shadow-[#294D33]/25 px-8 py-4 text-base font-medium transition-all duration-300 hover:scale-[1.02] cursor-pointer font-sans"
                >
                  <span>Fazer autoavaliação gratuita</span>
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                <a
                  href="#jornada"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] border-[#E8A9BB] bg-transparent text-[#294D33] hover:bg-[#F4DDE5]/50 hover:border-[#294D33] px-7 py-4 text-base font-medium transition-all duration-300 text-center font-sans"
                >
                  Conhecer a jornada
                </a>
              </div>

              <div className="mt-11 pt-8 border-t border-[#E8A9BB]/30 flex flex-wrap items-center gap-4 sm:gap-6 w-full">
                <div className="flex items-center -space-x-2.5">
                  <img src="/img/1.jpg" alt="" className="w-10 h-10 rounded-full border-2 border-[#FCF7F9] object-cover shadow-xs" />
                  <img src="/img/2.jpg" alt="" className="w-10 h-10 rounded-full border-2 border-[#FCF7F9] object-cover shadow-xs" />
                  <img src="/img/3.jpg" alt="" className="w-10 h-10 rounded-full border-2 border-[#FCF7F9] object-cover shadow-xs" />
                  <img src="/img/4.jpg" alt="" className="w-10 h-10 rounded-full border-2 border-[#FCF7F9] object-cover shadow-xs" />
                  <div className="w-10 h-10 rounded-full border-2 border-[#FCF7F9] bg-[#F4DDE5] text-[#294D33] flex items-center justify-center text-xs font-semibold shadow-xs">
                    +1.2k
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-[#294D33]">
                    Mais de 1.200 acolhimentos realizados este mês
                  </p>
                  <p className="text-xs text-[#516B55] flex items-center gap-1.5 mt-0.5 font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#516B55]" />
                    Baseado na Escala de Edimburgo (EPDS) &bull; 100% Confidencial
                  </p>
                </div>
              </div>

            </div>

            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] w-full select-none">
              <div className="relative w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[490px] h-[480px] sm:h-[530px] lg:h-[570px] flex items-end justify-center">

                <div 
                  aria-hidden="true"
                  className="absolute z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-[48%] w-[330px] h-[330px] sm:w-[390px] sm:h-[390px] lg:w-[440px] lg:h-[440px] rounded-full bg-gradient-to-tr from-[#F4DDE5] via-[#faedf1] to-[#E8A9BB] shadow-xl shadow-[#E8A9BB]/25"
                />

                <div aria-hidden="true" className="absolute z-10 inset-0 pointer-events-none flex items-center justify-center">
                  <img
                    src="/assets/images/botanical-leaves.svg"
                    alt=""
                    className="w-[110%] sm:w-[115%] h-[110%] sm:h-[115%] object-contain transform translate-y-1 sm:translate-y-2 filter drop-shadow-sm"
                  />
                </div>

                <div className="relative z-20 w-full flex items-end justify-center pointer-events-none">
                  <img
                    src="/assets/images/hero-mother-cutout.png"
                    alt="Mulher serena acolhida pela Florável"
                    className="w-auto h-[440px] sm:h-[490px] lg:h-[540px] max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] object-contain object-bottom filter drop-shadow-[0_18px_24px_rgba(41,77,51,0.15)]"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/img/hero-woman-serene.jpg";
                      e.currentTarget.className = "w-[340px] h-[340px] rounded-full object-cover shadow-2xl";
                    }}
                  />
                </div>

                <div className="absolute top-4 sm:top-2 -right-2 sm:-right-4 lg:-right-6 z-30 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#FCF7F9]/90 backdrop-blur-md border border-[#E8A9BB] shadow-lg shadow-[#294D33]/8">
                  <div className="w-6 h-6 rounded-full bg-[#F4DDE5] text-[#294D33] flex items-center justify-center flex-shrink-0">
                    <Check size={14} strokeWidth={2.8} />
                  </div>
                  <p className="text-xs font-semibold text-[#294D33] font-nunito leading-tight whitespace-nowrap">
                    Psicólogas Perinatais <span className="font-normal text-[#516B55]">• CRP Ativo</span>
                  </p>
                </div>

                <div className="absolute bottom-2 sm:bottom-0 -left-2 sm:-left-4 lg:-left-6 z-30 bg-[#FCF7F9] border border-[#E8A9BB]/50 shadow-xl shadow-[#294D33]/10 p-3.5 sm:p-4 rounded-2xl max-w-[270px] text-left">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F4DDE5] text-[#294D33]">
                      Autoavaliação Edimburgo
                    </span>
                    <Activity size={14} className="text-[#516B55]" />
                  </div>
                  <p className="text-xs font-medium text-[#3A443E] mb-2 font-sans">
                    Status Emocional: <span className="text-[#294D33] font-semibold">Triagem Segura</span>
                  </p>
                  <div className="w-full bg-[#F4DDE5]/60 h-2 rounded-full overflow-hidden mb-1.5">
                    <div className="bg-gradient-to-r from-[#294D33] via-[#516B55] to-[#E8A9BB] h-full w-[82%] rounded-full" />
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          MODAL INTERATIVO: Autoavaliação Gratuita (Brand Guide Florável)
      ======================================================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#294D33]/40 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-[#FCF7F9] rounded-[2rem] p-6 sm:p-8 shadow-2xl border border-[#E8A9BB]/60 overflow-hidden">
            
            <button
              onClick={handleResetQuiz}
              className="absolute top-5 right-5 p-2 rounded-full text-[#516B55] hover:text-[#294D33] hover:bg-[#F4DDE5] transition cursor-pointer"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>

            {!quizFinished ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#294D33] font-sans">
                    Etapa {currentStep + 1} de {edinburghQuestions.length}
                  </span>
                  <span className="text-xs text-[#516B55]">&bull; Triagem Confidencial</span>
                </div>

                <div className="w-full bg-[#F4DDE5] h-1.5 rounded-full mb-6 overflow-hidden">
                  <div 
                    className="bg-[#294D33] h-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / edinburghQuestions.length) * 100}%` }}
                  />
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#294D33] mb-5 leading-snug">
                  {edinburghQuestions[currentStep].question}
                </h3>

                <div className="space-y-3 mb-6">
                  {edinburghQuestions[currentStep].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedAnswer(idx)}
                      className={`w-full text-left p-4 rounded-2xl text-sm transition-all border font-sans cursor-pointer ${
                        selectedAnswer === idx
                          ? "bg-[#F4DDE5] border-[#294D33] text-[#294D33] font-medium shadow-xs"
                          : "bg-white border-[#E8A9BB]/40 text-[#3A443E] hover:border-[#E8A9BB] hover:bg-white/80"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <button
                  disabled={selectedAnswer === null}
                  onClick={handleNext}
                  className={`w-full py-3.5 rounded-full text-sm font-semibold transition-all ${
                    selectedAnswer !== null
                      ? "bg-[#294D33] text-[#FCF7F9] hover:bg-[#1f3c27] shadow-md cursor-pointer"
                      : "bg-[#E8A9BB]/30 text-[#516B55]/60 cursor-not-allowed"
                  }`}
                >
                  {currentStep === edinburghQuestions.length - 1 ? "Ver acolhimento personalizado" : "Avançar"}
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#F4DDE5] text-[#294D33] flex items-center justify-center mb-4">
                  <Heart size={30} className="fill-[#E8A9BB] text-[#294D33]" />
                </div>
                <h3 className="font-serif text-2xl font-normal text-[#294D33] mb-2">
                  Você não precisa passar por isso sozinha.
                </h3>
                <p className="text-sm text-[#3A443E] leading-relaxed mb-6 max-w-md mx-auto font-sans">
                  Acolhemos seus sentimentos com todo carinho e respeito. A Florável oferece ferramentas 
                  gratuitas de diário emocional, rodas de apoio comunitário e profissionais especialistas 
                  prontas para te escutar sem qualquer julgamento.
                </p>

                <div className="bg-white p-4 rounded-2xl border border-[#E8A9BB]/50 text-left mb-6 space-y-2">
                  <p className="text-xs font-semibold text-[#294D33]">Recomendações para você:</p>
                  <p className="text-xs text-[#3A443E] flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#294D33]" />
                    Participe de uma Roda de Conversa gratuita semanal
                  </p>
                  <p className="text-xs text-[#3A443E] flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#294D33]" />
                    Inicie seu Diário Emocional confidencial
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/cadastro"
                    onClick={handleResetQuiz}
                    className="flex-1 py-3.5 px-6 rounded-full bg-[#294D33] text-[#FCF7F9] text-sm font-semibold hover:bg-[#1f3c27] transition text-center shadow-md font-sans"
                  >
                    Criar conta gratuita
                  </Link>
                  <button
                    onClick={handleResetQuiz}
                    className="py-3.5 px-6 rounded-full bg-transparent text-[#294D33] border border-[#E8A9BB] text-sm font-semibold hover:bg-[#F4DDE5]/40 transition cursor-pointer font-sans"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
