// src/Screen/Dashboard/DashboardScreen.jsx
import { useState } from 'react';
import TopFlowerGamification from './components/TopFlowerGamification';
import DailyCheckInCard from './components/DailyCheckInCard';
import TimeCapsuleCard from './components/TimeCapsuleCard';
import ProximaRodaCard from './components/ProximaRodaCard';
import MuralSolidarioCard from './components/MuralSolidarioCard';
import MicroVitoriaCard from './components/MicroVitoriaCard';
import EmotionalCalendarCard from './components/EmotionalCalendarCard';
import BreathingExerciseCard from './components/BreathingExerciseCard';
import ArticleRecommendations from './components/ArticleRecommendations';

// Modais Interativos
import QuickDiaryModal from './components/QuickDiaryModal';
import TimeCapsuleModal from './components/TimeCapsuleModal';
import InviteModal from './components/InviteModal';
import HistoryModal from './components/HistoryModal';

export default function DashboardScreen({ setActiveTab, userName = "Mariana" }) {
  // Estados para abertura dos modais
  const [isDiaryModalOpen, setIsDiaryModalOpen] = useState(false);
  const [isCapsuleModalOpen, setIsCapsuleModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Estados de gamificação e humor
  const [flowersCount, setFlowersCount] = useState(12);
  const [currentMood, setCurrentMood] = useState(null);

  const handleSaveDiary = (entry) => {
    setCurrentMood(entry.mood);
    setFlowersCount((prev) => prev + 1);
  };

  const handleSaveCapsule = () => {
    setFlowersCount((prev) => prev + 1);
  };

  const handleCelebrateMicroVitoria = () => {
    setFlowersCount((prev) => prev + 1);
  };

  const handleRetribuirFlorMural = () => {
    setFlowersCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-full w-full max-w-7xl mx-auto space-y-8 font-dmsans text-[#2B2829] pb-16 animate-fadeIn">
      
      {/* 1. SEÇÃO SUPERIOR: SAUDAÇÃO COM TIPOGRAFIA EM DESTAQUE */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-fraunces font-bold text-[#2B2829] tracking-tight leading-tight">
            Bom dia, {userName}! 🌸
          </h1>
          <p className="text-base sm:text-lg text-stone-600 font-medium mt-1">
            Seu refúgio diário de acolhimento e escuta.
          </p>
        </div>

        {/* GAMIFICAÇÃO DE FLORES */}
        <TopFlowerGamification
          flowersCount={flowersCount}
          targetFlowers={15}
          onOpenInvite={() => setIsInviteModalOpen(true)}
        />
      </section>

      {/* 2. CARD PRINCIPAL DE CHECK-IN DIÁRIO */}
      <section aria-label="Check-in Diário">
        <DailyCheckInCard
          onOpenDiary={() => setIsDiaryModalOpen(true)}
          onSelectMood={(mood) => setCurrentMood(mood.id)}
          currentMood={currentMood}
        />
      </section>

      {/* 3. GRID DE 2 COLUNAS: CÁPSULA DO TEMPO & PRÓXIMO ENCONTRO */}
      <section aria-label="Memórias e Comunidade">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <div className="h-full z-10">
            <TimeCapsuleCard
              onWriteLetter={() => setIsCapsuleModalOpen(true)}
              onViewCapsule={() => setIsCapsuleModalOpen(true)}
            />
          </div>

          <div className="h-full z-10">
            <ProximaRodaCard
              onJoinRoom={() => {
                if (setActiveTab) setActiveTab('groups');
              }}
              onNavigateToGroups={() => {
                if (setActiveTab) setActiveTab('groups');
              }}
            />
          </div>
        </div>
      </section>

      {/* 4. GRID DE 2 COLUNAS: MURAL SOLIDÁRIO & MICROVITÓRIA */}
      <section aria-label="Acolhimento Comunitário e Autocuidado">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <div className="h-full z-10">
            <MuralSolidarioCard
              onSendFlower={handleRetribuirFlorMural}
            />
          </div>

          <div className="h-full z-10">
            <MicroVitoriaCard
              onCelebrate={handleCelebrateMicroVitoria}
            />
          </div>
        </div>
      </section>

      {/* 5. ACOMPANHAMENTO EMOCIONAL & RESPIRO */}
      <section className="space-y-6" aria-label="Mapa de Humor e Respiro">
        {/* CARD LARGO: "Respire com a gente" */}
        <div className="w-full z-10">
          <BreathingExerciseCard />
        </div>

        {/* MAPA DE HUMOR */}
        <div className="w-full z-10">
          <EmotionalCalendarCard
            onOpenHistory={() => setIsHistoryModalOpen(true)}
            onOpenScreening={() => {
              if (setActiveTab) setActiveTab('quiz');
            }}
          />
        </div>

        {/* LEITURAS */}
        <div className="w-full z-10">
          <ArticleRecommendations
            onNavigateToLibrary={() => {
              if (setActiveTab) setActiveTab('library');
            }}
          />
        </div>
      </section>

      {/* MODAIS INTERATIVOS */}
      <QuickDiaryModal
        isOpen={isDiaryModalOpen}
        onClose={() => setIsDiaryModalOpen(false)}
        onSaveEntry={handleSaveDiary}
        onGoToFullQuiz={() => {
          if (setActiveTab) setActiveTab('quiz');
        }}
      />

      <TimeCapsuleModal
        isOpen={isCapsuleModalOpen}
        onClose={() => setIsCapsuleModalOpen(false)}
        onSaveCapsule={handleSaveCapsule}
      />

      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        userName={userName}
        flowersCount={flowersCount}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        onStartQuiz={() => {
          if (setActiveTab) setActiveTab('quiz');
        }}
      />

    </div>
  );
}
