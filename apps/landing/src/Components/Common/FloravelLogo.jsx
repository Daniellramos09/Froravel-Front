import React from 'react';

export default function FloravelLogo({ className = "", textClassName = "", iconSize = 40, showText = true }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Imagem Oficial da Logo Florável da pasta fotoheader */}
      <img
        src="/img/fotoheader/logo.png"
        alt="Florável Logo"
        className="h-9 sm:h-10 w-auto object-contain transition-transform duration-300 hover:scale-105 drop-shadow-2xs"
        onError={(e) => {
          e.currentTarget.onerror = null;
        }}
      />

      {showText && (
        <span className={`font-serif text-xl md:text-[1.45rem] font-medium tracking-[0.06em] uppercase text-[#1F3224] ${textClassName}`}>
          FLORÁVEL
        </span>
      )}
    </div>
  );
}
