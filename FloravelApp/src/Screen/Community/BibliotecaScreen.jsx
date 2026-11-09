import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, Clock, ArrowRight, BookOpen, Star, PlayCircle, X, Share2, Check } from 'lucide-react';

const ARTIGOS_MOCK = [
  { 
    id: 1, 
    cat: 'PUERPÉRIO', 
    titulo: 'Como lidar com a exaustão nos primeiros meses', 
    desc: 'Pequenas dicas de autocuidado para momentos de sobrecarga mental e física.', 
    tempo: '3 min de leitura', 
    img: '/img/maeexausta.jpg',
    autor: 'Dra. Helena Souza · Psicóloga Perinatal',
    conteudo: [
      'A exaustão no pós-parto não é fraqueza, preguiça ou incapacidade: é uma resposta biológica e neurológica à maior transformação que o corpo e a mente de uma mulher podem vivenciar.',
      'A privação crônica de sono altera os níveis de cortisol e serotonina, tornando as emoções mais à flor da pele. Quando sentir que não dá conta, lembre-se: dar conta de tudo não é a meta. A sua sobrevivência e o seu bem-estar são a prioridade.',
      'Dica prática: Estabeleça a regra dos 15 minutos sagrados. Quando outra pessoa estiver segurando o bebê, não vá lavar louça nem responder mensagens pendentes. Tome um banho demorado ou deite em silêncio com os olhos fechados.'
    ]
  },
  { 
    id: 2, 
    cat: 'SONO', 
    titulo: 'A privação de sono e o impacto nas emoções', 
    desc: 'Compreender porque é que o cansaço afeta tanto o nosso humor e como pedir ajuda.', 
    tempo: '5 min de leitura', 
    img: '/img/maesono.jpg',
    autor: 'Equipe Clínica Florável',
    conteudo: [
      'Dormir em blocos fragmentados de duas horas destrói a fase de sono REM, responsável pela regulação afetiva e memória.',
      'É absolutamente normal sentir irritabilidade, vontade repentina de chorar e medo infundado quando o sono falta. Você não está enlouquecendo, você só precisa dormir.',
      'Não hesite em criar turnos noturnos com seu parceiro ou parceira, ou pedir explicitamente para familiares assumirem o cuidado matinal para você descansar.'
    ]
  },
  { 
    id: 3, 
    cat: 'REDE DE APOIO', 
    titulo: 'Como comunicar o que precisa à sua família', 
    desc: 'Estratégias para estabelecer limites saudáveis e delegar tarefas no pós-parto.', 
    tempo: '4 min de leitura', 
    img: '/img/maeconversando.jpg',
    autor: 'Psi. Camila Santos',
    conteudo: [
      'Visitas que chegam para segurar o bebê e esperar um café pronto não são apoio, são trabalho extra.',
      'Aprenda a dizer com gentileza e firmeza: "Agradeço muito o carinho! O que mais precisamos agora é de uma refeição pronta ou de ajuda para estender a roupa enquanto eu amamento."',
      'Proteger seu ninho puerperal é um ato de amor por você e pelo seu bebê.'
    ]
  },
  { 
    id: 4, 
    cat: 'VÍNCULO', 
    titulo: 'A pressão do amor à primeira vista pelo bebê', 
    desc: 'Desmistificando a culpa: o vínculo é construído e não nasce pronto no bloco operatório.', 
    tempo: '6 min de leitura', 
    img: '/img/maternidadeSemFiltro.jpg',
    autor: 'Dra. Mariana Costa',
    conteudo: [
      'Muitas mães esperam uma explosão mágica de amor imediato no parto e, quando isso não acontece, sentem uma culpa dilacerante.',
      'O amor materno é uma relação entre dois seres humanos que acabaram de se conhecer. Ele se constrói no cheiro, no toque, na repetição dos dias e na convivência diária.',
      'Se você olhou para o bebê e sentiu apenas estranhamento ou choque, acolha isso sem culpa. O afeto brota no cuidado cotidiano.'
    ]
  },
  { 
    id: 5, 
    cat: 'AUTOCUIDADO', 
    titulo: 'Redescobrindo o seu corpo após a gravidez', 
    desc: 'Um olhar gentil para as transformações físicas e o respeito pelo seu tempo.', 
    tempo: '4 min de leitura', 
    img: '/img/maeDescansando.jpg',
    autor: 'Dra. Beatriz Albuquerque',
    conteudo: [
      'A cultura das redes sociais cobra que o corpo "volte ao normal" em semanas. Mas o corpo não precisa voltar: ele foi a casa onde uma vida inteira se desenvolveu.',
      'As marcas, a linha alba e as transformações na pele contam a história da gestação. Olhe para si com o mesmo respeito e ternura que você dedica ao seu filho.',
      'Alimente-se com carinho, beba água e não force rotinas exaustivas antes que seu corpo esteja recuperado.'
    ]
  },
  { 
    id: 6, 
    cat: 'ENTREVISTA', 
    titulo: 'Roda de Conversa: Mães de múltiplas viagens', 
    desc: 'Relatos reais de mulheres que já passaram pela montanha-russa do puerpério.', 
    tempo: '10 min de vídeo', 
    img: '/img/variasMaes.jpg', 
    isVideo: true,
    autor: 'Roda Florável',
    conteudo: [
      'Neste encontro gravado com psicólogas parceiras, três mães de diferentes regiões do Brasil relatam abertamente os momentos de solidão, os tabus da culpa e como a troca comunitária salvou suas sanidades mentais.',
      'Ouça histórias de quem já esteve onde você está hoje e veja que a tempestade passa.'
    ]
  }
];

const DESTAQUE_ARTIGO = {
  id: 0,
  cat: 'DESTAQUE',
  titulo: 'O mito da "Mãe Perfeita" e a cobrança social.',
  desc: 'Por que nos cobramos tanto? Um artigo sobre como baixar as expectativas e viver a maternidade de forma mais leve e compassiva.',
  tempo: '8 min de leitura',
  img: '/img/2.jpg',
  autor: 'Equipe Editorial Florável',
  conteudo: [
    'Desde a infância somos bombardeadas por imagens de maternidade imaculada: mães serenas, casas brilhando, bebês que dormem a noite toda e sorrisos sem cansaço.',
    'A maternidade real, porém, é feita de leite entornado, roupas acumuladas, choro sem motivo aparente e um amor imenso misturado à exaustão.',
    'Romper com a fantasia da perfeição é o primeiro passo para encontrar a paz. Você não precisa ser impecável; você só precisa ser humana, compassiva consigo mesma e acolher o seu próprio ritmo.'
  ]
};

export default function BibliotecaScreen() {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [copied, setCopied] = useState(false);

  const filters = ['Todos', 'Puerpério', 'Autocuidado', 'Sono', 'Vínculo'];

  const filteredArticles = ARTIGOS_MOCK.filter(artigo => {
    const matchFilter = activeFilter === 'Todos' || artigo.cat.toLowerCase() === activeFilter.toLowerCase();
    const matchSearch = searchQuery.trim() === '' || 
      artigo.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || 
      artigo.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="animate-fadeIn font-dmsans min-h-full pb-16">
      
      {/* CABEÇALHO */}
      <div className="mb-10 text-left">
        <p className="text-primary text-[14px] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
          <BookOpen size={16} /> INFORMAÇÃO QUE CURA
        </p>
        <h1 className="text-[32px] md:text-[40px] font-fraunces font-bold text-gray1 mb-2">Conteúdos e Biblioteca</h1>
        <p className="text-gray2 text-[18px]">Artigos, vídeos e guias escritos por especialistas, para você ler no seu tempo.</p>
      </div>

      {/* BARRA DE PESQUISA E FILTROS */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray3" size={20} />
          <input 
            type="text" 
            placeholder="Buscar assunto (ex: sono, choro, alimentação)" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray5 rounded-2xl py-4 pl-14 pr-6 text-[16px] focus:outline-none focus:border-primary shadow-sm transition"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide shrink-0">
          {filters.map(f => (
            <button 
              key={f} 
              type="button"
              onClick={() => setActiveFilter(f)}
              className={`px-6 py-4 rounded-2xl text-[14px] font-bold whitespace-nowrap border transition cursor-pointer ${
                activeFilter === f ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white border-gray5 text-gray2 hover:bg-fundo'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* DESTAQUE DO DIA */}
      {activeFilter === 'Todos' && !searchQuery && (
        <div 
          onClick={() => setSelectedArticle(DESTAQUE_ARTIGO)}
          className="mb-12 bg-white rounded-[32px] border border-gray5 overflow-hidden flex flex-col md:flex-row shadow-sm group cursor-pointer hover:border-primary/40 hover:shadow-md transition text-left"
        >
          <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden">
            <img 
              src={DESTAQUE_ARTIGO.img} 
              alt="Destaque" 
              className="w-full h-full object-cover object-[center_30%] transition duration-700 group-hover:scale-105" 
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-[12px] font-bold text-primary flex items-center gap-1 shadow-xs">
              <Star size={14} /> Leitura Recomendada
            </div>
          </div>
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <h2 className="text-[28px] font-fraunces font-bold text-gray1 mb-4 group-hover:text-primary transition leading-tight">
              {DESTAQUE_ARTIGO.titulo}
            </h2>
            <p className="text-[16px] text-gray3 leading-relaxed mb-8">
              {DESTAQUE_ARTIGO.desc}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-[13px] text-gray4 font-medium flex items-center gap-2">
                <Clock size={16} /> {DESTAQUE_ARTIGO.tempo}
              </span>
              <span className="text-[15px] font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                Ler artigo <ArrowRight size={18} />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* GRELHA DE ARTIGOS COM AS FOTOS REAIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
        {filteredArticles.map((artigo) => (
          <div 
            key={artigo.id} 
            onClick={() => setSelectedArticle(artigo)}
            className="bg-white rounded-3xl border border-gray5 overflow-hidden flex flex-col hover:shadow-md hover:border-primary/30 transition group cursor-pointer"
          >
            {/* ÁREA DA IMAGEM */}
            <div className="h-56 relative overflow-hidden bg-[#F4DDE5]">
              <img 
                src={artigo.img} 
                alt={artigo.titulo} 
                className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/img/1.jpg";
                }}
              />
              {artigo.isVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/15 transition">
                  <PlayCircle size={48} className="text-white drop-shadow-md" />
                </div>
              )}
            </div>
            
            {/* ÁREA DO TEXTO */}
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-wider text-primary mb-3">{artigo.cat}</p>
                <h3 className="text-[20px] font-fraunces font-bold text-gray1 mb-3 leading-snug group-hover:text-primary transition">{artigo.titulo}</h3>
                <p className="text-[15px] text-gray3 leading-relaxed mb-6">{artigo.desc}</p>
              </div>
              <div className="flex items-center justify-between border-t border-gray5 pt-6">
                <span className="flex items-center gap-2 text-[13px] text-gray4 font-medium"><Clock size={16} /> {artigo.tempo}</span>
                <span className="text-[14px] font-bold text-gray1 flex items-center gap-1 group-hover:text-primary group-hover:gap-2 transition-all">
                  Ler <ArrowRight size={16} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE LEITURA DO ARTIGO */}
      {selectedArticle && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs animate-fadeIn"
          onClick={() => setSelectedArticle(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-10 shadow-2xl max-h-[90vh] overflow-y-auto text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão fechar */}
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-[#294D33] hover:bg-[#F4DDE5]/40 p-2 rounded-full transition cursor-pointer"
            >
              <X size={22} />
            </button>

            {/* Categoria e tempo */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#F4DDE5] text-[#294D33]">
                {selectedArticle.cat}
              </span>
              <span className="text-xs text-stone-500 flex items-center gap-1">
                <Clock size={14} /> {selectedArticle.tempo}
              </span>
            </div>

            {/* Título */}
            <h2 className="font-fraunces text-2xl sm:text-3xl font-bold text-[#1F3A27] mb-3 leading-tight">
              {selectedArticle.titulo}
            </h2>

            {/* Autor */}
            <p className="text-xs text-stone-500 pb-4 mb-6 border-b border-stone-100 font-medium">
              Por {selectedArticle.autor || 'Equipe Clínica Florável'}
            </p>

            {/* Imagem do artigo */}
            <div className="w-full h-56 rounded-2xl overflow-hidden mb-6 bg-[#FCF7F9]">
              <img 
                src={selectedArticle.img} 
                alt={selectedArticle.titulo} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/img/2.jpg";
                }}
              />
            </div>

            {/* Parágrafos do Conteúdo */}
            <div className="space-y-4 text-sm sm:text-base text-stone-700 leading-relaxed font-sans">
              {selectedArticle.conteudo ? (
                selectedArticle.conteudo.map((p, idx) => (
                  <p key={idx} className={idx === 0 ? "font-medium text-stone-900" : ""}>
                    {p}
                  </p>
                ))
              ) : (
                <p>{selectedArticle.desc}</p>
              )}
            </div>

            {/* Rodapé do Modal */}
            <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#294D33] hover:underline cursor-pointer"
              >
                {copied ? <Check size={16} /> : <Share2 size={16} />}
                <span>{copied ? 'Link copiado!' : 'Compartilhar com uma mãe'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-2.5 rounded-full bg-[#294D33] hover:bg-[#1f3c27] text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Concluir Leitura
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
