// src/Components/Accessibility/AccessibilityQuickBar.jsx
import React, { useState } from "react";
import {
  Volume2,
  VolumeX,
  Type,
  Eye,
  Minus,
  Plus,
  SlidersHorizontal,
} from "lucide-react";
import { useAccessibility } from "./AccessibilityContext";

export default function AccessibilityQuickBar({ activeTab, onOpenAccessibilityTab }) {
  const {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    isSpeaking,
    stopSpeaking,
    describeScreen,
  } = useAccessibility();

  const [isOpen, setIsOpen] = useState(false);

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      describeScreen(activeTab);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      {/* Botões diretos no Header para acesso rápido */}
      <div className="flex items-center gap-1.5 bg-stone-100/90 backdrop-blur-md p-1 rounded-2xl border border-stone-200/80 shadow-2xs">
        {/* Botão de Audiodescrição por Voz da Tela Atual */}
        <button
          type="button"
          onClick={handleToggleSpeech}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            isSpeaking
              ? "bg-[#294D33] text-white shadow-xs animate-pulse"
              : "bg-white text-[#294D33] hover:bg-[#F4DDE5] shadow-2xs"
          }`}
          title={isSpeaking ? "Parar leitura" : "Ouvir descrição desta página"}
        >
          {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
          <span className="hidden sm:inline">
            {isSpeaking ? "Parar Voz" : "Ouvir Tela"}
          </span>
        </button>

        {/* Ajuste rápido de tamanho de texto A- e A+ */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={decreaseFontSize}
            className="p-1.5 rounded-lg text-stone-600 hover:bg-white hover:text-[#294D33] transition cursor-pointer"
            title="Diminuir letras (A-)"
          >
            <Minus size={13} />
          </button>
          <span className="text-[11px] font-bold text-[#294D33] px-1 select-none">
            A
          </span>
          <button
            type="button"
            onClick={increaseFontSize}
            className="p-1.5 rounded-lg text-stone-600 hover:bg-white hover:text-[#294D33] transition cursor-pointer"
            title="Aumentar letras (A+)"
          >
            <Plus size={13} />
          </button>
        </div>

        {/* Atalho para Seção Completa de Acessibilidade */}
        {onOpenAccessibilityTab && (
          <button
            type="button"
            onClick={onOpenAccessibilityTab}
            className="p-1.5 rounded-xl text-stone-600 hover:bg-white hover:text-[#294D33] transition cursor-pointer"
            title="Abrir Painel Completo de Acessibilidade"
          >
            <SlidersHorizontal size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

