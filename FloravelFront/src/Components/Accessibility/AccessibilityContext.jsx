// src/Components/Accessibility/AccessibilityContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from "react";

const AccessibilityContext = createContext();

export const FONT_SCALES = [
  { id: "sm", label: "Pequena", scale: 0.9, text: "90%" },
  { id: "md", label: "Padrão", scale: 1.0, text: "100%" },
  { id: "lg", label: "Grande", scale: 1.15, text: "115%" },
  { id: "xl", label: "Extra", scale: 1.30, text: "130%" },
  { id: "xxl", label: "Máxima", scale: 1.45, text: "145%" },
];

export const COLOR_MODES = {
  default: {
    id: "default",
    label: "Padrão Florável",
    desc: "Cores acolhedoras originais (rosa suave e verde natural)",
    badge: "bg-[#F4DDE5] text-[#294D33]",
  },
  deuteranopia: {
    id: "deuteranopia",
    label: "Deuteranopia",
    desc: "Sensibilidade ao verde (ajuste para tons azuis e âmbar)",
    badge: "bg-blue-100 text-blue-900",
  },
  protanopia: {
    id: "protanopia",
    label: "Protanopia",
    desc: "Sensibilidade ao vermelho/rosa (alto contraste calibrado)",
    badge: "bg-amber-100 text-amber-900",
  },
  tritanopia: {
    id: "tritanopia",
    label: "Tritanopia",
    desc: "Sensibilidade ao azul/amarelo (contrastes em ciano e rosa)",
    badge: "bg-teal-100 text-teal-900",
  },
  highContrast: {
    id: "highContrast",
    label: "Alto Contraste",
    desc: "Máxima nitidez e contornos escuros para baixa visão",
    badge: "bg-black text-white",
  },
  monochrome: {
    id: "monochrome",
    label: "Escala de Cinza",
    desc: "Sem saturação para conforto visual e foco cognitivo",
    badge: "bg-stone-200 text-stone-800",
  },
};

export function AccessibilityProvider({ children }) {
  // 1. TAMANHO DA FONTE
  const [fontScaleIndex, setFontScaleIndex] = useState(() => {
    const saved = localStorage.getItem("floravel_front_font_scale");
    return saved !== null ? parseInt(saved, 10) : 1; // Padrão 1.0 (index 1)
  });

  // 2. MODOS DE DALTONISMO E CONTRASTE
  const [colorMode, setColorMode] = useState(() => {
    return localStorage.getItem("floravel_front_color_mode") || "default";
  });

  // 3. GUIA DE LEITURA E REDUÇÃO DE MOVIMENTO
  const [readingGuide, setReadingGuide] = useState(() => {
    return localStorage.getItem("floravel_front_reading_guide") === "true";
  });

  const [reducedMotion, setReducedMotion] = useState(() => {
    return localStorage.getItem("floravel_front_reduced_motion") === "true";
  });

  // 4. LEITOR DE TELA (Web Speech API)
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpokenText, setCurrentSpokenText] = useState("");
  const synthRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Salvar preferências
  useEffect(() => {
    localStorage.setItem("floravel_front_font_scale", fontScaleIndex);
  }, [fontScaleIndex]);

  useEffect(() => {
    localStorage.setItem("floravel_front_color_mode", colorMode);
  }, [colorMode]);

  useEffect(() => {
    localStorage.setItem("floravel_front_reading_guide", readingGuide);
  }, [readingGuide]);

  useEffect(() => {
    localStorage.setItem("floravel_front_reduced_motion", reducedMotion);
  }, [reducedMotion]);

  // Aumentar e diminuir fonte
  const increaseFontSize = () => {
    setFontScaleIndex((prev) => Math.min(prev + 1, FONT_SCALES.length - 1));
  };

  const decreaseFontSize = () => {
    setFontScaleIndex((prev) => Math.max(prev - 1, 0));
  };

  const resetFontSize = () => {
    setFontScaleIndex(1); // 100%
  };

  // Reset geral
  const resetAllAccessibility = () => {
    stopSpeaking();
    setFontScaleIndex(1);
    setColorMode("default");
    setReadingGuide(false);
    setReducedMotion(false);
  };

  // Leitor de Texto Humanizado
  const speakText = (text) => {
    if (!synthRef.current) {
      alert("A síntese de voz não é suportada pelo seu navegador atual.");
      return;
    }

    synthRef.current.cancel();

    if (!text) {
      setIsSpeaking(false);
      setCurrentSpokenText("");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 0.95; // Velocidade acolhedora e compreensível
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpokenText(text);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpokenText("");
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentSpokenText("");
    };

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setCurrentSpokenText("");
    }
  };

  // Audiodescrição estruturada da Landing Page da Florável
  const readPageOverview = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    const overview = `Bem-vinda à plataforma Florável. Um ecossistema de saúde mental e acolhimento perinatal para mães no pós-parto, com suporte clínico e sem julgamentos. 
    Navegação principal: 
    1. Espaço da Mãe: nossa proposta e autoavaliação gratuita da Escala de Edimburgo. 
    2. A Jornada: o caminho de cuidado em três passos simples. 
    3. Recursos: ferramentas gratuitas como Diário Emocional e Cápsula do Tempo. 
    4. Para Psicólogos: rede de apoio clínico especializada. 
    5. Florável Corporate: benefícios corporativos de acolhimento parental para empresas e RH. 
    6. Alianças ESG: impacto social e responsabilidade maternal. 
    7. Depoimentos: relatos reais de mães acolhidas. 
    Você pode navegar usando a tecla Tab e clicar em Autoavaliação para iniciar sua triagem com sigilo e segurança.`;

    speakText(overview);
  };

  // Leitura de texto selecionado
  const readSelectedText = () => {
    if (typeof window === "undefined") return;
    const selected = window.getSelection()?.toString().trim();
    if (selected) {
      speakText(`Texto selecionado: ${selected}`);
    } else {
      speakText("Nenhum texto foi selecionado. Selecione qualquer trecho na página com o cursor ou teclado para ouvir.");
    }
  };

  // Classe de filtro para daltonismo
  const getFilterStyle = () => {
    switch (colorMode) {
      case "deuteranopia":
        return "filter-deuteranopia";
      case "protanopia":
        return "filter-protanopia";
      case "tritanopia":
        return "filter-tritanopia";
      case "highContrast":
        return "filter-high-contrast";
      case "monochrome":
        return "filter-monochrome";
      default:
        return "";
    }
  };

  const currentScaleObj = FONT_SCALES[fontScaleIndex] || FONT_SCALES[1];

  return (
    <AccessibilityContext.Provider
      value={{
        fontScaleIndex,
        fontScale: currentScaleObj.scale,
        fontScaleLabel: currentScaleObj.label,
        fontScaleText: currentScaleObj.text,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
        setFontScaleIndex,
        colorMode,
        setColorMode,
        readingGuide,
        setReadingGuide,
        reducedMotion,
        setReducedMotion,
        isSpeaking,
        currentSpokenText,
        speakText,
        stopSpeaking,
        readPageOverview,
        readSelectedText,
        resetAllAccessibility,
        getFilterStyle,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility deve ser usado dentro de AccessibilityProvider");
  }
  return context;
}

