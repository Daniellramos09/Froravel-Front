import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ShieldAlert, X, AlertTriangle, Heart, CheckCircle2, Lock } from 'lucide-react';

export default function DenunciaModal({ isOpen, onClose, targetUser = null, context = 'Geral' }) {
  const [motivo, setMotivo] = useState('comentario_ofensivo');
  const [oQueFez, setOQueFez] = useState('');
  const [oQueSentiu, setOQueSentiu] = useState('');
  const [bloquearUsuario, setBloquearUsuario] = useState(true);
  const [enviado, setEnviado] = useState(false);
  const [protocolo, setProtocolo] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!oQueFez.trim() || !oQueSentiu.trim()) return;

    const novoProtocolo = `DEN-${Date.now().toString().slice(-6)}`;
    setProtocolo(novoProtocolo);

    // Salva denúncia no histórico local para persistência de demonstração
    const novaDenuncia = {
      id: novoProtocolo,
      targetUser: targetUser || 'Usuária em reunião',
      context,
      motivo,
      oQueFez,
      oQueSentiu,
      bloquearUsuario,
      data: new Date().toISOString()
    };

    const existentes = JSON.parse(localStorage.getItem('floravel_denuncias') || '[]');
    localStorage.setItem('floravel_denuncias', JSON.stringify([novaDenuncia, ...existentes]));

    setEnviado(true);
  };

  const handleClose = () => {
    setEnviado(false);
    setOQueFez('');
    setOQueSentiu('');
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn font-dmsans">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-100 max-h-[92vh] overflow-y-auto text-[#2B2829]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <ShieldAlert size={22} />
            </div>
            <div>
              <h3 className="text-xl font-fraunces font-bold text-stone-900">Canal Seguro de Denúncia</h3>
              <p className="text-xs text-stone-500">Espaço confidencial para sua proteção</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {enviado ? (
          <div className="py-8 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 size={36} />
            </div>
            <h4 className="text-2xl font-fraunces font-bold text-stone-900">Denúncia registrada com acolhimento</h4>
            <p className="text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
              Agradecemos por nos alertar. A sua segurança emocional é a prioridade absoluta da Florável.
              Nossa equipe de moderação e psicologia vai avaliar o ocorrido com sigilo imediato.
            </p>
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 inline-block text-xs font-mono text-stone-700">
              Protocolo: <span className="font-bold text-red-600">{protocolo}</span>
            </div>
            {bloquearUsuario && (
              <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 py-2 px-3 rounded-xl inline-block">
                ✓ A conta foi bloqueada para você e não poderá interagir nas suas salas.
              </p>
            )}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3.5 px-6 rounded-full bg-[#294D33] text-white font-bold hover:bg-[#1f3c27] transition shadow-xs"
              >
                Entendido e fechar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="p-3 bg-red-50/70 border border-red-100 rounded-2xl flex items-start gap-2.5 text-xs text-red-800 leading-relaxed">
              <AlertTriangle size={18} className="shrink-0 text-red-600 mt-0.5" />
              <span>
                Você tem o direito inegociável de ser respeitada. Comentários preconceituosos, ofensas ou xingamentos resultam em banimento imediato da conta infratora.
              </span>
            </div>

            {targetUser && (
              <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                Denunciando: <strong className="text-stone-900">{targetUser}</strong> ({context})
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                O que aconteceu? (Categoria)
              </label>
              <select
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="xingamento_ligacao">Xingamento ou ofensa verbal por ligação/reunião</option>
                <option value="comentario_ofensivo">Comentário ofensivo no chat ou comunidade</option>
                <option value="desrespeito_maternidade">Julgamento agressivo ou invalidação da maternidade</option>
                <option value="assedio">Assédio moral ou intimidação</option>
                <option value="conduta_antietica">Conduta antiética ou inadequada de profissional</option>
                <option value="outro">Outro comportamento abusivo</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                O que a pessoa fez? (Descreva o ocorrido) *
              </label>
              <textarea
                rows={3}
                required
                value={oQueFez}
                onChange={(e) => setOQueFez(e.target.value)}
                placeholder="Ex: Durante a reunião em grupo, a pessoa usou palavras ofensivas e me desrespeitou após meu desabafo..."
                className="w-full p-3 text-sm rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Heart size={14} className="text-red-500" />
                Como você se sentiu com essa atitude? *
              </label>
              <textarea
                rows={3}
                required
                value={oQueSentiu}
                onChange={(e) => setOQueSentiu(e.target.value)}
                placeholder="Ex: Me senti desamparada, ansiosa e com vergonha de continuar falando na sala..."
                className="w-full p-3 text-sm rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id="blockUser"
                checked={bloquearUsuario}
                onChange={(e) => setBloquearUsuario(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded-md border-stone-300 focus:ring-red-500"
              />
              <label htmlFor="blockUser" className="text-xs text-stone-700 cursor-pointer">
                Bloquear este usuário para não participar mais de reuniões comigo.
              </label>
            </div>

            <div className="pt-3 flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 rounded-full border border-stone-200 text-stone-700 text-sm font-bold hover:bg-stone-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-full bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition shadow-sm flex items-center justify-center gap-2"
              >
                <Lock size={15} />
                Enviar denúncia segura
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
