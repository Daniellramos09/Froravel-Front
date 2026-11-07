// src/Screen/Dashboard/components/BreathingExerciseCard.jsx
// Pausa guiada de 1 minuto (ação principal de cuidado da página inicial).
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const BREATH_PHASES = [
  { name: 'Inspire', instruction: 'Inspire fundo pelo nariz', duration: 4, action: 'expand' },
  { name: 'Segure', instruction: 'Solte os ombros', duration: 4, action: 'hold' },
  { name: 'Expire', instruction: 'Solte o ar devagar pela boca', duration: 4, action: 'contract' },
  { name: 'Repouse', instruction: 'Sinta a calma', duration: 2, action: 'rest' },
];
const CYCLE = BREATH_PHASES.reduce((sum, p) => sum + p.duration, 0);
const TOTAL_SECONDS = 60;

// Fase atual e segundos restantes nela, derivados do tempo decorrido
function phaseAt(elapsed) {
  let t = elapsed % CYCLE;
  for (const phase of BREATH_PHASES) {
    if (t < phase.duration) return { phase, left: phase.duration - t };
    t -= phase.duration;
  }
  return { phase: BREATH_PHASES[0], left: BREATH_PHASES[0].duration };
}

// startSignal: número incrementado pela página quando a mãe pede uma pausa pelo hero.
export default function BreathingExerciseCard({ startSignal = 0 }) {
  const [isActive, setIsActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const sectionRef = useRef(null);
  const startButtonRef = useRef(null);

  const completed = elapsed >= TOTAL_SECONDS;
  const started = elapsed > 0;

  useEffect(() => {
    if (!isActive) return undefined;
    const interval = setInterval(() => {
      setElapsed((prev) => Math.min(prev + 1, TOTAL_SECONDS));
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (completed) setIsActive(false);
  }, [completed]);

  // Pedido vindo do hero: rola até a pausa, foca o controle e começa
  useEffect(() => {
    if (!startSignal) return;
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    startButtonRef.current?.focus({ preventScroll: true });
    setElapsed(0);
    setIsActive(true);
  }, [startSignal]);

  const handleStartPause = () => {
    if (completed) {
      setElapsed(0);
      setIsActive(true);
    } else {
      setIsActive((v) => !v);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setElapsed(0);
  };

  const { phase: currentPhase, left: phaseTimeLeft } = phaseAt(elapsed);
  const totalSecondsLeft = TOTAL_SECONDS - elapsed;

  // Escala do círculo acompanha a respiração
  const circleScale = !isActive
    ? 'scale-100 duration-700'
    : currentPhase.action === 'expand'
      ? 'scale-[1.18] duration-[4000ms] ease-out'
      : currentPhase.action === 'hold'
        ? 'scale-[1.18] duration-500'
        : currentPhase.action === 'contract'
          ? 'scale-[0.88] duration-[4000ms] ease-in-out'
          : 'scale-[0.92] duration-[2000ms]';

  const mm = '0' + Math.floor(totalSecondsLeft / 60);
  const ss = String(totalSecondsLeft % 60).padStart(2, '0');

  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5ECE3]';

  return (
    <section
      ref={sectionRef}
      id="pausa-guiada"
      aria-labelledby="pausa-titulo"
      className="scroll-mt-8 rounded-xl overflow-hidden bg-[#F5ECE3] grid @3xl:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)]"
    >
      <div className="p-7 @xl:p-10 @5xl:p-12 flex flex-col @xl:flex-row gap-8 @xl:gap-12 @xl:items-center">
        {/* Círculo de respiração */}
        <div className="relative w-40 h-40 shrink-0 self-center flex items-center justify-center" aria-hidden="true">
          <div className="absolute inset-0 rounded-full border border-[#294D33]/25" />
          <div
            className={`w-28 h-28 rounded-full bg-[#294D33] text-[#FBF6F2] flex flex-col items-center justify-center transition-transform ${circleScale}`}
          >
            <span className="text-[15px] font-medium">
              {isActive ? currentPhase.name : completed ? 'Pronto' : '1 min'}
            </span>
            {isActive && <span className="text-[13px] tabular-nums opacity-80">{phaseTimeLeft}s</span>}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h2
            id="pausa-titulo"
            className="font-fraunces text-[30px] @5xl:text-[34px] leading-[1.1] tracking-[-0.015em] text-[#1F3A27]"
          >
            Pausa guiada
          </h2>

          {/* Texto que muda com o estado, anunciado para leitores de tela */}
          <p className="mt-3 text-[17px] leading-relaxed text-[#4A5E4D] max-w-[38ch]" aria-live="polite">
            {isActive
              ? `${currentPhase.instruction}.`
              : completed
                ? 'Você fez uma pausa por você. Isso já conta.'
                : started
                  ? 'Pausa interrompida. Continue quando puder.'
                  : 'Um minuto para soltar os ombros e desacelerar.'}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              ref={startButtonRef}
              type="button"
              onClick={handleStartPause}
              className={`inline-flex items-center gap-2 rounded-md bg-[#294D33] px-5 py-3 text-[15px] font-medium text-white hover:bg-[#1F3A27] cursor-pointer ${focusRing}`}
            >
              {isActive ? (
                <><Pause size={17} strokeWidth={1.75} aria-hidden="true" /> Pausar</>
              ) : completed ? (
                <><RotateCcw size={17} strokeWidth={1.75} aria-hidden="true" /> Repetir</>
              ) : started ? (
                <><Play size={17} strokeWidth={1.75} aria-hidden="true" /> Continuar</>
              ) : (
                <><Play size={17} strokeWidth={1.75} aria-hidden="true" /> Começar</>
              )}
            </button>

            {started && (
              <button
                type="button"
                onClick={handleReset}
                className={`rounded-md px-4 py-3 text-[15px] font-medium text-[#294D33] hover:bg-[#294D33]/10 cursor-pointer ${focusRing}`}
              >
                Reiniciar
              </button>
            )}

            {started && !completed && (
              <span className="text-[15px] tabular-nums text-[#4A5E4D]" aria-hidden="true">
                {mm}:{ss}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Ilustração: mãe respirando ao lado do bebê */}
      <div className="hidden @3xl:flex items-end justify-center pt-6 pr-6">
        <img
          src="/img/ilustracoes/pausa.jpg"
          alt=""
          loading="lazy"
          className="w-full max-h-[260px] object-contain object-bottom"
        />
      </div>
    </section>
  );
}
