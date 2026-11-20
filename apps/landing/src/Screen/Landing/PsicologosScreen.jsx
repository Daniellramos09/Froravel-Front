import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  HeartHandshake, 
  PercentCircle, 
  Award, 
  Flower2, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Shield,
  HelpCircle
} from "lucide-react";
import { BotanicalBranch } from "../../Components/Common/BotanicalDecor";

const beneficiosPsicologos = [
  {
    icon: PercentCircle,
    title: "Modelo de Repasse Integral",
    badge: "Apenas 5% de taxa",
    description:
      "Taxa ética de apenas 5% para a plataforma: você define honorários entre R$ 40 e R$ 200 e fica com 95% do valor da consulta (com preferência de R$ 40 para mães sem condições).",
    details: "95% de repasse líquido diretamente para você."
  },
  {
    icon: HeartHandshake,
    title: "Vitrine de Captação Ética",
    badge: "Conversão Natural",
    description:
      "Possibilidade de conduzir Rodas de Conversa temáticas abertas. O acolhimento em grupo gera vínculo imediato e conversão natural de pacientes para atendimentos clínicos individuais.",
    details: "Autoridade construída com escuta genuína."
  },
  {
    icon: Award,
    title: "Meritocracia por Especialização",
    badge: "Selo de Autoridade",
    description:
      "Espaço no perfil para cadastrar certificados, cursos e titulações em saúde materna. Perfis certificados ganham selos de autoridade e prioridade no algoritmo de busca da plataforma.",
    details: "Destaque técnico em psicologia perinatal."
  },
  {
    icon: Flower2,
    title: "Gamificação por Impacto (Sistema de Flores)",
    badge: "Isenção & Destaque",
    description:
      "O acúmulo de pontuação através de avaliações positivas, pontualidade e participação comunitária pode ser convertido em isenção da mensalidade e destaque na vitrine.",
    details: "Seu compromisso social gera recompensas tangíveis."
  }
];

export default function PsicologosScreen() {
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="psicologos" className="relative py-24 sm:py-32 bg-white overflow-hidden border-t border-[#F4C4D4]/30">
      
      {/* Detalhes botânicos de fundo */}
      <div className="absolute top-12 left-4 pointer-events-none opacity-40">
        <BotanicalBranch variant="sage" size={130} />
      </div>
      <div className="absolute bottom-12 right-4 pointer-events-none opacity-40">
        <BotanicalBranch variant="pink" size={140} flip={true} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        
        {/* Cabeçalho da Seção */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#27272A] leading-tight">
            Clínica com propósito.{" "}
            <span className="italic text-[#73937E]">
              Conecte-se a quem precisa da sua especialidade.
            </span>
          </h2>

          <p className="mt-5 text-lg text-[#52525B] leading-relaxed font-body">
            Espaço estruturado para profissionais de psicologia perinatal expandirem seus atendimentos com ética, ferramentas dedicadas e modelo financeiro justo e sustentável.
          </p>
        </div>

        {/* Grade com os 4 Benefícios e Mecânica da Plataforma */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {beneficiosPsicologos.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group relative rounded-3xl bg-[#FAFAF9] p-8 border border-gray-100 hover:border-[#73937E]/40 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-[#EBF3EE] text-[#73937E] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon size={28} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white border border-[#F4C4D4] text-[#C96E82] shadow-xs">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-medium text-[#27272A] mb-3">
                    {item.title}
                  </h3>

                  <p className="text-sm text-[#52525B] leading-relaxed font-body mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200/60 flex items-center gap-2 text-xs font-semibold text-[#73937E]">
                  <CheckCircle2 size={16} />
                  <span>{item.details}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner com Proposta de Valor e CTA Principal */}
        <div className="rounded-3xl bg-gradient-to-r from-[#2F3A36] to-[#1F3224] p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4C4D4]">
              Transforme a Saúde Materna no Brasil
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-medium text-white leading-snug">
              Pronta para atender com liberdade clínica e repasse integral?
            </h3>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Junte-se a uma rede selecionada de psicólogas perinatais. Validação rápida de CRP, materiais de suporte e autonomia completa sobre a sua agenda.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setShowPartnerModal(true)}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[#73937E] hover:bg-[#8FA89B] text-white px-8 py-4 text-base font-semibold shadow-lg transition-all duration-300 hover:scale-105"
            >
              <span>Quero ser um profissional parceiro</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

      </div>

      {/* Modal de Cadastro Simplificado para Psicólogo Parceiro */}
      {showPartnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#27272A]/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-[#FAFAF9] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#73937E]/30">
            <button
              onClick={() => { setShowPartnerModal(false); setSubmitted(false); }}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>

            {!submitted ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-4"
              >
                <div className="text-left mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#73937E]">
                    Credenciamento Clínico
                  </span>
                  <h3 className="font-display text-2xl font-medium text-[#27272A] mt-1">
                    Candidatura de Profissional Parceiro
                  </h3>
                  <p className="text-xs text-[#52525B] mt-1">
                    Preencha seus dados para receber o contato da nossa equipe de curadoria clínica.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#27272A] mb-1">Nome Completo</label>
                  <input
                    required
                    type="text"
                    placeholder="Dra. Seu Nome"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-[#73937E] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#27272A] mb-1">Registro (CRP)</label>
                    <input
                      required
                      type="text"
                      placeholder="06/000000"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-[#73937E] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#27272A] mb-1">WhatsApp</label>
                    <input
                      required
                      type="tel"
                      placeholder="(11) 99999-9999"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-[#73937E] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#27272A] mb-1">E-mail Profissional</label>
                  <input
                    required
                    type="email"
                    placeholder="psi@exemplo.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-[#73937E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#27272A] mb-1">Especialidade / Foco de Atuação</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-[#73937E] focus:outline-none">
                    <option>Psicologia Perinatal e Pós-Parto</option>
                    <option>Depressão Pós-Parto e Ansiedade Gestacional</option>
                    <option>Luto Parental e Tentantes</option>
                    <option>Terapia de Casal e Parentalidade</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#2F3A36] text-white text-sm font-semibold hover:bg-[#1F3224] shadow-md transition mt-2"
                >
                  Enviar candidatura para validação
                </button>
              </form>
            ) : (
              <div className="text-center py-6">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#EBF3EE] text-[#73937E] flex items-center justify-center mb-4">
                  <CheckCircle2 size={30} />
                </div>
                <h3 className="font-display text-2xl font-medium text-[#27272A] mb-2">
                  Candidatura recebida!
                </h3>
                <p className="text-sm text-[#52525B] leading-relaxed mb-6">
                  Nossa equipe clínica entrará em contato em até 2 dias úteis via WhatsApp para validar o CRP e apresentar as ferramentas da plataforma.
                </p>
                <button
                  onClick={() => { setShowPartnerModal(false); setSubmitted(false); }}
                  className="py-3 px-8 rounded-full bg-[#2F3A36] text-white text-sm font-semibold hover:bg-[#1F3224] transition"
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
