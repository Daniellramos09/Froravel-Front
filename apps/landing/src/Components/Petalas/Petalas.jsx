// src/Components/Petalas/Petalas.jsx
// Pétalas desenhadas em código: caem sozinhas e fogem do mouse.
import { useEffect, useRef, useState } from "react";

// ====== AJUSTES (mexa só aqui) ======
const CONFIG = {
  densidade: 20000,  // área em px² por pétala: MENOR = mais pétalas
  min: 22,           // mínimo de pétalas (celular)
  max: 70,           // máximo de pétalas (tela grande)
  tamanho: [14, 36], // px: da pétala "longe" até a "perto"
  queda: 0.8,        // velocidade de queda
  balanco: 0.55,     // quanto balança para os lados
  raio: 160,         // distância em que o mouse afasta as pétalas
  forca: 0.5,        // força do empurrão
  atrito: 0.93,      // 0.90 = volta rápido ao normal | 0.97 = flutua por mais tempo
};

// [cor de cima, cor de baixo] de cada pétala
const CORES = [
  ["#fbc3d0", "#f08fa6"],
  ["#fcd3c4", "#f5a08f"],
  ["#f9b5c6", "#e57f98"],
  ["#fde0d2", "#f7b394"],
];

// Desenha uma pétala uma única vez (depois só é copiada: bem mais leve)
function criarSprite([c1, c2], forma) {
  const s = 64;
  const cv = document.createElement("canvas");
  cv.width = s;
  cv.height = s;
  const g = cv.getContext("2d");
  g.translate(s / 2, s / 2);

  const grad = g.createLinearGradient(0, -26, 0, 26);
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);
  g.fillStyle = grad;

  g.beginPath();
  if (forma === 0) {
    // gota alongada
    g.moveTo(0, -26);
    g.bezierCurveTo(22, -18, 20, 12, 0, 26);
    g.bezierCurveTo(-20, 12, -22, -18, 0, -26);
  } else {
    // mais redonda
    g.moveTo(0, -24);
    g.bezierCurveTo(27, -22, 22, 14, 0, 24);
    g.bezierCurveTo(-22, 14, -27, -22, 0, -24);
  }
  g.fill();

  // nervura clara no meio
  g.strokeStyle = "rgba(255,255,255,.4)";
  g.lineWidth = 1.2;
  g.beginPath();
  g.moveTo(0, -18);
  g.quadraticCurveTo(2, 0, 0, 18);
  g.stroke();
  return cv;
}

export default function Petalas() {
  const ref = useRef(null);
  const [reduz] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    if (reduz) return;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const sprites = CORES.flatMap((c) => [criarSprite(c, 0), criarSprite(c, 1)]);

    let W = 0, H = 0, dpr = 1, petalas = [], raf = 0;
    const mouse = { x: -9999, y: -9999, v: 0 };

    const nova = (inicial) => {
      const z = Math.random(); // 0 = longe, 1 = perto
      const s = CONFIG.tamanho[0] + z * (CONFIG.tamanho[1] - CONFIG.tamanho[0]);
      return {
        x: Math.random() * W,
        y: inicial ? Math.random() * H : -s,
        z, s,
        fall: CONFIG.queda * (0.4 + 0.6 * z) * (0.8 + Math.random() * 0.4),
        freq: 0.01 + Math.random() * 0.015,
        fase: Math.random() * 6.28,
        amp: CONFIG.balanco * (0.5 + Math.random()),
        rot: Math.random() * 6.28,
        vrot: (Math.random() - 0.5) * 0.02,
        flip: Math.random() * 6.28,
        vflip: 0.02 + Math.random() * 0.03,
        t: Math.random() * 1000,
        px: 0, py: 0, // empurrão do mouse (vai diminuindo sozinho)
        sprite: sprites[Math.floor(Math.random() * sprites.length)],
      };
    };

    const ajustar = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(CONFIG.max, Math.max(CONFIG.min, (W * H) / CONFIG.densidade)));
      petalas = Array.from({ length: n }, () => nova(true));
    };

    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min((now - last) / 16.67, 3);
      last = now;

      const r = canvas.getBoundingClientRect();
      const mx = mouse.x - r.left;
      const my = mouse.y - r.top;
      mouse.v *= 0.9;
      const R = CONFIG.raio;
      const atrito = Math.pow(CONFIG.atrito, dt);

      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < petalas.length; i++) {
        const p = petalas[i];
        p.t += dt;

        // queda + balanço + um vento bem leve
        p.y += p.fall * dt;
        p.x += (Math.sin(p.t * p.freq + p.fase) * p.amp + 0.12 * (0.4 + p.z)) * dt;

        // mouse empurra a pétala para longe
        const dx = p.x - mx;
        const dy = p.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1;
          const q = 1 - d / R;
          const f = q * q * CONFIG.forca * (0.5 + 0.5 * p.z) * (1 + mouse.v * 0.04);
          p.px += (dx / d) * f * dt;
          p.py += (dy / d) * f * dt;
        }
        p.x += p.px * dt;
        p.y += p.py * dt;
        p.px *= atrito;
        p.py *= atrito;

        p.rot += (p.vrot + p.px * 0.01) * dt;
        p.flip += p.vflip * dt;

        // saiu da tela: volta por outro lado
        if (p.y > H + p.s) Object.assign(p, nova(false), { x: Math.random() * W });
        else if (p.y < -p.s * 4) p.y = H + p.s;
        if (p.x < -p.s * 2) p.x = W + p.s;
        else if (p.x > W + p.s * 2) p.x = -p.s;

        // desenha (o "flip" simula a pétala virando no ar)
        const sx = 0.35 + 0.65 * Math.abs(Math.cos(p.flip));
        ctx.globalAlpha = 0.5 + 0.45 * p.z;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(sx, 1);
        ctx.drawImage(p.sprite, -p.s / 2, -p.s / 2, p.s, p.s);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e) => {
      mouse.v = Math.min(40, Math.hypot(e.clientX - mouse.x, e.clientY - mouse.y));
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    // Só anima enquanto o hero está visível (economiza bateria)
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    });

    ajustar();
    const ro = new ResizeObserver(ajustar);
    ro.observe(canvas);
    io.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [reduz]);

  if (reduz) return null; // quem prefere menos movimento não vê as pétalas
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}