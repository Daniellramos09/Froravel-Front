import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  MessageSquare,
  Share2,
  ShieldCheck,
  ShieldAlert,
  Send,
  X,
  Sparkles,
  Heart,
  Volume2,
  VolumeX,
  FileText,
  Copy,
  PhoneCall,
  CheckCircle2,
  Lock
} from 'lucide-react';

/**
 * Gera um aviso sonoro suave e ultra-rápido (~0.35s) nativo via Web Audio API
 * quando uma mãe entra ou reconecta na sala de acolhimento.
 */
function playSoftArrivalChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const playTone = (freq, startOffset, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + startOffset);
      gain.gain.setValueAtTime(0.001, now + startOffset);
      gain.gain.exponentialRampToValueAtTime(0.08, now + startOffset + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + startOffset);
      osc.stop(now + startOffset + duration + 0.02);
    };

    playTone(587.33, 0, 0.16);     // D5 suave
    playTone(880.0, 0.11, 0.24);   // A5 harmônico rápido (~0.35s total)
    setTimeout(() => {
      try { ctx.close(); } catch (_) {}
    }, 600);
  } catch (_) {}
}

// Gerenciador singleton de câmera: evita pedir permissão 2x em StrictMode ou trocas de tela
const psiCamManager = {
  stream: null,
  pending: null,
  refCount: 0,
  stopTimer: null,
  async acquire() {
    this.refCount += 1;
    if (this.stopTimer) {
      clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }
    if (this.stream && this.stream.active) return this.stream;
    if (this.pending) return this.pending;
    if (!navigator.mediaDevices?.getUserMedia) return null;

    this.pending = navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((s) => {
        this.stream = s;
        this.pending = null;
        return s;
      })
      .catch(() => {
        this.pending = null;
        return null;
      });
    return this.pending;
  },
  release() {
    this.refCount = Math.max(0, this.refCount - 1);
    if (this.refCount === 0 && !this.stopTimer) {
      this.stopTimer = setTimeout(() => {
        if (this.refCount === 0 && this.stream) {
          this.stream.getTracks().forEach((t) => t.stop());
          this.stream = null;
        }
        this.stopTimer = null;
      }, 200);
    }
  },
};

function LiveWebcamPreview({ stream }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) return null;

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="absolute inset-0 w-full h-full object-cover -scale-x-100"
    />
  );
}

/* ---------- Dados da Sessão ---------- */
const sessaoInicial = {
  titulo: 'Roda de Acolhimento: Os Primeiros Meses',
  tipo: 'grupo', // 'grupo' | 'individual'
  status: 'Pronta para Iniciar',
  data: 'Hoje, 23 de Outubro',
  horario: '18:00 – 19:30',
  vagas: 5,
  participantes: [
    { id: 1, nome: 'Mariana Silva', status: 'Conectada', bebe: 'Bento (3m)', micOn: true, camOn: true },
    { id: 2, nome: 'Beatriz Santos', status: 'Conectada', bebe: 'Gael (2m)', micOn: false, camOn: true },
    { id: 3, nome: 'Larissa Oliveira', status: 'Aguardando', bebe: 'Maya (4m)', micOn: false, camOn: false },
  ],
  mensagensIniciais: [
    { remetente: 'Sistema', texto: 'Sala criptografada ponta a ponta criada em conformidade com o CFP.', hora: '17:58' },
    { remetente: 'Mariana Silva', texto: 'Boa noite, doutora! Cheguei um pouquinho antes para testar o som.', hora: '18:00' },
  ],
};

export default function SalaAcolhimento() {
  const navigate = useNavigate();
  const [emChamada, setEmChamada] = useState(false);
  const [micLigado, setMicLigado] = useState(true);
  const [camLigada, setCamLigada] = useState(true);
  const [telaCompartilhada, setTelaCompartilhada] = useState(false);
  const [chatAberto, setChatAberto] = useState(true);
  const [mensagens, setMensagens] = useState(sessaoInicial.mensagensIniciais);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [confirmarSaida, setConfirmarSaida] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const [localStream, setLocalStream] = useState(null);

  // Participantes e aviso sonoro/visual rápido de entrada na sala
  const [participantes, setParticipantes] = useState(sessaoInicial.participantes);
  const [somEntradaAtivo, setSomEntradaAtivo] = useState(true);
  const [entradaBanner, setEntradaBanner] = useState('');

  // Painel Lateral: 'chat' | 'notas' (Bloco Efêmero Zero Prontuário)
  const [painelLateralTab, setPainelLateralTab] = useState('chat');
  const [notasEfemeras, setNotasEfemeras] = useState('');
  const [notasCopiadas, setNotasCopiadas] = useState(false);

  // Modal de Salvaguarda Clínica (Menor de Idade ECA Art. 17 & Protocolo Emergência)
  const [salvaguardaOpen, setSalvaguardaOpen] = useState(false);
  const [salvaguardaAba, setSalvaguardaAba] = useState('menor');
  const [maeSinalizada, setMaeSinalizada] = useState(sessaoInicial.participantes[2]?.nome || 'Larissa Oliveira');
  const [respNome, setRespNome] = useState('');
  const [respTelefone, setRespTelefone] = useState('');
  const [sinalizacaoSucesso, setSinalizacaoSucesso] = useState(false);

  const notificarEntradaMae = (nomeMae) => {
    setParticipantes((prev) =>
      prev.map((p) => (p.nome === nomeMae ? { ...p, status: 'Conectada', micOn: true, camOn: true } : p))
    );
    setEntradaBanner(`${nomeMae} conectou seu áudio e vídeo na sala.`);
    if (somEntradaAtivo) {
      playSoftArrivalChime();
    }
    setTimeout(() => setEntradaBanner(''), 4200);
  };

  // Captura única da Webcam na tela da Psicóloga (Lobby e Chamada Ao Vivo sem pedir permissão 2x)
  useEffect(() => {
    let cancelled = false;
    let acquired = false;

    if (camLigada) {
      acquired = true;
      psiCamManager.acquire().then((stream) => {
        if (!cancelled) {
          setLocalStream(stream);
        }
      });
    } else {
      setLocalStream(null);
    }

    return () => {
      cancelled = true;
      if (acquired) {
        psiCamManager.release();
      }
    };
  }, [camLigada]);

  // Cronômetro da chamada & Sincronização Ao Vivo com App da Mãe (BroadcastChannel + Spring Boot)
  useEffect(() => {
    let interval = null;
    if (emChamada) {
      fetch('http://localhost:8080/api/sala-ao-vivo/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'AO_VIVO' })
      }).catch(() => {});

      interval = setInterval(() => {
        setSegundos((s) => s + 1);
      }, 1000);

      // Ao entrar na sala ao vivo, simula a chegada da mãe que estava "Aguardando" após 3,5s com som rápido
      const timerChegada = setTimeout(() => {
        notificarEntradaMae('Larissa Oliveira');
      }, 3500);

      return () => {
        clearInterval(interval);
        clearTimeout(timerChegada);
      };
    } else {
      setSegundos(0);
    }
    return () => clearInterval(interval);
  }, [emChamada]);

  useEffect(() => {
    let bc = null;
    try {
      bc = new BroadcastChannel('floravel_sala_ao_vivo');
      bc.onmessage = (ev) => {
        const data = ev.data || {};
        if (data.type === 'CHAT_MSG' && data.msg) {
          setMensagens((prev) => [
            ...prev,
            { remetente: data.msg.sender, texto: data.msg.text, hora: data.msg.time }
          ]);
        } else if (data.type === 'PARTICIPANT_JOINED' && data.nome) {
          notificarEntradaMae(data.nome);
        }
      };
    } catch (_) {}

    const poll = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:8080/api/sala-ao-vivo/estado');
        if (res.ok) {
          const estado = await res.json();
          if (Array.isArray(estado.mensagens) && estado.mensagens.length > 0) {
            setMensagens(
              estado.mensagens.map((m) => ({
                remetente: m.sender,
                texto: m.text,
                hora: m.time
              }))
            );
          }
        }
      } catch (_) {}
    }, 1500);

    return () => {
      clearInterval(poll);
      if (bc) bc.close();
    };
  }, []);

  const formatarTempo = (totalSec) => {
    const min = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const sec = String(totalSec % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  const handleEnviarMensagem = async (e) => {
    e.preventDefault();
    if (!novaMensagem.trim()) return;

    const texto = novaMensagem.trim();
    const agora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const msg = {
      remetente: 'Dra. Helena Souza (Host)',
      texto,
      hora: agora,
    };

    setMensagens((prev) => [...prev, msg]);
    setNovaMensagem('');

    try {
      const bc = new BroadcastChannel('floravel_sala_ao_vivo');
      bc.postMessage({
        type: 'CHAT_MSG',
        msg: { id: `msg-${Date.now()}`, sender: 'Dra. Helena Souza (Host)', text: texto, time: agora, isHost: true }
      });
      bc.close();
    } catch (_) {}

    try {
      await fetch('http://localhost:8080/api/sala-ao-vivo/mensagens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remetente: 'Dra. Helena Souza (Host)', texto, isHost: true })
      });
    } catch (_) {}
  };

  const handleEncerrarSessao = async () => {
    try {
      const bc = new BroadcastChannel('floravel_sala_ao_vivo');
      bc.postMessage({ type: 'ROOM_ENDED' });
      bc.close();
    } catch (_) {}

    try {
      await fetch('http://localhost:8080/api/sala-ao-vivo/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ENCERRADA' })
      });
    } catch (_) {}

    setEmChamada(false);
    setNotasEfemeras(''); // Zero Prontuário: notas efêmeras são limpas ao encerrar a sessão
    setConfirmarSaida(false);
    navigate('/agenda');
  };

  const handleCopiarNotas = () => {
    if (!notasEfemeras.trim()) return;
    navigator.clipboard?.writeText(notasEfemeras).catch(() => {});
    setNotasCopiadas(true);
    setTimeout(() => setNotasCopiadas(false), 2500);
  };

  const handleEnviarSalvaguardaMenor = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:8080/api/maes/demo-mae/sinalizar-menor', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responsavelNome: respNome.trim() || 'Responsável Legal',
          responsavelTelefone: respTelefone.trim() || '(11) 99999-0000',
          responsavelParentesco: 'Responsável Legal',
        }),
      });
    } catch (_) {}
    setSinalizacaoSucesso(true);
    setTimeout(() => {
      setSinalizacaoSucesso(false);
      setSalvaguardaOpen(false);
      setRespNome('');
      setRespTelefone('');
    }, 2800);
  };

  return (
    <div className="w-full relative">
      {/* ---------- TELA 1: LOBBY DE ESPERA / PREVIEW ---------- */}
      {!emChamada ? (
        <div className="space-y-6">
          <header className="rounded-2xl bg-[#F1E6E1] p-5 sm:p-8 lg:p-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[13.5px] md:text-[15px] text-[#4A5E4D] first-letter:uppercase">
                Sala de Acolhimento Virtual
              </p>
              <h1 className="mt-2 font-fraunces text-[30px] md:text-[38px] leading-[1.12] tracking-[-0.015em] text-[#1F3A27]">
                {sessaoInicial.titulo}
              </h1>
              <p className="mt-2 text-[15px] text-[#4A5E4D]">
                {sessaoInicial.data} · {sessaoInicial.horario}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setSomEntradaAtivo((v) => !v)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-bold border transition cursor-pointer ${
                  somEntradaAtivo
                    ? 'bg-white border-[#294D33]/30 text-[#294D33]'
                    : 'bg-stone-100 border-stone-200 text-stone-500'
                }`}
                title="Ativar ou silenciar aviso sonoro rápido quando uma mãe entra na sala"
              >
                {somEntradaAtivo ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>{somEntradaAtivo ? 'Aviso Sonoro Ativo' : 'Aviso Mudo'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSalvaguardaAba('menor');
                  setSalvaguardaOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-300 px-5 py-2.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition cursor-pointer shadow-2xs"
              >
                <ShieldAlert className="w-4 h-4" />
                Salvaguarda Clínica (ECA / Emergência)
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {/* Card Principal de Entrada */}
            <div className="lg:col-span-2 rounded-3xl border border-[#EFE9EB] bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF3ED] px-3 py-1 text-xs font-bold text-[#294D33]">
                  <Users className="h-3.5 w-3.5" />
                  Roda em Grupo · {sessaoInicial.participantes.length}/{sessaoInicial.vagas} mães
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FCF7F9] border border-[#E8A9BB]/40 px-3 py-1 text-xs font-semibold text-[#1F3A27]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#294D33]" />
                  Sigilo Ético Garantido
                </span>
              </div>

              {/* Preview de Câmera da Terapeuta */}
              <div className="relative aspect-video rounded-2xl bg-stone-900 overflow-hidden flex items-center justify-center border border-stone-200 shadow-inner">
                {camLigada ? (
                  <div className="relative w-full h-full bg-gradient-to-br from-stone-800 to-stone-900 flex flex-col items-center justify-center text-white">
                    {localStream ? (
                      <LiveWebcamPreview stream={localStream} />
                    ) : (
                      <>
                        <div className="w-20 h-20 rounded-full bg-[#F4DDE5] text-[#294D33] font-bold text-2xl flex items-center justify-center shadow-md">
                          HS
                        </div>
                        <p className="mt-3 text-sm font-semibold tracking-wide">Dra. Helena Souza</p>
                        <p className="text-xs text-stone-300">Câmera ativa · Prévia de teste</p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-stone-400 text-center p-6">
                    <VideoOff className="w-12 h-12 mx-auto mb-2 text-stone-500" />
                    <p className="text-sm font-medium">Sua câmera está desativada</p>
                  </div>
                )}

                {/* Controles no preview */}
                <div className="absolute bottom-4 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full">
                  <button
                    onClick={() => setMicLigado((v) => !v)}
                    className={`p-2.5 rounded-full transition cursor-pointer ${
                      micLigado ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                    title={micLigado ? 'Silenciar microfone' : 'Ativar microfone'}
                  >
                    {micLigado ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setCamLigada((v) => !v)}
                    className={`p-2.5 rounded-full transition cursor-pointer ${
                      camLigada ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                    title={camLigada ? 'Desligar vídeo' : 'Ligar vídeo'}
                  >
                    {camLigada ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={() => setEmChamada(true)}
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#294D33] px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#1F3A27] transition cursor-pointer active:scale-95"
                >
                  <Video className="w-4 h-4" />
                  Iniciar Atendimento Agora
                </button>
                <Link
                  to="/agenda"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-stone-200 text-stone-700 text-sm font-bold hover:bg-stone-50 transition text-center"
                >
                  Voltar à Agenda
                </Link>
              </div>
            </div>

            {/* Coluna Lateral: Participantes e Recomendações */}
            <div className="space-y-6">
              {/* Card Participantes */}
              <div className="rounded-3xl border border-[#EFE9EB] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="font-fraunces text-xl font-bold text-[#1F3A27]">
                    Mães Inscritas ({participantes.length}/{sessaoInicial.vagas})
                  </h3>
                  <button
                    type="button"
                    onClick={() => notificarEntradaMae('Larissa Oliveira')}
                    className="text-[11px] font-bold text-[#294D33] bg-[#EBF3ED] hover:bg-[#DCE9DF] px-2.5 py-1 rounded-full transition cursor-pointer"
                    title="Testar aviso sonoro rápido e visual de entrada na sala"
                  >
                    Testar Chegada
                  </button>
                </div>
                <ul className="space-y-3">
                  {participantes.map((p) => (
                    <li key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#FCF7F9] border border-stone-100">
                      <div>
                        <p className="text-sm font-bold text-[#2B2829]">{p.nome}</p>
                        <p className="text-xs text-stone-500">{p.bebe}</p>
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        p.status === 'Conectada' ? 'bg-[#EBF3ED] text-[#294D33]' : 'bg-stone-100 text-stone-500'
                      }`}>
                        {p.status}
                      </span>
                    </li>
                  ))}
                </ul>

                {entradaBanner && (
                  <div className="mt-4 p-3 rounded-2xl bg-[#294D33] text-white text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                    <Sparkles className="w-4 h-4 text-[#E8A9BB] shrink-0" />
                    <span>{entradaBanner}</span>
                  </div>
                )}
              </div>

              {/* Aviso Ético */}
              <div className="rounded-3xl bg-[#F4DDE5] p-6 border border-[#E8A9BB]/40">
                <div className="flex items-center gap-2 text-sm font-bold text-[#294D33] mb-1">
                  <Heart className="w-4 h-4 text-[#294D33]" />
                  Acolhimento Sensível
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Lembre-se de validar o cansaço materno sem julgamentos e reforçar o pacto de sigilo ético entre todas as participantes presentes.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : createPortal(
        /* ---------- TELA 2: SALA VIRTUAL AO VIVO TELA CHEIA (PORTAL 100VW x 100VH) ---------- */
        <div className="fixed inset-0 z-[99999] w-screen h-dvh bg-[#1A1A1A] text-white flex flex-col font-dmsans animate-fadeIn select-none">
          {/* Aviso visual rápido de entrada de mãe na sala */}
          {entradaBanner && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100000] flex items-center gap-2.5 rounded-full bg-[#294D33] border border-[#E8A9BB]/50 px-5 py-2.5 text-xs font-bold text-white shadow-2xl animate-fadeIn">
              <Sparkles className="w-4 h-4 text-[#E8A9BB]" />
              <span>{entradaBanner}</span>
            </div>
          )}

          {/* Header da Chamada */}
          <header className="h-16 bg-black/40 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 flex items-center justify-between shrink-0 gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex h-3 w-3 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <div className="min-w-0">
                <h2 className="text-sm font-bold tracking-wide text-white truncate max-w-xs sm:max-w-md">
                  {sessaoInicial.titulo}
                </h2>
                <p className="text-[11px] text-stone-400 flex items-center gap-2">
                  <span>Duração: {formatarTempo(segundos)}</span>
                  <span>•</span>
                  <span className="text-[#E8A9BB]">Criptografia Ponta a Ponta</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setSalvaguardaAba('menor');
                  setSalvaguardaOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 px-3.5 py-1.5 text-xs font-bold text-amber-200 hover:bg-amber-500/30 transition cursor-pointer"
                title="Sinalizar Menor de Idade (ECA Art. 17) ou Protocolo de Emergência"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Salvaguarda Clínica</span>
              </button>

              <button
                type="button"
                onClick={() => setSomEntradaAtivo((v) => !v)}
                className={`p-2 rounded-full transition cursor-pointer ${
                  somEntradaAtivo ? 'bg-white/10 text-emerald-300 hover:bg-white/20' : 'bg-white/5 text-stone-500'
                }`}
                title={somEntradaAtivo ? 'Som de chegada ativo' : 'Som de chegada silenciado'}
              >
                {somEntradaAtivo ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setChatAberto((v) => !v)}
                className={`p-2.5 rounded-full transition cursor-pointer ${
                  chatAberto ? 'bg-[#294D33] text-white' : 'bg-white/10 text-stone-300 hover:bg-white/20'
                }`}
                title="Abrir/Fechar Painel Lateral"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              <button
                onClick={() => setConfirmarSaida(true)}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition cursor-pointer shadow-sm"
              >
                <PhoneOff className="w-4 h-4" />
                <span className="hidden sm:inline">Encerrar Sessão</span>
              </button>
            </div>
          </header>

          {/* Área Central: Grid de Vídeos e Chat Lateral */}
          <div className="flex-1 flex overflow-hidden p-4 gap-4">
            {/* Grid de Vídeos dos Participantes */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-fr">
              {/* Vídeo 1: Terapeuta (Você) */}
              <div className="relative rounded-2xl bg-stone-800 border border-white/10 overflow-hidden flex flex-col items-center justify-center shadow-lg">
                {camLigada ? (
                  <div className="relative w-full h-full bg-gradient-to-br from-stone-800 via-stone-850 to-stone-900 flex flex-col items-center justify-center">
                    {localStream ? (
                      <LiveWebcamPreview stream={localStream} />
                    ) : (
                      <>
                        <div className="w-20 h-20 rounded-full bg-[#F4DDE5] text-[#294D33] font-bold text-2xl flex items-center justify-center ring-4 ring-[#294D33]/30">
                          HS
                        </div>
                        <p className="mt-3 text-sm font-semibold">Dra. Helena Souza (Você)</p>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#294D33] text-white mt-1">
                          Terapeuta Perinatal
                        </span>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-stone-500">
                    <VideoOff className="w-10 h-10 mx-auto mb-2" />
                    <p className="text-xs">Câmera desativada</p>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                  {micLigado ? (
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <MicOff className="w-3.5 h-3.5 text-red-400" />
                  )}
                  <span>Dra. Helena</span>
                </div>
              </div>

              {/* Vídeo 2: Mariana Silva */}
              <div className="relative rounded-2xl bg-stone-800 border border-white/10 overflow-hidden flex flex-col items-center justify-center shadow-lg">
                <div className="w-full h-full bg-gradient-to-br from-stone-850 to-stone-900 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-[#EBF3ED] text-[#294D33] font-bold text-2xl flex items-center justify-center ring-2 ring-emerald-500/40">
                    MS
                  </div>
                  <p className="mt-3 text-sm font-semibold">Mariana Silva</p>
                  <p className="text-xs text-stone-400">Bebê Bento (3m)</p>
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>Mariana Silva</span>
                </div>
              </div>

              {/* Vídeo 3: Beatriz Santos */}
              <div className="relative rounded-2xl bg-stone-800 border border-white/10 overflow-hidden flex flex-col items-center justify-center shadow-lg">
                <div className="w-full h-full bg-gradient-to-br from-stone-850 to-stone-900 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-[#F4DDE5] text-[#294D33] font-bold text-2xl flex items-center justify-center">
                    BS
                  </div>
                  <p className="mt-3 text-sm font-semibold">Beatriz Santos</p>
                  <p className="text-xs text-stone-400">Bebê Gael (2m)</p>
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                  <MicOff className="w-3.5 h-3.5 text-stone-400" />
                  <span>Beatriz Santos</span>
                </div>
              </div>

              {/* Vídeo 4: Larissa Oliveira (status dinâmico com chegada sonora) */}
              {(() => {
                const larissa = participantes.find((p) => p.nome === 'Larissa Oliveira') || { status: 'Aguardando' };
                const conectada = larissa.status === 'Conectada';
                return (
                  <div className="relative rounded-2xl bg-stone-800 border border-white/10 overflow-hidden flex flex-col items-center justify-center shadow-lg">
                    <div className="w-full h-full bg-gradient-to-br from-stone-850 to-stone-900 flex flex-col items-center justify-center">
                      <div
                        className={`w-20 h-20 rounded-full font-bold text-2xl flex items-center justify-center transition-all ${
                          conectada
                            ? 'bg-[#EBF3ED] text-[#294D33] ring-2 ring-emerald-400/50'
                            : 'bg-stone-700 text-stone-300'
                        }`}
                      >
                        LO
                      </div>
                      <p className="mt-3 text-sm font-semibold">Larissa Oliveira</p>
                      <p className={`text-xs ${conectada ? 'text-emerald-300' : 'text-stone-400'}`}>
                        {conectada ? 'Bebê Maya (4m) • Conectada' : 'Conectando áudio...'}
                      </p>
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                      {conectada ? (
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <MicOff className="w-3.5 h-3.5 text-stone-400" />
                      )}
                      <span>Larissa Oliveira</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Painel Lateral: Chat da Roda ou Notas Efêmeras (Zero Prontuário) */}
            {chatAberto && (
              <div className="w-80 lg:w-96 rounded-2xl bg-stone-900/90 border border-white/10 flex flex-col overflow-hidden shrink-0 shadow-2xl backdrop-blur-md">
                <div className="p-3 border-b border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl flex-1">
                    <button
                      type="button"
                      onClick={() => setPainelLateralTab('chat')}
                      className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        painelLateralTab === 'chat'
                          ? 'bg-[#294D33] text-white'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Chat da Roda
                    </button>
                    <button
                      type="button"
                      onClick={() => setPainelLateralTab('notas')}
                      className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        painelLateralTab === 'notas'
                          ? 'bg-[#294D33] text-white'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Notas Efêmeras
                    </button>
                  </div>
                  <button
                    onClick={() => setChatAberto(false)}
                    className="p-1.5 rounded-full text-stone-400 hover:text-white transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {painelLateralTab === 'chat' ? (
                  <>
                    {/* Mensagens */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                      {mensagens.map((m, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-2xl ${
                            m.remetente.includes('Você') || m.remetente.includes('Host')
                              ? 'bg-[#294D33] text-white ml-6'
                              : m.remetente === 'Sistema'
                              ? 'bg-white/5 text-stone-400 text-center italic text-[11px]'
                              : 'bg-white/10 text-white mr-6'
                          }`}
                        >
                          {m.remetente !== 'Sistema' && (
                            <div className="flex items-center justify-between mb-1 opacity-80 text-[10px]">
                              <span className="font-bold">{m.remetente}</span>
                              <span>{m.hora}</span>
                            </div>
                          )}
                          <p className="leading-relaxed">{m.texto}</p>
                        </div>
                      ))}
                    </div>

                    {/* Form Envio */}
                    <form onSubmit={handleEnviarMensagem} className="p-3 border-t border-white/10 flex gap-2">
                      <input
                        type="text"
                        value={novaMensagem}
                        onChange={(e) => setNovaMensagem(e.target.value)}
                        placeholder="Digite uma mensagem acolhedora..."
                        className="flex-1 bg-white/10 text-white rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#E8A9BB] placeholder-stone-400"
                      />
                      <button
                        type="submit"
                        className="p-2 rounded-xl bg-[#294D33] hover:bg-[#1F3A27] text-white transition cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col p-4 space-y-3">
                    <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-400/30 text-[11px] text-amber-100 leading-relaxed flex items-start gap-2">
                      <Lock className="w-4 h-4 shrink-0 mt-0.5 text-amber-300" />
                      <span>
                        <strong>Zero Prontuário (CFP):</strong> Estas anotações existem apenas nesta tela e são apagadas ao encerrar. Copie para seu arquivo clínico local antes de sair.
                      </span>
                    </div>

                    <textarea
                      value={notasEfemeras}
                      onChange={(e) => setNotasEfemeras(e.target.value)}
                      placeholder="Rascunhe tópicos rápidos de acolhimento durante a chamada (nunca salvo em nuvem)..."
                      className="flex-1 w-full rounded-xl bg-white/10 border border-white/10 p-3 text-xs text-white placeholder-stone-400 outline-none focus:border-[#E8A9BB] resize-none leading-relaxed"
                    />

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleCopiarNotas}
                        disabled={!notasEfemeras.trim()}
                        className="flex-1 py-2.5 rounded-xl bg-[#294D33] hover:bg-[#1F3A27] disabled:opacity-40 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        {notasCopiadas ? 'Copiado!' : 'Copiar Notas'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setNotasEfemeras('')}
                        className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 text-xs font-semibold transition cursor-pointer"
                      >
                        Limpar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Barra de Controles Inferior */}
          <footer className="h-20 bg-black/60 backdrop-blur-md border-t border-white/10 flex items-center justify-center gap-4 px-6 shrink-0">
            <button
              onClick={() => setMicLigado((v) => !v)}
              className={`p-3.5 rounded-full transition cursor-pointer shadow-md ${
                micLigado ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-red-500 text-white hover:bg-red-600'
              }`}
              title={micLigado ? 'Mutar Microfone' : 'Ativar Microfone'}
            >
              {micLigado ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setCamLigada((v) => !v)}
              className={`p-3.5 rounded-full transition cursor-pointer shadow-md ${
                camLigada ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-red-500 text-white hover:bg-red-600'
              }`}
              title={camLigada ? 'Desligar Câmera' : 'Ligar Câmera'}
            >
              {camLigada ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setTelaCompartilhada((v) => !v)}
              className={`p-3.5 rounded-full transition cursor-pointer shadow-md ${
                telaCompartilhada ? 'bg-[#294D33] text-white' : 'bg-white/15 text-white hover:bg-white/25'
              }`}
              title="Compartilhar Tela"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={() => setChatAberto((v) => !v)}
              className={`p-3.5 rounded-full transition cursor-pointer shadow-md ${
                chatAberto ? 'bg-[#294D33] text-white' : 'bg-white/15 text-white hover:bg-white/25'
              }`}
              title="Chat da Sala"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            <button
              onClick={() => setConfirmarSaida(true)}
              className="p-3.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition cursor-pointer shadow-md"
              title="Encerrar Sessão"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </footer>

          {/* Modal Confirmar Encerramento */}
          {confirmarSaida && (
            <div
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
              onClick={() => setConfirmarSaida(false)}
            >
              <div
                className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-[#2B2829] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-4">
                  <PhoneOff className="w-6 h-6" />
                </div>
                <h3 className="font-fraunces text-2xl font-bold text-center text-[#1F3A27]">
                  Encerrar Atendimento?
                </h3>
                <p className="mt-2 text-xs text-stone-600 text-center leading-relaxed">
                  A sessão será finalizada para todas as participantes e a presença será salva na sua agenda.
                </p>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setConfirmarSaida(false)}
                    className="flex-1 py-3 rounded-full border border-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-50 transition cursor-pointer"
                  >
                    Continuar na Sala
                  </button>
                  <button
                    onClick={handleEncerrarSessao}
                    className="flex-1 py-3 rounded-full bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition shadow-sm cursor-pointer"
                  >
                    Sim, Encerrar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>,
        document.body
      )}

      {/* ---------- MODAL SALVAGUARDA CLÍNICA (MENOR DE IDADE ECA ART. 17 & EMERGÊNCIA) ---------- */}
      {salvaguardaOpen && createPortal(
        <div
          className="fixed inset-0 z-[100001] flex items-center justify-center p-4 bg-[#1F3A27]/40 backdrop-blur-sm animate-fadeIn font-dmsans"
          onClick={() => setSalvaguardaOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#E4DAD5] max-h-[90vh] overflow-y-auto text-[#2B2829]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                    Proteção Ética & Legal
                  </span>
                  <h3 className="font-fraunces text-2xl font-bold text-[#1F3A27]">
                    Salvaguarda Clínica
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSalvaguardaOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Abas: Menor de Idade vs Emergência */}
            <div className="grid grid-cols-2 gap-2 mt-4 p-1 rounded-2xl bg-[#FCF7F9] border border-[#EFE9EB]">
              <button
                type="button"
                onClick={() => setSalvaguardaAba('menor')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                  salvaguardaAba === 'menor'
                    ? 'bg-[#294D33] text-white shadow-xs'
                    : 'text-stone-600 hover:text-[#1F3A27]'
                }`}
              >
                Sinalizar Menor (ECA Art. 17)
              </button>
              <button
                type="button"
                onClick={() => setSalvaguardaAba('emergencia')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                  salvaguardaAba === 'emergencia'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-red-700'
                }`}
              >
                Protocolo Emergencial
              </button>
            </div>

            {salvaguardaAba === 'menor' ? (
              sinalizacaoSucesso ? (
                <div className="py-8 text-center space-y-3 animate-fadeIn">
                  <div className="w-14 h-14 rounded-full bg-[#EBF3ED] text-[#294D33] mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="font-fraunces text-xl font-bold text-[#1F3A27]">
                    Solicitação ECA Registrada
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
                    O fluxo acolhedor de consentimento foi disparado para o responsável de <strong>{maeSinalizada}</strong>, garantindo que suas conversas sigam sob sigilo absoluto (ECA Art. 17).
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEnviarSalvaguardaMenor} className="mt-5 space-y-4">
                  <div className="p-3.5 rounded-2xl bg-[#EBF3ED] border border-[#294D33]/20 text-xs text-[#1F3A27] leading-relaxed flex items-start gap-2.5">
                    <Lock className="w-4 h-4 shrink-0 mt-0.5 text-[#294D33]" />
                    <span>
                      <strong>Se identificou uma mãe adolescente em vídeo que burlou a data de nascimento:</strong> não a desconecte bruscamente. Sinalize aqui para o sistema solicitar a autorização legal ao responsável preservando o sigilo clínico.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Participante / Mãe identificada
                    </label>
                    <select
                      value={maeSinalizada}
                      onChange={(e) => setMaeSinalizada(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs font-semibold bg-white outline-none focus:border-[#294D33]"
                    >
                      {participantes.map((p) => (
                        <option key={p.id} value={p.nome}>
                          {p.nome} ({p.bebe})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Nome do Responsável (opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Maria Oliveira"
                        value={respNome}
                        onChange={(e) => setRespNome(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 px-3.5 py-2 text-xs outline-none focus:border-[#294D33]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        WhatsApp / SMS para Consentimento
                      </label>
                      <input
                        type="tel"
                        placeholder="(11) 99999-0000"
                        value={respTelefone}
                        onChange={(e) => setRespTelefone(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 px-3.5 py-2 text-xs outline-none focus:border-[#294D33]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setSalvaguardaOpen(false)}
                      className="flex-1 py-2.5 rounded-full border border-stone-200 text-stone-600 text-xs font-bold hover:bg-stone-50 transition cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-full bg-[#294D33] text-white text-xs font-bold hover:bg-[#1F3A27] transition shadow-sm cursor-pointer"
                    >
                      Ativar Fluxo Responsável (ECA)
                    </button>
                  </div>
                </form>
              )
            ) : (
              <div className="mt-5 space-y-3">
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-950 leading-relaxed">
                  <strong>Protocolo de Crise Aguda / Risco Iminente:</strong> em casos de ideação suicida puerperal grave ou violência doméstica, acione imediatamente a rede de urgência e acolha a paciente até a transição segura.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href="tel:188"
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-red-300 transition"
                  >
                    <div className="w-9 h-9 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1F3A27]">CVV · Ligue 188</p>
                      <p className="text-[11px] text-stone-500">Valorização da Vida (24h)</p>
                    </div>
                  </a>

                  <a
                    href="tel:192"
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-red-300 transition"
                  >
                    <div className="w-9 h-9 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1F3A27]">SAMU · Ligue 192</p>
                      <p className="text-[11px] text-stone-500">Emergência Médica</p>
                    </div>
                  </a>

                  <a
                    href="tel:100"
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-amber-300 transition"
                  >
                    <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1F3A27]">Disque 100</p>
                      <p className="text-[11px] text-stone-500">Proteção à Adolescente / ECA</p>
                    </div>
                  </a>

                  <a
                    href="tel:180"
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-amber-300 transition"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#F4DDE5] text-[#294D33] flex items-center justify-center shrink-0">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1F3A27]">Ligue 180</p>
                      <p className="text-[11px] text-stone-500">Central da Mulher / Violência</p>
                    </div>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => setSalvaguardaOpen(false)}
                  className="w-full mt-2 py-2.5 rounded-full border border-stone-200 text-stone-600 text-xs font-bold hover:bg-stone-50 transition cursor-pointer"
                >
                  Fechar Protocolo
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
