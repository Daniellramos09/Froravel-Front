import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, Volume2, VolumeX, ArrowUpRight } from "lucide-react";
import FloravelLogo from "../../../Components/Common/FloravelLogo";
import { useAccessibility } from "../../../Components/Accessibility/AccessibilityContext";
import AccessibilityModal from "../../../Components/Accessibility/AccessibilityModal";
import { APP_LINKS } from "../../../utils/appLinks";

const NAV_ITEMS = [
  { label: "Início", id: "orionix-hero" },
  { label: "Proposta", id: "orionix-manifesto" },
  { label: "Jornada", id: "orionix-jornada" },
  { label: "Pilares", id: "orionix-pilares" },
  { label: "Psicólogos", id: "orionix-psicologos" },
  { label: "Empresas", id: "orionix-corporativo" },
  { label: "Propósito", id: "orionix-proposito" },
  { label: "FAQ", id: "orionix-faq" },
];

export default function OrionixNavbar({ onOpenTriagem }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  const {
    isSpeaking,
    readPageOverview,
    fontScaleIndex,
    fontScaleText,
  } = useAccessibility();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setPortalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToSection = (id) => (e) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "py-2.5 bg-[#F9F8F6]/92 backdrop-blur-md border-b border-[#294D33]/8"
            : "py-4 bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1560px] px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-4">
          {/* Left: Clean Brand Identity with Generous Breathing Room */}
          <a
            href="#orionix-hero"
            onClick={scrollToSection("orionix-hero")}
            className="flex items-center gap-2.5 group focus-visible:outline-none shrink-0"
            aria-label="Florável — Ir para o topo"
          >
            <FloravelLogo />
          </a>

          {/* Center: Orionix Minimal Pill Navigation */}
          <nav
            aria-label="Navegação principal"
            className="hidden xl:flex items-center gap-0.5 rounded-full bg-white/92 backdrop-blur-md px-2 py-1.5 border border-[#294D33]/8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(41,77,51,0.08)] shrink-0"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={scrollToSection(item.id)}
                className="px-3 py-1.5 rounded-full text-xs font-medium text-[#3A443E] hover:text-[#294D33] hover:bg-[#F4DDE5]/55 transition-colors whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right: Actions & Portals */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Screen reader button */}
            <button
              type="button"
              onClick={readPageOverview}
              className={`hidden md:flex w-9 h-9 rounded-full items-center justify-center border transition cursor-pointer shrink-0 ${
                isSpeaking
                  ? "bg-[#294D33] text-white border-[#294D33]"
                  : "bg-white text-[#294D33] border-[#294D33]/12 hover:bg-[#F4DDE5]/40"
              }`}
              title={isSpeaking ? "Parar leitura da página" : "Ouvir resumo da página"}
              aria-label={isSpeaking ? "Parar leitura da página" : "Ouvir resumo da página"}
            >
              {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>

            {/* Accessibility Modal Trigger */}
            <button
              type="button"
              onClick={() => setIsAccessModalOpen(true)}
              className="hidden md:flex w-9 h-9 rounded-full bg-white text-[#294D33] border border-[#294D33]/12 hover:bg-[#F4DDE5]/40 items-center justify-center text-xs font-semibold transition cursor-pointer relative shrink-0"
              title={`Acessibilidade (${fontScaleText})`}
              aria-label="Abrir opções de acessibilidade"
            >
              <span>Aa</span>
              {fontScaleIndex !== 1 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#D98A9C]" />
              )}
            </button>

            {/* Portals Dropdown */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setPortalOpen((prev) => !prev)}
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#294D33] text-xs font-semibold border border-[#294D33]/12 shadow-2xs hover:border-[#294D33]/30 transition cursor-pointer whitespace-nowrap"
                aria-expanded={portalOpen}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#D98A9C]" />
                <span>Portais</span>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${portalOpen ? "rotate-180" : ""}`}
                />
              </button>

              {portalOpen && (
                <div className="absolute right-0 mt-2 w-76 rounded-3xl bg-white p-2.5 shadow-[0_24px_48px_-12px_rgba(20,20,20,0.14)] border border-[#294D33]/10 text-left z-50 space-y-1">
                  <div className="px-3 py-1.5 border-b border-stone-100">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#516B55]">
                      Ambientes da Plataforma
                    </p>
                  </div>
                  <Link
                    to="/login?perfil=mae"
                    onClick={() => setPortalOpen(false)}
                    className="flex items-start justify-between gap-2 p-2.5 rounded-2xl hover:bg-[#F9F8F6] transition group"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#294D33]">Espaço da Mãe</p>
                      <p className="text-[11px] text-[#516B55] mt-0.5">
                        Diário emocional, triagem EPDS, pausa e rede de apoio
                      </p>
                    </div>
                    <ArrowUpRight size={14} className="text-[#6E9473] shrink-0 mt-0.5" />
                  </Link>
                  <Link
                    to="/login?perfil=terapeuta"
                    onClick={() => setPortalOpen(false)}
                    className="flex items-start justify-between gap-2 p-2.5 rounded-2xl hover:bg-[#F9F8F6] transition group"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#294D33]">Portal do Terapeuta</p>
                      <p className="text-[11px] text-[#516B55] mt-0.5">
                        Gestão clínica perinatal, agenda e rodas de conversa
                      </p>
                    </div>
                    <ArrowUpRight size={14} className="text-[#6E9473] shrink-0 mt-0.5" />
                  </Link>
                  <Link
                    to="/login?perfil=rh"
                    onClick={() => setPortalOpen(false)}
                    className="flex items-start justify-between gap-2 p-2.5 rounded-2xl hover:bg-[#F9F8F6] transition group"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#294D33]">Florável Corporativo (RH)</p>
                      <p className="text-[11px] text-[#516B55] mt-0.5">
                        Indicadores agregados de bem-estar materno e LGPD
                      </p>
                    </div>
                    <ArrowUpRight size={14} className="text-[#6E9473] shrink-0 mt-0.5" />
                  </Link>
                  <div className="pt-1 border-t border-stone-100">
                    <Link
                      to="/"
                      onClick={() => setPortalOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F9F8F6] text-xs font-medium text-[#516B55] hover:text-[#294D33] transition"
                    >
                      <span>Comparar com Versão Clássica (/)</span>
                      <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Orionix Primary Pill Button */}
            <button
              type="button"
              onClick={onOpenTriagem}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-[#294D33] hover:bg-[#1E3926] text-[#FCF7F9] text-xs font-semibold tracking-wide transition-all duration-300 shadow-[0_4px_14px_rgba(41,77,51,0.22)] cursor-pointer whitespace-nowrap shrink-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#D98A9C] shrink-0" />
              <span>Começar acolhimento</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="xl:hidden w-10 h-10 rounded-full bg-white border border-[#294D33]/12 flex items-center justify-center text-[#294D33] cursor-pointer shrink-0"
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="xl:hidden mx-4 mt-2 rounded-3xl bg-white p-5 shadow-2xl border border-[#294D33]/10 space-y-4">
            <div className="grid grid-cols-2 gap-1.5">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={scrollToSection(item.id)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-[#294D33] hover:bg-[#F4DDE5]/50 transition"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={APP_LINKS.mae}
                  className="px-3 py-2 rounded-xl bg-[#F9F8F6] text-center text-[11px] font-semibold text-[#294D33]"
                >
                  Espaço da Mãe
                </a>
                <a
                  href={APP_LINKS.terapeuta}
                  className="px-3 py-2 rounded-xl bg-[#F9F8F6] text-center text-[11px] font-semibold text-[#294D33]"
                >
                  Terapeuta
                </a>
                <a
                  href={APP_LINKS.rh}
                  className="px-3 py-2 rounded-xl bg-[#F9F8F6] text-center text-[11px] font-semibold text-[#294D33]"
                >
                  Portal RH
                </a>
              </div>
              <Link
                to="/"
                className="w-full py-2 text-center text-xs font-medium text-[#516B55] hover:text-[#294D33]"
              >
                Alternar para a versão clássica (/)
              </Link>
            </div>
          </div>
        )}
      </header>

      <AccessibilityModal
        isOpen={isAccessModalOpen}
        onClose={() => setIsAccessModalOpen(false)}
      />
    </>
  );
}
