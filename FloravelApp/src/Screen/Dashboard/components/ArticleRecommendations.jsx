import { useState } from 'react';
import { ArrowRight, Clock, Bookmark, Sparkles } from 'lucide-react';

const ARTIGOS = [
  {
    id: 1,
    categoria: "Maternidade Real",
    titulo: "Baby blues ou depressão pós-parto? Entenda a diferença e os sinais de alerta.",
    resumo: "Compreenda a queda hormonal dos primeiros dias e saiba quando a tristeza puerperal pede um abraço profissional.",
    tempo: "3 min de leitura",
    tag: "Saúde Mental",
    img: "/img/maternidadeSemFiltro.jpg",
    fallback: "/img/maeexausta.jpg",
    corBadge: "bg-[#FDF2F4] text-[#9C5369]"
  },
  {
    id: 2,
    categoria: "Autocuidado Possível",
    titulo: "5 micropausas para encontrar calma no meio do caos diário com o recém-nascido.",
    resumo: "Estratégias reais para recuperar o fôlego mesmo quando o tempo livre parece uma miragem impossível.",
    tempo: "4 min de leitura",
    tag: "Pausa Guiada",
    img: "/img/maeDescansando.jpg",
    fallback: "/img/maesono.jpg",
    corBadge: "bg-[#EBF3ED] text-[#294D33]"
  },
  {
    id: 3,
    categoria: "Vínculo & Culpa",
    titulo: "A culpa de não sentir o amor instantâneo e o peso de ter que dar conta de tudo.",
    resumo: "Desmistificando o mito do parto mágico. O amor materno é uma construção diária, não uma obrigação imediata.",
    tempo: "5 min de leitura",
    tag: "Acolhimento",
    img: "/img/variasMaes.jpg",
    fallback: "/img/maeconversando.jpg",
    corBadge: "bg-[#FCF7F9] text-[#7A4A58]"
  }
];

export default function ArticleRecommendations({ onNavigateToLibrary }) {
  const [bookmarked, setBookmarked] = useState({});

  const toggleBookmark = (e, id) => {
    e.stopPropagation();
    setBookmarked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="space-y-6">
      {/* HEADER DA SEÇÃO */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#294D33] mb-1.5 bg-[#EBF3ED] px-3 py-1 rounded-full">
            <Sparkles size={12} className="text-[#294D33]" />
            Curadoria Especializada
          </div>
          <h3 className="text-[24px] sm:text-[28px] font-fraunces font-bold text-[#2B2829] tracking-tight">
            Leituras que abraçam
          </h3>
          <p className="text-[14px] sm:text-[15px] text-stone-600">
            Textos pensados para acolher a sua realidade, sem fórmulas mágicas e sem julgamentos.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToLibrary}
          className="inline-flex items-center gap-2 text-[14px] font-bold text-[#294D33] hover:text-[#1e3b26] transition group self-start sm:self-auto cursor-pointer"
        >
          <span>Ver biblioteca completa</span>
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* GRID DE 3 CARDS DE ARTIGOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ARTIGOS.map((artigo) => {
          const isSaved = bookmarked[artigo.id];
          return (
            <article
              key={artigo.id}
              onClick={onNavigateToLibrary}
              className="bg-white rounded-3xl border border-stone-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* CAPA COM FOTOGRAFIA NOVA E DIVERSA */}
                <div className="h-48 w-full relative overflow-hidden bg-[#FBF4F6]">
                  <img
                    src={artigo.img}
                    alt={artigo.titulo}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      if (artigo.fallback) {
                        e.currentTarget.src = artigo.fallback;
                      }
                    }}
                  />
                  {/* Gradiente sutil inferior */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

                  {/* Tag de categoria sobre a foto */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs backdrop-blur-md ${artigo.corBadge}`}>
                      {artigo.categoria}
                    </span>
                  </div>

                  {/* Botão de salvar leitura */}
                  <button
                    type="button"
                    onClick={(e) => toggleBookmark(e, artigo.id)}
                    aria-label="Salvar artigo"
                    className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                      isSaved
                        ? 'bg-[#294D33] text-white'
                        : 'bg-white/85 text-stone-600 hover:bg-white hover:text-[#294D33]'
                    }`}
                  >
                    <Bookmark size={15} className={isSaved ? 'fill-current' : ''} />
                  </button>
                </div>

                {/* CONTEÚDO EDITORIAL */}
                <div className="p-6">
                  <h4 className="text-[18px] font-fraunces font-bold text-[#2B2829] mb-2.5 leading-snug group-hover:text-[#294D33] transition-colors">
                    {artigo.titulo}
                  </h4>
                  <p className="text-[13px] text-stone-500 line-clamp-2 leading-relaxed">
                    {artigo.resumo}
                  </p>
                </div>
              </div>

              {/* RODAPÉ DO CARD */}
              <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-stone-100 text-[12px] text-stone-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-stone-400" />
                  {artigo.tempo}
                </span>

                <span className="text-[#294D33] font-bold flex items-center gap-1 group-hover:underline">
                  Ler agora <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
