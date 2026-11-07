import React from "react";
import { Link } from "react-router-dom";
import { 
  ClipboardCheck, 
  CalendarHeart, 
  Users, 
  Stethoscope, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Heart
} from "lucide-react";
import { BotanicalBranch, MaternalLineArt } from "../../Components/Common/BotanicalDecor";

const passosJornada = [
  {
    step: "01",
    icon: ClipboardCheck,
    title: "Escuta Inicial e Triagem",
    description:
      "Aplicação do questionário de bem-estar baseado na Escala de Edimburgo, identificando níveis de sobrecarga de forma totalmente confidencial e segura.",
    highlight: "Baseado na Escala de Edimburgo",
    badgeColor: "bg-[#EBF3EE] text-[#73937E]"
  },
  {
    step: "02",
    icon: CalendarHeart,
    title: "Acompanhamento Diário",
    description:
      "Acesso gratuito ao Diário Emocional e ao Calendário de Humor para registrar sentimentos, angústias e vitórias cotidianas no seu tempo.",
    highlight: "Sem filtros, no seu ritmo",
    badgeColor: "bg-[#FDF2F5] text-[#C96E82]"
  },
  {
    step: "03",
    icon: Users,
    title: "Rede de Apoio Comunitária",
    description:
      "Participação em Rodas de Conversa abertas e mediadas por psicólogos, trocando experiências reais com outras mulheres que vivem o mesmo momento.",
    highlight: "Troca real e empatia",
    badgeColor: "bg-[#EBF3EE] text-[#73937E]"
  },
  {
    step: "04",
    icon: Stethoscope,
    title: "Apoio Clínico Especializado",
    description:
      "Agendamento de consultas individuais com psicólogas perinatais por valores acessíveis ou através de bolsas financiadas pelo Fundo de Acolhimento.",
    highlight: "Psicologia perinatal dedicada",
    badgeColor: "bg-[#FDF2F5] text-[#C96E82]"
  }
];

export default function JornadaMaeScreen() {
  return (
    <section id="jornada" className="relative py-24 sm:py-32 bg-[#FAFAF9] overflow-hidden border-t border-[#F4C4D4]/30">
      
      {/* Elementos botânicos decorativos nos cantos */}
      <div className="absolute top-10 right-4 pointer-events-none opacity-40">
        <BotanicalBranch variant="pink" size={140} />
      </div>
      <div className="absolute bottom-10 left-4 pointer-events-none opacity-40">
        <BotanicalBranch variant="sage" size={150} flip={true} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        
        {/* Cabeçalho da Seção */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#27272A] leading-tight">
            Cuidado contínuo, passo a passo,{" "}
            <span className="italic text-[#73937E]">respeitando o seu tempo.</span>
          </h2>

          <p className="mt-5 text-lg text-[#52525B] leading-relaxed font-body">
            Desenvolvemos uma esteira de acolhimento pensada por psicólogas perinatais para que você nunca se sinta desamparada, desde o primeiro momento de dúvida até a retomada da sua confiança.
          </p>
        </div>

        {/* Grade de 4 Passos da Jornada */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {passosJornada.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="group relative rounded-3xl bg-white p-7 shadow-sm border border-[#F4C4D4]/40 hover:border-[#73937E]/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Linha decorativa de topo */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-display text-3xl font-light text-[#73937E]/60 group-hover:text-[#73937E] transition-colors">
                    {item.step}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-[#FAFAF9] border border-gray-100 flex items-center justify-center text-[#2F3A36] group-hover:scale-110 transition-transform shadow-xs">
                    <Icon size={24} className="text-[#73937E]" />
                  </div>
                </div>

                <div>
                  <span className={`inline-block text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg mb-3 ${item.badgeColor}`}>
                    {item.highlight}
                  </span>
                  <h3 className="font-display text-xl font-medium text-[#27272A] mb-3 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#52525B] leading-relaxed font-body">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-semibold text-[#73937E] group-hover:text-[#2F3A36] transition-colors">
                  <span>Etapa acolhedora</span>
                  <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================
            CARD EXPLICATIVO: Destaque de Gratuidade e Transparência
        ======================================================== */}
        <div className="mt-14 rounded-3xl bg-gradient-to-br from-[#EBF3EE] via-white to-[#FDF2F5] p-8 sm:p-10 border border-[#73937E]/25 shadow-lg relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-xs border border-[#73937E]/20 text-[#2F3A36] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck size={14} className="text-[#73937E]" />
                Transparência & Acesso Democrático
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-medium text-[#27272A]">
                Ferramentas essenciais <span className="text-[#73937E]">100% gratuitas.</span> Sempre.
              </h3>

              <p className="text-base text-[#52525B] leading-relaxed font-body">
                Acreditamos que nenhuma mulher deve enfrentar a dor psíquica materna desamparada por razões financeiras. Por isso, a <strong className="text-[#27272A]">Triagem de Edimburgo</strong>, o <strong className="text-[#27272A]">Diário Emocional Básico</strong> e as <strong className="text-[#27272A]">Rodas de Apoio Comunitárias</strong> são totalmente livres e sem custo.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-sm text-[#2F3A36]">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#73937E] text-white flex items-center justify-center">
                    <Check size={12} />
                  </div>
                  <span className="font-medium">Questionário confidencial livre</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#73937E] text-white flex items-center justify-center">
                    <Check size={12} />
                  </div>
                  <span className="font-medium">Rodas semanais abertas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#73937E] text-white flex items-center justify-center">
                    <Check size={12} />
                  </div>
                  <span className="font-medium">Diário de sentimentos</span>
                </div>
              </div>
            </div>

            {/* Coluna de Plano Opcional e Extensão */}
            <div className="lg:col-span-4 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-[#F4C4D4] shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-[#C96E82] uppercase tracking-wider mb-2">
                <Sparkles size={16} />
                Plano Opcional Estendido
              </div>
              <h4 className="font-display text-lg font-medium text-[#27272A] mb-2">
                Histórico Clínico e Masterclasses
              </h4>
              <p className="text-xs text-[#52525B] leading-relaxed mb-4">
                Disponível para usuárias que desejam relatórios profundos e cursos para o retorno ao trabalho, ou <strong className="text-[#27272A]">custeado integralmente pelas empresas contratantes</strong> através do plano Florável Corporate.
              </p>
              <Link
                to="/cadastro"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#2F3A36] hover:bg-[#1F3224] text-white text-xs font-semibold shadow-xs transition"
              >
                <span>Acessar ferramentas gratuitas</span>
                <ArrowRight size={14} />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
