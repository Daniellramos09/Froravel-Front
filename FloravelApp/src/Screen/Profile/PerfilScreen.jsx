import React from 'react';
import { User, Mail, Calendar, Baby } from 'lucide-react';

export default function PerfilScreen() {
  return (
    <div className="animate-fadeIn font-dmsans max-w-4xl h-full">
      {/* Cabeçalho */}
      <div className="mb-10">
        <p className="text-secondary text-[14px] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
          <User size={16} /> O SEU ESPAÇO
        </p>
        <h1 className="text-[32px] md:text-[40px] font-fraunces font-bold text-primary mb-2">Meu Perfil</h1>
        <p className="text-gray2 text-[18px]">Faça a gestão das suas informações e preferências pessoais.</p>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray5 shadow-sm">
        
        {/* Secção da Foto de Perfil */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 pb-10 border-b border-gray5 text-center md:text-left">
          <div className="relative w-28 h-28 rounded-full overflow-hidden shadow-md border-2 border-primary/20 shrink-0 bg-[#F4DDE5]">
            <img
              src="/img/fotomae/fotomae.jpg"
              alt="Mariana Silva"
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/img/fotomae/fotomae1.jpg";
              }}
            />
          </div>
          <div className="mt-2">
            <h2 className="text-[28px] font-fraunces font-bold text-gray1">Mariana Silva</h2>
            <p className="text-[16px] text-gray3 mb-4">Mãe • Bebé de 2 meses</p>
            <div className="flex gap-3 justify-center md:justify-start">
              <button className="text-[14px] font-bold text-primary border border-primary px-6 py-2.5 rounded-full hover:bg-superficie transition">
                Alterar foto
              </button>
              <button className="text-[14px] font-bold text-error hover:underline px-4 py-2.5">
                Remover
              </button>
            </div>
          </div>
        </div>

        {/* Formulário de Dados */}
        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div>
              <label className="block text-[13px] font-bold text-gray3 uppercase mb-2 flex items-center gap-2">
                <User size={14}/> Nome Completo
              </label>
              <input 
                type="text" 
                defaultValue="Mariana Silva" 
                className="w-full bg-fundo border border-gray5 rounded-2xl px-5 py-4 text-[16px] text-gray1 focus:outline-none focus:border-primary transition" 
              />
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray3 uppercase mb-2 flex items-center gap-2">
                <Mail size={14}/> E-mail
              </label>
              <input 
                type="email" 
                defaultValue="mariana.silva@email.com" 
                className="w-full bg-fundo border border-gray5 rounded-2xl px-5 py-4 text-[16px] text-gray1 focus:outline-none focus:border-primary transition" 
              />
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray3 uppercase mb-2 flex items-center gap-2">
                <Calendar size={14}/> Data de Nascimento
              </label>
              <input 
                type="date" 
                defaultValue="1999-05-14" 
                className="w-full bg-fundo border border-gray5 rounded-2xl px-5 py-4 text-[16px] text-gray1 focus:outline-none focus:border-primary transition" 
              />
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray3 uppercase mb-2 flex items-center gap-2">
                <Baby size={14}/> Fase da Maternidade
              </label>
              <select className="w-full bg-fundo border border-gray5 rounded-2xl px-5 py-4 text-[16px] text-gray1 focus:outline-none focus:border-primary transition appearance-none">
                <option>Bebé de 2 meses</option>
                <option>Gestante</option>
                <option>Bebé de 6+ meses</option>
              </select>
            </div>

          </div>
          
          <div className="pt-6 border-t border-gray5 flex justify-end">
            <button type="button" className="bg-primary hover:bg-apoio text-fundo px-10 py-4 rounded-full text-[16px] font-bold transition shadow-sm w-full md:w-auto">
              Salvar Alterações
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}