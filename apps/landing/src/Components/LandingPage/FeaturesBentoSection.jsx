import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, HeartHandshake, ArrowRight, Heart, Plus, Minus } from "lucide-react";

const FEATURE_MODULES = [
  {
    id: "capsula",
    number: "01",
    tag: "Memória & Futuro",
    title: "Cápsula do Tempo",
    summary: "Escreva para a mulher que você será daqui a 1 ano. Guardamos em cofre digital com entrega programada.",
    desc: "Uma carta de quem você é hoje para a mulher que vai florescer. Lacrada digitalmente e entregue no seu e-mail 365 dias depois.",
    highlights: ["Abertura programada: 365 dias", "Lacrada e inacessível até a data"],
    cta: "Escrever minha carta",
    to: "/cadastro",
    previewType: "capsula",
  },
  {
    id: "rodas",
    number: "02",
    tag: "Ao Vivo • Gratuito",
    title: "Rodas de Conversa Semanais",
    summary: "Encontros virtuais entre mães, mediados por psicólogas perinatais, sem tabus nem julgamentos.",
    desc: "Um espaço seguro de escuta em grupo todas as semanas para compartilhar a maternidade real com acolhimento profissional.",
    highlights: ["Todas as quartas às 19h", "Acesso aberto a todas"],
    cta: "Participar da roda",
    to: "/cadastro",
    previewType: "rodas",
  },
  {
    id: "epds",
    number: "03",
    tag: "Escala Científica OMS",
    title: "Autoavaliação Clínica EPDS",
    summary: "Rastreio confidencial em 3 minutos baseado na Escala de Edimburgo para entender sua sobrecarga.",
    desc: "Sem diagnósticos frios: receba orientação acolhedora imediata e saiba quando buscar apoio clínico especializado.",
    highlights: ["Sigilo absoluto", "Resultado imediato"],
    cta: "Fazer triagem gratuita",
    to: "/cadastro",
    previewType: "epds",
  },
];

export default function FeaturesBentoSection() {
  const [selectedFeatureId, setSelectedFeatureId] = useState("capsula");
  const activeFeature =
    FEATURE_MODULES.find((item) => item.id === selectedFeatureId) || FEATURE_MODULES[0];

  return (
    <section
      id="recursos"
      className="py-20 sm:py-28 bg-[#F4DDE5]/45 relative overflow-hidden border-t border-[#E8A9BB]/35"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* CABEÇALHO EDITORIAL */}
        <div className="sr-group max-w-3xl mb-14 sm:mb-20 text-left">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#516B55] font-sans mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A8435F]" />
            Ferramentas de Cuidado
          </span>
          <h2 className="font-serif text-[32px] sm:text-[44px] lg:text-[52px] font-normal text-[#294D33] leading-[1.08] tracking-[-0.02em]">
            Tudo o que você precisa,{" "}
            <span className="italic text-[#A8435F]">em um só lugar.</span>
          </h2>
          <p className="mt-4 text-[15px] sm:text-lg text-[#3A443E] leading-relaxed font-sans max-w-2xl">
            Feito para a vida real de quem cuida, com mais tempo e espaço para respirar.
          </p>
        </div>

        {/* ========================================================
            1. DIÁRIO EMOCIONAL — SPLIT EDITORIAL DIRETO NA SUPERFÍCIE
        ======================================================== */}
        <div className="sr-group grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center pb-20 border-b border-[#294D33]/12">
          <div className="lg:col-span-6 relative">
            <div className="relative w-full aspect-[4/3.4] rounded-2xl overflow-hidden bg-[#294D33] shadow-lg shadow-[#294D33]/10">
              <img
                src="/img/institucional/diario-respiro-autocuidado.jpg"
                alt="Mulher serena em momento de respiro e autocuidado"
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/img/jornada/jornada-etapa-01-acolher.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F3224]/45 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-[#FCF7F9]/95 px-4 py-2.5 rounded-xl flex items-center gap-2.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#294D33] shrink-0" />
                <span className="text-xs font-semibold text-[#294D33] font-sans">
                  Diário Emocional • Registro sem filtro • 100% Confidencial
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#516B55]">
              Refúgio Diário
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#294D33] leading-[1.15]">
              Um lugar para respirar no seu tempo.
            </h3>
            <p className="text-sm sm:text-base text-[#3A443E] leading-relaxed font-sans">
              A maternidade não vem com pausa automática. O Diário Florável é o seu refúgio: sem metas, sem cobrança e sem a obrigação de estar bem o tempo todo.
            </p>

            <div className="w-full space-y-2.5 pt-1 font-sans">
              {[
                "Sem notificações invasivas ou cobrança de rotina",
                "Criptografia de ponta a ponta que protege seus desabafos",
                "Mapa visual suave dos seus momentos de alívio e leveza",
              ].map((line) => (
                <div key={line} className="flex items-center gap-2.5 text-sm text-[#294D33] font-medium">
                  <div className="w-4 h-4 rounded-full bg-[#294D33] text-white flex items-center justify-center shrink-0">
                    <Check size={11} strokeWidth={3} />
                  </div>
                  <span>{line}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                to="/cadastro"
                className="inline-flex items-center justify-center gap-2 py-3.5 px-7 rounded-full bg-[#294D33] hover:bg-[#1f3c27] text-[#FCF7F9] text-xs font-semibold uppercase tracking-wider shadow-sm transition"
              >
                <span>Começar meu registro gratuito</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================
            2. RECURSOS DA PLATAFORMA — SELETOR EDITORIAL INTERATIVO (SEM CAIXAS BRANCAS REPETIDAS)
        ======================================================== */}
        <div className="sr-group py-20 border-b border-[#294D33]/12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Esquerda: Lista editorial selecionável */}
            <div className="lg:col-span-6 flex flex-col justify-between text-left">
              <div className="mb-6">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#516B55]">
                  Recursos em destaque
                </span>
                <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-normal text-[#294D33]">
                  Explore cada ferramenta no seu ritmo
                </h3>
              </div>

              <div className="divide-y divide-[#294D33]/15 border-y border-[#294D33]/15">
                {FEATURE_MODULES.map((item) => {
                  const isSelected = item.id === activeFeature.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onMouseEnter={() => setSelectedFeatureId(item.id)}
                      onClick={() => setSelectedFeatureId(item.id)}
                      className={`w-full py-6 px-4 text-left transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer flex items-start justify-between gap-4 ${
                        isSelected ? "bg-white/80" : "hover:bg-white/45"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <span
                          className={`font-serif text-xl pt-0.5 transition-colors ${
                            isSelected ? "text-[#A8435F]" : "text-[#516B55]"
                          }`}
                        >
                          {item.number}
                        </span>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#516B55] block mb-1">
                            {item.tag}
                          </span>
                          <h4 className="font-serif text-xl sm:text-2xl font-normal text-[#294D33]">
                            {item.title}
                          </h4>
                          <p className="mt-1.5 text-xs sm:text-sm text-[#3A443E] leading-relaxed font-sans">
                            {item.summary}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 mt-1 transition-colors ${
                          isSelected
                            ? "bg-[#294D33] border-[#294D33] text-white"
                            : "border-[#294D33]/25 text-[#294D33]"
                        }`}
                      >
                        {isSelected ? <Minus size={14} /> : <Plus size={14} />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Direita: Painel Editorial Verde Profundo com preview dinâmico fluido */}
            <div className="lg:col-span-6">
              <div className="h-full rounded-2xl bg-[#294D33] text-[#FCF7F9] p-8 sm:p-10 flex flex-col justify-between text-left shadow-xl shadow-[#294D33]/15 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                <div
                  key={activeFeature.id}
                  className="space-y-5 animate-[fadeIn_0.45s_cubic-bezier(0.22,1,0.36,1)]"
                >
                  <div className="flex items-center justify-between border-b border-white/15 pb-4">
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#E8A9BB]">
                      {activeFeature.number} &bull; {activeFeature.tag}
                    </span>
                    <span className="text-xs text-[#E6EFE9]/75 font-sans">Florável Plataforma</span>
                  </div>

                  <h4 className="font-serif text-3xl sm:text-4xl font-normal leading-tight">
                    {activeFeature.title}
                  </h4>

                  <p className="text-sm sm:text-base text-[#E6EFE9]/90 leading-relaxed font-sans">
                    {activeFeature.desc}
                  </p>

                  {/* Preview específico de cada módulo */}
                  {activeFeature.previewType === "capsula" && (
                    <div className="rounded-xl bg-white/10 border border-white/15 p-5 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#E8A9BB] text-[#1F3224] flex items-center justify-center font-serif text-xs font-bold">
                            FL
                          </div>
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider">Selo Florável</p>
                            <p className="text-[10px] text-[#E6EFE9]/75">Não violar antes do prazo</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/15">
                          1 ANO
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-serif italic text-[#FCF7F9]/95">
                        &ldquo;Para quando meu bebê completar 1 ano: lembre-se do quanto fomos corajosas hoje.&rdquo;
                      </p>
                    </div>
                  )}

                  {activeFeature.previewType === "rodas" && (
                    <div className="rounded-xl bg-white/10 border border-white/15 p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          <img src="/img/1.jpg" alt="" className="w-9 h-9 rounded-full border-2 border-[#294D33] object-cover" />
                          <img src="/img/2.jpg" alt="" className="w-9 h-9 rounded-full border-2 border-[#294D33] object-cover" />
                          <img src="/img/3.jpg" alt="" className="w-9 h-9 rounded-full border-2 border-[#294D33] object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Todas as quartas às 19h</p>
                          <p className="text-xs text-[#E6EFE9]/75">Mediadas por psicólogas perinatais</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFeature.previewType === "epds" && (
                    <div className="rounded-xl bg-white/10 border border-white/15 p-5 space-y-2.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Sigilo Absoluto</span>
                        <span className="text-[#E8A9BB]">Resultado Imediato</span>
                      </div>
                      <div className="w-full bg-white/15 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#E8A9BB] h-full w-[85%]" />
                      </div>
                      <p className="text-[11px] text-[#E6EFE9]/75">
                        Escala de Depressão Pós-Parto de Edimburgo validada internacionalmente.
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-1">
                    {activeFeature.highlights.map((h) => (
                      <span
                        key={h}
                        className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-[#FCF7F9]"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-white/15 flex items-center justify-between">
                  <span className="text-xs text-[#E6EFE9]/75">Incluso gratuitamente</span>
                  <Link
                    to={activeFeature.to}
                    className="inline-flex items-center gap-2 rounded-full bg-[#E8A9BB] hover:bg-[#f2bccb] text-[#1F3224] px-6 py-3 text-xs font-bold uppercase tracking-wider transition"
                  >
                    <span>{activeFeature.cta}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            3. MODELO CIRCULAR SOLIDÁRIO: PLANO FREE VS FLORÁVEL PLUS (CONTRASTE REAL)
        ======================================================== */}
        <div className="sr-group text-left pt-16">
          <div className="max-w-2xl mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#294D33]/15 mb-3">
              <HeartHandshake size={14} className="text-[#294D33]" />
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#294D33] font-sans">
                Sustentabilidade Circular &bull; Cuidado Solidário
              </span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl lg:text-[2.65rem] font-normal text-[#294D33] leading-tight">
              Acesso livre para todas.{" "}
              <span className="italic block sm:inline">Apoio solidário para quem tem condições.</span>
            </h3>

            <p className="mt-3 text-sm sm:text-base text-[#3A443E] font-sans leading-relaxed">
              Acreditamos que o cuidado emocional materno é um direito, não um privilégio. Por isso, mantemos uma base <strong className="font-bold text-[#294D33]">100% gratuita</strong>, sustentada por mães que investem no plano <strong className="font-bold text-[#294D33]">Florável Plus por R$ 80/mês</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* PLANO 1: FLORÁVEL ESSENCIAL (CLARO) */}
            <div className="rounded-2xl bg-white p-8 sm:p-10 border border-[#294D33]/15 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#294D33] bg-[#F4DDE5] px-3 py-1 rounded-full">
                    Acesso Livre &bull; Para Sempre
                  </span>
                  <span className="text-xs font-semibold text-[#516B55]">Sem pegadinhas</span>
                </div>

                <div className="mb-4">
                  <span className="font-serif text-4xl sm:text-5xl font-normal text-[#294D33]">R$ 0</span>
                  <span className="text-xs text-[#516B55] ml-2 font-medium">/ para sempre</span>
                </div>

                <h4 className="font-serif text-2xl font-normal text-[#294D33] mb-2">
                  Florável Essencial
                </h4>

                <p className="text-xs sm:text-sm text-[#3A443E] leading-relaxed font-sans mb-6">
                  Estrutura completa e acolhedora para que nenhuma mãe enfrente o puerpério ou a sobrecarga materna desamparada.
                </p>

                <ul className="space-y-3 text-xs sm:text-sm text-[#294D33] font-sans border-t border-[#294D33]/10 pt-6">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#EBF1ED] text-[#294D33] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span><strong>Triagem EPDS ilimitada</strong> validada pela OMS com resultado instantâneo</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#EBF1ED] text-[#294D33] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span><strong>Diário Emocional diário</strong> confidencial e protegido por criptografia</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#EBF1ED] text-[#294D33] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span><strong>Rodas de Conversa semanais</strong> gratuitas mediadas por psicólogas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#EBF1ED] text-[#294D33] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span><strong>Acesso à Clínica Social</strong> com psicólogas a partir de R$ 40 por sessão</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  to="/cadastro"
                  className="w-full py-4 rounded-full bg-[#FCF7F9] hover:bg-[#F4DDE5] text-[#294D33] border border-[#294D33]/25 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Criar Conta Gratuita</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* PLANO 2: FLORÁVEL PLUS (VERDE PROFUNDO COM CONTRASTE REAL) */}
            <div className="rounded-2xl bg-[#294D33] text-[#FCF7F9] p-8 sm:p-10 border border-[#294D33] flex flex-col justify-between relative overflow-hidden shadow-xl shadow-[#294D33]/15">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-[#E8A9BB] text-[#1F3224] px-3.5 py-1 rounded-full">
                    Mãe Mantenedora
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#E8A9BB]">
                    Modelo Solidário
                  </span>
                </div>

                <div className="mb-4">
                  <span className="font-serif text-4xl sm:text-5xl font-normal text-[#FCF7F9]">R$ 80</span>
                  <span className="text-xs text-[#E6EFE9]/75 ml-2 font-medium">/ mês</span>
                </div>

                <h4 className="font-serif text-2xl font-normal text-[#FCF7F9] mb-2">
                  Florável Plus
                </h4>

                <p className="text-xs sm:text-sm text-[#E6EFE9]/85 leading-relaxed font-sans mb-4">
                  Para mães que têm condições financeiras e escolhem viver a experiência completa enquanto sustentam o acolhimento de mães sem renda.
                </p>

                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 mb-6 flex items-start gap-2.5">
                  <Heart className="w-4 h-4 text-[#E8A9BB] shrink-0 mt-0.5 fill-[#E8A9BB]" />
                  <p className="text-xs text-[#FCF7F9] font-medium leading-relaxed font-sans">
                    <strong className="font-bold">Impacto Direto:</strong> 1 assinatura Plus financia a infraestrutura técnica que acolhe gratuitamente 3 mães em vulnerabilidade social.
                  </p>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-[#E6EFE9]/95 font-sans border-t border-white/15 pt-4">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#E8A9BB] text-[#1F3224] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span><strong>Tudo do plano Essencial</strong> incluso e liberado</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#E8A9BB] text-[#1F3224] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span><strong>Diário sem limites:</strong> gravação de áudio e histórico emocional avançado</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#E8A9BB] text-[#1F3224] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span><strong>Cápsulas do Tempo Ilimitadas:</strong> cartas, fotos e áudios para 1, 2 e 5 anos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#E8A9BB] text-[#1F3224] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span><strong>Agendamento prioritário</strong> na rede de psicólogas credenciadas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#E8A9BB] text-[#1F3224] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span><strong>Selo de Mãe Apoiadora / Mantenedora Solidária</strong> no perfil</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  to="/cadastro?plano=plus"
                  className="w-full py-4 rounded-full bg-[#E8A9BB] hover:bg-[#f2bccb] text-[#1F3224] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Assinar Florável Plus (R$ 80/mês)</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
