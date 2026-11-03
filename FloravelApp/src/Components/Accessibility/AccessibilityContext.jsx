// src/Components/Accessibility/AccessibilityContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from "react";

const AccessibilityContext = createContext();

export const FONT_SIZES = {
  normal: { id: "normal", label: "Normal", scale: "text-base", zoom: 100 },
  large: { id: "large", label: "Grande (+20%)", scale: "text-lg", zoom: 118 },
  extra: { id: "extra", label: "Extra (+35%)", scale: "text-xl", zoom: 135 },
  huge: { id: "huge", label: "Máxima (+50%)", scale: "text-2xl", zoom: 150 },
};

export const COLOR_MODES = {
  default: {
    id: "default",
    label: "Padrão Florável",
    desc: "Cores acolhedoras da marca (rosa suave e verde)",
    badgeColor: "bg-[#F4DDE5] text-[#294D33]",
  },
  deuteranopia: {
    id: "deuteranopia",
    label: "Deuteranopia",
    desc: "Dificuldade com verde (ajustado para tons azulados e âmbar)",
    badgeColor: "bg-blue-100 text-blue-900",
  },
  protanopia: {
    id: "protanopia",
    label: "Protanopia",
    desc: "Dificuldade com vermelho/rosa (ajustado para alto contraste)",
    badgeColor: "bg-amber-100 text-amber-900",
  },
  tritanopia: {
    id: "tritanopia",
    label: "Tritanopia",
    desc: "Dificuldade com azul/amarelo (contrastes em ciano e rosa)",
    badgeColor: "bg-teal-100 text-teal-900",
  },
  highContrast: {
    id: "highContrast",
    label: "Alto Contraste",
    desc: "Máxima nitidez com contornos escuros e fundo limpo",
    badgeColor: "bg-black text-white",
  },
  monochrome: {
    id: "monochrome",
    label: "Escala de Cinza",
    desc: "Elimina saturação para sensibilidade a luz ou foco",
    badgeColor: "bg-stone-200 text-stone-800",
  },
};

export function AccessibilityProvider({ children }) {
  // 1. TAMANHO DA FONTE
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem("floravel_font_size") || "large"; // Começa em grande por padrão para melhor legibilidade
  });

  // 2. FILTRO DE COR / DALTONISMO
  const [colorMode, setColorMode] = useState(() => {
    return localStorage.getItem("floravel_color_mode") || "default";
  });

  // 3. OUTROS TIPOS DE ACESSIBILIDADE
  const [reducedMotion, setReducedMotion] = useState(() => {
    return localStorage.getItem("floravel_reduced_motion") === "true";
  });

  const [expandedSpacing, setExpandedSpacing] = useState(() => {
    return localStorage.getItem("floravel_expanded_spacing") === "true";
  });

  // 4. LEITOR DE TELA / AUDIODESCRIÇÃO (Web Speech API)
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechProgressText, setSpeechProgressText] = useState("");
  const synthRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Salvar no LocalStorage
  useEffect(() => {
    localStorage.setItem("floravel_font_size", fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("floravel_color_mode", colorMode);
  }, [colorMode]);

  useEffect(() => {
    localStorage.setItem("floravel_reduced_motion", reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    localStorage.setItem("floravel_expanded_spacing", expandedSpacing);
  }, [expandedSpacing]);

  // Função para aumentar e diminuir fonte
  const increaseFontSize = () => {
    if (fontSize === "normal") setFontSize("large");
    else if (fontSize === "large") setFontSize("extra");
    else if (fontSize === "extra") setFontSize("huge");
  };

  const decreaseFontSize = () => {
    if (fontSize === "huge") setFontSize("extra");
    else if (fontSize === "extra") setFontSize("large");
    else if (fontSize === "large") setFontSize("normal");
  };

  const resetAllAccessibility = () => {
    stopSpeaking();
    setFontSize("large");
    setColorMode("default");
    setReducedMotion(false);
    setExpandedSpacing(false);
  };

  // AUDIODESCRIÇÃO DA PÁGINA
  const speakText = (text) => {
    if (!synthRef.current) {
      alert("A síntese de voz não é suportada neste navegador.");
      return;
    }

    // Se já estiver falando, para
    synthRef.current.cancel();

    if (!text) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 0.95; // Levemente mais compassado para acolhimento
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeechProgressText(text);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeechProgressText("");
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeechProgressText("");
    };

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setSpeechProgressText("");
    }
  };

  // Descrições humanizadas por tela
  const describeScreen = (tabId) => {
    const descriptions = {
      home: "Você está na página inicial do Florável. No topo, você tem a saudação e o acúmulo de flores de autocuidado. Logo abaixo, o cartão de check-in diário para registrar seu humor rapidamente. Em seguida, o acesso à sua cápsula do tempo, o convite para a próxima roda de conversa com outras mães, o mural solidário de carinho e o exercício guiado de respiração de um minuto.",
      quiz: "Você está na seção Diário e Triagem. Aqui você pode registrar o que está sentindo hoje ou responder ao formulário acolhedor da Escala de Edimburgo para acompanhamento de bem-estar.",
      groups: "Você está nas Rodas de Conversa. Encontre horários de encontros virtuais com psicólogas e outras mães para falar sobre sono, cansaço, culpa e apoio mútuo.",
      booking: "Você está nos Meus Agendamentos. Veja suas consultas psicológicas marcadas, datas e links de salas virtuais.",
      network: "Você está na Rede de Apoio. Explore profissionais especializados em psicologia perinatal, obstetrícia e consultoria materna.",
      library: "Você está na Biblioteca de Conteúdos. Artigos curtos e baseados em ciência para te acolher no puerpério.",
      help: "Você está na Central de Ajuda e Acolhimento. Contatos de emergência, telefone do CVV 188 gratuito 24 horas e canais de escuta imediata.",
      perfil: "Você está no seu Perfil de Usuária. Aqui você altera seus dados, preferências e informações da sua semana de puerpério.",
      acessibilidade: "Você está no Painel de Acessibilidade da Florável. Aqui você pode aumentar o tamanho das letras, escolher modos de cor para daltonismo como deuteranopia, protanopia e alto contraste, ou ouvir a leitura por voz de qualquer tela.",
    };

    const textToRead = descriptions[tabId] || descriptions.home;
    speakText(textToRead);
  };

  // Determinar classes CSS globais baseadas no estado
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

  const getFontSizeClass = () => {
    switch (fontSize) {
      case "normal":
        return "font-scale-normal";
      case "large":
        return "font-scale-large text-[17px]";
      case "extra":
        return "font-scale-extra text-[19px]";
      case "huge":
        return "font-scale-huge text-[21px]";
      default:
        return "font-scale-large text-[17px]";
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
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
        speechProgressText,
        speakText,
        stopSpeaking,
        describeScreen,
        resetAllAccessibility,
        getFilterStyle,
        getFontSizeClass,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility deve ser utilizado dentro de AccessibilityProvider");
  }
  return context;
}

