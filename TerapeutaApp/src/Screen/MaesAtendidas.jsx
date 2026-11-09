import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Calendar, FileText, CheckCircle2, ChevronRight, Activity, MessageSquareHeart } from 'lucide-react';

/* ---------- Dados iniciais ---------- */
const maesIniciais = [
  {
    id: 1,
    nome: 'Mariana Silva',
    bebe: 'Bebê Bento (3 meses)',
    proxima: '2026-10-23T18:00',
    grupos: 2,
    tempo: 'Acompanhada há 6 semanas',
    epds: { data: '2026-10-09', pontos: 11, nivel: 'Atenção Leve/Moderada', obs: 'Relato de choro no final da tarde e solidão na rotina de amamentação.' },
    notas: [
      { data: '10/10/2026', texto: 'Mariana participou da roda com abertura. Demonstrou alívio ao perceber que outras mães também sentem exaustão.' },
      { data: '17/10/2026', texto: 'Sessão individual focada no acolhimento do puerpério. Recomendada divisão de tarefas com a rede de apoio.' }
    ]
  },
  {
    id: 2,
    nome: 'Fernanda Lima',
    bebe: 'Bebê Clara (5 meses)',
    proxima: '2026-10-28T19:00',
    grupos: 1,
    tempo: 'Acompanhada há 3 semanas',
    epds: { data: '2026-10-01', pontos: 8, nivel: 'Estável com oscilação', obs: 'Oscilações normais de humor pós-retorno ao trabalho presencial.' },
    notas: [
      { data: '05/10/2026', texto: 'Discutida a culpa materna referente ao tempo longe da bebê. Trabalhado o conceito de presença de qualidade.' }
    ]
  },
  {
    id: 3,
    nome: 'Beatriz Santos',
    bebe: 'Bebê Gael (2 meses)',
    proxima: '2026-10-23T18:00',
    grupos: 1,
    tempo: 'Primeiro mês na plataforma',
    epds: null,
    notas: [
      { data: '12/10/2026', texto: 'Primeiro contato na roda de conversa. Excelente engajamento e escuta atenta.' }
    ]
  },
  {
    id: 4,
    nome: 'Larissa Oliveira',
    bebe: 'Bebê Maya (4 meses)',
    proxima: '2026-10-23T18:00',
    grupos: 1,
    tempo: 'Primeiro mês na plataforma',
    epds: null,
    notas: [
      { data: '15/10/2026', texto: 'Inscrita na roda de acolhimento. Aguardando primeiro encontro presencial/online.' }
    ]
  },
  {
    id: 5,
    nome: 'Juliana Costa',
    bebe: 'Bebê Arthur (6 meses)',
    proxima: '2026-10-24T10:00',
    grupos: 1,
    tempo: 'Acompanhada há 8 semanas',
    epds: { data: '2026-10-16', pontos: 6, nivel: 'Rastreio Estável / Seguro', obs: 'Excelente evolução clínica, boa adaptação à rotina alimentar do bebê.' },
    notas: [
      { data: '16/10/2026', texto: 'Evolução notável. Juliana expressa maior segurança em suas decisões maternas e menor nível de ansiedade.' }
    ]
  },
];

/* ---------- Helpers ---------- */
const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

const formatarDia = (d) => `${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`;

const formatarHora = (d) =>
  `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

const dataLocal = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const iniciais = (nome) =>
  nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

const normalizar = (t) =>
  t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/* ---------- Tela ---------- */
export default function MaesAtendidas() {
  const navigate = useNavigate();
  const [maes, setMaes] = useState(maesIniciais);
  const [busca, setBusca] = useState('');
  const [selectedMae, setSelectedMae] = useState(null);
  const [novaNota, setNovaNota] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const filtradas = maes.filter((m) => normalizar(m.nome).includes(normalizar(busca)));

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!novaNota.trim() || !selectedMae) return;

    const dataHoje = new Date().toLocaleDateString('pt-BR');
    const notaObj = { data: dataHoje, texto: novaNota.trim() };

    setMaes((prev) =>
      prev.map((m) =>
        m.id === selectedMae.id ? { ...m, notas: [notaObj, ...m.notas] } : m
      )
    );

    setSelectedMae((prev) => ({
      ...prev,
      notas: [notaObj, ...prev.notas],
    }));

    setNovaNota('');
    showToast('Anotação clínica salva no prontuário!');
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
      <header>
        <p className="text-[13.5px] md:text-[15px] text-[#4A5E4D] first-letter:uppercase">
          Escuta que acolhe
        </p>
        <h1 className="mt-2 font-fraunces text-[30px] md:text-[38px] leading-[1.12] tracking-[-0.015em] text-[#1F3A27]">
          Mães atendidas
        </h1>
        <p className="mt-2 text-[15px] text-[#4A5E4D]">
          Acompanhamento clínico sigiloso e histórico de bem-estar.
        </p>
      </header>

      {/* Busca */}
      <div className="relative mt-8">
        <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome da mãe"
          className="w-full rounded-full border border-[#E4DAD5] bg-white py-3.5 pl-12 pr-5 text-sm text-[#2B2829] placeholder-stone-400 outline-none transition focus:border-[#294D33] focus:ring-2 focus:ring-[#F4DDE5]"
        />
      </div>

      {/* Lista de Mães */}
      <ul className="mt-6 space-y-4">
        {filtradas.map((m) => {
          const proxima = new Date(m.proxima);

          return (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => setSelectedMae(m)}
                className="flex w-full items-center justify-between gap-5 rounded-3xl border border-[#EFE9EB] bg-white px-6 py-5 text-left shadow-sm transition hover:border-[#E8A9BB]/60 hover:shadow-md cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-5 min-w-0">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#F4DDE5] text-sm font-bold text-[#294D33]">
                    {iniciais(m.nome)}
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-[#2B2829] text-base">{m.nome}</p>
                    <p className="text-xs text-stone-500">{m.bebe} · {m.tempo}</p>
                    <p className="text-sm text-[#4A5E4D] mt-1">
                      Próximo: {formatarDia(proxima)} · {formatarHora(proxima)} · {m.grupos} grupo(s)
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
                      {m.epds
                        ? `EPDS: ${m.epds.pontos} pontos (${m.epds.nivel}) em ${formatarDia(dataLocal(m.epds.data))}`
                        : 'Sem EPDS registrada por enquanto.'}
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-stone-400">
                  <span className="text-xs font-semibold text-[#294D33]">Ver prontuário</span>
                  <ChevronRight className="w-5 h-5 text-stone-400" />
                </div>
              </button>
            </li>
          );
        })}

        {filtradas.length === 0 && (
          <li className="rounded-3xl border border-dashed border-[#E4DAD5] p-8 text-center text-sm text-stone-500">
            Nenhuma mãe encontrada para "{busca}".
          </li>
        )}
      </ul>

      {/* Modal Ficha Clínica & Prontuário */}
      {selectedMae && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn"
          onClick={() => setSelectedMae(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Prontuário */}
            <div className="flex items-start justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F4DDE5] text-lg font-bold text-[#294D33]">
                  {iniciais(selectedMae.nome)}
                </div>
                <div>
                  <h3 className="font-fraunces text-2xl font-bold text-[#1F3A27]">
                    {selectedMae.nome}
                  </h3>
                  <p className="text-xs text-stone-500">{selectedMae.bebe} • {selectedMae.tempo}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMae(null)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Triagem Emocional EPDS */}
            <div className="mt-5 p-5 rounded-2xl bg-[#FCF7F9] border border-[#EFE9EB]">
              <div className="flex items-center gap-2 text-sm font-bold text-[#1F3A27] mb-2">
                <Activity className="w-4 h-4 text-[#294D33]" />
                Rastreio Emocional (Escala de Edimburgo - EPDS)
              </div>
              {selectedMae.epds ? (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-700">Pontuação Registrada:</span>
                    <span className="px-3 py-1 rounded-full font-bold bg-[#F4DDE5] text-[#294D33]">
                      {selectedMae.epds.pontos} / 30 pontos ({selectedMae.epds.nivel})
                    </span>
                  </div>
                  <p className="text-stone-600 leading-relaxed italic">
                    "{selectedMae.epds.obs}"
                  </p>
                  <p className="text-[11px] text-stone-400">
                    * Instrumento demonstrativo de rastreio de bem-estar perinatal, não substitui diagnóstico clínico presencial.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-stone-500 italic">
                  A mãe ainda não realizou o preenchimento da triagem EPDS na plataforma.
                </p>
              )}
            </div>

            {/* Anotações e Evolução Clínica */}
            <div className="mt-6">
              <h4 className="flex items-center gap-2 text-sm font-bold text-[#1F3A27] mb-3">
                <FileText className="w-4 h-4 text-[#294D33]" />
                Evolução & Anotações de Atendimento
              </h4>

              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {selectedMae.notas.map((n, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-white border border-stone-200 text-xs">
                    <span className="font-bold text-[#294D33] block mb-1">{n.data}</span>
                    <p className="text-stone-700 leading-relaxed">{n.texto}</p>
                  </div>
                ))}
              </div>

              {/* Form Nova Anotação */}
              <form onSubmit={handleAddNote} className="mt-4">
                <label className="block text-xs font-bold text-stone-600 mb-1">
                  Adicionar nova observação sigilosa:
                </label>
                <textarea
                  rows="3"
                  value={novaNota}
                  onChange={(e) => setNovaNota(e.target.value)}
                  placeholder="Ex: Mãe relatou maior tranquilidade nos períodos noturnos após início da rotina de sono compartilhada..."
                  className="w-full rounded-xl border border-stone-200 p-3 text-xs outline-none focus:border-[#294D33] focus:ring-1 focus:ring-[#294D33]"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#294D33] px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#1F3A27] transition cursor-pointer"
                  >
                    <MessageSquareHeart className="w-3.5 h-3.5" />
                    Salvar no Prontuário
                  </button>
                </div>
              </form>
            </div>

            {/* Rodapé de Ações */}
            <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setSelectedMae(null);
                  navigate('/agenda');
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#F4DDE5] px-5 py-2.5 text-xs font-bold text-[#294D33] hover:bg-[#E8A9BB]/50 transition cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                Agendar Próxima Sessão na Agenda
              </button>
              <button
                onClick={() => setSelectedMae(null)}
                className="px-5 py-2.5 rounded-full border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-50 transition cursor-pointer"
              >
                Fechar Prontuário
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
