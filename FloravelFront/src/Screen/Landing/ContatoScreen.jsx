import React, { useState } from "react";
import { Send, PhoneCall, CheckCircle2, MessageCircle, Heart, Mail } from "lucide-react";

export default function ContatoScreen() {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ nome: "", email: "", mensagem: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contato" className="relative py-24 sm:py-32 bg-[#FCF7F9] overflow-hidden border-t border-[#E8A9BB]/30">
      
      {/* Luz ambiente difusa */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-10 right-10 w-[38rem] h-[38rem] rounded-full bg-[#F4DDE5]/30 blur-[130px] -z-10" 
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Coluna Esquerda: Texto e Apoio */}
          <div className="sr-group lg:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4DDE5] border border-[#E8A9BB]/50 shadow-xs">
              <MessageCircle size={13} className="text-[#294D33]" />
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#294D33] font-sans">
                Canal Aberto &bull; Escuta Humanizada
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[3.25rem] font-normal text-[#294D33] leading-[1.12] tracking-[-0.015em]">
              Estamos aqui para te ouvir.{" "}
              <span className="italic font-serif text-[#E8A9BB] block">
                Sem pressa, com afeto.
              </span>
            </h2>

            <p className="text-base text-[#3A443E] leading-relaxed font-sans font-normal">
              Escreva para a nossa equipe. Seja para tirar dúvidas sobre a plataforma, sugerir temas para as Rodas de Conversa ou propor parcerias institucionais.
            </p>

            {/* Aviso de Apoio Imediato CVV 188 */}
            <div className="p-5 rounded-2xl bg-white border border-[#E8A9BB]/60 flex items-start gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#F4DDE5] text-[#294D33] flex items-center justify-center flex-shrink-0 mt-0.5">
                <PhoneCall size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#294D33] uppercase tracking-wider mb-1 font-nunito">
                  Precisa de apoio emocional urgente?
                </p>
                <p className="text-xs text-[#3A443E] leading-relaxed font-sans">
                  Se você estiver passando por um momento de crise intensa agora, ligue gratuitamente para o <strong>CVV (Centro de Valorização da Vida)</strong> pelo telefone <strong>188</strong> (atendimento sigiloso 24h em todo o Brasil).
                </p>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Formulário de Contato com Estilo Refinado */}
          <div className="sr lg:col-span-7" style={{ "--sr-i": 1 }}>
            <div className="rounded-[2.5rem] bg-white p-8 sm:p-11 border border-[#E8A9BB] shadow-lg shadow-[#294D33]/5 text-left">
              {!sent ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="contato-nome" className="block text-xs font-semibold text-[#294D33] mb-1.5 font-sans">Seu Nome</label>
                    <input
                      required
                      id="contato-nome"
                      name="nome"
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="Como você prefere ser chamada?"
                      className="w-full px-4 py-3.5 rounded-2xl border border-[#E8A9BB]/60 bg-[#FCF7F9] text-sm focus:border-[#294D33] focus:bg-white focus:outline-none transition font-sans"
                    />
                  </div>

                  <div>
                    <label htmlFor="contato-email" className="block text-xs font-semibold text-[#294D33] mb-1.5 font-sans">Seu E-mail</label>
                    <input
                      required
                      id="contato-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="seuemail@exemplo.com"
                      className="w-full px-4 py-3.5 rounded-2xl border border-[#E8A9BB]/60 bg-[#FCF7F9] text-sm focus:border-[#294D33] focus:bg-white focus:outline-none transition font-sans"
                    />
                  </div>

                  <div>
                    <label htmlFor="contato-mensagem" className="block text-xs font-semibold text-[#294D33] mb-1.5 font-sans">Sua Mensagem</label>
                    <textarea
                      required
                      id="contato-mensagem"
                      name="mensagem"
                      rows={4}
                      value={formData.mensagem}
                      onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                      placeholder="Conte para a gente como podemos te acolher..."
                      className="w-full px-4 py-3.5 rounded-2xl border border-[#E8A9BB]/60 bg-[#FCF7F9] text-sm focus:border-[#294D33] focus:bg-white focus:outline-none transition resize-none font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-[#294D33] hover:bg-[#1f3c27] text-[#FCF7F9] text-sm font-semibold shadow-md transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2 mt-2 cursor-pointer font-sans"
                  >
                    <span>Enviar mensagem com carinho</span>
                    <Send size={16} />
                  </button>
                </form>
              ) : (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#F4DDE5] text-[#294D33] flex items-center justify-center">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="font-serif text-2xl font-normal text-[#294D33]">
                    Mensagem recebida com afeto!
                  </h3>
                  <p className="text-sm text-[#3A443E] max-w-sm mx-auto font-sans">
                    Nossa equipe lê cada mensagem com carinho e responderá ao seu e-mail o mais breve possível.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="text-xs font-semibold text-[#294D33] hover:underline pt-2 cursor-pointer font-sans"
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
