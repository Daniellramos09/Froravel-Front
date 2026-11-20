import { useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Eye, EyeOff, KeyRound, Mail, RefreshCw } from 'lucide-react';
import { getApiBase } from '../../utils/appLinks';

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

export default function PasswordRecoveryFlow({
  initialStep = 'request',
  initialEmail = '',
  initialCode = '',
  isModal = false,
  onClose,
  onSuccessLogin,
}) {
  const navigate = useNavigate();
  const [step, setStep] = useState(initialStep);
  const [email, setEmail] = useState(initialEmail);
  const [codigo, setCodigo] = useState(String(initialCode || '').replace(/\D/g, '').slice(0, 6));
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const inFlightRef = useRef(false);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (inFlightRef.current) return;

    setError('');
    setInfoMessage('');

    const emailLimpo = email.trim().toLowerCase();
    if (!emailLimpo || !EMAIL_REGEX.test(emailLimpo)) {
      setError('Informe um endereço de e-mail válido.');
      return;
    }

    const apiBase = getApiBase();
    if (!apiBase) {
      setError('Servidor de autenticação indisponível neste ambiente.');
      return;
    }

    inFlightRef.current = true;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/auth/esqueci-senha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLimpo }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(extrairMensagemErro(data, 'Não foi possível enviar o código de recuperação.'));
        return;
      }

      setEmail(emailLimpo);
      setInfoMessage(
        data.mensagem ||
          'Se o e-mail informado estiver cadastrado, enviaremos um código de 6 dígitos para redefinição de senha.'
      );
      setStep('reset');
    } catch {
      setError('Não foi possível conectar ao servidor de autenticação.');
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
      const res = await fetch(`${apiBase}/api/auth/esqueci-senha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLimpo }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(extrairMensagemErro(data, 'Não foi possível reenviar o código.'));
        return;
      }

      setEmail(emailLimpo);
      setInfoMessage(data.mensagem || 'Um novo código de 6 dígitos foi enviado para o seu e-mail.');
    } catch {
      setError('Não foi possível conectar ao servidor para reenviar o código.');
    } finally {
      inFlightRef.current = false;
      setResending(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (inFlightRef.current) return;

    setError('');

    const emailLimpo = email.trim().toLowerCase();
    const codigoLimpo = codigo.trim();

    if (!emailLimpo || !EMAIL_REGEX.test(emailLimpo)) {
      setError('Informe um endereço de e-mail válido.');
      return;
    }
    if (!/^\d{6}$/.test(codigoLimpo)) {
      setError('Informe o código numérico de 6 dígitos enviado por e-mail.');
      return;
    }
    if (novaSenha.length < 6) {
      setError('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setError('As senhas não conferem. Verifique e tente novamente.');
      return;
    }

    const apiBase = getApiBase();
    if (!apiBase) {
      setError('Servidor de autenticação indisponível neste ambiente.');
      return;
    }

    inFlightRef.current = true;
    setLoading(true);
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
        setError(extrairMensagemErro(data, 'Código inválido ou expirado.'));
        return;
      }

      setEmail(emailLimpo);
      setStep('success');
    } catch {
      setError('Não foi possível conectar ao servidor para redefinir a senha.');
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    const emailLimpo = email.trim().toLowerCase();
    if (onSuccessLogin) {
      onSuccessLogin(emailLimpo);
      return;
    }
    navigate(`/login${emailLimpo ? `?email=${encodeURIComponent(emailLimpo)}` : ''}`);
  };

  if (step === 'success') {
    return (
      <div className="text-center py-4 space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#EBF3ED] text-[#294D33] flex items-center justify-center mx-auto">
          <CheckCircle size={26} />
        </div>
        <h3 className="font-serif text-2xl font-normal text-[#294D33]">
          Senha redefinida com sucesso!
        </h3>
        <p className="text-xs text-[#3A443E] leading-relaxed font-sans">
          Sua nova senha já está ativa para <strong>{email}</strong>. Você já pode acessar seu espaço Florável.
        </p>
        <button
          type="button"
          onClick={handleGoToLogin}
          className="w-full py-3 rounded-full bg-[#294D33] text-white text-xs font-semibold hover:bg-[#1f3c27] shadow-md transition cursor-pointer"
        >
          Ir para o Login
        </button>
      </div>
    );
  }

  if (step === 'reset') {
    return (
      <form noValidate onSubmit={handleResetSubmit} className="space-y-3.5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#294D33]">
          <KeyRound size={14} />
          <span>Redefinição de Senha</span>
        </div>
        <h3 className="font-serif text-2xl font-normal text-[#294D33]">
          Redefinir senha
        </h3>
        <p className="text-xs text-[#3A443E] leading-relaxed">
          Digite o código de 6 dígitos enviado para o seu e-mail (validade de 15 minutos) e escolha uma nova senha.
        </p>

        {infoMessage && (
          <div className="p-2.5 rounded-xl bg-[#EBF3ED] border border-[#56725a]/30 text-[11.5px] text-[#1f2a22]">
            {infoMessage}
          </div>
        )}

        <div>
          <label htmlFor="reset-email" className="block text-xs font-semibold text-[#294D33] mb-1">
            E-mail cadastrado
          </label>
          <input
            id="reset-email"
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
          <label htmlFor="reset-codigo" className="block text-xs font-semibold text-[#294D33] mb-1">
            Código de 6 dígitos
          </label>
          <input
            id="reset-codigo"
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

        <div>
          <label htmlFor="reset-nova-senha" className="block text-xs font-semibold text-[#294D33] mb-1">
            Nova senha
          </label>
          <div className="relative">
            <input
              id="reset-nova-senha"
              type={mostrarSenha ? 'text' : 'password'}
              required
              minLength={6}
              maxLength={72}
              placeholder="Mínimo de 6 caracteres"
              value={novaSenha}
              onChange={(e) => {
                setNovaSenha(e.target.value);
                setError('');
              }}
              className="w-full px-3.5 py-2.5 pr-10 rounded-2xl border border-[#E8A9BB]/60 bg-white text-sm focus:border-[#294D33] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setMostrarSenha((prev) => !prev)}
              aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#516B55] hover:text-[#294D33] cursor-pointer"
            >
              {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="reset-confirmar-senha" className="block text-xs font-semibold text-[#294D33] mb-1">
            Confirmar nova senha
          </label>
          <input
            id="reset-confirmar-senha"
            type={mostrarSenha ? 'text' : 'password'}
            required
            minLength={6}
            maxLength={72}
            placeholder="Repita a nova senha"
            value={confirmarSenha}
            onChange={(e) => {
              setConfirmarSenha(e.target.value);
              setError('');
            }}
            className="w-full px-3.5 py-2.5 rounded-2xl border border-[#E8A9BB]/60 bg-white text-sm focus:border-[#294D33] focus:outline-none"
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
          {loading ? 'Redefinindo senha...' : 'Redefinir senha'}
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
          <button
            type="button"
            onClick={() => {
              setError('');
              setInfoMessage('');
              setStep('request');
            }}
            className="text-stone-500 hover:text-stone-800 cursor-pointer"
          >
            Alterar e-mail
          </button>
        </div>
      </form>
    );
  }

  return (
    <form noValidate onSubmit={handleRequestSubmit} className="space-y-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#294D33]">
        <Mail size={14} />
        <span>Recuperação de Acesso</span>
      </div>
      <h3 className="font-serif text-2xl font-normal text-[#294D33]">
        Esqueceu sua senha?
      </h3>
      <p className="text-xs text-[#3A443E] leading-relaxed">
        Informe o seu e-mail cadastrado. Enviaremos um código temporário de 6 dígitos válido por 15 minutos.
      </p>

      <div>
        <label htmlFor="recovery-email" className="block text-xs font-semibold text-[#294D33] mb-1">
          Seu E-mail
        </label>
        <input
          id="recovery-email"
          required
          type="email"
          placeholder="seuemail@exemplo.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          className="w-full px-4 py-3 rounded-2xl border border-[#E8A9BB]/60 bg-white text-sm focus:border-[#294D33] focus:outline-none"
        />
      </div>

      {error && (
        <p role="alert" className="text-xs text-red-600 font-medium text-center">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-full bg-[#294D33] text-white text-sm font-semibold hover:bg-[#1f3c27] disabled:opacity-60 shadow-md transition cursor-pointer"
      >
        {loading ? 'Enviando código...' : 'Enviar código de recuperação'}
      </button>

      <div className="flex items-center justify-between text-xs pt-1">
        <button
          type="button"
          onClick={() => {
            setError('');
            setInfoMessage('');
            setStep('reset');
          }}
          className="font-semibold text-[#294D33] hover:underline cursor-pointer"
        >
          Já tenho o código de 6 dígitos
        </button>
        {isModal && onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="text-stone-500 hover:text-stone-800 cursor-pointer"
          >
            Voltar ao login
          </button>
        ) : (
          <Link to="/login" className="text-stone-500 hover:text-stone-800">
            Voltar ao login
          </Link>
        )}
      </div>
    </form>
  );
}

function AuthRecoveryPageShell({ children }) {
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
        {children}
      </div>
    </div>
  );
}

export function EsqueciSenhaScreen() {
  const [searchParams] = useSearchParams();
  return (
    <AuthRecoveryPageShell>
      <PasswordRecoveryFlow
        initialStep="request"
        initialEmail={searchParams.get('email') || ''}
        initialCode={searchParams.get('codigo') || ''}
      />
    </AuthRecoveryPageShell>
  );
}

export function RedefinirSenhaScreen() {
  const [searchParams] = useSearchParams();
  return (
    <AuthRecoveryPageShell>
      <PasswordRecoveryFlow
        initialStep="reset"
        initialEmail={searchParams.get('email') || ''}
        initialCode={searchParams.get('codigo') || ''}
      />
    </AuthRecoveryPageShell>
  );
}
