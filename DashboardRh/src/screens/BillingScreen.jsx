// src/Screen/DashboardRh/screens/BillingScreen.jsx
import { useState } from "react";
import {
 
  Download,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  RefreshCw,
 
  
  X,
} from "lucide-react";

// Mock das faturas da empresa TechCorp
const INITIAL_INVOICES = [
  {
    id: "inv-2026-10",
    refMonth: "Outubro / 2026",
    dueDate: "15/10/2026",
    amount: "R$ 4.750,00",
    status: "failed", // failed | paid | open
    errorMessage: "Tentativa de cobrança falhou. Atualize seu cartão.",
    nfNumber: "NF-e #89211",
  },
  {
    id: "inv-2026-09",
    refMonth: "Setembro / 2026",
    dueDate: "15/09/2026",
    amount: "R$ 4.750,00",
    status: "paid",
    nfNumber: "NF-e #85430",
  },
  {
    id: "inv-2026-08",
    refMonth: "Agosto / 2026",
    dueDate: "15/08/2026",
    amount: "R$ 4.750,00",
    status: "paid",
    nfNumber: "NF-e #81290",
  },
  {
    id: "inv-2026-07",
    refMonth: "Julho / 2026",
    dueDate: "15/07/2026",
    amount: "R$ 4.750,00",
    status: "paid",
    nfNumber: "NF-e #78104",
  },
  {
    id: "inv-2026-06",
    refMonth: "Junho / 2026",
    dueDate: "15/06/2026",
    amount: "R$ 4.750,00",
    status: "paid",
    nfNumber: "NF-e #74992",
  },
];

export default function BillingScreen({ onTriggerToast }) {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isUpdateCardModalOpen, setIsUpdateCardModalOpen] = useState(false);
  const [cardLastDigits, setCardLastDigits] = useState("4092");
  const [localToast, setLocalToast] = useState(null);

  const [cardForm, setCardForm] = useState({
    holder: "TECHCORP BRASIL SERVICOS",
    number: "",
    expiry: "",
    cvv: "",
  });

  const triggerNotification = (message) => {
    if (onTriggerToast) {
      onTriggerToast(message);
    } else {
      setLocalToast(message);
      setTimeout(() => setLocalToast(null), 3500);
    }
  };

  // Re-tentativa de cobrança da fatura com falha
  const handleRetryPayment = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === "inv-2026-10"
            ? { ...inv, status: "paid", errorMessage: null }
            : inv
        )
      );
      triggerNotification("Cobrança confirmada! Fatura quitada com sucesso.");
    }, 1500);
  };

  const handleDownloadNf = (invoice) => {
    triggerNotification(`Download da ${invoice.nfNumber} (${invoice.refMonth})`);
  };

  const handleSaveCard = (e) => {
    e.preventDefault();
    const cleanNumber = cardForm.number.replace(/\D/g, "");
    const last4 = cleanNumber.slice(-4) || "8814";
    setCardLastDigits(last4);
    setIsUpdateCardModalOpen(false);
    triggerNotification(`Cartão final •••• ${last4} atualizado com sucesso!`);
  };

  return (
    <div className="space-y-6 pb-12 font-sans antialiased text-stone-800 animate-fadeIn">
      {/* Toast Local */}
      {localToast && (
        <div 
          role="status" 
          aria-live="polite"
          className="fixed top-6 right-6 z-50 flex items-center gap-2.5 bg-[#294D33] text-white px-5 py-3 rounded-2xl shadow-xl text-xs sm:text-sm border border-white/10 animate-fade-in"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
          <span>{localToast}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. HEADER ENXUTO (MINIMALISMO SAAS)                       */}
      {/* ========================================================= */}
      <div className="flex items-center justify-between">
        <h1 
          className="text-2xl sm:text-3xl font-bold text-[#294D33] tracking-tight"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Faturamento
        </h1>
      </div>

      {/* ========================================================= */}
      {/* 2. LAYOUT ASSIMÉTRICO (ESQUERDA: HISTÓRICO | DIREITA: CARTÃO)*/}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUNA MAIOR (ESQUERDA - HISTÓRICO DE FATURAS) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-100 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
            <h3 
              className="text-sm sm:text-base font-bold text-[#294D33]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Histórico de Faturas
            </h3>
            <span className="text-[11px] font-semibold text-[#516B55]">
              {invoices.length} faturas
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <caption className="sr-only">Histórico de cobranças e notas fiscais</caption>
              <thead>
                <tr className="border-b border-stone-100 text-[#516B55] text-[11px] font-bold uppercase tracking-wider">
                  <th scope="col" className="py-3 px-4 sm:px-5">
                    Mês
                  </th>
                  <th scope="col" className="py-3 px-3">
                    Vencimento
                  </th>
                  <th scope="col" className="py-3 px-3">
                    Valor
                  </th>
                  <th scope="col" className="py-3 px-3">
                    Status
                  </th>
                  <th scope="col" className="py-3 px-4 text-right">
                    NF
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {invoices.map((inv) => {
                  const isFailed = inv.status === "failed";
                  const isPaid = inv.status === "paid";

                  return (
                    <tr 
                      key={inv.id}
                      className={`transition-colors ${
                        isFailed ? "bg-[#FDE8E8]/20" : "hover:bg-[#FCF7F9]/50"
                      }`}
                    >
                      {/* Mês & NF */}
                      <td className="py-3.5 px-4 sm:px-5">
                        <p className="font-semibold text-stone-900 leading-tight">
                          {inv.refMonth}
                        </p>
                        <span className="text-stone-400 font-mono text-[11px]">
                          {inv.nfNumber}
                        </span>
                      </td>

                      {/* Vencimento */}
                      <td className="py-3.5 px-3 text-stone-500 font-mono text-xs">
                        {inv.dueDate}
                      </td>

                      {/* Valor */}
                      <td className="py-3.5 px-3 font-bold text-stone-900 text-xs sm:text-sm">
                        {inv.amount}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        {isPaid && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DEF7EC] text-[#03543F]">
                            <CheckCircle2 size={11} aria-hidden="true" />
                            Pago
                          </span>
                        )}

                        {isFailed && (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FDE8E8] text-[#9B1C1C]">
                              <AlertTriangle size={11} aria-hidden="true" />
                              Atrasado
                            </span>
                            <p className="text-[10px] text-[#9B1C1C] font-medium leading-tight max-w-[190px]">
                              {inv.errorMessage}
                            </p>
                          </div>
                        )}
                      </td>

                      {/* Ação */}
                      <td className="py-3.5 px-4 text-right">
                        {isFailed ? (
                          <button
                            type="button"
                            onClick={handleRetryPayment}
                            disabled={isRetrying}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#9B1C1C] hover:bg-red-800 text-white text-[11px] font-bold transition cursor-pointer disabled:opacity-60"
                          >
                            {isRetrying ? (
                              <RefreshCw size={11} className="animate-spin" />
                            ) : (
                              <span>Tentar Novamente</span>
                            )}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDownloadNf(inv)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-[#294D33] hover:bg-stone-50 transition"
                            title={`Baixar ${inv.nfNumber}`}
                            aria-label={`Baixar nota fiscal ${inv.nfNumber}`}
                          >
                            <Download size={15} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* COLUNA MENOR (DIREITA - RESUMO DO PLANO & CARTÃO COMPACTO) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Card Resumo do Plano Atual */}
          <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-[#03543F] bg-[#DEF7EC] px-2 py-0.5 rounded-full">
                Plano Ativo
              </span>
              <span className="text-[11px] text-stone-400 font-mono">50 Licenças</span>
            </div>

            <h3 
              className="text-base font-bold text-[#294D33] leading-snug"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Plano Mid-Market
            </h3>

            <div className="mt-3 pt-3 border-t border-stone-100 flex items-baseline justify-between">
              <div>
                <span className="text-xl font-bold text-stone-900 block" style={{ fontFamily: "'Fraunces', serif" }}>
                  R$ 4.750,00
                </span>
                <span className="text-[10px] text-stone-400">Renovação em 15/11/2026</span>
              </div>

              <button
                type="button"
                onClick={() => triggerNotification("Solicitação de expansão enviada.")}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#294D33] hover:underline"
              >
                <span>Upgrade</span>
                <ArrowUpRight size={13} />
              </button>
            </div>
          </div>

          {/* Card Cartão de Crédito Compacto (Proporção Reduzida) */}
          <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#516B55]">
                Forma de Pagamento
              </span>
              <button
                type="button"
                onClick={() => setIsUpdateCardModalOpen(true)}
                className="text-[11px] font-bold text-[#294D33] hover:underline"
              >
                Trocar Cartão
              </button>
            </div>

            {/* Mockup Compacto do Cartão Corporativo */}
            <div className="rounded-xl p-4 bg-gradient-to-tr from-[#1F3224] via-[#294D33] to-[#516B55] text-white shadow-xs font-mono">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-sans tracking-wider opacity-75 font-semibold">
                  Corporate
                </span>
                <div className="flex items-center -space-x-1.5" aria-hidden="true">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500/90" />
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-400/90" />
                </div>
              </div>

              <div className="text-sm tracking-widest my-2 font-semibold">
                •••• &nbsp; •••• &nbsp; •••• &nbsp; {cardLastDigits}
              </div>

              <div className="flex items-center justify-between text-[10px] opacity-80 pt-1 font-sans">
                <span className="truncate max-w-[140px] uppercase">TechCorp Brasil</span>
                <span>11/29</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Modal de Atualização de Cartão */}
      {isUpdateCardModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsUpdateCardModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl border border-stone-100 relative text-stone-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsUpdateCardModalOpen(false)}
              className="absolute top-5 right-5 p-1 text-stone-400 hover:text-stone-700"
              aria-label="Fechar"
            >
              <X size={16} />
            </button>

            <h3 
              className="text-lg font-bold text-[#294D33] mb-1"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Atualizar Cartão
            </h3>
            <p className="text-xs text-[#516B55] mb-4">
              Informe os novos dados do cartão corporativo.
            </p>

            <form onSubmit={handleSaveCard} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Número
                </label>
                <input
                  type="text"
                  required
                  placeholder="•••• •••• •••• 4092"
                  value={cardForm.number}
                  onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Validade
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="11/29"
                    value={cardForm.expiry}
                    onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    placeholder="•••"
                    value={cardForm.cvv}
                    onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUpdateCardModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-stone-200 text-xs font-bold text-stone-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#294D33] text-white text-xs font-bold shadow-xs hover:bg-[#1e3c27]"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
