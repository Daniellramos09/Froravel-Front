import React, { useState } from "react";
import { X } from "lucide-react";
import { APP_LINKS } from "../../../utils/appLinks";

const EDINBURGH_QUESTIONS = [
  {
    question:
      "Nos últimos dias, como você tem se sentido em relação à sobrecarga da maternidade?",
    options: [
      "Consigo encontrar momentos de respiro e serenidade.",
      "Sinto cansaço ocasional, mas reorganizo minha rotina.",
      "Frequentemente sinto que não dou conta de tudo.",
      "Sinto uma sobrecarga constante e isolamento silencioso.",
    ],
  },
  {
    question: "Quando pensa no momento atual, como está a sua cobrança interna?",
    options: [
      "Consigo ser paciente e compassiva comigo mesma.",
      "Às vezes me culpo, mas logo consigo retomar.",
      "Sinto culpa frequente por não atingir expectativas ideais.",
      "Sinto que estou falhando o tempo todo e temo julgamentos.",
    ],
  },
  {
    question:
      "Você tem encontrado um espaço seguro para expressar o que realmente sente?",
    options: [
      "Sim, tenho uma rede acolhedora e atenta.",
      "Tenho pessoas próximas, mas nem sempre compreendem.",
      "Guardo para mim mesma para não preocupar ninguém.",
      "Não tenho ninguém com quem conversar sem medo de cobranças.",
    ],
  },
];

export function TriagemModal({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);

  if (!isOpen) return null;

  const handleReset = () => {
    setStep(0);
    setSelected(null);
    setDone(false);
    onClose();
  };

  const handleNext = () => {
    if (step < EDINBURGH_QUESTIONS.length - 1) {
      setStep((s) => s + 1);
      setSelected(null);
    } else {
      setDone(true);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="triagem-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F3A27]/50 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-lg rounded-[32px] bg-[#F9F8F6] p-6 sm:p-8 shadow-2xl border border-[#294D33]/12 text-left">
        <button
          type="button"
          onClick={handleReset}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white text-[#516B55] hover:text-[#294D33] border border-[#294D33]/10 flex items-center justify-center transition cursor-pointer"
          aria-label="Fechar janela"
        >
          <X size={18} />
        </button>

        {!done ? (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#D98A9C]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#294D33]">
                Etapa {step + 1} de {EDINBURGH_QUESTIONS.length} &middot; Triagem EPDS Confidencial
              </span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-[#294D33]/10 mb-6 overflow-hidden">
              <div
                className="h-full bg-[#294D33] transition-all duration-300"
                style={{
                  width: `${((step + 1) / EDINBURGH_QUESTIONS.length) * 100}%`,
                }}
              />
            </div>

            <h3
              id="triagem-modal-title"
              className="font-serif text-xl sm:text-2xl text-[#1F3A27] leading-snug mb-5"
            >
              {EDINBURGH_QUESTIONS[step].question}
            </h3>

            <div className="space-y-2.5 mb-6">
              {EDINBURGH_QUESTIONS[step].options.map((opt, idx) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSelected(idx)}
                  className={`w-full text-left p-4 rounded-2xl text-xs sm:text-sm transition border cursor-pointer ${
                    selected === idx
                      ? "bg-[#F4DDE5]/70 border-[#294D33] text-[#1F3A27] font-semibold"
                      : "bg-white border-[#294D33]/10 text-[#3A443E] hover:border-[#6E9473]"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={selected === null}
              onClick={handleNext}
              className={`w-full py-3.5 rounded-full text-xs sm:text-sm font-semibold transition ${
                selected !== null
                  ? "bg-[#294D33] hover:bg-[#1B3122] text-white cursor-pointer"
                  : "bg-[#294D33]/15 text-[#516B55] cursor-not-allowed"
              }`}
            >
              {step === EDINBURGH_QUESTIONS.length - 1
                ? "Ver acolhimento recomendado"
                : "Próxima pergunta"}
            </button>
          </div>
        ) : (
          <div className="py-3 text-center space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F4DDE5] text-xs font-semibold text-[#294D33]">
              Escuta sem Julgamentos
            </span>
            <h3
              id="triagem-modal-title"
              className="font-serif text-2xl sm:text-3xl text-[#1F3A27]"
            >
              Você não precisa passar por isso sozinha.
            </h3>
            <p className="text-sm text-[#3A443E] leading-relaxed max-w-md mx-auto">
              Seus sentimentos são legítimos. No Espaço da Mãe você encontra seu Diário Emocional gratuito, pausas de respiração e psicólogas perinatais prontas para acolher você.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={APP_LINKS.mae}
                className="flex-1 py-3.5 px-6 rounded-full bg-[#294D33] hover:bg-[#1B3122] text-white text-xs sm:text-sm font-semibold text-center transition"
              >
                Entrar no Espaço da Mãe
              </a>
              <button
                type="button"
                onClick={handleReset}
                className="py-3.5 px-6 rounded-full bg-white border border-[#294D33]/15 text-[#294D33] text-xs sm:text-sm font-semibold cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function PartnerModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="partner-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F3A27]/50 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-lg rounded-[32px] bg-[#F9F8F6] p-6 sm:p-8 shadow-2xl border border-[#294D33]/12 text-left">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white text-[#516B55] hover:text-[#294D33] border border-[#294D33]/10 flex items-center justify-center transition cursor-pointer"
          aria-label="Fechar janela"
        >
          <X size={18} />
        </button>

        {!submitted ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-4"
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6E9473]">
                Credenciamento Clínico
              </span>
              <h3
                id="partner-modal-title"
                className="font-serif text-2xl text-[#1F3A27] mt-1"
              >
                Candidatura de Psicólogo Parceiro
              </h3>
              <p className="text-xs text-[#3A443E] mt-1">
                Atenda com repasse integral (100%) e faça parte da rede perinatal Florável.
              </p>
            </div>

            <div>
              <label
                htmlFor="psy-name"
                className="block text-xs font-semibold text-[#1F3A27] mb-1"
              >
                Nome Completo
              </label>
              <input
                id="psy-name"
                required
                type="text"
                placeholder="Ex: Dra. Mariana Costa"
                className="w-full px-4 py-3 rounded-2xl bg-white border border-[#294D33]/15 text-sm focus:border-[#294D33] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="psy-crp"
                  className="block text-xs font-semibold text-[#1F3A27] mb-1"
                >
                  Registro CRP Ativo
                </label>
                <input
                  id="psy-crp"
                  required
                  type="text"
                  placeholder="Ex: 06/14829"
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#294D33]/15 text-sm focus:border-[#294D33] focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="psy-email"
                  className="block text-xs font-semibold text-[#1F3A27] mb-1"
                >
                  E-mail Profissional
                </label>
                <input
                  id="psy-email"
                  required
                  type="email"
                  placeholder="nome@clinica.com"
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#294D33]/15 text-sm focus:border-[#294D33] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#294D33] hover:bg-[#1B3122] text-white text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              Enviar solicitação de credenciamento
            </button>
          </form>
        ) : (
          <div className="py-6 text-center space-y-3">
            <h3
              id="partner-modal-title"
              className="font-serif text-2xl text-[#1F3A27]"
            >
              Solicitação recebida com carinho!
            </h3>
            <p className="text-sm text-[#3A443E]">
              Nossa curadoria clínica validará seu CRP e enviará os próximos passos para seu e-mail.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-2 px-7 py-3 rounded-full bg-[#294D33] text-white text-xs font-semibold cursor-pointer"
            >
              Concluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function CorporateEsgModal({ isOpen, mode = "corporate", onClose }) {
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const isEsg = mode === "esg";

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="corp-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F3A27]/50 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-lg rounded-[32px] bg-[#F9F8F6] p-6 sm:p-8 shadow-2xl border border-[#294D33]/12 text-left">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white text-[#516B55] hover:text-[#294D33] border border-[#294D33]/10 flex items-center justify-center transition cursor-pointer"
          aria-label="Fechar janela"
        >
          <X size={18} />
        </button>

        {!submitted ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-4"
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#D98A9C]">
                {isEsg ? "Alianças ESG & Fundo Solidário" : "Florável Corporativo (B2B)"}
              </span>
              <h3
                id="corp-modal-title"
                className="font-serif text-2xl text-[#1F3A27] mt-1"
              >
                {isEsg
                  ? "Apoiar o Fundo de Acolhimento Florável"
                  : "Solicitar Demonstração para Empresas e RH"}
              </h3>
              <p className="text-xs text-[#3A443E] mt-1">
                {isEsg
                  ? "Patrocine sessões gratuitas para mães em vulnerabilidade com governança transparente."
                  : "Leve o cuidado emocional materno e o painel agregado LGPD para sua organização."}
              </p>
            </div>

            <div>
              <label
                htmlFor="corp-name"
                className="block text-xs font-semibold text-[#1F3A27] mb-1"
              >
                Seu Nome e Cargo
              </label>
              <input
                id="corp-name"
                required
                type="text"
                placeholder="Ex: Ana Paula · Diretora de Pessoas / ESG"
                className="w-full px-4 py-3 rounded-2xl bg-white border border-[#294D33]/15 text-sm focus:border-[#294D33] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="corp-company"
                  className="block text-xs font-semibold text-[#1F3A27] mb-1"
                >
                  Empresa
                </label>
                <input
                  id="corp-company"
                  required
                  type="text"
                  placeholder="Nome da organização"
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#294D33]/15 text-sm focus:border-[#294D33] focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="corp-email"
                  className="block text-xs font-semibold text-[#1F3A27] mb-1"
                >
                  E-mail Corporativo
                </label>
                <input
                  id="corp-email"
                  required
                  type="email"
                  placeholder="voce@empresa.com.br"
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#294D33]/15 text-sm focus:border-[#294D33] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#294D33] hover:bg-[#1B3122] text-white text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              {isEsg ? "Receber apresentação de impacto ESG" : "Agendar demonstração executiva"}
            </button>
          </form>
        ) : (
          <div className="py-6 text-center space-y-3">
            <h3
              id="corp-modal-title"
              className="font-serif text-2xl text-[#1F3A27]"
            >
              Solicitação registrada!
            </h3>
            <p className="text-sm text-[#3A443E]">
              Nossa equipe institucional entrará em contato com a apresentação completa.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-2 px-7 py-3 rounded-full bg-[#294D33] text-white text-xs font-semibold cursor-pointer"
            >
              Concluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
