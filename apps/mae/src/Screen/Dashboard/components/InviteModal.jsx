// src/Screen/Dashboard/components/InviteModal.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Copy,
  Check,
  HeartHandshake,
  MessageCircle,
  Gift,
  Sparkles,
  UserPlus,
  Send,
  Phone,
  ArrowRight,
} from 'lucide-react';

export default function InviteModal({
  isOpen,
  onClose,
  userName = "Mariana",
  flowersCount = 12,
  onInviteSuccess,
}) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [friendContact, setFriendContact] = useState("");
  const [customMessage, setCustomMessage] = useState(
    "Oi querida! Lembrei de você com carinho. O Florável tem sido meu respiro nessa montanha-russa da maternidade. Quero te convidar para conhecer nosso espaço de acolhimento 🌸"
  );
  const [step, setStep] = useState("form"); // 'form' | 'success'
  const [lastInvited, setLastInvited] = useState(null);

  // Lista de indicações salvas localmente
  const [invitedList, setInvitedList] = useState(() => {
    try {
      const saved = localStorage.getItem("floravel_invited_mothers");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 1, name: "Camila Ramos", contact: "(11) 98123-4567", date: "Semana passada", status: "Cadastro ativo (+3 flores)" },
      { id: 2, name: "Beatriz Nogueira", contact: "beatriz@email.com", date: "Há 3 dias", status: "Convite aceito (+3 flores)" },
    ];
  });

  const inviteLink = `https://floravel.app/apoie/${userName.toLowerCase()}-flores`;

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep("form");
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!friendName.trim()) {
      alert("Por favor, digite o nome da mãe ou amiga que deseja acolher.");
      return;
    }

    const newInvite = {
      id: Date.now(),
      name: friendName.trim(),
      contact: friendContact.trim() || "WhatsApp",
      date: "Hoje",
      status: "Convite enviado (+3 flores)",
    };

    const updated = [newInvite, ...invitedList];
    setInvitedList(updated);
    try {
      localStorage.setItem("floravel_invited_mothers", JSON.stringify(updated));
    } catch {}

    // Notifica ganho de 3 flores solidárias
    if (onInviteSuccess) {
      onInviteSuccess(3);
    }

    setLastInvited(newInvite);
    setStep("success");
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `${customMessage}\n\nAcesse pelo meu link de convite: ${inviteLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/45 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-white rounded-[32px] p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-100 font-dmsans relative animate-scaleUp text-[#2B2829] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* BOTÃO FECHAR */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-800 flex items-center justify-center transition cursor-pointer"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        {/* CABEÇALHO */}
        <div className="flex items-center gap-3.5 mb-5 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-[#F4DDE5] text-[#294D33] flex items-center justify-center text-xl shrink-0 shadow-xs">
            🌸
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#294D33] uppercase tracking-wider bg-[#EBF3ED] px-2.5 py-0.5 rounded-full mb-0.5">
              <Sparkles size={11} className="text-amber-500" />
              Mãe Apoia Mãe
            </div>
            <h3 id="modal-title" className="text-2xl font-fraunces font-bold text-[#2B2829] leading-tight">
              Indicar uma Mãe
            </h3>
          </div>
        </div>

        {/* BANNER DE RECOMPENSA SOLIDÁRIA */}
        <div className="bg-gradient-to-r from-[#EBF3ED] to-[#F4DDE5]/60 rounded-2xl p-4 border border-[#294D33]/15 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Gift size={20} className="text-[#294D33]" />
            <div>
              <p className="text-sm font-bold text-[#294D33]">Você ganha +3 Flores Solidárias</p>
              <p className="text-xs text-stone-600">A mãe indicada ganha acesso acolhedor imediato</p>
            </div>
          </div>
          <span className="text-xs font-bold bg-white text-[#294D33] px-3 py-1 rounded-full shadow-2xs border border-[#294D33]/10 tabular-nums">
            Saldo: {flowersCount} 🌸
          </span>
        </div>

        {step === "form" ? (
          /* FORMULÁRIO DE INDICAÇÃO DIRETA */
          <form onSubmit={handleSendInvite} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <UserPlus size={14} className="text-[#294D33]" />
                Nome da mãe ou amiga
              </label>
              <input
                type="text"
                required
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                placeholder="Ex: Juliana Martins, Camila..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-[#2B2829] focus:outline-none focus:border-[#294D33] focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Phone size={14} className="text-[#294D33]" />
                WhatsApp ou E-mail (Opcional)
              </label>
              <input
                type="text"
                value={friendContact}
                onChange={(e) => setFriendContact(e.target.value)}
                placeholder="(DDD) 99999-9999 ou email@exemplo.com"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-[#2B2829] focus:outline-none focus:border-[#294D33] focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Mensagem carinhosa de acolhimento
              </label>
              <textarea
                rows={3}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-[#2B2829] leading-relaxed focus:outline-none focus:border-[#294D33] focus:bg-white transition resize-none"
              />
            </div>

            {/* BOTÃO PRINCIPAL: CONFIRMAR INDICAÇÃO */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-[#294D33] hover:bg-[#1f3c27] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
            >
              <Send size={16} />
              <span>Concluir Indicação (+3 Flores Solidárias)</span>
            </button>

            {/* OU COMPARTILHE DIRETAMENTE VIA LINK / WHATSAPP */}
            <div className="pt-2">
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-stone-200"></div>
                <span className="flex-shrink mx-3 text-xs font-bold uppercase text-stone-400">ou envie diretamente</span>
                <div className="flex-grow border-t border-stone-200"></div>
              </div>

              <div className="flex gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-xs transition active:scale-[0.98] cursor-pointer"
                >
                  <MessageCircle size={16} />
                  <span>Enviar no WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl font-bold text-xs transition border cursor-pointer ${
                    copied
                      ? 'bg-[#294D33] text-white border-[#294D33]'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Link Copiado!' : 'Copiar Link'}</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* TELA DE SUCESSO E CELEBRAÇÃO */
          <div className="text-center py-4 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#EBF3ED] text-[#294D33] mx-auto flex items-center justify-center shadow-xs">
              <Check size={32} />
            </div>

            <h4 className="text-2xl font-fraunces font-bold text-[#294D33]">
              Indicação Realizada!
            </h4>

            <p className="text-sm text-stone-600 leading-relaxed max-w-sm mx-auto">
              Você acolheu <strong className="text-[#294D33]">{lastInvited?.name}</strong> e adicionou{' '}
              <strong className="text-[#294D33] font-bold">+3 Flores</strong> ao seu saldo de autocuidado.
            </p>

            <div className="p-3 bg-[#FCF7F9] rounded-2xl border border-[#E8A9BB]/40 flex items-center justify-between text-xs font-medium text-[#294D33]">
              <span>Novo saldo acumulado:</span>
              <span className="font-bold text-base">{flowersCount} 🌸</span>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-md transition cursor-pointer"
              >
                <MessageCircle size={18} />
                <span>Enviar convite pelo WhatsApp agora</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFriendName("");
                  setFriendContact("");
                  setStep("form");
                }}
                className="w-full py-2.5 px-4 rounded-xl text-stone-600 hover:text-[#294D33] hover:bg-stone-50 text-xs font-bold transition cursor-pointer"
              >
                Indicar outra mãe
              </button>
            </div>
          </div>
        )}

        {/* LISTAGEM DE INDICAÇÕES RECENTES */}
        {invitedList.length > 0 && (
          <div className="mt-6 pt-5 border-t border-stone-100">
            <h5 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-1.5">
              <HeartHandshake size={14} className="text-[#6E9473]" />
              Mães que você já acolheu ({invitedList.length})
            </h5>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {invitedList.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-[#2B2829] truncate">{inv.name}</p>
                    <p className="text-[11px] text-stone-500">{inv.contact} · {inv.date}</p>
                  </div>
                  <span className="shrink-0 text-[11px] font-bold text-[#294D33] bg-[#EBF3ED] px-2 py-0.5 rounded-full ml-2">
                    {inv.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
