import React, { useState } from "react";
import { X } from "lucide-react";
import { APP_LINKS } from "../../utils/appLinks";

export default function ProfessionalsSection() {
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 4 Diferenciais em cards brancos #FCF7F9
  const pillars = [
    {
      title: "R$ 29,90 Fixos",
      badge: "100% de Repasse",
      desc: "Sem comissão por consulta: o valor das sessões particulares fica com você."
    },
    {
      title: "Vitrine Ética",
      badge: "Captação via Rodas",
      desc: "Conduza Rodas de Conversa temáticas e atraia novos pacientes naturalmente."
    },
    {
      title: "Selos de Especialização",
      badge: "Badges de Autoridade",
      desc: "Certificados em saúde perinatal validados, com destaque prioritário na plataforma."
    },
    {
      title: "Programa de Flores",
      badge: "Recompensas por Engajamento",
      desc: "Pontualidade, assiduidade e boas avaliações viram isenção de mensalidade e benefícios."
    }
  ];

  const specialists = [
    {
      nome: "Dra. Mariana Costa",
      crp: "CRP 06/14829",
      esp: "Depressão Pós-Parto & Ansiedade",
      foto: "/img/fotopsicologo/psicologa1.jpg",
      rating: "5.0",
      avaliacoes: "48"
    },
    {
      nome: "Dra. Beatriz Albuquerque",
      crp: "CRP 06/18921",
      esp: "Luto Parental & Tentantes",
      foto: "/img/fotopsicologo/psicologa2.jpg",
      rating: "5.0",
      avaliacoes: "36"
    },
    {
      nome: "Dra. Camila Nogueira",
      crp: "CRP 06/20144",
      esp: "Transição de Carreira & Puerpério",
      foto: "/img/fotopsicologo/psicologia4.jpg",
      rating: "4.9",
      avaliacoes: "42"
    }
  ];

  return (
    <section 
      id="psicologos" 
      className="relative py-24 sm:py-32 bg-[#EBF1ED] overflow-hidden border-t border-[#516B55]/20"
    >
      {/* ========================================================
          FOTOS DE FLORES LIVRES (SEM MOLDURA, SOLTAS NA SEÇÃO VERDE SÁLVIA)
      ======================================================== */}
      <img
        src="/img/fotoFlores/flor4-removebg-preview.png"
        alt=""
        aria-hidden="true"
        className="flor-sway-b pointer-events-none absolute -top-12 -right-8 sm:-right-4 w-44 sm:w-60 lg:w-72 opacity-85 select-none drop-shadow-sm rotate-12 z-0"
      />

      <img
        src="/img/fotoFlores/flor5-removebg-preview.png"
        alt=""
        aria-hidden="true"
        className="flor-sway-c pointer-events-none absolute -bottom-5 -left-5 w-44 sm:w-60 opacity-60 select-none drop-shadow-xs -rotate-12 z-0 scale-70"
      />

      {/* Luz ambiente de transição */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/2 left-1/4 w-[42rem] h-[42rem] rounded-full bg-white/40 blur-[140px] -z-10" 
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 w-full">
        
        {/* ========================================================
            CABEÇALHO EDITORIAL
        ======================================================== */}
        <div className="sr-group max-w-3xl mb-16 sm:mb-20 text-left">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[3.25rem] font-normal text-[#294D33] leading-[1.12] tracking-[-0.015em]">
            Clínica com propósito.{" "}
            <span className="italic font-serif text-[#516B55]">
              Conecte-se a quem precisa da sua escuta.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#3A443E] leading-relaxed font-sans font-normal max-w-2xl">
            Feita para a psicologia perinatal: honorários justos, repasse integral e pacientes reais.
          </p>
        </div>

        {/* ========================================================
            SPLIT LAYOUT: COLUNA ESQUERDA (4 CARDS BRANCOS) + DIREITA (MOCKUP FLUTUANTE)
        ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center mb-16">
          
          {/* COLUNA DA ESQUERDA: GRADE DE 4 DIFERENCIAIS EM CARDS BRANCOS #FCF7F9 */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="sr-group grid grid-cols-1 sm:grid-cols-2 gap-5">
              {pillars.map((item) => {
                return (
                  <div
                    key={item.title}
                    className="rounded-3xl bg-[#FCF7F9] border border-white/80 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="liquid-chip text-[10px] font-bold text-[#294D33] px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {item.badge}
                        </span>
                      </div>

                      <h3 className="font-serif text-xl font-normal text-[#294D33] mb-1.5">
                        {item.title}
                      </h3>

                      <p className="text-xs text-[#3A443E] leading-relaxed font-sans">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-[#E8A9BB]/30 flex items-center gap-1.5 text-[11px] font-semibold text-[#516B55]">
                      <span>Transparência total</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* BOTÃO DE CTA PARA PARCEIROS */}
            <div className="sr pt-2">
              <button
                onClick={() => setShowModal(true)}
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#294D33] hover:bg-[#1f3c27] text-[#FCF7F9] px-8 py-4 text-sm font-semibold uppercase tracking-wider shadow-md shadow-[#294D33]/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <span>Quero ser um profissional parceiro</span>
              </button>
            </div>
          </div>

          {/* COLUNA DA DIREITA: MOCKUP FLUTUANTE COM SOMBRAS PROFUNDAS (SHADOW-2XL) */}
          <div className="sr lg:col-span-5 relative flex justify-center" style={{ "--sr-i": 1 }}>
            
            <div className="w-full max-w-[400px] rounded-[2.5rem] bg-white p-6 sm:p-7 shadow-2xl shadow-[#294D33]/25 border border-white text-left relative overflow-hidden transition-transform duration-500 hover:-translate-y-1">
              
              {/* Foto Real com Cantos Editoriais */}
              <div className="relative w-full aspect-[4/4.3] rounded-3xl overflow-hidden bg-[#FCF7F9] mb-5 border border-stone-100 shadow-xs">
                <img
                  src="/img/fotopsicologo/psicologa1.jpg"
                  alt="Dra. Mariana Costa, Psicóloga Perinatal Verificada"
                  className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/img/dra-mariana-psicologa.jpg";
                  }}
                />
                
                {/* SELO FLUTUANTE CRP ATIVO VERIFICADO */}
                <div className="absolute top-3 left-3 backdrop-blur-md bg-white/95 px-3 py-1.5 rounded-full border border-[#294D33]/20 flex items-center gap-1.5 shadow-sm">
                  <span className="text-[11px] font-bold text-[#294D33] font-nunito tracking-wide">
                    CRP Ativo &bull; 06/14829
                  </span>
                </div>

                {/* BADGE DO PROGRAMA DE FLORES */}
                <div className="liquid-glass absolute top-3 right-3 px-2.5 py-1.5 rounded-full flex items-center gap-1">
                  <span className="text-[11px] font-bold text-[#294D33]">4 Flores</span>
                </div>
              </div>

              {/* Informações da Profissional */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-2xl font-normal text-[#294D33] leading-tight">
                      Dra. Mariana Costa
                    </h4>
                    <p className="text-xs text-[#516B55] font-semibold uppercase tracking-wider mt-0.5">
                      Psicóloga Perinatal &bull; USP
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-[#F4DDE5] px-2.5 py-1 rounded-full border border-[#E8A9BB]/50">
                    <span className="text-xs font-bold text-[#294D33]">5.0</span>
                    <span className="text-[10px] text-[#516B55]">(48)</span>
                  </div>
                </div>

                <p className="text-xs text-[#3A443E] leading-relaxed font-sans">
                  Depressão pós-parto, ansiedade na gestação, luto parental e retorno ao trabalho.
                </p>

                {/* Selos de Especialização */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-[#EBF1ED] text-[#294D33] border border-[#516B55]/20">
                    Saúde Perinatal (USP)
                  </span>
                  <span className="liquid-chip text-[10px] font-semibold px-2.5 py-1 rounded-lg text-[#294D33]">
                    Triagem EPDS
                  </span>
                  <span className="liquid-chip text-[10px] font-semibold px-2.5 py-1 rounded-lg text-[#294D33]">
                    Luto Materno
                  </span>
                </div>

                {/* Botões de Ação do Card */}
                <div className="pt-2 space-y-2">
                  <a
                    href={APP_LINKS.terapeuta}
                    className="w-full py-3.5 rounded-full bg-[#294D33] hover:bg-[#1f3c27] text-[#FCF7F9] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                  >
                    <span>Acessar Portal do Terapeuta</span>
                  </a>

                  <button 
                    onClick={() => setShowModal(true)}
                    className="w-full py-2.5 rounded-full bg-white hover:bg-[#F4DDE5]/40 text-[#294D33] border border-[#516B55]/30 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <span>Fazer novo credenciamento</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* VITRINE VISUAL DE PSICÓLOGAS DA REDE */}
        <div className="sr pt-8 border-t border-[#516B55]/25 text-left">
          <p className="text-xs uppercase tracking-wider font-semibold text-[#294D33] mb-5 font-sans">
            Rede Ativa de Psicólogas Perinatais Credenciadas
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {specialists.map((sp) => (
              <div 
                key={sp.nome} 
                className="p-4 rounded-2xl bg-[#FCF7F9] border border-white/80 shadow-xs flex items-center gap-3.5"
              >
                <img 
                  src={sp.foto} 
                  alt={sp.nome} 
                  className="w-12 h-12 rounded-full object-cover border border-[#E8A9BB]" 
                />
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-[#294D33] truncate font-nunito">{sp.nome}</h5>
                  <p className="text-[10px] text-[#516B55] truncate font-sans">{sp.esp}</p>
                  <p className="text-[10px] font-semibold text-[#294D33] mt-0.5">{sp.crp} &bull; Nota {sp.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================================
          MODAL DE CADASTRO DE PROFISSIONAL PARCEIRO
      ======================================================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#294D33]/40 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-[#FCF7F9] rounded-[2rem] p-6 sm:p-8 shadow-2xl border border-[#E8A9BB]/60 overflow-hidden">
            <button
              onClick={() => { setShowModal(false); setSubmitted(false); }}
              className="absolute top-5 right-5 text-[#516B55] hover:text-[#294D33] hover:bg-[#F4DDE5] p-2 rounded-full transition"
            >
              <X size={20} />
            </button>

            {!submitted ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-4 text-left"
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#294D33]">
                    Credenciamento Clínico
                  </span>
                  <h3 className="font-serif text-2xl font-normal text-[#294D33] mt-1">
                    Candidatura de Psicólogo Parceiro
                  </h3>
                  <p className="text-xs text-[#3A443E] mt-1 font-sans">
                    Atenda com repasse integral e faça parte da rede de escuta materna Florável.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#294D33] mb-1">Nome Completo</label>
                  <input
                    required
                    type="text"
                    placeholder="Dra. Seu Nome"
                    className="w-full px-4 py-3 rounded-2xl border border-[#E8A9BB]/60 bg-white text-sm focus:border-[#294D33] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#294D33] mb-1">Registro (CRP)</label>
                    <input
                      required
                      type="text"
                      placeholder="06/000000"
                      className="w-full px-4 py-3 rounded-2xl border border-[#E8A9BB]/60 bg-white text-sm focus:border-[#294D33] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#294D33] mb-1">WhatsApp</label>
                    <input
                      required
                      type="tel"
                      placeholder="(11) 99999-9999"
                      className="w-full px-4 py-3 rounded-2xl border border-[#E8A9BB]/60 bg-white text-sm focus:border-[#294D33] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#294D33] mb-1">E-mail Profissional</label>
                  <input
                    required
                    type="email"
                    placeholder="psi@exemplo.com"
                    className="w-full px-4 py-3 rounded-2xl border border-[#E8A9BB]/60 bg-white text-sm focus:border-[#294D33] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#294D33] mb-1">Foco de Atuação</label>
                  <select className="w-full px-4 py-3 rounded-2xl border border-[#E8A9BB]/60 bg-white text-sm focus:border-[#294D33] focus:outline-none">
                    <option>Psicologia Perinatal e Pós-Parto</option>
                    <option>Depressão Pós-Parto e Ansiedade Gestacional</option>
                    <option>Luto Parental e Tentantes</option>
                    <option>Terapia de Casal e Parentalidade</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#294D33] text-[#FCF7F9] text-sm font-semibold hover:bg-[#1f3c27] shadow-md transition mt-2 cursor-pointer"
                >
                  Enviar candidatura para validação
                </button>
              </form>
            ) : (
              <div className="text-center py-6">
                <h3 className="font-serif text-2xl font-normal text-[#294D33] mb-2">
                  Candidatura recebida!
                </h3>
                <p className="text-sm text-[#3A443E] leading-relaxed mb-6 font-sans">
                  Nossa equipe de curadoria clínica entrará em contato em até 48 horas úteis via WhatsApp para validar seu CRP e apresentar o painel de atendimento.
                </p>
                <button
                  onClick={() => { setShowModal(false); setSubmitted(false); }}
                  className="py-3 px-8 rounded-full bg-[#294D33] text-white text-sm font-semibold hover:bg-[#1f3c27] transition cursor-pointer"
                >
                  Concluir
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </section>
  );
}
