// src/Screen/Dashboard/components/ArticleRecommendations.jsx
// Curadoria editorial enxuta: 1 leitura em destaque + lista tipográfica discreta.
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
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2
          id="leituras-titulo"
          className="font-fraunces text-[26px] @3xl:text-[30px] leading-[1.12] tracking-[-0.015em] text-[#1F3A27]"
        >
          Leituras para este momento
        </h2>

        <button
          type="button"
          onClick={onNavigateToLibrary}
          className={`group inline-flex items-center gap-1.5 text-[15px] font-medium text-[#294D33] underline decoration-[#294D33]/30 underline-offset-4 hover:decoration-[#294D33] rounded-sm cursor-pointer ${focusRing}`}
        >
          <span>Biblioteca completa</span>
          <ArrowRight
            size={16}
            strokeWidth={1.75}
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>

      {/* Mobile-first: empilhado verticalmente no celular; 2 colunas editoriais no desktop */}
      <div className="mt-6 grid grid-cols-1 @3xl:grid-cols-[minmax(0,6.5fr)_minmax(0,5.5fr)] gap-8 @3xl:gap-12 items-start">
        {/* Artigo principal com imagem, categoria, tempo, título e acesso */}
        <article className="group">
          <button
            type="button"
            onClick={onNavigateToLibrary}
            aria-label={`Ler artigo: ${destaque.titulo}`}
            className={`block w-full text-left rounded-lg cursor-pointer ${focusRing}`}
          >
            <div className="aspect-[16/10] w-full overflow-hidden rounded-lg bg-[#F1E6E1]">
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

            <p className="mt-4 text-[13px] text-[#4A5E4D]">
              {destaque.categoria}
              <span aria-hidden="true" className="mx-2 opacity-50">·</span>
              <span>{destaque.tempo}</span>
            </p>

            <h3 className="mt-1.5 font-fraunces text-[22px] @3xl:text-[24px] leading-[1.2] tracking-[-0.01em] text-[#1F3A27] group-hover:text-[#294D33] transition-colors">
              {destaque.titulo}
            </h3>

            <p className="mt-2 text-[15px] leading-relaxed text-[#4A5E4D] max-w-[54ch]">
              {destaque.resumo}
            </p>

            <span className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#294D33] underline decoration-[#294D33]/30 underline-offset-4 group-hover:decoration-[#294D33]">
              Ler artigo
              <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
            </span>
          </button>
        </article>

        {/* Demais artigos: lista tipográfica discreta, sem cards nem resumos longos */}
        <div className="border-t border-[#E4DAD5] divide-y divide-[#E4DAD5]">
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
