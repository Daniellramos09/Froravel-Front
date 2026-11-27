// src/Screen/Services/PsychologistCard.jsx
import React, { useState } from "react";
import { ArrowRight, Star, Sparkles } from "lucide-react";
import FloravelMedalBadge from "../../Components/Badges/FloravelMedalBadge";

/**
 * PsychologistCard — Card com hierarquia tipográfica, estrelas organizadas em linha única
 * e exibição da Patente Florável + selo de oportunidade para profissionais recém-chegadas.
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

  const nota = Number(professional.rating || 4.9).toFixed(1);
  const totalEstrelas = professional.positiveStarsCount || professional.sessionsCompleted || 24;

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
      {/* Retrato da Profissional + Selo de Patente discreto no canto */}
      <div className="relative shrink-0">
        <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-2xl overflow-hidden bg-superficie border border-gray5 shadow-xs">
          {professional.photo && !imgError ? (
            <img
              src={professional.photo}
              alt={`Foto de ${professional.name}`}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-[center_18%] transition duration-500 group-hover:scale-105"
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

        {/* Selo de Credibilidade sobre o canto inferior da foto */}
        <div
          className="absolute -bottom-2.5 -right-2.5 bg-white rounded-full p-1 shadow-md border border-stone-200/80"
          title={professional.patenteNome || "Selo de Credibilidade Florável"}
        >
          <FloravelMedalBadge
            variant={professional.patenteVariant || "guardia"}
            tier={professional.patenteTier || "ouro_floravel"}
            size={30}
            title={professional.patenteNome || "Selo de Credibilidade Florável"}
          />
        </div>
      </div>

      {/* Conteúdo com Hierarquia Limpa (padrão editorial do perfil) */}
      <div className="flex-1 min-w-0 flex flex-col justify-between w-full">
        <div>
          {/* Linha 1: Especialidade + CRP em linha limpa */}
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="text-xs font-medium text-[#516B55] truncate">
              {professional.spec} · {professional.crp || "CRP 06/142980"}
            </span>
          </div>

          {/* Nome da Profissional */}
          <h3
            id={`prof-name-${professional.id}`}
            className="text-[22px] sm:text-[24px] font-fraunces font-normal text-[#1F3A27] mb-2 leading-tight group-hover:text-[#294D33] transition-colors"
          >
            {professional.name}
          </h3>

          {/* Linha 2: Estrelas limpas (sem fundo amarelo) + Selo */}
          <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
            <span className="inline-flex items-center gap-1.5 text-sm whitespace-nowrap">
              <Star size={14} className="fill-amber-400 text-amber-500 shrink-0" />
              <span className="font-semibold text-[#1F3A27] tabular-nums">{nota}</span>
              <span className="text-[#4A5E4D]">
                · {totalEstrelas} estrelas
              </span>
            </span>

            {professional.patenteNome && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#EBF3ED] text-[#1F3A27] text-xs font-medium whitespace-nowrap">
                {professional.patenteNome}
              </span>
            )}
          </div>

          {/* Abordagem e modalidade */}
          {professional.approach && (
            <p className="text-sm text-[#4A5E4D] leading-relaxed mb-3">
              Abordagem: <strong className="text-[#1F3A27] font-medium">{professional.approach}</strong>
              {professional.modality && ` · ${professional.modality}`}
            </p>
          )}
        </div>

        {/* Rodapé limpo */}
        <div className="mt-1 pt-3 border-t border-[#E4DAD5] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isSocialPrice ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#EBF3ED] text-[#1F3A27] font-medium text-xs">
                Gratuito · Fundo Florável
              </span>
            ) : (
              <span className="text-base font-fraunces font-normal text-[#1F3A27]">
                {professional.priceFormatted || `R$ ${professional.price},00`}
                <span className="text-xs font-normal text-[#4A5E4D] font-dmsans">
                  {" "}
                  / sessão
                </span>
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#294D33] group-hover:translate-x-1 transition-all">
            <span>Ver perfil e horários</span>
            <ArrowRight size={16} aria-hidden="true" />
          </span>
        </div>
      </div>
    </article>
  );
}
