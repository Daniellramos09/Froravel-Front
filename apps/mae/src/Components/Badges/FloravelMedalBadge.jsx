import React, { useState, useId } from 'react';

const MEDAL_IMAGES = {
  guardia: '/img/medalhas/guardia-puerperio.jpg',
  estrelas: '/img/medalhas/escuta-5-estrelas.jpg',
  rodas: '/img/medalhas/facilitadora-rodas.jpg',
  anjo: '/img/medalhas/anjo-fundo-solidario.jpg',
  sigilo: '/img/medalhas/sigilo-etico-cfp.jpg',
  nascente: '/img/medalhas/estrela-nascente.jpg',
};

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

export default function FloravelMedalBadge({
  variant = 'guardia',
  unlocked = true,
  size = 34,
  className = '',
  title = '',
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const uid = useId().replace(/:/g, '');
  const imgSrc = MEDAL_IMAGES[variant] || MEDAL_IMAGES.guardia;

  if (!imgFailed) {
    return (
      <img
        src={imgSrc}
        alt={title || 'Patente Florável'}
        title={title}
        width={size}
        height={size}
        onError={() => setImgFailed(true)}
        style={{ width: size, height: size }}
        className={`object-contain mix-blend-multiply select-none ${
          unlocked ? '' : 'grayscale opacity-50'
        } ${className}`}
      />
    );
  }

  return (
    <svg
      width={size}
      height={Math.round(size * 1.15)}
      viewBox="0 0 120 138"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title || 'Patente Florável'}
    >
      <defs>
        <linearGradient id={`outer-${uid}`} x1="20" y1="12" x2="100" y2="98" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3D6B49" />
          <stop offset="100%" stopColor="#1F3A27" />
        </linearGradient>
      </defs>
      <path d="M40 82 L27 128 L42 120 L52 132 L59 90 Z" fill="#294D33" />
      <path d="M80 82 L93 128 L78 120 L68 132 L61 90 Z" fill="#1A3422" />
      <path d={ROSETTE_PATH} fill={`url(#outer-${uid})`} stroke="#E8CC88" strokeWidth="1.5" />
      <circle cx="60" cy="54" r="26" fill="#FAF8F5" stroke="#1F3A27" strokeWidth="1.4" />
    </svg>
  );
}
