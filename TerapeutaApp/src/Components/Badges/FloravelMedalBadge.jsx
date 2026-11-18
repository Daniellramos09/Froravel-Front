import React, { useId } from 'react';

/**
 * Gera o caminho vetorial de uma roseta festonada (12 pétalas suaves) fiel ao formato de patente/selo.
 */
function buildScallopedRosettePath(cx = 60, cy = 54, lobes = 12, rOuter = 44, rInner = 38) {
  const step = (Math.PI * 2) / lobes;
  let d = '';
  for (let i = 0; i < lobes; i++) {
    const a1 = i * step - Math.PI / 2;
    const aMid = a1 + step / 2;
    const a2 = a1 + step;

    const xStart = cx + rInner * Math.cos(a1);
    const yStart = cy + rInner * Math.sin(a1);
    const xCtrl = cx + (rOuter + 4) * Math.cos(aMid);
    const yCtrl = cy + (rOuter + 4) * Math.sin(aMid);
    const xEnd = cx + rInner * Math.cos(a2);
    const yEnd = cy + rInner * Math.sin(a2);

    if (i === 0) {
      d += `M ${xStart.toFixed(2)} ${yStart.toFixed(2)} `;
    }
    d += `Q ${xCtrl.toFixed(2)} ${yCtrl.toFixed(2)} ${xEnd.toFixed(2)} ${yEnd.toFixed(2)} `;
  }
  return `${d}Z`;
}

const ROSETTE_PATH = buildScallopedRosettePath(60, 54, 12, 43, 37);

const TIER_PALETTES = {
  ouro_floravel: {
    outerStart: '#3D6B49',
    outerEnd: '#1F3A27',
    ringStroke: '#E8CC88',
    centerStart: '#FBF2DC',
    centerEnd: '#DFBE74',
    ribbonLeft: '#294D33',
    ribbonRight: '#1A3422',
    ribbonHighlight: '#D4B062',
    iconStroke: '#1F3A27',
    iconFill: '#C79B3B',
  },
  rosa_floravel: {
    outerStart: '#E8A9BB',
    outerEnd: '#B55B76',
    ringStroke: '#FCE7F0',
    centerStart: '#FFF5F8',
    centerEnd: '#F4DDE5',
    ribbonLeft: '#C46F88',
    ribbonRight: '#9F4A65',
    ribbonHighlight: '#F4DDE5',
    iconStroke: '#7A2D46',
    iconFill: '#D47B96',
  },
  esmeralda: {
    outerStart: '#56725A',
    outerEnd: '#294D33',
    ringStroke: '#EBF3ED',
    centerStart: '#FFFFFF',
    centerEnd: '#D6E8DB',
    ribbonLeft: '#3B6146',
    ribbonRight: '#213D29',
    ribbonHighlight: '#9EC5AB',
    iconStroke: '#1F3A27',
    iconFill: '#56725A',
  },
  prata_salvia: {
    outerStart: '#8AA392',
    outerEnd: '#56725A',
    ringStroke: '#F1F5F2',
    centerStart: '#FFFFFF',
    centerEnd: '#DCE5DE',
    ribbonLeft: '#73937E',
    ribbonRight: '#4B6353',
    ribbonHighlight: '#E2EBE5',
    iconStroke: '#294D33',
    iconFill: '#73937E',
  },
  bronze_terra: {
    outerStart: '#D89679',
    outerEnd: '#A96144',
    ringStroke: '#F7E7DF',
    centerStart: '#FFF9F6',
    centerEnd: '#EED2C3',
    ribbonLeft: '#B97152',
    ribbonRight: '#8E4E34',
    ribbonHighlight: '#F4D8CB',
    iconStroke: '#6D351E',
    iconFill: '#C87D55',
  },
  bloqueada: {
    outerStart: '#D6D3D1',
    outerEnd: '#A8A29E',
    ringStroke: '#F5F5F4',
    centerStart: '#FAFAF9',
    centerEnd: '#E7E5E4',
    ribbonLeft: '#C7C3BF',
    ribbonRight: '#A8A29E',
    ribbonHighlight: '#E7E5E4',
    iconStroke: '#78716C',
    iconFill: '#A8A29E',
  },
};

function renderCenterSymbol(variant, palette) {
  switch (variant) {
    case 'estrelas':
      return (
        <g>
          <path
            d="M60 36 L65.3 46.8 L77.2 48.5 L68.6 56.9 L70.6 68.7 L60 63.1 L49.4 68.7 L51.4 56.9 L42.8 48.5 L54.7 46.8 Z"
            fill={palette.iconFill}
            stroke={palette.iconStroke}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle cx="46" cy="40" r="2" fill={palette.iconStroke} opacity="0.7" />
          <circle cx="74" cy="40" r="2" fill={palette.iconStroke} opacity="0.7" />
        </g>
      );
    case 'rodas':
      return (
        <g stroke={palette.iconStroke} strokeWidth="1.8" fill="none" strokeLinecap="round">
          <circle cx="60" cy="54" r="14" strokeDasharray="3 3" opacity="0.55" />
          <circle cx="60" cy="43" r="3.4" fill={palette.iconFill} />
          <circle cx="49" cy="59" r="3.4" fill={palette.iconFill} />
          <circle cx="71" cy="59" r="3.4" fill={palette.iconFill} />
          <path d="M52 58 Q60 64 68 58" />
        </g>
      );
    case 'sigilo':
      return (
        <g>
          <path
            d="M60 37 L73 42.5 V53 C73 61.5 67.2 68.4 60 71 C52.8 68.4 47 61.5 47 53 V42.5 Z"
            fill={palette.iconFill}
            stroke={palette.iconStroke}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M54.5 54 L58.3 57.8 L66 50"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      );
    case 'anjo':
      return (
        <g>
          <path
            d="M60 68 C60 68 45 58.8 45 48.8 C45 44.3 48.5 41 52.7 41 C55.4 41 57.9 42.4 60 44.9 C62.1 42.4 64.6 41 67.3 41 C71.5 41 75 44.3 75 48.8 C75 58.8 60 68 60 68 Z"
            fill={palette.iconFill}
            stroke={palette.iconStroke}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M53 52 Q60 57 67 52"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>
      );
    case 'nascente':
      return (
        <g stroke={palette.iconStroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M60 68 V49" />
          <path d="M60 55 C52 55 48 49 48 44 C54 44 59 47 60 55 Z" fill={palette.iconFill} />
          <path d="M60 51 C68 51 72 45 72 40 C66 40 61 43 60 51 Z" fill={palette.iconFill} />
          <circle cx="60" cy="40" r="3" fill="#FFF" />
        </g>
      );
    case 'guardia':
    default:
      return (
        <g>
          {/* Flor de lótus / acolhimento materno */}
          <path
            d="M60 37 C64 44 65 51 60 59 C55 51 56 44 60 37 Z"
            fill={palette.iconFill}
            stroke={palette.iconStroke}
            strokeWidth="1.7"
          />
          <path
            d="M60 59 C52 56 46 50 45 43 C52 44 57 50 60 59 Z"
            fill={palette.iconFill}
            stroke={palette.iconStroke}
            strokeWidth="1.7"
          />
          <path
            d="M60 59 C68 56 74 50 75 43 C68 44 63 50 60 59 Z"
            fill={palette.iconFill}
            stroke={palette.iconStroke}
            strokeWidth="1.7"
          />
          <path
            d="M49 64 Q60 69 71 64"
            fill="none"
            stroke={palette.iconStroke}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      );
  }
}

export default function FloravelMedalBadge({
  variant = 'guardia',
  tier = 'ouro_floravel',
  unlocked = true,
  size = 76,
  className = '',
  title = '',
}) {
  const uid = useId().replace(/:/g, '');
  const palette = unlocked ? TIER_PALETTES[tier] || TIER_PALETTES.ouro_floravel : TIER_PALETTES.bloqueada;

  return (
    <svg
      width={size}
      height={Math.round(size * 1.15)}
      viewBox="0 0 120 138"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title || 'Medalha de Conquista Florável'}
    >
      <defs>
        <linearGradient id={`outer-${uid}`} x1="20" y1="12" x2="100" y2="98" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={palette.outerStart} />
          <stop offset="100%" stopColor={palette.outerEnd} />
        </linearGradient>
        <linearGradient id={`center-${uid}`} x1="34" y1="24" x2="86" y2="82" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={palette.centerStart} />
          <stop offset="100%" stopColor={palette.centerEnd} />
        </linearGradient>
        <filter id={`shadow-${uid}`} x="-10%" y="-10%" width="120%" height="125%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#1F3A27" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Fitas inferiores com corte em V */}
      <g>
        <path
          d="M40 82 L27 128 L42 120 L52 132 L59 90 Z"
          fill={palette.ribbonLeft}
        />
        <path
          d="M43 85 L33 123"
          stroke={palette.ribbonHighlight}
          strokeWidth="1.5"
          strokeOpacity="0.45"
        />
        <path
          d="M80 82 L93 128 L78 120 L68 132 L61 90 Z"
          fill={palette.ribbonRight}
        />
        <path
          d="M77 85 L87 123"
          stroke={palette.ribbonHighlight}
          strokeWidth="1.5"
          strokeOpacity="0.35"
        />
      </g>

      {/* Corpo em Roseta Festonada */}
      <g filter={`url(#shadow-${uid})`}>
        <path
          d={ROSETTE_PATH}
          fill={`url(#outer-${uid})`}
          stroke={palette.ringStroke}
          strokeWidth="1.5"
        />

        {/* Anel interno serrilhado (stitched ring como na referência) */}
        <circle
          cx="60"
          cy="54"
          r="31.5"
          stroke={palette.ringStroke}
          strokeWidth="3.2"
          strokeDasharray="2.2 2.8"
          opacity="0.92"
        />

        {/* Disco central */}
        <circle
          cx="60"
          cy="54"
          r="26"
          fill={`url(#center-${uid})`}
          stroke={palette.outerEnd}
          strokeWidth="1.4"
        />

        {/* Símbolo da conquista no centro */}
        {renderCenterSymbol(variant, palette)}
      </g>
    </svg>
  );
}
