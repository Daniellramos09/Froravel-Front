// src/Screen/Services/PsychologistCard.jsx
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

/**
 * PsychologistCard — Listagem compacta e mobile-first da Rede de Apoio
 *
 * Prioriza:
 * 1. Fotografia real + Nome completo (Fraunces)
 * 2. Especialidade principal + Abordagem terapêutica
 * 3. Destaque claro para Atendimento Gratuito (Fundo Florável) ou Valor Social
 * 4. Modalidade e ação direta para abrir o perfil e agendar
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
      className="group bg-[#F5EDE9]/75 hover:bg-[#F1E6E1] rounded-xl border border-[#E4DAD5] p-4 sm:p-5 flex items-center gap-4 sm:gap-5 transition-colors duration-200 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33]"
    >
      {/* Retrato da Profissional */}
      <div className="relative shrink-0">
        {professional.photo && !imgError ? (
          <img
            src={professional.photo}
            alt={`Retrato de ${professional.name}`}
            onError={() => setImgError(true)}
            className="w-20 h-24 sm:w-24 sm:h-28 rounded-lg object-cover border border-[#E4DAD5]"
          />
        ) : (
          <div
            className="w-20 h-24 sm:w-24 sm:h-28 rounded-lg bg-[#EBD9D3] text-[#1F3A27] flex items-center justify-center border border-[#E4DAD5]"
            aria-hidden="true"
          >
            <span
              className="text-[20px] font-medium"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {initials}
            </span>
          </div>
        )}
      </div>

      {/* Informações Essenciais */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <span className="text-[12px] font-medium text-[#516B55]">
              {professional.spec}
            </span>
            <span className="text-[11px] text-[#6B6365] tabular-nums">
              {professional.crp || "CRP 06/142980"}
            </span>
          </div>

          <h3
            id={`prof-name-${professional.id}`}
            className="text-[19px] sm:text-[21px] font-normal text-[#1F3A27] leading-[1.2] tracking-[-0.015em] group-hover:text-[#294D33] transition-colors"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {professional.name}
          </h3>

          {professional.approach && (
            <p className="text-[13px] text-[#6B6365] mt-1 truncate">
              Abordagem: {professional.approach}
            </p>
          )}
        </div>

        {/* Rodapé compacto: Valor / Gratuito + Ação */}
        <div className="mt-3.5 pt-3 border-t border-[#E4DAD5]/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {isSocialPrice ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-[#E3EDE5] text-[#1F3A27] text-[12px] font-medium">
                Gratuito · Fundo Florável
              </span>
            ) : (
              <span className="text-[13px] font-medium text-[#1F3A27] tabular-nums">
                {professional.priceFormatted || `R$ ${professional.price},00`}
                <span className="text-[12px] font-normal text-[#6B6365]">
                  {" "}
                  / sessão · Valor social
                </span>
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-1 text-[13px] font-medium text-[#294D33] group-hover:translate-x-0.5 transition-transform">
            <span>Ver perfil</span>
            <ArrowRight size={14} aria-hidden="true" />
          </span>
        </div>
      </div>
    </article>
  );
}
