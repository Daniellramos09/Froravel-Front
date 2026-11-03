// src/Screen/Dashboard/components/BreathingExerciseCard.jsx
import { useState, useEffect } from 'react';
import { Wind, PlayCircle, Pause, RotateCcw, Heart, Check } from 'lucide-react';

const BREATH_PHASES = [
  { name: 'Inspire', instruction: 'Inspire fundo pelo nariz...', duration: 4, action: 'expand' },
  { name: 'Segure', instruction: 'Solte os ombros...', duration: 4, action: 'hold' },
  { name: 'Expire', instruction: 'Solte o ar devagar pela boca...', duration: 4, action: 'contract' },
  { name: 'Repouse', instruction: 'Sinta a calma...', duration: 2, action: 'rest' }
];

export default function BreathingExerciseCard() {
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(BREATH_PHASES[0].duration);
  const [totalSecondsLeft, setTotalSecondsLeft] = useState(60);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && totalSecondsLeft > 0) {
      interval = setInterval(() => {
        setTotalSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setCompleted(true);
            return 0;
          }
          return prev - 1;
        });

        setPhaseTimeLeft((prev) => {
          if (prev <= 1) {
            setPhaseIndex((currPhase) => {
              const nextPhase = (currPhase + 1) % BREATH_PHASES.length;
              return nextPhase;
            });
            const nextIdx = (phaseIndex + 1) % BREATH_PHASES.length;
            return BREATH_PHASES[nextIdx].duration;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, totalSecondsLeft, phaseIndex]);

  const handleStartPause = () => {
    if (completed) {
      setTotalSecondsLeft(60);
      setPhaseIndex(0);
      setPhaseTimeLeft(BREATH_PHASES[0].duration);
      setCompleted(false);
      setIsActive(true);
    } else {
      setIsActive(!isActive);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setTotalSecondsLeft(60);
    setPhaseIndex(0);
    setPhaseTimeLeft(BREATH_PHASES[0].duration);
    setCompleted(false);
  };

  const currentPhase = BREATH_PHASES[phaseIndex];

  const getScaleClass = () => {
    if (!isActive) return 'scale-100';
    if (currentPhase.action === 'expand') return 'scale-120 transition-transform duration-[4000ms] ease-out';
    if (currentPhase.action === 'hold') return 'scale-120 transition-transform duration-500';
    if (currentPhase.action === 'contract') return 'scale-90 transition-transform duration-[4000ms] ease-in';
    return 'scale-95 transition-transform duration-[2000ms]';
  };

  return (
    <div className="bg-[#294D33] rounded-[32px] p-8 sm:p-10 text-white relative overflow-hidden shadow-md">
      {/* Luzes orgânicas de fundo */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-10 w-64 h-64 bg-[#E8A9BB]/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* TEXTO EM DESTAQUE E CONTROLES */}
        <div className="max-w-xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold tracking-wider uppercase mb-3 text-[#F4DDE5]">
            <Wind size={15} className="text-[#E8A9BB]" />
            Micropausa Guiada
          </div>

          <h3 className="text-3xl sm:text-4xl font-fraunces font-bold mb-3 leading-snug">
            Respire com a gente.
          </h3>

          <p className="text-base sm:text-lg text-white/85 font-medium leading-relaxed mb-6">
            Apenas 1 minuto para relaxar os ombros e desacelerar o coração.
          </p>

          {isActive ? (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-6 border border-white/20 animate-fadeIn">
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-bold text-[#F4DDE5] uppercase tracking-wider text-xs">
                  Fase: {currentPhase.name} ({phaseTimeLeft}s)
                </span>
                <span className="font-mono font-bold text-white bg-black/25 px-2.5 py-1 rounded-full text-xs">
                  00:{totalSecondsLeft < 10 ? `0${totalSecondsLeft}` : totalSecondsLeft}
                </span>
              </div>
              <p className="text-lg font-fraunces text-white italic">
                “{currentPhase.instruction}”
              </p>
            </div>
          ) : completed ? (
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 mb-6 border border-white/20 animate-fadeIn">
              <p className="text-base font-bold text-white flex items-center justify-center lg:justify-start gap-2 mb-1">
                <Check size={18} className="text-[#E8A9BB]" /> Pausa concluída com sucesso!
              </p>
              <p className="text-sm text-white/80">
                Você está fazendo o melhor que pode.
              </p>
            </div>
          ) : null}

          {/* BOTÕES COM TEXTOS GRANDES */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5">
            <button
              type="button"
              onClick={handleStartPause}
              className="bg-white text-[#294D33] hover:bg-[#F4DDE5] px-8 py-3.5 rounded-full text-base font-bold flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            >
              {isActive ? (
                <>
                  <Pause size={19} /> Pausar
                </>
              ) : completed ? (
                <>
                  <RotateCcw size={19} /> Repetir 1 minuto
                </>
              ) : (
                <>
                  <PlayCircle size={20} className="text-[#294D33]" /> Iniciar pausa de 1 min
                </>
              )}
            </button>

            {(isActive || totalSecondsLeft < 60) && (
              <button
                type="button"
                onClick={handleReset}
                className="bg-white/15 hover:bg-white/25 text-white px-5 py-3.5 rounded-full text-sm font-bold transition border border-white/20 cursor-pointer"
              >
                Reiniciar
              </button>
            )}
          </div>
        </div>

        {/* ORB ANIMADO VISÍVEL */}
        <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center shrink-0">
          <div
            className={`absolute inset-0 border border-white/20 rounded-full ${
              isActive ? 'animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]' : ''
            }`}
          />
          <div
            className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex flex-col items-center justify-center shadow-inner ${getScaleClass()}`}
          >
            {isActive ? (
              <>
                <Wind size={30} className="text-[#F4DDE5] animate-pulse mb-1" />
                <span className="text-xs font-bold text-white tracking-wider uppercase">
                  {currentPhase.name}
                </span>
                <span className="text-xs text-white/80 font-mono mt-0.5">
                  {phaseTimeLeft}s
                </span>
              </>
            ) : completed ? (
              <>
                <Heart size={32} className="text-[#E8A9BB] mb-1" />
                <span className="text-xs font-bold text-white">Renovada</span>
              </>
            ) : (
              <>
                <Heart size={32} className="text-white animate-pulse mb-1" />
                <span className="text-xs font-bold text-white/90">60 seg</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
