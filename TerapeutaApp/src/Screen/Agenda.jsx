import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronLeft, ChevronRight, Video, Calendar, Clock, X, Trash2, CheckCircle2 } from 'lucide-react';

/* ---------- Dados iniciais ---------- */
const sessoesIniciais = [
  { id: 1, data: '2026-10-21', hora: '09:00', titulo: 'Mariana Silva', tipo: 'individual', info: 'Escuta inicial - Puerpério' },
  { id: 2, data: '2026-10-21', hora: '14:00', titulo: 'Fernanda Lima', tipo: 'individual', info: 'Acompanhamento pós-parto' },
  { id: 3, data: '2026-10-23', hora: '18:00', titulo: 'Roda: os primeiros meses', tipo: 'grupo', info: '3/5 vagas preenchidas' },
  { id: 4, data: '2026-10-24', hora: '10:00', titulo: 'Juliana Costa', tipo: 'individual', info: 'Retorno ao trabalho e culpa' },
  { id: 5, data: '2026-10-28', hora: '19:00', titulo: 'Roda: rede de apoio', tipo: 'grupo', info: '4/10 vagas preenchidas' },
];

/* ---------- Helpers de data ---------- */
const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const MESES_CURTOS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const toKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const startOfWeek = (d) => addDays(d, -d.getDay()); // semana começa no domingo
const fromKey = (key) => {
  const [y, m, day] = key.split('-').map(Number);
  return new Date(y, m - 1, day);
};

/* ---------- Pílula de sessão ---------- */
function SessaoChip({ sessao, compacta = false, onClick }) {
  const estilo =
    sessao.tipo === 'grupo'
      ? 'bg-[#EBF3ED] text-[#294D33] hover:bg-[#DCE9DF]'
      : 'bg-[#F4DDE5] text-[#2B2829] hover:bg-[#E8A9BB]/50';

  if (compacta) {
    return (
      <button
        type="button"
        onClick={() => onClick && onClick(sessao)}
        className={`w-full text-left truncate rounded-full px-2 py-0.5 text-[10px] font-semibold cursor-pointer transition ${estilo}`}
      >
        {sessao.hora} {sessao.titulo}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onClick && onClick(sessao)}
      className={`w-full rounded-2xl px-3 py-2 text-left transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.98] ${estilo}`}
    >
      <p className="text-xs font-bold">{sessao.hora}</p>
      <p className="truncate text-xs">{sessao.titulo}</p>
    </button>
  );
}

/* ---------- Tela ---------- */
export default function Agenda() {
  const navigate = useNavigate();
  const [sessoes, setSessoes] = useState(sessoesIniciais);
  const [visao, setVisao] = useState('semana'); // semana | mes | proximos
  const [cursor, setCursor] = useState(new Date());
  const [selectedSessao, setSelectedSessao] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Formulário Nova Sessão
  const [tipoNovo, setTipoNovo] = useState('individual');
  const [tituloNovo, setTituloNovo] = useState('');
  const [dataNova, setDataNova] = useState(toKey(new Date()));
  const [horaNova, setHoraNova] = useState('14:00');
  const [infoNova, setInfoNova] = useState('');

  const hoje = new Date();
  const hojeKey = toKey(hoje);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const sessoesDoDia = (key) =>
    sessoes.filter((s) => s.data === key).sort((a, b) => a.hora.localeCompare(b.hora));

  /* navegação */
  const navegar = (direcao) => {
    if (visao === 'semana') setCursor(addDays(cursor, 7 * direcao));
    if (visao === 'mes') setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + direcao, 1));
  };

  /* rótulo central */
  const inicioSemana = startOfWeek(cursor);
  const fimSemana = addDays(inicioSemana, 6);
  const rotulo =
    visao === 'semana'
      ? `${inicioSemana.getDate()} ${MESES_CURTOS[inicioSemana.getMonth()]} – ${fimSemana.getDate()} ${MESES_CURTOS[fimSemana.getMonth()]}`
      : visao === 'mes'
      ? `${MESES[cursor.getMonth()]} ${cursor.getFullYear()}`
      : 'A partir de hoje';

  /* dias exibidos */
  const diasSemana = Array.from({ length: 7 }, (_, i) => addDays(inicioSemana, i));

  const primeiroDiaGrade = startOfWeek(new Date(cursor.getFullYear(), cursor.getMonth(), 1));
  const diasMes = Array.from({ length: 42 }, (_, i) => addDays(primeiroDiaGrade, i));

  const proximas = sessoes
    .filter((s) => s.data >= hojeKey)
    .sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));

  const abas = [
    { id: 'semana', nome: 'Semana' },
    { id: 'mes', nome: 'Mês' },
    { id: 'proximos', nome: 'Próximos' },
  ];

  const handleOpenAddForDate = (dateKey) => {
    if (dateKey) setDataNova(dateKey);
    setIsModalOpen(true);
  };

  const handleCreateSession = (e) => {
    e.preventDefault();
    if (!tituloNovo.trim()) return;

    const nova = {
      id: Date.now(),
      data: dataNova,
      hora: horaNova,
      titulo: tituloNovo,
      tipo: tipoNovo,
      info: infoNova || (tipoNovo === 'grupo' ? '5 vagas' : 'Acolhimento perinatal'),
    };

    setSessoes((prev) => [nova, ...prev]);
    setIsModalOpen(false);
    setTituloNovo('');
    setInfoNova('');
    showToast('Nova sessão agendada com sucesso!');
  };

  const handleDeleteSession = (id) => {
    setSessoes((prev) => prev.filter((s) => s.id !== id));
    setSelectedSessao(null);
    showToast('Sessão cancelada.');
  };

  return (
    <div className="w-full relative">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#294D33] px-5 py-3 text-sm font-semibold text-white shadow-xl animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-[#E8A9BB]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cabeçalho */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[13.5px] md:text-[15px] text-[#4A5E4D] first-letter:uppercase">
            Gestão de agenda
          </p>
          <h1 className="mt-2 font-fraunces text-[30px] md:text-[38px] leading-[1.12] tracking-[-0.015em] text-[#1F3A27]">
            Agenda e sessões
          </h1>
          <p className="mt-2 text-[15px] text-[#4A5E4D]">
            Organize seus encontros individuais e rodas de conversa.
          </p>
        </div>

        <button
          onClick={() => handleOpenAddForDate(toKey(new Date()))}
          className="inline-flex items-center gap-2 rounded-full bg-[#294D33] px-6 py-3 text-[14px] font-bold text-white shadow-sm hover:bg-[#1F3A27] transition-colors cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Nova sessão
        </button>
      </header>

      {/* Barra de controles */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        {/* Abas */}
        <div className="inline-flex rounded-full bg-[#F1E6E1] p-1">
          {abas.map((aba) => (
            <button
              key={aba.id}
              onClick={() => setVisao(aba.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                visao === aba.id
                  ? 'bg-white text-[#2B2829] shadow-sm'
                  : 'text-stone-500 hover:text-[#2B2829]'
              }`}
            >
              {aba.nome}
            </button>
          ))}
        </div>

        {/* Navegação */}
        <div className="flex items-center gap-4">
          {visao !== 'proximos' && (
            <button
              onClick={() => navegar(-1)}
              className="p-1 rounded-full text-stone-500 hover:text-[#294D33] hover:bg-stone-100 transition cursor-pointer"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <span className="min-w-[8rem] text-center font-bold text-[#2B2829]">{rotulo}</span>

          {visao !== 'proximos' && (
            <button
              onClick={() => navegar(1)}
              className="p-1 rounded-full text-stone-500 hover:text-[#294D33] hover:bg-stone-100 transition cursor-pointer"
              aria-label="Próximo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => setCursor(new Date())}
            className="rounded-full border border-[#E4DAD5] bg-white px-4 py-1.5 text-xs font-semibold text-[#2B2829] hover:bg-[#FCF7F9] transition cursor-pointer"
          >
            Hoje
          </button>
        </div>
      </div>

      {/* ---------- SEMANA ---------- */}
      {visao === 'semana' && (
        <section className="mt-6 overflow-x-auto rounded-3xl border border-[#EFE9EB] bg-white shadow-sm">
          <div className="grid min-w-[900px] grid-cols-7 gap-3 p-4">
            {diasSemana.map((dia) => {
              const key = toKey(dia);
              const ehHoje = key === hojeKey;
              return (
                <div key={key} className="min-h-[10rem] p-2 rounded-2xl bg-[#FCF7F9]/40 border border-stone-100/70">
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wide ${
                        ehHoje ? 'text-[#294D33] font-extrabold' : 'text-[#2B2829]'
                      }`}
                    >
                      {DIAS[dia.getDay()]} {dia.getDate()}
                    </span>
                    <button
                      onClick={() => handleOpenAddForDate(key)}
                      className="p-1 rounded-full text-stone-400 hover:text-[#294D33] hover:bg-white transition cursor-pointer"
                      title={`Adicionar sessão em ${key}`}
                      aria-label={`Adicionar sessão em ${key}`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {sessoesDoDia(key).map((s) => (
                      <SessaoChip key={s.id} sessao={s} onClick={setSelectedSessao} />
                    ))}
                    {sessoesDoDia(key).length === 0 && (
                      <p className="text-[11px] text-stone-400 py-2 text-center italic">Livre</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ---------- MÊS ---------- */}
      {visao === 'mes' && (
        <section className="mt-6 overflow-x-auto rounded-3xl border border-[#EFE9EB] bg-white shadow-sm">
          <div className="min-w-[700px] p-4">
            <div className="mb-2 grid grid-cols-7 gap-2">
              {DIAS.map((d) => (
                <span
                  key={d}
                  className="text-center text-[11px] font-bold uppercase text-[#2B2829]"
                >
                  {d.slice(0, 3)}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {diasMes.map((dia) => {
                const key = toKey(dia);
                const doMes = dia.getMonth() === cursor.getMonth();
                const ehHoje = key === hojeKey;
                return (
                  <div
                    key={key}
                    onClick={() => handleOpenAddForDate(key)}
                    className={`min-h-[5.5rem] rounded-2xl border p-2 cursor-pointer transition hover:border-[#294D33]/60 ${
                      ehHoje ? 'border-[#294D33] bg-[#EBF3ED]/20' : 'border-[#EFE9EB]'
                    } ${doMes ? 'bg-white' : 'bg-[#FCF7F9] opacity-60'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p
                        className={`text-xs font-bold ${
                          ehHoje ? 'text-[#294D33]' : 'text-[#2B2829]'
                        }`}
                      >
                        {dia.getDate()}
                      </p>
                      <Plus className="w-3 h-3 text-stone-300 hover:text-[#294D33]" />
                    </div>
                    <div className="space-y-1">
                      {sessoesDoDia(key).map((s) => (
                        <div key={s.id} onClick={(e) => { e.stopPropagation(); setSelectedSessao(s); }}>
                          <SessaoChip sessao={s} compacta onClick={setSelectedSessao} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ---------- PRÓXIMOS ---------- */}
      {visao === 'proximos' && (
        <section className="mt-6 overflow-hidden rounded-3xl border border-[#EFE9EB] bg-white shadow-sm">
          {proximas.length === 0 ? (
            <p className="p-8 text-center text-sm text-stone-500">
              Nenhuma sessão agendada por enquanto.
            </p>
          ) : (
            <ul className="divide-y divide-[#EFE9EB]">
              {proximas.map((s) => {
                const d = fromKey(s.data);
                return (
                  <li
                    key={s.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-4 hover:bg-[#FCF7F9]/50 transition"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-24">
                        <p className="text-lg font-bold text-[#2B2829]">{s.hora}</p>
                        <p className="text-xs text-stone-500">
                          {DIAS[d.getDay()]} {d.getDate()}/{String(d.getMonth() + 1).padStart(2, '0')}
                        </p>
                      </div>
                      <div>
                        <p className="font-bold text-[#2B2829]">{s.titulo}</p>
                        <p className="text-xs text-stone-500">
                          {s.tipo === 'grupo' ? 'Roda de conversa' : 'Atendimento individual'} · {s.info}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          s.tipo === 'grupo'
                            ? 'bg-[#EBF3ED] text-[#294D33]'
                            : 'bg-[#F4DDE5] text-[#294D33]'
                        }`}
                      >
                        {s.tipo === 'grupo' ? 'Grupo' : 'Individual'}
                      </span>
                      <button
                        onClick={() => navigate('/sala')}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#294D33] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#1F3A27] transition cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Sala
                      </button>
                      <button
                        onClick={() => setSelectedSessao(s)}
                        className="rounded-full border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50 transition cursor-pointer"
                      >
                        Detalhes
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      {/* Modal Detalhes da Sessão */}
      {selectedSessao && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn"
          onClick={() => setSelectedSessao(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  selectedSessao.tipo === 'grupo'
                    ? 'bg-[#EBF3ED] text-[#294D33]'
                    : 'bg-[#F4DDE5] text-[#294D33]'
                }`}
              >
                {selectedSessao.tipo === 'grupo' ? 'Roda em Grupo' : 'Individual'}
              </span>
              <button
                onClick={() => setSelectedSessao(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4">
              <h3 className="font-fraunces text-2xl font-bold text-[#1F3A27]">
                {selectedSessao.titulo}
              </h3>
              <div className="mt-2 space-y-1 text-sm text-[#4A5E4D]">
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-stone-400" />
                  Data: {selectedSessao.data}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-stone-400" />
                  Horário: {selectedSessao.hora}
                </p>
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-[#FCF7F9] border border-[#EFE9EB] text-xs text-stone-600">
                <p className="font-bold text-[#1F3A27] mb-1">Informações do Acolhimento:</p>
                <p>{selectedSessao.info || 'Nenhuma observação especial anotada.'}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => {
                  setSelectedSessao(null);
                  navigate('/sala');
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#294D33] px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#1F3A27] transition cursor-pointer"
              >
                <Video className="w-4 h-4" />
                Acessar Sala Virtual
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDeleteSession(selectedSessao.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-red-200 text-red-600 px-4 py-2.5 text-xs font-semibold hover:bg-red-50 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Cancelar Sessão
                </button>
                <button
                  onClick={() => setSelectedSessao(null)}
                  className="flex-1 rounded-full border border-stone-200 text-stone-600 px-4 py-2.5 text-xs font-semibold hover:bg-stone-50 transition cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nova Sessão */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="font-fraunces text-2xl font-bold text-[#1F3A27]">
                Novo Agendamento
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
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
                    onClick={() => setTipoNovo('individual')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      tipoNovo === 'individual'
                        ? 'border-[#294D33] bg-[#EBF3ED] text-[#294D33]'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    Atendimento Individual
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipoNovo('grupo')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      tipoNovo === 'grupo'
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
                  {tipoNovo === 'individual' ? 'Nome da Mãe / Paciente' : 'Tema da Roda'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={tipoNovo === 'individual' ? 'Ex: Beatriz Oliveira' : 'Ex: Roda: Sono Compartilhado'}
                  value={tituloNovo}
                  onChange={(e) => setTituloNovo(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-[#294D33]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={dataNova}
                    onChange={(e) => setDataNova(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-[#294D33]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Horário</label>
                  <input
                    type="time"
                    required
                    value={horaNova}
                    onChange={(e) => setHoraNova(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-[#294D33]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Observações ou Vagas</label>
                <input
                  type="text"
                  placeholder={tipoNovo === 'individual' ? 'Ex: Acolhimento pós-parto' : 'Ex: 5 vagas disponíveis'}
                  value={infoNova}
                  onChange={(e) => setInfoNova(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-[#294D33]"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-full border border-stone-200 text-stone-600 font-bold text-sm hover:bg-stone-50 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-[#294D33] text-white font-bold text-sm shadow-sm hover:bg-[#1F3A27] transition cursor-pointer"
                >
                  Salvar na Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
