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
        <span className={`font-serif text-2xl md:text-[1.75rem] font-medium tracking-tight text-[#1F3224] ${textClassName}`}>
          Florável
        </span>
      )}
    </div>
  );
}
