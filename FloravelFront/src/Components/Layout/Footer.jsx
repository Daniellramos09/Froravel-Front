import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FloravelLogo from "../Common/FloravelLogo";
import { ShieldCheck, Heart } from "lucide-react";
import { APP_LINKS } from "../../utils/appLinks";

const redes = [
  { 
    nome: "Instagram", 
    href: "#", 
    svg: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ) 
  },
  { 
    nome: "LinkedIn", 
    href: "#", 
    svg: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ) 
  },
  { 
    nome: "WhatsApp", 
    href: "#", 
    svg: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ) 
  },
];

const secoes = [
  ["Espaço da Mãe", "inicio"],
  ["A Jornada", "jornada"],
  ["Recursos", "recursos"],
  ["Para Psicólogos", "psicologos"],
  ["Florável Corporate", "corporate"],
  ["Impacto ESG", "esg"],
  ["Depoimentos", "depoimentos"],
  ["Contato", "contato"]
];

const ferramentas = [
  { label: "🌸 Espaço da Mãe", url: APP_LINKS.mae, isExternal: true },
  { label: "🩺 Portal do Terapeuta", url: APP_LINKS.terapeuta, isExternal: true },
  { label: "🏢 Dashboard RH Corporativo", url: "/dashboard-rh", isExternal: false },
  { label: "Triagem Edimburgo", url: "/#jornada", isExternal: false },
  { label: "Diário Emocional", url: "/#recursos", isExternal: false },
  { label: "Rodas Comunitárias", url: "/#jornada", isExternal: false },
];

const juridico = [
  ["Privacidade (LGPD)", "#"],
  ["Termos de Uso", "#"],
  ["Ética Clínica & CFP", "#"],
  ["Relatórios de Impacto ESG", "#"]
];

export default function Footer() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const goTo = (id) => (e) => {
    e.preventDefault();
    if (pathname !== "/") {
      return navigate("/", { state: { scrollTo: id } });
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#FCF7F9] text-[#294D33] border-t border-[#E8A9BB]/40 font-sans overflow-hidden">
      
      {/* Flor decorativa branca no canto inferior esquerdo */}
      <img
        src="/img/fotoFlores/flor1-removebg-preview.png"
        alt=""
        aria-hidden="true"
          className="pointer-events-none absolute bottom-0 -left-35 -ml-10 w-44 sm:w-60 lg:w-120 opacity-60 select-none drop-shadow-xs z-0 transition-all duration-300"      />

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#E8A9BB]/30">
          
          {/* Coluna 1: Marca & Propósito */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <FloravelLogo />
            <p className="text-sm text-[#3A443E] leading-relaxed max-w-sm font-normal">
              Maternidade real sem julgamentos. Um ecossistema de apoio emocional contínuo, triagem especializada e acolhimento clínico no seu próprio ritmo.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#294D33]">
              <ShieldCheck size={16} />
              <span>Plataforma em estrita conformidade com a LGPD e ética CFP</span>
            </div>
            <div className="pt-2 flex items-center gap-3">
              {redes.map((r) => (
                <a 
                  key={r.nome}
                  href={r.href} 
                  className="w-9 h-9 rounded-full bg-white border border-[#E8A9BB]/50 flex items-center justify-center text-[#516B55] hover:text-[#294D33] hover:border-[#294D33] transition shadow-xs"
                  aria-label={r.nome}
                >
                  {r.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Coluna 2: Navegação Rápida */}
          <div className="text-left space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#294D33] font-nunito">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {secoes.map(([label, id]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={goTo(id)}
                    className="text-[#516B55] hover:text-[#294D33] transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3: Ferramentas & B2B */}
          <div className="text-left space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#294D33] font-nunito">
              Ecossistema
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {ferramentas.map((item) => (
                <li key={item.label}>
                  {item.isExternal ? (
                    <a
                      href={item.url}
                      className="text-[#516B55] hover:text-[#294D33] font-medium transition-colors inline-flex items-center gap-1"
                    >
                      <span>{item.label}</span>
                    </a>
                  ) : (
                    <Link
                      to={item.url}
                      className="text-[#516B55] hover:text-[#294D33] transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 4: Legal & Suporte */}
          <div className="text-left space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#294D33] font-nunito">
              Transparência
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {juridico.map(([label, path]) => (
                <li key={label}>
                  <a
                    href={path}
                    className="text-[#516B55] hover:text-[#294D33] transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="pt-2 text-xs text-[#516B55]">
              <p className="font-semibold text-[#294D33]">Em crise emocional?</p>
              <p>Ligue 188 (CVV - 24h gratuito)</p>
            </div>
          </div>

        </div>

        {/* Rodapé inferior */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#516B55] font-normal">
          <p>© {new Date().getFullYear()} Florável Saúde Materna. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1.5">
            Feito com rigor clínico e afeto para mulheres reais.
          </p>
        </div>

      </div>
    </footer>
  );
}
