import React from 'react';

// Ramo Botânico Elegante (utilizado ao redor do herói e cantos das seções)
export function BotanicalBranch({ 
  className = "", 
  variant = "sage", // 'sage', 'pink', ou 'dual'
  size = 140,
  flip = false 
}) {
  const isPink = variant === 'pink';
  const isDual = variant === 'dual';
  
  const stemColor = isPink ? "#F4C4D4" : "#73937E";
  const leafColorPrimary = isPink ? "#F4C4D4" : "#73937E";
  const leafColorSecondary = isDual ? "#F4C4D4" : (isPink ? "#FCE7F0" : "#8FA89B");

  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 100 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none transition-transform duration-700 ${flip ? 'scale-x-[-1]' : ''} ${className}`}
      aria-hidden="true"
    >
      {/* Haste central curva */}
      <path
        d="M20 135 C 35 100, 55 60, 75 15"
        stroke={stemColor}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Folha 1 - Superior */}
      <path
        d="M75 15 C 85 8, 92 14, 85 24 C 78 30, 73 22, 75 15 Z"
        fill={leafColorPrimary}
        opacity="0.9"
      />
      {/* Folha 2 - Direita alta */}
      <path
        d="M65 38 C 82 32, 88 42, 78 50 C 70 56, 62 46, 65 38 Z"
        fill={leafColorSecondary}
        opacity="0.85"
      />
      {/* Folha 3 - Esquerda alta */}
      <path
        d="M58 48 C 42 40, 36 50, 44 58 C 50 64, 58 56, 58 48 Z"
        fill={leafColorPrimary}
        opacity="0.9"
      />
      {/* Folha 4 - Direita média */}
      <path
        d="M50 72 C 68 66, 75 78, 64 85 C 55 90, 48 80, 50 72 Z"
        fill={leafColorSecondary}
        opacity="0.85"
      />
      {/* Folha 5 - Esquerda média */}
      <path
        d="M42 85 C 24 78, 18 90, 28 98 C 36 104, 44 94, 42 85 Z"
        fill={leafColorPrimary}
        opacity="0.9"
      />
      {/* Folha 6 - Direita baixa */}
      <path
        d="M34 108 C 50 102, 56 114, 46 120 C 38 125, 32 116, 34 108 Z"
        fill={leafColorSecondary}
        opacity="0.8"
      />
      {/* Folha 7 - Esquerda baixa */}
      <path
        d="M26 118 C 12 112, 6 124, 15 130 C 22 135, 28 126, 26 118 Z"
        fill={leafColorPrimary}
        opacity="0.85"
      />
    </svg>
  );
}

// Line Art Minimalista do Corpo Feminino / Maternidade em Linha Contínua
export function MaternalLineArt({ className = "", size = 220 }) {
  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 200 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none opacity-40 transition-opacity hover:opacity-70 ${className}`}
      aria-hidden="true"
    >
      {/* Linha Contínua Feminina: Rosto sereno, ombro e mãos delicadamente acolhendo o ventre */}
      <path
        d="
          M 100 25
          C 112 25, 122 35, 122 48
          C 122 62, 114 74, 106 82
          C 102 86, 96 90, 94 98
          C 92 108, 95 116, 98 126
          C 102 140, 110 152, 108 168
          C 105 186, 88 198, 72 195
          C 56 192, 46 178, 48 162
          C 50 148, 58 138, 66 128
          C 74 118, 76 108, 72 98
          C 68 86, 62 76, 66 62
          C 70 48, 80 38, 92 30
          C 96 26, 98 25, 100 25
        "
        stroke="#73937E"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Mão sobre o ventre em traço orgânico suave */}
      <path
        d="
          M 85 142
          C 95 142, 104 148, 106 156
          C 108 164, 102 172, 92 174
          C 82 176, 74 170, 72 162
          C 70 154, 76 144, 85 142
        "
        stroke="#F4C4D4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Traço sutil da clavícula e serenidade */}
      <path
        d="M 84 94 C 92 98, 104 98, 112 93"
        stroke="#73937E"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Fundo Orgânico com Ondas e Formas Amórficas Suaves (#FAFAF9, #F4C4D4, #73937E)
export function OrganicHeroBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Base neutra suave #FAFAF9 */}
      <div className="absolute inset-0 bg-[#FAFAF9]" />

      {/* Onda orgânica superior esquerda (Tom sálvia / bege suave) */}
      <svg
        className="absolute -top-16 -left-16 w-[45vw] min-w-[320px] max-w-[620px] opacity-70"
        viewBox="0 0 500 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0 L400 0 C380 120, 440 220, 320 280 C200 340, 120 260, 0 350 Z"
          fill="#F5EFEA"
        />
      </svg>

      {/* Onda orgânica inferior esquerda (Rosa Acolhimento #F4C4D4 suave) */}
      <svg
        className="absolute -bottom-24 -left-12 w-[40vw] min-w-[280px] max-w-[540px] opacity-60"
        viewBox="0 0 500 450"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 450 L0 180 C80 170, 150 210, 220 180 C320 140, 360 280, 480 320 L500 450 Z"
          fill="#F4C4D4"
        />
      </svg>

      {/* Onda orgânica superior direita (Tom Sálvia claro #EBF3EE) */}
      <svg
        className="absolute -top-20 -right-20 w-[48vw] min-w-[340px] max-w-[680px] opacity-50"
        viewBox="0 0 600 450"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M600 0 L150 0 C180 120, 100 220, 220 300 C340 380, 480 320, 600 380 Z"
          fill="#EBF3EE"
        />
      </svg>

      {/* Círculo difuso central sutil para iluminação natural */}
      <div className="absolute top-1/3 right-1/4 w-[420px] h-[420px] rounded-full bg-[#FDF2F5]/70 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[380px] h-[380px] rounded-full bg-[#EBF3EE]/60 blur-3xl pointer-events-none" />
    </div>
  );
}
