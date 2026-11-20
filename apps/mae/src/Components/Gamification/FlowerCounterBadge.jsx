// src/Components/Gamification/FlowerCounterBadge.jsx
import React, { useState, useRef, useEffect } from 'react';

/**
 * FlowerCounterBadge - Indicador de Flores Solidárias com Popover no Hover/Clique
 *
 * Mostra o ícone da rosa vermelha e o número de flores acumuladas.
 * No hover ou clique, abre um popover elegante, acolhedor e simples com:
 * - Quantas florzinhas acumuladas (ex: 12 flores)
 * - Barra de progresso visual demonstrando a proximidade da meta
 * - Meta clara e amigável (15 flores = 1 sessão de apoio gratuito)
 * - Botão 100% funcional "Indicar mãe" que abre o modal de indicação
 */
export default function FlowerCounterBadge({
  flowersCount = 12,
  targetFlowers = 15,
  onOpenInvite,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const leaveTimeoutRef = useRef(null);

  const remaining = Math.max(0, targetFlowers - flowersCount);
  const progressPercent = Math.min(
    100,
    Math.round((flowersCount / targetFlowers) * 100)
  );

  // Fecha o popover ao clicar fora
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Limpa o timer de saída ao desmontar
  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    // Grace period de 200ms para evitar fechamento ao cruzar a borda
    leaveTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    setIsOpen((prev) => !prev);
  };

  const handleTriggerInvite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    if (onOpenInvite) {
      onOpenInvite();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Botão/Pílula de Flores */}
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-label={`${flowersCount} flores acumuladas. Clique ou passe o mouse para ver detalhes.`}
        className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FCF7F9] hover:bg-[#F4DDE5]/70 border border-[#E8A9BB]/40 hover:border-[#E8A9BB] transition-all duration-200 cursor-pointer shadow-2xs active:scale-95"
      >
        <img
          src="/icons/rosa.png"
          alt="Flor solidária"
          className="w-5 h-5 object-contain shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
        />
        <span className="font-fraunces font-bold text-[14px] text-[#294D33] tabular-nums">
          {flowersCount}
        </span>
      </button>

      {/* Popover no Hover / Clique */}
      {isOpen && (
        <div
          role="tooltip"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl p-4 shadow-xl border border-stone-100 z-50 animate-fadeIn font-dmsans text-[#2B2829] before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3"
        >
          {/* Cabeçalho do Popover */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#FCE7F0] flex items-center justify-center shrink-0 border border-[#F4DDE5]">
              <img
                src="/icons/rosa.png"
                alt="Flor solidária"
                className="w-6 h-6 object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-fraunces font-bold text-[#294D33] text-[18px] leading-tight">
                  {flowersCount} Flores
                </span>
                <span className="text-[10px] font-bold text-[#516B55] uppercase tracking-wider bg-[#EBF3ED] px-2 py-0.5 rounded-full">
                  Solidárias
                </span>
              </div>
              <p className="text-[12px] text-stone-500 font-medium">
                Flores acumuladas no seu cuidado
              </p>
            </div>
          </div>

          {/* Barra de Progresso */}
          <div className="space-y-1.5 mb-3 bg-[#FCF7F9] p-3 rounded-xl border border-stone-100">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-stone-600 font-medium">Meta para consulta</span>
              <span className="font-bold text-[#294D33] tabular-nums">
                {flowersCount} / {targetFlowers}
              </span>
            </div>

            {/* Trilho e Barra de Progresso */}
            <div className="w-full h-2.5 bg-stone-200/70 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#294D33] to-[#516B55] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-[11px] text-stone-500 leading-snug pt-0.5">
              {remaining > 0 ? (
                <>
                  Faltam apenas{' '}
                  <strong className="text-[#294D33] font-bold">
                    {remaining} {remaining === 1 ? 'flor' : 'flores'}
                  </strong>{' '}
                  para você resgatar 1 atendimento gratuito.
                </>
              ) : (
                <strong className="text-[#294D33] font-bold">
                  Parabéns! Você já pode resgatar 1 atendimento gratuito.
                </strong>
              )}
            </p>
          </div>

          {/* Dica acolhedora / Botão Funcional Indicar Mãe */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100">
            <span>Ganhe ao escrever no diário ou apoiar mães</span>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={handleTriggerInvite}
              className="text-[#294D33] font-bold hover:underline cursor-pointer shrink-0 ml-2 py-1 px-2 -mr-1 rounded-lg hover:bg-[#EBF3ED] transition-colors"
            >
              Indicar mãe
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
