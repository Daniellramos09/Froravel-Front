// src/Components/Effects/SmoothScroll.jsx
// Suavização cinematográfica de rolagem (Lenis Momentum Scroll)
// Efeito de deslizar suave pelo site, eliminando rolagem seca.
import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useAccessibility } from "../Accessibility/AccessibilityContext";

export default function SmoothScroll({ children }) {
  const { reducedMotion } = useAccessibility();
  const lenisRef = useRef(null);

  useEffect(() => {
    // Respeita acessibilidade caso usuário escolha redução de movimento
    if (reducedMotion) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    // Inicializa Lenis com curva exponencial de deslize suave (momentum glide)
    // syncTouch: true garante resposta tátil nativa e imediata no mobile touch
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.0,
      syncTouch: true,
      infinite: false,
    });

    lenisRef.current = lenis;

    let rafId = null;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Deslize suave cinematográfico ao clicar em links âncora (#jornada, #pilares, etc.)
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href*="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;

      const hash = href.substring(hashIndex);
      if (hash.length <= 1) return;

      // Se for um link interno da mesma página
      const isInternal =
        anchor.pathname === window.location.pathname ||
        href.startsWith("#") ||
        anchor.origin === window.location.origin;

      if (isInternal) {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement, {
            offset: -50,
            duration: 1.35,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      if (rafId) cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
