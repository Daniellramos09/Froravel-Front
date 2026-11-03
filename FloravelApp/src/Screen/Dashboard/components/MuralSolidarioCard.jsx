// src/Screen/Dashboard/components/MuralSolidarioCard.jsx
import { useState } from 'react';
import { Send, Check } from 'lucide-react';

const MENSAGENS_EXEMPLO = [
  {
    id: 1,
    texto: "“Você não está sozinha. Respira fundo, esse momento difícil vai passar!”",
    autora: "Mãe de São Paulo",
    bebe: "Bebê de 2 meses",
    floresRecebidas: 14
  },
  {
    id: 2,
    texto: "“Se a louça ficou na pia hoje, tudo bem. Seu descanso é prioridade.”",
    autora: "Mãe de Belo Horizonte",
    bebe: "Bebê de 5 meses",
    floresRecebidas: 28
  },
  {
    id: 3,
    texto: "“Você é a melhor mãe do mundo para o seu filho. Abrace o seu tempo.”",
    autora: "Mãe de Salvador",
    bebe: "Bebê de 3 semanas",
    floresRecebidas: 19
  }
];

export default function MuralSolidarioCard({ onSendFlower }) {
  const [mensagemIndex, setMensagemIndex] = useState(0);
  const [retribuiu, setRetribuiu] = useState(false);
  const [floresLocais, setFloresLocais] = useState(MENSAGENS_EXEMPLO[0].floresRecebidas);
  const [showNovoRecado, setShowNovoRecado] = useState(false);
  const [novoTexto, setNovoTexto] = useState('');
  const [recadoEnviado, setRecadoEnviado] = useState(false);

  const mensagemAtual = MENSAGENS_EXEMPLO[mensagemIndex];

  const handleRetribuir = () => {
    if (retribuiu) return;
    setRetribuiu(true);
    setFloresLocais((prev) => prev + 1);
    if (onSendFlower) onSendFlower();
  };

  const handleProximaMensagem = () => {
    const nextIdx = (mensagemIndex + 1) % MENSAGENS_EXEMPLO.length;
    setMensagemIndex(nextIdx);
    setFloresLocais(MENSAGENS_EXEMPLO[nextIdx].floresRecebidas);
    setRetribuiu(false);
  };

  const handleEnviarRecado = (e) => {
    e.preventDefault();
    if (!novoTexto.trim()) return;
    setRecadoEnviado(true);
    setTimeout(() => {
      setRecadoEnviado(false);
      setShowNovoRecado(false);
      setNovoTexto('');
    }, 2000);
  };

  return (
    <div className="bg-gradient-to-br from-[#FFF9FA] via-[#FCF7F9] to-[#FDF2F4] rounded-3xl p-6 sm:p-8 border border-[#E8A9BB]/30 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full">
      
      {/* Marca d'água botânica sutil */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#F4DDE5]/40 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#F4DDE5] text-[#9C5369] flex items-center justify-center text-xl">
              💌
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#9C5369] block">
                Mural Solidário
              </span>
              <h3 className="text-2xl font-fraunces font-bold text-[#2B2829] leading-tight">
                Recado de Outra Mãe
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleProximaMensagem}
            className="text-xs font-bold text-stone-600 hover:text-[#294D33] bg-white px-3 py-1.5 rounded-full border border-stone-200/80 shadow-2xs transition cursor-pointer"
            title="Ver outra mensagem"
          >
            Outro recado ↺
          </button>
        </div>

        {/* CORPO DO RECADO COM LETRAS MAIORES */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 border border-white shadow-xs mb-5">
          <p className="text-base sm:text-lg font-fraunces text-stone-800 italic leading-relaxed mb-3">
            {mensagemAtual.texto}
          </p>

          <div className="flex items-center justify-between text-xs text-stone-600 pt-2 border-t border-stone-100 font-medium">
            <span>
              — <strong>{mensagemAtual.autora}</strong> ({mensagemAtual.bebe})
            </span>
            <span className="text-[#9C5369] font-bold flex items-center gap-1">
              🌸 {floresLocais} abraços
            </span>
          </div>
        </div>
      </div>

      {/* AÇÕES COM BOTÕES CLAROS */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 pt-1">
        <button
          type="button"
          onClick={handleRetribuir}
          className={`w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
            retribuiu
              ? 'bg-[#EBF3ED] text-[#294D33] border border-[#294D33]/20 shadow-xs'
              : 'bg-white hover:bg-[#F4DDE5] text-[#9C5369] border border-[#E8A9BB]/50 shadow-xs hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {retribuiu ? (
            <>
              <Check size={16} className="text-[#294D33]" />
              <span>Abraço e Flor Enviados! 🌸</span>
            </>
          ) : (
            <>
              <span>Retribuir com 1 Flor Solidária 🌸</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setShowNovoRecado(!showNovoRecado)}
          className="text-xs font-bold text-stone-600 hover:text-stone-900 underline transition cursor-pointer px-2 py-1"
        >
          {showNovoRecado ? 'Cancelar' : 'Deixar um recado'}
        </button>
      </div>

      {/* MINI-FORMULÁRIO */}
      {showNovoRecado && (
        <form onSubmit={handleEnviarRecado} className="mt-3 pt-3 border-t border-[#E8A9BB]/30 animate-fadeIn relative z-10">
          {recadoEnviado ? (
            <p className="text-sm font-bold text-[#294D33] text-center py-2 flex items-center justify-center gap-1">
              <Check size={16} /> Seu recado abraçará uma mãe hoje!
            </p>
          ) : (
            <div className="space-y-2">
              <textarea
                rows={2}
                required
                value={novoTexto}
                onChange={(e) => setNovoTexto(e.target.value)}
                placeholder="Escreva uma frase curta de carinho para outra mãe..."
                className="w-full p-3 rounded-xl border border-stone-200 text-sm text-stone-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#9C5369] resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!novoTexto.trim()}
                  className="px-5 py-2 rounded-xl bg-[#294D33] text-white text-xs font-bold hover:bg-[#1e3b26] transition flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
                >
                  <Send size={13} />
                  <span>Publicar no Mural</span>
                </button>
              </div>
            </div>
          )}
        </form>
      )}

    </div>
  );
}
