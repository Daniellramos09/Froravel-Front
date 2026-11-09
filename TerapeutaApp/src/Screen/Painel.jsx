import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CalendarClock, Calendar, Users, User, Video, ChevronRight, X, Clock, CheckCircle2 } from 'lucide-react';

const initialStats = [
  { icon: CalendarClock, value: '2', label: 'Atendimentos hoje', path: '/agenda' },
  { icon: Calendar, value: '3', label: 'Próximas sessões', path: '/agenda' },
  { icon: Users, value: '7', label: 'Mães acompanhadas', path: '/maes' },
  { icon: Users, value: '23/10', label: 'Próximo grupo', extra: '18:00 · 3/5 vagas', path: '/sala' },
];

const initialAppointments = [
  { id: 1, hora: '18:00', dia: 'Sexta 23/10', titulo: 'Roda: os primeiros meses', tipo: 'Grupo', info: '3/5', grupo: true, desc: 'Encontro focado no puerpério imediato, sono compartilhado e sentimentos de sobrecarga.' },
  { id: 2, hora: '10:00', dia: 'Sábado 24/10', titulo: 'Juliana Costa', tipo: 'Individual', info: 'Escuta e acolhimento', grupo: false, desc: 'Primeira escuta após retorno de licença maternidade. Rastreio EPDS: 6 pontos.' },
  { id: 3, hora: '19:00', dia: 'Quarta 28/10', titulo: 'Roda: rede de apoio', tipo: 'Grupo', info: '4/10', grupo: true, desc: 'Discussão sobre divisão de tarefas e fortalecimento dos vínculos de suporte na família.' },
];

function getSaudacao() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default function Painel() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState(initialAppointments);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Formulário Nova Sessão
  const [novoTipo, setNovoTipo] = useState('Individual');
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaData, setNovaData] = useState('2026-10-25');
  const [novaHora, setNovaHora] = useState('14:00');
  const [novaInfo, setNovaInfo] = useState('');

  const dataHoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleCreateSession = (e) => {
    e.preventDefault();
    if (!novoTitulo.trim()) return;

    const isGrupo = novoTipo === 'Grupo';
    const newEntry = {
      id: Date.now(),
      hora: novaHora,
      dia: novaData,
      titulo: novoTitulo,
      tipo: novoTipo,
      info: isGrupo ? (novaInfo || '1/5') : (novaInfo || 'Acolhimento clínico'),
      grupo: isGrupo,
      desc: isGrupo ? 'Roda de conversa temática cadastrada com sucesso.' : 'Sessão individual de escuta perinatal.',
    };

    setAppointments((prev) => [newEntry, ...prev]);
    setIsNewModalOpen(false);
    setNovoTitulo('');
    setNovaInfo('');
    showToast('Nova sessão agendada com sucesso!');
  };

  return (
    <div className="w-full relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#294D33] px-5 py-3 text-sm font-semibold text-white shadow-xl animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-[#E8A9BB]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cabeçalho */}
      <header className="rounded-2xl bg-[#F1E6E1] p-5 sm:p-8 lg:p-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[13.5px] md:text-[15px] text-[#4A5E4D] first-letter:uppercase">
            {dataHoje}
          </p>
          <h1 className="mt-2 font-fraunces text-[30px] md:text-[38px] leading-[1.12] tracking-[-0.015em] text-[#1F3A27]">
            {getSaudacao()}, Dra. Helena Souza
          </h1>
          <p className="mt-2 text-[15px] text-[#4A5E4D]">Veja o que pede sua atenção hoje.</p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-[#294D33] px-6 py-3 text-[14px] font-bold text-white shadow-sm hover:bg-[#1F3A27] transition-colors cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Nova sessão
        </button>
      </header>

      {/* Cards de Métricas */}
      <section className="mt-6 sm:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {initialStats.map(({ icon: Icon, value, label, extra, path }) => (
          <div
            key={label}
            onClick={() => navigate(path)}
            className="rounded-3xl bg-white border border-[#EFE9EB] p-5 shadow-sm hover:border-[#E8A9BB]/60 transition cursor-pointer hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-full bg-[#F4DDE5] flex items-center justify-center">
              <Icon className="w-5 h-5 text-[#294D33]" />
            </div>
            <p className="mt-4 font-fraunces text-[32px] leading-none text-[#1F3A27]">{value}</p>
            <p className="text-sm text-[#4A5E4D]">{label}</p>
            {extra && <p className="text-xs text-stone-500 mt-1">{extra}</p>}
          </div>
        ))}
      </section>

      {/* Próximos atendimentos */}
      <section className="mt-8 rounded-3xl bg-white border border-[#EFE9EB] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5">
          <div>
            <h2 className="font-fraunces text-[22px] md:text-[26px] leading-[1.15] tracking-[-0.015em] text-[#1F3A27]">
              Próximos atendimentos
            </h2>
            <p className="text-xs text-stone-500">Dados demonstrativos de acolhimento</p>
          </div>
          <button
            onClick={() => navigate('/agenda')}
            className="rounded-full bg-[#F4DDE5] px-4 py-1.5 text-xs font-semibold text-[#294D33] hover:bg-[#E8A9BB]/50 transition cursor-pointer"
          >
            Ver agenda
          </button>
        </div>

        <ul className="divide-y divide-[#EFE9EB] border-t border-[#EFE9EB]">
          {appointments.map((a) => (
            <li
              key={a.id || a.titulo}
              className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between hover:bg-[#FCF7F9]/50 transition"
            >
              <div className="flex items-center gap-6">
                <div className="w-24">
                  <p className="text-lg font-bold text-[#2B2829]">{a.hora}</p>
                  <p className="text-xs text-stone-500">{a.dia}</p>
                </div>
                <div>
                  <p className="font-bold text-[#2B2829]">{a.titulo}</p>
                  <p className="flex items-center gap-1 text-xs text-stone-500">
                    {a.grupo ? <Users className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    {a.tipo} · {a.info}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#F1E6E1] px-3 py-1 text-xs font-medium text-[#4A5E4D]">
                  Agendada
                </span>
                <button
                  onClick={() => navigate('/sala')}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF3ED] px-3 py-1.5 text-xs font-semibold text-[#294D33] hover:bg-[#DCE9DF] transition cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5" />
                  Sala
                </button>
                <button
                  onClick={() => setSelectedAppt(a)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#2B2829] hover:text-[#294D33] p-1 cursor-pointer transition"
                >
                  Detalhes <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Modal Detalhes do Atendimento */}
      {selectedAppt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn"
          onClick={() => setSelectedAppt(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <span className="text-xs font-bold uppercase tracking-wider text-[#294D33] bg-[#EBF3ED] px-3 py-1 rounded-full">
                {selectedAppt.tipo}
              </span>
              <button
                onClick={() => setSelectedAppt(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4">
              <h3 className="font-fraunces text-2xl font-bold text-[#1F3A27]">
                {selectedAppt.titulo}
              </h3>
              <p className="mt-1 flex items-center gap-2 text-sm text-[#4A5E4D]">
                <Clock className="w-4 h-4 text-stone-400" />
                {selectedAppt.dia} às {selectedAppt.hora}
              </p>
              <div className="mt-4 p-4 rounded-2xl bg-[#FCF7F9] border border-[#EFE9EB] text-sm text-stone-700">
                <p className="font-semibold text-[#1F3A27] mb-1">Observações do Encontro:</p>
                <p className="text-xs leading-relaxed">{selectedAppt.desc}</p>
                <p className="mt-2 text-xs text-stone-500 font-medium">Capacidade: {selectedAppt.info}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setSelectedAppt(null);
                  navigate('/sala');
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#294D33] px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#1F3A27] transition cursor-pointer"
              >
                <Video className="w-4 h-4" />
                Acessar Sala Virtual
              </button>
              <button
                onClick={() => setSelectedAppt(null)}
                className="px-5 py-3 rounded-full border border-stone-200 text-stone-600 font-semibold text-sm hover:bg-stone-50 transition cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nova Sessão */}
      {isNewModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn"
          onClick={() => setIsNewModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="font-fraunces text-2xl font-bold text-[#1F3A27]">
                Nova Sessão ou Roda
              </h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Tipo de Encontro</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNovoTipo('Individual')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      novoTipo === 'Individual'
                        ? 'border-[#294D33] bg-[#EBF3ED] text-[#294D33]'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    Atendimento Individual
                  </button>
                  <button
                    type="button"
                    onClick={() => setNovoTipo('Grupo')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      novoTipo === 'Grupo'
                        ? 'border-[#294D33] bg-[#EBF3ED] text-[#294D33]'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    Roda de Conversa (Grupo)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">
                  {novoTipo === 'Individual' ? 'Nome da Paciente' : 'Tema da Roda'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={novoTipo === 'Individual' ? 'Ex: Camila Ramos' : 'Ex: Roda: Desafios da Amamentação'}
                  value={novoTitulo}
                  onChange={(e) => setNovoTitulo(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-[#294D33] focus:ring-1 focus:ring-[#294D33]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={novaData}
                    onChange={(e) => setNovaData(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-[#294D33]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Horário</label>
                  <input
                    type="time"
                    required
                    value={novaHora}
                    onChange={(e) => setNovaHora(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-[#294D33]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">
                  {novoTipo === 'Individual' ? 'Foco da Escuta / Queixa' : 'Vagas Disponíveis'}
                </label>
                <input
                  type="text"
                  placeholder={novoTipo === 'Individual' ? 'Ex: Ansiedade no puerpério' : 'Ex: 5 vagas'}
                  value={novaInfo}
                  onChange={(e) => setNovaInfo(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-[#294D33]"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="flex-1 py-3 rounded-full border border-stone-200 text-stone-600 font-bold text-sm hover:bg-stone-50 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-[#294D33] text-white font-bold text-sm shadow-sm hover:bg-[#1F3A27] transition cursor-pointer"
                >
                  Confirmar Sessão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
