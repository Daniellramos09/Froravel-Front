import { createContext, useContext, useState, useEffect } from 'react';

const PsiAccessibilityContext = createContext();
const isLocal = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
const API_BASE = import.meta.env.VITE_API_URL || (isLocal ? 'http://localhost:8080' : '');

const DEFAULT_PSI_PROFILE = {
  id: null,
  codigoPublico: 'FLR-PSI842',
  nome: 'Dra. Helena Souza',
  email: 'helena.souza@floravel.com.br',
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

  // Hidrata perfil da psicóloga a partir do MySQL (com fallback local seguro)
  useEffect(() => {
    if (!API_BASE) return;
    const syncFromBackend = async () => {
      try {
        let sessaoEmail = '';
        try {
          const sessao = JSON.parse(localStorage.getItem('floravel_psi_sessao') || '{}');
          sessaoEmail = sessao?.email || '';
        } catch (_) {}

        const res = await fetch(`${API_BASE}/api/psicologos`);
        if (!res.ok) return;
        const lista = await res.json();
        if (!Array.isArray(lista) || lista.length === 0) return;

        const match =
          lista.find((p) => sessaoEmail && p.email?.toLowerCase() === sessaoEmail.toLowerCase()) ||
          lista.find((p) => p.crp?.includes('06/142980')) ||
          lista[0];

        if (match) {
          setPsiProfile((prev) => {
            const hydrated = {
              ...prev,
              id: match.id || prev.id,
              codigoPublico: match.codigoPublico || prev.codigoPublico,
              nome: match.nome || prev.nome,
              email: match.email || prev.email,
              crp: match.crp ? (match.crp.startsWith('CRP') ? match.crp : `CRP ${match.crp}`) : prev.crp,
              especialidade: match.especialidade || prev.especialidade,
              abordagem: match.abordagem || prev.abordagem,
              cidade: match.cidade ? `${match.cidade}${match.estado ? ` - ${match.estado}` : ''}` : prev.cidade,
              fotoUrl: match.fotoUrl || prev.fotoUrl,
              sobreMim: match.biografia || prev.sobreMim,
              graduacoes: Array.isArray(match.graduacoes) && match.graduacoes.length > 0 ? match.graduacoes : prev.graduacoes,
              maesAtendidasCount: match.maesAtendidasCount || prev.maesAtendidasCount,
              estrelasRecebidasCount: match.estrelasRecebidasCount || prev.estrelasRecebidasCount,
              rodasConduzidasCount: match.rodasConduzidasCount || prev.rodasConduzidasCount,
              atendimentosSociaisCount: match.atendimentosSociaisCount || prev.atendimentosSociaisCount,
            };
            localStorage.setItem('floravel_psi_profile', JSON.stringify(hydrated));
            return hydrated;
          });
        }
      } catch (_) {}
    };
    syncFromBackend();
  }, []);

  const updatePsiProfile = (newProfile) => {
    const merged = { ...psiProfile, ...newProfile };
    setPsiProfile(merged);
    localStorage.setItem('floravel_psi_profile', JSON.stringify(merged));

    if (merged.id) {
      const cidadeSplit = String(merged.cidade || '').split(' - ');
      const payload = {
        nome: merged.nome,
        especialidade: merged.especialidade,
        abordagem: merged.abordagem,
        cidade: cidadeSplit[0]?.trim() || merged.cidade,
        estado: cidadeSplit[1]?.trim() || undefined,
        fotoUrl: merged.fotoUrl,
        biografia: merged.sobreMim,
        graduacoes: Array.isArray(merged.graduacoes) ? merged.graduacoes : [],
      };
      if (API_BASE) {
        const token = localStorage.getItem('floravel_jwt');
        fetch(`${API_BASE}/api/psicologos/${merged.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        }).catch(() => {});
      }
    }
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
