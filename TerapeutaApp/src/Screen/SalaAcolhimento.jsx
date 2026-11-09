import { useState, useEffect } from 'react';
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
  Send,
  X,
  ChevronRight,
  Sparkles,
  Heart,
  Volume2
} from 'lucide-react';

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

  // Cronômetro da chamada
  useEffect(() => {
    let interval = null;
    if (emChamada) {
      interval = setInterval(() => {
        setSegundos((s) => s + 1);
      }, 1000);
    } else {
      setSegundos(0);
    }
    return () => clearInterval(interval);
  }, [emChamada]);

  const formatarTempo = (totalSec) => {
    const min = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const sec = String(totalSec % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  const handleEnviarMensagem = (e) => {
    e.preventDefault();
    if (!novaMensagem.trim()) return;

    const agora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const msg = {
      remetente: 'Dra. Helena Souza (Você)',
      texto: novaMensagem.trim(),
      hora: agora,
    };

    setMensagens((prev) => [...prev, msg]);
    setNovaMensagem('');
  };

  const handleEncerrarSessao = () => {
    setEmChamada(false);
    setConfirmarSaida(false);
    navigate('/agenda');
  };

  return (
    <div className="w-full relative">
      {/* ---------- TELA 1: LOBBY DE ESPERA / PREVIEW ---------- */}
      {!emChamada ? (
        <div className="space-y-6">
          <header>
            <p className="text-[13.5px] md:text-[15px] text-[#4A5E4D] first-letter:uppercase">
              Sala de Acolhimento Virtual
            </p>
            <h1 className="mt-2 font-fraunces text-[30px] md:text-[38px] leading-[1.12] tracking-[-0.015em] text-[#1F3A27]">
              {sessaoInicial.titulo}
            </h1>
            <p className="mt-2 text-[15px] text-[#4A5E4D]">
              {sessaoInicial.data} · {sessaoInicial.horario}
            </p>
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
                    <div className="w-20 h-20 rounded-full bg-[#F4DDE5] text-[#294D33] font-bold text-2xl flex items-center justify-center shadow-md">
                      HS
                    </div>
                    <p className="mt-3 text-sm font-semibold tracking-wide">Dra. Helena Souza</p>
                    <p className="text-xs text-stone-300">Câmera ativa · Prévia de teste</p>
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
                <h3 className="font-fraunces text-xl font-bold text-[#1F3A27] mb-3">
                  Mães Inscritas ({sessaoInicial.participantes.length}/{sessaoInicial.vagas})
                </h3>
                <ul className="space-y-3">
                  {sessaoInicial.participantes.map((p) => (
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
      ) : (
        /* ---------- TELA 2: SALA VIRTUAL AO VIVO (IN-APP MEETING) ---------- */
        <div className="fixed inset-0 z-50 bg-[#1A1A1A] text-white flex flex-col font-dmsans animate-fadeIn">
          {/* Header da Chamada */}
          <header className="h-16 bg-black/40 backdrop-blur-md border-b border-white/10 px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <div>
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

            <div className="flex items-center gap-3">
              <button
                onClick={() => setChatAberto((v) => !v)}
                className={`p-2.5 rounded-full transition cursor-pointer ${
                  chatAberto ? 'bg-[#294D33] text-white' : 'bg-white/10 text-stone-300 hover:bg-white/20'
                }`}
                title="Abrir/Fechar Chat"
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
                  <div className="w-full h-full bg-gradient-to-br from-stone-800 via-stone-850 to-stone-900 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-[#F4DDE5] text-[#294D33] font-bold text-2xl flex items-center justify-center ring-4 ring-[#294D33]/30">
                      HS
                    </div>
                    <p className="mt-3 text-sm font-semibold">Dra. Helena Souza (Você)</p>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#294D33] text-white mt-1">
                      Terapeuta Perinatal
                    </span>
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

              {/* Vídeo 4: Larissa Oliveira */}
              <div className="relative rounded-2xl bg-stone-800 border border-white/10 overflow-hidden flex flex-col items-center justify-center shadow-lg">
                <div className="w-full h-full bg-gradient-to-br from-stone-850 to-stone-900 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-stone-700 text-stone-300 font-bold text-2xl flex items-center justify-center">
                    LO
                  </div>
                  <p className="mt-3 text-sm font-semibold">Larissa Oliveira</p>
                  <p className="text-xs text-stone-400">Conectando áudio...</p>
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                  <MicOff className="w-3.5 h-3.5 text-stone-400" />
                  <span>Larissa</span>
                </div>
              </div>
            </div>

            {/* Painel Lateral de Chat */}
            {chatAberto && (
              <div className="w-80 lg:w-96 rounded-2xl bg-stone-900/90 border border-white/10 flex flex-col overflow-hidden shrink-0 shadow-2xl backdrop-blur-md">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-sm font-bold flex items-center gap-2 text-white">
                    <MessageSquare className="w-4 h-4 text-[#E8A9BB]" />
                    Chat da Roda
                  </h3>
                  <button
                    onClick={() => setChatAberto(false)}
                    className="p-1 rounded-full text-stone-400 hover:text-white transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                  {mensagens.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl ${
                        m.remetente.includes('Você')
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
        </div>
      )}
    </div>
  );
}
