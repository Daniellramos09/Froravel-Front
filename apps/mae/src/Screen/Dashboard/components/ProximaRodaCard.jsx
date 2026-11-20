// src/Screen/Dashboard/components/ProximaRodaCard.jsx
import { useState } from 'react';
import { Users, Video, MessageCircle, Check, Clock } from 'lucide-react';

export default function ProximaRodaCard({ onJoinRoom, onNavigateToGroups }) {
  const [lembreteAtivo, setLembreteAtivo] = useState(false);

  const handleWhatsAppReminder = () => {
    setLembreteAtivo(true);
    const text = encodeURIComponent(
      "Olá! Seu lembrete da Roda Florável: 'O Sono e a Sanidade Materna' acontece terça às 15h. Vaga confirmada! 🌸"
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        {/* HEADER COM ÍCONE E TÍTULO MAIOR */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF2E6] text-[#516B55] flex items-center justify-center shrink-0">
              <Users size={22} />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#516B55] block">
                Comunidade Segura
              </span>
              <h3 className="text-2xl font-fraunces font-bold text-[#2B2829] leading-tight">
                Roda de Conversa
              </h3>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EBF3ED] text-[#294D33]">
            <span className="w-2 h-2 rounded-full bg-[#294D33] animate-pulse" />
            Vaga Garantida
          </span>
        </div>

        {/* DETALHES DO ENCONTRO LIMPOS E DIRETOS */}
        <div className="bg-[#FCF7F9] rounded-2xl p-4.5 border border-stone-100 mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#9C5369] uppercase tracking-wider mb-2">
            <Clock size={15} /> Terça-feira • 15:00h
          </div>

          <h4 className="text-lg sm:text-xl font-fraunces font-bold text-[#2B2829] mb-2 leading-snug">
            O Sono do Bebê e a Sanidade Materna
          </h4>

          <p className="text-[14px] text-stone-600 font-medium leading-relaxed mb-3">
            Desabafe sobre as madrugadas em um grupo acolhedor com psicóloga perinatal.
          </p>

          <div className="flex items-center gap-2 pt-2 border-t border-stone-200/60 text-xs text-stone-600 font-medium">
            <div className="w-6 h-6 rounded-full bg-[#F4DDE5] text-[#294D33] flex items-center justify-center font-bold text-[11px]">
              AB
            </div>
            <span>Facilitadora: <strong>Psi. Ana Beatriz</strong></span>
          </div>
        </div>
      </div>

      {/* AÇÕES COM BOTÕES GRANDES E VISÍVEIS */}
      <div className="space-y-2.5 pt-1">
        <button
          type="button"
          onClick={() => {
            if (onJoinRoom) onJoinRoom();
            else if (onNavigateToGroups) onNavigateToGroups();
          }}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl bg-[#294D33] hover:bg-[#1e3b26] text-white font-bold text-base shadow-xs hover:shadow transition-all active:scale-[0.98] cursor-pointer"
        >
          <Video size={18} />
          <span>Entrar na Sala Virtual</span>
        </button>

        <button
          type="button"
          onClick={handleWhatsAppReminder}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-bold text-sm transition cursor-pointer"
        >
          {lembreteAtivo ? (
            <>
              <Check size={16} className="text-[#294D33]" />
              <span>Lembrete Salvo no WhatsApp</span>
            </>
          ) : (
            <>
              <MessageCircle size={16} className="text-[#25D366]" />
              <span>Receber Lembrete no WhatsApp</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
