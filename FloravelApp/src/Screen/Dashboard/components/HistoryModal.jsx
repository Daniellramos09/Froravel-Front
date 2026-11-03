import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

const RECENT_RECORDS = [
  { date: 'Hoje (01/11)', mood: '🌸 Serena', epds: 'Triagem estável', notes: 'Conseguiu dormir melhor à tarde. Bebê mamou tranquilo.', status: 'low' },
  { date: 'Ontem (31/10)', mood: '🌿 Apoiada', epds: '-', notes: 'Roda de conversa com outras mães trouxe muito alívio.', status: 'low' },
  { date: '30/10', mood: '☕ Cansada', epds: '-', notes: 'Noite com cólica e despertares de hora em hora.', status: 'medium' },
  { date: '29/10', mood: '🤍 Acolhida', epds: '-', notes: 'Parceiro assumiu o banho do bebê, tempo para um banho quente.', status: 'low' },
  { date: '18/10', mood: '🌧️ Sensível', epds: 'EPDS: 6/30 (Baixo risco)', notes: 'Triagem quinzenal realizada. Sensação de baby blues passageiro.', status: 'low' },
];

export default function HistoryModal({ isOpen, onClose, onStartQuiz }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[32px] p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-stone-100 font-dmsans max-h-[90vh] overflow-y-auto animate-scaleUp text-[#2B2829]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER DO MODAL */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EBF3ED] text-[#294D33] flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="text-[20px] font-fraunces font-bold text-[#2B2829] leading-tight">
                Histórico de Humor & EPDS
              </h3>
              <p className="text-[12px] text-stone-500">Escala de Depressão Pós-Parto de Edimburgo</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-800 flex items-center justify-center transition cursor-pointer"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6">
          {/* ESTATÍSTICAS RESUMIDAS */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#FCF7F9] p-3.5 rounded-2xl border border-stone-100 text-center">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Frequência</span>
              <p className="text-[18px] font-fraunces font-bold text-[#294D33]">24 dias</p>
              <span className="text-[10px] text-stone-500">Registrados este mês</span>
            </div>

            <div className="bg-[#EBF3ED] p-3.5 rounded-2xl border border-stone-100 text-center">
              <span className="text-[11px] font-bold text-[#294D33] uppercase tracking-wider block">Último EPDS</span>
              <p className="text-[18px] font-fraunces font-bold text-[#294D33]">6 / 30 pts</p>
              <span className="text-[10px] text-[#294D33] font-medium">Baixo Risco</span>
            </div>

            <div className="bg-[#F4DDE5]/40 p-3.5 rounded-2xl border border-stone-100 text-center">
              <span className="text-[11px] font-bold text-[#9C5369] uppercase tracking-wider block">Tendência</span>
              <p className="text-[18px] font-fraunces font-bold text-[#9C5369]">Estável</p>
              <span className="text-[10px] text-stone-500">Oscilações esperadas</span>
            </div>
          </div>

          {/* LISTA DE REGISTROS RECENTES */}
          <div>
            <h4 className="text-[13px] font-bold text-stone-700 uppercase tracking-wider mb-3">
              Registros e Notas Emocionais
            </h4>
            <div className="space-y-3">
              {RECENT_RECORDS.map((rec, index) => (
                <div key={index} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 text-[13px]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-stone-800">{rec.date}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white border border-stone-200 text-stone-700">
                      {rec.mood}
                    </span>
                  </div>
                  <p className="text-stone-600 text-[12px] leading-relaxed mb-1">{rec.notes}</p>
                  {rec.epds !== '-' && (
                    <div className="text-[11px] font-bold text-[#294D33] flex items-center gap-1 mt-1">
                      <ShieldCheck size={13} /> {rec.epds}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AÇÃO: FAZER NOVA TRIAGEM */}
          <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[12px] text-stone-500 text-center sm:text-left">
              Triagens periódicas ajudam a prevenir e acolher o puerpério.
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (onStartQuiz) onStartQuiz();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#294D33] hover:bg-[#1f3b26] text-white font-bold text-[13px] flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
            >
              <span>Fazer Nova Autoavaliação EPDS</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
