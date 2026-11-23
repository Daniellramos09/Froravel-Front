// src/Screen/Accessibility/AcessibilidadeScreen.jsx
import React from "react";
import {
  Volume2,
  VolumeX,
  Type,
  Eye,
  Sliders,
  Check,
  RotateCcw,
  Palette,
  Minus,
  Plus,
} from "lucide-react";
import {
  useAccessibility,
  FONT_SIZES,
  COLOR_MODES,
} from "../../Components/Accessibility/AccessibilityContext";

export default function AcessibilidadeScreen() {
  const {
    fontSize,
    setFontSize,
    increaseFontSize,
    decreaseFontSize,
    colorMode,
    setColorMode,
    reducedMotion,
    setReducedMotion,
    expandedSpacing,
    setExpandedSpacing,
    isSpeaking,
    speakText,
    stopSpeaking,
    resetAllAccessibility,
  } = useAccessibility();

  const handleTestSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(
        "Olá! Você está no painel de acessibilidade do Florável. Aqui você pode ajustar o tamanho dos textos, escolher esquemas de cores para diferentes tipos de daltonismo, ativar audiodescrição e configurar opções para uma leitura mais confortável e acolhedora."
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 font-dmsans animate-fadeIn">
      {/* Cabeçalho seguindo exatamente o padrão da tela de Denúncias */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 text-[#1F3A27]">
            <Eye size={22} aria-hidden="true" />
            <h1 className="text-2xl sm:text-3xl font-fraunces font-normal text-[#1F3A27]">
              Acessibilidade e Inclusão
            </h1>
          </div>
          <p className="text-sm text-[#4A5E4D] leading-relaxed max-w-2xl">
            Ajuste o tamanho das letras, os filtros de cor e a leitura em voz alta para navegar com conforto e clareza em toda a plataforma.
          </p>
        </div>

        <button
          onClick={resetAllAccessibility}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E4DAD5] bg-white text-[#1F3A27] hover:bg-[#FCF7F9] text-xs font-bold transition self-start sm:self-auto cursor-pointer shrink-0"
        >
          <RotateCcw size={14} />
          <span>Restaurar Padrão</span>
        </button>
      </header>

      {/* 1. Audiodescrição da Tela */}
      <section className="bg-white rounded-xl border border-[#E4DAD5] p-5 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-fraunces font-normal text-[#1F3A27] flex items-center gap-2">
              <Volume2 size={18} className="text-[#294D33]" />
              <span>Ouvir a página em voz alta</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#4A5E4D] leading-relaxed max-w-2xl">
              Ideal para baixa visão ou vista cansada. O Florável lê o conteúdo da tela para você.
            </p>
          </div>

          <button
            type="button"
            onClick={handleTestSpeech}
            className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer shrink-0 ${
              isSpeaking
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-[#294D33] hover:bg-[#1F3A27] text-white"
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX size={16} />
                <span>Parar Leitura em Voz</span>
              </>
            ) : (
              <>
                <Volume2 size={16} />
                <span>Ouvir Exemplo de Leitura</span>
              </>
            )}
          </button>
        </div>

        {isSpeaking && (
          <div className="pt-3 border-t border-[#E4DAD5] flex items-center gap-2.5 text-xs font-semibold text-[#1F3A27]">
            <span className="w-2 h-2 rounded-full bg-[#294D33] animate-ping" />
            <span>Lendo em voz alta com ritmo acolhedor...</span>
          </div>
        )}
      </section>

      {/* 2. Tamanho das Letras */}
      <section className="bg-white rounded-xl border border-[#E4DAD5] p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-fraunces font-normal text-[#1F3A27] flex items-center gap-2">
              <Type size={18} className="text-[#294D33]" />
              <span>Tamanho do Texto</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Ajuste para enxergar com clareza sem forçar a visão.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#FCF7F9] border border-[#E4DAD5] p-1 rounded-lg self-start sm:self-auto">
            <button
              type="button"
              onClick={decreaseFontSize}
              className="p-2 rounded-md bg-white hover:bg-[#F1E6E1] text-[#1F3A27] border border-[#E4DAD5] transition cursor-pointer"
              title="Diminuir texto"
            >
              <Minus size={15} />
            </button>
            <span className="px-3 text-xs font-bold text-[#1F3A27]">Ajuste Rápido</span>
            <button
              type="button"
              onClick={increaseFontSize}
              className="p-2 rounded-md bg-white hover:bg-[#F1E6E1] text-[#1F3A27] border border-[#E4DAD5] transition cursor-pointer"
              title="Aumentar texto"
            >
              <Plus size={15} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.values(FONT_SIZES).map((level) => {
            const isSelected = fontSize === level.id;
            return (
              <button
                key={level.id}
                type="button"
                onClick={() => setFontSize(level.id)}
                className={`p-3.5 rounded-lg border text-center transition cursor-pointer ${
                  isSelected
                    ? "bg-[#294D33] text-white border-[#294D33]"
                    : "bg-[#FCF7F9] text-[#1F3A27] border-[#E4DAD5] hover:bg-[#F1E6E1]/60"
                }`}
              >
                <div className="text-xl font-fraunces font-normal mb-0.5">Aa</div>
                <div className="text-xs font-bold">{level.label}</div>
              </button>
            );
          })}
        </div>

        <div className="bg-[#FCF7F9] p-4 rounded-lg border border-[#E4DAD5]">
          <span className="text-[11px] font-bold text-[#4A5E4D] uppercase tracking-wider block mb-1">
            Pré-visualização do texto
          </span>
          <p className="font-fraunces font-normal text-base text-[#1F3A27] leading-snug">
            “Cuidar de você é o primeiro passo para acolher o seu bebê.”
          </p>
        </div>
      </section>

      {/* 3. Modos de Cor e Daltonismo */}
      <section className="bg-white rounded-xl border border-[#E4DAD5] p-5 sm:p-6 space-y-5">
        <div>
          <h2 className="text-lg font-fraunces font-normal text-[#1F3A27] flex items-center gap-2">
            <Palette size={18} className="text-[#294D33]" />
            <span>Percepção de Cores & Daltonismo</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Filtros calibrados para diferentes tipos de percepção visual e alto contraste.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.values(COLOR_MODES).map((mode) => {
            const isSelected = colorMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setColorMode(mode.id)}
                className={`p-4 rounded-lg border text-left transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "border-[#294D33] bg-[#F1E6E1]/50"
                    : "border-[#E4DAD5] bg-[#FCF7F9] hover:bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${mode.badgeColor}`}
                    >
                      {mode.label}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[#294D33] text-white flex items-center justify-center">
                        <Check size={12} />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#4A5E4D] leading-relaxed">
                    {mode.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Ajustes Extras de Leitura */}
      <section className="bg-white rounded-xl border border-[#E4DAD5] p-5 sm:p-6 space-y-4">
        <div>
          <h2 className="text-lg font-fraunces font-normal text-[#1F3A27] flex items-center gap-2">
            <Sliders size={18} className="text-[#294D33]" />
            <span>Ajustes Extras de Leitura</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setExpandedSpacing(!expandedSpacing)}
            className={`p-4 rounded-lg border text-left transition cursor-pointer flex items-center justify-between gap-4 ${
              expandedSpacing
                ? "bg-[#F1E6E1]/50 border-[#294D33]"
                : "bg-[#FCF7F9] border-[#E4DAD5] hover:bg-white"
            }`}
          >
            <div>
              <h3 className="text-sm font-bold text-[#1F3A27]">
                Espaçamento de Linhas Expandido
              </h3>
              <p className="text-xs text-[#4A5E4D] mt-0.5">
                Aumenta a distância entre linhas e palavras para facilitar a leitura.
              </p>
            </div>
            <div
              className={`w-11 h-6 rounded-full transition-colors flex items-center p-1 shrink-0 ${
                expandedSpacing ? "bg-[#294D33] justify-end" : "bg-stone-300 justify-start"
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setReducedMotion(!reducedMotion)}
            className={`p-4 rounded-lg border text-left transition cursor-pointer flex items-center justify-between gap-4 ${
              reducedMotion
                ? "bg-[#F1E6E1]/50 border-[#294D33]"
                : "bg-[#FCF7F9] border-[#E4DAD5] hover:bg-white"
            }`}
          >
            <div>
              <h3 className="text-sm font-bold text-[#1F3A27]">
                Redução de Movimentos
              </h3>
              <p className="text-xs text-[#4A5E4D] mt-0.5">
                Desativa animações e transições rápidas para evitar desconforto.
              </p>
            </div>
            <div
              className={`w-11 h-6 rounded-full transition-colors flex items-center p-1 shrink-0 ${
                reducedMotion ? "bg-[#294D33] justify-end" : "bg-stone-300 justify-start"
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}
