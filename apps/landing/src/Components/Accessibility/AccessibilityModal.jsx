// src/Components/Accessibility/AccessibilityModal.jsx
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  X, 
  Volume2, 
  VolumeX, 
  Type, 
  Palette, 
  Eye, 
  RotateCcw, 
  MousePointer, 
  Sparkles,
  Check,
  ZapOff
} from "lucide-react";
import { useAccessibility, FONT_SCALES, COLOR_MODES } from "./AccessibilityContext";

// Ícone Universal de Acessibilidade / Cadeirante
function WheelchairIcon({ size = 22, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="4" r="2" />
      <path d="M12 6v7a2 2 0 0 0 2 2h3" />
      <path d="M8 11.5h5" />
      <path d="M17 15a4.5 4.5 0 1 1-8.5-2" />
    </svg>
  );
}

export default function AccessibilityModal({ isOpen, onClose }) {
  const {
    fontScaleIndex,
    fontScaleText,
    increaseFontSize,
    decreaseFontSize,
    setFontScaleIndex,
    colorMode,
    setColorMode,
    readingGuide,
    setReadingGuide,
    reducedMotion,
    setReducedMotion,
    isSpeaking,
    readPageOverview,
    readSelectedText,
    stopSpeaking,
    resetAllAccessibility,
  } = useAccessibility();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/45 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-[#FCF7F9] rounded-[32px] p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-[#E8A9BB]/50 font-sans max-h-[90vh] overflow-y-auto relative animate-scaleUp text-[#2B2829]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* BOTÃO FECHAR */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white border border-[#E8A9BB]/40 text-stone-600 hover:bg-[#F4DDE5] hover:text-[#294D33] flex items-center justify-center transition cursor-pointer shadow-xs"
          aria-label="Fechar painel de acessibilidade"
        >
          <X size={20} />
        </button>

        {/* CABEÇALHO COM IDENTIDADE FLORÁVEL */}
        <div className="flex items-center gap-3.5 mb-6 pr-10">
          <div className="w-12 h-12 rounded-2xl bg-[#F4DDE5] text-[#294D33] flex items-center justify-center shrink-0 border border-[#E8A9BB]/40 shadow-xs">
            <WheelchairIcon size={24} className="text-[#294D33]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EBF3ED] text-[#294D33] text-[11px] font-bold uppercase tracking-wider mb-1">
              <Sparkles size={12} className="text-[#516B55]" />
              Inclusão & Cuidado Universal
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#294D33] leading-tight">
              Acessibilidade Florável
            </h2>
          </div>
        </div>

        <div className="space-y-6">

          {/* 1. AUDIODESCRIÇÃO & LEITOR DE TELA (DESTAQUE PARA DEFICIÊNCIA VISUAL) */}
          <div className="bg-white rounded-2xl p-5 border border-[#E8A9BB]/30 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Volume2 size={20} className="text-[#294D33]" />
                <h3 className="text-base font-bold text-[#294D33]">
                  Leitor de Voz & Audiodescrição
                </h3>
              </div>
              {isSpeaking && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EBF3ED] text-[#294D33] text-xs font-bold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-[#294D33]"></span>
                  Reproduzindo áudio...
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-stone-600 mb-4 leading-relaxed">
              Desenvolvido para pessoas cegas, com baixa visão ou fadiga ocular pós-parto. Ouça o resumo falado do site ou selecione qualquer trecho.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={readPageOverview}
                className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-xs ${
                  isSpeaking
                    ? "bg-[#294D33] text-white hover:bg-[#1f3b26]"
                    : "bg-[#F4DDE5] text-[#294D33] hover:bg-[#ebd0da] border border-[#E8A9BB]/40"
                }`}
              >
                {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
                <span>{isSpeaking ? "Parar Leitura de Voz" : "Ouvir Resumo da Página"}</span>
              </button>

              <button
                type="button"
                onClick={readSelectedText}
                className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <MousePointer size={16} />
                <span>Ouvir Texto Selecionado</span>
              </button>
            </div>
          </div>

          {/* 2. TAMANHO DAS LETRAS (AUMENTAR OU DIMINUIR FONTE) */}
          <div className="bg-white rounded-2xl p-5 border border-[#E8A9BB]/30 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Type size={20} className="text-[#294D33]" />
                <h3 className="text-base font-bold text-[#294D33]">
                  Tamanho das Letras
                </h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#F4DDE5] text-[#294D33]">
                Escala Atual: {fontScaleText}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 mb-4">
              Ajuste todo o conteúdo do site para leitura mais nítida e confortável.
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={decreaseFontSize}
                disabled={fontScaleIndex === 0}
                className="flex-1 py-3 px-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white text-stone-800 font-bold text-sm transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <span className="text-lg">A-</span>
                <span className="text-xs font-normal">Diminuir</span>
              </button>

              <div className="flex gap-1.5">
                {FONT_SCALES.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFontScaleIndex(idx)}
                    className={`w-9 h-11 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      fontScaleIndex === idx
                        ? "bg-[#294D33] text-white border-[#294D33] shadow-xs scale-105"
                        : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-white"
                    }`}
                  >
                    {item.text.replace("%", "")}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={increaseFontSize}
                disabled={fontScaleIndex === FONT_SCALES.length - 1}
                className="flex-1 py-3 px-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white text-stone-800 font-bold text-sm transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <span className="text-lg">A+</span>
                <span className="text-xs font-normal">Aumentar</span>
              </button>
            </div>
          </div>

          {/* 3. CORES E FILTROS PARA DALTONISMO */}
          <div className="bg-white rounded-2xl p-5 border border-[#E8A9BB]/30 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Palette size={20} className="text-[#294D33]" />
              <h3 className="text-base font-bold text-[#294D33]">
                Filtros de Cor para Daltonismo
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mb-4">
              Calibração das tonalidades para diferenciar botões, textos e gráficos com precisão.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {Object.values(COLOR_MODES).map((mode) => {
                const isSelected = colorMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setColorMode(mode.id)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer relative ${
                      isSelected
                        ? "border-[#294D33] bg-[#EBF3ED] shadow-2xs"
                        : "border-stone-200 bg-stone-50/60 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#294D33]">{mode.label}</span>
                      {isSelected && <Check size={14} className="text-[#294D33]" />}
                    </div>
                    <p className="text-[11px] text-stone-500 leading-tight">
                      {mode.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. RECURSOS ADICIONAIS: RÉGUA DE LEITURA & ANIMAÇÕES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setReadingGuide(!readingGuide)}
              className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
                readingGuide 
                  ? "bg-[#F4DDE5] border-[#E8A9BB] text-[#294D33]" 
                  : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
              }`}
            >
              <div>
                <p className="text-xs font-bold">Régua de Leitura Visual</p>
                <p className="text-[11px] text-stone-500">Linha guia de foco que acompanha a leitura</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${readingGuide ? "bg-[#294D33] text-white" : "bg-stone-100 text-stone-600"}`}>
                {readingGuide ? "Ligada" : "Desligada"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
                reducedMotion 
                  ? "bg-[#F4DDE5] border-[#E8A9BB] text-[#294D33]" 
                  : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
              }`}
            >
              <div>
                <p className="text-xs font-bold">Reduzir Animações</p>
                <p className="text-[11px] text-stone-500">Para sensibilidade a movimento e labirinto</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${reducedMotion ? "bg-[#294D33] text-white" : "bg-stone-100 text-stone-600"}`}>
                {reducedMotion ? "Ativa" : "Desativada"}
              </span>
            </button>
          </div>

          {/* RODAPÉ DO MODAL: RESET & CONFIRMAÇÃO */}
          <div className="pt-4 border-t border-[#E8A9BB]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={resetAllAccessibility}
              className="w-full sm:w-auto px-4 py-2.5 rounded-full border border-stone-200 text-stone-600 hover:text-stone-900 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer hover:bg-white"
            >
              <RotateCcw size={14} />
              <span>Restaurar Padrão</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#294D33] hover:bg-[#1f3c27] text-white text-xs font-bold uppercase tracking-wider transition shadow-md cursor-pointer"
            >
              Salvar e Fechar
            </button>
          </div>

        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

