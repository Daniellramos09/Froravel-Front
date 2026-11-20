import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Check, Heart, Smile, Users, Shield, DollarSign, Lock } from 'lucide-react';

export const ONBOARDING_QUESTIONS = [
  {
    id: 'fase',
    title: 'Em que fase da maternidade você está hoje?',
    desc: 'Com base na sua fase, organizamos as rodas de conversa e conteúdos ideais para a sua rotina.',
    icon: <Smile className="text-[#294D33]" size={22} />,
    options: [
      { id: 'pos_parto', label: 'Pós-parto recente (0 a 6 meses)', hint: 'Puerpério intenso, adaptação, sono e amamentação' },
      { id: 'gestante', label: 'Gestante (gravidez em curso)', hint: 'Preparação emocional para o parto e chegada do bebê' },
      { id: 'primeira_infancia', label: 'Primeira infância (1 a 3 anos)', hint: 'Desenvolvimento, retorno ao trabalho e limites' },
      { id: 'tentante', label: 'Tentante ou planejando', hint: 'Ansiedade na espera, perdas gestacionais ou tratamentos' },
      { id: 'atipica_maior', label: 'Maternidade atípica ou filhos maiores', hint: 'Desafios contínuos de cuidado e exaustão' }
    ]
  },
  {
    id: 'desafio',
    title: 'Qual é o seu maior desafio emocional neste momento?',
    desc: 'As terapias em grupo e psicólogas que vão aparecer no seu painel serão filtradas por este tema.',
    icon: <Heart className="text-[#E8A9BB]" size={22} />,
    options: [
      { id: 'depressao_pos_parto', label: 'Depressão pós-parto ou tristeza profunda', hint: 'Sensação de vazio, choro frequente ou perda de energia' },
      { id: 'ansiedade_sono', label: 'Ansiedade constante e privação de sono', hint: 'Preocupação excessiva com o bebê e dificuldade para descansar' },
      { id: 'sobrecarga_burnout', label: 'Sobrecarga mental e exaustão materna', hint: 'Sentimento de carregar tudo sozinha sem pausa' },
      { id: 'solidao_rede', label: 'Solidão e falta de rede de apoio', hint: 'Falta de escuta em casa ou ausência de suporte familiar' },
      { id: 'luto_culpa', label: 'Culpa materna ou luto perinatal', hint: 'Necessidade de acolhimento especializado sem julgamento' }
    ]
  },
  {
    id: 'renda',
    title: 'Qual é a faixa aproximada da sua renda familiar?',
    desc: 'Usamos essa informação para liberar vagas sociais gratuitas ou valores subsidiados.',
    icon: <DollarSign className="text-[#294D33]" size={22} />,
    options: [
      { id: 'ate_1sm', label: 'Até 1 salário mínimo', hint: 'Prioridade no Fundo Solidário Florável (100% gratuito)' },
      { id: '1_a_3sm', label: 'De 1 a 3 salários mínimos', hint: 'Acesso a consultas sociais reduzidas' },
      { id: '3_a_5sm', label: 'De 3 a 5 salários mínimos', hint: 'Valores acessíveis e planos mensais' },
      { id: 'acima_5sm', label: 'Acima de 5 salários mínimos', hint: 'Apoia a manutenção da rede solidária para outras mães' }
    ]
  },
  {
    id: 'investimento',
    title: 'Quanto você está disposta a investir na psicologia?',
    desc: 'Conectamos você apenas a profissionais dentro da sua realidade financeira.',
    icon: <Shield className="text-[#516B55]" size={22} />,
    options: [
      { id: 'gratuito', label: 'Preciso de atendimento gratuito (Bolsa Social)', hint: 'Custeado pelas Flores Solidárias e parceiros' },
      { id: 'ate_50', label: 'Até R$ 50 por consulta', hint: 'Valor social com psicólogas credenciadas' },
      { id: 'plus_80', label: 'Plano Florável Plus (R$ 80/mês)', hint: 'Rodas em grupo ilimitadas + acompanhamento contínuo' },
      { id: 'acima_80', label: 'Acima de R$ 80 por consulta', hint: 'Terapia individual clínica especializada' }
    ]
  },
  {
    id: 'expectativa',
    title: 'O que você mais busca ao entrar na Florável hoje?',
    desc: 'Última pergunta para estruturarmos a sua página inicial sob medida.',
    icon: <Users className="text-[#294D33]" size={22} />,
    options: [
      { id: 'rodas_grupo', label: 'Participar de terapias em grupo (Rodas de Conversa)', hint: 'Conversar por vídeo com outras mães que passam pelo mesmo' },
      { id: 'terapia_individual', label: 'Agendar consulta individual com psicóloga', hint: 'Atendimento particular focado na minha história' },
      { id: 'feed_acolhimento', label: 'Desabafar de forma anônima na comunidade', hint: 'Ler relatos reais e receber apoio seguro' },
      { id: 'exercicios_diario', label: 'Fazer check-in emocional e diário guiado', hint: 'Acompanhar meu humor e ter momentos de pausa' }
    ]
  }
];

export default function OnboardingQuizModal({ isOpen, onClose, onProfileSaved, userName = 'Mariana' }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    fase: 'pos_parto',
    desafio: 'depressao_pos_parto',
    renda: '1_a_3sm',
    investimento: 'plus_80',
    expectativa: 'rodas_grupo'
  });

  if (!isOpen) return null;

  const question = ONBOARDING_QUESTIONS[currentStep];
  const isLast = currentStep === ONBOARDING_QUESTIONS.length - 1;
  const progress = Math.round(((currentStep + 1) / ONBOARDING_QUESTIONS.length) * 100);

  const handleSelectOption = (optionId) => {
    setAnswers(prev => ({ ...prev, [question.id]: optionId }));
  };

  const handleNext = () => {
    if (isLast) {
      const savedData = {
        ...answers,
        concluidoEm: new Date().toISOString()
      };
      localStorage.setItem('floravel_onboarding_profile', JSON.stringify(savedData));
      if (onProfileSaved) onProfileSaved(savedData);
      if (onClose) onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-[#FCF7F9] flex flex-col justify-between overflow-y-auto font-dmsans text-[#2B2829] animate-fadeIn">
      {/* TOPO DA TELA DE PRIMEIRO ACESSO */}
      <header className="w-full max-w-4xl mx-auto px-6 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/img/fotoheader/logo.png" alt="Florável" className="h-9 w-auto object-contain" />
          <span className="text-2xl font-fraunces font-bold text-[#294D33]">florável</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-stone-500">
            Passo {currentStep + 1} de {ONBOARDING_QUESTIONS.length}
          </span>
          {onClose && (
            <button
              type="button"
              onClick={() => {
                const defaultProfile = { ...answers, concluidoEm: new Date().toISOString() };
                localStorage.setItem('floravel_onboarding_profile', JSON.stringify(defaultProfile));
                if (onProfileSaved) onProfileSaved(defaultProfile);
                onClose();
              }}
              className="text-xs font-bold text-stone-400 hover:text-stone-700 underline cursor-pointer"
            >
              Pular por agora
            </button>
          )}
        </div>
      </header>

      {/* CONTEÚDO CENTRAL DO QUESTIONÁRIO */}
      <main className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200/80">
          
          {/* Saudação no passo 1 */}
          {currentStep === 0 && (
            <div className="mb-6 pb-5 border-b border-stone-100 flex items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#294D33] bg-[#F4DDE5]/70 px-3 py-1 rounded-full mb-2">
                  <Sparkles size={13} /> Boas-vindas ao seu espaço, {userName}
                </span>
                <p className="text-xs sm:text-sm text-stone-600">
                  Antes de abrir o seu painel, responda 5 perguntas rápidas para estruturarmos a plataforma de acordo com o que você vive hoje.
                </p>
              </div>
            </div>
          )}

          {/* Barra de Progresso */}
          <div className="w-full bg-stone-100 h-2 rounded-full mb-7 overflow-hidden">
            <div 
              className="bg-[#294D33] h-full transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Pergunta */}
          <div className="flex items-start gap-3.5 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-[#FCF7F9] border border-[#E8A9BB]/50 flex items-center justify-center shrink-0 mt-0.5">
              {question.icon}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-fraunces font-bold text-stone-900 leading-snug">
                {question.title}
              </h1>
              <p className="text-sm text-stone-500 mt-1">
                {question.desc}
              </p>
            </div>
          </div>

          {/* Opções */}
          <div className="mt-6 space-y-3">
            {question.options.map((opt) => {
              const selected = answers[question.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 cursor-pointer ${
                    selected
                      ? 'border-[#294D33] bg-[#FCF7F9] shadow-xs ring-2 ring-[#294D33]/20'
                      : 'border-stone-200 bg-white hover:border-[#E8A9BB] hover:bg-stone-50/70'
                  }`}
                >
                  <div>
                    <p className={`text-[15px] font-bold ${selected ? 'text-[#294D33]' : 'text-stone-800'}`}>
                      {opt.label}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">{opt.hint}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition ${
                    selected ? 'bg-[#294D33] border-[#294D33] text-white' : 'border-stone-300 bg-white'
                  }`}>
                    {selected && <Check size={14} strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Botões de Ação */}
          <div className="mt-8 pt-5 border-t border-stone-100 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="px-5 py-3 rounded-full border border-stone-200 text-stone-600 text-sm font-bold hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft size={16} />
              Anterior
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-8 py-3.5 rounded-full bg-[#294D33] text-white text-sm font-bold hover:bg-[#1f3c27] transition shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>{isLast ? 'Concluir e Ir para o Meu Painel' : 'Próxima pergunta'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </main>

      {/* RODAPÉ DE PRIVACIDADE */}
      <footer className="w-full max-w-4xl mx-auto px-6 py-4 text-center text-xs text-stone-400 flex items-center justify-center gap-1.5">
        <Lock size={12} />
        <span>Suas respostas são confidenciais e protegidas pela LGPD para personalizar seu acolhimento.</span>
      </footer>
    </div>
  );
}
