// src/Screen/Services/PsychologistCard.jsx
import React, { useState } from "react";
import { ArrowRight, Video, Award, Clock } from "lucide-react";

/**
 * PsychologistCard — Card Padronizado com a Tipografia de Rodas de Conversa
 *
 * Características:
 * - Fundo branco com cantos arredondados (rounded-3xl) e borda sutil (border-gray5)
 * - Título em Fraunces Bold text-[22px] sm:text-[24px] de alta visibilidade e contraste
 * - Kicker em caixa alta text-[12px] font-bold uppercase tracking-wider
 * - Corpo em text-[15px] text-gray3 com entrelinha relaxada
 * - Retrato da psicóloga em moldura vertical com cantos suaves
 */
export default function PsychologistCard({ professional, onSelectAgenda }) {
  const [imgError, setImgError] = useState(false);

  const initials = professional.name
    .replace(/^Dra?\.\s*/i, "")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isSocialPrice =
    professional.price === 0 ||
    professional.isSocial ||
    String(professional.priceFormatted).toLowerCase().includes("social") ||
    String(professional.priceFormatted).toLowerCase().includes("gratuito");

  const handleSelect = () => {
    if (onSelectAgenda) onSelectAgenda(professional);
  };

  return (
    <article
      onClick={handleSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSelect();
        }
      }}
      role="button"
      tabIndex={0}
      aria-labelledby={`prof-name-${professional.id}`}
      className="bg-white rounded-3xl border border-gray5 p-6 sm:p-7 hover:shadow-md transition duration-300 group flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {/* Retrato da Profissional */}
      <div className="relative shrink-0 w-24 h-32 sm:w-28 sm:h-36 rounded-2xl overflow-hidden bg-superficie border border-gray5 shadow-xs">
        {professional.photo && !imgError ? (
          <img
            src={professional.photo}
            alt={`Foto de ${professional.name}`}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-primary font-fraunces font-bold text-2xl"
            aria-hidden="true"
          >
            {initials}
          </div>
        )}
      </div>

      {/* Conteúdo com Hierarquia Tipográfica Padronizada */}
      <div className="flex-1 min-w-0 flex flex-col justify-between w-full">
        <div>
          {/* Kicker idêntico a Rodas de Conversa */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[12px] font-bold uppercase tracking-wider text-secondary">
              {professional.spec}
            </span>
            <span className="text-[12px] text-gray4 font-mono font-medium">
              {professional.crp || "CRP 06/142980"}
            </span>
          </div>

          {/* Nome da Profissional: Fraunces Bold 22px-24px (igual a Rodas de Conversa) */}
          <h3
            id={`prof-name-${professional.id}`}
            className="text-[22px] sm:text-[24px] font-fraunces font-bold text-gray1 mb-2 leading-tight group-hover:text-primary transition-colors"
          >
            {professional.name}
          </h3>

          {/* Abordagem e descrição */}
          {professional.approach && (
            <p className="text-[14px] sm:text-[15px] text-gray3 leading-relaxed mb-3">
              <strong className="text-gray2 font-semibold">Abordagem:</strong> {professional.approach}
              {professional.modality && ` · ${professional.modality}`}
            </p>
          )}
        </div>

        {/* Rodapé com Destaque para Valor Social / Gratuito e CTA */}
        <div className="mt-2 pt-3 border-t border-gray5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isSocialPrice ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-superficie text-primary font-bold text-[12px] border border-secondary/20 shadow-2xs">
                Gratuito · Fundo Florável
              </span>
            ) : (
              <span className="text-[15px] font-bold font-fraunces text-gray1">
                {professional.priceFormatted || `R$ ${professional.price},00`}
                <span className="text-[12px] font-normal text-gray3 font-dmsans">
                  {" "}
                  / sessão social
                </span>
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-1.5 text-[14px] font-bold text-primary group-hover:text-apoio group-hover:translate-x-1 transition-all">
            <span>Ver perfil e horários</span>
            <ArrowRight size={16} aria-hidden="true" />
          </span>
        </div>
      </div>
    </article>
  );
}
