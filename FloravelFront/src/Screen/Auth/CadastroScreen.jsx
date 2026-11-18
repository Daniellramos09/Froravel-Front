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
  const [mostrarAjudaVulnerabilidade, setMostrarAjudaVulnerabilidade] = useState(false);

  const idade = useMemo(() => calcularIdade(formData.dataNascimento), [formData.dataNascimento]);
  const isMenorIdade = tipoConta === 'mae' && idade !== null && idade >= 13 && idade < 18;
  const isIdadeAbaixoMinimo = tipoConta === 'mae' && idade !== null && idade < 13;
  const isIdadeAcimaMaximo = tipoConta === 'mae' && idade !== null && idade > 80;

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setErroValidacao('');
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErroValidacao('');

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
    setTimeout(() => {
      if (tipoConta === 'mae') {
        window.location.href = `${APP_LINKS.mae}?onboarding=true`;
      } else {
        navigateToApp(tipoConta);
      }
    }, 600);
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
            <div>
              <label htmlFor="dataNascimento" className="block text-xs font-semibold text-gray-700 mb-1">
                Data de nascimento (limites: 13 a 80 anos)
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
            disabled={carregando || isIdadeAbaixoMinimo || isIdadeAcimaMaximo}
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
