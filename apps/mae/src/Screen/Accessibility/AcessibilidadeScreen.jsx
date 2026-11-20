// src/Screen/Accessibility/AcessibilidadeScreen.jsx
import React from "react";
import {
  Volume2,
  VolumeX,
  Type,
  Eye,
  Sparkles,
  Sliders,
  Check,
  RotateCcw,
  Sun,
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
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn pb-20">
      {/* 1. CABEÇALHO DA SEÇÃO */}
      <section className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF3ED] text-[#294D33] text-xs font-bold uppercase tracking-wider mb-2">
            <Eye size={15} />
            Inclusão e Acessibilidade
          </div>
          <h1 className="text-3xl sm:text-4xl font-fraunces font-bold text-[#2B2829] leading-tight">
            Acessibilidade Florável
          </h1>
          <p className="text-base sm:text-lg text-stone-600 mt-1 max-w-xl">
            Ajuste letras, cores e áudio para uma navegação rápida, confortável e acolhedora.
          </p>
        </div>

        <button
          onClick={resetAllAccessibility}
          type="button"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-sm font-bold transition self-start md:self-auto cursor-pointer"
        >
          <RotateCcw size={16} />
          <span>Restaurar Padrão</span>
        </button>
      </section>

      {/* 2. DESTAQUE: AUDIODESCRIÇÃO DA TELA (LEITOR DE VOZ) */}
      <section className="bg-[#294D33] text-white rounded-3xl p-8 sm:p-10 shadow-md relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F4DDE5] text-xs font-bold uppercase tracking-wider">
              <Volume2 size={15} />
              Audiodescrição Inteligente
            </div>
            <h2 className="text-2xl sm:text-3xl font-fraunces font-bold leading-snug">
              Ouvir a página em voz alta
            </h2>
            <p className="text-base text-white/80 leading-relaxed">
              Ideal para quem tem baixa visão ou vista cansada. O Florável lê o conteúdo e botões para você.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={handleTestSpeech}
              className={`w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold flex items-center justify-center gap-3 transition-all shadow-md cursor-pointer ${
                isSpeaking
                  ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                  : "bg-white text-[#294D33] hover:bg-[#F4DDE5] hover:scale-105 active:scale-95"
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX size={20} />
                  <span>Parar Leitura em Voz</span>
                </>
              ) : (
                <>
                  <Volume2 size={20} />
                  <span>Ouvir Exemplo de Leitura</span>
                </>
              )}
            </button>
          </div>
        </div>

        {isSpeaking && (
          <div className="mt-6 pt-4 border-t border-white/15 flex items-center gap-3 text-sm text-[#F4DDE5] animate-fadeIn">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E8A9BB] animate-ping" />
            <span>Lendo em voz alta com ritmo acolhedor...</span>
          </div>
        )}
      </section>

      {/* 3. TAMANHO DAS LETRAS (TIPOGRAFIA AMPLIADA) */}
      <section className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-100 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#294D33] mb-1">
              <Type size={16} />
              Tamanho do Texto
            </div>
            <h2 className="text-2xl font-fraunces font-bold text-[#2B2829]">
              Letras Maiores para Leitura Rápida
            </h2>
            <p className="text-sm text-stone-500">
              Ajuste para enxergar com clareza sem forçar a visão.
            </p>
          </div>

          {/* Botões A- e A+ rápidos */}
          <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl self-start sm:self-auto">
            <button
              type="button"
              onClick={decreaseFontSize}
              className="p-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 shadow-xs transition cursor-pointer"
              title="Diminuir texto"
            >
              <Minus size={18} />
            </button>
            <span className="px-3 text-sm font-bold text-[#294D33]">Ajuste Rápido</span>
            <button
              type="button"
              onClick={increaseFontSize}
              className="p-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 shadow-xs transition cursor-pointer"
              title="Aumentar texto"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Seleção de Níveis de Fonte */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.values(FONT_SIZES).map((level) => {
            const isSelected = fontSize === level.id;
            return (
              <button
                key={level.id}
                type="button"
                onClick={() => setFontSize(level.id)}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#294D33] text-white border-[#294D33] shadow-md scale-102"
                    : "bg-[#FCF7F9] text-stone-700 border-stone-200 hover:border-[#294D33]/40"
                }`}
              >
                <div className="text-2xl font-bold mb-1">Aa</div>
                <div className="text-sm font-bold">{level.label}</div>
              </button>
            );
          })}
        </div>

        {/* Caixa de Amostra Visual em Tempo Real */}
        <div className="bg-[#FCF7F9] p-6 rounded-2xl border border-stone-200/80">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-2">
            Pré-visualização do texto
          </span>
          <p className="font-fraunces font-bold text-[#2B2829] leading-snug">
            “Cuidar de você é o primeiro passo para acolher o seu bebê.”
          </p>
        </div>
      </section>

      {/* 4. MODOS DE COR E DALTONISMO */}
      <section className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-100 shadow-xs space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#294D33] mb-1">
            <Palette size={16} />
            Percepção de Cores & Daltonismo
          </div>
          <h2 className="text-2xl font-fraunces font-bold text-[#2B2829]">
            Esquemas de Cores Adaptados
          </h2>
          <p className="text-sm text-stone-500">
            Filtros calibrados para diferentes tipos de percepção visual e alto contraste.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(COLOR_MODES).map((mode) => {
            const isSelected = colorMode === mode.id;
            return (
              <div
                key={mode.id}
                onClick={() => setColorMode(mode.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "border-[#294D33] ring-2 ring-[#294D33]/20 bg-[#EBF3ED]/30 shadow-xs"
                    : "border-stone-200 bg-white hover:border-[#294D33]/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${mode.badgeColor}`}
                    >
                      {mode.label}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[#294D33] text-white flex items-center justify-center text-xs">
                        <Check size={12} />
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                    {mode.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. OUTROS TIPOS DE ACESSIBILIDADE */}
      <section className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-100 shadow-xs space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#294D33] mb-1">
            <Sliders size={16} />
            Conforto Adicional
          </div>
          <h2 className="text-2xl font-fraunces font-bold text-[#2B2829]">
            Ajustes Extras de Leitura
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Alternador 1: Espaçamento de leitura */}
          <div
            onClick={() => setExpandedSpacing(!expandedSpacing)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              expandedSpacing
                ? "bg-[#EBF3ED]/40 border-[#294D33]"
                : "bg-white border-stone-200 hover:bg-stone-50"
            }`}
          >
            <div>
              <h3 className="text-base font-bold text-[#2B2829]">
                Espaçamento de Linhas Expandido
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Aumenta a distância entre linhas e palavras para facilitar a leitura.
              </p>
            </div>
            <div
              className={`w-12 h-6 rounded-full transition-colors flex items-center p-1 shrink-0 ${
                expandedSpacing ? "bg-[#294D33] justify-end" : "bg-stone-300 justify-start"
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </div>
          </div>

          {/* Alternador 2: Redução de movimento */}
          <div
            onClick={() => setReducedMotion(!reducedMotion)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              reducedMotion
                ? "bg-[#EBF3ED]/40 border-[#294D33]"
                : "bg-white border-stone-200 hover:bg-stone-50"
            }`}
          >
            <div>
              <h3 className="text-base font-bold text-[#2B2829]">
                Redução de Movimentos
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Desativa animações e transições rápidas para evitar desconforto.
              </p>
            </div>
            <div
              className={`w-12 h-6 rounded-full transition-colors flex items-center p-1 shrink-0 ${
                reducedMotion ? "bg-[#294D33] justify-end" : "bg-stone-300 justify-start"
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

