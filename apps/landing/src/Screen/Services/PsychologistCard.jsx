// src/Screen/Services/PsychologistCard.jsx
import React, { useState } from "react";
import {
  Video,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Clock,
} from "lucide-react";

export default function PsychologistCard({ professional, onSelectAgenda }) {
  const [imgError, setImgError] = useState(false);

  // Iniciais para fallback caso a imagem falhe
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

  // Garante que todas as tags (especialidade, tema, tags extras) sejam exibidas com wrap seguro
  const displayTags = professional.tags && professional.tags.length > 0
    ? professional.tags
    : [
        professional.spec,
        professional.extraTag,
        professional.badge && !["CFP Verificado", "CRP Verificado", "Verificada"].includes(professional.badge)
          ? professional.badge
          : null,
      ].filter(Boolean);

  return (
    <article
      className="bg-white rounded-[1.5rem] border border-stone-100 p-5 sm:p-6 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-[#E8A9BB]/60 relative group"
      aria-labelledby={`prof-name-${professional.id}`}
    >
      <div>
        {/* ========================================================= */}
        {/* BARRA SUPERIOR DO CARD: SELO DE CONFIANÇA + MODALIDADE    */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          {/* Selo de Confiança Compacto e Elegante (Nunca corta ou vaza) */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DEF7EC] text-[#03543F] border border-emerald-200/50 shadow-2xs shrink-0">
            <CheckCircle2 size={12} className="text-emerald-600 shrink-0" aria-hidden="true" />
            <span>CRP Verificado</span>
          </span>

          <span className="text-[11px] font-semibold text-[#516B55] bg-stone-50 px-2.5 py-0.5 rounded-full border border-stone-200/60 shrink-0">
            {professional.modality?.includes("Presencial") ? "Presencial & Online" : "100% Online"}
          </span>
        </div>

        {/* ========================================================= */}
        {/* DADOS DA PROFISSIONAL: FOTO + NOME COMPLETO + CRP         */}
        {/* ========================================================= */}
        <div className="flex items-start gap-3.5 mb-4">
          {/* Foto Real da Psicóloga (w-16 h-16) com Fallback Elegante */}
          <div className="relative shrink-0">
            {professional.photo && !imgError ? (
              <img
                src={professional.photo}
                alt={`Foto de perfil de ${professional.name}`}
                onError={() => setImgError(true)}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#F4DDE5] shadow-xs group-hover:border-[#E8A9BB] transition-colors"
              />
            ) : (
              <div 
                className="w-16 h-16 rounded-full bg-[#FCE7F0] text-[#294D33] font-bold text-lg flex items-center justify-center border-2 border-[#F4DDE5] shadow-xs"
                aria-hidden="true"
              >
                <span style={{ fontFamily: "'Fraunces', serif" }}>{initials}</span>
              </div>
            )}
            {/* Ponto indicador de disponibilidade ativa */}
            <span 
              className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" 
              title="Disponível para novos atendimentos"
              aria-label="Disponível para novos atendimentos"
            />
          </div>

          {/* Nome Completo (Sem truncate forçado!), CRP e Abordagem */}
          <div className="flex-1 min-w-0">
            <h3
              id={`prof-name-${professional.id}`}
              className="text-base sm:text-lg font-bold text-[#294D33] leading-snug group-hover:text-[#1e3c27] transition-colors break-words"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {professional.name}
            </h3>
            <p className="text-xs text-stone-400 font-mono mt-0.5">
              {professional.crp || "CRP 06/142980"}
            </p>
            {professional.approach && (
              <p className="text-[11px] font-medium text-[#516B55] mt-1 leading-snug">
                <span className="text-stone-400 font-normal">Abordagem:</span> {professional.approach}
              </p>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* CORPO DO CARD: TAGS DE ESPECIALIDADE & RESUMO EDITORIAL   */}
        {/* ========================================================= */}
        <div className="space-y-3">
          {/* Tags de Especialidade e Foco (com wrap responsivo - NUNCA corta) */}
          <div className="flex flex-wrap items-center gap-1.5">
            {displayTags.map((tag, idx) => (
              <span
                key={tag + idx}
                className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
                  idx === 0
                    ? "bg-[#FCF7F9] text-[#294D33] border border-[#E8A9BB]/60 font-bold shadow-2xs"
                    : "bg-stone-50 text-stone-700 border border-stone-200"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Breve resumo (máx 3 linhas) em DM Sans */}
          <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed font-normal">
            {professional.desc}
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RODAPÉ DO CARD: INFORMAÇÕES PRÁTICAS & BOTÃO DE AÇÃO      */}
      {/* ========================================================= */}
      <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
        {/* Preço Social e Duração */}
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-1.5 text-stone-500 font-medium">
            <Clock size={13} className="text-[#294D33]" aria-hidden="true" />
            <span>50 min</span>
          </div>

          <div>
            {isSocialPrice ? (
              <span className="inline-flex items-center gap-1 text-emerald-800 bg-[#DEF7EC] px-2 py-0.5 rounded-md text-[11px] font-bold">
                <span>💚</span>
                <span>Valor Social (Gratuito)</span>
              </span>
            ) : (
              <span className="text-stone-800 font-bold text-xs sm:text-sm">
                💰 {professional.priceFormatted || `R$ ${professional.price},00`}{" "}
                <span className="text-[11px] font-normal text-stone-500">/sessão</span>
              </span>
            )}
          </div>
        </div>

        {/* Botão de Ação: "Ver agenda" */}
        <button
          type="button"
          onClick={() => onSelectAgenda && onSelectAgenda(professional)}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full border border-[#294D33] text-[#294D33] hover:bg-[#294D33] hover:text-white transition-all duration-200 text-xs sm:text-sm font-bold shadow-2xs group-hover:shadow-xs shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2"
          aria-label={`Ver agenda e horários disponíveis de ${professional.name}`}
        >
          <span>Ver agenda</span>
          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </button>
      </div>
    </article>
  );
}
