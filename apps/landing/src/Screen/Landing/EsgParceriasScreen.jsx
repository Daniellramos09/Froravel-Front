import React, { useState } from "react";
import { 
  HeartHandshake, 
  GraduationCap, 
  Award, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Building
} from "lucide-react";
import { BotanicalBranch, MaternalLineArt } from "../../Components/Common/BotanicalDecor";

const modelosParceria = [
  {
    icon: Award,
    title: "Patrocínio ao Fundo de Acolhimento",
    badge: "Selo Marca Apoiadora",
    description:
      "Marcas de produtos para gestantes e puérperas financiam pacotes de consultas gratuitas para mulheres em vulnerabilidade socioeconômica, recebendo o selo oficial de Marca Apoiadora da Maternidade Real e menções institucionais éticas na plataforma.",
    beneficios: [
      "Selo oficial de sustentabilidade materna ESG",
      "Relatórios de impacto com vidas transformadas",
      "Presença ética e de autoridade na plataforma"
    ]
  },
  {
    icon: GraduationCap,
    title: "Parcerias Acadêmicas e Clínicas-Escola",
    badge: "Cooperação Científica",
    description:
      "Acordos de cooperação técnica com universidades e faculdades para validação científica de metodologias, pesquisas sobre a Escala de Edimburgo e encaminhamento supervisionado de pacientes.",
    beneficios: [
      "Validação científica contínua das metodologias",
      "Supervisão clínica para estagiários de pós-graduação",
      "Co-publicação de artigos e estudos de caso"
    ]
  }
];

export default function EsgParceriasScreen() {
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    cargo: "",
    organizacao: "",
    email: "",
    tipoParceria: "Patrocínio ao Fundo de Acolhimento",
    mensagem: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <section id="esg" className="relative py-24 sm:py-32 bg-white overflow-hidden border-t border-[#F4C4D4]/30">
      
      {/* Detalhes botânicos e grafismo de silhueta */}
      <div className="absolute top-10 left-6 pointer-events-none opacity-40">
        <BotanicalBranch variant="sage" size={140} />
      </div>
      <div className="absolute bottom-10 right-6 pointer-events-none opacity-30 hidden lg:block">
        <MaternalLineArt size={220} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        
        {/* Cabeçalho da Seção */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#27272A] leading-tight">
            Parcerias de Impacto Social.
          </h2>

          <p className="mt-4 text-xl font-light text-[#73937E] font-display italic">
            Como marcas e instituições financiam o acesso de mães em vulnerabilidade socioeconômica.
          </p>

          <p className="mt-4 text-base text-[#52525B] leading-relaxed font-body">
            A saúde mental materna é um indicador crítico de sustentabilidade humana. Através de alianças éticas, unimos empresas conscientes e a academia para democratizar o acolhimento a quem mais precisa.
          </p>
        </div>

        {/* Modelos de Parceria em Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {modelosParceria.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-3xl bg-[#FAFAF9] p-8 sm:p-10 border border-gray-100 hover:border-[#73937E]/40 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#EBF3EE] text-[#73937E] flex items-center justify-center">
                      <Icon size={28} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-white border border-[#F4C4D4] text-[#C96E82]">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-medium text-[#27272A] mb-3">
                    {item.title}
                  </h3>

                  <p className="text-sm text-[#52525B] leading-relaxed font-body mb-6">
                    {item.description}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-gray-200/60">
                    {item.beneficios.map((b, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-[#27272A]">
                        <CheckCircle2 size={16} className="text-[#73937E] flex-shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <span className="text-xs font-semibold text-[#73937E] flex items-center gap-1.5">
                    <Sparkles size={14} /> Fundo de Acolhimento Auditado
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================
            FORMULÁRIO DE CONTATO COMERCIAL (BLOCO SIMPLIFICADO ESG)
        ======================================================== */}
        <div className="rounded-3xl bg-gradient-to-br from-[#FAFAF9] via-white to-[#FDF2F5] p-8 sm:p-12 border border-[#F4C4D4]/60 shadow-lg relative">
          
          <div className="max-w-2xl mb-10 text-left">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C96E82]">
              Canal de Parcerias Institucionais
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-medium text-[#27272A] mt-2">
              Proponha uma aliança com a Florável
            </h3>
            <p className="text-sm text-[#52525B] mt-2 leading-relaxed">
              Exclusivo para diretores de sustentabilidade (ESG), marcas de cuidados materno-infantis, universidades e organizações do terceiro setor.
            </p>
          </div>

          {!formSent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#27272A] mb-1.5">
                    Seu Nome Completo
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Dra. Mariana Costa"
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm focus:border-[#73937E] focus:ring-2 focus:ring-[#73937E]/20 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#27272A] mb-1.5">
                    Cargo / Função
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    placeholder="Ex: Diretora de Sustentabilidade / ESG"
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm focus:border-[#73937E] focus:ring-2 focus:ring-[#73937E]/20 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#27272A] mb-1.5">
                    Marca, Empresa ou Universidade
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.organizacao}
                    onChange={(e) => setFormData({ ...formData, organizacao: e.target.value })}
                    placeholder="Nome da Organização"
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm focus:border-[#73937E] focus:ring-2 focus:ring-[#73937E]/20 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#27272A] mb-1.5">
                    E-mail Institucional
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contato@empresa.com.br"
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm focus:border-[#73937E] focus:ring-2 focus:ring-[#73937E]/20 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#27272A] mb-1.5">
                  Modalidade de Parceria de Interesse
                </label>
                <select
                  value={formData.tipoParceria}
                  onChange={(e) => setFormData({ ...formData, tipoParceria: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm focus:border-[#73937E] focus:ring-2 focus:ring-[#73937E]/20 focus:outline-none transition"
                >
                  <option>Patrocínio ao Fundo de Acolhimento (Bolsas de Consulta)</option>
                  <option>Parceria Acadêmica / Validação Científica (Universidade)</option>
                  <option>Ação de Co-Branding Ético de Conscientização</option>
                  <option>Outra colaboração institucional</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#27272A] mb-1.5">
                  Breve descrição da proposta ou dúvida
                </label>
                <textarea
                  rows={4}
                  value={formData.mensagem}
                  onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                  placeholder="Conte-nos como sua organização gostaria de colaborar com a saúde materna..."
                  className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm focus:border-[#73937E] focus:ring-2 focus:ring-[#73937E]/20 focus:outline-none transition resize-none"
                />
              </div>

              <div className="pt-2 flex justify-start">
                <button
                  type="submit"
                  className="inline-flex items-center gap-3 rounded-full bg-[#2F3A36] hover:bg-[#1F3224] text-white px-9 py-4 text-sm font-semibold shadow-md transition-all duration-300 hover:scale-[1.02]"
                >
                  <span>Enviar proposta comercial de parceria</span>
                  <Send size={16} />
                </button>
              </div>
            </form>
          ) : (
            <div className="p-8 rounded-2xl bg-white border border-[#73937E]/30 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#EBF3EE] text-[#73937E] flex items-center justify-center">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="font-display text-2xl font-medium text-[#27272A]">
                Proposta enviada com sucesso!
              </h4>
              <p className="text-sm text-[#52525B] max-w-md mx-auto">
                Agradecemos pelo compromisso com o impacto social na maternidade. Nossa diretoria de parcerias e ESG responderá em até 48 horas úteis.
              </p>
              <button
                onClick={() => setFormSent(false)}
                className="text-xs font-semibold text-[#73937E] hover:underline pt-2"
              >
                Enviar nova mensagem
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
