import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, BookOpen, Moon, Shield } from 'lucide-react';

const EMOTIONAL_TAGS = [
  "Cansaço físico", "Choro fácil", "Momento de paz", "Sensação de solidão", 
  "Apoio da rede", "Amamentação difícil", "Gratidão pelo bebê", "Culpa materna",
  "Ansiedade no fim do dia", "Corpo dolorido"
];

export default function QuickDiaryModal({ isOpen, onClose, onSaveEntry, onGoToFullQuiz }) {
  const [selectedMood, setSelectedMood] = useState('calm');
  const [sleepHours, setSleepHours] = useState('4-5h');
  const [selectedTags, setSelectedTags] = useState(["Cansaço físico"]);
  const [note, setNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);

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

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      if (onSaveEntry) {
        onSaveEntry({
          mood: selectedMood,
          sleepHours,
          tags: selectedTags,
          note,
          date: new Date()
        });
      }
      setIsSaved(false);
      onClose();
    }, 1400);
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
            <div className="w-10 h-10 rounded-2xl bg-[#EBF3ED] text-[#294D33] flex items-center justify-center">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="text-[20px] font-fraunces font-bold text-[#2B2829] leading-tight">
                Diário Emocional
              </h3>
              <p className="text-[12px] text-stone-500">Seu minuto diário de escuta e desabafo</p>
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

        {/* FEEDBACK DE SUCESSO */}
        {isSaved ? (
          <div className="py-12 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#EBF3ED] text-[#294D33] mx-auto flex items-center justify-center text-3xl">
              🌸
            </div>
            <h4 className="text-[22px] font-fraunces font-bold text-[#294D33]">
              Sentimentos acolhidos!
            </h4>
            <p className="text-[14px] text-stone-600 max-w-xs mx-auto">
              Você ganhou <strong>+1 Flor</strong> para a sua Rede de Acolhimento por cuidar da sua mente hoje.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 1. SELEÇÃO DE HUMOR */}
            <div>
              <label className="block text-[13px] font-bold text-stone-700 uppercase tracking-wider mb-2.5">
                1. Como você descreveria o seu estado de espírito hoje?
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  { id: 'calm', label: 'Serena', emoji: '🌸' },
                  { id: 'tired', label: 'Cansada', emoji: '☕' },
                  { id: 'anxious', label: 'Ansiosa', emoji: '🌧️' },
                  { id: 'crying', label: 'Sensível', emoji: '🌿' },
                  { id: 'grateful', label: 'Apoiada', emoji: '🤍' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedMood(item.id)}
                    className={`py-2.5 px-2 rounded-2xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                      selectedMood === item.id
                        ? 'border-[#294D33] bg-[#EBF3ED] text-[#294D33] font-bold shadow-xs'
                        : 'border-stone-200 bg-stone-50/50 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span className="text-[11px]">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. COMO FOI O SEU SONO */}
            <div>
              <label className="block text-[13px] font-bold text-stone-700 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <Moon size={14} className="text-[#294D33]" />
                2. Como foi o seu descanso nas últimas 24h?
              </label>
              <div className="flex flex-wrap gap-2">
                {['Menos de 3h', '3h a 5h picadas', '5h a 7h regulares', 'Descansei bem'].map((sono) => (
                  <button
                    key={sono}
                    type="button"
                    onClick={() => setSleepHours(sono)}
                    className={`px-3 py-1.5 rounded-xl text-[12px] font-medium border transition cursor-pointer ${
                      sleepHours === sono
                        ? 'bg-[#294D33] text-white border-[#294D33]'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {sono}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. TAGS EMOCIONAIS */}
            <div>
              <label className="block text-[13px] font-bold text-stone-700 uppercase tracking-wider mb-2.5">
                3. O que esteve mais presente no seu dia? (Selecione tags)
              </label>
              <div className="flex flex-wrap gap-2">
                {EMOTIONAL_TAGS.map((tag) => {
                  const isChecked = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition cursor-pointer ${
                        isChecked
                          ? 'bg-[#F4DDE5] border-[#E8A9BB] text-[#294D33] font-semibold'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-white'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}{tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. NOTA LIVRE / DESABAFO */}
            <div>
              <label className="block text-[13px] font-bold text-stone-700 uppercase tracking-wider mb-2">
                4. Quer deixar algumas palavras para si mesma?
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Escreva livremente... o que doeu, o que foi bom ou apenas um suspiro."
                className="w-full rounded-2xl p-3.5 border border-stone-200 text-[14px] text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#294D33]/30 resize-none bg-stone-50/50"
              />
            </div>

            {/* PRIVACIDADE E AÇÕES */}
            <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                <Shield size={14} className="text-[#294D33]" />
                <span>Criptografado e visível apenas para você</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-full border border-stone-200 text-stone-600 text-[13px] font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-[#294D33] text-white text-[13px] font-bold hover:bg-[#1e3b26] transition shadow-sm cursor-pointer"
                >
                  Salvar Registro
                </button>
              </div>
            </div>

            {/* OPÇÃO DE FAZER O QUIZ COMPLETO */}
            <div className="bg-[#FCF7F9] p-3 rounded-2xl border border-stone-100 flex items-center justify-between">
              <div className="text-[12px] text-stone-600">
                Quer uma avaliação clínica guiada?
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onGoToFullQuiz) onGoToFullQuiz();
                }}
                className="text-[12px] font-bold text-[#294D33] hover:underline cursor-pointer"
              >
                Fazer Quiz EPDS →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
