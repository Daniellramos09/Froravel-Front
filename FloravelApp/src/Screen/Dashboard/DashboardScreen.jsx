// src/Screen/Dashboard/DashboardScreen.jsx
import { useState } from 'react';
import HomeHero from './components/HomeHero';
import HomeCheckIn from './components/HomeCheckIn';
import HomeAgenda from './components/HomeAgenda';
import BreathingExerciseCard from './components/BreathingExerciseCard';
import ArticleRecommendations from './components/ArticleRecommendations';
import HomeSeuEspaco from './components/HomeSeuEspaco';

// Modais interativos
import QuickDiaryModal from './components/QuickDiaryModal';
import TimeCapsuleModal from './components/TimeCapsuleModal';
import InviteModal from './components/InviteModal';
import HistoryModal from './components/HistoryModal';

export default function DashboardScreen({
  setActiveTab,
  userName = 'Mariana',
  agendamentos = [],
  flowersCount: externalFlowersCount,
  setFlowersCount: externalSetFlowersCount,
  onOpenInvite: externalOnOpenInvite,
}) {
  // Estados para abertura dos modais
  const [isDiaryModalOpen, setIsDiaryModalOpen] = useState(false);
  const [isCapsuleModalOpen, setIsCapsuleModalOpen] = useState(false);
  const [internalInviteOpen, setInternalInviteOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const handleOpenInvite = externalOnOpenInvite || (() => setInternalInviteOpen(true));
  const isInviteModalOpen = externalOnOpenInvite ? false : internalInviteOpen;

  // Estados de flores solidárias, humor e acionamento da pausa guiada
  const [internalFlowersCount, setInternalFlowersCount] = useState(12);
  const flowersCount =
    externalFlowersCount !== undefined ? externalFlowersCount : internalFlowersCount;
  const setFlowersCount = externalSetFlowersCount || setInternalFlowersCount;

  const [currentMood, setCurrentMood] = useState(null);
  const [pauseSignal, setPauseSignal] = useState(0);

  const navigate = (tab) => {
    if (setActiveTab) setActiveTab(tab);
  };

  const handleTriggerPause = () => {
    setPauseSignal((prev) => prev + 1);
  };

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
    <div className="@container min-h-full w-full max-w-6xl mx-auto space-y-8 @3xl:space-y-16 font-dmsans text-[#2B2829] pb-10 @3xl:pb-16 animate-fadeIn">
      {/* 1. HERO EDITORIAL (inspirado na linguagem Filko, adaptado ao Florável) */}
      <HomeHero
        userName={userName}
        postpartumWeek={7}
        flowersCount={flowersCount}
        targetFlowers={15}
        onStartPause={handleTriggerPause}
        onOpenDiary={() => setIsDiaryModalOpen(true)}
        onOpenInvite={handleOpenInvite}
        onGoNetwork={() => navigate('network')}
        onGoGroups={() => navigate('groups')}
        onGoLibrary={() => navigate('library')}
      />

      {/* 2. CHECK-IN EMOCIONAL + AGENDA (2 colunas assimétricas) */}
      <div className="grid gap-7 @3xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] @3xl:gap-12 items-start">
        <HomeCheckIn
          currentMood={currentMood}
          onSelectMood={(mood) => setCurrentMood(mood.id)}
          onOpenDiary={() => setIsDiaryModalOpen(true)}
          onStartPause={handleTriggerPause}
          onGoNetwork={() => navigate('network')}
          onGoHelp={() => navigate('network')}
          onGoQuiz={() => navigate('quiz')}
        />

        <HomeAgenda
          agendamentos={agendamentos}
          onGoBooking={() => navigate('booking')}
          onGoGroups={() => navigate('groups')}
          onGoNetwork={() => navigate('network')}
        />
      </div>

      {/* 3. AÇÃO PRINCIPAL DE CUIDADO: PAUSA GUIADA DE 1 MINUTO */}
      <BreathingExerciseCard startSignal={pauseSignal} />

      {/* 4. CONTEÚDO EDITORIAL RECOMENDADO */}
      <ArticleRecommendations onNavigateToLibrary={() => navigate('library')} />

      {/* 5. FAIXA COMPACTA "SEU ESPAÇO" (Microvitória, Recado, Cápsula, Mapa de Humor) */}
      <HomeSeuEspaco
        onCelebrateMicroVitoria={handleCelebrateMicroVitoria}
        onSendFlowerMural={handleRetribuirFlorMural}
        onOpenCapsuleModal={() => setIsCapsuleModalOpen(true)}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
        onOpenScreening={() => navigate('quiz')}
      />

      {/* MODAIS INTERATIVOS */}
      <QuickDiaryModal
        isOpen={isDiaryModalOpen}
        onClose={() => setIsDiaryModalOpen(false)}
        onSaveEntry={handleSaveDiary}
        onGoToFullQuiz={() => navigate('quiz')}
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
        onInviteSuccess={(bonus) => setFlowersCount((prev) => prev + bonus)}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        onStartQuiz={() => navigate('quiz')}
      />
    </div>
  );
}
