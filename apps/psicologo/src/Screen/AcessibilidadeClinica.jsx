import {
  Eye,
  Volume2,
  Type,
  Sun,
  Sparkles,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { usePsiAccessibility } from '../Components/Accessibility/PsiAccessibilityContext';

export default function AcessibilidadeClinica() {
  const {
    fontSize,
    setFontSize,
    colorFilter,
    setColorFilter,
    expandedSpacing,
    setExpandedSpacing,
    reducedMotion,
    setReducedMotion,
    isSpeaking,
    toggleClinicalVoiceSummary,
    resetAccessibility,
  } = usePsiAccessibility();

  return (
    <div className="w-full space-y-6 pb-12">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[13.5px] md:text-[15px] text-[#4A5E4D]">
            Ergonomia & Conforto para Quem Cuida
          </p>
          <h1 className="mt-2 font-fraunces text-[30px] md:text-[38px] leading-[1.12] tracking-[-0.015em] text-[#1F3A27]">
            Acessibilidade Clínica
          </h1>
          <p className="mt-2 text-[15px] text-[#4A5E4D]">
            Configurações projetadas para reduzir a fadiga ocular e cognitiva durante longas jornadas de teleatendimento.
          </p>
        </div>

        <button
          type="button"
          onClick={resetAccessibility}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-stone-200 bg-white text-xs font-bold text-stone-700 hover:bg-stone-50 transition cursor-pointer self-start"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restaurar Padrão
        </button>
      </header>

      {/* 1. DESCANSO OCULAR ENTRE SESSÕES: SÍNTESE DE VOZ DA AGENDA */}
      <section className="rounded-3xl border border-[#294D33]/20 bg-[#EBF3ED] p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#294D33] flex items-center gap-1.5">
            <Volume2 className="w-4 h-4" /> Pausa Visual entre Atendimentos
          </span>
          <h2 className="font-fraunces text-xl font-bold text-[#1F3A27]">
            Resumo Clínico por Voz (Descanso Ocular)
          </h2>
          <p className="text-xs text-[#2B2829] max-w-xl leading-relaxed">
            Feche os olhos por 1 minuto entre uma sessão e outra: o sistema lê em voz alta suas próximas rodas, horários e alertas do dia sem que você precise encarar a tela.
          </p>
        </div>

        <button
          type="button"
          onClick={toggleClinicalVoiceSummary}
          className={`px-6 py-3.5 rounded-full text-xs font-bold transition shadow-sm cursor-pointer shrink-0 flex items-center gap-2 ${
            isSpeaking
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-[#294D33] text-white hover:bg-[#1F3A27]'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>{isSpeaking ? 'Parar Leitura por Voz' : 'Ouvir Agenda do Dia'}</span>
        </button>
      </section>

      {/* 2. CONFORTO VISUAL DE CONSULTÓRIO & FILTROS DE COR */}
      <section className="rounded-3xl border border-[#EFE9EB] bg-white p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <Sun className="w-5 h-5 text-[#294D33]" />
          <h2 className="font-fraunces text-xl font-bold text-[#1F3A27]">
            Conforto Ocular Prolongado & Filtros Cromáticos
          </h2>
        </div>
        <p className="text-xs text-stone-500">
          O <strong>Modo Consultório (Sépia Clínico)</strong> suaviza a emissão de luz azul para expedientes com mais de 4 horas de vídeo.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { id: 'none', title: 'Cores Padrão Florável', desc: 'Paleta original com contraste balanceado' },
            { id: 'sepia_clinico', title: '☕ Modo Consultório (Anti-Luz Azul)', desc: 'Tom quente acolhedor para evitar fadiga ocular e enxaqueca' },
            { id: 'high_contrast', title: 'Alto Contraste Clínico', desc: 'Nitidez reforçada para leitura rápida de indicadores' },
            { id: 'deuteranopia', title: 'Deuteranopia (Verde/Vermelho)', desc: 'Adaptação cromática para percepção de badges de risco' },
            { id: 'protanopia', title: 'Protanopia (Tons Quentes)', desc: 'Compensação de espectro vermelho em alertas' },
            { id: 'tritanopia', title: 'Tritanopia (Azul/Amarelo)', desc: 'Ajuste de matiz para diferenciação de status' },
          ].map((opt) => {
            const ativo = colorFilter === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setColorFilter(opt.id)}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  ativo
                    ? 'border-[#294D33] bg-[#EBF3ED]/70 ring-2 ring-[#294D33]/20'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-[#1F3A27]">{opt.title}</span>
                  {ativo && <CheckCircle2 className="w-4 h-4 text-[#294D33] shrink-0" />}
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">{opt.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. TIPOGRAFIA E ESPAÇAMENTO PARA LEITURA DE RELATOS */}
      <section className="rounded-3xl border border-[#EFE9EB] bg-white p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5">
          <Type className="w-5 h-5 text-[#294D33]" />
          <h2 className="font-fraunces text-xl font-bold text-[#1F3A27]">
            Escala Tipográfica & Leitura de Relatos
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'normal', label: 'Padrão (100%)' },
            { id: 'large', label: 'Conforto (112%)' },
            { id: 'extra', label: 'Ampliado (125%)' },
            { id: 'huge', label: 'Extra Grande (135%)' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setFontSize(t.id)}
              className={`py-3 px-4 rounded-2xl border text-xs font-bold transition cursor-pointer ${
                fontSize === t.id
                  ? 'bg-[#294D33] text-white border-[#294D33]'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <label className="flex items-center justify-between p-4 rounded-2xl border border-stone-200 bg-[#FCF7F9] cursor-pointer">
            <div>
              <span className="text-xs font-bold text-[#1F3A27] block">
                Espaçamento Expandido de Leitura
              </span>
              <span className="text-[11px] text-stone-500">
                Aumenta entrelinhas (1.8x) para ler desabafos longos no mural sem cansar a vista
              </span>
            </div>
            <input
              type="checkbox"
              checked={expandedSpacing}
              onChange={(e) => setExpandedSpacing(e.target.checked)}
              className="w-5 h-5 accent-[#294D33] rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl border border-stone-200 bg-[#FCF7F9] cursor-pointer">
            <div>
              <span className="text-xs font-bold text-[#1F3A27] block">
                Modo Foco Clínico (Reduzir Movimento)
              </span>
              <span className="text-[11px] text-stone-500">
                Desativa transições e animações visuais para máxima concentração
              </span>
            </div>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              className="w-5 h-5 accent-[#294D33] rounded cursor-pointer"
            />
          </label>
        </div>
      </section>
    </div>
  );
}
