import React, { useState } from 'react';
import { CheckCircle, ArrowRight, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    text: "Como tem estado o seu humor e a sua leveza nos últimos dias?",
    options: [
      {
        value: 0,
        title: "Me sinto leve e presente",
        message: "Consigo sorrir e aproveitar pequenos momentos com meu bebê.",
        img: "/img/fotomae/6.jpg",
        tag: "Bem e estável"
      },
      {
        value: 1,
        title: "Oscilando um pouco",
        message: "Tenho bons momentos, mas o cansaço às vezes pesa no fim do dia.",
        img: "/img/maeDescansando.jpg",
        tag: "Um pouco cansada"
      },
      {
        value: 2,
        title: "Tem sido difícil sorrir",
        message: "Sinto que a alegria está distante e quase não tenho energia.",
        img: "/img/maesono.jpg",
        tag: "Sobrecarregada"
      },
      {
        value: 3,
        title: "Me sinto esgotada e triste",
        message: "Um vazio constante no peito, preciso muito de escuta e colo.",
        img: "/img/maeexausta.jpg",
        tag: "Preciso de apoio"
      }
    ]
  },
  {
    id: 2,
    text: "Quando surge uma brecha na rotina, você consegue descansar?",
    options: [
      {
        value: 0,
        title: "Sim, consigo relaxar",
        message: "Consigo desligar a mente e recuperar minhas forças.",
        img: "/img/maeDescansando.jpg",
        tag: "Descanso tranquilo"
      },
      {
        value: 1,
        title: "Descanso aos poucos",
        message: "Durmo leve, sempre alerta aos barulhos da casa.",
        img: "/img/fotomae/fotomae1.jpg",
        tag: "Sono leve"
      },
      {
        value: 2,
        title: "Mente acelerada",
        message: "Mesmo quando o bebê dorme, minha cabeça não para de pensar.",
        img: "/img/maesono.jpg",
        tag: "Ansiedade"
      },
      {
        value: 3,
        title: "Exaustão profunda",
        message: "Não consigo pregar o olho, sinto meu corpo no limite.",
        img: "/img/maeexausta.jpg",
        tag: "No limite"
      }
    ]
  },
  {
    id: 3,
    text: "Você sente que tem com quem dividir o peso da rotina?",
    options: [
      {
        value: 0,
        title: "Me sinto bem amparada",
        message: "Tenho pessoas por perto que me escutam sem julgar.",
        img: "/img/variasMaes.jpg",
        tag: "Com rede de apoio"
      },
      {
        value: 1,
        title: "Tenho ajuda pontual",
        message: "Alguém ajuda com o bebê, mas sinto falta de conversar sobre mim.",
        img: "/img/maeconversando.jpg",
        tag: "Apoio parcial"
      },
      {
        value: 2,
        title: "Me sinto incompreendida",
        message: "Há pessoas ao redor, mas ninguém entende o que estou passando.",
        img: "/img/maternidadeSemFiltro.jpg",
        tag: "Solitária"
      },
      {
        value: 3,
        title: "Carrego tudo sozinha",
        message: "Sinto que tudo depende exclusivamente de mim o tempo inteiro.",
        img: "/img/maeexausta.jpg",
        tag: "Sem rede"
      }
    ]
  },
  {
    id: 4,
    text: "Como está o seu coração em relação ao futuro?",
    options: [
      {
        value: 0,
        title: "Cheia de esperança",
        message: "Sei que é uma fase intensa e confio que dias mais leves virão.",
        img: "/img/fotomae/6.jpg",
        tag: "Confiante"
      },
      {
        value: 1,
        title: "Vivendo um dia de cada vez",
        message: "Prefiro focar apenas no hoje para não ficar ansiosa.",
        img: "/img/maeDescansando.jpg",
        tag: "Passo a passo"
      },
      {
        value: 2,
        title: "Com medo e insegurança",
        message: "Me cobro muito e tenho receio de não dar conta de tudo.",
        img: "/img/maternidadeSemFiltro.jpg",
        tag: "Insegura"
      },
      {
        value: 3,
        title: "Com muita angústia",
        message: "O amanhã me assusta e sinto que preciso de ajuda profissional.",
        img: "/img/maeexausta.jpg",
        tag: "Acolhimento urgente"
      }
    ]
  }
];

export default function CheckInScreen({ setActiveTab }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAnswer = (questionId, optionValue) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionValue }));

    setTimeout(() => {
      if (currentStep < QUIZ_QUESTIONS.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsProcessing(true);
        setTimeout(() => {
          setIsProcessing(false);
          setIsFinished(true);
        }, 1200);
      }
    }, 350);
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  if (isProcessing) {
    return (
      <div className="animate-fadeIn h-full flex flex-col items-center justify-center text-center py-20 px-4">
        <Loader2 size={42} className="text-[#294D33] animate-spin mb-5" />
        <h2 className="text-2xl font-fraunces font-bold text-stone-900 mb-1">Acolhendo o seu sentir...</h2>
        <p className="text-stone-500 text-sm">Preparando recomendações para o seu momento.</p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="animate-fadeIn font-dmsans min-h-full flex flex-col items-center justify-center max-w-xl mx-auto text-center py-12 px-4">
        <div className="w-20 h-20 rounded-full bg-[#EBF3ED] text-[#294D33] flex items-center justify-center mb-6 mx-auto">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-fraunces font-bold text-stone-900 mb-3">
          Obrigada por se escutar hoje.
        </h2>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed mb-8">
          Qualquer que seja o seu sentir, você não precisa dar conta de tudo sozinha. Separamos rodas de conversa e psicólogas prontas para acolher você.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center w-full">
          <button
            onClick={() => setActiveTab('groups')}
            className="bg-[#294D33] hover:bg-[#1f3c27] text-white px-7 py-3.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition w-full sm:w-auto shadow-xs cursor-pointer"
          >
            Ver Rodas de Conversa <ArrowRight size={16} />
          </button>
          <button
            onClick={() => setActiveTab('home')}
            className="text-stone-600 hover:text-stone-900 px-6 py-3.5 text-sm font-bold transition w-full sm:w-auto border border-stone-200 rounded-full bg-white cursor-pointer"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = QUIZ_QUESTIONS[currentStep];

  return (
    <div className="animate-fadeIn font-dmsans max-w-4xl mx-auto pt-2 pb-12">
      {/* Topo Compacto e Barra de Progresso */}
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between items-center text-xs text-stone-500 font-bold uppercase tracking-wider mb-2.5">
          <span className="flex items-center gap-1.5 text-[#294D33]">
            <Sparkles size={14} /> Check-in Emocional ({currentStep + 1} de {QUIZ_QUESTIONS.length})
          </span>
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="text-stone-500 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft size={14} /> Voltar
            </button>
          )}
        </div>

        <div className="flex gap-2 w-full h-1.5 rounded-full overflow-hidden mb-6">
          {QUIZ_QUESTIONS.map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-full rounded-full transition-all duration-300 ${
                index <= currentStep ? 'bg-[#294D33]' : 'bg-stone-200'
              }`}
            />
          ))}
        </div>

        <h1 className="text-2xl sm:text-3xl font-fraunces font-bold text-stone-900 leading-snug">
          {currentQuestion.text}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Toque no card que melhor representa como você se sente agora:
        </p>
      </div>

      {/* GRID VISUAL 2x2 (1 COLUNA COMPACTA NO MOBILE, 2 COLUNAS NO DESKTOP) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentQuestion.options.map((option) => {
          const isSelected = answers[currentQuestion.id] === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleAnswer(currentQuestion.id, option.value)}
              className={`group text-left rounded-3xl overflow-hidden border transition-all duration-200 flex sm:flex-col bg-white cursor-pointer active:scale-[0.99] ${
                isSelected
                  ? 'border-[#294D33] ring-2 ring-[#294D33] shadow-md'
                  : 'border-stone-200/90 hover:border-[#E8A9BB] hover:shadow-md'
              }`}
            >
              {/* Imagem Representativa (Lateral no mobile, Topo no desktop) */}
              <div className="w-28 sm:w-full h-auto sm:h-40 relative shrink-0 overflow-hidden bg-stone-100">
                <img
                  src={option.img}
                  alt={option.title}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="hidden sm:inline-block absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-xs text-white text-[11px] font-bold">
                  {option.tag}
                </span>
                {isSelected && (
                  <div className="absolute inset-0 bg-[#294D33]/30 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white text-[#294D33] flex items-center justify-center shadow-md">
                      <CheckCircle size={22} />
                    </div>
                  </div>
                )}
              </div>

              {/* Mensagem Representativa */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-center">
                <span className="sm:hidden text-[10px] font-bold uppercase tracking-wider text-[#294D33] mb-0.5">
                  {option.tag}
                </span>
                <h3 className="text-base sm:text-lg font-fraunces font-bold text-stone-900 group-hover:text-[#294D33] transition">
                  {option.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                  "{option.message}"
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
