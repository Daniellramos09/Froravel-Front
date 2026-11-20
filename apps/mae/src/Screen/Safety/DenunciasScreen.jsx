import { useEffect, useMemo, useState } from 'react';
import {
  ShieldAlert,
  Search,
  Video,
  MessageSquare,
  UserCheck,
  Clock,
  ShieldCheck,
  ChevronDown,
  Users,
} from 'lucide-react';
import {
  carregarContatosSeguranca,
  carregarDenunciasRegistradas,
} from '../../utils/contatosSeguranca';

const MOTIVO_LABELS = {
  comentario_ofensivo: 'Comentário ofensivo ou desrespeitoso',
  quebra_sigilo: 'Quebra de sigilo ou exposição',
  conduta_profissional: 'Conduta inadequada da profissional',
  assedio: 'Assédio ou intimidação',
  outro: 'Outro motivo',
};

function formatarData(iso) {
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export default function DenunciasScreen({ onOpenDenuncia }) {
  const [contatos, setContatos] = useState(carregarContatosSeguranca);
  const [denuncias, setDenuncias] = useState(carregarDenunciasRegistradas);
  const [busca, setBusca] = useState('');
  const [filtroPapel, setFiltroPapel] = useState('todos'); // 'todos' | 'psicologo' | 'mae'
  const [filtroCanal, setFiltroCanal] = useState('todos'); // 'todos' | 'video_grupo' | 'mensagem'
  const [gruposAbertos, setGruposAbertos] = useState({});

  useEffect(() => {
    const sync = () => {
      setContatos(carregarContatosSeguranca());
      setDenuncias(carregarDenunciasRegistradas());
    };
    window.addEventListener('focus', sync);
    const timer = setInterval(sync, 1500);
    return () => {
      window.removeEventListener('focus', sync);
      clearInterval(timer);
    };
  }, []);

  const gruposFiltrados = useMemo(() => {
    const q = busca.trim().toLowerCase();

    const filtrados = contatos.filter((c) => {
      if (filtroPapel !== 'todos' && c.papel !== filtroPapel) return false;
      if (filtroCanal !== 'todos' && c.tipoCanal !== filtroCanal) return false;
      if (!q) return true;
      return (
        c.nome.toLowerCase().includes(q) ||
        (c.codigoPublico || '').toLowerCase().includes(q) ||
        (c.canal || '').toLowerCase().includes(q)
      );
    });

    const mapaGrupos = new Map();
    for (const c of filtrados) {
      const chave = c.canal || 'Encontros Florável';
      if (!mapaGrupos.has(chave)) {
        mapaGrupos.set(chave, {
          canal: chave,
          tipoCanal: c.tipoCanal || 'video_grupo',
          ultimoContato: c.ultimoContato,
          participantes: [],
        });
      }
      const grupo = mapaGrupos.get(chave);
      grupo.participantes.push(c);
      if (new Date(c.ultimoContato) > new Date(grupo.ultimoContato)) {
        grupo.ultimoContato = c.ultimoContato;
      }
    }

    return Array.from(mapaGrupos.values()).sort(
      (a, b) => new Date(b.ultimoContato).getTime() - new Date(a.ultimoContato).getTime()
    );
  }, [contatos, busca, filtroPapel, filtroCanal]);

  const toggleGrupo = (canal) => {
    setGruposAbertos((prev) => ({ ...prev, [canal]: !prev[canal] }));
  };

  return (
    <div className="animate-fadeIn font-dmsans max-w-4xl mx-auto pb-16 space-y-8 text-[#2B2829]">
      {/* Cabeçalho Editorial */}
      <header className="rounded-xl bg-[#F1E6E1] border border-[#E4DAD5] p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2.5 text-[#1F3A27]">
          <ShieldCheck size={22} aria-hidden="true" />
          <h1 className="text-2xl sm:text-3xl font-fraunces font-normal text-[#1F3A27]">
            Canal de Denúncias e Segurança
          </h1>
        </div>
        <p className="text-sm text-[#4A5E4D] leading-relaxed max-w-2xl">
          Aqui fica o registro seguro das Rodas de Conversa, consultas e mensagens em que você participou. Clique no nome da roda ou canal para ver a terapeuta e as mães presentes e denunciar com sigilo usando o código público.
        </p>
      </header>

      {/* Busca e Filtros */}
      <section className="bg-white rounded-xl border border-[#E4DAD5] p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-fraunces font-normal text-[#1F3A27]">
              Rodas de Conversa e Canais Anteriores
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Clique em uma roda para abrir a lista de quem estava presente (terapeuta e mães).
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar roda, nome ou #FLR..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E4DAD5] bg-[#FCF7F9] focus:bg-white focus:outline-none focus:border-[#294D33]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'psicologo', label: 'Psicólogas' },
            { id: 'mae', label: 'Mães' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFiltroPapel(tab.id)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                filtroPapel === tab.id
                  ? 'bg-[#294D33] text-white'
                  : 'bg-[#FCF7F9] text-stone-600 border border-[#E4DAD5] hover:text-[#294D33]'
              }`}
            >
              {tab.label}
            </button>
          ))}

          <span className="text-stone-300 mx-1">|</span>

          {[
            { id: 'todos', label: 'Todos os canais' },
            { id: 'video_grupo', label: 'Rodas / Vídeo' },
            { id: 'mensagem', label: 'Comunidade / Mensagens' },
          ].map((canal) => (
            <button
              key={canal.id}
              type="button"
              onClick={() => setFiltroCanal(canal.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                filtroCanal === canal.id
                  ? 'bg-[#F1E6E1] text-[#1F3A27] border border-[#294D33]/30'
                  : 'text-stone-500 hover:text-[#294D33]'
              }`}
            >
              {canal.label}
            </button>
          ))}
        </div>

        {/* Lista de Rodas / Canais Expansíveis */}
        {gruposFiltrados.length === 0 ? (
          <div className="py-10 text-center text-xs text-stone-500 border border-dashed border-[#E4DAD5] rounded-lg">
            Nenhum registro encontrado para os filtros selecionados.
          </div>
        ) : (
          <div className="space-y-3">
            {gruposFiltrados.map((grupo) => {
              const aberto = Boolean(gruposAbertos[grupo.canal]) || Boolean(busca.trim());
              const totalPsi = grupo.participantes.filter((p) => p.papel === 'psicologo').length;
              const totalMaes = grupo.participantes.filter((p) => p.papel !== 'psicologo').length;

              return (
                <div
                  key={grupo.canal}
                  className="border border-[#E4DAD5] rounded-lg overflow-hidden bg-white"
                >
                  <button
                    type="button"
                    onClick={() => toggleGrupo(grupo.canal)}
                    aria-expanded={aberto}
                    className="w-full flex items-center justify-between gap-3 p-4 text-left bg-[#FCF7F9] hover:bg-[#F1E6E1]/60 transition cursor-pointer"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 font-bold text-sm text-[#1F3A27]">
                          {grupo.tipoCanal === 'video_grupo' ? (
                            <Video size={15} className="text-[#294D33] shrink-0" aria-hidden="true" />
                          ) : (
                            <MessageSquare size={15} className="text-[#294D33] shrink-0" aria-hidden="true" />
                          )}
                          <span className="truncate">{grupo.canal}</span>
                        </span>
                      </div>
                      <p className="text-xs text-[#4A5E4D] flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="inline-flex items-center gap-1">
                          <Users size={12} aria-hidden="true" />
                          {totalPsi} terapeuta(s) · {totalMaes} mãe(s)
                        </span>
                        <span className="inline-flex items-center gap-1 text-stone-400">
                          <Clock size={12} aria-hidden="true" />
                          {formatarData(grupo.ultimoContato)}
                        </span>
                      </p>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`text-[#4A5E4D] shrink-0 transition-transform duration-200 ${
                        aberto ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {aberto && (
                    <div className="divide-y divide-[#E4DAD5] border-t border-[#E4DAD5]">
                      {grupo.participantes.map((c) => (
                        <div
                          key={`${grupo.canal}-${c.id}-${c.codigoPublico}`}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-white hover:bg-[#FCF7F9]/60 transition"
                        >
                          <div className="min-w-0 space-y-0.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-sm text-[#2B2829]">{c.nome}</span>
                              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#F1E6E1] text-[#1F3A27] font-semibold">
                                {c.codigoPublico}
                              </span>
                              <span
                                className={`text-[11px] px-2 py-0.5 rounded font-semibold inline-flex items-center gap-1 ${
                                  c.papel === 'psicologo'
                                    ? 'bg-[#EBF3ED] text-[#294D33]'
                                    : 'bg-[#F4DDE5] text-[#2B2829]'
                                }`}
                              >
                                <UserCheck size={11} aria-hidden="true" />
                                {c.papel === 'psicologo' ? 'Terapeuta' : 'Mãe'}
                              </span>
                            </div>
                            <p className="text-xs text-stone-500">{c.papelLabel}</p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              onOpenDenuncia?.({
                                targetUser: `${c.nome} (${c.codigoPublico})`,
                                targetCodigoPublico: c.codigoPublico,
                                context: c.canal,
                              })
                            }
                            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 transition shrink-0 cursor-pointer"
                          >
                            <ShieldAlert size={14} aria-hidden="true" />
                            <span>Denunciar</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Histórico de Denúncias Enviadas */}
      <section className="bg-white rounded-xl border border-[#E4DAD5] p-5 sm:p-6 space-y-4">
        <div>
          <h2 className="text-lg font-fraunces font-normal text-[#1F3A27]">
            Minhas denúncias registradas
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Todas as denúncias são analisadas com sigilo ético pela moderação Florável.
          </p>
        </div>

        {denuncias.length === 0 ? (
          <p className="text-xs text-stone-500 py-6 text-center border border-dashed border-[#E4DAD5] rounded-lg">
            Você ainda não registrou nenhuma denúncia.
          </p>
        ) : (
          <div className="space-y-3">
            {denuncias.map((d) => (
              <div
                key={d.id}
                className="rounded-lg border border-[#E4DAD5] bg-[#FCF7F9] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#1F3A27]">
                      Protocolo {d.id}
                    </span>
                    <span className="text-xs font-semibold text-[#2B2829]">
                      · {d.targetUser}
                    </span>
                  </div>
                  <p className="text-xs text-[#4A5E4D]">
                    Motivo: {MOTIVO_LABELS[d.motivo] || d.motivo} · Canal: {d.context}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Registrada em {formatarData(d.data)}
                  </p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-md bg-[#EBF3ED] text-[#294D33] text-xs font-bold shrink-0">
                  Em análise sigilosa
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
