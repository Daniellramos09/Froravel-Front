// src/components/FlowerScroll/FlowerScroll.jsx
import { useEffect, useRef } from "react";

const TOTAL_FRAMES = 60; // quantidade real de arquivos em public/frames
const framePath = (i) =>
  `/frames/ezgif-frame-${String(i).padStart(3, "0")}.png`;

export default function FlowerScroll({ background, children }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const section = sectionRef.current;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const images = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.onerror = () => console.error("Frame não encontrado:", framePath(i));
      img.src = framePath(i);
      images.push(img);
    }

    const draw = (index) => {
      const img = images[index];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = frame.data;
      for (let p = 0; p < d.length; p += 4) {
        const max = Math.max(d[p], d[p + 1], d[p + 2]);
        const min = Math.min(d[p], d[p + 1], d[p + 2]);
        const cor = max - min; // cinza e branco ≈ 0, a flor tem valor alto
        d[p + 3] = Math.min(1, Math.max(0, (cor - 10) / 20)) * 255;
      }
      ctx.putImageData(frame, 0, 0);
    };

    images[0].onload = () => {
      canvas.width = images[0].naturalWidth;
      canvas.height = images[0].naturalHeight;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      draw(reduceMotion ? TOTAL_FRAMES - 1 : 0);
    };

    if (reduceMotion) {
      section.style.setProperty("--p", 1);
      return;
    }

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollable = section.offsetHeight - window.innerHeight;
        const progress = Math.min(
          Math.max(-section.getBoundingClientRect().top / scrollable, 0),
          1
        );
        section.style.setProperty("--p", progress); // 0 → 1, usado pelo CSS dos filhos
        draw(Math.min(TOTAL_FRAMES - 1, Math.floor(progress * TOTAL_FRAMES)));
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
  <section ref={sectionRef} className="relative h-[400vh]" style={{ "--p": 0 }}>
    <div className="sticky top-0 h-screen overflow-hidden">
      {background}

      {/* Área reservada: entre o header (top-20) e a faixa de baixo (bottom-48) */}
      <div className="absolute inset-x-0 bottom-48 top-20 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Uma flor que se abre conforme você rola a página"
          className="h-full w-auto max-w-none scale-[1.5] object-contain opacity-60 mix-blend-multiply lg:opacity-100"
          style={{
            filter: "brightness(1.03) contrast(1.25)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent), linear-gradient(to bottom, transparent, #000 5%, #000 95%, transparent)",
            maskImage:
              "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent), linear-gradient(to bottom, transparent, #000 5%, #000 95%, transparent)",
            WebkitMaskComposite: "source-in",
            maskComposite: "intersect",
          }}
        />
      </div>

      <div className="relative z-10 h-full">{children}</div>
    </div>
  </section>
);
}