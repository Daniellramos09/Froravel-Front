import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, MessageSquare, Hand, 
  ShieldAlert, Users, Heart, Send, Star, CheckCircle, Sparkles, X, 
  Lock, Volume2, Subtitles, LayoutGrid, Maximize2, Smile, MoreVertical, Pin
} from 'lucide-react';
import DenunciaModal from '../Safety/DenunciaModal';

export default function MeetingRoomModal({ 
  isOpen, 
  onClose, 
  meetingTitle = "Vencendo a Depressão Pós-Parto",
  therapistName = "Dra. Helena Souza (CRP 06/142980)",
  meetingType = "Terapia em Grupo • Canal Host Florável"
}) {
  // Etapas: 'lobby' (Pronta para participar?), 'in_call' (Sala Google Meet Tela Cheia), 'post_call' (Você saiu da reunião + Feedback)
  const [stage, setStage] = useState('lobby');

  // Expectativa preenchida antes de entrar
  const [expectativa, setExpectativa] = useState('');

  // Controles de mídia e sala
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isCaptionsOn, setIsCaptionsOn] = useState(true);
  const [layoutMode, setLayoutMode] = useState('spotlight'); // 'spotlight' (Host em destaque) ou 'grid' (Mosaico)
  const [pinnedId, setPinnedId] = useState('therapist');
  const [sidePanel, setSidePanel] = useState('chat'); // null, 'chat', 'people'
  const [callSeconds, setCallSeconds] = useState(862); // 14:22
  const [floatingReactions, setFloatingReactions] = useState([]);

  // Modal de Denúncia
  const [isDenunciaOpen, setIsDenunciaOpen] = useState(false);
  const [denunciaTarget, setDenunciaTarget] = useState(null);

  // Chat da chamada
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Dra. Helena Souza (Host)', text: 'Bem-vindas ao nosso canal seguro, meninas. Fiquem à vontade para ligar a câmera ou apenas ouvir.', time: '19:02', isHost: true },
    { id: 2, sender: 'Camila Rocha', text: 'Boa noite! Muito bom estar aqui com vocês hoje.', time: '19:04' },
    { id: 3, sender: 'Beatriz Lima', text: 'Essa semana foi difícil com o sono da bebê, precisava muito dessa roda.', time: '19:06' },
  ]);
  const [newMsg, setNewMsg] = useState('');

  // Estados do Feedback Pós-Reunião
  const [rating, setRating] = useState(5);
  const [achouTexto, setAchouTexto] = useState('');
  const [atendeuExpectativa, setAtendeuExpectativa] = useState('sim');
  const [permitirPublicar, setPermitirPublicar] = useState(true);
  const [feedbackEnviado, setFeedbackEnviado] = useState(false);

  const participants = [
    { 
      id: 'therapist', 
      name: therapistName, 
      shortName: 'Dra. Helena Souza',
      role: 'Anfitriã (Host) • Psicóloga Perinatal', 
      isHost: true,
      isSpeaking: true, 
      img: '/img/fotopsicologo/psicologa1.jpg' 
    },
    { 
      id: 'user', 
      name: 'Você (Mariana Silva)', 
      shortName: 'Você (Mariana)',
      role: 'Participante', 
      isHost: false,
      isSpeaking: false, 
      isUser: true,
      img: '/img/fotomae/6.jpg' 
    },
    { 
      id: 'part1', 
      name: 'Camila Rocha', 
      shortName: 'Camila Rocha',
      role: 'Mãe do Gael (3m)', 
      isHost: false,
      isSpeaking: false, 
      img: '/img/variasMaes.jpg' 
    },
    { 
      id: 'part2', 
      name: 'Beatriz Lima', 
      shortName: 'Beatriz Lima',
      role: 'Mãe da Alice (5m)', 
      isHost: false,
      isSpeaking: false, 
      img: '/img/maeconversando.jpg' 
    },
  ];

  useEffect(() => {
    if (isOpen) {
      setStage('lobby');
      setFeedbackEnviado(false);
      setExpectativa('');
      setAchouTexto('');
      setRating(5);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Cronômetro da chamada
  useEffect(() => {
    if (!isOpen || stage !== 'in_call') return;
    const timer = setInterval(() => {
      setCallSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, stage]);

  if (!isOpen) return null;

  const formatDuration = (secs) => {
    const mins = Math.floor(secs / 60).toString().padStart(2, '0');
    const rem = (secs % 60).toString().padStart(2, '0');
    return `${mins}:${rem}`;
  };

  const triggerReaction = (emoji) => {
    const id = Date.now() + Math.random();
    setFloatingReactions((prev) => [...prev, { id, emoji }]);
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2400);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { 
        id: Date.now(), 
        sender: 'Você', 
        text: newMsg.trim(), 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }
    ]);
    setNewMsg('');
  };

  const handleReportUser = (userName) => {
    setDenunciaTarget(userName);
    setIsDenunciaOpen(true);
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    const novoFeedback = {
      id: `FB-${Date.now()}`,
      reuniao: meetingTitle,
      terapeuta: therapistName,
      tipo: meetingType,
      expectativa,
      rating,
      achouTexto,
      atendeuExpectativa,
      permitirPublicar,
      data: new Date().toISOString()
    };

    const existentes = JSON.parse(localStorage.getItem('floravel_feedbacks_reunioes') || '[]');
    localStorage.setItem('floravel_feedbacks_reunioes', JSON.stringify([novoFeedback, ...existentes]));

    setFeedbackEnviado(true);
    setTimeout(() => {
      onClose();
    }, 1600);
  };

  const pinnedParticipant = participants.find((p) => p.id === pinnedId) || participants[0];
  const otherParticipants = participants.filter((p) => p.id !== pinnedParticipant.id);

  return createPortal(
    <div className="fixed inset-0 z-[99999] w-screen h-dvh overflow-hidden font-dmsans select-none">
      
      {/* MODAL DE DENÚNCIA INTEGRADO */}
      <DenunciaModal 
        isOpen={isDenunciaOpen} 
        onClose={() => setIsDenunciaOpen(false)}
        targetUser={denunciaTarget || 'Participante na chamada'}
        context={`Canal de Reunião: ${meetingTitle}`}
      />

      {/* ===================================================================== */}
      {/* ETAPA 1: LOBBY ESTILO GOOGLE MEET ("PRONTA PARA PARTICIPAR?")          */}
      {/* ===================================================================== */}
      {stage === 'lobby' && (
        <div className="w-full h-full bg-[#FCF7F9] flex flex-col justify-between overflow-y-auto text-[#2B2829] animate-fadeIn">
          {/* Topo do Lobby */}
          <header className="w-full px-6 sm:px-10 py-4 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <img src="/img/fotoheader/logo.png" alt="Florável" className="h-9 w-auto object-contain" />
              <div>
                <span className="text-xl font-fraunces font-bold text-[#294D33]">florável</span>
                <span className="text-sm font-medium text-stone-500 ml-1.5">Meet</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2.5 text-right">
                <div>
                  <p className="text-xs font-bold text-stone-800">mariana.silva@floravel.com.br</p>
                  <p className="text-[11px] text-emerald-700 font-medium">Conta Verificada</p>
                </div>
                <img src="/img/fotomae/6.jpg" alt="Mariana" className="w-9 h-9 rounded-full object-cover border border-[#E8A9BB]" />
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-100 transition cursor-pointer"
              >
                ← Voltar ao painel
              </button>
            </div>
          </header>

          {/* Corpo Central do Lobby (2 Colunas igual ao Google Meet) */}
          <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Coluna Esquerda: Preview de Vídeo 16:9 */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="w-full aspect-video rounded-3xl bg-[#202124] overflow-hidden relative shadow-xl border border-stone-800 flex items-center justify-center">
                {isCameraOn ? (
                  <img 
                    src="/img/fotomae/6.jpg" 
                    alt="Preview da sua câmera" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-white">
                    <div className="w-24 h-24 rounded-full bg-[#294D33] flex items-center justify-center text-3xl font-fraunces font-bold mb-3 shadow-inner">
                      MS
                    </div>
                    <p className="text-sm text-stone-300 font-medium">Sua câmera está desligada</p>
                  </div>
                )}

                {/* Tag Nome no canto superior esquerdo */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-black/50 backdrop-blur-xs text-white text-xs font-semibold flex items-center gap-2">
                  <span>Mariana Silva (Você)</span>
                </div>

                {/* Indicador de Microfone Ativo no canto inferior esquerdo */}
                <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-xs flex items-center gap-2">
                  {isMicOn ? (
                    <>
                      <span className="flex items-center gap-0.5">
                        <span className="w-1 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      </span>
                      <span>Áudio funcionando</span>
                    </>
                  ) : (
                    <span className="text-red-300">Microfone desativado</span>
                  )}
                </div>

                {/* Botões de Câmera e Microfone Centralizados na Base */}
                <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setIsMicOn(!isMicOn)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition shadow-lg cursor-pointer ${
                      isMicOn 
                        ? 'bg-stone-800/80 hover:bg-stone-700 text-white border border-white/20' 
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                    title={isMicOn ? 'Desativar microfone' : 'Ativar microfone'}
                  >
                    {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCameraOn(!isCameraOn)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition shadow-lg cursor-pointer ${
                      isCameraOn 
                        ? 'bg-stone-800/80 hover:bg-stone-700 text-white border border-white/20' 
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                    title={isCameraOn ? 'Desativar câmera' : 'Ativar câmera'}
                  >
                    {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Coluna Direita: Detalhes da Sala Host + Expectativa + Botão Participar */}
            <div className="lg:col-span-5 bg-white p-7 sm:p-8 rounded-3xl border border-stone-200/90 shadow-sm flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF3ED] text-[#294D33] text-xs font-bold mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#294D33] animate-ping" />
                  Canal Host Ativo
                </span>

                <h1 className="text-2xl sm:text-3xl font-fraunces font-bold text-stone-900 leading-tight mb-2">
                  {meetingTitle}
                </h1>
                <p className="text-sm text-stone-600 mb-5">
                  Anfitriã da sala: <strong className="text-stone-900">{therapistName}</strong>
                </p>

                {/* Quem já está na chamada */}
                <div className="flex items-center gap-3 mb-6 p-3.5 rounded-2xl bg-[#FCF7F9] border border-[#E8A9BB]/40">
                  <div className="flex -space-x-2.5 overflow-hidden shrink-0">
                    <img src="/img/fotopsicologo/psicologa1.jpg" alt="Host" className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" />
                    <img src="/img/variasMaes.jpg" alt="Mãe" className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" />
                    <img src="/img/maeconversando.jpg" alt="Mãe" className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" />
                  </div>
                  <p className="text-xs text-stone-700 font-medium">
                    <strong>Dra. Helena</strong> e outras 2 mães já estão na sala
                  </p>
                </div>

                {/* Pergunta Pré-Reunião: O que você quer da sua reunião? */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    O que você quer da sua reunião hoje? (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={expectativa}
                    onChange={(e) => setExpectativa(e.target.value)}
                    placeholder="Ex: Quero desabafar sobre o cansaço e ouvir outras mães..."
                    className="w-full p-3 text-sm rounded-2xl border border-stone-200 bg-stone-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#294D33] resize-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setStage('in_call')}
                  className="w-full py-4 px-8 rounded-full bg-[#294D33] hover:bg-[#1f3c27] text-white font-bold text-base shadow-md transition flex items-center justify-center gap-2.5 cursor-pointer active:scale-98"
                >
                  <Video size={20} />
                  <span>Participar agora</span>
                </button>
                <p className="text-[11px] text-center text-stone-400 flex items-center justify-center gap-1">
                  <Lock size={11} /> Reunião interna protegida • Sem links externos
                </p>
              </div>
            </div>

          </main>

          <footer className="py-3 text-center text-xs text-stone-400">
            Florável Meet • Ambiente exclusivo e moderado para acolhimento materno
          </footer>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ETAPA 2: SALA DE REUNIÃO TELA CHEIA (ESTILO GOOGLE MEET OFICIAL)       */}
      {/* ===================================================================== */}
      {stage === 'in_call' && (
        <div className="w-full h-full bg-[#202124] text-white flex flex-col justify-between overflow-hidden">
          
          {/* TOPO DA SALA */}
          <header className="h-14 px-5 flex items-center justify-between border-b border-white/10 shrink-0 bg-[#202124]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>AO VIVO • {formatDuration(callSeconds)}</span>
              </div>
              <h2 className="font-bold text-sm sm:text-base text-white truncate">{meetingTitle}</h2>
              <span className="hidden md:inline-block text-xs text-stone-400 border-l border-white/15 pl-3 truncate">
                Host: {therapistName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLayoutMode(layoutMode === 'spotlight' ? 'grid' : 'spotlight')}
                className="px-3 py-1.5 rounded-lg bg-[#3c4043] hover:bg-[#4a4e52] text-xs font-medium text-stone-200 flex items-center gap-1.5 transition cursor-pointer"
                title="Alternar modo de visualização"
              >
                <LayoutGrid size={15} />
                <span className="hidden sm:inline">
                  {layoutMode === 'spotlight' ? 'Ver em Grade' : 'Destacar Host'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleReportUser('Participante na reunião')}
                className="px-3 py-1.5 rounded-lg bg-red-950/90 hover:bg-red-900 border border-red-700/60 text-red-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                title="Denunciar ofensa ou xingamento na chamada"
              >
                <ShieldAlert size={15} className="text-red-400" />
                <span>Denunciar Conduta</span>
              </button>
            </div>
          </header>

          {/* CORPO PRINCIPAL: PALCO DE VÍDEOS + PAINEL LATERAL */}
          <div className="flex-1 flex min-h-0 p-3 sm:p-4 gap-3 overflow-hidden relative">
            
            {/* REAÇÕES FLUTUANTES */}
            <div className="absolute bottom-6 left-8 z-40 pointer-events-none flex flex-col-reverse gap-2">
              {floatingReactions.map((r) => (
                <div key={r.id} className="text-4xl animate-bounce drop-shadow-lg">
                  {r.emoji}
                </div>
              ))}
            </div>

            {/* ÁREA DE VÍDEOS */}
            <div className="flex-1 flex flex-col min-h-0 relative">
              {layoutMode === 'spotlight' ? (
                /* MODO SPOTLIGHT: HOST GRANDE + BARRA LATERAL DE PARTICIPANTES */
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0">
                  
                  {/* Vídeo Principal Fixado (Host / Psicóloga) */}
                  <div className="lg:col-span-9 rounded-2xl bg-[#303134] overflow-hidden relative border-2 border-emerald-500/70 shadow-lg flex items-center justify-center min-h-[260px]">
                    {pinnedParticipant.isUser && !isCameraOn ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-[#294D33] flex items-center justify-center text-3xl font-bold">
                          MS
                        </div>
                        <p className="text-xs text-stone-400 mt-2">Câmera desativada</p>
                      </div>
                    ) : (
                      <img 
                        src={pinnedParticipant.img} 
                        alt={pinnedParticipant.name} 
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* Badge Superior Esquerdo: Host / Falando */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      {pinnedParticipant.isHost && (
                        <span className="px-3 py-1 rounded-full bg-[#294D33] text-white text-xs font-bold shadow-md">
                          Anfitriã da Roda (Host)
                        </span>
                      )}
                      {pinnedParticipant.isSpeaking && (
                        <span className="px-3 py-1 rounded-full bg-black/70 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                          <Volume2 size={14} className="animate-pulse" />
                          <span>Falando agora</span>
                        </span>
                      )}
                    </div>

                    {/* Botão Denunciar no Card */}
                    {!pinnedParticipant.isUser && (
                      <button
                        type="button"
                        onClick={() => handleReportUser(pinnedParticipant.name)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-red-700 text-stone-300 hover:text-white transition cursor-pointer"
                        title={`Denunciar ${pinnedParticipant.shortName}`}
                      >
                        <ShieldAlert size={16} />
                      </button>
                    )}

                    {/* Nome na Base */}
                    <div className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-xl bg-black/65 backdrop-blur-xs text-white text-xs sm:text-sm font-semibold flex items-center gap-2">
                      <span>{pinnedParticipant.name}</span>
                      <Mic size={14} className="text-emerald-400" />
                    </div>
                  </div>

                  {/* Tira Lateral de Outras Participantes */}
                  <div className="lg:col-span-3 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto">
                    {otherParticipants.map((p) => (
                      <div 
                        key={p.id}
                        className="flex-1 min-w-[180px] min-h-[130px] rounded-2xl bg-[#303134] overflow-hidden relative border border-white/10 group flex items-center justify-center"
                      >
                        {p.isUser && !isCameraOn ? (
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-[#294D33] flex items-center justify-center text-lg font-bold">
                              MS
                            </div>
                            <span className="text-[11px] text-stone-400 mt-1">Câmera desligada</span>
                          </div>
                        ) : (
                          <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                        )}

                        {p.isUser && isHandRaised && (
                          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-amber-400 text-stone-950 text-[10px] font-extrabold flex items-center gap-1 shadow">
                            <Hand size={11} /> Mão levantada
                          </div>
                        )}

                        {/* Ações Rápidas no Hover: Fixar ou Denunciar */}
                        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button
                            type="button"
                            onClick={() => setPinnedId(p.id)}
                            className="p-1.5 rounded-lg bg-black/70 hover:bg-black text-white cursor-pointer"
                            title="Destacar este vídeo"
                          >
                            <Pin size={13} />
                          </button>
                          {!p.isUser && (
                            <button
                              type="button"
                              onClick={() => handleReportUser(p.name)}
                              className="p-1.5 rounded-lg bg-black/70 hover:bg-red-600 text-red-300 hover:text-white cursor-pointer"
                              title={`Denunciar ${p.shortName}`}
                            >
                              <ShieldAlert size={13} />
                            </button>
                          )}
                        </div>

                        <div className="absolute bottom-2.5 left-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-xs text-[11px] font-semibold flex items-center justify-between">
                          <span className="truncate">{p.shortName}</span>
                          {p.isUser ? (
                            isMicOn ? <Mic size={12} className="text-emerald-400 shrink-0" /> : <MicOff size={12} className="text-red-400 shrink-0" />
                          ) : (
                            <Mic size={12} className="text-stone-300 shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* MODO GRADE 2X2 IGUAL AO GOOGLE MEET */
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-0">
                  {participants.map((p) => (
                    <div 
                      key={p.id}
                      className={`rounded-2xl bg-[#303134] overflow-hidden relative flex items-center justify-center group ${
                        p.isSpeaking ? 'border-2 border-emerald-400' : 'border border-white/10'
                      }`}
                    >
                      {p.isUser && !isCameraOn ? (
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-20 h-20 rounded-full bg-[#294D33] flex items-center justify-center text-2xl font-bold">
                            MS
                          </div>
                          <span className="text-xs text-stone-400 mt-2">Câmera desligada</span>
                        </div>
                      ) : (
                        <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                      )}

                      {!p.isUser && (
                        <button
                          type="button"
                          onClick={() => handleReportUser(p.name)}
                          className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 hover:bg-red-600 text-xs text-stone-200 hover:text-white flex items-center gap-1 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        >
                          <ShieldAlert size={13} /> Denunciar
                        </button>
                      )}

                      <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/65 backdrop-blur-xs text-xs font-semibold flex items-center gap-2">
                        <span>{p.name}</span>
                        {p.isHost && <span className="text-emerald-400">(Host)</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* BARRA DE LEGENDAS AO VIVO (CC) */}
              {isCaptionsOn && (
                <div className="mt-2.5 mx-auto max-w-3xl w-full px-4 py-2 rounded-xl bg-black/75 border border-white/10 text-center text-xs sm:text-sm text-stone-100 shrink-0">
                  <span className="text-emerald-400 font-bold mr-2">[Dra. Helena Souza]:</span>
                  "Lembrem-se de que pedir ajuda no puerpério não é sinal de fraqueza, é o maior gesto de cuidado com vocês mesmas..."
                </div>
              )}
            </div>

            {/* PAINEL LATERAL DIREITO (CHAT OU LISTA DE PARTICIPANTES) */}
            {sidePanel && (
              <aside className="w-80 sm:w-88 bg-white text-[#2B2829] rounded-2xl flex flex-col overflow-hidden shadow-2xl shrink-0 animate-fadeIn">
                {/* Abas do Painel Lateral */}
                <div className="p-3 border-b border-stone-200 flex items-center justify-between">
                  <div className="flex gap-1 bg-stone-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setSidePanel('chat')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        sidePanel === 'chat' ? 'bg-white text-[#294D33] shadow-2xs' : 'text-stone-600'
                      }`}
                    >
                      Mensagens
                    </button>
                    <button
                      type="button"
                      onClick={() => setSidePanel('people')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        sidePanel === 'people' ? 'bg-white text-[#294D33] shadow-2xs' : 'text-stone-600'
                      }`}
                    >
                      Pessoas ({participants.length})
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSidePanel(null)}
                    className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {sidePanel === 'chat' ? (
                  /* ABA DE CHAT DA REUNIÃO */
                  <>
                    <div className="px-4 py-2 bg-[#FCF7F9] border-b border-stone-100 text-[11px] text-stone-500">
                      As mensagens são visíveis apenas para as participantes na chamada e moderadas pela anfitriã.
                    </div>

                    <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                      {chatMessages.map((m) => (
                        <div key={m.id} className={`p-3 rounded-2xl text-xs ${m.isHost ? 'bg-[#EBF3ED] border border-[#294D33]/20' : 'bg-stone-100'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <strong className={m.isHost ? 'text-[#294D33]' : 'text-stone-900'}>{m.sender}</strong>
                            <span className="text-[10px] text-stone-400">{m.time}</span>
                          </div>
                          <p className="text-stone-700 leading-relaxed">{m.text}</p>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="p-3 border-t border-stone-200 flex gap-2">
                      <input
                        type="text"
                        value={newMsg}
                        onChange={(e) => setNewMsg(e.target.value)}
                        placeholder="Enviar mensagem para todas..."
                        className="flex-1 px-3.5 py-2.5 text-xs rounded-full bg-stone-100 border border-stone-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#294D33]"
                      />
                      <button
                        type="submit"
                        className="w-9 h-9 rounded-full bg-[#294D33] text-white flex items-center justify-center hover:bg-[#1f3c27] shrink-0 cursor-pointer"
                      >
                        <Send size={14} />
                      </button>
                    </form>
                  </>
                ) : (
                  /* ABA DE PESSOAS + BOTÃO DE DENÚNCIA POR CONTA */
                  <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                      Na chamada ({participants.length})
                    </p>
                    {participants.map((p) => (
                      <div key={p.id} className="flex items-center justify-between gap-2 p-2.5 rounded-2xl hover:bg-stone-50 border border-stone-100">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img src={p.img} alt={p.shortName} className="w-9 h-9 rounded-full object-cover shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-stone-900 truncate">{p.shortName}</p>
                            <p className="text-[11px] text-stone-500 truncate">{p.role}</p>
                          </div>
                        </div>

                        {!p.isUser && (
                          <button
                            type="button"
                            onClick={() => handleReportUser(p.name)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-red-600 hover:bg-red-50 border border-red-200 shrink-0 cursor-pointer"
                            title="Denunciar esta conta por comentário ofensivo ou xingamento"
                          >
                            Denunciar
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </aside>
            )}
          </div>

          {/* BARRA INFERIOR DE CONTROLES (ESTILO GOOGLE MEET) */}
          <footer className="h-20 px-4 sm:px-8 bg-[#202124] border-t border-white/10 flex items-center justify-between shrink-0">
            
            {/* Esquerda: Horário e Código da Sala */}
            <div className="hidden md:flex items-center gap-3 text-xs text-stone-300 font-medium">
              <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="text-stone-600">|</span>
              <span className="font-mono text-stone-400">flo-roda-segura</span>
            </div>

            {/* Centro: Controles de Áudio, Vídeo, Legenda, Reações, Mão e Sair */}
            <div className="flex items-center gap-2.5 sm:gap-3 mx-auto md:mx-0">
              <button
                type="button"
                onClick={() => setIsMicOn(!isMicOn)}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition cursor-pointer ${
                  isMicOn ? 'bg-[#3c4043] hover:bg-[#4a4e52] text-white' : 'bg-[#ea4335] hover:bg-red-600 text-white'
                }`}
                title={isMicOn ? 'Desativar microfone' : 'Ativar microfone'}
              >
                {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
              </button>

              <button
                type="button"
                onClick={() => setIsCameraOn(!isCameraOn)}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition cursor-pointer ${
                  isCameraOn ? 'bg-[#3c4043] hover:bg-[#4a4e52] text-white' : 'bg-[#ea4335] hover:bg-red-600 text-white'
                }`}
                title={isCameraOn ? 'Desativar câmera' : 'Ativar câmera'}
              >
                {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
              </button>

              <button
                type="button"
                onClick={() => setIsCaptionsOn(!isCaptionsOn)}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition cursor-pointer ${
                  isCaptionsOn ? 'bg-[#8ab4f8] text-stone-950' : 'bg-[#3c4043] hover:bg-[#4a4e52] text-white'
                }`}
                title="Legendas ao vivo (CC)"
              >
                <Subtitles size={20} />
              </button>

              <button
                type="button"
                onClick={() => triggerReaction('❤️')}
                className="w-11 h-11 rounded-full bg-[#3c4043] hover:bg-[#4a4e52] text-white flex items-center justify-center transition cursor-pointer"
                title="Enviar reação de carinho"
              >
                <Heart size={19} className="text-pink-400 fill-pink-400" />
              </button>

              <button
                type="button"
                onClick={() => setIsHandRaised(!isHandRaised)}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition cursor-pointer ${
                  isHandRaised ? 'bg-amber-400 text-stone-950' : 'bg-[#3c4043] hover:bg-[#4a4e52] text-white'
                }`}
                title="Levantar a mão para falar"
              >
                <Hand size={20} />
              </button>

              {/* BOTÃO DE SAIR DA CHAMADA (PÍLULA VERMELHA DO GOOGLE MEET) */}
              <button
                type="button"
                onClick={() => setStage('post_call')}
                className="px-6 h-11 rounded-full bg-[#ea4335] hover:bg-red-600 text-white font-bold text-sm flex items-center gap-2 transition shadow-md cursor-pointer ml-2"
                title="Sair da reunião"
              >
                <PhoneOff size={18} />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>

            {/* Direita: Botões de Pessoas e Chat */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSidePanel(sidePanel === 'people' ? null : 'people')}
                className={`p-2.5 rounded-full transition cursor-pointer relative ${
                  sidePanel === 'people' ? 'bg-[#8ab4f8] text-stone-950' : 'text-stone-300 hover:bg-[#3c4043]'
                }`}
                title="Participantes"
              >
                <Users size={20} />
              </button>

              <button
                type="button"
                onClick={() => setSidePanel(sidePanel === 'chat' ? null : 'chat')}
                className={`p-2.5 rounded-full transition cursor-pointer ${
                  sidePanel === 'chat' ? 'bg-[#8ab4f8] text-stone-950' : 'text-stone-300 hover:bg-[#3c4043]'
                }`}
                title="Chat da reunião"
              >
                <MessageSquare size={20} />
              </button>
            </div>

          </footer>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ETAPA 3: PÓS-REUNIÃO ("VOCÊ SAIU DA REUNIÃO" + AVALIAÇÃO)              */}
      {/* ===================================================================== */}
      {stage === 'post_call' && (
        <div className="w-full h-full bg-[#FCF7F9] flex flex-col items-center justify-center p-4 overflow-y-auto text-[#2B2829] animate-fadeIn">
          <div className="max-w-lg w-full bg-white rounded-3xl p-7 sm:p-9 shadow-xl border border-stone-200">
            
            {feedbackEnviado ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={36} />
                </div>
                <h3 className="text-2xl font-fraunces font-bold text-stone-900">
                  Feedback registrado com carinho!
                </h3>
                <p className="text-sm text-stone-600">
                  Obrigada por compartilhar como foi a sua experiência. Voltando para o seu painel...
                </p>
              </div>
            ) : (
              <>
                <div className="text-center border-b border-stone-100 pb-5 mb-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-bold mb-2">
                    Reunião finalizada
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-fraunces font-bold text-stone-900">
                    Você saiu da reunião
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">{meetingTitle}</p>

                  <div className="mt-4 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStage('in_call')}
                      className="px-4 py-2 rounded-full border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50 transition cursor-pointer"
                    >
                      Voltar para a sala
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-full text-xs font-bold text-[#294D33] hover:underline cursor-pointer"
                    >
                      Ir direto ao painel
                    </button>
                  </div>
                </div>

                {expectativa && (
                  <div className="p-3 bg-[#FCF7F9] rounded-2xl border border-[#E8A9BB]/40 text-xs text-stone-700 mb-4">
                    <strong>O que você esperava antes de entrar:</strong> "{expectativa}"
                  </div>
                )}

                <form onSubmit={handleSubmitFeedback} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 text-center">
                      O que você achou da reunião?
                    </label>
                    <div className="flex items-center justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 transition-transform hover:scale-125 cursor-pointer"
                        >
                          <Star
                            size={32}
                            className={star <= rating ? "text-amber-400 fill-amber-400" : "text-stone-200"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Estava alinhado com as suas expectativas?
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'sim', label: 'Sim, muito' },
                        { id: 'parcialmente', label: 'Em parte' },
                        { id: 'nao', label: 'Não' },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setAtendeuExpectativa(opt.id)}
                          className={`py-2 px-3 text-xs font-bold rounded-xl border transition cursor-pointer ${
                            atendeuExpectativa === opt.id
                              ? 'bg-[#294D33] text-white border-[#294D33]'
                              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Conte o que você achou do encontro:
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={achouTexto}
                      onChange={(e) => setAchouTexto(e.target.value)}
                      placeholder="Escreva como se sentiu na roda e o que achou da condução..."
                      className="w-full p-3.5 text-sm rounded-2xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#294D33] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[#294D33] text-white text-sm font-bold hover:bg-[#1f3c27] transition shadow-md cursor-pointer"
                  >
                    Enviar Feedback e Concluir
                  </button>
                </form>
              </>
            )}

          </div>
        </div>
      )}

    </div>,
    document.body
  );
}
