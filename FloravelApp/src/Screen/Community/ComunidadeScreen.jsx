import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Calendar, Video, HeartHandshake, 
  Users, Leaf, ShieldAlert, Star
} from 'lucide-react';
import MeetingRoomModal from '../../Components/Meeting/MeetingRoomModal';
import DenunciaModal from '../../Components/Safety/DenunciaModal';

const FILTER_OPTIONS = [
  { id: 'todas', label: 'Todas as rodas' },
  { id: 'ao_vivo', label: '🔴 Ao vivo agora' },
  { id: 'depressao_pos_parto', label: 'Depressão Pós-Parto' },
  { id: 'sobrecarga_burnout', label: 'Sobrecarga & Burnout' },
  { id: 'ansiedade_sono', label: 'Ansiedade & Sono' },
  { id: 'solidao_rede', label: 'Mães de 1ª Viagem' },
];

const ALL_GROUPS = [
  {
    id: 'grp-1',
    category: 'depressao_pos_parto',
    theme: "SAÚDE EMOCIONAL",
    title: "Vencendo a Depressão Pós-Parto",
    desc: "Espaço acolhedor para falar sobre o vazio, a culpa e a tristeza no puerpério, sem julgamentos.",
    date: "Hoje, às 19:00",
    prof: "Dra. Helena Souza",
    spots: "11/15",
    isLiveNow: true,
    img: "/img/variasMaes.jpg"
  },
  {
    id: 'grp-2',
    category: 'sobrecarga_burnout',
    theme: "AUTOCUIDADO & LIMITES",
    title: "Sobrecarga Materna e Burnout",
    desc: "Entre cuidados com o bebê, casa e rotina, onde você fica? Encontro para dividir o peso do dia a dia.",
    date: "Amanhã, às 15:00",
    prof: "Dra. Camila Santos",
    spots: "8/12",
    isLiveNow: false,
    img: "/img/maeDescansando.jpg"
  },
  {
    id: 'grp-3',
    category: 'ansiedade_sono',
    theme: "CALMA & DESCANSO",
    title: "Ansiedade e Noites em Claro",
    desc: "Conversa guiada sobre a privação de sono e a preocupação constante com o bem-estar do bebê.",
    date: "Hoje, às 20:30",
    prof: "Dr. Rafael Lima",
    spots: "9/15",
    isLiveNow: true,
    img: "/img/maeconversando.jpg"
  },
  {
    id: 'grp-4',
    category: 'solidao_rede',
    theme: "NOVOS COMEÇOS",
    title: "Mães de Primeira Viagem",
    desc: "Descobertas, inseguranças e pequenos começos. Um encontro para criar rede com outras mães.",
    date: "Sexta-feira, às 18:30",
    prof: "Dra. Beatriz Nogueira",
    spots: "10/15",
    isLiveNow: false,
    img: "/img/fotomae/fotomae1.jpg"
  }
];

export default function ComunidadeScreen() {
  const [selectedFilter, setSelectedFilter] = useState('todas');
  const [recommendedCat, setRecommendedCat] = useState(null);
  const [activeMeeting, setActiveMeeting] = useState(null);
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);
  const [isDenunciaOpen, setIsDenunciaOpen] = useState(false);
  const [subscribedGroups, setSubscribedGroups] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('floravel_onboarding_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.desafio) {
          setRecommendedCat(parsed.desafio);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const filteredGroups = ALL_GROUPS.filter((g) => {
    if (selectedFilter === 'todas') return true;
    if (selectedFilter === 'ao_vivo') return g.isLiveNow;
    return g.category === selectedFilter;
  }).sort((a, b) => {
    if (a.category === recommendedCat) return -1;
    if (b.category === recommendedCat) return 1;
    return 0;
  });

  const handleSubscribe = (groupId) => {
    setSubscribedGroups(prev => ({ ...prev, [groupId]: true }));
  };

  const handleOpenRoom = (group) => {
    setActiveMeeting(group);
    setIsMeetingOpen(true);
  };

  return (
    <div className="animate-fadeIn font-dmsans min-h-full pb-16 max-w-5xl mx-auto">
      
      {/* CANAL HOST DE REUNIÃO TELA CHEIA */}
      {isMeetingOpen && activeMeeting && (
        <MeetingRoomModal
          isOpen={isMeetingOpen}
          onClose={() => setIsMeetingOpen(false)}
          meetingTitle={activeMeeting.title}
          therapistName={activeMeeting.prof}
          meetingType="Roda de Conversa Florável"
        />
      )}

      {/* MODAL DE DENÚNCIA */}
      <DenunciaModal
        isOpen={isDenunciaOpen}
        onClose={() => setIsDenunciaOpen(false)}
        context="Rodas de Conversa"
      />

      {/* CABEÇALHO LIMPO */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-[#516B55] text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <MessageSquare size={14} /> JUNTAS, SOMOS REDE
          </p>
          <h1 className="text-2xl sm:text-4xl font-fraunces font-bold text-[#294D33]">
            Rodas de Conversa
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-0.5">
            Escolha um tema abaixo e participe dos encontros por vídeo dentro da plataforma.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsDenunciaOpen(true)}
          className="px-3.5 py-2 rounded-full bg-white border border-stone-200 text-xs font-bold text-stone-500 hover:text-red-600 hover:border-red-200 flex items-center gap-1.5 self-start sm:self-auto transition cursor-pointer shrink-0"
        >
          <ShieldAlert size={14} className="text-red-500" />
          <span>Denunciar</span>
        </button>
      </div>

      {/* BARRA DE FILTROS SELECIONÁVEIS (SCROLL HORIZONTAL NO MOBILE) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap no-scrollbar">
        {FILTER_OPTIONS.map((filter) => {
          const isActive = selectedFilter === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#294D33] text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-[#E8A9BB] hover:text-[#294D33]'
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* GRID DE RODAS (1 COLUNA NO MOBILE, 2 NO DESKTOP) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGroups.map((group) => {
          const isSubscribed = subscribedGroups[group.id];
          const isRecommended = recommendedCat === group.category;

          return (
            <div 
              key={group.id} 
              className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden flex flex-col hover:shadow-md transition group"
            >
              {/* IMAGEM DO CARD */}
              <div className="h-44 sm:h-48 relative overflow-hidden bg-stone-100">
                <img 
                  src={group.img} 
                  alt={group.title} 
                  className="w-full h-full object-cover object-[center_30%] transition duration-500 group-hover:scale-105"
                />

                {isRecommended && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#294D33] text-white text-[11px] font-bold flex items-center gap-1 shadow-sm">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span>Recomendado para você</span>
                  </div>
                )}

                {group.isLiveNow && (
                  <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    AO VIVO
                  </span>
                )}
              </div>
              
              {/* CONTEÚDO DO CARD */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#516B55]">
                    {group.theme}
                  </span>
                  <h3 className="text-xl font-fraunces font-bold text-stone-900 mt-1 mb-2 leading-snug">
                    {group.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-5">
                    {group.desc}
                  </p>
                </div>
                
                <div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5 text-xs text-stone-600 font-medium border-t border-stone-100 pt-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-[#516B55]" /> {group.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <HeartHandshake size={14} className="text-[#516B55]" /> {group.prof}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users size={14} className="text-[#516B55]" /> {isSubscribed ? 'Inscrita' : `${group.spots} vagas`}
                    </span>
                  </div>
                  
                  {(isSubscribed || group.isLiveNow) ? (
                    <button 
                      type="button"
                      onClick={() => handleOpenRoom(group)}
                      className="w-full py-3.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 bg-[#294D33] text-white hover:bg-[#1f3c27] transition shadow-xs cursor-pointer active:scale-98"
                    >
                      <Video size={17} />
                      <span>Entrar no Canal da Reunião</span>
                    </button>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => handleSubscribe(group.id)}
                      className="w-full py-3.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 bg-[#F4DDE5] text-[#294D33] hover:bg-[#E8A9BB]/50 transition cursor-pointer"
                    >
                      <span>Garantir minha vaga</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
