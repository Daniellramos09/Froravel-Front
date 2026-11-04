import React, { useState } from 'react';
import { Search, HeartHandshake, Video, ArrowRight, Calendar, Clock, CheckCircle } from 'lucide-react';

// DADOS SIMULADOS (No futuro, isto virá do Spring Boot: /api/profissionais)
const PROFISSIONAIS_MOCK = [
  { id: 1, initials: 'HS', name: 'Dra. Helena Souza', spec: 'Psicologia Perinatal', desc: 'Espaço de escuta para as transformações da maternidade.', bgInitials: 'bg-superficie', colorInitials: 'text-secondary' },
  { id: 2, initials: 'CS', name: 'Dra. Camila Santos', spec: 'Acolhimento Luto', desc: 'Acolhimento sensível para atravessar perdas e encontrar apoio.', bgInitials: 'bg-[#EEF2E6]', colorInitials: 'text-apoio' },
  { id: 3, initials: 'RL', name: 'Dr. Rafael Lima', spec: 'Triagem', desc: 'Escuta inicial e direcionamento para sentimentos no puerpério.', bgInitials: 'bg-fundo', colorInitials: 'text-primary' },
];

const FilterPill = ({ text, active, onClick }) => (
  <button onClick={onClick} className={`px-6 py-3 rounded-full text-[14px] font-bold whitespace-nowrap border transition ${
    active ? 'bg-superficie border-superficie text-primary' : 'bg-white border-gray5 text-gray3 hover:border-gray4'
  }`}>
    {text}
  </button>
);

export default function ApoioScreen({ setActiveTab }) {
  const [activeFilter, setActiveFilter] = useState('Todas');
  const [selectedProfId, setSelectedProfId] = useState(null); // Controla de quem é a agenda aberta
  const [bookingSuccess, setBookingSuccess] = useState(false); // Feedback de sucesso

  // Filtra os profissionais com base no filtro selecionado
  const profissionaisFiltrados = activeFilter === 'Todas' 
    ? PROFISSIONAIS_MOCK 
    : PROFISSIONAIS_MOCK.filter(p => p.spec === activeFilter);

  // Simula o agendamento de uma sessão
  const handleAgendar = () => {
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedProfId(null);
      // Opcional: redirecionar para a aba de agendamentos após marcar
      // setActiveTab('booking'); 
    }, 3000);
  };

  return (
    <div className="animate-fadeIn font-dmsans h-full">
      <div className="mb-10">
        <p className="text-secondary text-[14px] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
          <HeartHandshake size={16} /> ESCUTA QUE ACOLHE
        </p>
        <h1 className="text-[32px] md:text-[40px] font-fraunces font-bold text-primary mb-2">Sua rede de apoio</h1>
        <p className="text-gray2 text-[18px]">Encontre alguém para caminhar com você. No seu tempo, do seu jeito.</p>
      </div>

      <div className="relative mb-8 max-w-3xl">
        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray3" size={20} />
        <input 
          type="text" 
          placeholder="Buscar por nome ou especialidade" 
          className="w-full bg-white border border-gray5 rounded-2xl py-4 pl-14 pr-6 text-[16px] focus:outline-none focus:border-primary shadow-sm"
        />
      </div>

      {/* FUNCIONAL: Ao clicar altera o estado */}
      <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        {['Todas', 'Psicologia Perinatal', 'Acolhimento Luto', 'Triagem'].map(filtro => (
          <FilterPill 
            key={filtro} 
            text={filtro} 
            active={activeFilter === filtro} 
            onClick={() => { setActiveFilter(filtro); setSelectedProfId(null); }} 
          />
        ))}
      </div>

      <div className="space-y-6">
        {profissionaisFiltrados.map((prof) => (
          <div key={prof.id} className="bg-white p-8 rounded-3xl border border-gray5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-sm transition">
            <div className="flex items-start gap-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-[22px] font-bold shrink-0 font-fraunces ${prof.bgInitials} ${prof.colorInitials}`}>
                {prof.initials}
              </div>
              <div>
                <h3 className="text-[22px] font-fraunces font-bold text-gray1">{prof.name}</h3>
                <p className={`text-[14px] font-bold mb-3 ${prof.colorInitials}`}>{prof.spec}</p>
                <p className="text-[16px] text-gray3 leading-relaxed max-w-2xl mb-4">{prof.desc}</p>
                <p className="text-[13px] text-gray3 flex items-center gap-1.5 font-medium">
                  <Video size={16} /> Online • Atendimento social
                </p>
              </div>
            </div>
            
            <div className="w-full md:w-auto flex flex-col items-end shrink-0">
              {/* Botão abre/fecha a agenda */}
              <button 
                onClick={() => setSelectedProfId(selectedProfId === prof.id ? null : prof.id)}
                className={`px-6 py-3 rounded-full border text-[15px] font-bold flex items-center gap-2 transition w-full md:w-auto justify-center ${
                  selectedProfId === prof.id ? 'bg-primary text-white border-primary' : 'border-gray4 text-gray1 hover:bg-fundo'
                }`}
              >
                {selectedProfId === prof.id ? 'Fechar agenda' : 'Ver agenda'} <Calendar size={18} />
              </button>
            </div>
          </div>
        ))}

        {/* ÁREA DA AGENDA (Abre abaixo do profissional clicado) */}
        {selectedProfId && (
          <div className="bg-fundo p-8 rounded-3xl border border-gray5 mt-2 animate-fadeIn shadow-inner">
            <h4 className="font-fraunces font-bold text-gray1 text-[20px] mb-6">Horários disponíveis</h4>
            
            {bookingSuccess ? (
              <div className="bg-success/10 text-success p-6 rounded-2xl flex items-center justify-center gap-3 font-bold text-[16px]">
                <CheckCircle size={24} /> Encontro agendado com sucesso!
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['14:00', '15:30', '17:00', '18:30'].map(hora => (
                  <button key={hora} onClick={handleAgendar} className="bg-white border border-gray4 hover:border-primary hover:text-primary py-4 rounded-2xl flex flex-col items-center justify-center gap-1 transition group shadow-sm">
                    <Clock size={18} className="text-gray3 group-hover:text-primary" />
                    <span className="font-bold text-gray1 group-hover:text-primary">Amanhã</span>
                    <span className="text-[14px] text-gray3">{hora}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {profissionaisFiltrados.length === 0 && (
          <div className="text-center p-10 text-gray3">Nenhum profissional encontrado para este filtro.</div>
        )}
      </div>
    </div>
  );
}