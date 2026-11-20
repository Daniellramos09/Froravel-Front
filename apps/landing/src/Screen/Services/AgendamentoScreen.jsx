import React from 'react';
import { Calendar, ArrowRight, Video } from 'lucide-react';

export default function AgendamentoScreen({ setActiveTab, agendamentos, cancelarAgendamento }) {
  
  return (
    <div className="animate-fadeIn font-dmsans h-full max-w-4xl">
      <div className="mb-10">
        <p className="text-apoio text-[14px] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
          <Calendar size={16} /> SEU TEMPO DE CUIDADO
        </p>
        <h1 className="text-[32px] md:text-[40px] font-fraunces font-bold text-primary mb-2">Meus agendamentos</h1>
        <p className="text-gray2 text-[18px]">Seus próximos encontros de escuta e acolhimento.</p>
      </div>

      {agendamentos && agendamentos.length > 0 ? (
        <div className="space-y-4">
          {agendamentos.map((agendamento) => (
            <div key={agendamento.id} className="bg-white p-8 rounded-3xl border border-gray5 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-sm transition">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-[#EEF2E6] text-apoio flex items-center justify-center shrink-0">
                  <Calendar size={28} />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-apoio mb-1">{agendamento.type}</p>
                  <h3 className="text-[22px] font-fraunces font-bold text-gray1 mb-2">{agendamento.profName}</h3>
                  <p className="text-[15px] text-gray3 flex items-center gap-2 mb-3">
                     {agendamento.date} · {agendamento.time} · Online
                  </p>
                  <span className="inline-flex px-3 py-1 bg-[#EEF2E6] text-apoio text-[11px] font-bold uppercase tracking-wider rounded-full">
                     • {agendamento.status}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => cancelarAgendamento(agendamento.id)}
                className="px-6 py-3 rounded-full border border-gray4 text-gray1 text-[15px] font-bold hover:bg-error/10 hover:text-error hover:border-error/20 transition w-full md:w-auto text-center"
              >
                Cancelar
              </button>
            </div>
          ))}

          <div className="mt-8 flex items-center justify-between text-[12px] text-gray4 border-t border-gray5 pt-6">
             <span>❀ Florável · Cuidar de você é cuidar da vida.</span>
             <span className="flex items-center gap-1">Ambiente de demonstração · Seus dados não são salvos</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center mt-20">
          <div className="w-20 h-20 rounded-3xl bg-superficie text-primary flex items-center justify-center mb-6 shadow-sm">
            <Calendar size={40} />
          </div>
          <h3 className="text-[24px] font-fraunces font-bold text-primary mb-2">Seu próximo cuidado começa aqui</h3>
          <p className="text-[16px] text-gray2 mb-8 max-w-sm leading-relaxed">
            Você ainda não tem encontros agendados. Quando estiver pronta, sua rede está por perto.
          </p>
          <button
            onClick={() => setActiveTab('network')}
            className="bg-primary hover:bg-apoio text-fundo px-8 py-4 rounded-full text-[16px] font-bold flex items-center gap-2 transition shadow-sm"
          >
            Agendar acolhimento <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}