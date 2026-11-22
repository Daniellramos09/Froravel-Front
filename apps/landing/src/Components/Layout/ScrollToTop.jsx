import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, state, hash } = useLocation();

  useLayoutEffect(() => {
    if (state?.scrollTo || hash) return;

    const resetScroll = () => {
      if (window.__floravelLenis) {
        window.__floravelLenis.scrollTo(0, { immediate: true, force: true });
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();
    const rafId = requestAnimationFrame(resetScroll);
    return () => cancelAnimationFrame(rafId);
  }, [pathname, state, hash]);

  return null;
}
