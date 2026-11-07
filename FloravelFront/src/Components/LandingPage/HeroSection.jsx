import { useState } from "react";
import { X } from "lucide-react";
import { APP_LINKS } from "../../utils/appLinks";
import SplitText from "../SplitText/SplitText";

// Foto e textos fixos do hero
const HERO = {
  photo: "/img/fotoheader/header22.png",
  fallback: "/img/fotoMae/fotomae1.jpg",
  alt: "Gestante de vestido branco com a mão na barriga, sob um buquê de camomilas, diante de uma parede clara com sombras de folhas",
  
};

export default function HeroSection() {
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);

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
    <section className="relative min-h-svh flex flex-col justify-start lg:justify-center pt-[calc(42svh+1.75rem)] pb-8 lg:pt-[clamp(4.75rem,11vh,7rem)] lg:pb-[clamp(1rem,3vh,2.5rem)] overflow-hidden bg-[#FCF7F9]">

      <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
        {/* Desktop: foto em toda a largura, com o texto sobre a parede clara. Celular: faixa no topo, com o texto abaixo */}
        <img
          src={HERO.photo}
          alt={HERO.alt}
          className="absolute top-0 inset-x-0 w-full h-[42svh] lg:h-full object-cover object-[92%_center] lg:object-right transition-opacity duration-700 animate-fadeIn"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = HERO.fallback;
          }}
        />

      </div>

    {/* =========================================================================
        NOVA DIREÇÃO SOLICITADA:
        FOTO SEM MOLDURA NA DIREITA + TEXTO DIRETO NO FUNDO, SEM CARTÃO
    ========================================================================= */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 w-full animate-fadeIn">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* COLUNA ESQUERDA: TEXTO */}
          <div className="lg:col-span-7 z-20">
            <div className="relative">

              
              

              {/* Headline em Fraunces (Line-height 1.1x) */}
              <h1 style={{ "--dur": ".35s" }} className="font-serif text-[clamp(2rem,5.2vh,2.45rem)] sm:text-[3.25rem] lg:text-[clamp(2.4rem,6.6vh,3.8rem)] font-normal leading-[1.1] text-[#294D33] tracking-[-0.02em]">
                <SplitText text="Maternidade real" stagger={6} />{" "}
                <br className="hidden sm:inline" />
                <SplitText text="sem julgamentos." delay={100} stagger={6} />{" "}
                <span className="block mt-1 lg:mt-2 font-serif italic text-[]">
                  <SplitText text="Um espaço para você respirar." delay={200} stagger={6} />
                </span>
              </h1>

              {/* Linha Divisória Fina */}
              <div className="w-16 h-[1.5px] bg-[#f7b8be] my-3 lg:my-[clamp(0.6rem,2vh,1.25rem)]" />

              {/* Texto de Apoio em DM Sans (Line-height 1.4x) */}
              <p className="text-[15px] sm:text-lg lg:text-[clamp(0.95rem,2.4vh,1.125rem)] text-[#3A443E] leading-[1.4] font-sans font-normal max-w-xl">
                Apoio emocional e acolhimento clínico no seu ritmo. 
                Você cuida de tantas coisas;{" "}
                <strong className="font-semibold text-[#294D33]">deixe a Florável cuidar de você.</strong>
              </p>

              {/* Botões de Ação CTAs */}
              <div className="mt-5 lg:mt-[clamp(0.9rem,3vh,2rem)] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => setShowModal(true)}
                  className="btn-shine group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full bg-[#294D33] text-[#FCF7F9] hover:bg-[#1f3c27] hover:shadow-lg hover:shadow-[#294D33]/25 px-4 sm:px-8 py-3.5 lg:py-[clamp(0.7rem,1.9vh,1rem)] text-[15px] sm:text-base lg:text-[17px] font-medium transition-all duration-300 hover:scale-[1.02] cursor-pointer font-sans"
                >
                  <span>Fazer autoavaliação gratuita</span>
                </button>

                <a
                  href="#jornada"
                  className="liquid-button inline-flex items-center justify-center gap-2 rounded-full text-[#294D33] px-7 py-3.5 lg:py-[clamp(0.7rem,1.9vh,1rem)] text-base lg:text-[17px] font-medium transition-all duration-300 text-center font-sans"
                >
                  Conhecer a jornada
                </a>
              </div>

              {/* Linha de Apoio & Validação Clínica */}
              <div className="[@media(max-height:700px)_and_(max-width:1023px)]:hidden mt-4 pt-3 lg:mt-[clamp(0.75rem,3vh,2rem)] lg:pt-[clamp(0.6rem,2vh,1.25rem)] border-t border-[#294D33]/20 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#294D33] font-sans">
                <span className="flex items-center gap-1.5 font-medium text-[#294D33]">
                  Triagem Validada (EPDS)
                </span>
                <span>&bull;</span>
                <span>Diário Emocional 100% Gratuito</span>
                <span>&bull;</span>
                <span>Psicólogas com CRP Ativo</span>
              </div>

            </div>
          </div>

        </div>
      </div>

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
                <h3 className="font-serif text-2xl font-normal text-[#294D33] mb-2">
                  Você não precisa passar por isso sozinha.
                </h3>
                <p className="text-sm text-[#3A443E] leading-relaxed mb-6 max-w-md mx-auto font-sans">
                  Acolhemos seus sentimentos com todo carinho e respeito. A Florável oferece ferramentas 
                  gratuitas de diário emocional, rodas de apoio comunitário e profissionais especialistas 
                  prontas para te escutar sem qualquer julgamento.
                </p>

                <div className="liquid-chip p-4 rounded-2xl text-left mb-6 space-y-2">
                  <p className="text-xs font-semibold text-[#294D33]">Recomendações para você:</p>
                  <p className="text-xs text-[#3A443E] flex items-center gap-2">
                    Participe de uma Roda de Conversa gratuita semanal
                  </p>
                  <p className="text-xs text-[#3A443E] flex items-center gap-2">
                    Inicie seu Diário Emocional confidencial
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={APP_LINKS.mae}
                    className="flex-1 py-3.5 px-6 rounded-full bg-[#294D33] text-[#FCF7F9] text-sm font-semibold hover:bg-[#1f3c27] transition text-center shadow-md font-sans flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Entrar no Espaço da Mãe</span>
                  </a>
                  <button
                    onClick={handleResetQuiz}
                    className="liquid-button py-3.5 px-6 rounded-full text-[#294D33] text-sm font-semibold transition cursor-pointer font-sans"
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
