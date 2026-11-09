import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { X, ShieldCheck, FileText, HeartHandshake, Award } from "lucide-react";
import FloravelLogo from "../Common/FloravelLogo";
import { APP_LINKS } from "../../utils/appLinks";

const redes = [
  { 
    nome: "Instagram", 
    href: "https://instagram.com",
    target: "_blank"
  },
  { 
    nome: "LinkedIn", 
    href: "https://linkedin.com",
    target: "_blank"
  },
  { 
    nome: "WhatsApp", 
    href: "https://api.whatsapp.com/send?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20a%20Flor%C3%A1vel.",
    target: "_blank"
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

const DOCUMENTOS_LEGAIS = {
  lgpd: {
    title: "Privacidade e Proteção de Dados (LGPD)",
    icon: ShieldCheck,
    content: [
      "A Florável cumpre integralmente os preceitos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Todos os registros do Diário Emocional e da Escala de Edimburgo (EPDS) são criptografados de ponta a ponta e acessíveis estritamente pela própria usuária.",
      "Nos planos corporativos (B2B), as empresas parceiras recebem exclusivamente dados estatísticos agregados e anonimizados. Nenhuma resposta individual, nome ou dado sensível é jamais compartilhado com empregadores ou terceiros."
    ]
  },
  termos: {
    title: "Termos de Uso da Plataforma",
    icon: FileText,
    content: [
      "A plataforma Florável é um espaço seguro de acolhimento emocional, psicoeducação e facilitação de vínculos. O uso das ferramentas de diário, triagem e rodas comunitárias é livre e voluntário.",
      "As triagens automatizadas não substituem consultas médicas ou psiquiátricas. Em caso de sofrimento intenso ou crise aguda, recomendamos acionar a rede de emergência (SAMU 192 / CVV 188)."
    ]
  },
  cfp: {
    title: "Ética Clínica e Conformidade CFP",
    icon: Award,
    content: [
      "Todos os profissionais de psicologia credenciados na Florável possuem registro ativo no Conselho Regional de Psicologia (CRP) e cadastro aprovado no e-Psi para a prestação de serviços psicológicos realizados por meios de tecnologias da informação.",
      "A atuação segue com rigor o Código de Ética Profissional do Psicólogo (Resolução CFP nº 010/2005) e a Resolução CFP nº 011/2018."
    ]
  },
  esg: {
    title: "Relatórios de Governança e Impacto Social (ESG)",
    icon: HeartHandshake,
    content: [
      "O programa Florável ESG direciona investimentos de empresas patrocinadoras para o Fundo Social de Acolhimento Materno, garantindo psicoterapia gratuita e subsídios para puérperas em situação de vulnerabilidade.",
      "Nossos indicadores de impacto são auditados e acompanhados trimestralmente, alinhados aos Objetivos de Desenvolvimento Sustentável da ONU (ODS 3 - Saúde e Bem-Estar e ODS 5 - Igualdade de Gênero)."
    ]
  }
};

export default function Footer() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [activeLegalModal, setActiveLegalModal] = useState(null);

  const goTo = (id) => (e) => {
    e.preventDefault();
    if (pathname !== "/") {
      return navigate("/", { state: { scrollTo: id } });
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#FAF8F5] text-[#294D33] border-t border-[#E8A9BB]/30 py-16 sm:py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Grade principal do Footer (4 colunas editoriais) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-14 border-b border-[#E8A9BB]/20">
          
          {/* Coluna 1: Marca & Manifesto */}
          <div className="text-left space-y-4">
            <FloravelLogo />
            <p className="text-xs sm:text-sm text-[#516B55] leading-relaxed font-sans max-w-xs">
              O espaço onde a mãe encontra acolhimento integral, escuta sem julgamentos e cuidado clínico contínuo.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {redes.map((r) => (
                <a
                  key={r.nome}
                  href={r.href}
                  target={r.target}
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#F4DDE5] text-[#294D33] flex items-center justify-center text-xs font-bold hover:bg-[#294D33] hover:text-[#FCF7F9] transition-colors"
                >
                  {r.nome[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Coluna 2: Navegação Editorial da Landing */}
          <div className="text-left space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#294D33] font-nunito">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {secoes.map(([label, id]) => (
                <li key={id}>
                  <button
                    onClick={goTo(id)}
                    className="text-[#516B55] hover:text-[#294D33] transition-colors cursor-pointer text-left"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3: Ecossistema de Portais */}
          <div className="text-left space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#294D33] font-nunito">
              Plataformas Integradas
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {ferramentas.map((item) => (
                <li key={item.label}>
                  {item.isExternal ? (
                    <a
                      href={item.url}
                      className="text-[#516B55] hover:text-[#294D33] transition-colors flex items-center gap-1.5"
                    >
                      <span>{item.label}</span>
                      <span className="text-[10px] text-emerald-800 font-semibold">↗</span>
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
              Transparência & Ética
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveLegalModal('lgpd')}
                  className="text-[#516B55] hover:text-[#294D33] transition-colors cursor-pointer"
                >
                  Privacidade (LGPD)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveLegalModal('termos')}
                  className="text-[#516B55] hover:text-[#294D33] transition-colors cursor-pointer"
                >
                  Termos de Uso
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveLegalModal('cfp')}
                  className="text-[#516B55] hover:text-[#294D33] transition-colors cursor-pointer"
                >
                  Ética Clínica & CFP
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveLegalModal('esg')}
                  className="text-[#516B55] hover:text-[#294D33] transition-colors cursor-pointer"
                >
                  Relatórios de Impacto ESG
                </button>
              </li>
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

      {/* Modal de Transparência e Documentos Legais */}
      {activeLegalModal && DOCUMENTOS_LEGAIS[activeLegalModal] && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#294D33]/40 backdrop-blur-xs animate-fadeIn"
          onClick={() => setActiveLegalModal(null)}
        >
          <div 
            className="relative w-full max-w-lg bg-[#FCF7F9] rounded-[2rem] p-6 sm:p-8 shadow-2xl border border-[#E8A9BB]/60 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveLegalModal(null)}
              className="absolute top-5 right-5 text-[#516B55] hover:text-[#294D33] hover:bg-[#F4DDE5] p-2 rounded-full transition cursor-pointer"
            >
              <X size={20} />
            </button>

            <span className="text-xs font-semibold uppercase tracking-wider text-[#294D33]">
              Transparência Florável
            </span>
            <h3 className="font-serif text-2xl font-normal text-[#294D33] mt-1 mb-4">
              {DOCUMENTOS_LEGAIS[activeLegalModal].title}
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-[#3A443E] leading-relaxed font-sans">
              {DOCUMENTOS_LEGAIS[activeLegalModal].content.map((paragrafo, idx) => (
                <p key={idx}>{paragrafo}</p>
              ))}
            </div>

            <div className="pt-6 mt-6 border-t border-[#E8A9BB]/30 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveLegalModal(null)}
                className="py-2.5 px-6 rounded-full bg-[#294D33] text-white text-xs font-semibold hover:bg-[#1f3c27] transition cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
