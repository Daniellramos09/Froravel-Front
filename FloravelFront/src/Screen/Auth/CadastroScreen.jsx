import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, ShieldCheck, Check } from 'lucide-react';
import { APP_LINKS, navigateToApp } from '../../utils/appLinks';

const LOGO = '/img/fotoheader/logo.png';

const TIPOS_CONTA = [
  { id: 'mae', label: 'Sou Mãe', desc: 'Acolhimento emocional, diário, triagem e rodas comunitárias.' },
  { id: 'terapeuta', label: 'Sou Terapeuta', desc: 'Credenciamento clínico, consultório virtual e agenda.' },
  { id: 'rh', label: 'Empresa / RH', desc: 'Solução B2B para apoio às colaboradoras e conformidade ESG.' },
];

export default function CadastroScreen() {
  const [tipoConta, setTipoConta] = useState('mae');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    termoAceito: true,
  });
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCarregando(true);
    setTimeout(() => {
      navigateToApp(tipoConta);
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
                onClick={() => setTipoConta(tipo.id)}
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
              Concordo com os Termos de Uso e a Política de Privacidade e Anonimato (LGPD) da Florável.
            </label>
          </div>

          {/* Botão de Cadastro Principal */}
          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-[#56725a] hover:bg-[#465e4a] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-[#56725a]/20 cursor-pointer flex items-center justify-center gap-2 mt-4"
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
