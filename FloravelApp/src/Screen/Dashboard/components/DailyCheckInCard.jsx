// src/Screen/Dashboard/components/DailyCheckInCard.jsx
import { useState } from 'react';
import { ArrowRight, BookOpen, Heart, ShieldCheck, Check } from 'lucide-react';

const MOOD_OPTIONS = [
  { id: 'calm', label: 'Em Paz', emoji: '🌸' },
  { id: 'tired', label: 'Cansada', emoji: '☕' },
  { id: 'overwhelmed', label: 'Sobrecarregada', emoji: '🌧️' },
  { id: 'grateful', label: 'Acolhida', emoji: '🤍' },
  { id: 'sensitive', label: 'Sensível', emoji: '🌿' },
];

export default function DailyCheckInCard({ onOpenDiary, onSelectMood, currentMood }) {
  const [selectedQuickMood, setSelectedQuickMood] = useState(currentMood || null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleMoodClick = (mood) => {
    setSelectedQuickMood(mood.id);
    if (onSelectMood) onSelectMood(mood);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2800);
  };

  return (
    <div className="relative w-full rounded-[32px] bg-white border border-stone-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="flex flex-col lg:flex-row items-stretch">
        
        {/* LADO ESQUERDO: CONTEÚDO PRINCIPAL COM TEXTOS DIRETOS E LETRAS GRANDES */}
        <div className="flex-1 p-7 sm:p-9 lg:p-10 flex flex-col justify-between z-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#294D33] mb-3 bg-[#EBF3ED] px-3.5 py-1.5 rounded-full">
              <Heart size={14} className="text-[#294D33] fill-[#294D33]" />
              Check-in de Hoje
            </div>

            <h2 className="text-[28px] sm:text-[34px] font-fraunces font-bold text-[#2B2829] leading-tight mb-3">
              Como você está agora?
            </h2>

            {/* Texto curto e direto ao ponto */}
            <p className="text-base sm:text-lg text-stone-600 font-medium leading-relaxed max-w-lg mb-6">
              Toque no que você sente hoje. Este é o seu espaço protegido.
            </p>

            {/* SELEÇÃO RÁPIDA DE HUMOR COM BOTÕES GRANDES E VISÍVEIS */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2.5">
                {MOOD_OPTIONS.map((mood) => {
                  const isSelected = selectedQuickMood === mood.id;
                  return (
                    <button
                      key={mood.id}
                      type="button"
                      onClick={() => handleMoodClick(mood)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[15px] font-bold transition-all duration-200 border cursor-pointer ${
                        isSelected
                          ? 'bg-[#294D33] text-white border-[#294D33] shadow-md scale-105'
                          : 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-white hover:border-[#294D33]/40'
                      }`}
                    >
                      <span className="text-lg">{mood.emoji}</span>
                      <span>{mood.label}</span>
                      {isSelected && <Check size={16} className="text-white ml-0.5" />}
                    </button>
                  );
                })}
              </div>

              {showFeedback && (
                <p className="text-sm text-[#294D33] font-bold mt-3 flex items-center gap-1.5 animate-fadeIn">
                  <Check size={16} /> Sentimento acolhido com carinho.
                </p>
              )}
            </div>
          </div>

          {/* BOTÃO EM DESTAQUE E PRIVACIDADE */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
            <button
              type="button"
              onClick={onOpenDiary}
              className="inline-flex items-center justify-center gap-2.5 bg-[#294D33] hover:bg-[#1e3b26] text-white px-8 py-4 rounded-full text-base font-bold transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
            >
              <BookOpen size={19} className="transition-transform group-hover:rotate-6" />
              <span>Escrever no Diário</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>

            <div className="flex items-center gap-2 text-sm text-stone-600 font-medium">
              <ShieldCheck size={17} className="text-[#294D33] shrink-0" />
              <span>100% privado e seguro</span>
            </div>
          </div>
        </div>

        {/* LADO DIREITO: FOTO SERENA DE UMA MÃE */}
        <div className="lg:w-[360px] xl:w-[400px] relative min-h-[240px] sm:min-h-[280px] lg:min-h-auto bg-[#FBF4F6] flex items-center justify-center overflow-hidden border-t lg:border-t-0 lg:border-l border-stone-100">
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-white via-transparent to-transparent z-10 pointer-events-none" />

          <img
            src="/img/6.jpg"
            alt="Mãe sorridente ao ar livre celebrando a vida e acolhimento"
            className="w-full h-full object-cover object-center transform transition-transform duration-700 hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "/img/fotomae/6.jpg";
            }}
          />

          {/* Selo flutuante de acolhimento com texto limpo */}
          <div className="absolute bottom-4 right-4 left-4 lg:left-auto lg:max-w-[260px] bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-stone-100 shadow-sm z-20 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F4DDE5] text-[#294D33] flex items-center justify-center shrink-0 text-base">
              🌸
            </div>
            <div>
              <p className="text-sm font-bold text-[#2B2829] leading-tight">Você é importante</p>
              <p className="text-xs text-stone-500">Respire no seu tempo.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
