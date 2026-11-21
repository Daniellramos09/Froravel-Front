import React from "react";

/**
 * Novo Símbolo Internacional de Acessibilidade (ONU / Universal Inclusion)
 * Representa a acessibilidade plena: física, sensorial, cognitiva, visual e auditiva.
 * Figura humana de braços e pernas abertos conectada a nós de rede e círculo inclusivo.
 */
export default function UniversalAccessibilityIcon({ 
  size = 26, 
  className = "", 
  color = "currentColor",
  accentColor = "currentColor", // Cor dos 4 nós de conexão e da cabeça (opcionalmente rosa antigo / destaque)
  ariaLabel = "Símbolo Internacional de Acessibilidade"
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={ariaLabel}
      role="img"
    >
      {/* 1. Arcos do Círculo Externo Conectando os Nós */}
      {/* Arco Superior (Acima dos braços) */}
      <path
        d="M 14.5 37 A 38 38 0 0 1 85.5 37"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Arco Lateral Esquerdo */}
      <path
        d="M 14.5 37 A 38 38 0 0 0 34 84.5"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Arco Lateral Direito */}
      <path
        d="M 85.5 37 A 38 38 0 0 1 66 84.5"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Arco Inferior (Abaixo das pernas) */}
      <path
        d="M 34 84.5 A 38 38 0 0 0 66 84.5"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* 2. Braços Estendidos em Arco Acolhedor (Conectam nós esquerdo e direito) */}
      <path
        d="M 14.5 37 Q 50 46.5 85.5 37"
        stroke={color}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 3. Tronco e Pernas Abertas em V Invertido */}
      {/* Tronco Central */}
      <path
        d="M 50 44 L 50 58.5"
        stroke={color}
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      {/* Perna Esquerda até o nó inferior */}
      <path
        d="M 50 58.5 L 34 84.5"
        stroke={color}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Perna Direita até o nó inferior */}
      <path
        d="M 50 58.5 L 66 84.5"
        stroke={color}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 4. Cabeça do Símbolo */}
      <circle
        cx="50"
        cy="26"
        r="9.5"
        fill={accentColor}
        stroke={color}
        strokeWidth="2"
      />

      {/* 5. Os 4 Nós Circulares de Conexão com o Mundo (Braços e Pernas) */}
      {/* Nó do Braço Esquerdo */}
      <circle
        cx="14.5"
        cy="37"
        r="5.5"
        fill={accentColor}
        stroke={color}
        strokeWidth="2.5"
      />
      {/* Nó do Braço Direito */}
      <circle
        cx="85.5"
        cy="37"
        r="5.5"
        fill={accentColor}
        stroke={color}
        strokeWidth="2.5"
      />
      {/* Nó da Perna Esquerda */}
      <circle
        cx="34"
        cy="84.5"
        r="5.5"
        fill={accentColor}
        stroke={color}
        strokeWidth="2.5"
      />
      {/* Nó da Perna Direita */}
      <circle
        cx="66"
        cy="84.5"
        r="5.5"
        fill={accentColor}
        stroke={color}
        strokeWidth="2.5"
      />
    </svg>
  );
}
