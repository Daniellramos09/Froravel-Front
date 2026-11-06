// Barra fina no topo que mostra o quanto da página já foi lido.
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      barRef.current.style.transform = `scaleX(${progress})`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Portal: os filtros de acessibilidade do Layout quebrariam o position: fixed aqui dentro
  return createPortal(
    <div
      ref={barRef}
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-[#E8A9BB] to-[#A8435F] pointer-events-none"
      style={{ transform: "scaleX(0)" }}
    />,
    document.body
  );
}
