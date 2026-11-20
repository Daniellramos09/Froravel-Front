import React, { useState } from "react";
import { X } from "lucide-react";

export default function PartnershipSection() {
  const [showModal, setShowModal] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    cargo: "",
    empresa: "",
    email: "",
    modalidade: "Patrocínio ao Fundo de Acolhimento",
    mensagem: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <section id="esg" className="py-12 sm:py-16 bg-[#FCF7F9] overflow-hidden border-t border-[#E8A9BB]/30">
      
      {/* ========================================================
          BLOCO DE TRANSIÇÃO COM FUNDO IMERSIVO EM VERDE ESCURO (#294D33)
          (Alternância de blocos contrastantes da Referência 3)
      ======================================================== */}
      <div className="mx-4 md:mx-12 rounded-[3rem] bg-[#294D33] text-[#FCF7F9] py-16 px-6 sm:px-12 lg:px-16 shadow-2xl relative overflow-hidden">
        {/* Luz ambiente interna suave */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#E8A9BB]/15 blur-[100px]" 
        />
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#516B55]/30 blur-[100px]" 
        />

        <div className="relative z-10 max-w-6xl mx-auto text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Lado Esquerdo: Mensagem e Impacto */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[3.25rem] font-normal text-[#FCF7F9] leading-[1.14]">
                Conectando marcas com impacto real na maternidade.
              </h2>

              <p className="text-base sm:text-lg text-white/80 leading-relaxed font-sans font-normal">
                Marcas conscientes financiam o <strong className="font-semibold text-white">Fundo de Acolhimento Florável</strong>: consultas gratuitas com psicólogas perinatais para mães em vulnerabilidade.
              </p>

              {/* Indicadores Visuais de Impacto */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                  <p className="font-serif text-3xl font-normal text-[#E8A9BB]">+1.200</p>
                  <p className="text-xs text-white/80 font-sans mt-0.5">Acolhimentos financiados este ano</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                  <p className="font-serif text-3xl font-normal text-[#E8A9BB]">100%</p>
                  <p className="text-xs text-white/80 font-sans mt-0.5">Transparência em relatórios ESG</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowModal(true)}
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#E8A9BB] hover:bg-[#F4DDE5] text-[#294D33] px-8 py-4 text-base font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                >
                  <span>Seja uma empresa parceira</span>
                </button>
              </div>
            </div>

            {/* Lado Direito: Os 2 Pilares em Cards Escuros Refinados */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/15 hover:border-white/30 transition-all">
                <div className="flex items-center gap-3 mb-2.5">
                  <div>
                    <h3 className="font-serif text-lg font-normal text-white">Fundo de Acolhimento Social</h3>
                    <p className="text-xs text-[#E8A9BB]">Acesso Universal</p>
                  </div>
                </div>
                <p className="text-xs text-white/75 leading-relaxed font-sans">
                  Sua empresa custeia sessões para mães que não podem pagar, com selo de governança e impacto medido.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/15 hover:border-white/30 transition-all">
                <div className="flex items-center gap-3 mb-2.5">
                  <div>
                    <h3 className="font-serif text-lg font-normal text-white">Bolsas em Saúde Perinatal</h3>
                    <p className="text-xs text-[#E8A9BB]">Formação e Capacitação</p>
                  </div>
                </div>
                <p className="text-xs text-white/75 leading-relaxed font-sans">
                  Certificações para psicólogas de regiões periféricas atenderem voluntariamente suas comunidades.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* MODAL DE CONTATO ESG */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-[#FCF7F9] rounded-[2rem] p-6 sm:p-8 shadow-2xl border border-[#E8A9BB]/60 text-left">
            <button
              onClick={() => { setShowModal(false); setFormSent(false); }}
              className="absolute top-5 right-5 text-[#516B55] hover:text-[#294D33] hover:bg-[#F4DDE5] p-2 rounded-full transition"
            >
              <X size={20} />
            </button>

            {!formSent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#294D33]">
                    Alianças com Propósito
                  </span>
                  <h3 className="font-serif text-2xl font-normal text-[#294D33] mt-1">
                    Parceria Institucional ESG
                  </h3>
                  <p className="text-xs text-[#3A443E] mt-1 font-sans">
                    Nossa diretoria entrará em contato com a apresentação completa do Fundo de Acolhimento.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#294D33] mb-1">Seu Nome</label>
                  <input
                    required
                    type="text"
                    placeholder="Nome completo"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-[#E8A9BB]/60 bg-white text-sm focus:border-[#294D33] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#294D33] mb-1">Empresa</label>
                    <input
                      required
                      type="text"
                      placeholder="Organização"
                      value={formData.empresa}
                      onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-[#E8A9BB]/60 bg-white text-sm focus:border-[#294D33] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#294D33] mb-1">E-mail</label>
                    <input
                      required
                      type="email"
                      placeholder="contato@empresa.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-[#E8A9BB]/60 bg-white text-sm focus:border-[#294D33] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#294D33] text-white text-sm font-semibold hover:bg-[#1f3c27] shadow-md transition mt-2 cursor-pointer"
                >
                  Enviar interesse em apoiar
                </button>
              </form>
            ) : (
              <div className="text-center py-6">
                <h3 className="font-serif text-2xl font-normal text-[#294D33] mb-2">
                  Contato registrado!
                </h3>
                <p className="text-sm text-[#3A443E] leading-relaxed mb-6 font-sans">
                  Agradecemos seu compromisso com a saúde materna. Entraremos em contato com o dossiê de impacto social.
                </p>
                <button
                  onClick={() => { setShowModal(false); setFormSent(false); }}
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
