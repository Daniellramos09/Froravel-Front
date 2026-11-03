// src/Screen/Dashboard/components/InviteModal.jsx
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Copy, Check, HeartHandshake, MessageCircle, Gift, Sparkles } from 'lucide-react';

export default function InviteModal({ isOpen, onClose, userName = "Mariana", flowersCount = 12 }) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inviteLink = `https://floravel.app/apoie/${userName.toLowerCase()}-flores`;

  useEffect(() => {
    setMounted(true);
    // Bloqueia a rolagem do fundo enquanto o modal estiver aberto
    if (isOpen) {
      document.body.style.overflow = 'hidden';
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

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Olá querida! Lembrei de você com carinho. O Florável tem sido meu espaço de respiro nessa montanha-russa da maternidade. Quero te acolher por lá também: ${inviteLink} 🌸`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[32px] p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-100 font-dmsans relative animate-scaleUp text-[#2B2829]"
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

        {/* CABEÇALHO COMPACTO E IMPACTANTE */}
        <div className="flex items-center gap-3.5 mb-5 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-[#F4DDE5] text-[#294D33] flex items-center justify-center text-xl shrink-0 shadow-xs">
            🌸
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#294D33] uppercase tracking-wider bg-[#EBF3ED] px-2 py-0.5 rounded-full mb-0.5">
              <Sparkles size={11} className="text-amber-500" />
              Mãe Apoia Mãe
            </div>
            <h3 className="text-2xl font-fraunces font-bold text-[#2B2829] leading-tight">
              Indicar uma Mãe
            </h3>
          </div>
        </div>

        {/* RECOMPENSA EM DESTAQUE RÁPIDO */}
        <div className="bg-gradient-to-r from-[#EBF3ED] to-[#F4DDE5]/60 rounded-2xl p-4 border border-[#294D33]/15 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Gift size={20} className="text-[#294D33]" />
            <div>
              <p className="text-sm font-bold text-[#294D33]">Você ganha +3 Flores</p>
              <p className="text-xs text-stone-600">A mãe convidada ganha 7 dias grátis</p>
            </div>
          </div>
          <span className="text-xs font-bold bg-white text-[#294D33] px-2.5 py-1 rounded-full shadow-2xs">
            Saldo: {flowersCount} 🌸
          </span>
        </div>

        {/* CAMPO DE LINK COM CÓPIA RÁPIDA EM 1 TOQUE */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
            Seu Link Exclusivo de Convite
          </label>
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-2xl p-1.5 focus-within:border-[#294D33] transition">
            <input
              type="text"
              readOnly
              value={inviteLink}
              className="flex-1 bg-transparent px-3 text-xs text-stone-700 font-mono truncate focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopy}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
                copied
                  ? 'bg-[#294D33] text-white'
                  : 'bg-white hover:bg-stone-100 text-stone-800 border border-stone-200'
              }`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* BOTÃO PRINCIPAL DE WHATSAPP (AÇÃO PRINCIPAL) */}
        <button
          type="button"
          onClick={handleWhatsAppShare}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-base shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer mb-3"
        >
          <MessageCircle size={20} />
          <span>Enviar pelo WhatsApp</span>
        </button>

        <p className="text-xs text-stone-400 text-center">
          Ao atingir 15 flores, você resgata uma consulta psicológica gratuita.
        </p>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
