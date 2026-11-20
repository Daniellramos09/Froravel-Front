import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ShieldAlert, X, AlertTriangle, Heart, CheckCircle2, Lock, UserCheck } from 'lucide-react';

const isLocal = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
const API_BASE = import.meta.env.VITE_API_URL || (isLocal ? 'http://localhost:8080' : '');

const PARTICIPANTES_PADRAO_SALA = [
  { nome: 'Dra. Helena Souza', codigoPublico: 'FLR-PSI842' },
  { nome: 'Camila R. (Participante)', codigoPublico: 'FLR-C4T9P1' },
  { nome: 'Juliana M. (Participante)', codigoPublico: 'FLR-J7N2W8' },
];

export default function DenunciaModal({
  isOpen,
  onClose,
  targetUser = null,
  targetCodigoPublico = null,
  participants = null,
  context = 'Geral',
}) {
  const opcoesParticipantes = Array.isArray(participants) && participants.length > 0
    ? participants
    : PARTICIPANTES_PADRAO_SALA;

  const [alvoSelecionado, setAlvoSelecionado] = useState(targetUser || '');
  const [codigoPublicoAlvo, setCodigoPublicoAlvo] = useState(targetCodigoPublico || '');
  const [motivo, setMotivo] = useState('comentario_ofensivo');
  const [oQueFez, setOQueFez] = useState('');
  const [oQueSentiu, setOQueSentiu] = useState('');
  const [bloquearUsuario, setBloquearUsuario] = useState(true);
  const [enviado, setEnviado] = useState(false);
  const [protocolo, setProtocolo] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (targetUser && targetUser !== 'Participante na chamada') {
      setAlvoSelecionado(targetUser);
      setCodigoPublicoAlvo(targetCodigoPublico || '');
    } else if (!alvoSelecionado && opcoesParticipantes.length > 0) {
      setAlvoSelecionado(opcoesParticipantes[0].nome);
      setCodigoPublicoAlvo(opcoesParticipantes[0].codigoPublico || '');
    }
  }, [isOpen, targetUser, targetCodigoPublico]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!oQueFez.trim() || !oQueSentiu.trim()) return;

    const novoProtocolo = `DEN-${Date.now().toString().slice(-6)}`;
    setProtocolo(novoProtocolo);
    const alvoReportado = alvoSelecionado.trim() || targetUser || 'Conta não especificada';
    const codigoNormalizado = codigoPublicoAlvo.trim().toUpperCase();

    // Salva denúncia no histórico local para persistência de demonstração
    const novaDenuncia = {
      id: novoProtocolo,
      targetUser: alvoReportado,
      targetCodigoPublico: codigoNormalizado || null,
      context,
      motivo,
      oQueFez,
      oQueSentiu,
      bloquearUsuario,
      data: new Date().toISOString()
    };

    const existentes = JSON.parse(localStorage.getItem('floravel_denuncias') || '[]');
    localStorage.setItem('floravel_denuncias', JSON.stringify([novaDenuncia, ...existentes]));

    // Envia para API oficial Spring Boot usando o código público opaco (OWASP Dual-ID)
    try {
      const sessao = JSON.parse(localStorage.getItem('floravel_mae_sessao') || '{}');
      const token = localStorage.getItem('floravel_jwt');
      if (sessao?.usuarioId) {
        await fetch(`${API_BASE}/api/denuncias`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            denuncianteUsuarioId: sessao.usuarioId,
            denunciadoCodigoPublico: codigoNormalizado || null,
            motivo,
            oQueFez,
            oQueSentiu,
            bloquearUsuario,
          }),
        });
      }
    } catch (_) {}

    // Aciona o Disjuntor de Sala Ao Vivo (Room Circuit Breaker) via BroadcastChannel e API Spring Boot
    try {
      const bc = new BroadcastChannel('floravel_sala_ao_vivo');
      bc.postMessage({ type: 'DISJUNTOR_ACIONADO', alvo: alvoReportado, codigoPublico: codigoNormalizado });
      bc.close();
    } catch (_) {}

    try {
      await fetch(`${API_BASE}/api/sala-ao-vivo/disjuntor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alvo: alvoReportado, codigoPublico: codigoNormalizado })
      });
    } catch (_) {}

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

            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck size={14} className="text-[#294D33]" />
                  Quem você deseja reportar?
                </span>
                <span className="text-[11px] text-stone-500">{context}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select
                  value={alvoSelecionado}
                  onChange={(e) => {
                    const nome = e.target.value;
                    setAlvoSelecionado(nome);
                    const found = opcoesParticipantes.find((p) => p.nome === nome);
                    if (found?.codigoPublico) setCodigoPublicoAlvo(found.codigoPublico);
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {opcoesParticipantes.map((p) => (
                    <option key={p.nome} value={p.nome}>
                      {p.nome} {p.codigoPublico ? `(#${p.codigoPublico.replace(/^#/, '')})` : ''}
                    </option>
                  ))}
                  {targetUser && !opcoesParticipantes.some((p) => p.nome === targetUser) && (
                    <option value={targetUser}>{targetUser}</option>
                  )}
                </select>
                <input
                  type="text"
                  value={codigoPublicoAlvo}
                  onChange={(e) => setCodigoPublicoAlvo(e.target.value)}
                  placeholder="Código público (ex: #FLR-C4T9P1)"
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

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
