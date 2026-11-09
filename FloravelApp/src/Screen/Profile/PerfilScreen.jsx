import React, { useState, useRef } from 'react';
import { User, Mail, Calendar, Baby, CheckCircle, Camera, Trash2, Sparkles, ShieldAlert } from 'lucide-react';

export default function PerfilScreen({ onRedoOnboarding, onOpenDenuncia }) {
  const [nome, setNome] = useState('Mariana Silva');
  const [email, setEmail] = useState('mariana.silva@email.com');
  const [nascimento, setNascimento] = useState('1999-05-14');
  const [fase, setFase] = useState('Bebê de 2 meses');
  const [avatar, setAvatar] = useState('/img/fotomae/6.jpg');
  const [isSaved, setIsSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
      setSaveMessage('Foto atualizada!');
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handleRemovePhoto = () => {
    setAvatar('/img/fotomae/fotomae1.jpg');
    setSaveMessage('Foto restaurada para a padrão.');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaveMessage('Informações do perfil atualizadas com sucesso! 🌸');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  return (
    <div className="animate-fadeIn font-dmsans max-w-4xl h-full pb-16">
      <div className="mb-10">
        <p className="text-secondary text-[14px] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
          <User size={16} /> O SEU ESPAÇO
        </p>
        <h1 className="text-[32px] md:text-[40px] font-fraunces font-bold text-primary mb-2">Meu Perfil</h1>
        <p className="text-gray2 text-[18px]">Faça a gestão das suas informações e preferências pessoais.</p>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray5 shadow-sm relative">
        {isSaved && (
          <div className="mb-6 p-4 rounded-2xl bg-[#EBF3ED] border border-[#294D33]/30 text-[#294D33] flex items-center gap-3 animate-fadeIn">
            <CheckCircle size={20} className="shrink-0 text-[#294D33]" />
            <p className="text-sm font-semibold">{saveMessage}</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 pb-10 border-b border-gray5 text-center md:text-left">
          <div className="relative w-28 h-28 rounded-full overflow-hidden shadow-md border-2 border-primary/20 shrink-0 bg-[#F4DDE5]">
            <img
              src={avatar}
              alt={nome}
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="mt-2">
            <h2 className="text-[28px] font-fraunces font-bold text-gray1">{nome}</h2>
            <p className="text-[16px] text-gray3 mb-4">Mãe • {fase}</p>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            <div className="flex gap-3 justify-center md:justify-start">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[14px] font-bold text-primary border border-primary px-6 py-2.5 rounded-full hover:bg-superficie transition cursor-pointer flex items-center gap-2"
              >
                <Camera size={16} />
                <span>Alterar foto</span>
              </button>
              <button 
                type="button"
                onClick={handleRemovePhoto}
                className="text-[14px] font-bold text-error hover:underline px-4 py-2.5 cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 size={16} />
                <span>Remover</span>
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[13px] font-bold text-gray3 uppercase mb-2 flex items-center gap-2">
                <User size={14}/> Nome Completo
              </label>
              <input 
                type="text" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-fundo border border-gray5 rounded-2xl px-5 py-4 text-[16px] text-gray1 focus:outline-none focus:border-primary transition" 
                required
              />
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray3 uppercase mb-2 flex items-center gap-2">
                <Mail size={14}/> E-mail
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-fundo border border-gray5 rounded-2xl px-5 py-4 text-[16px] text-gray1 focus:outline-none focus:border-primary transition" 
                required
              />
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray3 uppercase mb-2 flex items-center gap-2">
                <Calendar size={14}/> Data de Nascimento
              </label>
              <input 
                type="date" 
                value={nascimento}
                onChange={(e) => setNascimento(e.target.value)}
                className="w-full bg-fundo border border-gray5 rounded-2xl px-5 py-4 text-[16px] text-gray1 focus:outline-none focus:border-primary transition" 
              />
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray3 uppercase mb-2 flex items-center gap-2">
                <Baby size={14}/> Fase da Maternidade
              </label>
              <select 
                value={fase}
                onChange={(e) => setFase(e.target.value)}
                className="w-full bg-fundo border border-gray5 rounded-2xl px-5 py-4 text-[16px] text-gray1 focus:outline-none focus:border-primary transition appearance-none"
              >
                <option>Bebê de 2 meses</option>
                <option>Gestante</option>
                <option>Bebê de 6+ meses</option>
                <option>Tentante</option>
              </select>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              {onRedoOnboarding && (
                <button
                  type="button"
                  onClick={onRedoOnboarding}
                  className="text-[#294D33] font-bold hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles size={14} />
                  <span>Refazer questionário de primeiro acesso</span>
                </button>
              )}
              {onOpenDenuncia && (
                <button
                  type="button"
                  onClick={onOpenDenuncia}
                  className="text-red-600 font-bold hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldAlert size={14} />
                  <span>Reportar / Denunciar conta</span>
                </button>
              )}
            </div>

            <button 
              type="submit" 
              className="bg-primary hover:bg-apoio text-fundo px-10 py-4 rounded-full text-[16px] font-bold transition shadow-sm w-full sm:w-auto cursor-pointer"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
