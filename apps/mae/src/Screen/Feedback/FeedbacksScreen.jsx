import React, { useState, useEffect } from 'react';
import { Star, Heart, Plus, X, CheckCircle2, Send } from 'lucide-react';

const INITIAL_FEEDBACKS = [
  {
    id: 'fb-1',
    author: 'Mariana P.',
    subtitle: 'Vencendo a Depressão Pós-Parto',
    category: 'Rodas de Conversa',
    rating: 5,
    depoimento: 'Saí da reunião com o coração leve pela primeira vez em semanas. Ver que não estou sozinha nesse cansaço me acolheu demais.',
    curtidas: 24
  },
  {
    id: 'fb-2',
    author: 'Camila D.',
    subtitle: 'Consulta Individual • Dra. Camila Santos',
    category: 'Consultas',
    rating: 5,
    depoimento: 'O valor social acessível e a escuta sem julgamentos me deram forças para organizar minha rotina como mãe solo.',
    curtidas: 19
  },
  {
    id: 'fb-3',
    author: 'Beatriz L.',
    subtitle: 'Sobrecarga Materna e Burnout',
    category: 'Rodas de Conversa',
    rating: 5,
    depoimento: 'Um espaço seguro onde pude desabafar sem ouvir sermão. A sala de vídeo direto no app é super simples de usar pelo celular.',
    curtidas: 32
  },
  {
    id: 'fb-4',
    author: 'Juliana M.',
    subtitle: 'Preparação Emocional para o Parto',
    category: 'Rodas de Conversa',
    rating: 5,
    depoimento: 'As recomendações logo que entrei no app já me direcionaram para um grupo de gestantes exatamente na mesma fase que eu.',
    curtidas: 15
  }
];

export default function FeedbacksScreen() {
  const [feedbacks, setFeedbacks] = useState(INITIAL_FEEDBACKS);
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [showForm, setShowForm] = useState(false);
  const [novoFeedbackTexto, setNovoFeedbackTexto] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('Rodas de Conversa');
  const [novaNota, setNovaNota] = useState(5);
  const [sucessoEnvio, setSucessoEnvio] = useState(false);

  useEffect(() => {
    const salvos = JSON.parse(localStorage.getItem('floravel_feedbacks_reunioes') || '[]');
    if (salvos.length > 0) {
      const formatados = salvos.map((s, idx) => ({
        id: s.id || `fb-local-${idx}`,
        author: 'Você (Mariana S.)',
        subtitle: s.reuniao || 'Encontro Florável',
        category: 'Rodas de Conversa',
        rating: s.rating || 5,
        depoimento: s.achouTexto || 'Encontro acolhedor e muito seguro.',
        curtidas: 1
      }));
      setFeedbacks([...formatados, ...INITIAL_FEEDBACKS]);
    }
  }, []);

  const handleEnviarFeedback = (e) => {
    e.preventDefault();
    if (!novoFeedbackTexto.trim()) return;

    const novo = {
      id: `fb-user-${Date.now()}`,
      author: 'Você (Mariana S.)',
      subtitle: novaCategoria === 'Consultas' ? 'Atendimento Individual' : 'Roda de Conversa',
      category: novaCategoria,
      rating: novaNota,
      depoimento: novoFeedbackTexto.trim(),
      curtidas: 1
    };

    setFeedbacks([novo, ...feedbacks]);
    setNovoFeedbackTexto('');
    setShowForm(false);
    setSucessoEnvio(true);
    setTimeout(() => setSucessoEnvio(false), 3500);
  };

  const handleCurtir = (id) => {
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, curtidas: f.curtidas + 1 } : f));
  };

  const filteredFeedbacks = activeFilter === 'Todos'
    ? feedbacks
    : feedbacks.filter(f => f.category === activeFilter);

  return (
    <div className="animate-fadeIn font-dmsans max-w-4xl mx-auto space-y-5 pb-16">
      
      {/* CABEÇALHO LIMPO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-fraunces font-bold text-[#294D33]">
            Feedbacks
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Relatos reais de mães sobre nossas rodas e atendimentos.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-[#294D33] text-white text-xs font-bold hover:bg-[#1f3c27] transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Fechar' : 'Escrever relato'}
        </button>
      </div>

      {/* AVISO DE SUCESSO */}
      {sucessoEnvio && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} />
          Seu relato foi publicado com sucesso!
        </div>
      )}

      {/* FORMULÁRIO COMPACTO (SÓ APARECE QUANDO CLICA EM ESCREVER RELATO) */}
      {showForm && (
        <form 
          onSubmit={handleEnviarFeedback} 
          className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3.5 animate-fadeIn"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-stone-700 mr-1">Nota:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNovaNota(star)}
                  className="text-amber-400 focus:outline-none cursor-pointer"
                >
                  <Star size={18} className={star <= novaNota ? "fill-amber-400" : "text-stone-300"} />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              {['Rodas de Conversa', 'Consultas'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setNovaCategoria(cat)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                    novaCategoria === cat
                      ? 'bg-[#FCF7F9] text-[#294D33] border border-[#E8A9BB]'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={2}
            required
            value={novoFeedbackTexto}
            onChange={(e) => setNovoFeedbackTexto(e.target.value)}
            placeholder="Conte de forma breve como foi sua experiência..."
            className="w-full p-3 text-sm rounded-2xl border border-stone-200 bg-[#FCF7F9]/40 focus:outline-none focus:ring-2 focus:ring-[#294D33] resize-none"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="py-2 px-5 rounded-full bg-[#294D33] text-white text-xs font-bold hover:bg-[#1f3c27] transition flex items-center gap-1.5 cursor-pointer"
            >
              <Send size={12} />
              Publicar
            </button>
          </div>
        </form>
      )}

      {/* FILTROS SIMPLES (SCROLL HORIZONTAL NO MOBILE) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
        {['Todos', 'Rodas de Conversa', 'Consultas'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveFilter(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
              activeFilter === cat
                ? 'bg-[#294D33] text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID ENXUTO DE FEEDBACKS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        {filteredFeedbacks.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between gap-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-0.5">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                  {item.category}
                </span>
              </div>

              <p className="text-sm text-stone-700 leading-relaxed">
                "{item.depoimento}"
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-bold text-stone-900 truncate">{item.author}</p>
                <p className="text-[11px] text-stone-400 truncate">{item.subtitle}</p>
              </div>

              <button
                type="button"
                onClick={() => handleCurtir(item.id)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs text-stone-400 hover:text-pink-600 hover:bg-pink-50 transition cursor-pointer shrink-0"
              >
                <Heart size={13} className={item.curtidas > 20 ? "text-pink-500 fill-pink-500" : ""} />
                <span className="font-bold">{item.curtidas}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
