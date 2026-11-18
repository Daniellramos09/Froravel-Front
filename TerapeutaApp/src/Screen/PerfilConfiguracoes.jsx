import { useState, useRef } from 'react';
import {
  Camera,
  Award,
  GraduationCap,
  Plus,
  Trash2,
  CheckCircle2,
  Star,
  Users,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Save,
} from 'lucide-react';
import { usePsiAccessibility } from '../Components/Accessibility/PsiAccessibilityContext';

const FOTOS_SUGERIDAS = [
  '/img/fotopsicologo/psicologa1.jpg',
  '/img/fotopsicologo/psicologa2.jpg',
  '/img/fotopsicologo/psicologos7.jpg',
];

export default function PerfilConfiguracoes() {
  const { psiProfile, updatePsiProfile } = usePsiAccessibility();

  const [form, setForm] = useState({
    nome: psiProfile.nome || '',
    crp: psiProfile.crp || '',
    especialidade: psiProfile.especialidade || '',
    abordagem: psiProfile.abordagem || '',
    valorConsulta: psiProfile.valorConsulta || '',
    cidade: psiProfile.cidade || '',
    fotoUrl: psiProfile.fotoUrl || '/img/fotopsicologo/psicologa1.jpg',
    sobreMim: psiProfile.sobreMim || '',
    graduacoes: Array.isArray(psiProfile.graduacoes) ? psiProfile.graduacoes : [],
  });

  const [novaGraduacao, setNovaGraduacao] = useState('');
  const [toast, setToast] = useState('');
  const fileInputRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setForm((prev) => ({ ...prev, fotoUrl: reader.result }));
        updatePsiProfile({ fotoUrl: reader.result });
        showToast('Foto de perfil atualizada com sucesso!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddGraduacao = () => {
    if (!novaGraduacao.trim()) return;
    const atualizadas = [...form.graduacoes, novaGraduacao.trim()];
    setForm((prev) => ({ ...prev, graduacoes: atualizadas }));
    setNovaGraduacao('');
  };

  const handleRemoveGraduacao = (idx) => {
    const atualizadas = form.graduacoes.filter((_, i) => i !== idx);
    setForm((prev) => ({ ...prev, graduacoes: atualizadas }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updatePsiProfile(form);
    showToast('Perfil clínico e configurações salvos com sucesso!');
  };

  // Sistema de Medalhas & Reconhecimento Clínico da Psicóloga
  const medalhas = [
    {
      id: 'guardia-puerperio',
      titulo: 'Guardiã do Puerpério',
      criterio: 'Atender 10 mães na plataforma',
      progressoAtual: psiProfile.maesAtendidasCount || 12,
      meta: 10,
      conquistada: (psiProfile.maesAtendidasCount || 12) >= 10,
      icone: Users,
      cor: 'bg-[#EBF3ED] text-[#294D33] border-[#294D33]/25',
      selo: '🏅 Nível Ouro',
    },
    {
      id: 'escuta-5-estrelas',
      titulo: 'Escuta Cinco Estrelas',
      criterio: 'Receber 50 estrelas nas avaliações das mães',
      progressoAtual: psiProfile.estrelasRecebidasCount || 58,
      meta: 50,
      conquistada: (psiProfile.estrelasRecebidasCount || 58) >= 50,
      icone: Star,
      cor: 'bg-amber-50 text-amber-900 border-amber-300/70',
      selo: '⭐ Excelência Clínica',
    },
    {
      id: 'mestre-rodas',
      titulo: 'Facilitadora de Rodas',
      criterio: 'Conduzir 15 Rodas de Conversa em grupo',
      progressoAtual: psiProfile.rodasConduzidasCount || 18,
      meta: 15,
      conquistada: (psiProfile.rodasConduzidasCount || 18) >= 15,
      icone: Sparkles,
      cor: 'bg-[#FCF7F9] text-[#1F3A27] border-[#E8A9BB]',
      selo: '🌸 Impacto Comunitário',
    },
    {
      id: 'anjo-fundo-solidario',
      titulo: 'Anjo do Fundo Solidário',
      criterio: 'Realizar 25 atendimentos sociais/gratuitos',
      progressoAtual: psiProfile.atendimentosSociaisCount || 21,
      meta: 25,
      conquistada: (psiProfile.atendimentosSociaisCount || 21) >= 25,
      icone: HeartHandshake,
      cor: 'bg-stone-50 text-stone-700 border-stone-200',
      selo: '💚 Em Progresso (84%)',
    },
    {
      id: 'sigilo-etico-cfp',
      titulo: 'Guardiã do Sigilo Ético (CFP)',
      criterio: '100% conformidade Zero Prontuário & LGPD',
      progressoAtual: 1,
      meta: 1,
      conquistada: true,
      icone: ShieldCheck,
      cor: 'bg-[#EBF3ED] text-[#1F3A27] border-[#294D33]/30',
      selo: '🛡️ Verificada CFP',
    },
  ];

  return (
    <div className="w-full space-y-8 pb-12">
      {toast && (
        <div className="fixed top-6 right-6 z-[9999] flex items-center gap-2 rounded-2xl bg-[#294D33] px-5 py-3 text-sm font-semibold text-white shadow-xl animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-[#E8A9BB]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Cabeçalho */}
      <header>
        <p className="text-[13.5px] md:text-[15px] text-[#4A5E4D]">
          Identidade Clínica & Reconhecimento
        </p>
        <h1 className="mt-2 font-fraunces text-[30px] md:text-[38px] leading-[1.12] tracking-[-0.015em] text-[#1F3A27]">
          Perfil & Configurações
        </h1>
        <p className="mt-2 text-[15px] text-[#4A5E4D]">
          Monte seu perfil público para a Rede de Apoio, atualize seu CRP, graduações e acompanhe suas medalhas de impacto materno.
        </p>
      </header>

      {/* =================================================================== */}
      {/* 1. GALERIA DE MEDALHAS E RECONHECIMENTO DE IMPACTO MATERNO          */}
      {/* =================================================================== */}
      <section className="rounded-3xl border border-[#EFE9EB] bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#294D33] flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Reconhecimento Ético Florável
            </span>
            <h2 className="font-fraunces text-2xl font-bold text-[#1F3A27] mt-1">
              Suas Medalhas de Acolhimento
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Medalhas exibidas no seu perfil público quando as mães buscam apoio na plataforma.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F4DDE5] text-[#294D33] text-xs font-bold self-start">
            <Award className="w-4 h-4" />
            <span>4 de 5 Medalhas Conquistadas</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {medalhas.map((m) => {
            const Icon = m.icone;
            const pct = Math.min(Math.round((m.progressoAtual / m.meta) * 100), 100);
            return (
              <div
                key={m.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between transition ${m.cor}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white/90 flex items-center justify-center shadow-2xs">
                      <Icon className="w-5 h-5 text-[#294D33]" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/90 text-[#1F3A27]">
                      {m.selo}
                    </span>
                  </div>
                  <h3 className="font-fraunces text-lg font-bold">{m.titulo}</h3>
                  <p className="text-xs opacity-85 mt-1">{m.criterio}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-black/5">
                  <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                    <span>{m.conquistada ? '✓ Conquistada' : 'Em andamento'}</span>
                    <span>
                      {m.progressoAtual} / {m.meta}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#294D33] transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. FORMULÁRIO DE PERFIL PÚBLICO (FOTO, SOBRE MIM, CRP E GRADUAÇÕES) */}
      {/* =================================================================== */}
      <form
        onSubmit={handleSaveProfile}
        className="rounded-3xl border border-[#EFE9EB] bg-white p-6 sm:p-8 shadow-sm space-y-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-stone-100">
          <div className="relative group shrink-0">
            <img
              src={form.fotoUrl}
              alt={form.nome}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-[#E8A9BB] shadow-md"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-2.5 rounded-full bg-[#294D33] text-white shadow-lg hover:bg-[#1F3A27] transition cursor-pointer"
              title="Enviar nova foto"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          <div className="space-y-2">
            <h2 className="font-fraunces text-2xl font-bold text-[#1F3A27]">
              Foto e Retrato Profissional
            </h2>
            <p className="text-xs text-stone-500 max-w-md">
              Escolha uma foto acolhedora e bem iluminada do seu computador ou selecione um dos retratos abaixo:
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-full bg-[#EBF3ED] text-[#294D33] text-xs font-bold hover:bg-[#d8e8dc] transition cursor-pointer"
              >
                Enviar foto do computador
              </button>
              {FOTOS_SUGERIDAS.map((url, idx) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, fotoUrl: url }))}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition cursor-pointer ${
                    form.fotoUrl === url
                      ? 'border-[#294D33] bg-[#294D33] text-white'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  Avatar {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dados Principais e CRP */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Nome Profissional Completo *
            </label>
            <input
              type="text"
              required
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-[#294D33]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Registro Profissional (CRP / CRAF) *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: CRP 06/142980"
              value={form.crp}
              onChange={(e) => setForm({ ...form, crp: e.target.value })}
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-mono outline-none focus:border-[#294D33]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Especialidade Principal
            </label>
            <input
              type="text"
              value={form.especialidade}
              onChange={(e) => setForm({ ...form, especialidade: e.target.value })}
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-[#294D33]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Abordagem Clínica
            </label>
            <input
              type="text"
              value={form.abordagem}
              onChange={(e) => setForm({ ...form, abordagem: e.target.value })}
              placeholder="Ex: Psicanálise, TCC, Humanista"
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-[#294D33]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Modalidade e Valor Social
            </label>
            <input
              type="text"
              value={form.valorConsulta}
              onChange={(e) => setForm({ ...form, valorConsulta: e.target.value })}
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-[#294D33]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Cidade / Estado
            </label>
            <input
              type="text"
              value={form.cidade}
              onChange={(e) => setForm({ ...form, cidade: e.target.value })}
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-[#294D33]"
            />
          </div>
        </div>

        {/* Sobre Mim */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            Sobre Mim (Carta de Apresentação para as Mães) *
          </label>
          <textarea
            rows={4}
            required
            value={form.sobreMim}
            onChange={(e) => setForm({ ...form, sobreMim: e.target.value })}
            placeholder="Escreva com carinho sobre como você conduz suas sessões e acolhe as mães no puerpério..."
            className="w-full rounded-2xl border border-stone-200 p-4 text-sm leading-relaxed outline-none focus:border-[#294D33]"
          />
        </div>

        {/* Graduações e Formação Acadêmica */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-stone-700 mb-2 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-[#294D33]" />
            Minhas Graduações, Pós-Graduações e Certificações
          </label>

          <div className="space-y-2 mb-3">
            {form.graduacoes.map((grad, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-[#FCF7F9] border border-[#EFE9EB] text-xs sm:text-sm text-[#1F3A27]"
              >
                <span className="font-medium">🎓 {grad}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveGraduacao(idx)}
                  className="text-stone-400 hover:text-red-600 p-1 transition cursor-pointer"
                  title="Remover formação"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={novaGraduacao}
              onChange={(e) => setNovaGraduacao(e.target.value)}
              placeholder="Ex: Mestrado em Psicologia Materno-Infantil — UNIFESP"
              className="flex-1 rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-[#294D33]"
            />
            <button
              type="button"
              onClick={handleAddGraduacao}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl border border-[#294D33] text-[#294D33] text-xs font-bold hover:bg-[#EBF3ED] transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Adicionar Formação
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-[#294D33] px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#1F3A27] transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Salvar Perfil e Configurações
          </button>
        </div>
      </form>
    </div>
  );
}
