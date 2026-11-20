// src/Components/Accessibility/LiveCaptionBar.jsx
import React from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  X,
  Minus,
  Plus,
  Type,
} from "lucide-react";
import { useAccessibility } from "./AccessibilityContext";

export default function LiveCaptionBar() {
  const {
    isSpeaking,
    isPaused,
    speechProgressText,
    pauseSpeaking,
    resumeSpeaking,
    stopSpeaking,
    captionSize,
    increaseCaptionSize,
    decreaseCaptionSize,
    getCaptionFontSizeClass,
  } = useAccessibility();

  if (!isSpeaking && !speechProgressText) return null;

  return (
    <div
      role="region"
      aria-label="Legenda de audiodescrição por voz"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-xl z-50 animate-scaleUp pointer-events-auto"
    >
      <div className="bg-white/95 backdrop-blur-md border border-[#294D33]/20 rounded-2xl shadow-2xl p-4 sm:p-5 text-[#2B2829] font-dmsans">
        {/* CABEÇALHO DO CONTROLE DA LEGENDA */}
        <div className="flex items-center justify-between gap-3 pb-2.5 mb-2.5 border-b border-stone-100">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6E9473] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#294D33]"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#294D33] truncate">
              {isPaused ? "Audiodescrição Pausada" : "Ouvindo Tela"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Controle de Tamanho da Legenda: - A + */}
            <div className="flex items-center gap-0.5 bg-stone-100 rounded-lg p-0.5 border border-stone-200/80 mr-1">
              <button
                type="button"
                onClick={decreaseCaptionSize}
                className="p-1 rounded text-stone-600 hover:bg-white hover:text-[#294D33] transition cursor-pointer"
                title="Diminuir tamanho da legenda"
                aria-label="Diminuir tamanho da legenda"
              >
                <Minus size={12} />
              </button>
              <span className="text-[10px] font-bold text-[#294D33] px-1 select-none flex items-center gap-0.5">
                <Type size={11} />
              </span>
              <button
                type="button"
                onClick={increaseCaptionSize}
                className="p-1 rounded text-stone-600 hover:bg-white hover:text-[#294D33] transition cursor-pointer"
                title="Aumentar tamanho da legenda"
                aria-label="Aumentar tamanho da legenda"
              >
                <Plus size={12} />
              </button>
            </div>

            {/* Pausar / Retomar */}
            <button
              type="button"
              onClick={isPaused ? resumeSpeaking : pauseSpeaking}
              className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-[#294D33] transition cursor-pointer"
              title={isPaused ? "Retomar áudio" : "Pausar áudio"}
              aria-label={isPaused ? "Retomar áudio" : "Pausar áudio"}
            >
              {isPaused ? <Play size={14} /> : <Pause size={14} />}
            </button>

            {/* Fechar / Parar */}
            <button
              type="button"
              onClick={stopSpeaking}
              className="p-1.5 rounded-lg bg-stone-100 hover:bg-red-50 hover:text-red-600 text-stone-500 transition cursor-pointer"
              title="Parar e fechar legenda"
              aria-label="Parar e fechar legenda"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* TEXTO DA LEGENDA EM TEMPO REAL COM TAMANHO AJUSTÁVEL */}
        <p
          className={`${getCaptionFontSizeClass()} leading-relaxed text-[#2B2829] font-medium transition-all duration-200`}
        >
          {speechProgressText}
        </p>

        <div className="flex items-center justify-between text-[11px] text-stone-400 mt-2.5 pt-2 border-t border-stone-50">
          <span>Síntese de voz em português (pt-BR)</span>
          <span className="text-[10px] uppercase font-bold text-[#6E9473]">
            Tamanho da legenda: {captionSize}
          </span>
        </div>
      </div>
    </div>
  );
}
