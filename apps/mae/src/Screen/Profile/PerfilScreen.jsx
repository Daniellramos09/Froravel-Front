import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Calendar, Baby, CheckCircle, Camera, Trash2, Sparkles, Copy, ShieldCheck, KeyRound, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { getApiBase, uploadProfilePhoto, fetchCurrentUserProfile, updateProfilePhotoUrl } from '@floravel/shared';

function extrairMensagemErro(errJson, fallback) {
  if (!errJson || typeof errJson !== 'object') return fallback;
  if (errJson.validationErrors && typeof errJson.validationErrors === 'object') {
    const primeira = Object.values(errJson.validationErrors).find(
      (msg) => typeof msg === 'string' && msg.trim().length > 0
    );
    if (primeira) return primeira;
  }
  if (errJson.message) return errJson.message;
  if (errJson.mensagem) return errJson.mensagem;
  return fallback;
}

export default function PerfilScreen({ onRedoOnboarding, onOpenDenuncia }) {
  const [nome, setNome] = useState('Mariana Silva');
  const [email, setEmail] = useState('mariana.silva@email.com');
  const [nascimento, setNascimento] = useState('1999-05-14');
  const [fase, setFase] = useState('Bebê de 2 meses');
  const [codigoPublico, setCodigoPublico] = useState('FLR-M8R4K2');
  const [avatar, setAvatar] = useState('/img/ilustracoes/florescer.jpg');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Fluxo de alteração de senha por código enviado no e-mail (/api/auth/esqueci-senha -> /api/auth/redefinir-senha)
  const [pwdStep, setPwdStep] = useState('idle'); // 'idle' | 'reset' | 'success'
  const [pwdCodigo, setPwdCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdInfo, setPwdInfo] = useState('');
  const pwdInFlightRef = useRef(false);

  useEffect(() => {
    try {
      const sessao = JSON.parse(localStorage.getItem('floravel_mae_sessao') || '{}');
      if (sessao?.nome) setNome(sessao.nome);
      if (sessao?.email) setEmail(sessao.email);
      if (sessao?.dataNascimento) setNascimento(sessao.dataNascimento);
      if (sessao?.fotoUrl) setAvatar(sessao.fotoUrl);
      if (sessao?.codigoPublico) setCodigoPublico(sessao.codigoPublico);
      else {
        const storedCode = localStorage.getItem('floravel_codigo_publico');
        if (storedCode) setCodigoPublico(storedCode);
      }
    } catch (_) {}

    const token = localStorage.getItem('floravel_jwt');
    const apiBase = getApiBase();
    if (token && apiBase) {
      fetchCurrentUserProfile({ apiBase, token })
        .then((me) => {
          if (!me) return;
          if (me.nome) setNome(me.nome);
          if (me.email) setEmail(me.email);
          if (me.codigoPublico) setCodigoPublico(me.codigoPublico);
          if (me.fotoUrl) setAvatar(me.fotoUrl);
        })
        .catch(() => {});
    }
  }, []);

  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError('');
    setUploadingPhoto(true);
    try {
      const token = localStorage.getItem('floravel_jwt');
      const apiBase = getApiBase();
      const result = await uploadProfilePhoto({ apiBase, file, token });
      const novaUrl = result.fotoUrl;
      setAvatar(novaUrl);
      try {
        const sessao = JSON.parse(localStorage.getItem('floravel_mae_sessao') || '{}');
        localStorage.setItem('floravel_mae_sessao', JSON.stringify({ ...sessao, fotoUrl: novaUrl }));
        window.dispatchEvent(new Event('floravel_sessao_atualizada'));
      } catch (_) {}
      setSaveMessage('Foto atualizada!');
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      setPhotoError(err?.message || 'Não foi possível enviar a foto.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    const defaultAvatar = '/img/ilustracoes/mae-bebe-tranquilidade.jpg';
    setPhotoError('');
    setAvatar(defaultAvatar);
    try {
      const token = localStorage.getItem('floravel_jwt');
      const apiBase = getApiBase();
      if (token && apiBase) {
        await updateProfilePhotoUrl({ apiBase, fotoUrl: defaultAvatar, token });
      }
      const sessao = JSON.parse(localStorage.getItem('floravel_mae_sessao') || '{}');
      localStorage.setItem('floravel_mae_sessao', JSON.stringify({ ...sessao, fotoUrl: defaultAvatar }));
      window.dispatchEvent(new Event('floravel_sessao_atualizada'));
    } catch (_) {}
    setSaveMessage('Foto restaurada para a padrão.');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const sessao = JSON.parse(localStorage.getItem('floravel_mae_sessao') || '{}');
      localStorage.setItem(
        'floravel_mae_sessao',
        JSON.stringify({ ...sessao, nome: nome.trim() || sessao.nome, email: email.trim() || sessao.email, dataNascimento: nascimento })
      );
      window.dispatchEvent(new Event('floravel_sessao_atualizada'));
    } catch (_) {}
    setSaveMessage('Informações do perfil atualizadas com sucesso! 🌸');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  const handleSolicitarCodigoSenha = async () => {
    if (pwdInFlightRef.current) return;
    setPwdError('');
    setPwdInfo('');

    const emailLimpo = String(email || '').trim().toLowerCase();
    if (!emailLimpo || !emailLimpo.includes('@')) {
      setPwdError('Informe um e-mail válido no seu perfil para receber o código.');
      return;
    }

    const apiBase = getApiBase();
    if (!apiBase) {
      setPwdError('Servidor de autenticação indisponível neste ambiente.');
      return;
    }

    pwdInFlightRef.current = true;
    setPwdLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/auth/esqueci-senha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLimpo }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPwdError(extrairMensagemErro(data, 'Não foi possível enviar o código para o e-mail.'));
        return;
      }
      setPwdInfo(
        data.mensagem ||
          `Enviamos um código de 6 dígitos para ${emailLimpo}. Verifique sua caixa de entrada ou spam.`
      );
      setPwdStep('reset');
    } catch {
      setPwdError('Não foi possível conectar ao servidor para enviar o código.');
    } finally {
      pwdInFlightRef.current = false;
      setPwdLoading(false);
    }
  };

  const handleConfirmarAlteracaoSenha = async (e) => {
    e.preventDefault();
    if (pwdInFlightRef.current) return;
    setPwdError('');

    const emailLimpo = String(email || '').trim().toLowerCase();
    const codigoLimpo = pwdCodigo.trim();

    if (!/^\d{6}$/.test(codigoLimpo)) {
      setPwdError('Informe o código numérico de 6 dígitos enviado para o seu e-mail.');
      return;
    }
    if (novaSenha.length < 6) {
      setPwdError('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (novaSenha !== confirmarNovaSenha) {
      setPwdError('As senhas não conferem. Verifique e tente novamente.');
      return;
    }

    const apiBase = getApiBase();
    if (!apiBase) {
      setPwdError('Servidor de autenticação indisponível neste ambiente.');
      return;
    }

    pwdInFlightRef.current = true;
    setPwdLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/auth/redefinir-senha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailLimpo,
          codigo: codigoLimpo,
          novaSenha,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPwdError(extrairMensagemErro(data, 'Código inválido ou expirado.'));
        return;
      }

      setPwdCodigo('');
      setNovaSenha('');
      setConfirmarNovaSenha('');
      setPwdInfo('');
      setPwdStep('success');
    } catch {
      setPwdError('Não foi possível conectar ao servidor para alterar a senha.');
    } finally {
      pwdInFlightRef.current = false;
      setPwdLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn font-dmsans max-w-4xl pb-10">
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
        {photoError && (
          <div className="mb-6 p-4 rounded-2xl bg-[#FDE8E8] border border-red-200 text-[#9B1C1C] text-sm font-semibold">
            {photoError}
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
            <p className="text-[16px] text-gray3 mb-2">Mãe • {fase}</p>

            <div className="mb-4 flex flex-wrap items-center justify-center md:justify-start gap-2">
              <button
                type="button"
                onClick={() => {
                  const formatted = `#${String(codigoPublico || 'FLR-M8R4K2').replace(/^#/, '')}`;
                  navigator.clipboard?.writeText(formatted).catch(() => {});
                  setSaveMessage(`Código público ${formatted} copiado!`);
                  setIsSaved(true);
                  setTimeout(() => setIsSaved(false), 3000);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF3ED] border border-[#294D33]/20 text-xs font-bold text-[#294D33] hover:bg-[#dceadf] transition cursor-pointer"
                title="Identificador público opaco: protege seu CPF e UUID interno"
              >
                <ShieldCheck size={14} />
                <span>Código Público:</span>
                <span className="font-mono">#{String(codigoPublico || 'FLR-M8R4K2').replace(/^#/, '')}</span>
                <Copy size={12} className="opacity-70" />
              </button>
              <span className="text-[11px] text-gray3">
                (protege seu CPF e ID interno em rodas e denúncias)
              </span>
            </div>

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

      {/* SEÇÃO DE SEGURANÇA: ALTERAÇÃO DE SENHA VIA CÓDIGO POR E-MAIL */}
      <div className="mt-8 bg-white p-8 md:p-10 rounded-3xl border border-gray5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-secondary text-[12px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <KeyRound size={14} /> Segurança da Conta
            </p>
            <h2 className="text-[22px] font-fraunces font-bold text-gray1">Trocar senha</h2>
            <p className="text-sm text-gray2 mt-1">
              Enviaremos um código de 6 dígitos para <span className="font-semibold text-gray1">{email}</span> confirmar a alteração.
            </p>
          </div>

          {pwdStep === 'idle' && (
            <button
              type="button"
              onClick={handleSolicitarCodigoSenha}
              disabled={pwdLoading}
              className="border border-primary text-primary hover:bg-superficie px-6 py-3 rounded-full text-sm font-bold transition cursor-pointer shrink-0 disabled:opacity-60"
            >
              {pwdLoading ? 'Enviando código...' : 'Enviar código para meu e-mail'}
            </button>
          )}
        </div>

        {pwdError && (
          <div className="mb-5 p-4 rounded-2xl bg-[#FDE8E8] border border-red-200 text-[#9B1C1C] text-sm font-semibold">
            {pwdError}
          </div>
        )}

        {pwdInfo && pwdStep === 'reset' && (
          <div className="mb-5 p-4 rounded-2xl bg-[#EBF3ED] border border-[#294D33]/25 text-[#294D33] text-sm font-semibold">
            {pwdInfo}
          </div>
        )}

        {pwdStep === 'reset' && (
          <form onSubmit={handleConfirmarAlteracaoSenha} className="space-y-5 pt-2 border-t border-gray5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
              <div>
                <label className="block text-[12px] font-bold text-gray3 uppercase mb-2">
                  Código de 6 dígitos
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={pwdCodigo}
                  onChange={(e) => setPwdCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full bg-fundo border border-gray5 rounded-2xl px-5 py-3.5 text-center tracking-[0.25em] font-bold text-gray1 focus:outline-none focus:border-primary transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray3 uppercase mb-2">
                  Nova senha (mín. 6)
                </label>
                <div className="relative">
                  <input
                    type={mostrarNovaSenha ? 'text' : 'password'}
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-fundo border border-gray5 rounded-2xl px-5 py-3.5 pr-12 text-gray1 focus:outline-none focus:border-primary transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarNovaSenha((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray3 hover:text-gray1 cursor-pointer"
                    aria-label="Mostrar ou ocultar nova senha"
                  >
                    {mostrarNovaSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray3 uppercase mb-2">
                  Confirmar nova senha
                </label>
                <input
                  type={mostrarNovaSenha ? 'text' : 'password'}
                  value={confirmarNovaSenha}
                  onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                  placeholder="••••••"
                  className="w-full bg-fundo border border-gray5 rounded-2xl px-5 py-3.5 text-gray1 focus:outline-none focus:border-primary transition"
                  required
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleSolicitarCodigoSenha}
                  disabled={pwdLoading}
                  className="text-xs font-bold text-[#294D33] hover:underline flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  <RefreshCw size={13} />
                  <span>Reenviar código</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPwdStep('idle');
                    setPwdError('');
                    setPwdInfo('');
                    setPwdCodigo('');
                    setNovaSenha('');
                    setConfirmarNovaSenha('');
                  }}
                  className="text-xs font-semibold text-gray3 hover:text-gray1 cursor-pointer"
                >
                  Cancelar
                </button>
              </div>

              <button
                type="submit"
                disabled={pwdLoading}
                className="bg-primary hover:bg-apoio text-fundo px-8 py-3.5 rounded-full text-sm font-bold transition shadow-sm cursor-pointer disabled:opacity-60"
              >
                {pwdLoading ? 'Salvando nova senha...' : 'Confirmar nova senha'}
              </button>
            </div>
          </form>
        )}

        {pwdStep === 'success' && (
          <div className="p-5 rounded-2xl bg-[#EBF3ED] border border-[#294D33]/30 text-[#294D33] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="shrink-0 text-[#294D33]" />
              <p className="text-sm font-semibold">
                Senha alterada com sucesso! Use sua nova senha no próximo login.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPwdStep('idle')}
              className="text-xs font-bold underline cursor-pointer shrink-0"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
