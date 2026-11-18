import { createContext, useContext, useState, useEffect } from 'react';

const PsiAccessibilityContext = createContext();

const DEFAULT_PSI_PROFILE = {
  nome: 'Dra. Helena Souza',
  crp: 'CRP 06/142980',
  especialidade: 'Psicologia Perinatal & Parentalidade',
  abordagem: 'Psicanálise & Escuta Perinatal',
  valorConsulta: '40,00 (Valor Social) · Fundo Solidário',
  cidade: 'São Paulo - SP',
  fotoUrl: '/img/fotopsicologo/psicologa1.jpg',
  sobreMim:
    'Psicóloga perinatal dedicada a acolher mães na gestação, puerpério e retorno ao trabalho. Acredito em uma escuta ética, calorosa e livre de julgamentos para fortalecer a saúde emocional materna.',
  graduacoes: [
    'Graduação em Psicologia — Universidade de São Paulo (USP)',
    'Especialização em Psicologia Perinatal e da Parentalidade — Instituto Gerar',
    'Formação em Acolhimento ao Luto Gestacional e Neonatal — PUC-SP',
  ],
  maesAtendidasCount: 12,
  estrelasRecebidasCount: 58,
  rodasConduzidasCount: 18,
  atendimentosSociaisCount: 21,
};

export function PsiAccessibilityProvider({ children }) {
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('psi_font_size') || 'normal');
  const [colorFilter, setColorFilter] = useState(() => localStorage.getItem('psi_color_filter') || 'none');
  const [expandedSpacing, setExpandedSpacing] = useState(() => localStorage.getItem('psi_spacing') === 'true');
  const [reducedMotion, setReducedMotion] = useState(() => localStorage.getItem('psi_reduced_motion') === 'true');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [psiProfile, setPsiProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('floravel_psi_profile');
      return saved ? { ...DEFAULT_PSI_PROFILE, ...JSON.parse(saved) } : DEFAULT_PSI_PROFILE;
    } catch (_) {
      return DEFAULT_PSI_PROFILE;
    }
  });

  useEffect(() => {
    localStorage.setItem('psi_font_size', fontSize);
    localStorage.setItem('psi_color_filter', colorFilter);
    localStorage.setItem('psi_spacing', String(expandedSpacing));
    localStorage.setItem('psi_reduced_motion', String(reducedMotion));
  }, [fontSize, colorFilter, expandedSpacing, reducedMotion]);

  const updatePsiProfile = (newProfile) => {
    const merged = { ...psiProfile, ...newProfile };
    setPsiProfile(merged);
    localStorage.setItem('floravel_psi_profile', JSON.stringify(merged));
  };

  const cycleFontSize = (direction) => {
    const order = ['normal', 'large', 'extra', 'huge'];
    const idx = order.indexOf(fontSize);
    const nextIdx = Math.min(Math.max(idx + direction, 0), order.length - 1);
    setFontSize(order[nextIdx]);
  };

  const toggleClinicalVoiceSummary = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(
      `Resumo clínico para ${psiProfile.nome}. Você possui dois atendimentos agendados para hoje: Roda de conversa Os Primeiros Meses às dezoito horas, com três de cinco mães confirmadas, e escuta individual com Juliana Costa. Lembre-se de fazer uma pausa para hidratação e descanso visual entre as sessões.`
    );
    msg.lang = 'pt-BR';
    msg.rate = 0.98;
    msg.onend = () => setIsSpeaking(false);
    msg.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(msg);
  };

  const getFontSizeClass = () => {
    if (fontSize === 'large') return 'font-scale-large';
    if (fontSize === 'extra') return 'font-scale-extra';
    if (fontSize === 'huge') return 'font-scale-huge';
    return 'font-scale-normal';
  };

  const getFilterClass = () => {
    if (colorFilter === 'sepia_clinico') return 'filter-sepia-clinico';
    if (colorFilter === 'deuteranopia') return 'filter-deuteranopia';
    if (colorFilter === 'protanopia') return 'filter-protanopia';
    if (colorFilter === 'tritanopia') return 'filter-tritanopia';
    if (colorFilter === 'high_contrast') return 'filter-high-contrast';
    return '';
  };

  const resetAccessibility = () => {
    setFontSize('normal');
    setColorFilter('none');
    setExpandedSpacing(false);
    setReducedMotion(false);
  };

  return (
    <PsiAccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        cycleFontSize,
        colorFilter,
        setColorFilter,
        expandedSpacing,
        setExpandedSpacing,
        reducedMotion,
        setReducedMotion,
        isSpeaking,
        toggleClinicalVoiceSummary,
        getFontSizeClass,
        getFilterClass,
        resetAccessibility,
        psiProfile,
        updatePsiProfile,
      }}
    >
      {children}
    </PsiAccessibilityContext.Provider>
  );
}

export const usePsiAccessibility = () => useContext(PsiAccessibilityContext);
