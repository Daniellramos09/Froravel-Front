// src/Components/HeroVideo/HeroVideo.jsx
import { useEffect, useRef, useState } from "react";
import Petalas from "../Petalas/Petalas";

// true  = o vídeo tem fundo claro (como o da flor): o fundo some e o degradê rosa da página aparece
// false = vídeo em tela cheia normal (como o aquarela da mulher e da árvore)
const FUNDO_CLARO = false;

// 1 = tela cheia | 0.9 = afasta um pouco | 0.85 = afasta bem | 0.8 = bem mais afastado
const ZOOM = 0.85;

// Véu claro atrás do texto. A HomeScreen já tem o dela, então fica desligado aqui
const VEU = false;

// Bordas do vídeo somem suavemente quando ele é afastado (ZOOM < 1)
const mascara =
  "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent), linear-gradient(to bottom, transparent, #000 8%, #000 92%, transparent)";

const ajuste =
  ZOOM < 1
    ? {
      transform: `scale(${ZOOM})`,
      WebkitMaskImage: mascara,
      maskImage: mascara,
      WebkitMaskComposite: "source-in",
      maskComposite: "intersect",
    }
    : {};

export default function HeroVideo({ background, children }) {
  const videoRef = useRef(null);

  // Quem prefere menos movimento ou usa "economia de dados" vê só a imagem
  const [semVideo] = useState(
    () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      navigator.connection?.saveData === true
  );
  const [ehMobile] = useState(() => window.matchMedia("(max-width: 767px)").matches);

  // Pausa o vídeo quando sai da tela (economiza bateria e processamento)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? v.play().catch(() => { }) : v.pause()),
      { threshold: 0.1 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const estilo = FUNDO_CLARO ? "mix-blend-multiply" : "";
  const filtro = FUNDO_CLARO ? { filter: "brightness(1.03) contrast(1.25)" } : undefined;
  const estiloMidia = { ...filtro, ...ajuste };

  return (
    <section
      className="relative h-[clamp(740px,max(100vh,56.25vw),900px)] overflow-hidden"
      style={{ "--p": 0 }}
    >
      {background}

      {semVideo ? (
        <img
          src="/video/hero-poster.webp"
          alt=""
          className={`absolute inset-0 h-full w-full object-cover ${estilo}`}
          style={estiloMidia}
        />
      ) : (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover ${estilo}`}
          style={estiloMidia}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/video/hero-poster.webp"
          aria-hidden="true"
          tabIndex={-1}
        >
          {ehMobile ? (
            <source src="/video/hero-mobile.mp4" type="video/mp4" />
          ) : (
            <>
             
              
              <source src="/video/VideoLadingPage.mp4" type="video/mp4" />
              <source src="/video/hero.mp4" type="video/mp4" />
            </>
          )}
        </video>
      )}

      {VEU && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#fdf4ee]/85 via-[#fdf4ee]/40 to-transparent" />
      )}

      {/* Pétalas: ficam entre o vídeo e o texto */}
      <Petalas />

      {/* Degradê no pé do vídeo: termina exatamente na cor da seção seguinte */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#fbf1ee] via-[#fbf1ee]/70 to-transparent" />

      <div className="relative z-10 h-full">{children}</div>
    </section>
  );
}