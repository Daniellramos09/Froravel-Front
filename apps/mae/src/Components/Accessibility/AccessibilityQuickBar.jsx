// src/Components/Accessibility/AccessibilityQuickBar.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  Volume2,
  VolumeX,
  Minus,
  Plus,
  SlidersHorizontal,
  Eye,
  X,
} from "lucide-react";
import { useAccessibility, FONT_SIZES, COLOR_MODES } from "./AccessibilityContext";

export default function AccessibilityQuickBar({ activeTab, onOpenAccessibilityTab }) {
  const {
    fontSize,
    setFontSize,
    increaseFontSize,
    decreaseFontSize,
    colorMode,
    setColorMode,
    expandedSpacing,
    setExpandedSpacing,
    reducedMotion,
    setReducedMotion,
    isSpeaking,
    toggleScreenNarration,
  } = useAccessibility();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleToggleSpeech = () => {
    toggleScreenNarration(activeTab);
  };

  const currentLabel = FONT_SIZES[fontSize]?.label || "Grande";

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      {/* Barra compacta no topo para acesso rápido */}
      <div className="flex items-center gap-1.5 bg-stone-100/90 backdrop-blur-md p-1 rounded-2xl border border-stone-200/80 shadow-2xs">
        {/* Botão de Audiodescrição por Voz da Tela Atual */}
        <button
          type="button"
          onClick={handleToggleSpeech}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            isSpeaking
              ? "bg-[#294D33] text-white shadow-xs animate-pulse ring-2 ring-[#294D33]/30"
              : "bg-white text-[#294D33] hover:bg-[#F4DDE5] shadow-2xs"
          }`}
          title={isSpeaking ? "Parar narração da tela" : "Ouvir audiodescrição desta tela"}
          aria-label={isSpeaking ? "Parar narração da tela" : "Ouvir audiodescrição desta tela"}
        >
          {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
          <span className="hidden sm:inline">
            {isSpeaking ? "Parar Voz" : "Ouvir Tela"}
          </span>
        </button>

        {/* Ajuste rápido de tamanho de texto e legenda: - A + */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={decreaseFontSize}
            className="p-1.5 rounded-lg text-stone-600 hover:bg-white hover:text-[#294D33] transition cursor-pointer"
            title={`Diminuir tamanho da letra (Atual: ${currentLabel})`}
            aria-label="Diminuir tamanho da letra"
          >
            <Minus size={13} />
          </button>

          <span
            className="text-[11px] font-bold text-[#294D33] px-1 select-none"
            title={`Tamanho atual: ${currentLabel}`}
          >
            A
          </span>

          <button
            type="button"
            onClick={increaseFontSize}
            className="p-1.5 rounded-lg text-stone-600 hover:bg-white hover:text-[#294D33] transition cursor-pointer"
            title={`Aumentar tamanho da letra (Atual: ${currentLabel})`}
            aria-label="Aumentar tamanho da letra"
          >
            <Plus size={13} />
          </button>
        </div>

        {/* Botão de Ajustes Rápidos de Acessibilidade */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          className={`p-1.5 rounded-xl transition cursor-pointer ${
            isMenuOpen
              ? "bg-[#294D33] text-white"
              : "text-stone-600 hover:bg-white hover:text-[#294D33]"
          }`}
          title="Ajustes rápidos de acessibilidade"
          aria-label="Ajustes rápidos de acessibilidade"
        >
          <SlidersHorizontal size={14} />
        </button>
      </div>

      {/* Popover de Ajustes Rápidos */}
      {isMenuOpen && (
        <div className="fixed left-3 right-3 sm:absolute sm:left-auto sm:right-0 top-18 sm:top-full mt-2 sm:w-80 max-w-sm sm:max-w-none mx-auto sm:mx-0 bg-white rounded-2xl p-4 shadow-2xl border border-stone-100 z-50 animate-fadeIn font-dmsans text-[#2B2829] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <span className="font-bold text-sm text-[#294D33] flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              Ajustes Rápidos
            </span>
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              aria-label="Fechar ajustes"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tamanho da Fonte */}
          <div>
            <p className="text-xs font-bold text-stone-700 mb-2">Tamanho da letra ({currentLabel})</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.values(FONT_SIZES).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFontSize(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                    fontSize === f.id
                      ? "bg-[#294D33] text-white border-[#294D33]"
                      : "bg-[#FCF7F9] text-stone-700 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  {f.zoom}%
                </button>
              ))}
            </div>
          </div>

          {/* Modo de Cor */}
          <div>
            <p className="text-xs font-bold text-stone-700 mb-2">Modo de cor e contraste</p>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.values(COLOR_MODES).map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setColorMode(mode.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left border transition cursor-pointer truncate ${
                    colorMode === mode.id
                      ? "bg-[#294D33] text-white border-[#294D33]"
                      : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                  }`}
                  title={mode.label}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles rápidos */}
          <div className="space-y-2 pt-1 border-t border-stone-100 text-xs">
            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="font-semibold text-stone-700">Espaçamento ampliado</span>
              <input
                type="checkbox"
                checked={expandedSpacing}
                onChange={(e) => setExpandedSpacing(e.target.checked)}
                className="w-4 h-4 accent-[#294D33] cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="font-semibold text-stone-700">Reduzir animações</span>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="w-4 h-4 accent-[#294D33] cursor-pointer"
              />
            </label>
          </div>

          {onOpenAccessibilityTab && (
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                onOpenAccessibilityTab();
              }}
              className="w-full py-2 px-3 rounded-xl bg-[#F4DDE5] hover:bg-[#E8A9BB]/50 text-[#294D33] text-xs font-bold transition cursor-pointer text-center"
            >
              Abrir Painel Completo de Acessibilidade
            </button>
          )}
        </div>
      )}
    </div>
  );
}
