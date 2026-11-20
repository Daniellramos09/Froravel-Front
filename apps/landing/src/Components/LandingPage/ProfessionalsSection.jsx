import React, { useState } from "react";
import { X, Check, ArrowRight, ShieldCheck, Star, Calendar, HeartHandshake, Percent, Sparkles } from "lucide-react";
import { APP_LINKS } from "../../utils/appLinks";

export default function ProfessionalsSection() {
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    crp: "",
    whatsapp: "",
    email: "",
    foco: "Psicologia Perinatal e Pós-Parto",
    faixaPreco: "R$ 40 a R$ 80 (com vagas sociais)",
    aceitaSocial: true,
  });

  // 4 Pilares atualizados com os preços e modelo da Florável:
  // - Apenas 5% retido pela plataforma (95% repassado ao psicólogo)
  // - Consultas de R$ 40 a R$ 200 (valores flexíveis)
  // - Vagas sociais prioritárias a R$ 40 para mães sem condições
  // - Captação humanizada via Rodas de Conversa
  const pillars = [
    {
      title: "Apenas 5% de Taxa",
      badge: "95% de Repasse Líquido",
      desc: "Sem mensalidades fixas pesadas: a Florável retém apenas 5% para manutenção e infraestrutura, repassando 95% diretamente a você.",
      highlight: "Repasse de 95%"
    },
    {
      title: "Sessões de R$ 40 a R$ 200",
      badge: "Honorários Flexíveis",
      desc: "Defina o valor da sua consulta com autonomia, entre R$ 40 e R$ 200 por atendimento, respeitando seu momento profissional.",
      highlight: "Flexibilidade Total"
    },
    {
      title: "Clínica Social a R$ 40",
      badge: "Prioridade Humanizada",
      desc: "Prioridade para psicólogos que oferecem vagas a R$ 40, permitindo que mães sem condições financeiras tenham escuta especializada.",
      highlight: "Impacto Direto"
    },
    {
      title: "Vitrine Ética & Rodas",
      badge: "Conversão Natural",
      desc: "Conduza Rodas de Conversa temáticas gratuitas na plataforma e atraia novas pacientes particulares com base em confiança real.",
      highlight: "Sem Comercialismo"
    }
  ];

  const specialists = [
    {
      nome: "Dra. Mariana Costa",
      crp: "CRP 06/14829",
      esp: "Depressão Pós-Parto & Ansiedade",
      foto: "/img/fotopsicologo/psicologa1.jpg",
      rating: "5.0",
      avaliacoes: "48",
      faixa: "R$ 40 a R$ 90",
      socialBadge: "Vagas Sociais a R$ 40"
    },
    {
      nome: "Dra. Beatriz Albuquerque",
      crp: "CRP 06/18921",
      esp: "Luto Parental & Tentantes",
      foto: "/img/fotopsicologo/psicologa2.jpg",
      rating: "5.0",
      avaliacoes: "36",
      faixa: "R$ 60 a R$ 140",
      socialBadge: "Vagas Sociais Ativas"
    },
    {
      nome: "Dra. Camila Nogueira",
      crp: "CRP 06/20144",
      esp: "Transição de Carreira & Puerpério",
      foto: "/img/fotopsicologo/psicologia4.jpg",
      rating: "4.9",
      avaliacoes: "42",
      faixa: "R$ 50 a R$ 120",
      socialBadge: "Vagas Sociais a R$ 40"
    }
  ];

  return (
    <section 
      id="psicologos" 
      className="relative py-24 sm:py-32 bg-[#EBF1ED] overflow-hidden border-t border-[#516B55]/20"
    >
      {/* Luz ambiente de transição */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/2 left-1/4 w-[42rem] h-[42rem] rounded-full bg-white/40 blur-[140px] -z-10" 
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 w-full">
        
        {/* ========================================================
            CABEÇALHO EDITORIAL COM O NOVO MODELO DE PRECIFICAÇÃO
        ======================================================== */}
        <div className="sr-group max-w-3xl mb-16 sm:mb-20 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#516B55]/30 shadow-xs mb-4">
            <span className="w-2 h-2 rounded-full bg-[#294D33]" />
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#294D33] font-sans">
              Para Psicólogos e Terapeutas &bull; Modelo Justo & Social
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[3.25rem] font-normal text-[#294D33] leading-[1.12] tracking-[-0.015em]">
            Clínica com propósito.{" "}
            <span className="italic font-serif text-[#516B55]">
              Conecte-se a quem precisa da sua escuta.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#3A443E] leading-relaxed font-sans font-normal max-w-2xl">
            Feita para a psicologia perinatal: honorários flexíveis de <strong className="text-[#294D33]">R$ 40 a R$ 200</strong>, apenas <strong className="text-[#294D33]">5% de taxa da plataforma</strong> e vagas sociais prioritárias a <strong className="text-[#294D33]">R$ 40</strong> para mães sem condições financeiras.
          </p>
        </div>

        {/* ========================================================
            SPLIT LAYOUT: COLUNA ESQUERDA (4 CARDS) + DIREITA (MOCKUP FLUTUANTE)
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
                        <span className="text-[10px] font-semibold text-[#516B55] bg-white/70 px-2 py-0.5 rounded-md border border-[#516B55]/15">
                          {item.highlight}
                        </span>
                      </div>

                      <h3 className="font-serif text-xl font-normal text-[#294D33] mb-1.5">
                        {item.title}
                      </h3>

                      <p className="text-xs text-[#3A443E] leading-relaxed font-sans">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-[#E8A9BB]/30 flex items-center justify-between text-[11px] font-semibold text-[#516B55]">
                      <span>Transparência total</span>
                      <span className="text-[#294D33]">95% para você</span>
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
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
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

                {/* BADGE DE PREÇO / CLÍNICA SOCIAL */}
                <div className="liquid-glass absolute top-3 right-3 px-2.5 py-1.5 rounded-full flex items-center gap-1">
                  <span className="text-[10px] font-bold text-[#294D33]">Social: R$ 40</span>
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
                    <Star size={12} className="fill-[#294D33] text-[#294D33]" />
                    <span className="text-xs font-bold text-[#294D33]">5.0</span>
                    <span className="text-[10px] text-[#516B55]">(48)</span>
                  </div>
                </div>

                {/* Faixa de Atendimento & Repasse Transparente */}
                <div className="p-2.5 rounded-2xl bg-[#FCF7F9] border border-[#E8A9BB]/40 flex items-center justify-between text-xs font-semibold text-[#294D33]">
                  <span>Consulta: R$ 40 a R$ 90</span>
                  <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    95% de repasse
                  </span>
                </div>

                <p className="text-xs text-[#3A443E] leading-relaxed font-sans">
                  Atendimento especializado para depressão pós-parto, ansiedade na gestação, luto parental e retorno ao trabalho.
                </p>

                {/* Selos de Especialização */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-[#EBF1ED] text-[#294D33] border border-[#516B55]/20">
                    Saúde Perinatal (USP)
                  </span>
                  <span className="liquid-chip text-[10px] font-semibold px-2.5 py-1 rounded-lg text-[#294D33]">
                    Triagem EPDS
                  </span>
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Vagas Sociais (R$ 40)
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <p className="text-xs uppercase tracking-wider font-semibold text-[#294D33] font-sans">
              Rede Ativa de Psicólogas Perinatais Credenciadas
            </p>
            <span className="text-xs text-[#516B55] font-sans">
              Atendimentos de R$ 40 a R$ 200 &bull; Preferência para mães sem condições a R$ 40
            </span>
          </div>

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
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-[#294D33] truncate font-nunito">{sp.nome}</h5>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {sp.faixa}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#516B55] truncate font-sans">{sp.esp}</p>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-[#294D33]">
                    <span>{sp.crp} &bull; ⭐ {sp.rating}</span>
                    <span className="text-[#516B55] font-semibold">{sp.socialBadge}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================================
          MODAL DE CADASTRO DE PROFISSIONAL PARCEIRO COM PREÇOS ATUALIZADOS
      ======================================================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#294D33]/40 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-[#FCF7F9] rounded-[2rem] p-6 sm:p-8 shadow-2xl border border-[#E8A9BB]/60 overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setShowModal(false); setSubmitted(false); }}
              className="absolute top-5 right-5 text-[#516B55] hover:text-[#294D33] hover:bg-[#F4DDE5] p-2 rounded-full transition cursor-pointer"
              aria-label="Fechar modal"
            >
              <X size={20} />
            </button>

            {!submitted ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-4 text-left font-sans"
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#294D33]">
                    Credenciamento Clínico &bull; Apenas 5% de taxa
                  </span>
                  <h3 className="font-serif text-2xl font-normal text-[#294D33] mt-1">
                    Candidatura de Psicólogo Parceiro
                  </h3>
                  <p className="text-xs text-[#3A443E] mt-1 font-sans">
                    Atenda com <strong className="font-semibold text-[#294D33]">95% de repasse líquido</strong> (Florável retém apenas 5%). Você define seus honorários entre <strong className="font-semibold text-[#294D33]">R$ 40 e R$ 200</strong> por sessão.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#294D33] mb-1">Nome Completo</label>
                  <input
                    required
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
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
                      value={formData.crp}
                      onChange={(e) => setFormData({ ...formData, crp: e.target.value })}
                      placeholder="06/000000"
                      className="w-full px-4 py-3 rounded-2xl border border-[#E8A9BB]/60 bg-white text-sm focus:border-[#294D33] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#294D33] mb-1">WhatsApp</label>
                    <input
                      required
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="psi@exemplo.com"
                    className="w-full px-4 py-3 rounded-2xl border border-[#E8A9BB]/60 bg-white text-sm focus:border-[#294D33] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#294D33] mb-1">Faixa de Honorários Desejada (por sessão)</label>
                  <select 
                    value={formData.faixaPreco}
                    onChange={(e) => setFormData({ ...formData, faixaPreco: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-[#E8A9BB]/60 bg-white text-sm focus:border-[#294D33] focus:outline-none"
                  >
                    <option value="R$ 40 (Clínica Social Exclusiva)">R$ 40 (Clínica Social Exclusiva - 95% repasse = R$ 38)</option>
                    <option value="R$ 40 a R$ 80 (com vagas sociais)">R$ 40 a R$ 80 (com vagas sociais ativas)</option>
                    <option value="R$ 80 a R$ 130">R$ 80 a R$ 130 (com vagas sociais ativas)</option>
                    <option value="R$ 130 a R$ 200">R$ 130 a R$ 200 (consultas particulares)</option>
                  </select>
                </div>

                {/* Checkbox de Adesão à Clínica Social */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#E8A9BB]/60 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="aceitaSocial"
                    checked={formData.aceitaSocial}
                    onChange={(e) => setFormData({ ...formData, aceitaSocial: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded text-[#294D33] focus:ring-[#294D33] cursor-pointer"
                  />
                  <label htmlFor="aceitaSocial" className="text-xs text-[#3A443E] cursor-pointer">
                    <strong className="text-[#294D33] font-semibold">Quero disponibilizar vagas sociais a R$ 40:</strong> Tenho interesse em receber preferência no encaminhamento de mães em vulnerabilidade que não têm condições de pagar o valor integral.
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#294D33] mb-1">Foco de Atuação</label>
                  <select 
                    value={formData.foco}
                    onChange={(e) => setFormData({ ...formData, foco: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-[#E8A9BB]/60 bg-white text-sm focus:border-[#294D33] focus:outline-none"
                  >
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
              <div className="text-center py-6 font-sans">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-4">
                  <Check size={24} />
                </div>
                <h3 className="font-serif text-2xl font-normal text-[#294D33] mb-2">
                  Candidatura recebida!
                </h3>
                <p className="text-sm text-[#3A443E] leading-relaxed mb-6 font-sans">
                  Nossa equipe de curadoria clínica entrará em contato em até 48 horas úteis via WhatsApp para validar seu CRP e apresentar o painel de atendimento (com repasse de 95% e configuração das suas vagas de R$ 40 a R$ 200).
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
