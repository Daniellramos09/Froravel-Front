import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Search, X, Calendar, ShieldCheck, CheckCircle2, ChevronRight, Activity, Users } from 'lucide-react';

/* ---------- Dados iniciais (Sem Prontuário Eletrônico — Diretriz Zero Prontuário) ---------- */
const maesIniciais = [
  {
    id: 1,
    nome: 'Mariana Silva',
    bebe: 'Bebê Bento (3 meses)',
    proxima: '2026-10-23T18:00',
    grupos: 2,
    tempo: 'Na comunidade há 6 semanas',
    rodasParticipadas: ['Puerpério Real & Exaustão', 'Rede de Apoio e Limites Familiares'],
    preferenciaAcolhimento: 'Prefere encontros em grupo no período noturno',
    triagemCompartilhada: { data: '2026-10-09', nivel: 'Acolhimento Moderado Prioritário' }
  },
  {
    id: 2,
    nome: 'Fernanda Lima',
    bebe: 'Bebê Clara (5 meses)',
    proxima: '2026-10-28T19:00',
    grupos: 1,
    tempo: 'Na comunidade há 3 semanas',
    rodasParticipadas: ['Retorno ao Trabalho & Culpa Materna'],
    preferenciaAcolhimento: 'Escuta individual e rodas de retorno profissional',
    triagemCompartilhada: { data: '2026-10-01', nivel: 'Bem-estar com Oscilação Leve' }
  },
  {
    id: 3,
    nome: 'Beatriz Santos',
    bebe: 'Bebê Gael (2 meses)',
    proxima: '2026-10-23T18:00',
    grupos: 1,
    tempo: 'Primeiro mês na plataforma',
    rodasParticipadas: ['Primeiras Semanas com o Recém-Nascido'],
    preferenciaAcolhimento: 'Participação ativa em rodas semanais',
    triagemCompartilhada: null
  },
  {
    id: 4,
    nome: 'Larissa Oliveira',
    bebe: 'Bebê Maya (4 meses)',
    proxima: '2026-10-23T18:00',
    grupos: 1,
    tempo: 'Primeiro mês na plataforma',
    rodasParticipadas: ['Maternidade Solo & Autonomia'],
    preferenciaAcolhimento: 'Aguardando primeira roda online',
    triagemCompartilhada: null
  },
  {
    id: 5,
    nome: 'Juliana Costa',
    bebe: 'Bebê Arthur (6 meses)',
    proxima: '2026-10-24T10:00',
    grupos: 1,
    tempo: 'Na comunidade há 8 semanas',
    rodasParticipadas: ['Introdução Alimentar sem Culpa', 'Autocuidado Possível'],
    preferenciaAcolhimento: 'Encontros matutinos',
    triagemCompartilhada: { data: '2026-10-16', nivel: 'Bem-estar Equilibrado' }
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
  const [maes] = useState(maesIniciais);
  const [busca, setBusca] = useState('');
  const [selectedMae, setSelectedMae] = useState(null);

  const filtradas = maes.filter((m) => normalizar(m.nome).includes(normalizar(busca)));

  return (
    <div className="w-full relative">
      {/* Cabeçalho */}
      <header>
        <p className="text-[13.5px] md:text-[15px] text-[#4A5E4D] first-letter:uppercase">
          Escuta que acolhe
        </p>
        <h1 className="mt-2 font-fraunces text-[30px] md:text-[38px] leading-[1.12] tracking-[-0.015em] text-[#1F3A27]">
          Mães acolhidas
        </h1>
        <p className="mt-2 text-[15px] text-[#4A5E4D]">
          Conexão para rodas de conversa e agendamentos (Arquitetura Zero Prontuário — CFP/LGPD).
        </p>
      </header>

      {/* Banner de Conformidade Zero Prontuário */}
      <div className="mt-6 rounded-2xl bg-[#EBF3ED] border border-[#294D33]/15 p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#294D33] shrink-0 mt-0.5" />
        <p className="text-xs text-[#1F3A27] leading-relaxed">
          <strong>Diretriz de Sigilo Profissional (CFP & LGPD):</strong> A Florável é uma comunidade de apoio mútuo e ponte terapêutica, <strong>não armazenando prontuários clínicos ou evoluções médicas</strong> em nuvem. Seus registros formais de sessão devem ser mantidos em seu controle profissional privado externo.
        </p>
      </div>

      {/* Busca */}
      <div className="relative mt-6">
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
                      Próximo encontro: {formatarDia(proxima)} · {formatarHora(proxima)} · {m.grupos} roda(s)
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
                      {m.triagemCompartilhada
                        ? `Indicador de acolhimento: ${m.triagemCompartilhada.nivel} (${formatarDia(dataLocal(m.triagemCompartilhada.data))})`
                        : 'Sem check-in recente compartilhado.'}
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-stone-400">
                  <span className="text-xs font-semibold text-[#294D33]">Ver vínculo</span>
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

      {/* Modal Resumo de Acolhimento & Participação (Zero Prontuário) via Portal Centralizado */}
      {selectedMae && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#1F3A27]/30 backdrop-blur-sm animate-fadeIn font-dmsans"
          onClick={() => setSelectedMae(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-xl w-full shadow-2xl border border-[#E4DAD5]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Resumo */}
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

            {/* Indicador de Check-in */}
            <div className="mt-5 p-5 rounded-2xl bg-[#FCF7F9] border border-[#EFE9EB]">
              <div className="flex items-center gap-2 text-sm font-bold text-[#1F3A27] mb-2">
                <Activity className="w-4 h-4 text-[#294D33]" />
                Sinalizador de Acolhimento Comunitário
              </div>
              {selectedMae.triagemCompartilhada ? (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-700">Status de Prioridade:</span>
                    <span className="px-3 py-1 rounded-full font-bold bg-[#F4DDE5] text-[#294D33]">
                      {selectedMae.triagemCompartilhada.nivel}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Preferência informada pela mãe: {selectedMae.preferenciaAcolhimento}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-stone-500 italic">
                  A mãe ainda não compartilhou check-in emocional recente na plataforma.
                </p>
              )}
            </div>

            {/* Rodas de Conversa Participadas */}
            <div className="mt-6">
              <h4 className="flex items-center gap-2 text-sm font-bold text-[#1F3A27] mb-3">
                <Users className="w-4 h-4 text-[#294D33]" />
                Rodas de Conversa & Grupos de Apoio
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedMae.rodasParticipadas.map((roda, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-[#294D33]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#294D33]" />
                    {roda}
                  </span>
                ))}
              </div>
            </div>

            {/* Nota de Compliance */}
            <div className="mt-6 p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-600 leading-relaxed">
              <strong className="text-stone-800 block mb-1">Proteção de Sigilo Clínico (Zero Prontuário):</strong>
              Para segurança jurídica da profissional e intimidade da mãe, anotações clínicas individuais não são salvas na plataforma Florável.
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
                Ver Encontros na Agenda
              </button>
              <button
                onClick={() => setSelectedMae(null)}
                className="px-5 py-2.5 rounded-full border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-50 transition cursor-pointer"
              >
                Fechar Resumo
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
