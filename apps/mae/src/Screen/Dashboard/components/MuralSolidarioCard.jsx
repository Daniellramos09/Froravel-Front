// src/Screen/Dashboard/components/MuralSolidarioCard.jsx
// Recado de outra mãe (mural solidário): ler, retribuir com uma flor, deixar um recado.
import { useState } from 'react';
import { Check, RefreshCw } from 'lucide-react';

const MENSAGENS_EXEMPLO = [
  {
    id: 1,
    texto: 'Você não está sozinha. Respira fundo, esse momento difícil vai passar.',
    autora: 'Mãe de São Paulo',
    bebe: 'bebê de 2 meses',
    floresRecebidas: 14,
  },
  {
    id: 2,
    texto: 'Se a louça ficou na pia hoje, tudo bem. Seu descanso é prioridade.',
    autora: 'Mãe de Belo Horizonte',
    bebe: 'bebê de 5 meses',
    floresRecebidas: 28,
  },
  {
    id: 3,
    texto: 'Você é a melhor mãe do mundo para o seu filho. Abrace o seu tempo.',
    autora: 'Mãe de Salvador',
    bebe: 'bebê de 3 semanas',
    floresRecebidas: 19,
  },
];

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FCF7F9]';

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
    <div>
      <figure>
        <blockquote className="font-fraunces text-[22px] @5xl:text-[24px] leading-[1.3] tracking-[-0.01em] text-[#1F3A27] max-w-[40ch]">
          “{mensagemAtual.texto}”
        </blockquote>
        <figcaption className="mt-3 text-[14px] text-[#4A5E4D]">
          {mensagemAtual.autora}, {mensagemAtual.bebe}
          <span aria-hidden="true" className="mx-2 opacity-50">·</span>
          <span className="tabular-nums">{floresLocais} abraços</span>
        </figcaption>
      </figure>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          type="button"
          onClick={handleRetribuir}
          disabled={retribuiu}
          className={`inline-flex items-center gap-2 rounded-md border px-4 py-2.5 text-[15px] font-medium cursor-pointer disabled:cursor-default ${focusRing} ${
            retribuiu
              ? 'border-transparent bg-[#E3EDE5] text-[#294D33]'
              : 'border-[#294D33] text-[#294D33] hover:bg-[#294D33] hover:text-white'
          }`}
        >
          {retribuiu && <Check size={15} strokeWidth={2} aria-hidden="true" />}
          {retribuiu ? 'Abraço enviado' : 'Enviar um abraço (+1 flor)'}
        </button>
        <button
          type="button"
          onClick={handleProximaMensagem}
          className={`inline-flex items-center gap-1.5 text-[15px] font-medium text-[#294D33] rounded-sm cursor-pointer hover:underline underline-offset-4 ${focusRing}`}
        >
          <RefreshCw size={14} strokeWidth={1.75} aria-hidden="true" />
          Outro recado
        </button>
        <button
          type="button"
          onClick={() => setShowNovoRecado(!showNovoRecado)}
          aria-expanded={showNovoRecado}
          className={`text-[15px] font-medium text-[#294D33] rounded-sm cursor-pointer hover:underline underline-offset-4 ${focusRing}`}
        >
          {showNovoRecado ? 'Cancelar' : 'Deixar um recado'}
        </button>
      </div>

      {showNovoRecado && (
        <form onSubmit={handleEnviarRecado} className="mt-5 max-w-xl">
          {recadoEnviado ? (
            <p className="text-[15px] font-medium text-[#294D33] flex items-center gap-1.5" role="status">
              <Check size={16} aria-hidden="true" /> Seu recado vai abraçar uma mãe hoje.
            </p>
          ) : (
            <>
              <label htmlFor="novo-recado" className="block text-[14px] font-medium text-[#2B2829] mb-2">
                Uma frase curta de carinho para outra mãe
              </label>
              <textarea
                id="novo-recado"
                rows={2}
                required
                value={novoTexto}
                onChange={(e) => setNovoTexto(e.target.value)}
                className="w-full rounded-md border border-[#D9CFCB] bg-white p-3 text-[15px] text-[#2B2829] resize-none focus:outline-none focus:border-[#294D33] focus:ring-2 focus:ring-[#294D33]/20"
              />
              <button
                type="submit"
                disabled={!novoTexto.trim()}
                className={`mt-3 rounded-md bg-[#294D33] px-4 py-2.5 text-[14px] font-medium text-white hover:bg-[#1F3A27] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${focusRing}`}
              >
                Publicar no mural
              </button>
            </>
          )}
        </form>
      )}
    </div>
  );
}
