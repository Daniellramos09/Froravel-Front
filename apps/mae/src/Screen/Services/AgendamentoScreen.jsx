import React, { useState } from 'react';
import { Calendar, ArrowRight, Video, ShieldAlert } from 'lucide-react';
import MeetingRoomModal from '../../Components/Meeting/MeetingRoomModal';
import DenunciaModal from '../../Components/Safety/DenunciaModal';

export default function AgendamentoScreen({ setActiveTab, agendamentos, cancelarAgendamento }) {
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [isDenunciaOpen, setIsDenunciaOpen] = useState(false);

  const handleEntrarSessao = (agendamento) => {
    setSelectedMeeting(agendamento);
    setIsRoomOpen(true);
  };

  return (
    <div className="animate-fadeIn font-dmsans h-full max-w-4xl">
      {/* SALA DE REUNIÃO INTERNA */}
      {isRoomOpen && selectedMeeting && (
        <MeetingRoomModal
          isOpen={isRoomOpen}
          onClose={() => setIsRoomOpen(false)}
          meetingTitle={`Sessão Individual: ${selectedMeeting.profName}`}
          therapistName={selectedMeeting.profName}
          meetingType="Acolhimento Individual Online"
        />
      )}

      {/* MODAL DE DENÚNCIA */}
      <DenunciaModal
        isOpen={isDenunciaOpen}
        onClose={() => setIsDenunciaOpen(false)}
        targetUser={selectedMeeting?.profName || 'Profissional da consulta'}
        context="Consulta Individual Agendada"
      />

      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-apoio text-[13px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-2">
            <Calendar size={16} /> SEU TEMPO DE CUIDADO
          </p>
          <h1 className="text-[32px] md:text-[40px] font-fraunces font-bold text-primary mb-1">
            Meus Agendamentos
          </h1>
          <p className="text-gray2 text-[16px]">
            Seus próximos encontros de escuta e acolhimento in-app.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsDenunciaOpen(true)}
          className="self-start text-xs text-stone-500 hover:text-red-600 flex items-center gap-1.5 p-2 rounded-xl hover:bg-red-50 transition"
        >
          <ShieldAlert size={14} className="text-red-500" />
          <span>Canal de denúncias</span>
        </button>
      </div>

      {agendamentos && agendamentos.length > 0 ? (
        <div className="space-y-4">
          {agendamentos.map((agendamento) => (
            <div 
              key={agendamento.id} 
              className="bg-white p-7 rounded-3xl border border-gray5 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition"
            >
              <div className="flex items-center gap-5 w-full md:w-auto">
                <div className="w-16 h-16 rounded-2xl bg-[#EEF2E6] text-apoio flex items-center justify-center shrink-0">
                  <Calendar size={28} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-apoio mb-0.5">{agendamento.type}</p>
                  <h3 className="text-[20px] font-fraunces font-bold text-gray1 mb-1">{agendamento.profName}</h3>
                  <p className="text-[14px] text-gray3 flex items-center gap-2 mb-2">
                    {agendamento.date} · {agendamento.time} · <strong>Sala Florável Meet</strong>
                  </p>
                  <span className="inline-flex px-3 py-0.5 bg-[#EEF2E6] text-[#294D33] text-[11px] font-bold uppercase tracking-wider rounded-full">
                    • {agendamento.status || 'Confirmado'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => handleEntrarSessao(agendamento)}
                  className="flex-1 md:flex-none px-6 py-3 rounded-full bg-[#294D33] text-white text-[14px] font-bold hover:bg-[#1f3c27] transition shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Video size={16} />
                  <span>Entrar na Sessão</span>
                </button>

                <button 
                  onClick={() => cancelarAgendamento(agendamento.id)}
                  className="px-5 py-3 rounded-full border border-gray4 text-gray1 text-[13px] font-bold hover:bg-error/10 hover:text-error hover:border-error/20 transition cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ))}

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-[12px] text-gray4 border-t border-gray5 pt-6 gap-2">
            <span>❀ Florável · Cuidar de você é cuidar da vida.</span>
            <span className="flex items-center gap-1">Videochamadas 100% integradas e confidenciais</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center mt-12 bg-white p-10 rounded-3xl border border-stone-200">
          <div className="w-20 h-20 rounded-3xl bg-superficie text-primary flex items-center justify-center mb-5 shadow-xs">
            <Calendar size={36} />
          </div>
          <h3 className="text-[22px] font-fraunces font-bold text-primary mb-2">Seu próximo cuidado começa aqui</h3>
          <p className="text-[15px] text-gray2 mb-6 max-w-sm leading-relaxed">
            Você ainda não tem encontros agendados. Quando estiver pronta, sua rede de psicólogas está por perto.
          </p>
          <button
            onClick={() => setActiveTab('network')}
            className="bg-primary hover:bg-apoio text-fundo px-8 py-3.5 rounded-full text-[15px] font-bold flex items-center gap-2 transition shadow-sm cursor-pointer"
          >
            Agendar acolhimento <ArrowRight size={17} />
          </button>
        </div>
      )}
    </div>
  );
}
