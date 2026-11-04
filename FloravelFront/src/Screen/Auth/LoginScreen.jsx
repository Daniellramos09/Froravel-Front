import { useState, useEffect } from 'react';
import { APP_LINKS, navigateToApp } from '../../utils/appLinks';
import { ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react';

const LOGIN_IMAGE = '/login-bg.png';
const LOGO = '/img/fotoheader/logo.png';

const PAPEIS = [
  { id: 'mae', label: 'Sou Mãe', desc: 'Espaço íntimo de cuidado, diário, triagem e apoio comunitário.' },
  { id: 'terapeuta', label: 'Sou Terapeuta', desc: 'Acesse o consultório virtual, agenda e acolhimento de pacientes.' },
  { id: 'rh', label: 'Gestão RH', desc: 'Acompanhe indicadores agregados, gestão de licenças e relatórios.' },
];

export default function LoginScreen() {
  const [papel, setPapel] = useState('mae');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

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

  const inputClass =
    'w-full px-4 py-2.5 text-sm rounded-xl bg-[#f1f0ed] border border-[#d9d6cf] text-gray-800 ' +
    'placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#56725a]/60 ' +
    'focus:border-transparent transition-all';

  const papelLabel = papel === 'mae' ? 'Mãe' : papel === 'terapeuta' ? 'Terapeuta' : 'Gestão RH';

  return (
    <div className="min-h-screen w-full flex bg-[#faf8f4]">
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          {/* Link para voltar à Landing Page */}
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#56725a] hover:text-[#2f4a36] hover:underline mb-6 transition cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Voltar para a página inicial</span>
          </a>

          {/* Logo e Título */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={LOGO} alt="Florável" className="h-12 w-12 object-contain drop-shadow-sm" />
            <h1 className="font-serif text-3xl font-bold text-[#1f2a22] tracking-tight">Entrar</h1>
          </div>

          {/* Seletor de Perfis (3 Abas) */}
          <div
            role="tablist"
            aria-label="Tipo de perfil de acesso"
            className="grid grid-cols-3 p-1 mb-3 rounded-2xl bg-[#ece8df] text-xs font-semibold"
          >
            {PAPEIS.map(({ id, label }) => {
              const isSelected = papel === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => {
                    setPapel(id);
                    setCarregando(false);
                    setErro('');
                  }}
                  className={`py-2 px-1 rounded-xl transition-all duration-200 cursor-pointer text-center truncate ${
                    isSelected
                      ? 'bg-[#56725a] text-white shadow-xs font-bold'
                      : 'text-gray-600 hover:text-[#1f2a22]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-gray-500 text-center mb-5 min-h-[32px] flex items-center justify-center">
            {PAPEIS.find((p) => p.id === papel)?.desc}
          </p>

          {/* Formulário de Login */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                E-mail corporativo ou pessoal
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
                <a href="#esqueci-senha" className="text-xs font-medium text-[#1f2a22] hover:underline">
                  Esqueceu a senha?
                </a>
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
            <a href="/cadastro" className="font-semibold text-[#2f4a36] hover:underline">
              Criar Conta
            </a>
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
    </div>
  );
}
