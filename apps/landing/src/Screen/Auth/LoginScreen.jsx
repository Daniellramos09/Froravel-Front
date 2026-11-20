import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { APP_LINKS, getApiBase, navigateToApp } from '../../utils/appLinks';
import PasswordRecoveryFlow from './PasswordRecoveryFlow';
import EmailConfirmationFlow from './EmailConfirmationFlow';
import {
  ArrowLeft,
  ExternalLink,
  X,
  ShieldCheck,
  HeartHandshake,
  Lock,
  PhoneCall,
  AlertCircle,
} from 'lucide-react';

const LOGIN_IMAGE = '/login-bg.png';
const LOGO = '/img/fotoheader/logo.png';
const API_BASE = getApiBase();
const GOOGLE_CLIENT_ID_PUBLIC = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const SESSAO_STORAGE_KEYS = {
  mae: 'floravel_mae_sessao',
  terapeuta: 'floravel_psi_sessao',
  rh: 'floravel_rh_sessao',
};

function resolverPapelDestino(tipoPerfil, papelFallback) {
  const norm = String(tipoPerfil || '').toUpperCase();
  if (norm === 'RH') return 'rh';
  if (norm === 'PSICOLOGO' || norm === 'TERAPEUTA') return 'terapeuta';
  if (norm === 'MAE') return 'mae';
  return papelFallback;
}

const PAPEIS = [
  { id: 'mae', label: 'Sou Mãe', desc: 'Acolhimento emocional, diário, triagem e rodas comunitárias.' },
  { id: 'terapeuta', label: 'Sou Terapeuta', desc: 'Consultório virtual, agenda e acolhimento de pacientes.' },
  { id: 'rh', label: 'Gestão RH', desc: 'Indicadores agregados ESG, licenças e bem-estar corporativo.' },
];

function formatarCpf(valor) {
  const digits = String(valor || '').replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function validarCpfModulo11Local(cpf) {
  const d = String(cpf || '').replace(/\D/g, '');
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += Number(d[i]) * (10 - i);
  const dig1 = ((soma * 10) % 11) % 10;
  if (dig1 !== Number(d[9])) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += Number(d[i]) * (11 - i);
  const dig2 = ((soma * 10) % 11) % 10;
  return dig2 === Number(d[10]);
}

function calcularIdade(dataNascimentoStr) {
  if (!dataNascimentoStr) return null;
  const hoje = new Date();
  const nascimento = new Date(`${dataNascimentoStr}T00:00:00`);
  if (Number.isNaN(nascimento.getTime())) return null;
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

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

export default function LoginScreen({ initialMode = 'login' }) {
  const [searchParams] = useSearchParams();
  const [modo, setModo] = useState(initialMode); // 'login' | 'cadastro'
  const [prevInitialMode, setPrevInitialMode] = useState(initialMode);
  if (initialMode !== prevInitialMode) {
    setPrevInitialMode(initialMode);
    setModo(initialMode);
  }

  const [papel, setPapel] = useState(() => {
    const perfil = searchParams.get('perfil');
    return PAPEIS.some((p) => p.id === perfil) ? perfil : 'mae';
  });

  // Estados Login
  const [email, setEmail] = useState(() => searchParams.get('email') || '');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erroLogin, setErroLogin] = useState('');
  const [carregandoLogin, setCarregandoLogin] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState(null);

  // Estados Cadastro
  const [formCadastro, setFormCadastro] = useState({
    nome: '',
    email: '',
    cpf: '',
    senha: '',
    dataNascimento: '',
    termoAceito: true,
    responsavelNome: '',
    responsavelCpf: '',
    responsavelParentesco: 'Mãe',
    responsavelTelefone: '',
    responsavelEmail: '',
    consentimentoResponsavel: true,
  });
  const [carregandoCadastro, setCarregandoCadastro] = useState(false);
  const [erroCadastro, setErroCadastro] = useState('');
  const [govResult, setGovResult] = useState(null);
  const [validandoGov, setValidandoGov] = useState(false);
  const [mostrarAjudaVulnerabilidade, setMostrarAjudaVulnerabilidade] = useState(false);
  const [googleClientId, setGoogleClientId] = useState(GOOGLE_CLIENT_ID_PUBLIC);
  const [googleReady, setGoogleReady] = useState(false);
  const googleBtnRef = useRef(null);
  const loginInFlightRef = useRef(false);
  const cadastroInFlightRef = useRef(false);

  const isCadastro = modo === 'cadastro';

  const idade = useMemo(() => calcularIdade(formCadastro.dataNascimento), [formCadastro.dataNascimento]);
  const isMenorIdade = papel === 'mae' && idade !== null && idade >= 13 && idade < 18;
  const isIdadeAbaixoMinimo = papel === 'mae' && idade !== null && idade < 13;
  const isIdadeAcimaMaximo = papel === 'mae' && idade !== null && idade > 80;
  const bloqueadoEspacoSeguro = papel === 'mae' && govResult?.bloqueadoEspacoSeguro === true;

  useEffect(() => {
    if (googleClientId || !API_BASE) return;
    fetch(`${API_BASE}/api/auth/oauth/google/config`)
      .then((res) => (res.ok ? res.json() : null))
      .then((cfg) => {
        if (cfg?.enabled && cfg?.clientId) {
          setGoogleClientId(cfg.clientId);
        }
      })
      .catch(() => {});
  }, [googleClientId]);

  const salvarSessaoLocal = (authData, papelAtual) => {
    const chave = SESSAO_STORAGE_KEYS[papelAtual] || 'floravel_mae_sessao';
    localStorage.setItem(chave, JSON.stringify(authData));
    if (authData?.tokenSessao) {
      localStorage.setItem('floravel_jwt', authData.tokenSessao);
    }
    if (authData?.codigoPublico) {
      localStorage.setItem('floravel_codigo_publico', authData.codigoPublico);
    }
  };

  useEffect(() => {
    if (!googleClientId) return;
    const initGsi = () => {
      if (!window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          if (!response?.credential) return;
          if (!API_BASE) {
            setErroLogin('Conta Google validada, mas o servidor backend ainda não está configurado neste ambiente.');
            return;
          }
          setCarregandoLogin(true);
          setErroLogin('');
          try {
            const res = await fetch(`${API_BASE}/api/auth/oauth/google`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                idToken: response.credential,
                tipoPerfil: papel === 'terapeuta' ? 'PSICOLOGO' : papel === 'rh' ? 'RH' : 'MAE',
              }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
              setErroLogin(data.message || 'Falha ao autenticar conta Google.');
              setCarregandoLogin(false);
              return;
            }
            const papelDestino = resolverPapelDestino(data?.tipoPerfil, papel);
            salvarSessaoLocal(data, papelDestino);
            navigateToApp(papelDestino, data);
          } catch {
            setErroLogin('Não foi possível validar o login Google no servidor.');
            setCarregandoLogin(false);
          }
        },
      });
      if (googleBtnRef.current) {
        googleBtnRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text: 'continue_with',
          locale: 'pt-BR',
          width: googleBtnRef.current.offsetWidth || 380,
        });
      }
      setGoogleReady(true);
    };

    if (window.google?.accounts?.id) {
      initGsi();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initGsi;
    document.head.appendChild(script);
  }, [googleClientId, papel]);

  useEffect(() => {
    const handlePageShow = (e) => {
      if (e.persisted) {
        loginInFlightRef.current = false;
        cadastroInFlightRef.current = false;
        setCarregandoLogin(false);
        setCarregandoCadastro(false);
        setErroLogin('');
        setErroCadastro('');
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  useEffect(() => {
    if (!showForgotModal && !pendingConfirmation) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showForgotModal) setShowForgotModal(false);
        if (pendingConfirmation) setPendingConfirmation(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showForgotModal, pendingConfirmation]);

  const alternarModo = (novoModo) => {
    setModo(novoModo);
    setErroLogin('');
    setErroCadastro('');
    const targetPath = novoModo === 'cadastro' ? '/cadastro' : '/login';
    if (window.location.pathname !== targetPath) {
      window.history.replaceState(null, '', targetPath);
    }
  };

  /* ---------- Handlers Login ---------- */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (loginInFlightRef.current) return;

    setErroLogin('');

    const emailLimpo = email.trim().toLowerCase();
    if (!emailLimpo || !senha) {
      setErroLogin('Informe seu e-mail e sua senha para entrar.');
      return;
    }

    if (!API_BASE) {
      const demoAuthData = {
        usuarioId: `demo-${papel}`,
        perfilId: `demo-${papel}`,
        codigoPublico: papel === 'terapeuta' ? 'FLR-P14H90' : papel === 'rh' ? 'FLR-RH01' : 'FLR-M2C8R4',
        nome: emailLimpo.split('@')[0] || 'Mariana Silva',
        email: emailLimpo,
        tipoPerfil: papel === 'terapeuta' ? 'PSICOLOGO' : papel === 'rh' ? 'RH' : 'MAE',
      };
      salvarSessaoLocal(demoAuthData, papel);
      navigateToApp(papel, demoAuthData);
      return;
    }

    loginInFlightRef.current = true;
    setCarregandoLogin(true);
    try {
      const authRes = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLimpo, senha }),
      });

      if (authRes.ok) {
        const authData = await authRes.json();
        const papelDestino = resolverPapelDestino(authData?.tipoPerfil, papel);
        salvarSessaoLocal(authData, papelDestino);
        navigateToApp(papelDestino, authData);
        return;
      }

      const errJson = await authRes.json().catch(() => ({}));
      setErroLogin(extrairMensagemErro(errJson, 'E-mail ou senha inválidos.'));
      setCarregandoLogin(false);
    } catch {
      setErroLogin('Não foi possível conectar ao servidor de autenticação.');
      setCarregandoLogin(false);
    } finally {
      loginInFlightRef.current = false;
    }
  };

  const handleGoogle = () => {
    setErroLogin('');
    if (!googleClientId) {
      setErroLogin('Login com Google não configurado neste ambiente.');
      return;
    }
    if (googleReady && window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setErroLogin('Use o botão oficial do Google abaixo ou desative o bloqueador de pop-ups.');
        }
      });
      return;
    }
    setErroLogin('Serviço do Google ainda carregando. Tente novamente em instantes.');
  };

  /* ---------- Handlers Cadastro + API Governo ---------- */
  const simularFallbackGovernoLocal = (cpfLimpo, dataInformada) => {
    const hoje = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    if (cpfLimpo === '14582931065') {
      const anoReal = hoje.getFullYear() - 15;
      const dataReal = `${anoReal}-${pad(hoje.getMonth() + 1)}-${pad(hoje.getDate())}`;
      const divergente = Boolean(dataInformada && dataInformada !== dataReal);
      return {
        cpfValido: true,
        aprovadoParaCadastroMae: true,
        menorDeIdade: true,
        requerResponsavelLegal: true,
        bloqueadoEspacoSeguro: false,
        divergenciaCadastral: divergente,
        mensagemClinicaEtica: divergente
          ? 'Divergência identificada via Receita/Gov: data corrigida para 15 anos. Exige consentimento do responsável (ECA Art. 17 — sigilo garantido).'
          : 'Mãe adolescente (15 anos) identificada via CPF: exige responsável legal com garantia de sigilo ECA Art. 17.',
        dadosCidadao: { dataNascimentoOficial: dataReal, sexoRegistrado: 'F', idadeOficial: 15 },
      };
    }
    if (cpfLimpo === '52998224725') {
      return {
        cpfValido: true,
        aprovadoParaCadastroMae: false,
        bloqueadoEspacoSeguro: true,
        mensagemClinicaEtica:
          'As Rodas de Conversa e Comunidade Florável são um ambiente clínico exclusivo para mulheres no ciclo gravídico-puerperal.',
        dadosCidadao: { dataNascimentoOficial: '1992-03-15', sexoRegistrado: 'M', idadeOficial: 34 },
      };
    }
    if (!validarCpfModulo11Local(cpfLimpo)) {
      return {
        cpfValido: false,
        aprovadoParaCadastroMae: false,
        mensagemClinicaEtica: 'O CPF informado possui dígitos verificadores inválidos.',
      };
    }
    return {
      cpfValido: true,
      aprovadoParaCadastroMae: true,
      menorDeIdade: false,
      bloqueadoEspacoSeguro: false,
      mensagemClinicaEtica: 'Identidade civil e elegibilidade ao Espaço Seguro confirmadas.',
      dadosCidadao: { dataNascimentoOficial: dataInformada || '1996-05-20', sexoRegistrado: 'F' },
    };
  };

  const consultarApiGoverno = async (cpfBruto, dataAtual) => {
    const cpfLimpo = String(cpfBruto || '').replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      setGovResult(null);
      return;
    }

    setValidandoGov(true);
    setErroCadastro('');
    let resultado = null;

    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/api/governo/validar-identidade`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cpf: cpfLimpo,
            dataNascimentoInformada: dataAtual || null,
            nomeInformado: formCadastro.nome || null,
          }),
        });
        if (res.ok) resultado = await res.json();
      } catch {
        // Fallback local será aplicado abaixo
      }
    }

    if (!resultado) {
      resultado = simularFallbackGovernoLocal(cpfLimpo, dataAtual);
    }

    setGovResult(resultado);
    if (resultado?.dadosCidadao?.dataNascimentoOficial && resultado.cpfValido && !resultado.bloqueadoEspacoSeguro) {
      setFormCadastro((prev) => ({
        ...prev,
        dataNascimento: resultado.dadosCidadao.dataNascimentoOficial,
      }));
    }
    setValidandoGov(false);
  };

  const handleCadastroChange = (e) => {
    const { name, type, checked, value } = e.target;
    let finalValue = type === 'checkbox' ? checked : value;
    if (name === 'cpf') {
      finalValue = formatarCpf(value);
      const apenasDigitos = finalValue.replace(/\D/g, '');
      if (apenasDigitos.length === 11) {
        consultarApiGoverno(finalValue, formCadastro.dataNascimento);
      } else {
        setGovResult(null);
      }
    }
    setErroCadastro('');
    setFormCadastro((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleCadastroSubmit = async (e) => {
    e.preventDefault();
    if (cadastroInFlightRef.current) return;

    setErroCadastro('');

    if (bloqueadoEspacoSeguro) {
      setErroCadastro(govResult.mensagemClinicaEtica);
      return;
    }

    if (papel === 'mae' && formCadastro.dataNascimento) {
      if (isIdadeAbaixoMinimo) {
        setErroCadastro('Idade mínima de auto-cadastro: 13 anos. Utilize os canais de proteção infantil abaixo.');
        return;
      }
      if (isIdadeAcimaMaximo) {
        setErroCadastro('Data inválida: idade máxima permitida é de 80 anos.');
        return;
      }
      if (isMenorIdade) {
        if (
          !formCadastro.responsavelNome.trim() ||
          !formCadastro.responsavelCpf.trim() ||
          !formCadastro.responsavelTelefone.trim() ||
          !formCadastro.consentimentoResponsavel
        ) {
          setErroCadastro('Para mães de 13 a 17 anos, informe os dados e o consentimento do responsável legal (ECA/LGPD).');
          return;
        }
      }
    }

    if (!API_BASE) {
      const demoAuthData = {
        usuarioId: `demo-${papel}`,
        perfilId: `demo-${papel}`,
        codigoPublico: papel === 'terapeuta' ? 'FLR-P14H90' : papel === 'rh' ? 'FLR-RH01' : 'FLR-M2C8R4',
        nome: formCadastro.nome.trim() || 'Mariana Silva',
        email: formCadastro.email.trim().toLowerCase(),
        tipoPerfil: papel === 'terapeuta' ? 'PSICOLOGO' : papel === 'rh' ? 'RH' : 'MAE',
      };
      salvarSessaoLocal(demoAuthData, papel);
      navigateToApp(papel, demoAuthData);
      return;
    }

    if (papel !== 'mae') {
      setErroCadastro('Cadastro direto disponível para Mães. Para Terapeuta ou RH, use o Acesso Rápido Demo Day ou Google.');
      return;
    }

    cadastroInFlightRef.current = true;
    setCarregandoCadastro(true);

    const payload = {
      nome: formCadastro.nome.trim(),
      email: formCadastro.email.trim(),
      cpf: formCadastro.cpf ? formCadastro.cpf.replace(/\D/g, '') : null,
      senha: formCadastro.senha,
      dataNascimento: formCadastro.dataNascimento || null,
      responsavel: isMenorIdade
        ? {
            nome: formCadastro.responsavelNome.trim(),
            cpf: formCadastro.responsavelCpf.trim(),
            parentesco: formCadastro.responsavelParentesco,
            telefone: formCadastro.responsavelTelefone.trim(),
            email: formCadastro.responsavelEmail ? formCadastro.responsavelEmail.trim() : null,
            consentimentoAceito: formCadastro.consentimentoResponsavel,
          }
        : null,
    };

    try {
      const res = await fetch(`${API_BASE}/api/maes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const maeCriada = await res.json();
        setPendingConfirmation({
          email: maeCriada.email || formCadastro.email.trim().toLowerCase(),
          nome: maeCriada.nome || formCadastro.nome.trim(),
          senha: formCadastro.senha,
        });
        return;
      }

      const errJson = await res.json().catch(() => ({}));
      setErroCadastro(extrairMensagemErro(errJson, 'Não foi possível concluir o cadastro. Verifique os dados.'));
    } catch {
      setErroCadastro('Não foi possível conectar ao servidor para concluir o cadastro.');
    } finally {
      cadastroInFlightRef.current = false;
      setCarregandoCadastro(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2 rounded-xl border border-stone-200 bg-[#f1f0ed] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#56725a]/60 text-[13px] text-gray-800 transition';

  const papelLabel = PAPEIS.find((p) => p.id === papel)?.label || 'Entrar';

  return (
    <div className="min-h-dvh lg:h-dvh lg:overflow-hidden relative flex flex-col lg:block bg-[#faf8f4] antialiased">
      {/* ================================================================= */}
      {/* COLUNA DE FORMULÁRIO (Desliza da esquerda para direita no Cadastro) */}
      {/* ================================================================= */}
      <div
        className={`w-full lg:w-1/2 lg:h-dvh lg:absolute lg:top-0 lg:left-0 z-20 flex items-center justify-center px-5 py-4 sm:px-8 bg-[#faf8f4] overflow-y-auto transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isCadastro ? 'lg:translate-x-full' : 'lg:translate-x-0'
        }`}
      >
        <div className="w-full max-w-md my-auto py-2">
          {/* Top row: Voltar para Home + Logo compacta */}
          <div className="flex items-center justify-between mb-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 transition cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Página inicial</span>
            </Link>
            <Link to="/" className="flex items-center gap-1.5 transition-transform hover:scale-105">
              <img src={LOGO} alt="Florável" className="h-8 w-auto object-contain" />
              <span className="font-serif text-lg font-bold text-[#1f2a22]">florável</span>
            </Link>
          </div>

          {/* Título dinâmico + Abas deslizantes Login / Cadastro */}
          <div className="text-center mb-3.5">
            <h1 className="text-xl font-bold text-[#1f2a22] font-serif leading-tight">
              {isCadastro ? 'Crie sua conta Florável' : 'Acesse seu espaço'}
            </h1>
            <p className="text-[11.5px] text-gray-600 mt-0.5">
              {isCadastro
                ? 'Preencha seus dados abaixo — você já sai acolhida.'
                : 'Acolhimento, respeito e privacidade em cada etapa.'}
            </p>
          </div>

          {/* Alternador Rápido de Modo: Entrar vs Cadastrar */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#edeae4] rounded-2xl mb-3">
            <button
              type="button"
              onClick={() => alternarModo('login')}
              className={`py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                !isCadastro ? 'bg-white text-[#294D33] shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => alternarModo('cadastro')}
              className={`py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                isCadastro ? 'bg-white text-[#294D33] shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Criar Conta
            </button>
          </div>

          {/* Seletor de Perfil Compartilhado (Mãe / Terapeuta / RH) */}
          <div className="mb-3">
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#edeae4] rounded-xl">
              {PAPEIS.map((p) => {
                const ativo = papel === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setPapel(p.id);
                      setErroLogin('');
                      setErroCadastro('');
                    }}
                    className={`py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                      ativo
                        ? 'bg-white text-[#294D33] shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
            <p className="text-[10.5px] text-stone-500 mt-1 text-center truncate">
              {PAPEIS.find((p) => p.id === papel)?.desc}
            </p>
          </div>

          {/* ======================= MODO LOGIN ======================= */}
          {!isCadastro ? (
            <div className="animate-fadeIn">
              <form onSubmit={handleLoginSubmit} className="space-y-2.5">
                <div>
                  <label htmlFor="email" className="block text-[11px] font-semibold text-gray-700 mb-0.5">
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
                  <div className="flex items-center justify-between mb-0.5">
                    <label htmlFor="senha" className="block text-[11px] font-semibold text-gray-700">
                      Senha
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] font-medium text-[#294D33] hover:underline cursor-pointer"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-[#56725a] hover:text-[#2f4a36] cursor-pointer"
                    >
                      {mostrarSenha ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                </div>

                {erroLogin && (
                  <p role="alert" className="text-xs text-red-600 text-center font-medium">
                    {erroLogin}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={carregandoLogin}
                  className="w-full py-2.5 text-xs sm:text-sm rounded-xl bg-[#56725a] hover:bg-[#465e4a] active:scale-[0.99] disabled:opacity-60 text-white font-bold shadow-md shadow-[#56725a]/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-1"
                >
                  <span>{carregandoLogin ? 'Conectando...' : `Entrar como ${papelLabel}`}</span>
                  <ExternalLink size={14} />
                </button>
              </form>

              {/* Atalhos de Demonstração (1 Clique) */}
              <div className="mt-4 pt-3.5 border-t border-[#d9d6cf]/60">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 text-center mb-2">
                  Acesso Rápido Demo Day:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={APP_LINKS.mae}
                    className="p-1.5 text-center rounded-xl bg-[#FCE7F0] border border-[#E8A9BB]/40 hover:bg-[#F4DDE5] transition shadow-2xs"
                  >
                    <span className="text-sm mr-1">🌸</span>
                    <span className="text-[11px] font-bold text-[#294D33]">Mãe</span>
                  </a>

                  <a
                    href={APP_LINKS.terapeuta}
                    className="p-1.5 text-center rounded-xl bg-[#EBF3EE] border border-[#73937E]/30 hover:bg-[#EBF3EE]/80 transition shadow-2xs"
                  >
                    <span className="text-sm mr-1">🩺</span>
                    <span className="text-[11px] font-bold text-[#294D33]">Terapeuta</span>
                  </a>

                  <a
                    href={APP_LINKS.rh}
                    className="p-1.5 text-center rounded-xl bg-[#FDF4E7] border border-[#E8BA85]/40 hover:bg-[#FDF4E7]/80 transition shadow-2xs"
                  >
                    <span className="text-sm mr-1">🏢</span>
                    <span className="text-[11px] font-bold text-[#294D33]">RH B2B</span>
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 my-3">
                <div className="flex-1 h-px bg-[#d9d6cf]" />
                <span className="text-[10px] text-gray-500 font-semibold">OU</span>
                <div className="flex-1 h-px bg-[#d9d6cf]" />
              </div>

              <div ref={googleBtnRef} className="w-full flex justify-center min-h-[42px]" />
              {!googleReady && (
                <button
                  type="button"
                  onClick={handleGoogle}
                  aria-label="Entrar com Google"
                  className="w-full py-2 rounded-xl bg-[#f1f0ed] hover:bg-white border border-[#e2dfd8] shadow-2xs flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs font-semibold text-stone-700"
                >
                  <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
                    <path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z" />
                    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
                  </svg>
                  <span>Continuar com Google</span>
                </button>
              )}

              <p className="text-[11px] text-center text-gray-600 mt-3">
                Não possui uma conta?{' '}
                <button
                  type="button"
                  onClick={() => alternarModo('cadastro')}
                  className="font-bold text-[#2f4a36] hover:underline cursor-pointer"
                >
                  Criar Conta agora
                </button>
              </p>
            </div>
          ) : (
            /* ======================= MODO CADASTRO DESLIZANTE ======================= */
            <div className="animate-fadeIn">
              <form onSubmit={handleCadastroSubmit} className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor="cad-nome" className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                      Nome completo
                    </label>
                    <input
                      id="cad-nome"
                      name="nome"
                      type="text"
                      required
                      placeholder="Seu nome completo"
                      value={formCadastro.nome}
                      onChange={handleCadastroChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="cad-email" className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                      E-mail {papel === 'rh' ? 'corporativo' : ''}
                    </label>
                    <input
                      id="cad-email"
                      name="email"
                      type="email"
                      required
                      placeholder={papel === 'rh' ? 'gestor@empresa.com' : 'email@exemplo.com'}
                      value={formCadastro.email}
                      onChange={handleCadastroChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                {papel === 'mae' && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label htmlFor="cad-cpf" className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                          CPF (Receita / Gov.br)
                        </label>
                        <input
                          id="cad-cpf"
                          name="cpf"
                          type="text"
                          placeholder="000.000.000-00"
                          value={formCadastro.cpf}
                          onChange={handleCadastroChange}
                          className={`${inputClass} tabular-nums`}
                        />
                      </div>

                      <div>
                        <label htmlFor="cad-nasc" className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                          Nascimento (13 a 80a)
                        </label>
                        <input
                          id="cad-nasc"
                          name="dataNascimento"
                          type="date"
                          value={formCadastro.dataNascimento}
                          onChange={handleCadastroChange}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* Atalhos Demo Day API Governo */}
                    <div className="flex flex-wrap items-center gap-1 text-[10px]">
                      <span className="font-bold text-stone-500">Testar Gov.br:</span>
                      <button
                        type="button"
                        onClick={() => {
                          const c = '390.533.447-05';
                          setFormCadastro((p) => ({ ...p, cpf: c, dataNascimento: '1996-05-20' }));
                          consultarApiGoverno(c, '1996-05-20');
                        }}
                        className="px-2 py-0.5 rounded-full bg-stone-100 hover:bg-[#EBF3ED] text-stone-700 font-semibold cursor-pointer"
                      >
                        Adulta (F)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const c = '145.829.310-65';
                          setFormCadastro((p) => ({ ...p, cpf: c }));
                          consultarApiGoverno(c, formCadastro.dataNascimento || '1998-05-10');
                        }}
                        className="px-2 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold cursor-pointer"
                      >
                        Menor 15a
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const c = '529.982.247-25';
                          setFormCadastro((p) => ({ ...p, cpf: c }));
                          consultarApiGoverno(c, formCadastro.dataNascimento || '1992-03-15');
                        }}
                        className="px-2 py-0.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 font-semibold cursor-pointer"
                      >
                        Masc. (Espaço Seguro)
                      </button>
                    </div>

                    {validandoGov && (
                      <p className="text-[10.5px] font-semibold text-[#56725a]">
                        Validando identidade civil na Receita Federal...
                      </p>
                    )}

                    {govResult && (
                      <div
                        className={`p-2.5 rounded-xl border text-[11px] leading-snug ${
                          govResult.bloqueadoEspacoSeguro || !govResult.cpfValido
                            ? 'bg-rose-50 border-rose-200 text-rose-900'
                            : govResult.divergenciaCadastral || govResult.menorDeIdade
                            ? 'bg-amber-50 border-amber-200 text-amber-950'
                            : 'bg-[#EBF3ED] border-[#56725a]/30 text-[#1f2a22]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold mb-0.5">
                          <ShieldCheck size={13} className="shrink-0" />
                          <span>
                            {govResult.bloqueadoEspacoSeguro
                              ? 'Espaço Seguro Exclusivo para Mães'
                              : !govResult.cpfValido
                              ? 'CPF Inválido'
                              : 'Receita Federal / Gov.br'}
                          </span>
                        </div>
                        <p>{govResult.mensagemClinicaEtica}</p>
                      </div>
                    )}
                  </div>
                )}

                {isIdadeAbaixoMinimo && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-950 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertCircle size={14} /> Proteção à Infância (&lt; 13 anos)
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <a href="tel:100" className="px-2.5 py-1 rounded-lg bg-amber-900 text-white font-bold inline-flex items-center gap-1">
                        <PhoneCall size={11} /> Disque 100
                      </a>
                      <a href="tel:190" className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 font-bold">
                        Conselho Tutelar / CRAS
                      </a>
                    </div>
                  </div>
                )}

                {isIdadeAcimaMaximo && (
                  <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-900">
                    Idade máxima permitida: 80 anos.
                  </div>
                )}

                {/* Responsável Legal (ECA Art. 17) */}
                {isMenorIdade && (
                  <div className="p-3 rounded-xl bg-[#EBF3ED]/80 border border-[#56725a]/30 space-y-2 text-[11px]">
                    <div className="flex items-start gap-1.5 font-bold text-[#1f2a22]">
                      <HeartHandshake size={15} className="text-[#294D33] shrink-0 mt-0.5" />
                      <span>Autorização do Responsável (ECA Art. 17 · {idade} anos)</span>
                    </div>
                    <div className="flex items-start gap-1.5 bg-white/80 p-2 rounded-lg text-[10px]">
                      <Lock size={12} className="text-[#294D33] shrink-0 mt-0.5" />
                      <span>Sigilo protegido: o responsável autoriza o uso, mas não acessa suas conversas.</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        name="responsavelNome"
                        type="text"
                        required={isMenorIdade}
                        placeholder="Nome do responsável *"
                        value={formCadastro.responsavelNome}
                        onChange={handleCadastroChange}
                        className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-[11px]"
                      />
                      <input
                        name="responsavelCpf"
                        type="text"
                        required={isMenorIdade}
                        placeholder="CPF responsável *"
                        value={formCadastro.responsavelCpf}
                        onChange={handleCadastroChange}
                        className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-[11px]"
                      />
                      <select
                        name="responsavelParentesco"
                        value={formCadastro.responsavelParentesco}
                        onChange={handleCadastroChange}
                        className="px-2 py-1.5 rounded-lg border border-stone-200 bg-white text-[11px]"
                      >
                        <option value="Mãe">Mãe</option>
                        <option value="Pai">Pai</option>
                        <option value="Avó/Avô">Avó / Avô</option>
                        <option value="Tutor Legal">Tutor(a) Legal</option>
                      </select>
                      <input
                        name="responsavelTelefone"
                        type="tel"
                        required={isMenorIdade}
                        placeholder="WhatsApp (OTP) *"
                        value={formCadastro.responsavelTelefone}
                        onChange={handleCadastroChange}
                        className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-[11px]"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-0.5">
                      <button
                        type="button"
                        onClick={() => setMostrarAjudaVulnerabilidade((v) => !v)}
                        className="text-[10px] font-bold text-[#294D33] underline cursor-pointer"
                      >
                        Sem apoio familiar? Ver canais
                      </button>
                      <label className="inline-flex items-center gap-1 text-[10px] cursor-pointer">
                        <input
                          name="consentimentoResponsavel"
                          type="checkbox"
                          checked={formCadastro.consentimentoResponsavel}
                          onChange={handleCadastroChange}
                        />
                        Autorizado
                      </label>
                    </div>
                    {mostrarAjudaVulnerabilidade && (
                      <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[10px] text-amber-950">
                        Canais sigilosos: <strong>Disque 100</strong> • <strong>Ligue 180</strong> • <strong>CRAS / UBS</strong>.
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label htmlFor="cad-senha" className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                    Senha segura
                  </label>
                  <input
                    id="cad-senha"
                    name="senha"
                    type="password"
                    required
                    placeholder="Mínimo de 6 caracteres"
                    value={formCadastro.senha}
                    onChange={handleCadastroChange}
                    className={inputClass}
                  />
                </div>

                {erroCadastro && (
                  <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800 font-medium">
                    {erroCadastro}
                  </div>
                )}

                <label className="flex items-start gap-2 text-[10.5px] text-stone-600 cursor-pointer">
                  <input
                    name="termoAceito"
                    type="checkbox"
                    checked={formCadastro.termoAceito}
                    onChange={handleCadastroChange}
                    className="mt-0.5 rounded border-stone-300 text-[#56725a]"
                  />
                  <span>
                    Concordo com os Termos de Privacidade (LGPD) e sigilo Florável. Emergências: CVV 188 / SAMU 192.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={carregandoCadastro || isIdadeAbaixoMinimo || isIdadeAcimaMaximo || bloqueadoEspacoSeguro}
                  className="w-full py-2.5 text-xs sm:text-sm rounded-xl bg-[#56725a] hover:bg-[#465e4a] disabled:opacity-50 text-white font-bold shadow-md shadow-[#56725a]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{carregandoCadastro ? 'Preparando acesso...' : `Criar conta (${papelLabel})`}</span>
                  <ExternalLink size={14} />
                </button>
              </form>

              <p className="text-[11px] text-center text-gray-600 mt-3">
                Já possui uma conta?{' '}
                <button
                  type="button"
                  onClick={() => alternarModo('login')}
                  className="font-bold text-[#2f4a36] hover:underline cursor-pointer"
                >
                  Fazer Login
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ================================================================= */}
      {/* COLUNA DA IMAGEM COM FLORES (Desliza suavemente para a esquerda)  */}
      {/* ================================================================= */}
      <div
        className={`hidden lg:block lg:w-1/2 lg:h-dvh lg:absolute lg:top-0 lg:right-0 z-10 overflow-hidden transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isCadastro ? 'lg:-translate-x-full' : 'lg:translate-x-0'
        }`}
      >
        <img src={LOGIN_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            isCadastro
              ? 'bg-gradient-to-l from-[#faf8f4]/30 via-transparent to-black/15'
              : 'bg-gradient-to-r from-[#faf8f4]/30 via-transparent to-black/15'
          }`}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />

        <div className="absolute bottom-8 inset-x-8 p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-white/60 shadow-lg text-[#1f2a22]">
          <p className="font-serif text-lg font-semibold leading-snug">
            {isCadastro
              ? '“Você não precisa dar conta de tudo sozinha. Floresça no seu tempo.”'
              : '“Um espaço seguro para acolher suas emoções no puerpério e na maternidade.”'}
          </p>
          <p className="text-xs text-[#4A5E4D] mt-1.5 font-medium">
            Florável · Saúde Emocional Materna &amp; Privacidade (LGPD / CFP)
          </p>
        </div>
      </div>

      {/* Modal de Recuperação de Senha */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#294D33]/40 backdrop-blur-xs">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Recuperação de senha"
            className="relative w-full max-w-md bg-[#FCF7F9] rounded-[2rem] p-6 sm:p-8 shadow-2xl border border-[#E8A9BB]/60 text-left"
          >
            <button
              type="button"
              aria-label="Fechar recuperação de senha"
              onClick={() => setShowForgotModal(false)}
              className="absolute top-5 right-5 text-[#516B55] hover:text-[#294D33] hover:bg-[#F4DDE5] p-2 rounded-full transition cursor-pointer"
            >
              <X size={20} />
            </button>
            <PasswordRecoveryFlow
              isModal
              initialEmail={email}
              onClose={() => setShowForgotModal(false)}
              onSuccessLogin={(recoveredEmail) => {
                if (recoveredEmail) {
                  setEmail(recoveredEmail);
                }
                setShowForgotModal(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Modal de Confirmação de E-mail Pós-Cadastro */}
      {pendingConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#294D33]/40 backdrop-blur-xs">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Confirmação de e-mail"
            className="relative w-full max-w-md bg-[#FCF7F9] rounded-[2rem] p-6 sm:p-8 shadow-2xl border border-[#E8A9BB]/60 text-left"
          >
            <button
              type="button"
              aria-label="Fechar confirmação de e-mail"
              onClick={() => setPendingConfirmation(null)}
              className="absolute top-5 right-5 text-[#516B55] hover:text-[#294D33] hover:bg-[#F4DDE5] p-2 rounded-full transition cursor-pointer"
            >
              <X size={20} />
            </button>
            <EmailConfirmationFlow
              isModal
              initialEmail={pendingConfirmation.email}
              nome={pendingConfirmation.nome}
              pendingAuthCredentials={{
                email: pendingConfirmation.email,
                senha: pendingConfirmation.senha,
              }}
              onClose={() => setPendingConfirmation(null)}
              onGoToLogin={(confirmedEmail) => {
                setPendingConfirmation(null);
                if (confirmedEmail) {
                  setEmail(confirmedEmail);
                }
                alternarModo('login');
              }}
              onEnterMaeApp={(sessionData) => {
                if (!sessionData?.tokenSessao) {
                  setPendingConfirmation(null);
                  if (sessionData?.email) setEmail(sessionData.email);
                  alternarModo('login');
                  return;
                }
                salvarSessaoLocal(sessionData, 'mae');
                navigateToApp('mae', sessionData);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
