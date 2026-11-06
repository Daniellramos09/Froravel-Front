// Move um elemento devagar enquanto a página rola, dentro da moldura que o contém.
// O elemento precisa ser maior que a moldura para as bordas nunca aparecerem.
import { useEffect, useRef } from "react";
import { useAccessibility } from "../Accessibility/AccessibilityContext";

export default function useParallax(strength = 0.07) {
  const ref = useRef(null);
  const { reducedMotion } = useAccessibility();

  useEffect(() => {
    const el = ref.current;
    const frame = el.parentElement;

    if (reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.transform = "";
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const { top, height } = frame.getBoundingClientRect();
      const vh = window.innerHeight;
      // -1 quando a moldura está saindo por cima, 1 quando está entrando por baixo
      const progress = Math.max(-1, Math.min(1, (top + height / 2 - vh / 2) / (vh / 2 + height / 2)));
      el.style.transform = `translate3d(0, ${(progress * strength * height).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    // Só acompanha a rolagem enquanto a moldura estiver na tela
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
      } else {
        window.removeEventListener("scroll", onScroll);
      }
    });
    observer.observe(frame);
    window.addEventListener("resize", onScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion, strength]);

  return ref;
}
