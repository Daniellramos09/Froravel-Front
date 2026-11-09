import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { APP_LINKS, navigateToApp } from '../../utils/appLinks';
import { ArrowLeft, ExternalLink, X, CheckCircle } from 'lucide-react';

const LOGIN_IMAGE = '/login-bg.png';
const LOGO = '/img/fotoheader/logo.png';

const PAPEIS = [
  { id: 'mae', label: 'Sou Mãe', desc: 'Espaço íntimo de cuidado, diário, triagem e apoio comunitário.' },
  { id: 'terapeuta', label: 'Sou Terapeuta', desc: 'Acesse o consultório virtual, agenda e acolhimento de pacientes.' },
  { id: 'rh', label: 'Gestão RH', desc: 'Acompanhe indicadores agregados, gestão de licenças e relatórios.' },
];

export default function LoginScreen() {
  // "Acessar Portais" abre o login já no perfil escolhido: /login?perfil=terapeuta
  const [searchParams] = useSearchParams();
  const [papel, setPapel] = useState(() => {
    const perfil = searchParams.get('perfil');
    return PAPEIS.some((p) => p.id === perfil) ? perfil : 'mae';
  });
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  useEffect(() => {
    const handlePageShow = (e) => {
      if (e.persisted) {
        setCarregando(false);
        setErro('');
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      navigateToApp(papel);
    } catch (err) {
      const msg =
        err?.response?.status === 401
          ? 'E-mail ou senha inválidos.'
          : 'Não foi possível conectar. Tente novamente.';
      setErro(msg);
      setCarregando(false);
    }
  };

  const handleGoogle = () => {
    navigateToApp(papel);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotSent(true);
  };

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#f1f0ed] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#56725a]/60 text-sm text-gray-800 transition';

  const papelLabel = PAPEIS.find((p) => p.id === papel)?.label || 'Entrar';

  return (
    <div className="min-h-screen flex bg-[#faf8f4] antialiased">
      {/* Coluna Esquerda: Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10 sm:px-12">
        <div className="w-full max-w-sm">
          {/* Voltar para Home */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 transition mb-6 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Voltar para a página inicial</span>
          </Link>

          {/* Logo e Título */}
          <div className="flex flex-col items-center mb-6">
            <Link to="/" className="mb-3 transition-transform hover:scale-105">
              <img src={LOGO} alt="Florável" className="h-14 w-auto object-contain" />
            </Link>
            <h1 className="text-xl font-bold text-[#1f2a22] font-serif">Acesse seu espaço</h1>
            <p className="text-xs text-gray-600 mt-1 text-center">
              Acolhimento, respeito e privacidade em cada etapa.
            </p>
          </div>

          {/* Seletor de Perfil (Mãe / Terapeuta / RH) */}
          <div className="mb-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
              Escolha seu perfil:
            </p>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#edeae4] rounded-2xl">
              {PAPEIS.map((p) => {
                const ativo = papel === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setPapel(p.id);
                      setErro('');
                    }}
                    className={`py-2 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      ativo
                        ? 'bg-white text-[#294D33] shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-stone-500 mt-2 px-1">
              {PAPEIS.find((p) => p.id === papel)?.desc}
            </p>
          </div>

          {/* Formulário de Login */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder={papel === 'rh' ? 'gestor@empresa.com.br' : 'seuemail@exemplo.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-xs font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <input
                  id="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className={`${inputClass} pr-16`}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#56725a] hover:text-[#2f4a36] cursor-pointer"
                >
                  {mostrarSenha ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              <div className="text-right mt-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setShowForgotModal(true);
                  }}
                  className="text-xs font-medium text-[#294D33] hover:underline cursor-pointer"
                >
                  Esqueceu a senha?
                </button>
              </div>
            </div>

            {erro && (
              <p role="alert" className="text-xs text-red-600 text-center font-medium">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full py-3 text-sm rounded-xl bg-[#56725a] hover:bg-[#465e4a] active:scale-[0.99] disabled:opacity-60 text-white font-bold shadow-md shadow-[#56725a]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{carregando ? 'Conectando...' : `Entrar como ${papelLabel}`}</span>
              <ExternalLink size={14} />
            </button>
          </form>

          {/* Atalhos de Demonstração (1 Clique) */}
          <div className="mt-6 pt-5 border-t border-[#d9d6cf]/60">
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 text-center mb-3">
              Acesso Direto para Demonstração (Demo Day):
            </p>
            <div className="grid grid-cols-3 gap-2">
              <a
                href={APP_LINKS.mae}
                className="p-2 text-center rounded-xl bg-[#FCE7F0] border border-[#E8A9BB]/40 hover:bg-[#F4DDE5] transition group shadow-2xs"
              >
                <span className="block text-base mb-0.5">🌸</span>
                <span className="text-[11px] font-bold text-[#294D33] block leading-tight">Mãe</span>
              </a>

              <a
                href={APP_LINKS.terapeuta}
                className="p-2 text-center rounded-xl bg-[#EBF3EE] border border-[#73937E]/30 hover:bg-[#EBF3EE]/80 transition group shadow-2xs"
              >
                <span className="block text-base mb-0.5">🩺</span>
                <span className="text-[11px] font-bold text-[#294D33] block leading-tight">Terapeuta</span>
              </a>

              <a
                href={APP_LINKS.rh}
                className="p-2 text-center rounded-xl bg-[#FDF4E7] border border-[#E8BA85]/40 hover:bg-[#FDF4E7]/80 transition group shadow-2xs"
              >
                <span className="block text-base mb-0.5">🏢</span>
                <span className="text-[11px] font-bold text-[#294D33] block leading-tight">RH B2B</span>
              </a>
            </div>
          </div>

          <p className="text-xs text-center text-gray-600 mt-5">
            Não possui uma conta?{' '}
            <Link to="/cadastro" className="font-semibold text-[#2f4a36] hover:underline">
              Criar Conta
            </Link>
          </p>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-[#d9d6cf]" />
            <span className="text-[11px] text-gray-500">OU</span>
            <div className="flex-1 h-px bg-[#d9d6cf]" />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            aria-label="Entrar com Google"
            className="w-full py-2.5 rounded-xl bg-[#f1f0ed] hover:bg-white border border-[#e2dfd8] shadow-sm flex items-center justify-center transition-colors cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
              <path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z" />
              <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Imagem de Fundo Lateral */}
      <div className="hidden lg:block w-1/2 min-h-screen relative">
        <img src={LOGIN_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f4]/30 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent" />
      </div>

      {/* Modal de Recuperação de Senha */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#294D33]/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-[#FCF7F9] rounded-[2rem] p-6 sm:p-8 shadow-2xl border border-[#E8A9BB]/60 text-left">
            <button
              onClick={() => { setShowForgotModal(false); setForgotSent(false); }}
              className="absolute top-5 right-5 text-[#516B55] hover:text-[#294D33] hover:bg-[#F4DDE5] p-2 rounded-full transition cursor-pointer"
            >
              <X size={20} />
            </button>

            {!forgotSent ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#294D33]">
                  Recuperação de Acesso
                </span>
                <h3 className="font-serif text-2xl font-normal text-[#294D33]">
                  Esqueceu sua senha?
                </h3>
                <p className="text-xs text-[#3A443E] leading-relaxed">
                  Informe o seu e-mail cadastrado. Nós enviaremos um link seguro para redefinição imediata da sua senha.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-[#294D33] mb-1">Seu E-mail</label>
                  <input
                    required
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-[#E8A9BB]/60 bg-white text-sm focus:border-[#294D33] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#294D33] text-white text-sm font-semibold hover:bg-[#1f3c27] shadow-md transition mt-2 cursor-pointer"
                >
                  Enviar Link de Recuperação
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#EBF3ED] text-[#294D33] flex items-center justify-center mx-auto">
                  <CheckCircle size={24} />
                </div>
                <h3 className="font-serif text-2xl font-normal text-[#294D33]">
                  Instruções enviadas!
                </h3>
                <p className="text-xs text-[#3A443E] leading-relaxed font-sans">
                  Se o e-mail informado estiver cadastrado, você receberá um link com as instruções para criar uma nova senha em instantes.
                </p>
                <button
                  onClick={() => { setShowForgotModal(false); setForgotSent(false); }}
                  className="py-2.5 px-6 rounded-full bg-[#294D33] text-white text-xs font-semibold hover:bg-[#1f3c27] transition cursor-pointer mt-2"
                >
                  Entendido
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
