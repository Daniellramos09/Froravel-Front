import { useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, MailCheck, RefreshCw, Sparkles } from 'lucide-react';
import { getApiBase, navigateToApp } from '../../utils/appLinks';

const LOGO = '/img/fotoheader/logo.png';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export default function EmailConfirmationFlow({
  initialEmail = '',
  initialCode = '',
  nome = '',
  pendingAuthCredentials = null,
  isModal = false,
  onClose,
  onGoToLogin,
  onEnterMaeApp,
}) {
  const navigate = useNavigate();
  const [step, setStep] = useState('verify');
  const [email, setEmail] = useState(initialEmail);
  const [codigo, setCodigo] = useState(String(initialCode || '').replace(/\D/g, '').slice(0, 6));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [sessionToUse, setSessionToUse] = useState(null);
  const [autoLoginFailed, setAutoLoginFailed] = useState(false);
  const inFlightRef = useRef(false);

  const handleConfirmSubmit = async (e) => {
    e.preventDefault();
    if (inFlightRef.current) return;

    setError('');
    setInfoMessage('');
    setAutoLoginFailed(false);

    const emailLimpo = email.trim().toLowerCase();
    const codigoLimpo = codigo.trim();

    if (!emailLimpo || !EMAIL_REGEX.test(emailLimpo)) {
      setError('Informe um endereço de e-mail válido.');
      return;
    }
    if (!/^\d{6}$/.test(codigoLimpo)) {
      setError('Informe o código numérico de 6 dígitos enviado para o seu e-mail.');
      return;
    }

    const apiBase = getApiBase();
    if (!apiBase) {
      setError('Servidor de confirmação indisponível neste ambiente.');
      return;
    }

    inFlightRef.current = true;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/auth/confirmar-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLimpo, codigo: codigoLimpo }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(extrairMensagemErro(data, 'Código de confirmação inválido ou expirado.'));
        return;
      }

      if (pendingAuthCredentials?.senha) {
        let resolvedSession = null;
        try {
          const loginRes = await fetch(`${apiBase}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: emailLimpo,
              senha: pendingAuthCredentials.senha,
            }),
          });
          if (loginRes.ok) {
            const loginData = await loginRes.json().catch(() => null);
            if (loginData?.tokenSessao) {
              resolvedSession = loginData;
            }
          }
        } catch {
          // Sem sessão automática; degrada com segurança para login explícito
        }
        setSessionToUse(resolvedSession);
        setAutoLoginFailed(!resolvedSession);
      }

      setEmail(emailLimpo);
      setStep('welcome');
    } catch {
      setError('Não foi possível conectar ao servidor para confirmar o e-mail.');
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (inFlightRef.current) return;

    setError('');
    setInfoMessage('');

    const emailLimpo = email.trim().toLowerCase();
    if (!emailLimpo || !EMAIL_REGEX.test(emailLimpo)) {
      setError('Informe um endereço de e-mail válido para reenviar o código.');
      return;
    }

    const apiBase = getApiBase();
    if (!apiBase) {
      setError('Servidor de autenticação indisponível neste ambiente.');
      return;
    }

    inFlightRef.current = true;
    setResending(true);
    try {
      const res = await fetch(`${apiBase}/api/auth/reenviar-codigo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLimpo }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(extrairMensagemErro(data, 'Não foi possível reenviar o código de confirmação.'));
        return;
      }

      setEmail(emailLimpo);
      setInfoMessage(data.mensagem || 'Um novo código de confirmação de 6 dígitos foi enviado.');
    } catch {
      setError('Não foi possível conectar ao servidor para reenviar o código.');
    } finally {
      inFlightRef.current = false;
      setResending(false);
    }
  };

  const handleEnterApp = () => {
    const emailLimpo = email.trim().toLowerCase();
    const sessaoFinal = sessionToUse?.tokenSessao ? sessionToUse : null;

    if (sessaoFinal) {
      if (onEnterMaeApp) {
        onEnterMaeApp(sessaoFinal);
        return;
      }
      navigateToApp('mae', sessaoFinal);
      return;
    }

    onClose?.();
    onGoToLogin?.(emailLimpo);
    navigate(`/login${emailLimpo ? `?email=${encodeURIComponent(emailLimpo)}` : ''}`);
  };

  if (step === 'welcome') {
    const hasSession = Boolean(sessionToUse?.tokenSessao);
    return (
      <div className="text-center py-4 space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#EBF3ED] text-[#294D33] flex items-center justify-center mx-auto">
          <CheckCircle size={26} />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCE7F0] text-[#294D33] text-[11px] font-semibold">
          <Sparkles size={13} />
          <span>Boas-vindas à Florável</span>
        </div>
        <h3 className="font-serif text-2xl font-normal text-[#294D33]">
          E-mail confirmado! Boas-vindas à Florável
        </h3>
        <p className="text-xs text-[#3A443E] leading-relaxed font-sans">
          {nome ? `Que alegria ter você aqui, ${nome}! ` : ''}
          Seu e-mail <strong>{email}</strong> foi validado com sucesso e enviamos um e-mail de boas-vindas com seus próximos passos.
        </p>
        {autoLoginFailed && !hasSession && (
          <div
            role="status"
            className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 leading-relaxed"
          >
            Seu e-mail foi confirmado, mas não foi possível iniciar sua sessão automaticamente. Faça login com seu e-mail e senha para entrar no Espaço Florável.
          </div>
        )}
        <button
          type="button"
          onClick={handleEnterApp}
          className="w-full py-3 rounded-full bg-[#294D33] text-white text-xs font-semibold hover:bg-[#1f3c27] shadow-md transition cursor-pointer"
        >
          {hasSession ? 'Entrar no Espaço Florável' : 'Ir para o Login'}
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleConfirmSubmit} className="space-y-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#294D33]">
        <MailCheck size={14} />
        <span>Verificação de Conta</span>
      </div>
      <h3 className="font-serif text-2xl font-normal text-[#294D33]">
        Confirme seu e-mail
      </h3>
      <p className="text-xs text-[#3A443E] leading-relaxed">
        {nome
          ? `Olá, ${nome}! Enviamos um código de 6 dígitos para confirmar seu acesso com segurança.`
          : 'Informe seu e-mail e o código de 6 dígitos enviado para ativar sua conta Florável.'}
      </p>

      {infoMessage && (
        <div className="p-2.5 rounded-xl bg-[#EBF3ED] border border-[#56725a]/30 text-[11.5px] text-[#1f2a22]">
          {infoMessage}
        </div>
      )}

      <div>
        <label htmlFor="confirm-email" className="block text-xs font-semibold text-[#294D33] mb-1">
          E-mail cadastrado
        </label>
        <input
          id="confirm-email"
          type="email"
          required
          placeholder="seuemail@exemplo.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          className="w-full px-3.5 py-2.5 rounded-2xl border border-[#E8A9BB]/60 bg-white text-sm focus:border-[#294D33] focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="confirm-codigo" className="block text-xs font-semibold text-[#294D33] mb-1">
          Código de confirmação (6 dígitos)
        </label>
        <input
          id="confirm-codigo"
          type="text"
          inputMode="numeric"
          maxLength={6}
          required
          placeholder="000000"
          value={codigo}
          onChange={(e) => {
            setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6));
            setError('');
          }}
          className="w-full px-3.5 py-2.5 rounded-2xl border border-[#E8A9BB]/60 bg-white text-sm tracking-[0.35em] font-mono text-center focus:border-[#294D33] focus:outline-none"
        />
      </div>

      {error && (
        <p role="alert" className="text-xs text-red-600 font-medium text-center">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || resending}
        className="w-full py-3 rounded-full bg-[#294D33] text-white text-sm font-semibold hover:bg-[#1f3c27] disabled:opacity-60 shadow-md transition cursor-pointer"
      >
        {loading ? 'Confirmando...' : 'Confirmar e-mail'}
      </button>

      <div className="flex items-center justify-between text-xs pt-1">
        <button
          type="button"
          disabled={loading || resending}
          onClick={handleResendCode}
          className="inline-flex items-center gap-1 font-semibold text-[#294D33] hover:underline disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw size={12} />
          <span>{resending ? 'Reenviando...' : 'Reenviar código'}</span>
        </button>

        {isModal && onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="text-stone-500 hover:text-stone-800 cursor-pointer"
          >
            Fechar
          </button>
        ) : (
          <Link to="/login" className="text-stone-500 hover:text-stone-800">
            Ir para o Login
          </Link>
        )}
      </div>
    </form>
  );
}

export function ConfirmarEmailScreen() {
  const [searchParams] = useSearchParams();
  return (
    <div className="min-h-dvh bg-[#faf8f4] flex items-center justify-center p-4 sm:p-6 antialiased">
      <div className="w-full max-w-md bg-[#FCF7F9] rounded-[2rem] p-6 sm:p-8 shadow-xl border border-[#E8A9BB]/50">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 transition"
          >
            <ArrowLeft size={14} />
            <span>Voltar ao login</span>
          </Link>
          <Link to="/" className="flex items-center gap-1.5">
            <img src={LOGO} alt="Florável" className="h-7 w-auto object-contain" />
            <span className="font-serif text-base font-bold text-[#1f2a22]">florável</span>
          </Link>
        </div>
        <EmailConfirmationFlow
          initialEmail={searchParams.get('email') || ''}
          initialCode={searchParams.get('codigo') || ''}
        />
      </div>
    </div>
  );
}
