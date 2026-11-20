import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import SmoothScroll from '../Effects/SmoothScroll';
import { useAccessibility } from '../Accessibility/AccessibilityContext';
import FloatingAccessibilityButton from '../Accessibility/FloatingAccessibilityButton';

export default function Layout({ children }) {
  const { getFilterStyle, fontScale, reducedMotion, readingGuide } = useAccessibility();
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    if (!readingGuide) return;
    const handleMouseMove = (e) => setMouseY(e.clientY);
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [readingGuide]);

  return (
    <SmoothScroll>
      <div 
        className={`flex flex-col min-h-screen bg-[#FCF7F9] text-[#294D33] transition-all duration-300 ${getFilterStyle()} ${reducedMotion ? 'reduce-motion' : ''}`}
        style={{ fontSize: `${fontScale * 100}%` }}
      >
        {/* Régua de Leitura Visual (Linha Guia para Foco) */}
        {readingGuide && (
          <div 
            className="pointer-events-none fixed left-0 right-0 h-12 bg-[#F4DDE5]/40 border-y-2 border-[#E8A9BB] z-[9990] transition-all duration-75 shadow-sm"
            style={{ top: `${mouseY - 24}px` }}
          />
        )}
        
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />

        {/* Botão Flutuante Circular Grande no Canto Inferior Direito */}
        <FloatingAccessibilityButton />
      </div>
    </SmoothScroll>
  );
}
