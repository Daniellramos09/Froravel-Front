import React from 'react';
import { ArrowRight, Heart, Clock } from 'lucide-react';

export default function HeroLanding() {
  return (
    <div className="bg-[#FCF7F9] font-sans relative">
      
      {/* 1. SECÇÃO PRINCIPAL (VÍDEO À DIREITA, TEXTO À ESQUERDA) */}
      <div className="relative min-h-[85vh] flex items-center overflow-hidden pb-20 md:pb-0">
        
        {/* ÁREA DO VÍDEO (Fixada à direita) */}
        <div className="absolute top-0 right-0 w-full md:w-3/5 h-full z-0">
          {/* O Degradê: Começa sólido na esquerda para o texto e fica transparente na direita para o vídeo */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FCF7F9] via-[#FCF7F9]/90 md:via-[#FCF7F9]/40 to-transparent z-10 pointer-events-none" />
          
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover object-[center_right] opacity-90"
          >
            {/* Ajuste o nome do ficheiro de vídeo consoante o que tem na sua pasta public/video/ */}
            <source src="/video/seu-video-aqui.mp4" type="video/mp4" />
            Seu navegador não suporta vídeos.
          </video>
        </div>

        {/* ÁREA DO TEXTO (Alinhada à esquerda) */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-16 flex flex-col justify-center">
          <div className="max-w-2xl">
            <p className="text-[#E8A9B8] text-[12px] md:text-[14px] font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
              <span className="w-10 h-[2px] bg-[#E8A9B8] rounded-full"></span> 
              Apoio real para mães reais
            </p>
            
            <h1 className="text-[44px] md:text-[64px] font-bold text-[#1F3224] leading-[1.1] mb-6" style={{ fontFamily: 'Fraunces, serif' }}>
              Você não precisa <br className="hidden md:block" />
              enfrentar isso <span className="text-[#E8A9B8] italic">sozinha.</span>
            </h1>
            
            <p className="text-[18px] md:text-[20px] text-[#4F4F4F] leading-relaxed mb-10 max-w-lg">
              O Florável é um espaço seguro e acolhedor para apoiar a sua jornada na maternidade, com informação, escuta e cuidado.
            </p>
            
            <button className="bg-[#1F3224] hover:bg-[#516B55] text-white px-10 py-4 rounded-full text-[16px] md:text-[18px] font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-xl hover:shadow-[#1F3224]/30 w-full md:w-auto group">
              Começar minha jornada 
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. ESTATÍSTICAS (Cartão flutuante moderno) */}
      <div className="relative z-30 max-w-7xl mx-auto px-6 lg:px-16 -mt-16 mb-20">
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-[#E0E0E0]">
            
            <div className="flex flex-col items-start md:items-center text-left md:text-center pt-4 md:pt-0 px-4">
              <Heart className="text-[#E8A9B8] mb-3" size={28} />
              <h3 className="text-[#333333] font-bold text-[18px] mb-1" style={{ fontFamily: 'Fraunces, serif' }}>Cada sentimento importa</h3>
              <p className="text-[13px] text-[#828282] uppercase tracking-wider font-bold">Você também é importante</p>
            </div>

            <div className="flex flex-col items-start md:items-center text-left md:text-center pt-6 md:pt-0 px-4">
              <h2 className="text-[40px] font-bold text-[#E8A9B8] leading-none mb-2" style={{ fontFamily: 'Fraunces, serif' }}>+10.000</h2>
              <p className="text-[14px] text-[#4F4F4F] font-medium">Mães já se sentem mais acolhidas</p>
            </div>

            <div className="flex flex-col items-start md:items-center text-left md:text-center pt-6 md:pt-0 px-4">
              <h2 className="text-[40px] font-bold text-[#E8A9B8] leading-none mb-2" style={{ fontFamily: 'Fraunces, serif' }}>92%</h2>
              <p className="text-[14px] text-[#4F4F4F] font-medium">Relatam melhora no bem-estar</p>
            </div>

            <div className="flex flex-col items-start md:items-center text-left md:text-center pt-6 md:pt-0 px-4">
              <Clock className="text-[#E8A9B8] mb-3" size={28} />
              <h2 className="text-[24px] font-bold text-[#333333] leading-none mb-2" style={{ fontFamily: 'Fraunces, serif' }}>Apoio 24h</h2>
              <p className="text-[14px] text-[#4F4F4F] font-medium">Acesso a conteúdos e rede de apoio</p>
            </div>

          </div>
        </div>
      </div>
      
    </div>
  );
}