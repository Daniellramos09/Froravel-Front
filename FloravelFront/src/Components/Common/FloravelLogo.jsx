import React from 'react';

export default function FloravelLogo({ className = "", textClassName = "", iconSize = 36, showText = true }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Ícone Floral em Line Art suave (Rosa Acolhimento e Verde Sálvia) */}
      <svg 
        width={iconSize} 
        height={iconSize} 
        viewBox="0 0 48 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-300 hover:rotate-6"
        aria-hidden="true"
      >
        {/* Pétalas orgânicas em linha contínua - Rosa Acolhimento */}
        <circle cx="24" cy="24" r="5" stroke="#73937E" strokeWidth="1.8" strokeLinecap="round" />
        <path
          d="M24 19C24 14 20 10 16 13C12 16 16 20 20 22"
          stroke="#F4C4D4"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M28 20C32 17 36 14 39 18C41 22 36 25 30 24"
          stroke="#F4C4D4"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M29 27C34 29 38 33 35 37C32 40 27 36 26 30"
          stroke="#F4C4D4"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 29C18 33 13 36 10 32C7 28 12 24 18 25"
          stroke="#F4C4D4"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Haste / Folha Sálvia */}
        <path
          d="M23 31C21 37 17 41 12 43"
          stroke="#73937E"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M21 36C18 36 16 38 15 40"
          stroke="#73937E"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>

      {showText && (
        <span className={`font-display text-2xl md:text-3xl font-medium tracking-tight text-[#27272A] ${textClassName}`}>
          Florável
        </span>
      )}
    </div>
  );
}
