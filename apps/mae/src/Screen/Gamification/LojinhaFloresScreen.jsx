import React, { useState } from 'react';
import {
  Flower2,
  Gift,
  CheckCircle2,
  Share2,
  Copy,
  Sparkles,
  HeartHandshake,
  BookOpen,
  Calendar,
} from 'lucide-react';

const RECOMPENSAS = [
  {
    id: 'desconto-50',
    custo: 15,
    titulo: 'Consulta Social com 50% de Desconto',
    descricao:
      'Cupom para reduzir pela metade o valor da sua próxima sessão individual com psicóloga parceira.',
    categoria: 'Apoio Clínico',
    Icon: HeartHandshake,
  },
  {
    id: 'sessao-gratuita-1',
    custo: 20,
    titulo: '1 Sessão Individual Gratuita',
    descricao:
      'Atendimento psicológico individual de 50 minutos 100% custeado pelo Fundo Solidário Florável.',
    categoria: 'Fundo Solidário',
    Icon: Calendar,
  },
  {
    id: 'pacote-2-sessoes',
    custo: 30,
    titulo: 'Pacote Acompanhamento: 2 Sessões Gratuitas',
    descricao:
      'Duas sessões individuais para acompanhamento quinzenal contínuo com a mesma especialista.',
    categoria: 'Cuidado Contínuo',
    Icon: Sparkles,
  },
  {
    id: 'kit-bem-estar',
    custo: 40,
    titulo: 'Kit Acolhimento Completo + 2 Sessões',
    descricao:
      'Inclui 2 sessões individuais gratuitas, acesso prioritário às rodas temáticas e guia perinatal exclusivo.',
    categoria: 'Pacote Completo',
    Icon: BookOpen,
  },
];

function gerarVoucher() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `FLR-${code}`;
}

export default function LojinhaFloresScreen({
  flowersCount = 12,
  onSpendFlowers,
  onOpenInvite,
  onGoToNetwork,
}) {
  const [resgates, setResgates] = useState(() => {
    try {
      const saved = localStorage.getItem('floravel_resgates_flores');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [feedback, setFeedback] = useState('');
  const [copiadoCodigo, setCopiadoCodigo] = useState('');

  const handleResgatar = (item) => {
    if (flowersCount < item.custo) return;

    const novoVoucher = {
      id: `${item.id}-${Date.now()}`,
      titulo: item.titulo,
      custo: item.custo,
      codigo: gerarVoucher(),
      data: new Date().toLocaleDateString('pt-BR'),
    };

    if (onSpendFlowers) {
      onSpendFlowers(item.custo);
    }

    const atualizados = [novoVoucher, ...resgates];
    setResgates(atualizados);
    try {
      localStorage.setItem('floravel_resgates_flores', JSON.stringify(atualizados));
    } catch {}

    setFeedback(`Recompensa "${item.titulo}" resgatada com sucesso. Seu código: ${novoVoucher.codigo}`);
    setTimeout(() => setFeedback(''), 5000);
  };

  const copiarVoucher = (codigo) => {
    navigator.clipboard?.writeText(codigo).catch(() => {});
    setCopiadoCodigo(codigo);
    setTimeout(() => setCopiadoCodigo(''), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 font-dmsans animate-fadeIn">
      {/* Cabeçalho seguindo o padrão editorial de Canal de Denúncias */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 text-[#1F3A27]">
            <Gift size={22} aria-hidden="true" />
            <h1 className="text-2xl sm:text-3xl font-fraunces font-normal text-[#1F3A27]">
              Clube & Lojinha de Flores
            </h1>
          </div>
          <p className="text-sm text-[#4A5E4D] leading-relaxed max-w-2xl">
            Troque as flores acumuladas com seus registros e indicações por sessões gratuitas e benefícios de cuidado na Florável.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenInvite}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#294D33] hover:bg-[#1F3A27] text-white text-xs sm:text-sm font-bold transition cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Share2 size={15} />
          <span>Indicar mãe (+3 Flores)</span>
        </button>
      </header>

      {/* Card de Saldo */}
      <section className="bg-white rounded-xl border border-[#E4DAD5] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-[#F4DDE5] border border-[#E8A9BB]/50 flex items-center justify-center shrink-0">
            <Flower2 size={28} className="text-[#A8435F]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#4A5E4D]">Seu Saldo Disponível</p>
            <p className="text-2xl sm:text-3xl font-fraunces font-normal text-[#1F3A27] tabular-nums">
              {flowersCount} {flowersCount === 1 ? 'Flor' : 'Flores'}
            </p>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-[#4A5E4D] bg-[#FCF7F9] border border-[#E4DAD5] rounded-lg px-4 py-3 max-w-md">
          Cada mãe indicada soma <strong className="text-[#1F3A27]">+3 Flores</strong> no seu saldo na hora. A partir de 15 flores você já pode resgatar benefícios.
        </div>
      </section>

      {feedback && (
        <div className="p-4 rounded-xl bg-[#EBF3ED] border border-[#294D33]/25 text-[#1F3A27] text-sm font-semibold flex items-center gap-2.5">
          <CheckCircle2 size={18} className="shrink-0 text-[#294D33]" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Catálogo de Recompensas */}
      <section className="space-y-4">
        <h2 className="text-lg font-fraunces font-normal text-[#1F3A27]">
          Recompensas Disponíveis
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RECOMPENSAS.map((item) => {
            const Icon = item.Icon;
            const podeResgatar = flowersCount >= item.custo;
            const faltam = Math.max(0, item.custo - flowersCount);

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-[#E4DAD5] p-5 sm:p-6 flex flex-col justify-between gap-5"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#FCF7F9] border border-[#E4DAD5] flex items-center justify-center text-[#294D33] shrink-0">
                        <Icon size={18} />
                      </div>
                      <span className="text-xs font-semibold text-[#4A5E4D]">
                        {item.categoria}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#F4DDE5]/70 border border-[#E8A9BB]/50 text-xs font-bold text-[#1F3A27] shrink-0 tabular-nums">
                      <Flower2 size={13} className="text-[#A8435F]" />
                      {item.custo} Flores
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-fraunces font-normal text-[#1F3A27]">
                      {item.titulo}
                    </h3>
                    <p className="text-sm text-[#4A5E4D] leading-relaxed mt-1">
                      {item.descricao}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E4DAD5] flex items-center justify-between gap-3">
                  {podeResgatar ? (
                    <>
                      <span className="text-xs font-semibold text-[#294D33]">
                        Disponível para resgate
                      </span>
                      <button
                        type="button"
                        onClick={() => handleResgatar(item)}
                        className="px-5 py-2.5 rounded-lg bg-[#294D33] hover:bg-[#1F3A27] text-white text-xs sm:text-sm font-bold transition cursor-pointer"
                      >
                        Trocar {item.custo} Flores
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-[#4A5E4D]">
                        Faltam <strong className="text-[#1F3A27]">{faltam}</strong> {faltam === 1 ? 'flor' : 'flores'}
                      </span>
                      <button
                        type="button"
                        onClick={onOpenInvite}
                        className="px-4 py-2 rounded-lg bg-[#FCF7F9] hover:bg-[#F1E6E1] border border-[#E4DAD5] text-[#1F3A27] text-xs font-semibold transition cursor-pointer"
                      >
                        Ganhar flores
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Meus Vouchers Resgatados */}
      <section className="bg-white rounded-xl border border-[#E4DAD5] p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-fraunces font-normal text-[#1F3A27]">
              Meus Vouchers Resgatados
            </h2>
            <p className="text-xs text-[#4A5E4D]">
              Apresente o código na Rede de Apoio ao agendar sua consulta.
            </p>
          </div>
          {onGoToNetwork && (
            <button
              type="button"
              onClick={onGoToNetwork}
              className="text-xs font-bold text-[#294D33] hover:underline cursor-pointer self-start sm:self-auto"
            >
              Ir para Rede de Apoio
            </button>
          )}
        </div>

        {resgates.length === 0 ? (
          <div className="py-8 text-center text-xs sm:text-sm text-[#4A5E4D] border border-dashed border-[#E4DAD5] rounded-lg">
            Você ainda não resgatou nenhuma recompensa. Acumule 15 flores para liberar o primeiro benefício.
          </div>
        ) : (
          <div className="space-y-2.5">
            {resgates.map((r) => (
              <div
                key={r.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-[#FCF7F9] border border-[#E4DAD5]"
              >
                <div>
                  <p className="text-sm font-bold text-[#1F3A27]">{r.titulo}</p>
                  <p className="text-xs text-[#4A5E4D]">
                    Resgatado em {r.data} · {r.custo} Flores
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => copiarVoucher(r.codigo)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-[#E4DAD5] text-xs font-mono font-bold text-[#1F3A27] hover:bg-[#F1E6E1] transition cursor-pointer self-start sm:self-auto"
                >
                  <span>{copiadoCodigo === r.codigo ? 'Copiado!' : r.codigo}</span>
                  <Copy size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
