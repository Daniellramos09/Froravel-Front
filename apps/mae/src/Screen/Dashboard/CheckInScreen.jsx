import React, { useState } from 'react';
import { CheckCircle, ArrowRight, ArrowLeft, Loader2, Sparkles, PhoneCall, MessageCircleHeart, HeartHandshake, ShieldCheck } from 'lucide-react';
import { getIllustrationBgClass } from '../../utils/illustrationFrame';

const isLocal = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
const API_BASE = import.meta.env.VITE_API_URL || (isLocal ? 'http://localhost:8080' : '');

// Escala de Depressão Pós-parto de Edimburgo (EPDS — Cox, Holden & Sagovsky, 1987; Augusto et al., 1996 / DGS, 2005)
// Itens 1, 2 e 4: cotação direta (0, 1, 2, 3) | Itens 3, 5, 6, 7, 8, 9 e 10: cotação inversa (3, 2, 1, 0) na ordem original
const QUIZ_QUESTIONS = [
  {
    id: 1,
    text: "Nos últimos 7 dias, tenho sido capaz de rir e ver o lado divertido das coisas:",
    options: [
      {
        value: 0,
        title: "Tanto como antes",
        message: "Consigo sorrir e aproveitar pequenos momentos com meu bebê.",
        img: "/img/ilustracoes/florescer.jpg",
        tag: "Estável"
      },
      {
        value: 1,
        title: "Menos do que antes",
        message: "Ainda tenho bons momentos, mas com menos frequência do que costumava.",
        img: "/img/ilustracoes/autocuidado.jpg",
        tag: "Um pouco menos"
      },
      {
        value: 2,
        title: "Muito menos do que antes",
        message: "Tem sido difícil encontrar leveza ou motivos para sorrir no dia a dia.",
        img: "/img/ilustracoes/pausa.jpg",
        tag: "Bem menos"
      },
      {
        value: 3,
        title: "Nunca",
        message: "Não tenho conseguido rir ou sentir leveza nos últimos dias.",
        img: "/img/ilustracoes/acolhimento.jpg",
        tag: "Preciso de apoio"
      }
    ]
  },
  {
    id: 2,
    text: "Nos últimos 7 dias, tenho tido esperança no futuro:",
    options: [
      {
        value: 0,
        title: "Tanta como sempre tive",
        message: "Confio que esta fase intensa vai se equilibrar e dias mais leves virão.",
        img: "/img/ilustracoes/florescer.jpg",
        tag: "Confiante"
      },
      {
        value: 1,
        title: "Menos do que costumava ter",
        message: "Sigo um dia de cada vez, às vezes com menos entusiasmo do que antes.",
        img: "/img/ilustracoes/autocuidado.jpg",
        tag: "Oscilando"
      },
      {
        value: 2,
        title: "Muito menos do que costumava ter",
        message: "Sinto dificuldade de enxergar melhora ou fazer planos para frente.",
        img: "/img/ilustracoes/diario.jpg",
        tag: "Desanimada"
      },
      {
        value: 3,
        title: "Quase nenhuma",
        message: "O futuro parece muito pesado e sinto que preciso de acolhimento.",
        img: "/img/ilustracoes/acolhimento.jpg",
        tag: "Acolhimento urgente"
      }
    ]
  },
  {
    id: 3,
    text: "Nos últimos 7 dias, tenho me culpado sem necessidade quando as coisas dão errado:",
    options: [
      {
        value: 3,
        title: "Sim, na maioria das vezes",
        message: "Carrego a sensação constante de que tudo que dá errado é culpa minha.",
        img: "/img/ilustracoes/acolhimento.jpg",
        tag: "Culpa intensa"
      },
      {
        value: 2,
        title: "Sim, algumas vezes",
        message: "Costumo me cobrar bastante mesmo quando não está no meu controle.",
        img: "/img/ilustracoes/pausa.jpg",
        tag: "Autocobrança"
      },
      {
        value: 1,
        title: "Raramente",
        message: "Às vezes me cobro um pouco, mas logo consigo me acolher.",
        img: "/img/ilustracoes/autocuidado.jpg",
        tag: "Cobrança leve"
      },
      {
        value: 0,
        title: "Não, nunca",
        message: "Entendo que imprevistos acontecem e não carrego essa culpa.",
        img: "/img/ilustracoes/florescer.jpg",
        tag: "Sem culpa"
      }
    ]
  },
  {
    id: 4,
    text: "Nos últimos 7 dias, tenho estado ansiosa ou preocupada sem motivo:",
    options: [
      {
        value: 0,
        title: "Não, nunca",
        message: "Minhas preocupações têm sido proporcionais à rotina com o bebê.",
        img: "/img/ilustracoes/mae-bebe-tranquilidade.jpg",
        tag: "Tranquila"
      },
      {
        value: 1,
        title: "Quase nunca",
        message: "Apenas em momentos pontuais ao longo da semana.",
        img: "/img/ilustracoes/autocuidado.jpg",
        tag: "Pontual"
      },
      {
        value: 2,
        title: "Sim, às vezes",
        message: "Sinto inquietação ou aperto no peito mesmo quando está tudo bem.",
        img: "/img/ilustracoes/pausa.jpg",
        tag: "Ansiedade"
      },
      {
        value: 3,
        title: "Sim, muitas vezes",
        message: "A preocupação constante sem motivo claro tem me acompanhado.",
        img: "/img/ilustracoes/acolhimento.jpg",
        tag: "Atenção"
      }
    ]
  },
  {
    id: 5,
    text: "Nos últimos 7 dias, tenho me sentido com medo ou muito assustada, sem motivo:",
    options: [
      {
        value: 3,
        title: "Sim, muitas vezes",
        message: "Tenho sentido medo repentino ou sensação de pânico com frequência.",
        img: "/img/ilustracoes/acolhimento.jpg",
        tag: "Acolhimento"
      },
      {
        value: 2,
        title: "Sim, às vezes",
        message: "Em alguns momentos o coração acelera e bate um medo sem razão aparente.",
        img: "/img/ilustracoes/pausa.jpg",
        tag: "Sobressalto"
      },
      {
        value: 1,
        title: "Não, raramente",
        message: "Aconteceu muito pouco, quase sem impacto no meu dia.",
        img: "/img/ilustracoes/mae-bebe-tranquilidade.jpg",
        tag: "Raro"
      },
      {
        value: 0,
        title: "Não, nunca",
        message: "Não tenho tido sensações de medo ou susto sem motivo.",
        img: "/img/ilustracoes/florescer.jpg",
        tag: "Estável"
      }
    ]
  },
  {
    id: 6,
    text: "Nos últimos 7 dias, tenho sentido que as coisas são demais para mim:",
    options: [
      {
        value: 3,
        title: "Sim, na maioria das vezes não consigo resolver",
        message: "As tarefas e demandas parecem maiores do que minhas forças agora.",
        img: "/img/ilustracoes/acolhimento.jpg",
        tag: "Exausta"
      },
      {
        value: 2,
        title: "Sim, às vezes não consigo resolver como antes",
        message: "Sinto dificuldade de dar conta do que antes eu resolvia com mais facilidade.",
        img: "/img/ilustracoes/diario.jpg",
        tag: "Sobrecarregada"
      },
      {
        value: 1,
        title: "Não, na maioria das vezes resolvo facilmente",
        message: "Mesmo cansada, consigo organizar o essencial do dia a dia.",
        img: "/img/ilustracoes/rede.jpg",
        tag: "Ritmo possível"
      },
      {
        value: 0,
        title: "Não, resolvo tão bem como antes",
        message: "Tenho conseguido lidar com a rotina no meu ritmo.",
        img: "/img/ilustracoes/roda.jpg",
        tag: "Equilibrada"
      }
    ]
  },
  {
    id: 7,
    text: "Nos últimos 7 dias, tenho me sentido tão infeliz que durmo mal:",
    options: [
      {
        value: 3,
        title: "Sim, quase sempre",
        message: "Mesmo quando o bebê dorme, a angústia não me deixa descansar.",
        img: "/img/ilustracoes/acolhimento.jpg",
        tag: "No limite"
      },
      {
        value: 2,
        title: "Sim, às vezes",
        message: "Em várias noites o peso emocional atrapalha o meu sono.",
        img: "/img/ilustracoes/pausa.jpg",
        tag: "Sono afetado"
      },
      {
        value: 1,
        title: "Raramente",
        message: "Só em uma ou outra noite mais difícil da semana.",
        img: "/img/ilustracoes/mae-bebe-tranquilidade.jpg",
        tag: "Pontual"
      },
      {
        value: 0,
        title: "Não, nunca",
        message: "Quando tenho oportunidade, consigo dormir e descansar.",
        img: "/img/ilustracoes/florescer.jpg",
        tag: "Descanso tranquilo"
      }
    ]
  },
  {
    id: 8,
    text: "Nos últimos 7 dias, tenho me sentido triste ou muito infeliz:",
    options: [
      {
        value: 3,
        title: "Sim, quase sempre",
        message: "Sinto uma tristeza profunda e constante nos últimos dias.",
        img: "/img/ilustracoes/acolhimento.jpg",
        tag: "Tristeza intensa"
      },
      {
        value: 2,
        title: "Sim, muitas vezes",
        message: "O desânimo tem aparecido com frequência ao longo dos dias.",
        img: "/img/ilustracoes/pausa.jpg",
        tag: "Desanimada"
      },
      {
        value: 1,
        title: "Raramente",
        message: "Tive momentos passageiros de tristeza, mas logo passaram.",
        img: "/img/ilustracoes/autocuidado.jpg",
        tag: "Passageiro"
      },
      {
        value: 0,
        title: "Não, nunca",
        message: "Me sinto emocionalmente estável nos últimos dias.",
        img: "/img/ilustracoes/florescer.jpg",
        tag: "Estável"
      }
    ]
  },
  {
    id: 9,
    text: "Nos últimos 7 dias, tenho me sentido tão infeliz que choro:",
    options: [
      {
        value: 3,
        title: "Sim, quase sempre",
        message: "Tenho chorado muito e sinto um peso muito difícil de segurar.",
        img: "/img/ilustracoes/acolhimento.jpg",
        tag: "Choro frequente"
      },
      {
        value: 2,
        title: "Sim, muitas vezes",
        message: "As lágrimas vêm facilmente com a tristeza nos últimos dias.",
        img: "/img/ilustracoes/pausa.jpg",
        tag: "Sensível"
      },
      {
        value: 1,
        title: "Só às vezes",
        message: "Chorei pontualmente pelo cansaço ou emoção do puerpério.",
        img: "/img/ilustracoes/autocuidado.jpg",
        tag: "Desabafo leve"
      },
      {
        value: 0,
        title: "Não, nunca",
        message: "Não tenho chorado por tristeza nos últimos 7 dias.",
        img: "/img/ilustracoes/florescer.jpg",
        tag: "Estável"
      }
    ]
  },
  {
    id: 10,
    text: "Nos últimos 7 dias, tive ideias de fazer mal a mim mesma:",
    options: [
      {
        value: 3,
        title: "Sim, muitas vezes",
        message: "Estou sofrendo muito agora e preciso de ajuda e proteção imediata.",
        img: "/img/ilustracoes/acolhimento.jpg",
        tag: "Apoio imediato"
      },
      {
        value: 2,
        title: "Por vezes",
        message: "Sinto um peso muito difícil de carregar sozinha e preciso de amparo.",
        img: "/img/ilustracoes/rede.jpg",
        tag: "Acolhimento prioritário"
      },
      {
        value: 1,
        title: "Muito raramente",
        message: "Foi um pensamento rápido em um momento de exaustão extrema.",
        img: "/img/ilustracoes/autocuidado.jpg",
        tag: "Preciso de escuta"
      },
      {
        value: 0,
        title: "Nunca",
        message: "Mesmo com o cansaço, não tive pensamentos de me machucar.",
        img: "/img/ilustracoes/florescer.jpg",
        tag: "Segura"
      }
    ]
  }
];

export default function CheckInScreen({ setActiveTab }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [anjoAcionado, setAnjoAcionado] = useState(false);

  const handleAnswer = (questionId, optionValue) => {
    if (isTransitioning) return;
    const updatedAnswers = { ...answers, [questionId]: optionValue };
    setAnswers(updatedAnswers);

    setTimeout(() => {
      if (currentStep < QUIZ_QUESTIONS.length - 1) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
          setIsTransitioning(false);
        }, 200);
      } else {
        setIsProcessing(true);

        // Envia as respostas da Escala de Edimburgo (EPDS) para a API Spring Boot (/api/triagem/check-in)
        (async () => {
          try {
            if (API_BASE) {
              let maeId = null;
              const sessaoRaw = localStorage.getItem('floravel_mae_sessao');
              if (sessaoRaw) {
                maeId = JSON.parse(sessaoRaw)?.id;
              }
              const token = localStorage.getItem('floravel_jwt');
              const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
              if (!maeId) {
                const resMae = await fetch(`${API_BASE}/api/maes/email/mariana.silva@email.com`, {
                  headers: authHeaders,
                });
                if (resMae.ok) {
                  const maeObj = await resMae.json();
                  maeId = maeObj?.id;
                  localStorage.setItem('floravel_mae_sessao', JSON.stringify(maeObj));
                }
              }
              if (maeId) {
                const respostasPayload = Object.entries(updatedAnswers).map(([num, val]) => ({
                  numeroQuestao: Number(num),
                  valorResposta: Number(val),
                }));
                await fetch(`${API_BASE}/api/triagem/check-in`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', ...authHeaders },
                  body: JSON.stringify({ maeId, respostas: respostasPayload }),
                });
              }
            }
          } catch (_) {
            // Fallback offline resiliente
          } finally {
            setTimeout(() => {
              setIsProcessing(false);
              setIsFinished(true);
            }, 900);
          }
        })();
      }
    }, 350);
  };

  const handlePrevious = () => {
    if (currentStep > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsTransitioning(false);
      }, 180);
    }
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

  // Gatilho da Questão #10 da Escala de Edimburgo (EPDS): valor > 0 ativa o Protocolo de Crise Sem Julgamento
  const alertaCriseQuestao10 = (answers[10] || 0) > 0;

  if (isFinished && alertaCriseQuestao10) {
    return (
      <div className="animate-fadeIn font-dmsans min-h-full flex flex-col items-center justify-center max-w-2xl mx-auto py-8 px-4">
        <div className="w-full rounded-3xl bg-[#18221B] text-[#FAF7F2] p-6 sm:p-10 shadow-xl border border-[#294D33]/40 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#294D33] text-[#F4DDE5] flex items-center justify-center shrink-0">
              <HeartHandshake size={26} />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#E8A9BB]">
                Espaço Seguro & Sem Julgamento
              </span>
              <h2 className="text-2xl sm:text-3xl font-fraunces font-bold text-white leading-tight">
                Respire fundo. Você não está sozinha.
              </h2>
            </div>
          </div>

          <p className="text-sm sm:text-base text-stone-200 leading-relaxed">
            Sentir essa dor profunda não faz de você uma mãe ruim. O puerpério e a sobrecarga materna podem ser avassaladores, e esse peso merece acolhimento humano agora mesmo, com total sigilo.
          </p>

          {/* Atalhos de 1 Clique (Zero Fricção) */}
          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#E8A9BB]">
              Canais imediatos de escuta gratuita (1 toque):
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="tel:188"
                className="flex items-center justify-center gap-2.5 bg-[#E8A9BB] hover:bg-[#f0bac9] text-[#18221B] font-bold py-4 px-5 rounded-2xl text-sm transition shadow-md cursor-pointer"
              >
                <PhoneCall size={18} />
                <span>Ligar CVV (188) — 24h Gratuito</span>
              </a>

              <a
                href="https://www.cvv.org.br/chat/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 bg-[#294D33] hover:bg-[#346140] text-white font-bold py-4 px-5 rounded-2xl text-sm border border-white/15 transition cursor-pointer"
              >
                <MessageCircleHeart size={18} />
                <span>Chat Silencioso CVV (Sem falar)</span>
              </a>
            </div>

            <p className="text-[11px] text-stone-300">
              💡 <em>O Chat Silencioso é ideal caso você esteja amamentando no quarto ou com familiares por perto e prefira digitar em silêncio.</em>
            </p>
          </div>

          {/* Recurso Contato de Confiança (Anjo da Guarda) — Privacidade LGPD */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/8 border border-white/15 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F4DDE5] flex items-center gap-1.5">
                <ShieldCheck size={16} /> Rede de Afeto ("Anjo da Guarda")
              </span>
              <span className="text-[10px] text-stone-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                Sigilo LGPD Garantido
              </span>
            </div>
            <p className="text-xs text-stone-200 leading-relaxed">
              Podemos enviar um aviso carinhoso ao seu contato de confiança pedindo um abraço, <strong>sem revelar suas respostas ou qualquer dado do teste</strong>:
            </p>
            {anjoAcionado ? (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200 font-semibold">
                ✓ Mensagem carinhosa enviada: "Olá! Sua pessoa querida está precisando de um abraço e uma mensagem de carinho agora."
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAnjoAcionado(true)}
                className="w-full py-3 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition cursor-pointer"
              >
                Pedir um abraço ao meu Contato de Confiança
              </button>
            )}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 text-xs">
            <a
              href="tel:192"
              className="text-stone-300 hover:text-white underline font-semibold"
            >
              Emergência médica física? Ligar SAMU (192)
            </a>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab('appointments')}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full bg-white text-[#18221B] font-bold hover:bg-stone-100 transition cursor-pointer"
              >
                Falar com Psicóloga Parceira
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="px-4 py-2.5 rounded-full border border-white/20 text-stone-200 hover:bg-white/10 transition cursor-pointer"
              >
                Início
              </button>
            </div>
          </div>
        </div>
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
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed mb-4">
          Qualquer que seja o seu sentir, você não precisa dar conta de tudo sozinha. Separamos rodas de conversa e psicólogas prontas para acolher você.
        </p>
        <p className="text-xs text-stone-500 leading-relaxed mb-8">
          Baseado na Escala de Depressão Pós-Parto de Edimburgo (EPDS — Cox, Holden &amp; Sagovsky, 1987). Esta triagem complementa, mas não substitui, a avaliação clínica profissional.
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

        <div
          key={currentQuestion.id}
          className={`transition-all duration-300 ease-out ${
            isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          }`}
        >
          <h1 className="text-2xl sm:text-3xl font-fraunces font-bold text-stone-900 leading-snug">
            {currentQuestion.text}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Toque no card que melhor representa como você se sente agora:
          </p>
        </div>
      </div>

      {/* GRID VISUAL 2x2 (1 COLUNA COMPACTA NO MOBILE, 2 COLUNAS NO DESKTOP) */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-300 ease-out ${
          isTransitioning ? 'opacity-0 translate-y-3 scale-[0.99]' : 'opacity-100 translate-y-0 scale-100'
        }`}
      >
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
              {/* Fotografia Editorial */}
              <div className="w-28 sm:w-full h-28 sm:h-48 relative shrink-0 overflow-hidden bg-stone-100">
                <img
                  src={option.img}
                  alt={option.title}
                  className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105"
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
