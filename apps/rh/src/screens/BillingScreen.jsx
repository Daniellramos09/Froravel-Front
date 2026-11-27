import { Building2, CreditCard, ShieldCheck, FileText, Download, Calendar, CheckCircle2, Clock } from "lucide-react";

const VALOR_POR_LICENCA = 49.9;

const formatBRL = (valor) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

export default function BillingScreen({ company = null, relatorio = null, onTriggerToast }) {
  const totalEmitidas = relatorio?.totalLicencasEmitidas ?? 28;
  const totalAtivadas = relatorio?.totalLicencasAtivadas ?? 22;
  const valorMensalAtual = totalEmitidas * VALOR_POR_LICENCA;

  const faturasFicticias = [
    {
      id: "FAT-2026-11",
      competencia: "Novembro/2026",
      vencimento: "05/12/2026",
      licencas: totalEmitidas,
      valor: valorMensalAtual,
      status: "Em aberto",
      nfe: "Em processamento",
    },
    {
      id: "FAT-2026-10",
      competencia: "Outubro/2026",
      vencimento: "05/11/2026",
      licencas: 28,
      valor: 28 * VALOR_POR_LICENCA,
      status: "Paga",
      nfe: "NF-e #004812",
    },
    {
      id: "FAT-2026-09",
      competencia: "Setembro/2026",
      vencimento: "05/10/2026",
      licencas: 24,
      valor: 24 * VALOR_POR_LICENCA,
      status: "Paga",
      nfe: "NF-e #004509",
    },
    {
      id: "FAT-2026-08",
      competencia: "Agosto/2026",
      vencimento: "05/09/2026",
      licencas: 20,
      valor: 20 * VALOR_POR_LICENCA,
      status: "Paga",
      nfe: "NF-e #004198",
    },
  ];

  const handleBaixarDocumento = (fatura) => {
    const msg =
      fatura.status === "Paga"
        ? `Demonstrativo da ${fatura.nfe} (${fatura.competencia}) gerado.`
        : `2ª via do boleto de ${fatura.competencia} (${formatBRL(fatura.valor)}) gerada.`;
    if (onTriggerToast) {
      onTriggerToast(msg);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans antialiased text-stone-800 animate-fadeIn">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-normal text-[#1F3A27] tracking-tight"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Faturamento
          </h1>
          <p className="text-sm sm:text-base text-stone-600 mt-1">
            Acompanhe o plano corporativo, cobranças mensais e notas fiscais da organização.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Coluna Esquerda: Plano Atual + Histórico de Faturas */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card do Plano Atual */}
          <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-2xs space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#F4DDE5] text-[#294D33] flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#516B55]">
                    Assinatura Ativa
                  </span>
                  <h2
                    className="text-lg sm:text-xl font-normal text-[#1F3A27]"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    Plano Corporativo Bem-Estar
                  </h2>
                  <p className="text-sm text-stone-600 mt-0.5">
                    {totalEmitidas} licenças emitidas × {formatBRL(VALOR_POR_LICENCA)}/licença
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-stone-500 block">Fatura atual</span>
                <span className="text-2xl font-bold text-[#294D33] tabular-nums">
                  {formatBRL(valorMensalAtual)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-stone-100 text-sm">
              <div className="p-3.5 rounded-xl bg-[#FCF7F9] border border-stone-200/70 flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#294D33] shrink-0" aria-hidden="true" />
                <div>
                  <span className="text-xs text-stone-500 block">Próximo vencimento</span>
                  <span className="font-bold text-stone-900">05/12/2026</span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FCF7F9] border border-stone-200/70 flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-[#294D33] shrink-0" aria-hidden="true" />
                <div>
                  <span className="text-xs text-stone-500 block">Forma de pagamento</span>
                  <span className="font-bold text-stone-900">Boleto / Cartão •••• 4821</span>
                </div>
              </div>
            </div>
          </div>

          {/* Histórico de Faturas */}
          <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[#294D33]">
                <FileText className="w-5 h-5" aria-hidden="true" />
                <h3 className="text-base sm:text-lg font-bold">Histórico de Faturas & NF-e</h3>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#EBF3EE] text-[#1F3A27]">
                {faturasFicticias.length} faturas
              </span>
            </div>

            <div className="divide-y divide-stone-100">
              {faturasFicticias.map((fatura) => (
                <div
                  key={fatura.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm sm:text-base text-stone-900">
                        {fatura.competencia}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          fatura.status === "Paga"
                            ? "bg-[#EBF3EE] text-[#03543F]"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {fatura.status === "Paga" ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        {fatura.status}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                      Venc. {fatura.vencimento} · {fatura.licencas} licenças · {fatura.nfe}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <span className="font-bold text-sm sm:text-base text-[#294D33] tabular-nums">
                      {formatBRL(fatura.valor)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleBaixarDocumento(fatura)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#294D33] hover:bg-[#FCF7F9] transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" aria-hidden="true" />
                      {fatura.status === "Paga" ? "NF-e" : "Boleto"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Identidade Corporativa */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-stone-100 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-[#294D33]">
            <Building2 className="w-5 h-5" aria-hidden="true" />
            <h3 className="text-base font-bold">Identidade Corporativa</h3>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-2 py-2.5 border-b border-stone-100">
              <span className="text-stone-500">Empresa</span>
              <span className="font-bold text-stone-900 text-right">
                {company?.nome || "Não carregada"}
              </span>
            </div>
            <div className="flex justify-between gap-2 py-2.5 border-b border-stone-100">
              <span className="text-stone-500">CNPJ</span>
              <span className="font-mono font-semibold text-stone-800">
                {company?.cnpj || "—"}
              </span>
            </div>
            <div className="flex justify-between gap-2 py-2.5 border-b border-stone-100">
              <span className="text-stone-500">Status do Contrato</span>
              <span className="font-bold text-[#03543F]">
                {company?.status || "—"}
              </span>
            </div>
            <div className="flex justify-between gap-2 py-2.5">
              <span className="text-stone-500">Licenças em Uso</span>
              <span className="font-bold text-[#294D33]">
                {totalAtivadas} ativa(s) de {totalEmitidas} emitida(s)
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#EBF3EE] text-xs sm:text-sm text-[#1F3A27] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-[#294D33]" aria-hidden="true" />
            <span>Dados sincronizados com a API corporativa Florável.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
