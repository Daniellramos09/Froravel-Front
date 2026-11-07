import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import FlowerScroll from "../../Components/FlowerScroll/FlowerScroll";

// Fundo degradê suave conectando com a paleta
const fundo = (
  <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FDF2F5] to-[#FAFAF9]">
    <div className="drift absolute -left-32 top-[10%] h-[55vh] w-[55vh] rounded-full bg-[#F4C4D4]/30 blur-3xl" />
    <div className="drift-rev absolute -right-32 bottom-[5%] h-[55vh] w-[55vh] rounded-full bg-[#EBF3EE]/60 blur-3xl" />
  </div>
);

// Aparece quando a flor já está quase toda aberta (--p vai de 0 a 1 conforme o scroll)
const conteudo = (
  <div
    className="font-body flex h-full flex-col items-center justify-end px-6 pb-14 text-center text-[#27272A]"
    style={{
      "--t": "clamp(0, calc((var(--p) - 0.55) * 4), 1)",
      opacity: "var(--t)",
      transform: "translateY(calc((1 - var(--t)) * 24px))",
    }}
  >
    <h2 className="font-display text-[clamp(2rem,3.6vw,3.2rem)] font-medium leading-tight text-[#27272A]">
      Cada sentimento seu <span className="italic text-[#73937E]">importa.</span>
    </h2>
    <p className="mt-2 max-w-md text-[#52525B] text-base">
      Quando você estiver pronta, a Florável está aqui, acolhendo cada etapa do seu caminho.
    </p>
    <Link
      to="/cadastro"
      className="mt-6 inline-flex rounded-full bg-[#2F3A36] hover:bg-[#1F3224] px-10 py-4 text-white text-base font-semibold shadow-lg shadow-[#2F3A36]/20 transition-all duration-300 hover:scale-105"
    >
      Começar agora gratuitamente
    </Link>
  </div>
);

export default function FlorFinal() {
  const ref = useRef(null);
  const [perto, setPerto] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { 
          setPerto(true); 
          io.disconnect(); 
        }
      },
      { rootMargin: "1200px 0px" }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {perto ? (
        <FlowerScroll background={fundo}>{conteudo}</FlowerScroll>
      ) : (
        <div className="h-[250vh] bg-gradient-to-b from-white to-[#FAFAF9]" />
      )}
    </div>
  );
}
