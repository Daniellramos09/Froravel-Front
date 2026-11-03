import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import FloravelLogo from "../Common/FloravelLogo";

const navLinks = [
  { label: "Espaço da Mãe", id: "inicio" },
  { label: "A Jornada", id: "jornada" },
  { label: "Recursos", id: "recursos" },
  { label: "Para Psicólogos", id: "psicologos" },
  { label: "Corporate (B2B)", id: "corporate" },
  { label: "Impacto ESG", id: "esg" },
  { label: "Depoimentos", id: "depoimentos" },
];

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState("inicio");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
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
    <header 
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-[#FCF7F9]/92 backdrop-blur-md shadow-xs border-b border-[#E8A9BB]/30 py-3.5" 
          : "bg-gradient-to-b from-[#FCF7F9]/95 via-[#FCF7F9]/85 to-transparent py-5"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Logotipo */}
        <a 
          href="#inicio" 
          onClick={goTo("inicio")}
          className="group transition-transform duration-300 hover:scale-[1.02]"
        >
          <FloravelLogo />
        </a>

        {/* Navegação Desktop em Pílula Flutuante Glassmorphism */}
        <nav className="hidden items-center gap-1 lg:flex rounded-full bg-white/80 px-4 py-1.5 shadow-xs border border-[#E8A9BB]/40 backdrop-blur-md">
          {navLinks.map(({ label, id }) => {
            const isActive = pathname === "/" && active === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={goTo(id)}
                className={`relative px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-300 font-sans ${
                  isActive
                    ? "bg-[#F4DDE5] text-[#294D33] shadow-xs"
                    : "text-[#516B55] hover:text-[#294D33] hover:bg-[#F4DDE5]/40"
                }`}
              >
                {label}
              </a>
            );
          })}
        </nav>

        {/* Ações Direitas */}
        <div className="hidden sm:flex items-center gap-3">
          <Link 
            to="/dashboard-rh" 
            className="text-xs font-semibold uppercase tracking-wider px-3.5 py-2 rounded-full text-[#294D33] hover:bg-[#F4DDE5] transition-colors font-sans"
            title="Acesso exclusivo para RHs parceiros"
          >
            Painel RH
          </Link>
          <Link 
            to="/login" 
            className="text-xs font-semibold uppercase tracking-wider text-[#516B55] hover:text-[#294D33] transition-colors px-2.5 py-1 font-sans"
          >
            Entrar
          </Link>
          <a
            href="#inicio"
            onClick={goTo("inicio")}
            className="inline-flex items-center gap-2 rounded-full bg-[#294D33] hover:bg-[#1f3c27] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FCF7F9] shadow-sm transition-all duration-300 hover:scale-105 font-sans"
          >
            <span>Autoavaliação</span>
            <ArrowRight size={14} />
          </a>
        </div>

        {/* Botão Menu Mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#294D33] hover:bg-[#F4DDE5] rounded-xl transition"
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FCF7F9] border-b border-[#E8A9BB]/40 px-6 py-6 shadow-xl space-y-4">
          <nav className="flex flex-col space-y-2 text-left">
            {navLinks.map(({ label, id }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={goTo(id)}
                className="py-2.5 px-4 text-sm font-semibold uppercase tracking-wider text-[#294D33] hover:bg-[#F4DDE5] rounded-xl transition font-sans"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="pt-4 border-t border-[#E8A9BB]/30 flex flex-col gap-3">
            <Link
              to="/dashboard-rh"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-4 text-center text-xs font-semibold uppercase tracking-wider text-[#294D33] bg-[#F4DDE5] rounded-full font-sans"
            >
              Painel RH Corporativo
            </Link>
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 text-xs font-semibold uppercase tracking-wider text-[#294D33] border border-[#E8A9BB] rounded-full font-sans"
              >
                Entrar
              </Link>
              <a
                href="#inicio"
                onClick={goTo("inicio")}
                className="flex-1 text-center py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FCF7F9] bg-[#294D33] rounded-full shadow-md font-sans"
              >
                Autoavaliação
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
