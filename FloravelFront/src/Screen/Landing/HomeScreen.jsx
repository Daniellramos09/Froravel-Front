import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Heart, ShieldCheck, CheckCircle2, X } from "lucide-react";
import { BotanicalBranch, MaternalLineArt, OrganicHeroBackdrop } from "../../Components/Common/BotanicalDecor";

export default function HomeScreen({ onOpenQuiz }) {
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);

  // Mini Questionário de Acolhimento e Bem-Estar baseado na Escala de Edimburgo
  const miniEdimburgoQuestions = [
    {
      question: "Nos últimos dias, como você tem se sentido em relação à sobrecarga da maternidade?",
      options: [
        "Consigo ter momentos de respiro e tranquilidade.",
        "Às vezes sinto cansaço, mas consigo me reorganizar.",
        "Frequentemente sinto que não estou dando conta de tudo.",
        "Sinto uma sobrecarga constante e uma sensação pesada de isolamento."
      ]
    },
    {
      question: "Quando você pensa no seu momento atual, como está a cobrança interna?",
      options: [
        "Consigo ser compreensiva comigo mesma.",
        "Às vezes me culpo, mas logo passa.",
        "Sinto muita culpa por não atender a expectativas irreais.",
        "Sinto que estou falhando constantemente e me sinto julgada."
      ]
    },
    {
      question: "Você tem tido um espaço seguro para falar abertamente sobre o que sente?",
      options: [
        "Sim, tenho uma rede acolhedora presente.",
        "Tenho pessoas próximas, mas nem sempre compreendem.",
        "Guardo quase tudo para mim para não preocupar ninguém.",
        "Não tenho ninguém com quem conversar sem medo de julgamentos."
      ]
    }
  ];

  const handleNext = () => {
    if (currentStep < miniEdimburgoQuestions.length - 1) {
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
    <div className="relative min-h-[92vh] flex items-center pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-[#FAFAF9]">
      {/* Cenário de Fundo Orgânico com Formas Naturais e Ondas */}
      <OrganicHeroBackdrop />

      {/* Ramo Botânico no canto superior esquerdo */}
      <div className="absolute top-16 left-2 pointer-events-none opacity-40 lg:opacity-70">
        <BotanicalBranch variant="sage" size={110} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ========================================================
              COLUNA ESQUERDA: Textos, Títulos e Chamadas de Ação
          ======================================================== */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-20">
            
            {/* Tag / Badge de Cuidado e Acolhimento */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#EBF3EE] border border-[#73937E]/20 mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#73937E] animate-pulse" />
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#2F3A36]">
                O Espaço da Mãe &bull; Acolhimento Seguro
              </span>
            </div>

            {/* Título Principal Conforme Especificação */}
            <h1 className="font-display text-[2.75rem] sm:text-[3.5rem] lg:text-[4.25rem] font-medium leading-[1.08] text-[#27272A] tracking-tight">
              Maternidade real sem julgamentos.{" "}
              <span className="block italic text-[#73937E] font-normal">
                Um espaço para você respirar.
              </span>
            </h1>

            {/* Subtítulo Conforme Especificação */}
            <p className="mt-6 max-w-2xl text-lg sm:text-xl text-[#52525B] leading-relaxed font-body">
              Apoio emocional contínuo, triagem especializada e acolhimento clínico no seu próprio ritmo. 
              Você cuida de tantas coisas;{" "}
              <strong className="font-semibold text-[#27272A]">deixe a Florável cuidar de você.</strong>
            </p>

            {/* Botões de Ação (CTAs) */}
            <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => setShowModal(true)}
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#2F3A36] hover:bg-[#1F3224] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#2F3A36]/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              >
                <span>Fazer autoavaliação gratuita</span>
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <a
                href="#jornada"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/80 hover:bg-white px-7 py-4 text-base font-semibold text-[#27272A] border border-[#F4C4D4] shadow-xs hover:border-[#73937E] transition-all duration-300"
              >
                Conhecer a jornada
              </a>
            </div>

            {/* Chips de Confiança e Metodologia Científica */}
            <div className="mt-10 pt-8 border-t border-[#73937E]/15 grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-[#73937E] flex-shrink-0" />
                <span className="text-xs font-medium text-[#52525B]">Triagem confidencial (Edimburgo)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Heart size={18} className="text-[#C96E82] flex-shrink-0" />
                <span className="text-xs font-medium text-[#52525B]">100% livre de julgamentos</span>
              </div>
              <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <Sparkles size={18} className="text-[#73937E] flex-shrink-0" />
                <span className="text-xs font-medium text-[#52525B]">Apoio clínico com psicólogas</span>
              </div>
            </div>

          </div>

          {/* ========================================================
              COLUNA DIREITA: Visual de Apoio Fiel ao Mockup do Usuário
              (Foto natural com moldura circular, folhas botânicas e grafismos)
          ======================================================== */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Folhagens Orgânicas ao redor da imagem */}
            <div className="absolute -top-6 -right-6 z-20 pointer-events-none">
              <BotanicalBranch variant="pink" size={130} />
            </div>
            
            <div className="absolute -bottom-10 -left-6 z-20 pointer-events-none">
              <BotanicalBranch variant="sage" size={145} flip={true} />
            </div>

            {/* Grafismo sutil de silhueta maternal em linha contínua no fundo */}
            <div className="absolute -right-12 bottom-0 z-0 pointer-events-none hidden md:block opacity-30">
              <MaternalLineArt size={200} />
            </div>

            {/* Moldura Circular Acolhedora da Mulher */}
            <div className="relative z-10 w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[420px] md:h-[420px] rounded-full p-3 bg-gradient-to-tr from-[#F4C4D4] via-white to-[#73937E]/30 shadow-2xl">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#FAFAF9] border-4 border-white shadow-inner relative group">
                <img
                  src="/img/hero-woman-cup.jpg"
                  alt="Mulher serena em momento de autocuidado com xícara em iluminação natural"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback suave caso o arquivo específico não esteja presente
                    e.currentTarget.src = "/img/hero-reference.jpg";
                  }}
                />
                
                {/* Overlay sutil de iluminação natural */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#27272A]/20 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Card Flutuante de Bem-Estar no Canto da Imagem */}
              <div className="absolute -bottom-3 right-4 sm:right-6 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-[#F4C4D4]/50 flex items-center gap-3 z-30">
                <div className="w-9 h-9 rounded-full bg-[#EBF3EE] flex items-center justify-center text-[#73937E]">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#27272A]">Pausa & Autocuidado</p>
                  <p className="text-[11px] text-[#73937E]">Seu espaço para respirar</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* ========================================================
          MODAL INTERATIVO: Autoavaliação Gratuita (Escala de Edimburgo)
      ======================================================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#27272A]/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-[#FAFAF9] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#F4C4D4]/60 overflow-hidden">
            
            {/* Botão de Fechar */}
            <button
              onClick={handleResetQuiz}
              className="absolute top-5 right-5 p-2 rounded-full text-[#52525B] hover:text-[#27272A] hover:bg-gray-100 transition"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>

            {!quizFinished ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs uppercase tracking-wider font-bold text-[#73937E]">
                    Etapa {currentStep + 1} de {miniEdimburgoQuestions.length}
                  </span>
                  <span className="text-xs text-gray-400">&bull; Triagem Confidencial</span>
                </div>

                {/* Barra de progresso suave */}
                <div className="w-full bg-gray-200 h-1.5 rounded-full mb-6 overflow-hidden">
                  <div 
                    className="bg-[#73937E] h-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / miniEdimburgoQuestions.length) * 100}%` }}
                  />
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-medium text-[#27272A] mb-5 leading-snug">
                  {miniEdimburgoQuestions[currentStep].question}
                </h3>

                <div className="space-y-3 mb-6">
                  {miniEdimburgoQuestions[currentStep].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedAnswer(idx)}
                      className={`w-full text-left p-4 rounded-2xl text-sm transition-all border ${
                        selectedAnswer === idx
                          ? "bg-[#EBF3EE] border-[#73937E] text-[#2F3A36] font-medium shadow-xs"
                          : "bg-white border-gray-200 text-[#52525B] hover:border-[#F4C4D4] hover:bg-[#FDF2F5]"
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
                      ? "bg-[#2F3A36] text-white hover:bg-[#1F3224] shadow-md"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {currentStep === miniEdimburgoQuestions.length - 1 ? "Ver acolhimento personalizado" : "Avançar"}
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#EBF3EE] text-[#73937E] flex items-center justify-center mb-4">
                  <Heart size={32} />
                </div>
                <h3 className="font-display text-2xl font-medium text-[#27272A] mb-2">
                  Você não precisa passar por isso sozinha.
                </h3>
                <p className="text-sm text-[#52525B] leading-relaxed mb-6 max-w-md mx-auto">
                  Acolhemos seus sentimentos com todo carinho e respeito. A Florável oferece ferramentas 
                  gratuitas de diário emocional, rodas de apoio comunitário e profissionais especialistas 
                  prontos para te escutar sem qualquer julgamento.
                </p>

                <div className="bg-white p-4 rounded-2xl border border-[#F4C4D4] text-left mb-6 space-y-2">
                  <p className="text-xs font-semibold text-[#27272A]">Próximos passos recomendados:</p>
                  <p className="text-xs text-[#52525B] flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#73937E]" />
                    Participe de uma Roda de Conversa gratuita semanal
                  </p>
                  <p className="text-xs text-[#52525B] flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#73937E]" />
                    Inicie seu Diário Emocional confidencial
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/cadastro"
                    onClick={handleResetQuiz}
                    className="flex-1 py-3.5 px-6 rounded-full bg-[#2F3A36] text-white text-sm font-semibold hover:bg-[#1F3224] transition text-center shadow-md"
                  >
                    Criar conta gratuita
                  </Link>
                  <button
                    onClick={handleResetQuiz}
                    className="py-3.5 px-6 rounded-full bg-white text-[#27272A] border border-gray-200 text-sm font-semibold hover:bg-gray-50 transition"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
