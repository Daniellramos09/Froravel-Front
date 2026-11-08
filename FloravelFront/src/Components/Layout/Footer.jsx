import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FloravelLogo from "../Common/FloravelLogo";
import { APP_LINKS } from "../../utils/appLinks";

const redes = [
  { 
    nome: "Instagram", 
    href: "#"
  },
  { 
    nome: "LinkedIn", 
    href: "#"
  },
  { 
    nome: "WhatsApp", 
    href: "#"
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
  { label: "Espaço da Mãe", url: APP_LINKS.mae, isExternal: true },
  { label: "Portal do Terapeuta", url: APP_LINKS.terapeuta, isExternal: true },
  { label: "Dashboard RH Corporativo", url: APP_LINKS.rh, isExternal: true },
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
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#E8A9BB]/30">
          
          {/* Coluna 1: Marca & Propósito */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <FloravelLogo />
            <p className="text-sm text-[#3A443E] leading-relaxed max-w-sm font-normal">
              Maternidade real sem julgamentos. Um ecossistema de apoio emocional contínuo, triagem especializada e acolhimento clínico no seu próprio ritmo.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#294D33]">
              <span>Plataforma em estrita conformidade com a LGPD e ética CFP</span>
            </div>
            <div className="pt-2 flex items-center gap-3">
              {redes.map((r) => (
                <a 
                  key={r.nome}
                  href={r.href} 
                  className="text-xs font-semibold text-[#516B55] hover:text-[#294D33] transition-colors"
                >
                  {r.nome}
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
