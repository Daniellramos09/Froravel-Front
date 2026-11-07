// Faixa contínua com as palavras da marca, entre o hero e o manifesto.

const PALAVRAS = ["Acolhimento", "Escuta", "Cuidado", "Presença", "Respiro", "Sem julgamentos"];

function Sequencia() {
  // Palavras repetidas para a faixa cobrir até telas bem largas
  return (
    <div className="flex shrink-0 items-center">
      {[...PALAVRAS, ...PALAVRAS].map((palavra, i) => (
        <span key={i} className="flex items-center">
          <span className="font-serif italic text-2xl sm:text-3xl text-[#294D33] whitespace-nowrap">
            {palavra}
          </span>
          <span className="mx-7 sm:mx-10 text-[#A8435F]">&bull;</span>
        </span>
      ))}
    </div>
  );
}

export default function BrandMarquee() {
  return (
    <div aria-hidden="true" className="bg-[#F4DDE5] border-t border-[#E8A9BB]/50 py-5 sm:py-6">
      <div className="marquee-mask overflow-hidden">
        {/* Duas sequências iguais: quando a primeira sai, a segunda ocupa o lugar sem emenda */}
        <div className="marquee-track">
          <Sequencia />
          <Sequencia />
        </div>
      </div>
    </div>
  );
}
