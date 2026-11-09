import React from "react";
import { Link } from "react-router-dom";
import { Check, Sparkles, HeartHandshake, ShieldCheck, ArrowRight, Heart } from "lucide-react";

export default function FeaturesBentoSection() {
  return (
    <section 
      id="recursos" 
      /* Fundo com rosa mais presente e marcante (#F3C2D0) para Color Blocking de alto impacto */
      className="py-24 sm:py-32 bg-[#F3C2D0] relative overflow-hidden border-t border-[#E8A9BB]/40 shadow-inner"
    >
      {/* Luz ambiente suave para profundidade */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] rounded-full bg-white/25 blur-[150px] -z-10" 
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* CABEÇALHO DA SEÇÃO */}
        <div className="sr-group max-w-3xl mb-14 sm:mb-20 text-left">
          <h2 className="font-serif text-[32px] sm:text-[44px] lg:text-[54px] font-normal text-[#294D33] leading-[1.08] tracking-[-0.025em]">
            Tudo o que você precisa,{" "}
            <span className="italic font-serif text-[#294D33] underline decoration-[#E8A9BB] decoration-wavy decoration-2">
              em um só lugar.
            </span>
          </h2>

          <p className="mt-4 text-[15px] sm:text-lg text-[#294D33]/90 leading-relaxed font-sans font-medium max-w-2xl">
            Feito para a vida real de quem cuida, com mais tempo e espaço para respirar.
          </p>
        </div>

        {/* ========================================================
            1. BLOCO DIÁRIO/ESCUTA (LAYOUT 50/50 COM FOTO REAL RENOVADA)
        ======================================================== */}
        <div className="sr-group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
          
          {/* LADO ESQUERDO: Nova Fotografia Real de Alta Resolução com Mini-Badge de Vidro */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full aspect-[4/3.8] sm:aspect-[4/3.4] rounded-[2.5rem] overflow-hidden bg-white shadow-xl shadow-[#294D33]/12 border-2 border-white">
              <img
                src="/img/hero-woman-serene.jpg"
                alt="Mulher serena em momento de respiro e autocuidado"
                className="w-full h-full object-cover rounded-[2.5rem] object-center transition-transform duration-1000 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/img/fotoMae/fotomae3.jpg";
                }}
              />
              {/* Gradiente sutil para legibilidade do badge */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#294D33]/35 via-transparent to-transparent pointer-events-none rounded-[2.5rem]" />

              {/* MINI-BADGE DE VIDRO NO CANTO INFERIOR DA FOTO */}
              <div className="absolute bottom-5 left-5 right-5 sm:right-auto backdrop-blur-md bg-white/90 border border-white/90 p-3.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg shadow-[#294D33]/15 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#516B55] animate-pulse flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-[#294D33] font-nunito tracking-wide">
                  Diário Emocional &bull; Registro sem filtro
                </span>
              </div>
            </div>

            {/* Ornamento sutil flutuante superior */}
            <div className="hidden sm:flex absolute -top-3 -right-2 backdrop-blur-md bg-white/95 border border-[#294D33]/15 px-3.5 py-1.5 rounded-full text-[11px] font-semibold text-[#516B55] shadow-sm items-center gap-1.5">
              <span>100% Confidencial</span>
            </div>
          </div>

          {/* LADO DIREITO: Manifesto Textual em Card Branco Editorial */}
          <div className="lg:col-span-6 rounded-[2.5rem] bg-white/95 p-8 sm:p-10 border border-white shadow-lg shadow-[#294D33]/8 flex flex-col items-start text-left space-y-5">
            
            <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#294D33] leading-[1.18] tracking-[-0.015em]">
              Um lugar para respirar no seu tempo.
            </h3>

            <p className="text-sm sm:text-base text-[#3A443E] leading-relaxed font-sans">
              A maternidade não vem com pausa automática. O Diário Florável é o seu refúgio: sem metas, sem cobrança e sem a obrigação de estar bem o tempo todo.
            </p>

            {/* Diferenciais em lista minimalista */}
            <div className="w-full space-y-2 pt-1 font-sans">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#294D33] font-medium">
                <div className="w-4 h-4 rounded-full bg-[#294D33] text-white flex items-center justify-center shrink-0">
                  <Check size={11} strokeWidth={3} />
                </div>
                <span>Sem notificações invasivas ou cobrança de rotina</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#294D33] font-medium">
                <div className="w-4 h-4 rounded-full bg-[#294D33] text-white flex items-center justify-center shrink-0">
                  <Check size={11} strokeWidth={3} />
                </div>
                <span>Criptografia de ponta a ponta que protege seus desabafos</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#294D33] font-medium">
                <div className="w-4 h-4 rounded-full bg-[#294D33] text-white flex items-center justify-center shrink-0">
                  <Check size={11} strokeWidth={3} />
                </div>
                <span>Mapa visual suave dos seus momentos de alívio e leveza</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/cadastro"
                className="inline-flex items-center justify-center gap-2 py-3.5 px-7 rounded-full bg-[#294D33] hover:bg-[#1f3c27] text-[#FCF7F9] text-xs font-semibold uppercase tracking-wider shadow-md transition-all duration-300 hover:scale-[1.02]"
              >
                <span>Começar meu registro gratuito</span>
                <ArrowRight size={14} />
              </Link>
            </div>

          </div>

        </div>

        {/* ========================================================
            2. BLOCO CÁPSULA DO TEMPO (CARD TÁTIL RETANGULAR LARGO)
        ======================================================== */}
        <div className="sr mb-16 rounded-[2.5rem] bg-white p-8 sm:p-12 lg:p-14 shadow-xl shadow-[#294D33]/8 text-left relative overflow-hidden border-2 border-white">
          
          {/* Elemento de iluminação interna */}
          <div 
            aria-hidden="true" 
            className="pointer-events-none absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#F4DDE5]/40 blur-[70px]" 
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Lado Esquerdo do Card Tátil: Título, Manifesto e Efeito de Selo */}
            <div className="lg:col-span-8 space-y-4">
              
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#294D33] leading-snug">
                Escreva para a mulher que você será daqui a 1 ano.{" "}
                <span className="italic block sm:inline">Nós guardamos com segurança.</span>
              </h3>

              <p className="text-sm sm:text-base text-[#3A443E] leading-relaxed font-sans max-w-2xl font-normal">
                Uma carta de quem você é hoje para a mulher que vai florescer. Guardada em cofre digital e entregue no seu e-mail 365 dias depois.
              </p>

              <div className="flex flex-wrap gap-3 pt-2 text-xs text-[#294D33] font-semibold">
                <span className="liquid-chip flex items-center gap-1.5 px-3.5 py-1.5 rounded-full">
                  Abertura programada: 365 dias
                </span>
                <span className="liquid-chip flex items-center gap-1.5 px-3.5 py-1.5 rounded-full">
                  Lacrada e inacessível até a data
                </span>
              </div>

            </div>

            {/* Lado Direito do Card Tátil: Mockup de Selo/Envelope Vintage */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="liquid-glass w-full max-w-xs rounded-3xl p-6 text-left space-y-3 relative group transition-transform duration-300 hover:rotate-1">
                
                {/* Selo Postal Ilustrado no Canto */}
                <div className="flex items-center justify-between pb-2 border-b border-[#E8A9BB]/50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#294D33] text-white flex items-center justify-center font-serif text-xs font-bold shadow-xs">
                      FL
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#294D33]">Selo Florável</p>
                      <p className="text-[9px] text-[#516B55]">Não violar antes do prazo</p>
                    </div>
                  </div>
                  <span className="liquid-chip text-[10px] font-bold text-[#294D33] px-2 py-0.5 rounded-md">
                    1 ANO
                  </span>
                </div>

                <p className="text-xs font-serif text-[#294D33] italic leading-tight pt-1">
                  &ldquo;Para quando meu bebê completar 1 ano: lembre-se do quanto fomos corajosas hoje.&rdquo;
                </p>

                <div className="pt-2 flex items-center justify-between text-[10px] text-[#516B55]">
                  <span className="flex items-center gap-1">
                    1 Carta lacrada
                  </span>
                  <span className="font-semibold text-[#294D33]">Disponível na sua conta</span>
                </div>

                <Link
                  to="/cadastro"
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#294D33] hover:bg-[#1f3c27] text-white text-[11px] font-bold uppercase tracking-wider transition"
                >
                  <span>Escrever minha carta</span>
                </Link>

              </div>
            </div>

          </div>

        </div>

        {/* ========================================================
            3. CARDS COMPLEMENTARES EDITORIAIS (RODAS & TRIAGEM EPDS)
        ======================================================== */}
        <div className="sr-group grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-20">
          
          {/* Card Rodas de Conversa */}
          <div className="p-8 rounded-[2.5rem] bg-white border border-white shadow-lg shadow-[#294D33]/6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#294D33] text-white">
                  Ao Vivo &bull; Gratuito
                </span>
              </div>

              <h4 className="font-serif text-2xl font-normal text-[#294D33] pt-2">
                Rodas de Conversa Semanais
              </h4>

              <p className="text-xs sm:text-sm text-[#3A443E] leading-relaxed font-sans">
                Encontros virtuais entre mães, mediados por psicólogas, sem tabus nem julgamentos.
              </p>

              <div className="liquid-chip p-3.5 rounded-2xl flex items-center gap-3">
                <div className="flex -space-x-2">
                  <img src="/img/1.jpg" alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                  <img src="/img/2.jpg" alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                  <img src="/img/3.jpg" alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                </div>
                <span className="text-xs font-medium text-[#294D33]">Todas as quartas às 19h</span>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E8A9BB]/30 flex items-center justify-between">
              <span className="text-xs text-[#516B55]">Acesso aberto a todas</span>
              <Link to="/cadastro" className="text-xs font-bold uppercase tracking-wider text-[#294D33] hover:underline flex items-center gap-1">
                Participar da roda <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Card Triagem Edimburgo EPDS */}
          <div className="p-8 rounded-[2.5rem] bg-white border border-white shadow-lg shadow-[#294D33]/6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="liquid-chip text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full text-[#294D33]">
                  Escala Científica OMS
                </span>
              </div>

              <h4 className="font-serif text-2xl font-normal text-[#294D33] pt-2">
                Autoavaliação Clínica EPDS
              </h4>

              <p className="text-xs sm:text-sm text-[#3A443E] leading-relaxed font-sans">
                Rastreio confidencial em 3 minutos para entender o nível da sua sobrecarga.
              </p>

              <div className="liquid-chip p-3.5 rounded-2xl space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-[#294D33]">
                  <span>Sigilo Absoluto</span>
                  <span className="text-[#516B55]">Resultado Imediato</span>
                </div>
                <div className="w-full bg-[#F4DDE5] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#294D33] h-full w-[85%]" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E8A9BB]/30 flex items-center justify-between">
              <span className="text-xs text-[#516B55]">Sem diagnósticos frios</span>
              <Link to="/cadastro" className="text-xs font-bold uppercase tracking-wider text-[#294D33] hover:underline flex items-center gap-1">
                Fazer triagem gratuita <ArrowRight size={13} />
              </Link>
            </div>
          </div>

        </div>

        {/* ========================================================
            4. MODELO CIRCULAR SOLIDÁRIO: PLANO FREE VS FLORÁVEL PLUS (R$ 80)
        ======================================================== */}
        <div className="sr-group text-left pt-6 border-t border-white/40">
          
          <div className="max-w-2xl mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#294D33]/20 shadow-xs mb-3">
              <HeartHandshake size={14} className="text-[#294D33]" />
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#294D33] font-sans">
                Sustentabilidade Circular &bull; Cuidado Solidário
              </span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl lg:text-[2.65rem] font-normal text-[#294D33] leading-tight">
              Acesso livre para todas.{" "}
              <span className="italic block sm:inline">Apoio solidário para quem tem condições.</span>
            </h3>

            <p className="mt-3 text-sm sm:text-base text-[#294D33]/90 font-sans leading-relaxed">
              Acreditamos que o cuidado emocional materno é um direito, não um privilégio. Por isso, mantemos uma base <strong className="font-bold text-[#294D33]">100% gratuita</strong>, sustentada por mães que têm condições de investir no plano <strong className="font-bold text-[#294D33]">Florável Plus por R$ 80/mês</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* PLANO 1: FLORÁVEL ESSENCIAL (FREE - R$ 0) */}
            <div className="rounded-[2.5rem] bg-white/95 p-8 sm:p-10 border-2 border-white shadow-xl shadow-[#294D33]/8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="liquid-chip text-[11px] font-bold uppercase tracking-wider text-[#294D33] px-3 py-1 rounded-full">
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

                <ul className="space-y-3 text-xs sm:text-sm text-[#294D33] font-sans border-t border-[#E8A9BB]/30 pt-6">
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
                  className="w-full py-4 rounded-full bg-[#FCF7F9] hover:bg-[#F4DDE5] text-[#294D33] border border-[#294D33]/30 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Criar Conta Gratuita</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* PLANO 2: FLORÁVEL PLUS (R$ 80/MÊS - MODELO MANTENEDORA SOLIDÁRIA) */}
            <div className="rounded-[2.5rem] bg-white p-8 sm:p-10 border-2 border-[#294D33] shadow-2xl shadow-[#294D33]/20 flex flex-col justify-between relative overflow-hidden">
              
              {/* Badge de Destaque Superior */}
              <div className="absolute top-0 right-0 bg-[#294D33] text-[#FCF7F9] px-5 py-1.5 rounded-bl-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-sm">
                <Sparkles size={11} className="text-[#E8A9BB]" />
                <span>Modelo Solidário</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-[#F4DDE5] text-[#294D33] px-3.5 py-1 rounded-full border border-[#E8A9BB]/60">
                    Mãe Mantenedora
                  </span>
                </div>

                <div className="mb-4">
                  <span className="font-serif text-4xl sm:text-5xl font-normal text-[#294D33]">R$ 80</span>
                  <span className="text-xs text-[#516B55] ml-2 font-medium">/ mês</span>
                </div>

                <h4 className="font-serif text-2xl font-normal text-[#294D33] mb-2">
                  Florável Plus
                </h4>

                <p className="text-xs sm:text-sm text-[#3A443E] leading-relaxed font-sans mb-4">
                  Para mães que têm condições financeiras e escolhem viver a experiência completa enquanto sustentam o acolhimento de mães sem renda.
                </p>

                {/* Banner de Impacto Social Direto */}
                <div className="p-3.5 rounded-2xl bg-[#EBF1ED] border border-[#516B55]/30 mb-6 flex items-start gap-2.5">
                  <Heart className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 fill-rose-600" />
                  <p className="text-xs text-[#294D33] font-medium leading-relaxed font-sans">
                    <strong className="font-bold">Impacto Direto:</strong> 1 assinatura Plus financia a infraestrutura técnica que acolhe gratuitamente 3 mães em vulnerabilidade social.
                  </p>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-[#294D33] font-sans border-t border-[#E8A9BB]/30 pt-4">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#294D33] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span><strong>Tudo do plano Essencial</strong> incluso e liberado</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#294D33] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span><strong>Diário sem limites:</strong> gravação de áudio e histórico emocional avançado</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#294D33] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span><strong>Cápsulas do Tempo Ilimitadas:</strong> cartas, fotos e áudios para 1, 2 e 5 anos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#294D33] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span><strong>Agendamento prioritário</strong> na rede de psicólogas credenciadas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#294D33] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span><strong>Selo de Mãe Apoiadora / Mantenedora Solidária</strong> no perfil</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  to="/cadastro?plano=plus"
                  className="w-full py-4 rounded-full bg-[#294D33] hover:bg-[#1f3c27] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#294D33]/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
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
