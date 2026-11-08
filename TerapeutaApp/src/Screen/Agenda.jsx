import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

/* ---------- Dados fictícios ---------- */
const sessoes = [
  { id: 1, data: '2026-10-21', hora: '09:00', titulo: 'Mariana Silva', tipo: 'individual' },
  { id: 2, data: '2026-10-21', hora: '14:00', titulo: 'Fernanda Lima', tipo: 'individual' },
  { id: 3, data: '2026-10-23', hora: '18:00', titulo: 'Roda: os primeiros meses', tipo: 'grupo' },
  { id: 4, data: '2026-10-24', hora: '10:00', titulo: 'Juliana Costa', tipo: 'individual' },
  { id: 5, data: '2026-10-28', hora: '19:00', titulo: 'Roda: rede de apoio', tipo: 'grupo' },
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
function SessaoChip({ sessao, compacta = false }) {
  const estilo =
    sessao.tipo === 'grupo'
      ? 'bg-[#EBF3ED] text-[#294D33] hover:bg-[#DCE9DF]'
      : 'bg-[#F4DDE5] text-[#2B2829] hover:bg-[#E8A9BB]/50';

  if (compacta) {
    return (
      <div className={`truncate rounded-full px-2 py-0.5 text-[10px] font-semibold ${estilo}`}>
        {sessao.hora} {sessao.titulo}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`w-full rounded-2xl px-3 py-2 text-left transition-colors ${estilo}`}
    >
      <p className="text-xs font-bold">{sessao.hora}</p>
      <p className="truncate text-xs">{sessao.titulo}</p>
    </button>
  );
}

/* ---------- Tela ---------- */
export default function Agenda() {
  const [visao, setVisao] = useState('semana'); // semana | mes | proximos
  const [cursor, setCursor] = useState(new Date());

  const hoje = new Date();
  const hojeKey = toKey(hoje);

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

  return (
    <div className="w-full">
      {/* Cabeçalho */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[13.5px] md:text-[15px] text-[#4A5E4D] first-letter:uppercase">
            Gestão de agenda
          </p>
          <h1 className="mt-2 font-fraunces text-[30px] md:text-[38px] leading-[1.12] tracking-[-0.015em] text-[#1F3A27]">Agenda e sessões</h1>
          <p className="mt-2 text-[15px] text-[#4A5E4D]">
            Organize seus encontros individuais e rodas de conversa.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-full bg-[#294D33] px-6 py-3 text-[14px] font-bold text-white shadow-sm hover:bg-[#1F3A27] transition-colors cursor-pointer">
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
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
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
              className="text-stone-500 hover:text-[#294D33]"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <span className="min-w-[8rem] text-center font-bold text-[#2B2829]">{rotulo}</span>

          {visao !== 'proximos' && (
            <button
              onClick={() => navegar(1)}
              className="text-stone-500 hover:text-[#294D33]"
              aria-label="Próximo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => setCursor(new Date())}
            className="rounded-full border border-[#E4DAD5] bg-white px-4 py-1.5 text-xs font-semibold text-[#2B2829] hover:bg-[#FCF7F9]"
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
                <div key={key} className="min-h-[9rem]">
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wide ${
                        ehHoje ? 'text-[#294D33]' : 'text-[#2B2829]'
                      }`}
                    >
                      {DIAS[dia.getDay()]} {dia.getDate()}
                    </span>
                    <button
                      className="text-stone-400 hover:text-[#294D33]"
                      aria-label={`Adicionar sessão em ${key}`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {sessoesDoDia(key).map((s) => (
                      <SessaoChip key={s.id} sessao={s} />
                    ))}
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
                    className={`min-h-[5.5rem] rounded-2xl border p-2 ${
                      ehHoje ? 'border-[#294D33]' : 'border-[#EFE9EB]'
                    } ${doMes ? 'bg-white' : 'bg-[#FCF7F9] opacity-60'}`}
                  >
                    <p
                      className={`mb-1 text-xs font-bold ${
                        ehHoje ? 'text-[#294D33]' : 'text-[#2B2829]'
                      }`}
                    >
                      {dia.getDate()}
                    </p>
                    <div className="space-y-1">
                      {sessoesDoDia(key).map((s) => (
                        <SessaoChip key={s.id} sessao={s} compacta />
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
                  <li key={s.id} className="flex items-center gap-6 px-6 py-4">
                    <div className="w-24">
                      <p className="text-lg font-bold text-[#2B2829]">{s.hora}</p>
                      <p className="text-xs text-stone-500">
                        {DIAS[d.getDay()]} {d.getDate()}/{String(d.getMonth() + 1).padStart(2, '0')}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[#2B2829]">{s.titulo}</p>
                      <p className="text-xs text-stone-500">
                        {s.tipo === 'grupo' ? 'Roda de conversa' : 'Atendimento individual'}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        s.tipo === 'grupo'
                          ? 'bg-[#EBF3ED] text-[#294D33]'
                          : 'bg-[#F4DDE5] text-[#294D33]'
                      }`}
                    >
                      {s.tipo === 'grupo' ? 'Grupo' : 'Individual'}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}