// src/Screen/Dashboard/components/ArticleRecommendations.jsx
// Curadoria editorial enxuta: 1 leitura em destaque no mobile + lista complementar no desktop.
import { ArrowRight } from 'lucide-react';

const ARTIGOS = [
  {
    id: 1,
    categoria: 'Saúde emocional',
    titulo: 'Baby blues ou depressão pós-parto? Entenda a diferença e os sinais de alerta',
    resumo:
      'Como diferenciar a oscilação hormonal dos primeiros dias de sinais que pedem apoio profissional.',
    tempo: '3 min de leitura',
    img: '/img/maternidadeSemFiltro.jpg',
    fallback: '/img/maeexausta.jpg',
  },
  {
    id: 2,
    categoria: 'Autocuidado possível',
    titulo: 'Cinco micropausas para encontrar fôlego na rotina com o recém-nascido',
    tempo: '4 min de leitura',
  },
  {
    id: 3,
    categoria: 'Vínculo e culpa',
    titulo: 'A culpa de não sentir amor imediato e o peso de tentar dar conta de tudo',
    tempo: '5 min de leitura',
  },
];

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294D33] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FCF7F9]';

export default function ArticleRecommendations({ onNavigateToLibrary }) {
  const [destaque, ...secundarios] = ARTIGOS;

  return (
    <section aria-labelledby="leituras-titulo">
      <div className="flex items-baseline justify-between gap-4">
        <h2
          id="leituras-titulo"
          className="font-fraunces text-[22px] @3xl:text-[30px] leading-[1.12] tracking-[-0.015em] text-[#1F3A27]"
        >
          Para ler hoje
        </h2>

        <button
          type="button"
          onClick={onNavigateToLibrary}
          className={`group inline-flex items-center gap-1.5 text-[14px] @3xl:text-[15px] font-medium text-[#294D33] underline decoration-[#294D33]/30 underline-offset-4 hover:decoration-[#294D33] rounded-sm cursor-pointer ${focusRing}`}
        >
          <span>Biblioteca</span>
          <ArrowRight
            size={15}
            strokeWidth={1.75}
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>

      {/* No mobile: card horizontal compacto com apenas o destaque; no desktop: 2 colunas editoriais */}
      <div className="mt-3.5 @3xl:mt-6 grid grid-cols-1 @3xl:grid-cols-[minmax(0,6.5fr)_minmax(0,5.5fr)] gap-6 @3xl:gap-12 items-start">
        {/* Artigo principal */}
        <article className="group">
          <button
            type="button"
            onClick={onNavigateToLibrary}
            aria-label={`Ler artigo: ${destaque.titulo}`}
            className={`flex @3xl:block items-center gap-4 w-full text-left rounded-2xl @3xl:rounded-lg bg-white/85 @3xl:bg-transparent border border-[#E4DAD5]/70 @3xl:border-none p-3 @3xl:p-0 cursor-pointer ${focusRing}`}
          >
            <div className="w-24 h-24 @3xl:w-full @3xl:h-auto @3xl:aspect-[16/10] shrink-0 overflow-hidden rounded-xl @3xl:rounded-lg bg-[#F1E6E1]">
              <img
                src={destaque.img}
                alt={destaque.titulo}
                loading="lazy"
                className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                onError={(e) => {
                  if (destaque.fallback) e.currentTarget.src = destaque.fallback;
                }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="@3xl:mt-4 text-[12px] @3xl:text-[13px] text-[#4A5E4D]">
                {destaque.categoria}
                <span aria-hidden="true" className="mx-1.5 @3xl:mx-2 opacity-50">·</span>
                <span>{destaque.tempo}</span>
              </p>

              <h3 className="mt-1 @3xl:mt-1.5 font-fraunces text-[16.5px] @3xl:text-[24px] leading-[1.22] tracking-[-0.01em] text-[#1F3A27] group-hover:text-[#294D33] transition-colors line-clamp-2 @3xl:line-clamp-none">
                {destaque.titulo}
              </h3>

              <p className="hidden @3xl:block mt-2 text-[15px] leading-relaxed text-[#4A5E4D] max-w-[54ch]">
                {destaque.resumo}
              </p>

              <span className="mt-2 @3xl:mt-3 inline-flex items-center gap-1 text-[13px] @3xl:text-[14px] font-medium text-[#294D33] underline decoration-[#294D33]/30 underline-offset-4 group-hover:decoration-[#294D33]">
                Ler artigo
                <ArrowRight size={13} strokeWidth={1.75} aria-hidden="true" />
              </span>
            </div>
          </button>
        </article>

        {/* Demais artigos: visíveis apenas em telas maiores para não sobrecarregar o mobile */}
        <div className="hidden @3xl:block border-t border-[#E4DAD5] divide-y divide-[#E4DAD5]">
          {secundarios.map((artigo) => (
            <article key={artigo.id} className="py-5 first:pt-5 last:pb-2">
              <button
                type="button"
                onClick={onNavigateToLibrary}
                className={`group block w-full text-left rounded-sm cursor-pointer ${focusRing}`}
              >
                <p className="text-[13px] text-[#4A5E4D]">
                  {artigo.categoria}
                  <span aria-hidden="true" className="mx-2 opacity-50">·</span>
                  <span>{artigo.tempo}</span>
                </p>

                <h3 className="mt-1.5 font-fraunces text-[19px] @3xl:text-[20px] leading-[1.28] tracking-[-0.01em] text-[#1F3A27] group-hover:text-[#294D33] transition-colors">
                  {artigo.titulo}
                </h3>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
