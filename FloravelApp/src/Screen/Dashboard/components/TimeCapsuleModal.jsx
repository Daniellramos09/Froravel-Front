import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Lock, Calendar } from 'lucide-react';

export default function TimeCapsuleModal({ isOpen, onClose, onSaveCapsule }) {
  const [recipient, setRecipient] = useState('baby');
  const [openDate, setOpenDate] = useState('1ano');
  const [letterTitle, setLetterTitle] = useState('');
  const [letterContent, setLetterContent] = useState('');
  const [isSealed, setIsSealed] = useState(false);

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

  const handleSealLetter = (e) => {
    e.preventDefault();
    if (!letterContent.trim()) return;

    setIsSealed(true);
    setTimeout(() => {
      if (onSaveCapsule) {
        onSaveCapsule({
          recipient,
          openDate,
          title: letterTitle || 'Sem título',
          content: letterContent,
          createdAt: new Date()
        });
      }
      setIsSealed(false);
      onClose();
    }, 1800);
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[32px] p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-100 font-dmsans max-h-[90vh] overflow-y-auto animate-scaleUp text-[#2B2829]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER DO MODAL */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F4DDE5] text-[#9C5369] flex items-center justify-center">
              <Mail size={20} className="text-[#E8A9BB]" />
            </div>
            <div>
              <h3 className="text-[20px] font-fraunces font-bold text-[#2B2829] leading-tight">
                Cápsula do Tempo
              </h3>
              <p className="text-[12px] text-stone-500">Uma mensagem selada para o amanhã</p>
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

        {/* FEEDBACK DE LACRE */}
        {isSealed ? (
          <div className="py-12 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#F4DDE5] text-[#294D33] mx-auto flex items-center justify-center">
              <Lock size={28} className="text-[#9C5369]" />
            </div>
            <h4 className="text-[22px] font-fraunces font-bold text-[#294D33]">
              Carta guardada e lacrada! 💌
            </h4>
            <p className="text-[14px] text-stone-600 max-w-xs mx-auto">
              Sua memória foi criptografada. Ela permanecerá em silêncio e será entregue no momento exato escolhido.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSealLetter} className="space-y-5">
            {/* DESTINATÁRIO */}
            <div>
              <label className="block text-[12px] font-bold text-stone-700 uppercase tracking-wider mb-2">
                Para quem é esta memória?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'baby', label: 'Para o meu bebê', icon: '👶' },
                  { id: 'myself', label: 'Para mim no futuro', icon: '🌸' },
                  { id: 'family', label: 'Para a família', icon: '🏡' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRecipient(item.id)}
                    className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                      recipient === item.id
                        ? 'border-[#E8A9BB] bg-[#FDF2F4] text-[#9C5369] font-bold shadow-2xs'
                        : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-white'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-[11px]">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* QUANDO ABRIR */}
            <div>
              <label className="block text-[12px] font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar size={14} className="text-[#9C5369]" />
                Quando esta cápsula deve ser aberta?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: '1ano', label: '1º Aninho do Bebê', date: '12 de Maio de 2027' },
                  { id: 'volta', label: 'Retorno ao Trabalho', date: 'Em 4 meses' },
                  { id: '3anos', label: 'Primeiros passos (3 anos)', date: 'Ano 2029' },
                  { id: '18anos', label: 'Maioridade (18 anos)', date: 'Ano 2044' }
                ].map((dateOption) => (
                  <button
                    key={dateOption.id}
                    type="button"
                    onClick={() => setOpenDate(dateOption.id)}
                    className={`p-2.5 rounded-2xl border text-left transition cursor-pointer ${
                      openDate === dateOption.id
                        ? 'border-[#294D33] bg-[#EBF3ED] text-[#294D33] font-bold'
                        : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-white'
                    }`}
                  >
                    <p className="text-[12px] font-bold leading-tight">{dateOption.label}</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">{dateOption.date}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* TÍTULO DA CARTA */}
            <div>
              <label className="block text-[12px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Título ou frase-chave
              </label>
              <input
                type="text"
                value={letterTitle}
                onChange={(e) => setLetterTitle(e.target.value)}
                placeholder="Ex: O dia em que você sorriu pela primeira vez..."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-[14px] text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#E8A9BB]/40 bg-stone-50"
              />
            </div>

            {/* CORPO DA CARTA */}
            <div>
              <label className="block text-[12px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Sua carta do coração
              </label>
              <textarea
                rows={5}
                required
                value={letterContent}
                onChange={(e) => setLetterContent(e.target.value)}
                placeholder="Querido filho(a), hoje escrevo com as olheiras fundas e o peito cheio de amor..."
                className="w-full p-3.5 rounded-2xl border border-stone-200 text-[14px] text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#E8A9BB]/40 resize-none bg-stone-50"
              />
            </div>

            {/* BOTÕES */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-stone-200 text-stone-600 text-[13px] font-semibold hover:bg-stone-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!letterContent.trim()}
                className="px-6 py-2.5 rounded-full bg-[#294D33] text-white text-[13px] font-bold hover:bg-[#1e3b26] transition flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <Lock size={15} />
                <span>Lacrar Cápsula</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
