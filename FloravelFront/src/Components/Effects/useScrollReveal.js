// Revela os elementos .sr e .sr-group da landing quando eles entram na tela.
// Os estilos ficam em index.css ("EFEITOS DA LANDING PAGE").
import { useEffect } from "react";

export default function useScrollReveal(rootRef) {
  useEffect(() => {
    const items = rootRef.current.querySelectorAll(".sr, .sr-group");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-sr-in", "");
          observer.unobserve(entry.target);
        });
      },
      // Threshold 0: blocos mais altos que a tela (comum no celular) também aparecem
      { rootMargin: "0px 0px -8% 0px" }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [rootRef]);
}
