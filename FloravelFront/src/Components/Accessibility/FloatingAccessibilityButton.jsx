import React, { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useAccessibility } from "./AccessibilityContext";
import AccessibilityModal from "./AccessibilityModal";

// Ícone Universal de Acessibilidade / Cadeirante
function WheelchairIcon({ size = 26, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.3" 
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

export default function FloatingAccessibilityButton() {
  const {
    isModalOpen,
    openAccessibilityModal,
    closeAccessibilityModal,
    isSpeaking,
    stopSpeaking,
    fontScaleIndex,
    colorMode,
    readingGuide,
    reducedMotion
  } = useAccessibility();

  const [isHovered, setIsHovered] = useState(false);

  // Atalho de teclado: Alt + A para abrir/fechar o painel de acessibilidade
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === "a" || e.key === "A")) {
        e.preventDefault();
        if (isModalOpen) {
          closeAccessibilityModal();
        } else {
          openAccessibilityModal();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, openAccessibilityModal, closeAccessibilityModal]);

  // Verifica se há alguma customização ativa
  const hasCustomSettings = fontScaleIndex !== 1 || colorMode !== "default" || readingGuide || reducedMotion;

  return (
    <>
      {/* Botão Circular Flutuante Grande no Canto Inferior Direito */}
      <aside 
        aria-label="Atalho de Acessibilidade Flutuante"
        className="fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8 flex items-center justify-end select-none"
      >
        {/* Tooltip flutuante elegante ao lado esquerdo (no hover/foco em telas médias/grandes) */}
        <div
          className={`hidden sm:flex items-center gap-2 pointer-events-none absolute right-full mr-3.5 px-3.5 py-1.5 rounded-full bg-[#294D33] text-white text-xs font-semibold shadow-xl border border-white/20 transition-all duration-300 transform ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
          }`}
        >
          <span>Acessibilidade</span>
          <kbd className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white/90 font-mono">Alt + A</kbd>
        </div>

        {/* Círculo Grande de Acessibilidade */}
        <button
          type="button"
          onClick={openAccessibilityModal}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          aria-label="Abrir opções de acessibilidade e leitor de tela (Alt + A)"
          aria-haspopup="dialog"
          aria-expanded={isModalOpen}
          className={`group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#294D33] hover:bg-[#1e3c27] text-white flex items-center justify-center border-2 border-white/95 shadow-2xl shadow-[#294D33]/40 hover:shadow-[#294D33]/60 transition-all duration-300 cursor-pointer hover:scale-108 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E8A9BB] ${
            isSpeaking ? "ring-4 ring-[#E8A9BB] animate-pulse" : ""
          }`}
        >
          {/* Anel de ondulação sutil quando o leitor de voz está falando */}
          {isSpeaking && (
            <span 
              className="absolute inset-0 rounded-full bg-[#E8A9BB]/40 animate-ping pointer-events-none" 
              aria-hidden="true"
            />
          )}

          {/* Ícone Universal de Acessibilidade (Cadeirante / Acesso Universal) */}
          <WheelchairIcon 
            size={26} 
            className="text-white transition-transform duration-300 group-hover:scale-110 drop-shadow-xs" 
          />

          {/* Badge de Leitor de Tela Ativo (se estiver falando) */}
          {isSpeaking && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                stopSpeaking();
              }}
              className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-[#E8A9BB] text-[#294D33] border-2 border-white flex items-center justify-center shadow-md animate-bounce"
              title="Leitor de tela ativo. Clique para pausar."
            >
              <Volume2 size={13} strokeWidth={2.5} />
            </span>
          )}

          {/* Badge de Configurações Ativas (Fonte aumentada, modo daltônico, etc.) */}
          {hasCustomSettings && !isSpeaking && (
            <span 
              className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#E8A9BB] border-2 border-white shadow-xs" 
              title="Opções de acessibilidade personalizadas ativas"
              aria-label="Opções ativas"
            />
          )}
        </button>
      </aside>

      {/* Modal Completo de Acessibilidade */}
      <AccessibilityModal 
        isOpen={isModalOpen} 
        onClose={closeAccessibilityModal} 
      />
    </>
  );
}
