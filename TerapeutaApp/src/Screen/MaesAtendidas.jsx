import { useState } from 'react';
import { Search } from 'lucide-react';

/* ---------- Dados fictícios ---------- */
const maes = [
  { id: 1, nome: 'Mariana Silva', proxima: '2026-10-23T18:00', grupos: 2, epds: { data: '2026-10-09', pontos: 11 } },
  { id: 2, nome: 'Fernanda Lima', proxima: '2026-10-28T19:00', grupos: 1, epds: { data: '2026-10-01', pontos: 8 } },
  { id: 3, nome: 'Beatriz Santos', proxima: '2026-10-23T18:00', grupos: 1, epds: null },
  { id: 4, nome: 'Larissa Oliveira', proxima: '2026-10-23T18:00', grupos: 1, epds: null },
  { id: 5, nome: 'Juliana Costa', proxima: '2026-10-24T10:00', grupos: 1, epds: { data: '2026-10-16', pontos: 6 } },
];

/* ---------- Helpers ---------- */
const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

// "sexta, 23 de out"
const formatarDia = (d) => `${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`;

// "18:00"
const formatarHora = (d) =>
  `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

// "AAAA-MM-DD" -> Date local (evita problema de fuso)
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

// busca sem diferenciar acento e maiúscula
const normalizar = (t) =>
  t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/* ---------- Tela ---------- */
export default function MaesAtendidas() {
  const [busca, setBusca] = useState('');

  const filtradas = maes.filter((m) => normalizar(m.nome).includes(normalizar(busca)));

  return (
    <div className="w-full">
      {/* Cabeçalho */}
      <header>
        <p className="text-[13.5px] md:text-[15px] text-[#4A5E4D] first-letter:uppercase">
          Escuta que acolhe
        </p>
        <h1 className="mt-2 font-fraunces text-[30px] md:text-[38px] leading-[1.12] tracking-[-0.015em] text-[#1F3A27]">Mães atendidas</h1>
        <p className="mt-2 text-[15px] text-[#4A5E4D]">Dados fictícios de demonstração.</p>
      </header>

      {/* Busca */}
      <div className="relative mt-8">
        <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome"
          className="w-full rounded-full border border-[#E4DAD5] bg-transparent py-3.5 pl-12 pr-5 text-sm text-[#2B2829] placeholder-stone-400 outline-none transition focus:border-[#294D33] focus:ring-2 focus:ring-[#F4DDE5]"
        />
      </div>

      {/* Lista */}
      <ul className="mt-6 space-y-4">
        {filtradas.map((m) => {
          const proxima = new Date(m.proxima);

          return (
            <li key={m.id}>
              <button
                type="button"
                className="flex w-full items-center gap-5 rounded-3xl border border-[#EFE9EB] bg-white px-6 py-5 text-left shadow-sm transition hover:border-[#E8A9BB]/60 hover:shadow-md"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#F4DDE5] text-sm font-bold text-[#294D33]">
                  {iniciais(m.nome)}
                </div>

                <div className="min-w-0">
                  <p className="font-bold text-[#2B2829]">{m.nome}</p>
                  <p className="text-sm text-[#4A5E4D]">
                    Próximo: {formatarDia(proxima)} · {formatarHora(proxima)} · {m.grupos} grupo(s)
                  </p>
                  <p className="mt-0.5 text-xs text-stone-500">
                    {m.epds
                      ? `EPDS (demonstrativa) em ${formatarDia(dataLocal(m.epds.data))}: ${m.epds.pontos} pontos — rastreio, não diagnóstico.`
                      : 'Sem EPDS registrada.'}
                  </p>
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
    </div>
  );
}