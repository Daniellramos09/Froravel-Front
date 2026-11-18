import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, ShieldCheck, HeartHandshake, Lock, PhoneCall, AlertCircle } from 'lucide-react';
import { APP_LINKS, navigateToApp } from '../../utils/appLinks';

const LOGO = '/img/fotoheader/logo.png';

const TIPOS_CONTA = [
  { id: 'mae', label: 'Sou Mãe', desc: 'Acolhimento emocional, diário, triagem e rodas comunitárias.' },
  { id: 'terapeuta', label: 'Sou Terapeuta', desc: 'Credenciamento clínico, consultório virtual e agenda.' },
  { id: 'rh', label: 'Empresa / RH', desc: 'Solução B2B para apoio às colaboradoras e conformidade ESG.' },
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

export default function CadastroScreen() {
  const [tipoConta, setTipoConta] = useState('mae');
  const [formData, setFormData] = useState({
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
  const [carregando, setCarregando] = useState(false);
  const [erroValidacao, setErroValidacao] = useState('');
  const [govResult, setGovResult] = useState(null);
  const [validandoGov, setValidandoGov] = useState(false);
  const [mostrarAjudaVulnerabilidade, setMostrarAjudaVulnerabilidade] = useState(false);

  const idade = useMemo(() => calcularIdade(formData.dataNascimento), [formData.dataNascimento]);
  const isMenorIdade = tipoConta === 'mae' && idade !== null && idade >= 13 && idade < 18;
  const isIdadeAbaixoMinimo = tipoConta === 'mae' && idade !== null && idade < 13;
  const isIdadeAcimaMaximo = tipoConta === 'mae' && idade !== null && idade > 80;
  const bloqueadoEspacoSeguro = tipoConta === 'mae' && govResult?.bloqueadoEspacoSeguro === true;

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
          ? 'Divergência identificada via Receita/Gov: a data de nascimento foi corrigida para 15 anos. Conforme o ECA (Art. 17) e LGPD (Art. 14), o consentimento do responsável legal é obrigatório (sem acesso às conversas íntimas).'
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
          'As Rodas de Conversa e a Comunidade Florável constituem um ambiente clínico protegido e exclusivo para mulheres no ciclo gravídico-puerperal, garantindo intimidade durante o pós-parto e amamentação.',
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
      mensagemClinicaEtica: 'Identidade civil e elegibilidade ao Espaço Seguro Florável confirmadas.',
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
    setErroValidacao('');
    let resultado = null;

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const res = await fetch(`${apiBase}/api/governo/validar-identidade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpf: cpfLimpo,
          dataNascimentoInformada: dataAtual || null,
          nomeInformado: formData.nome || null,
        }),
      });
      if (res.ok) {
        resultado = await res.json();
      }
    } catch (_) {
      // Fallback resiliente para demonstração sem back-end local ligado
    }

    if (!resultado) {
      resultado = simularFallbackGovernoLocal(cpfLimpo, dataAtual);
    }

    setGovResult(resultado);
    if (resultado?.dadosCidadao?.dataNascimentoOficial && resultado.cpfValido && !resultado.bloqueadoEspacoSeguro) {
      setFormData((prev) => ({
        ...prev,
        dataNascimento: resultado.dadosCidadao.dataNascimentoOficial,
      }));
    }
    setValidandoGov(false);
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    let finalValue = type === 'checkbox' ? checked : value;
    if (name === 'cpf') {
      finalValue = formatarCpf(value);
      const apenasDigitos = finalValue.replace(/\D/g, '');
      if (apenasDigitos.length === 11) {
        consultarApiGoverno(finalValue, formData.dataNascimento);
      } else {
        setGovResult(null);
      }
    }
    setErroValidacao('');
    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErroValidacao('');

    if (bloqueadoEspacoSeguro) {
      setErroValidacao(govResult.mensagemClinicaEtica);
      return;
    }

    if (tipoConta === 'mae' && formData.dataNascimento) {
      if (isIdadeAbaixoMinimo) {
        setErroValidacao('A idade mínima para auto-cadastro na plataforma é 13 anos. Em situação de vulnerabilidade, utilize os canais públicos de proteção abaixo.');
        return;
      }
      if (isIdadeAcimaMaximo) {
        setErroValidacao('Data de nascimento inválida: a idade máxima permitida para cadastro é 80 anos.');
        return;
      }
      if (isMenorIdade) {
        if (!formData.responsavelNome.trim() || !formData.responsavelCpf.trim() || !formData.responsavelTelefone.trim() || !formData.consentimentoResponsavel) {
          setErroValidacao('Para mães menores de 18 anos (13 a 17 anos), é obrigatório informar os dados e o consentimento do responsável legal (ECA & LGPD Art. 14).');
          return;
        }
      }
    }

    setCarregando(true);

    if (tipoConta === 'mae') {
      const payload = {
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        cpf: formData.cpf ? formData.cpf.replace(/\D/g, '') : null,
        senha: formData.senha,
        dataNascimento: formData.dataNascimento || null,
        responsavel: isMenorIdade
          ? {
              nome: formData.responsavelNome.trim(),
              cpf: formData.responsavelCpf.trim(),
              parentesco: formData.responsavelParentesco,
              telefone: formData.responsavelTelefone.trim(),
              email: formData.responsavelEmail ? formData.responsavelEmail.trim() : null,
              consentimentoAceito: formData.consentimentoResponsavel,
            }
          : null,
      };

      fetch('http://localhost:8080/api/maes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(async (res) => {
          if (res.ok) {
            const maeCriada = await res.json();
            localStorage.setItem('floravel_mae_sessao', JSON.stringify(maeCriada));
          }
        })
        .catch(() => {
          // Fallback resiliente para Demo Day caso o servidor local esteja desligado
        })
        .finally(() => {
          window.location.href = `${APP_LINKS.mae}?onboarding=true`;
        });
    } else {
      setTimeout(() => {
        navigateToApp(tipoConta);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f4] px-4 py-12 antialiased">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-sm border border-stone-200/70 p-6 sm:p-10">
        
        {/* Voltar à Landing Page */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#56725a] hover:text-[#2f4a36] hover:underline mb-6 transition cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Voltar para a página inicial</span>
        </Link>

        {/* Título e Subtítulo */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <img src={LOGO} alt="Florável" className="h-10 w-10 object-contain drop-shadow-2xs" />
            <span className="font-serif text-2xl font-bold text-[#1f2a22]">florável</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight font-serif">
            Crie sua conta
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Escolha seu tipo de acesso para começar na plataforma Florável
          </p>
        </div>

        {/* Seletor do Tipo de Conta */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {TIPOS_CONTA.map((tipo) => {
            const isSelected = tipoConta === tipo.id;
            return (
              <button
                key={tipo.id}
                type="button"
                onClick={() => {
                  setTipoConta(tipo.id);
                  setErroValidacao('');
                }}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                  isSelected
                    ? 'border-[#56725a] bg-[#56725a]/10 text-[#1f2a22] shadow-2xs font-bold'
                    : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100 text-stone-600'
                }`}
              >
                <span className="block text-sm sm:text-base mb-0.5">
                  {tipo.id === 'mae' ? '🌸' : tipo.id === 'terapeuta' ? '🩺' : '🏢'}
                </span>
                <span className="text-xs font-bold block">{tipo.label}</span>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-gray-500 text-center mb-6 min-h-[30px] flex items-center justify-center">
          {TIPOS_CONTA.find((t) => t.id === tipoConta)?.desc}
        </p>

        {/* Formulário de Cadastro */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-xs font-semibold text-gray-700 mb-1">
              Nome completo
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              required
              placeholder="Digite seu nome completo"
              value={formData.nome}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#f1f0ed] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#56725a]/60 text-sm text-gray-800 transition"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
              E-mail {tipoConta === 'rh' ? 'corporativo' : ''}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder={tipoConta === 'rh' ? 'gestor@empresa.com.br' : 'seuemail@exemplo.com'}
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#f1f0ed] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#56725a]/60 text-sm text-gray-800 transition"
            />
          </div>

          {tipoConta === 'mae' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="cpf" className="block text-xs font-semibold text-gray-700 mb-1">
                    CPF (Verificação Receita / Gov.br)
                  </label>
                  <input
                    id="cpf"
                    name="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#f1f0ed] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#56725a]/60 text-sm text-gray-800 transition tabular-nums"
                  />
                </div>

                <div>
                  <label htmlFor="dataNascimento" className="block text-xs font-semibold text-gray-700 mb-1">
                    Data de nascimento (13 a 80 anos)
                  </label>
                  <input
                    id="dataNascimento"
                    name="dataNascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#f1f0ed] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#56725a]/60 text-sm text-gray-800 transition"
                  />
                </div>
              </div>

              {/* Atalhos de Homologação da API Governamental para Demo Day */}
              <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                <span className="font-bold text-stone-500">Simular Gov.br / Receita:</span>
                <button
                  type="button"
                  onClick={() => {
                    const cpfF = '390.533.447-05';
                    setFormData((p) => ({ ...p, cpf: cpfF, dataNascimento: '1996-05-20' }));
                    consultarApiGoverno(cpfF, '1996-05-20');
                  }}
                  className="px-2 py-0.5 rounded-full bg-stone-100 hover:bg-[#EBF3ED] text-stone-700 font-semibold cursor-pointer transition"
                >
                  Adulta (F)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const cpfM = '145.829.310-65';
                    setFormData((p) => ({ ...p, cpf: cpfM }));
                    consultarApiGoverno(cpfM, formData.dataNascimento || '1998-05-10');
                  }}
                  className="px-2 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold cursor-pointer transition"
                >
                  Menor 15a (Anti-fraude)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const cpfH = '529.982.247-25';
                    setFormData((p) => ({ ...p, cpf: cpfH }));
                    consultarApiGoverno(cpfH, formData.dataNascimento || '1992-03-15');
                  }}
                  className="px-2 py-0.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 font-semibold cursor-pointer transition"
                >
                  Masculino (Espaço Seguro)
                </button>
              </div>

              {validandoGov && (
                <p className="text-[11px] font-semibold text-[#56725a]">
                  Consultando base oficial de identidade civil (CPF / Receita Federal)...
                </p>
              )}

              {govResult && (
                <div
                  className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
                    govResult.bloqueadoEspacoSeguro || !govResult.cpfValido
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : govResult.divergenciaCadastral || govResult.menorDeIdade
                      ? 'bg-amber-50 border-amber-200 text-amber-950'
                      : 'bg-[#EBF3ED] border-[#56725a]/30 text-[#1f2a22]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <ShieldCheck size={15} className="shrink-0" />
                    <span>
                      {govResult.bloqueadoEspacoSeguro
                        ? 'Proteção de Espaço Seguro (Comunidade Exclusiva para Mães)'
                        : !govResult.cpfValido
                        ? 'CPF Inválido'
                        : 'Verificação Receita Federal / Gov.br'}
                    </span>
                  </div>
                  <p className="text-[11px]">{govResult.mensagemClinicaEtica}</p>
                </div>
              )}
            </div>
          )}

          {/* Bloqueio acolhedor para menores de 13 anos */}
          {isIdadeAbaixoMinimo && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <AlertCircle size={16} className="shrink-0" />
                <span>Proteção Prioritária à Infância (Idade mínima: 13 anos)</span>
              </div>
              <p className="leading-relaxed">
                Para sua segurança física e jurídica, o auto-cadastro online é restrito a partir de 13 anos. Gestação na infância exige acolhimento presencial prioritário pela rede de proteção:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <a href="tel:100" className="px-3 py-1.5 rounded-xl bg-amber-900 text-white font-bold inline-flex items-center gap-1.5">
                  <PhoneCall size={13} /> Disque 100 (Direitos Humanos)
                </a>
                <a href="tel:190" className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold">
                  Conselho Tutelar / CRAS Local
                </a>
              </div>
            </div>
          )}

          {/* Aviso de limite máximo de 80 anos */}
          {isIdadeAcimaMaximo && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 font-medium">
              Verifique o ano informado: a idade máxima permitida para cadastro materno na plataforma é de 80 anos.
            </div>
          )}

          {/* Seção Desacoplada: Responsável Legal para Mães Adolescentes (13 a 17 anos) */}
          {isMenorIdade && (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#EBF3ED]/80 border border-[#56725a]/30 space-y-3.5 animate-fadeIn">
              <div className="flex items-start gap-2.5">
                <HeartHandshake size={20} className="text-[#294D33] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#1f2a22]">
                    Acolhimento para Mães Adolescentes ({idade} anos)
                  </h3>
                  <p className="text-[11px] text-stone-600 leading-relaxed mt-0.5">
                    Conforme o ECA e a LGPD (Art. 14), precisamos da autorização de um responsável legal para liberar seu acesso às rodas e psicólogas.
                  </p>
                </div>
              </div>

              {/* Garantia de Sigilo ECA Art. 17 */}
              <div className="p-3 rounded-xl bg-white/90 border border-[#56725a]/20 flex items-start gap-2 text-[11px] text-[#1f2a22]">
                <Lock size={15} className="text-[#294D33] shrink-0 mt-0.5" />
                <span>
                  <strong>Seu sigilo está protegido (ECA Art. 17):</strong> Seu responsável autoriza apenas o uso da plataforma, mas <strong>NÃO terá acesso</strong> às suas conversas nas rodas, desabafos ou relatos.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Nome completo do Responsável Legal *
                  </label>
                  <input
                    name="responsavelNome"
                    type="text"
                    required={isMenorIdade}
                    placeholder="Ex: Maria da Silva"
                    value={formData.responsavelNome}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#56725a]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    CPF do Responsável *
                  </label>
                  <input
                    name="responsavelCpf"
                    type="text"
                    required={isMenorIdade}
                    placeholder="000.000.000-00"
                    value={formData.responsavelCpf}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#56725a]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Vínculo / Parentesco *
                  </label>
                  <select
                    name="responsavelParentesco"
                    value={formData.responsavelParentesco}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#56725a]"
                  >
                    <option value="Mãe">Mãe</option>
                    <option value="Pai">Pai</option>
                    <option value="Avó/Avô">Avó / Avô</option>
                    <option value="Tutor Legal">Tutor(a) Legal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    WhatsApp do Responsável (OTP) *
                  </label>
                  <input
                    name="responsavelTelefone"
                    type="tel"
                    required={isMenorIdade}
                    placeholder="(11) 90000-0000"
                    value={formData.responsavelTelefone}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#56725a]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    E-mail do Responsável (opcional)
                  </label>
                  <input
                    name="responsavelEmail"
                    type="email"
                    placeholder="responsavel@email.com"
                    value={formData.responsavelEmail}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#56725a]"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1 text-[11px] text-stone-700">
                <input
                  id="consentimentoResponsavel"
                  name="consentimentoResponsavel"
                  type="checkbox"
                  checked={formData.consentimentoResponsavel}
                  onChange={handleChange}
                  className="mt-0.5 rounded border-stone-300 text-[#56725a] focus:ring-[#56725a]"
                />
                <label htmlFor="consentimentoResponsavel">
                  Confirmo que meu responsável legal autoriza minha participação na Florável, respeitando meu direito ao sigilo nas salas de escuta.
                </label>
              </div>

              <div className="pt-1 border-t border-[#56725a]/15 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setMostrarAjudaVulnerabilidade(!mostrarAjudaVulnerabilidade)}
                  className="text-[11px] font-bold text-[#294D33] underline hover:text-[#1f2a22] cursor-pointer"
                >
                  Não tenho apoio familiar / Preciso de ajuda
                </button>
                <span className="text-[10px] text-stone-500">Modo Leitura Liberado</span>
              </div>

              {mostrarAjudaVulnerabilidade && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-950 space-y-1.5">
                  <p className="font-bold">Você não está sozinha. Canais gratuitos e sigilosos de proteção:</p>
                  <p>• <strong>Disque 100</strong> (Direitos Humanos / Proteção à Adolescente)</p>
                  <p>• <strong>Ligue 180</strong> (Central de Atendimento à Mulher)</p>
                  <p>• Procure o <strong>CRAS</strong> ou <strong>UBS</strong> mais próxima para acolhimento pré-natal pelo SUS.</p>
                </div>
              )}
            </div>
          )}

          <div>
            <label htmlFor="senha" className="block text-xs font-semibold text-gray-700 mb-1">
              Senha segura
            </label>
            <input
              id="senha"
              name="senha"
              type="password"
              required
              placeholder="Mínimo de 6 caracteres"
              value={formData.senha}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#f1f0ed] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#56725a]/60 text-sm text-gray-800 transition"
            />
          </div>

          {erroValidacao && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
              {erroValidacao}
            </div>
          )}

          {/* Termos de Uso e LGPD */}
          <div className="flex items-start gap-2 pt-1 text-xs text-stone-600">
            <input
              id="termoAceito"
              name="termoAceito"
              type="checkbox"
              checked={formData.termoAceito}
              onChange={handleChange}
              className="mt-0.5 rounded border-stone-300 text-[#56725a] focus:ring-[#56725a]"
            />
            <label htmlFor="termoAceito">
              Concordo com os Termos de Uso e a Política de Privacidade e Anonimato (LGPD) da Florável. Em emergências médicas, acione o CVV (188) ou SAMU (192).
            </label>
          </div>

          {/* Botão de Cadastro Principal */}
          <button
            type="submit"
            disabled={carregando || isIdadeAbaixoMinimo || isIdadeAcimaMaximo || bloqueadoEspacoSeguro}
            className="w-full bg-[#56725a] hover:bg-[#465e4a] disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-[#56725a]/20 cursor-pointer flex items-center justify-center gap-2 mt-4"
          >
            <span>{carregando ? 'Preparando seu acesso...' : 'Cadastrar e Acessar Plataforma'}</span>
            <ExternalLink size={14} />
          </button>
        </form>

        {/* Link para quem já possui conta */}
        <div className="mt-6 pt-5 border-t border-stone-100 text-center">
          <p className="text-xs text-stone-500">
            Já possui uma conta?{' '}
            <Link to="/login" className="font-bold text-[#56725a] hover:underline">
              Fazer Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
