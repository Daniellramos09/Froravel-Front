import { useEffect, useMemo, useState } from 'react';
import { ShieldAlert, Search, Video, MessageSquare, UserCheck, Clock, ShieldCheck } from 'lucide-react';
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

  const contatosFiltrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return contatos.filter((c) => {
      if (filtroPapel !== 'todos' && c.papel !== filtroPapel) return false;
      if (filtroCanal !== 'todos' && c.tipoCanal !== filtroCanal) return false;
      if (!q) return true;
      return (
        c.nome.toLowerCase().includes(q) ||
        (c.codigoPublico || '').toLowerCase().includes(q) ||
        (c.canal || '').toLowerCase().includes(q)
      );
    });
  }, [contatos, busca, filtroPapel, filtroCanal]);

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
          Aqui fica o registro seguro de mães e psicólogas com quem você teve contato em chamadas em grupo, consultas ou mensagens na comunidade. Se algo te deixou desconfortável, você pode denunciar a qualquer momento usando o código público da pessoa.
        </p>
      </header>

      {/* Busca e Filtros */}
      <section className="bg-white rounded-xl border border-[#E4DAD5] p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-fraunces font-normal text-[#1F3A27]">
              Pessoas com quem você teve contato
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Selecione a pessoa (mãe ou psicóloga) para registrar uma denúncia sigilosa.
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar nome ou código #FLR..."
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
            { id: 'video_grupo', label: 'Vídeo / Chamadas' },
            { id: 'mensagem', label: 'Mensagens / Comunidade' },
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

        {/* Lista de Contatos */}
        {contatosFiltrados.length === 0 ? (
          <div className="py-10 text-center text-xs text-stone-500 border border-dashed border-[#E4DAD5] rounded-lg">
            Nenhum contato encontrado para os filtros selecionados.
          </div>
        ) : (
          <div className="divide-y divide-[#E4DAD5] border border-[#E4DAD5] rounded-lg overflow-hidden">
            {contatosFiltrados.map((c) => (
              <div
                key={`${c.id}-${c.codigoPublico}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white hover:bg-[#FCF7F9] transition"
              >
                <div className="min-w-0 space-y-1">
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
                      {c.papel === 'psicologo' ? 'Psicóloga' : 'Mãe'}
                    </span>
                  </div>

                  <p className="text-xs text-[#4A5E4D] flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="inline-flex items-center gap-1">
                      {c.tipoCanal === 'video_grupo' ? (
                        <Video size={12} aria-hidden="true" />
                      ) : (
                        <MessageSquare size={12} aria-hidden="true" />
                      )}
                      {c.canal}
                    </span>
                    <span className="inline-flex items-center gap-1 text-stone-400">
                      <Clock size={12} aria-hidden="true" />
                      {formatarData(c.ultimoContato)}
                    </span>
                  </p>
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
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 transition shrink-0 cursor-pointer"
                >
                  <ShieldAlert size={14} aria-hidden="true" />
                  <span>Denunciar</span>
                </button>
              </div>
            ))}
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
