// src/Components/Accessibility/AccessibilityContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from "react";

const AccessibilityContext = createContext();

export const FONT_SIZES = {
  normal: { id: "normal", label: "Normal (100%)", scale: "text-base", zoom: 100, rootScale: "100%" },
  large: { id: "large", label: "Grande (115%)", scale: "text-lg", zoom: 115, rootScale: "115%" },
  extra: { id: "extra", label: "Extra (130%)", scale: "text-xl", zoom: 130, rootScale: "128%" },
  huge: { id: "huge", label: "Máxima (145%)", scale: "text-2xl", zoom: 145, rootScale: "140%" },
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
  // 1. TAMANHO DA FONTE GLOBAL
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem("floravel_font_size") || "large";
  });

  // 1.1 TAMANHO DA LEGENDA (SUBTITLES)
  const [captionSize, setCaptionSize] = useState(() => {
    return localStorage.getItem("floravel_caption_size") || "large";
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
  const [isPaused, setIsPaused] = useState(false);
  const [speechProgressText, setSpeechProgressText] = useState("");
  const [currentTabSpoken, setCurrentTabSpoken] = useState("home");
  const currentUtteranceRef = useRef(null);

  // Aplica a escala de fonte na raiz do documento (HTML), permitindo que todos os rem do Tailwind escalem proporcionalmente
  useEffect(() => {
    if (typeof document !== "undefined") {
      const scale = FONT_SIZES[fontSize]?.rootScale || "115%";
      document.documentElement.style.fontSize = scale;
      localStorage.setItem("floravel_font_size", fontSize);
    }
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("floravel_caption_size", captionSize);
  }, [captionSize]);

  useEffect(() => {
    localStorage.setItem("floravel_color_mode", colorMode);
  }, [colorMode]);

  useEffect(() => {
    localStorage.setItem("floravel_reduced_motion", reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    localStorage.setItem("floravel_expanded_spacing", expandedSpacing);
  }, [expandedSpacing]);

  // Carrega vozes do navegador
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      const onVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
        window.speechSynthesis.cancel();
      };
    }
  }, []);

  // Funções para aumentar e diminuir fonte do aplicativo
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

  // Funções para aumentar e diminuir a legenda da narração
  const increaseCaptionSize = () => {
    if (captionSize === "normal") setCaptionSize("large");
    else if (captionSize === "large") setCaptionSize("extra");
    else if (captionSize === "extra") setCaptionSize("huge");
  };

  const decreaseCaptionSize = () => {
    if (captionSize === "huge") setCaptionSize("extra");
    else if (captionSize === "extra") setCaptionSize("large");
    else if (captionSize === "large") setCaptionSize("normal");
  };

  const resetAllAccessibility = () => {
    stopSpeaking();
    setFontSize("large");
    setCaptionSize("large");
    setColorMode("default");
    setReducedMotion(false);
    setExpandedSpacing(false);
  };

  // AUDIODESCRIÇÃO DA PÁGINA (Web Speech API Nativa com proteção contra Garbage Collection)
  const speakText = (text, tabId = "home") => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("A síntese de voz nativa do navegador não está disponível neste dispositivo.");
      return;
    }

    const synth = window.speechSynthesis;
    synth.cancel();

    if (!text) {
      setIsSpeaking(false);
      setIsPaused(false);
      setSpeechProgressText("");
      return;
    }

    // Micro-pausa para desocupar a fila de áudio do Chromium
    setTimeout(() => {
      try {
        synth.resume();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "pt-BR";
        utterance.rate = 0.94; // Ritmo calmo, acolhedor e claro
        utterance.pitch = 1.0;

        // Seleciona voz brasileira disponível
        const voices = synth.getVoices();
        const ptVoice = voices.find(
          (v) =>
            v.lang === "pt-BR" ||
            v.lang.toLowerCase().startsWith("pt") ||
            v.name.toLowerCase().includes("brazil") ||
            v.name.toLowerCase().includes("maria") ||
            v.name.toLowerCase().includes("portuguese")
        );
        if (ptVoice) {
          utterance.voice = ptVoice;
        }

        utterance.onstart = () => {
          setIsSpeaking(true);
          setIsPaused(false);
          setSpeechProgressText(text);
          setCurrentTabSpoken(tabId);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          setIsPaused(false);
          setSpeechProgressText("");
        };

        utterance.onerror = (e) => {
          if (e.error !== "canceled" && e.error !== "interrupted") {
            console.warn("SpeechSynthesis erro:", e);
          }
          setIsSpeaking(false);
          setIsPaused(false);
        };

        // Mantém referência viva para evitar coleta de lixo no Chrome
        currentUtteranceRef.current = utterance;
        window.__floravelUtterance = utterance;

        synth.speak(utterance);
        setIsSpeaking(true);
        setIsPaused(false);
        setSpeechProgressText(text);
        setCurrentTabSpoken(tabId);
      } catch (err) {
        console.error("Falha ao sintetizar áudio:", err);
        setIsSpeaking(false);
      }
    }, 40);
  };

  const pauseSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumeSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setSpeechProgressText("");
    }
  };

  // Descrições humanizadas e estruturadas por tela
  const getScreenDescription = (tabId) => {
    const descriptions = {
      home: "Você está no Painel Principal da Florável. No topo, sua saudação e acúmulo de flores solidárias. Logo abaixo, o registro de check-in emocional diário, sua agenda com próximas consultas, o convite para a roda de conversa com outras mães, o mural de afeto solidário e a pausa guiada de respiração de um minuto.",
      quiz: "Você está na seção Diário e Triagem. Aqui você tem o diário confidencial para desabafar no seu tempo e o formulário de triagem acolhedor baseado na Escala de Edimburgo, para acompanhar sua saúde emocional sem julgamentos.",
      network: "Você está na Rede de Apoio Profissional. Encontre psicólogas certificadas e especializadas em saúde mental perinatal, com atendimento a valor social acessível ou totalmente gratuito custeado pelo Fundo Florável.",
      groups: "Você está nas Rodas de Conversa. Encontros virtuais acolhedores entre mães, mediados por psicólogas, para compartilhar sentimentos sobre sono, cansaço, culpa e a maternidade real.",
      booking: "Você está em Meus Agendamentos. Veja suas consultas psicológicas confirmadas, datas, horários e links de acesso direto à sala segura.",
      library: "Você está na Biblioteca e Conteúdos. Artigos curtos e vídeos com base científica para apoiar seu puerpério, autocuidado, sono do bebê e criação de vínculo.",
      help: "Você está na Central de Ajuda. Canais de emergência, escuta imediata e o número do Centro de Valorização da Vida 188 com ligação gratuita 24 horas.",
      perfil: "Você está no seu Perfil de Usuária. Aqui você personaliza suas fotos, dados de contato e informações sobre a fase do seu bebê.",
      accessibility: "Você está no Painel de Acessibilidade da Florável. Ajuste o tamanho da letra, alterne modos para daltonismo e alto contraste, ou ative a audiodescrição por voz.",
    };

    return descriptions[tabId] || descriptions.home;
  };

  const describeScreen = (tabId) => {
    const textToRead = getScreenDescription(tabId);
    speakText(textToRead, tabId);
  };

  const toggleScreenNarration = (tabId) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      describeScreen(tabId);
    }
  };

  // Classes CSS globais baseadas no estado
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
        return "font-scale-normal text-[15px]";
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

  const getCaptionFontSizeClass = () => {
    switch (captionSize) {
      case "normal":
        return "text-[14px]";
      case "large":
        return "text-[16px]";
      case "extra":
        return "text-[18px]";
      case "huge":
        return "text-[21px]";
      default:
        return "text-[16px]";
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        increaseFontSize,
        decreaseFontSize,
        captionSize,
        setCaptionSize,
        increaseCaptionSize,
        decreaseCaptionSize,
        colorMode,
        setColorMode,
        reducedMotion,
        setReducedMotion,
        expandedSpacing,
        setExpandedSpacing,
        isSpeaking,
        isPaused,
        speechProgressText,
        currentTabSpoken,
        speakText,
        pauseSpeaking,
        resumeSpeaking,
        stopSpeaking,
        describeScreen,
        toggleScreenNarration,
        resetAllAccessibility,
        getFilterStyle,
        getFontSizeClass,
        getCaptionFontSizeClass,
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
