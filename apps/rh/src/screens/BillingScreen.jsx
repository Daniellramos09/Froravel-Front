import { Building2, CreditCard, ShieldCheck, Info } from "lucide-react";

export default function BillingScreen({ company = null, relatorio = null }) {
  const totalEmitidas = relatorio?.totalLicencasEmitidas ?? 0;
  const totalAtivadas = relatorio?.totalLicencasAtivadas ?? 0;

  return (
    <div className="space-y-6 pb-12 font-sans antialiased text-stone-800 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl sm:text-3xl font-bold text-[#294D33] tracking-tight"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Faturamento
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-stone-100 shadow-2xs space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F4DDE5] text-[#294D33] flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2
                className="text-base font-bold text-[#294D33]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Integração de Faturamento Indisponível
              </h2>
              <p className="text-xs text-[#516B55] mt-1 leading-relaxed">
                O histórico de faturas, emissão de notas fiscais (NF-e) e gerenciamento de cartão corporativo não estão conectados a um gateway de pagamentos neste ambiente.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FCF7F9] border border-stone-200/80 flex items-start gap-3 text-xs text-[#516B55]">
            <Info size={18} className="text-[#294D33] shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              Para ajustes de plano corporativo ou faturamento B2B, consulte o time financeiro da Florável com o CNPJ da sua organização.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-stone-100 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-[#294D33]">
            <Building2 className="w-4 h-4" aria-hidden="true" />
            <h3 className="text-sm font-bold">Identidade Corporativa</h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between gap-2 py-2 border-b border-stone-100">
              <span className="text-stone-500">Empresa</span>
              <span className="font-bold text-stone-900 text-right">
                {company?.nome || "Não carregada"}
              </span>
            </div>
            <div className="flex justify-between gap-2 py-2 border-b border-stone-100">
              <span className="text-stone-500">CNPJ</span>
              <span className="font-mono font-semibold text-stone-800">
                {company?.cnpj || "—"}
              </span>
            </div>
            <div className="flex justify-between gap-2 py-2 border-b border-stone-100">
              <span className="text-stone-500">Status do Contrato</span>
              <span className="font-bold text-[#03543F]">
                {company?.status || "—"}
              </span>
            </div>
            <div className="flex justify-between gap-2 py-2">
              <span className="text-stone-500">Licenças em Uso</span>
              <span className="font-bold text-[#294D33]">
                {totalAtivadas} ativa(s) de {totalEmitidas} emitida(s)
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#EBF3EE] text-[11px] text-[#1F3A27] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-[#294D33]" aria-hidden="true" />
            <span>Dados sincronizados com a API corporativa Florável.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
