import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Volume2, VolumeX, ChevronDown } from "lucide-react";
import FloravelLogo from "../Common/FloravelLogo";
import { useAccessibility } from "../Accessibility/AccessibilityContext";


const navLinks = [
  { label: "Espaço da Mãe", id: "inicio" },
  { label: "Pilares", id: "pilares" },
  { label: "Jornada", id: "jornada" },
  { label: "Recursos", id: "recursos" },
  { label: "Psicólogos", id: "psicologos" },
  { label: "Corporate", id: "corporate" },
  { label: "Propósito", id: "proposito" },
  { label: "Depoimentos", id: "depoimentos" },
];

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState("inicio");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setPortalDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {
    isSpeaking,
    readPageOverview,
    fontScaleIndex,
    fontScaleText,
    increaseFontSize,
    decreaseFontSize,
    openAccessibilityModal,
  } = useAccessibility();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    const els = navLinks.map(({ id }) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  const goTo = (id) => (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (pathname !== "/") {
      return navigate("/", { state: { scrollTo: id } });
    }
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header 
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-[#FCF7F9]/94 backdrop-blur-md shadow-xs border-b border-[#E8A9BB]/30 py-2.5 sm:py-3" 
            : "bg-transparent py-3 sm:py-4"
        }`}
      >
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-3 sm:px-6 lg:px-8 gap-2 sm:gap-4">
          
          {/* ========================================================
              1. LOGOTIPO OFICIAL FLORÁVEL (COM FOTO LOGO.PNG)
          ======================================================== */}
          <a 
            href="#inicio" 
            onClick={goTo("inicio")}
            className="group flex items-center transition-transform duration-300 hover:scale-[1.02] shrink-0"
            aria-label="Florável - Página Inicial"
          >
            <FloravelLogo />
          </a>

          {/* ========================================================
              2. NAVEGAÇÃO CENTRAL EDITORIAL (PÍLULA COMPACTA E ELEGANTE)
          ======================================================== */}
          <nav className="liquid-glass hidden xl:flex items-center gap-0.5 lg:gap-1 rounded-full px-2.5 py-1.5 shrink-0">
            {navLinks.map(({ label, id }) => {
              const isActive = pathname === "/" && active === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={goTo(id)}
                  className={`relative px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-[#F4DDE5] text-[#294D33] font-bold shadow-2xs"
                      : "text-[#516B55] hover:text-[#294D33] hover:bg-[#F4DDE5]/50"
                  }`}
                >
                  {label}
                </a>
              );
            })}
          </nav>

          {/* ========================================================
              3. GRUPO DE AÇÕES & ACESSIBILIDADE À DIREITA (NUNCA CORTA)
          ======================================================== */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
{/* MENU DROPDOWN DE CONEXÃO DIRETA COM OS 3 PORTAIS */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4DDE5] hover:bg-[#E8A9BB]/60 text-[#294D33] text-xs font-bold border border-[#E8A9BB]/60 transition shadow-2xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33]"
                aria-expanded={portalDropdownOpen}
                aria-label="Abrir menu de acesso aos portais da plataforma"
              >
                <span>Acessar Portais</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${portalDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Menu Suspenso dos 3 Portais Integrados */}
              {portalDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-xl border border-stone-100 p-2.5 z-50 animate-fadeIn text-left space-y-1">
                  <div className="px-3 py-1.5 border-b border-stone-100 mb-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Escolha seu ambiente de acesso
                    </p>
                  </div>

                  {/* 1. Espaço da Mãe */}
                  <Link
                    to="/login?perfil=mae"
                    onClick={() => setPortalDropdownOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-[#FCF7F9] transition group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[#294D33] group-hover:text-[#1e3c27]">
                          Espaço da Mãe
                        </p>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                          Ativo
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 leading-tight mt-0.5">
                        Diário emocional, triagem EPDS, rodas e rede de apoio solidária
                      </p>
                    </div>
                  </Link>

                  {/* 2. Portal do Terapeuta */}
                  <Link
                    to="/login?perfil=terapeuta"
                    onClick={() => setPortalDropdownOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-[#FCF7F9] transition group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[#294D33] group-hover:text-[#1e3c27]">
                          Portal do Terapeuta
                        </p>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                          Clínico
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 leading-tight mt-0.5">
                        Agenda clínica, mães atendidas e sala de acolhimento
                      </p>
                    </div>
                  </Link>

                  {/* 3. Dashboard RH Corporativo */}
                  <Link
                    to="/login?perfil=rh"
                    onClick={() => setPortalDropdownOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-[#FCF7F9] transition group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[#294D33] group-hover:text-[#1e3c27]">
                          Dashboard RH
                        </p>
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-md">
                          B2B
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 leading-tight mt-0.5">
                        Gestão de licenças, relatórios de saúde e faturamento
                      </p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* LINK ENTRAR / LOGIN */}
            <Link 
              to="/login" 
              className="liquid-button inline-flex rounded-full px-4 py-2 md:px-4 md:py-1.5 text-xs font-bold text-[#294D33] transition-colors font-sans whitespace-nowrap"
            >
              Entrar
            </Link>

            {/* BOTÃO CTA AUTOAVALIAÇÃO */}
            <a
              href="#inicio"
              onClick={goTo("inicio")}
              className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-[#294D33] hover:bg-[#1f3c27] px-5 py-2 text-xs font-bold text-[#FCF7F9] shadow-sm transition-all duration-200 hover:scale-[1.03] active:scale-95 font-sans whitespace-nowrap cursor-pointer shrink-0"
            >
              <span>Autoavaliação</span>
            </a>

            {/* BOTÃO MENU MOBILE (HAMBÚRGUER) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-[#294D33] hover:bg-[#F4DDE5] rounded-xl transition cursor-pointer shrink-0 ml-0.5"
              aria-label={mobileMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>

        {/* ========================================================
            4. MENU MOBILE DROPDOWN COM CONTROLES DE ACESSIBILIDADE
        ======================================================== */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-3 max-h-[calc(100dvh-4.5rem)] overflow-y-auto bg-[#FCF7F9] border-b border-[#E8A9BB]/40 px-5 py-5 shadow-xl space-y-4 animate-fadeIn">

            {/* Ações principais: primeiro item do menu, sem precisar rolar */}
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="liquid-button flex-1 text-center py-3 text-sm font-bold text-[#294D33] rounded-full"
              >
                Entrar
              </Link>
              <a
                href="#inicio"
                onClick={goTo("inicio")}
                className="flex-1 text-center py-3 text-sm font-bold text-white bg-[#294D33] rounded-full shadow-md"
              >
                Autoavaliação
              </a>
            </div>

            {/* Barra de Acessibilidade no Mobile */}
            <div className="liquid-chip rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#294D33] flex items-center gap-1.5">
                Acessibilidade
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={readPageOverview}
                  className="p-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-white text-stone-700"
                  aria-label={isSpeaking ? "Parar leitura de voz" : "Ouvir audiodescrição da página"}
                >
                  {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <button
                  type="button"
                  onClick={decreaseFontSize}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border border-stone-200 bg-stone-50 hover:bg-white text-stone-700"
                  aria-label="Diminuir fonte"
                >
                  A-
                </button>
                <span className="text-xs font-bold text-stone-600">{fontScaleText}</span>
                <button
                  type="button"
                  onClick={increaseFontSize}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border border-stone-200 bg-stone-50 hover:bg-white text-stone-700"
                  aria-label="Aumentar fonte"
                >
                  A+
                </button>
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); openAccessibilityModal(); }}
                  className="text-xs font-bold px-3 py-1 bg-[#F4DDE5] text-[#294D33] rounded-lg border border-[#E8A9BB]/40 ml-1"
                >
                  Opções
                </button>
              </div>
            </div>

            {/* Links de Seções */}
            <nav className="flex flex-col space-y-1 text-left">
              {navLinks.map(({ label, id }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={goTo(id)}
                  className="py-2.5 px-3 text-sm font-semibold text-[#294D33] hover:bg-[#F4DDE5] rounded-xl transition flex items-center justify-between"
                >
                  <span>{label}</span>
                </a>
              ))}
            </nav>

            {/* Ações Mobile - Acesso aos 3 Portais Integrados */}
            <div className="pt-3 border-t border-[#E8A9BB]/30 flex flex-col gap-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 text-left px-1">
                Acessar Plataformas:
              </p>

              <Link
                to="/login?perfil=mae"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-4 text-left text-xs font-bold text-[#294D33] bg-[#FCE7F0] rounded-xl flex items-center justify-between"
              >
                <span>Espaço da Mãe</span>
                <span className="text-[10px] text-emerald-800 font-semibold">Acessar</span>
              </Link>

              <Link
                to="/login?perfil=terapeuta"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-4 text-left text-xs font-bold text-[#294D33] bg-[#EBF3EE] rounded-xl flex items-center justify-between"
              >
                <span>Portal do Terapeuta</span>
                <span className="text-[10px] text-emerald-800 font-semibold">Acessar</span>
              </Link>

              <Link
                to="/login?perfil=rh"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-4 text-left text-xs font-bold text-[#294D33] bg-[#FDF4E7] rounded-xl flex items-center justify-between"
              >
                <span>Dashboard RH Corporativo</span>
                <span className="text-[10px] text-amber-800 font-semibold">Acessar</span>
              </Link>
            </div>

          </div>
        )}
      </header>


    </>
  );
}
