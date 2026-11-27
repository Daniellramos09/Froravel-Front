import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronLeft, ChevronRight, Video, Calendar, Clock, X, Trash2, CheckCircle2, Users, Sparkles, Repeat } from 'lucide-react';
import { usePsiAccessibility } from '../Components/Accessibility/PsiAccessibilityContext';

const isLocal = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
const API_BASE = import.meta.env.VITE_API_URL || (isLocal ? 'http://localhost:8080' : '');

// Horários padrão recomendados para acolhimento materno (divididos por turnos harmoniosos)
const HORARIOS_PADRAO_TURNOS = {
  manha: ['08:00', '09:00', '10:00', '11:00'],
  tarde: ['13:00', '14:00', '15:00', '16:00', '17:00'],
  noite: ['18:00', '18:30', '19:00', '20:00'],
};

const HORARIOS_PADRAO_CATALOGO = [
  ...HORARIOS_PADRAO_TURNOS.manha,
  ...HORARIOS_PADRAO_TURNOS.tarde,
  ...HORARIOS_PADRAO_TURNOS.noite,
];

const DIAS_SEMANA_DISPONIVEIS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

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
  const { psiProfile } = usePsiAccessibility();
  const agendaHydratedRef = useRef(false);
  const [sessoes, setSessoes] = useState(sessoesIniciais);
  const [visao, setVisao] = useState('semana'); // semana | mes | proximos
  const [cursor, setCursor] = useState(new Date());
  const [selectedSessao, setSelectedSessao] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Formulário: 'grupo' (Criar Roda de Conversa) ou 'disponibilidade' (Liberar Dias e Horários para Mães)
  const [tipoNovo, setTipoNovo] = useState('grupo');
  const [tituloNovo, setTituloNovo] = useState('');
  const [categoriaRoda, setCategoriaRoda] = useState('Depressão Pós-Parto & Puerpério');
  const [vagasRoda, setVagasRoda] = useState('12');
  const [duracaoRoda, setDuracaoRoda] = useState('60');
  const [dataNova, setDataNova] = useState(toKey(new Date()));
  const [horaNova, setHoraNova] = useState('18:00');
  const [infoNova, setInfoNova] = useState('');

  // Dias e horários liberados pela psicóloga para agendamento pelas mães (totalmente personalizáveis)
  const [diasDisponiveis, setDiasDisponiveis] = useState(() => {
    try {
      const saved = localStorage.getItem('floravel_psi_dias');
      return saved ? JSON.parse(saved) : ['Segunda', 'Quarta', 'Sexta'];
    } catch {
      return ['Segunda', 'Quarta', 'Sexta'];
    }
  });
  const [catalogoHorarios, setCatalogoHorarios] = useState(() => {
    try {
      const saved = localStorage.getItem('floravel_psi_catalogo_horarios');
      return saved ? JSON.parse(saved) : HORARIOS_PADRAO_CATALOGO;
    } catch {
      return HORARIOS_PADRAO_CATALOGO;
    }
  });
  const [horariosDisponiveis, setHorariosDisponiveis] = useState(() => {
    try {
      const saved = localStorage.getItem('floravel_psi_horarios');
      return saved ? JSON.parse(saved) : ['09:00', '14:30', '16:00', '18:30'];
    } catch {
      return ['09:00', '14:30', '16:00', '18:30'];
    }
  });
  const [novoHorarioCustom, setNovoHorarioCustom] = useState('08:30');
  const [duracaoPadrao, setDuracaoPadrao] = useState('50');
  const [recorrenciaSemanal, setRecorrenciaSemanal] = useState(true);
  const [modalidadeVaga, setModalidadeVaga] = useState('Fundo Solidário Florável (Gratuito) & Valor Social');

  useEffect(() => {
    if (!psiProfile?.id) return;
    if (!API_BASE) {
      agendaHydratedRef.current = true;
      return;
    }
    fetch(`${API_BASE}/api/psicologos/${psiProfile.id}/agenda`)
      .then((res) => (res.ok ? res.json() : null))
      .then((ag) => {
        if (!ag) return;
        if (Array.isArray(ag.diasDisponiveis) && ag.diasDisponiveis.length > 0) {
          setDiasDisponiveis(ag.diasDisponiveis);
        }
        if (Array.isArray(ag.horariosDisponiveis) && ag.horariosDisponiveis.length > 0) {
          setHorariosDisponiveis(ag.horariosDisponiveis);
          setCatalogoHorarios((prev) => Array.from(new Set([...prev, ...ag.horariosDisponiveis])).sort());
        }
        if (ag.duracaoSessaoMinutos) setDuracaoPadrao(String(ag.duracaoSessaoMinutos));
        if (typeof ag.recorrenciaSemanal === 'boolean') setRecorrenciaSemanal(ag.recorrenciaSemanal);
        if (ag.modalidadeVaga) setModalidadeVaga(ag.modalidadeVaga);
        agendaHydratedRef.current = true;
      })
      .catch(() => {
        agendaHydratedRef.current = true;
      });
  }, [psiProfile?.id]);

  useEffect(() => {
    try {
      localStorage.setItem('floravel_psi_dias', JSON.stringify(diasDisponiveis));
      localStorage.setItem('floravel_psi_catalogo_horarios', JSON.stringify(catalogoHorarios));
      localStorage.setItem('floravel_psi_horarios', JSON.stringify(horariosDisponiveis));
    } catch {}

    if (psiProfile?.id && agendaHydratedRef.current && API_BASE) {
      const token = localStorage.getItem('floravel_jwt');
      fetch(`${API_BASE}/api/psicologos/${psiProfile.id}/agenda`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          diasDisponiveis,
          horariosDisponiveis,
          duracaoSessaoMinutos: Number(duracaoPadrao) || 50,
          recorrenciaSemanal,
          modalidadeVaga,
        }),
      }).catch(() => {});
    }
  }, [diasDisponiveis, catalogoHorarios, horariosDisponiveis, duracaoPadrao, recorrenciaSemanal, modalidadeVaga, psiProfile?.id]);

  const toggleDiaDisponivel = (diaNome) => {
    setDiasDisponiveis((prev) =>
      prev.includes(diaNome) ? prev.filter((d) => d !== diaNome) : [...prev, diaNome]
    );
  };

  const toggleHorarioDisponivel = (h) => {
    setHorariosDisponiveis((prev) =>
      prev.includes(h) ? prev.filter((item) => item !== h) : [...prev, h].sort()
    );
  };

  const handleAdicionarHorarioCustom = (e) => {
    e.preventDefault();
    if (!novoHorarioCustom) return;
    setCatalogoHorarios((prev) =>
      prev.includes(novoHorarioCustom) ? prev : [...prev, novoHorarioCustom].sort()
    );
    setHorariosDisponiveis((prev) =>
      prev.includes(novoHorarioCustom) ? prev : [...prev, novoHorarioCustom].sort()
    );
    showToast(`Horário ${novoHorarioCustom} adicionado e liberado para as mães!`);
  };

  const handleRemoverHorarioCatalogo = (h) => {
    setCatalogoHorarios((prev) => prev.filter((item) => item !== h));
    setHorariosDisponiveis((prev) => prev.filter((item) => item !== h));
    showToast(`Horário ${h} removido da sua grade.`);
  };

  const aplicarTurnoRapido = (listaHoras, nomeTurno) => {
    setCatalogoHorarios((prev) => Array.from(new Set([...prev, ...listaHoras])).sort());
    setHorariosDisponiveis((prev) => Array.from(new Set([...prev, ...listaHoras])).sort());
    showToast(`Turno da ${nomeTurno} ativado na sua agenda!`);
  };

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
    if (tipoNovo === 'disponibilidade') {
      const novaVaga = {
        id: Date.now(),
        data: dataNova,
        hora: horaNova,
        titulo: `Horário Livre (${modalidadeVaga.split(' ')[0]})`,
        tipo: 'individual',
        info: infoNova || `Disponível nos dias: ${diasDisponiveis.join(', ')}`,
      };
      setSessoes((prev) => [novaVaga, ...prev]);
      setIsModalOpen(false);
      showToast('Dias e horários liberados para agendamento das mães!');
      return;
    }

    if (!tituloNovo.trim()) return;

    const novaRoda = {
      id: Date.now(),
      data: dataNova,
      hora: horaNova,
      titulo: tituloNovo.startsWith('Roda:') ? tituloNovo : `Roda: ${tituloNovo}`,
      tipo: 'grupo',
      info: `${vagasRoda} vagas · ${duracaoRoda} min · ${categoriaRoda}${infoNova ? ` — ${infoNova}` : ''}`,
    };

    setSessoes((prev) => [novaRoda, ...prev]);
    setIsModalOpen(false);
    setTituloNovo('');
    setInfoNova('');
    showToast('Nova Roda de Conversa publicada para a comunidade!');
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

      {/* Cabeçalho — Estilo Editorial Acolhedor (Consistente com Visão Geral) */}
      <header className="rounded-2xl bg-[#F1E6E1] p-5 sm:p-8 lg:p-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[13.5px] md:text-[15px] text-[#4A5E4D] first-letter:uppercase">
            Gestão de agenda e rodas
          </p>
          <h1 className="mt-2 font-fraunces text-[30px] md:text-[38px] leading-[1.12] tracking-[-0.015em] text-[#1F3A27]">
            Agenda e sessões
          </h1>
          <p className="mt-2 text-[15px] text-[#4A5E4D]">
            Defina livremente seus horários disponíveis e publique rodas de conversa para as mães.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setTipoNovo('disponibilidade');
              handleOpenAddForDate(toKey(new Date()));
            }}
            className="inline-flex items-center gap-2 rounded-full border border-[#294D33] bg-white px-5 py-3 text-[13.5px] font-bold text-[#294D33] shadow-2xs hover:bg-[#EBF3ED] transition-colors cursor-pointer active:scale-95"
          >
            <Clock className="w-4 h-4" />
            Liberar Horário Pontual
          </button>

          <button
            type="button"
            onClick={() => {
              setTipoNovo('grupo');
              handleOpenAddForDate(toKey(new Date()));
            }}
            className="inline-flex items-center gap-2 rounded-full bg-[#294D33] px-6 py-3 text-[13.5px] font-bold text-white shadow-sm hover:bg-[#1F3A27] transition-colors cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Criar Roda de Conversa
          </button>
        </div>
      </header>

      {/* PAINEL FLEXÍVEL: DIAS E HORÁRIOS DISPONÍVEIS PARA AS MÃES */}
      <section className="mt-6 rounded-3xl border border-[#EFE9EB] bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100">
          <div>
            <h2 className="font-fraunces text-2xl sm:text-3xl font-bold text-[#1F3A27]">
              Meus Dias e Horários Liberados para as Mães
            </h2>
            <p className="text-base text-stone-600 mt-1">
              Escolha em quais dias e horários as mães podem agendar com você.
            </p>
          </div>
          <span className="text-sm sm:text-base font-semibold text-[#294D33] bg-[#EBF3ED] px-4 py-2 rounded-full self-start sm:self-auto shrink-0">
            {diasDisponiveis.length} dias ativos · {horariosDisponiveis.length} horários/dia
          </span>
        </div>

        <div className="mt-7 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Coluna Esquerda: Dias da semana + Duração e Recorrência */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-base sm:text-lg font-bold text-[#1F3A27] mb-3.5">
                1. Dias da semana disponíveis
              </p>
              <div className="flex flex-wrap gap-2.5">
                {DIAS_SEMANA_DISPONIVEIS.map((diaNome) => {
                  const ativo = diasDisponiveis.includes(diaNome);
                  return (
                    <button
                      key={diaNome}
                      type="button"
                      onClick={() => {
                        toggleDiaDisponivel(diaNome);
                        showToast(`Disponibilidade de ${diaNome} atualizada!`);
                      }}
                      className={`px-4 py-2.5 rounded-full text-sm sm:text-base font-bold border transition cursor-pointer ${
                        ativo
                          ? 'bg-[#294D33] text-white border-[#294D33] shadow-2xs'
                          : 'bg-[#FCF7F9] text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {ativo ? `✓ ${diaNome}` : diaNome}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FCF7F9] border border-[#EFE9EB] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-base font-bold text-[#1F3A27]">Duração da sessão</span>
                <div className="inline-flex rounded-full bg-white border border-stone-200 p-1">
                  {['30', '50', '90'].map((min) => (
                    <button
                      key={min}
                      type="button"
                      onClick={() => {
                        setDuracaoPadrao(min);
                        showToast(`Duração padrão definida para ${min} minutos.`);
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-sm font-bold transition cursor-pointer ${
                        duracaoPadrao === min
                          ? 'bg-[#294D33] text-white'
                          : 'text-stone-700 hover:text-[#1F3A27]'
                      }`}
                    >
                      {min} min
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center justify-between gap-3 cursor-pointer pt-3 border-t border-stone-200/70">
                <span className="text-base font-medium text-stone-700 flex items-center gap-2">
                  <Repeat className="w-4 h-4 text-[#294D33] shrink-0" />
                  Repetir toda semana
                </span>
                <input
                  type="checkbox"
                  checked={recorrenciaSemanal}
                  onChange={(e) => {
                    setRecorrenciaSemanal(e.target.checked);
                    showToast(
                      e.target.checked
                        ? 'Recorrência semanal ativada na Rede de Apoio.'
                        : 'Recorrência semanal pausada.'
                    );
                  }}
                  className="w-5 h-5 accent-[#294D33] rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Coluna Direita: Horários por Turno + Horário Personalizado */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-base sm:text-lg font-bold text-[#1F3A27]">
                2. Horários disponíveis
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => aplicarTurnoRapido(HORARIOS_PADRAO_TURNOS.manha, 'Manhã')}
                  className="px-3.5 py-1.5 rounded-full bg-[#EBF3ED] text-[#294D33] text-sm font-bold hover:bg-[#DCE9DF] transition cursor-pointer"
                >
                  + Manhã
                </button>
                <button
                  type="button"
                  onClick={() => aplicarTurnoRapido(HORARIOS_PADRAO_TURNOS.tarde, 'Tarde')}
                  className="px-3.5 py-1.5 rounded-full bg-[#EBF3ED] text-[#294D33] text-sm font-bold hover:bg-[#DCE9DF] transition cursor-pointer"
                >
                  + Tarde
                </button>
                <button
                  type="button"
                  onClick={() => aplicarTurnoRapido(HORARIOS_PADRAO_TURNOS.noite, 'Noite')}
                  className="px-3.5 py-1.5 rounded-full bg-[#EBF3ED] text-[#294D33] text-sm font-bold hover:bg-[#DCE9DF] transition cursor-pointer"
                >
                  + Noite
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHorariosDisponiveis([]);
                    showToast('Todos os horários foram desmarcados.');
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-stone-100 text-stone-700 text-sm font-semibold hover:bg-stone-200 transition cursor-pointer"
                >
                  Limpar
                </button>
              </div>
            </div>

            {/* Grupos de Horários por Turno */}
            <div className="space-y-5">
              {[
                { label: 'Manhã', list: HORARIOS_PADRAO_TURNOS.manha },
                { label: 'Tarde', list: HORARIOS_PADRAO_TURNOS.tarde },
                { label: 'Noite', list: HORARIOS_PADRAO_TURNOS.noite },
              ].map((turno) => (
                <div key={turno.label}>
                  <span className="text-base font-semibold text-stone-700 mb-2 block">
                    {turno.label}
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {turno.list.map((h) => {
                      const ativo = horariosDisponiveis.includes(h);
                      return (
                        <button
                          key={h}
                          type="button"
                          onClick={() => {
                            toggleHorarioDisponivel(h);
                            showToast(`Horário ${h} ${ativo ? 'pausado' : 'liberado'} para as mães!`);
                          }}
                          className={`px-4 py-2.5 rounded-xl text-base font-bold transition cursor-pointer tabular-nums ${
                            ativo
                              ? 'bg-[#294D33] text-white shadow-2xs'
                              : 'bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {ativo ? `✓ ${h}` : h}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Adicionar Horário Personalizado */}
            <div className="pt-5 border-t border-stone-100 space-y-3.5">
              <form onSubmit={handleAdicionarHorarioCustom} className="flex flex-wrap items-center gap-3">
                <label htmlFor="novoHorarioCustom" className="text-base font-semibold text-stone-700">
                  Outro horário:
                </label>
                <div className="flex items-center gap-2 bg-[#FCF7F9] rounded-xl border border-stone-200 px-3.5 py-2">
                  <Clock className="w-4 h-4 text-[#294D33]" />
                  <input
                    id="novoHorarioCustom"
                    type="time"
                    value={novoHorarioCustom}
                    onChange={(e) => setNovoHorarioCustom(e.target.value)}
                    className="text-base font-bold text-[#1F3A27] bg-transparent outline-none tabular-nums"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-[#294D33] px-5 py-2.5 text-sm sm:text-base font-bold text-white hover:bg-[#1F3A27] transition cursor-pointer shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar
                </button>
              </form>

              {catalogoHorarios.filter((h) => !HORARIOS_PADRAO_CATALOGO.includes(h)).length > 0 && (
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-sm font-semibold text-stone-600">Personalizados:</span>
                  {catalogoHorarios
                    .filter((h) => !HORARIOS_PADRAO_CATALOGO.includes(h))
                    .map((h) => {
                      const ativo = horariosDisponiveis.includes(h);
                      return (
                        <div
                          key={h}
                          className={`inline-flex items-center rounded-xl border px-3.5 py-2 text-base font-bold tabular-nums transition ${
                            ativo
                              ? 'bg-[#F4DDE5] text-[#1F3A27] border-[#E8A9BB]'
                              : 'bg-white text-stone-500 border-stone-200'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleHorarioDisponivel(h)}
                            className="cursor-pointer mr-2"
                          >
                            {ativo ? `✓ ${h}` : h}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoverHorarioCatalogo(h)}
                            title={`Remover ${h}`}
                            aria-label={`Remover horário ${h}`}
                            className="text-stone-500 hover:text-red-600 transition cursor-pointer p-0.5"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                </div>
              )}

              {/* Resumo rápido dos horários liberados para as mães */}
              <div className="pt-2 text-base text-[#294D33] font-semibold flex items-start sm:items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#294D33] shrink-0 mt-0.5 sm:mt-0" />
                <span>
                  {horariosDisponiveis.length > 0
                    ? `Liberados (${horariosDisponiveis.length}): ${horariosDisponiveis.join(', ')}`
                    : 'Nenhum horário liberado no momento. Selecione acima para abrir vagas.'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* Modal Detalhes da Sessão via Portal */}
      {selectedSessao && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#1F3A27]/30 backdrop-blur-sm animate-fadeIn font-dmsans"
          onClick={() => setSelectedSessao(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#E4DAD5] max-h-[90vh] overflow-y-auto"
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
        </div>,
        document.body
      )}

      {/* Modal Criar Roda de Conversa ou Liberar Dias Disponíveis via Portal */}
      {isModalOpen && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#1F3A27]/30 backdrop-blur-sm animate-fadeIn font-dmsans"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#E4DAD5] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="font-fraunces text-2xl font-bold text-[#1F3A27]">
                {tipoNovo === 'grupo' ? 'Criar Roda de Conversa' : 'Liberar Dias & Horários'}
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
                <label className="block text-xs font-bold text-stone-600 mb-1">Modalidade na Agenda</label>
                <div className="grid grid-cols-2 gap-2">
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
                  <button
                    type="button"
                    onClick={() => setTipoNovo('disponibilidade')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      tipoNovo === 'disponibilidade'
                        ? 'border-[#294D33] bg-[#EBF3ED] text-[#294D33]'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    Liberar Horário p/ Mães
                  </button>
                </div>
              </div>

              {tipoNovo === 'grupo' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">
                      Título da Roda de Conversa *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: O Sono do Bebê e a Sanidade Materna"
                      value={tituloNovo}
                      onChange={(e) => setTituloNovo(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-[#294D33]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-600 mb-1">Categoria Temática</label>
                      <select
                        value={categoriaRoda}
                        onChange={(e) => setCategoriaRoda(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-xs font-medium outline-none focus:border-[#294D33] bg-white"
                      >
                        <option value="Depressão Pós-Parto & Puerpério">Depressão Pós-Parto & Puerpério</option>
                        <option value="Sobrecarga Materna & Burnout">Sobrecarga Materna & Burnout</option>
                        <option value="Ansiedade & Privação de Sono">Ansiedade & Privação de Sono</option>
                        <option value="Mães de Primeira Viagem">Mães de Primeira Viagem</option>
                        <option value="Luto Perinatal & Acolhimento">Luto Perinatal & Acolhimento</option>
                        <option value="Maternidade Solo & Rede">Maternidade Solo & Rede</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1">Vagas Máx.</label>
                        <select
                          value={vagasRoda}
                          onChange={(e) => setVagasRoda(e.target.value)}
                          className="w-full rounded-xl border border-stone-200 px-2.5 py-2.5 text-xs font-medium outline-none focus:border-[#294D33] bg-white"
                        >
                          <option value="8">8 mães</option>
                          <option value="10">10 mães</option>
                          <option value="12">12 mães</option>
                          <option value="15">15 mães</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1">Duração</label>
                        <select
                          value={duracaoRoda}
                          onChange={(e) => setDuracaoRoda(e.target.value)}
                          className="w-full rounded-xl border border-stone-200 px-2.5 py-2.5 text-xs font-medium outline-none focus:border-[#294D33] bg-white"
                        >
                          <option value="60">60 min</option>
                          <option value="90">90 min</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">
                    Tipo de Vaga Liberada para as Mães
                  </label>
                  <select
                    value={modalidadeVaga}
                    onChange={(e) => setModalidadeVaga(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs font-medium outline-none focus:border-[#294D33] bg-white"
                  >
                    <option value="Fundo Solidário Florável (Gratuito) & Valor Social">
                      Fundo Solidário Florável (Gratuito) & Valor Social
                    </option>
                    <option value="Sessão Social Acessível (R$ 40,00)">
                      Sessão Social Acessível (R$ 40,00)
                    </option>
                    <option value="Plano Florável Plus (Inclusa no Ciclo Mensal)">
                      Plano Florável Plus (Inclusa no Ciclo Mensal)
                    </option>
                  </select>
                </div>
              )}

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
                <label className="block text-xs font-bold text-stone-600 mb-1">
                  {tipoNovo === 'grupo' ? 'Descrição Acolhedora da Roda (Visível para as Mães)' : 'Observação da Disponibilidade'}
                </label>
                <input
                  type="text"
                  placeholder={
                    tipoNovo === 'grupo'
                      ? 'Ex: Espaço sem julgamentos para dividir o peso das madrugadas...'
                      : 'Ex: Horário aberto para primeira escuta perinatal'
                  }
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
                  {tipoNovo === 'grupo' ? 'Publicar Roda na Comunidade' : 'Liberar Horário na Agenda'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
