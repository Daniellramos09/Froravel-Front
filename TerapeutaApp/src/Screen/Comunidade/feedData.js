// Dados e armazenamento do feed da Comunidade.
// Este arquivo existe igual no app da Mãe e no app do Terapeuta: se mudar um, copie para o outro.
// Hoje os posts ficam salvos no navegador (localStorage). Quando existir o backend,
// basta trocar carregarFeed/salvarFeed por chamadas à API, sem mexer na tela.

const STORAGE_KEY = 'floravel-feed-v1';

const minutosAtras = (min) => new Date(Date.now() - min * 60 * 1000).toISOString();

// Autoras e autores usados nos posts de exemplo
const AUTORES = {
  helena: { id: 'helena-souza', name: 'Dra. Helena Souza', initials: 'HS', role: 'terapeuta', detail: 'CRP 06/142980' },
  ana: { id: 'ana-beatriz', name: 'Dra. Ana Beatriz Lima', initials: 'AB', role: 'terapeuta', detail: 'CRP 06/118734' },
  mariana: { id: 'mariana-silva', name: 'Mariana Silva', initials: 'MS', role: 'mae', detail: 'Puerpério · semana 7' },
  juliana: { id: 'juliana-costa', name: 'Juliana Costa', initials: 'JC', role: 'mae', detail: 'Puerpério · semana 12' },
  fernanda: { id: 'fernanda-lima', name: 'Fernanda Lima', initials: 'FL', role: 'mae', detail: 'Gestante · 32 semanas' },
  beatriz: { id: 'beatriz-santos', name: 'Beatriz Santos', initials: 'BS', role: 'mae', detail: 'Bebê de 5 meses' },
  anonima: { id: 'anonima', name: 'Mãe anônima', initials: '?', role: 'mae', detail: 'Publicou sem se identificar' },
};

function postsIniciais() {
  return [
    {
      id: 'p1',
      author: AUTORES.ana,
      text: 'Um lembrete gentil para esta semana: chorar no fim da tarde é muito comum nas primeiras semanas depois do parto. Não é fraqueza e não diz nada sobre o seu amor pelo bebê. Se durar mais de duas semanas ou ficar pesado demais, procure ajuda. Estamos aqui.',
      createdAt: minutosAtras(42),
      likes: 48,
      liked: false,
      comments: [
        { id: 'c1', author: AUTORES.juliana, text: 'Precisava ler isso hoje. Obrigada, doutora.', createdAt: minutosAtras(30) },
        { id: 'c2', author: AUTORES.helena, text: 'Assino embaixo. E pedir ajuda também é cuidar do bebê.', createdAt: minutosAtras(18) },
      ],
    },
    {
      id: 'p2',
      author: AUTORES.juliana,
      text: 'Hoje consegui tomar um banho de 20 minutos sem pressa, com o bebê dormindo no colo do pai. Parece pouco, mas me senti gente de novo. Pequenas vitórias contam, né?',
      createdAt: minutosAtras(95),
      likes: 31,
      liked: false,
      comments: [
        { id: 'c3', author: AUTORES.fernanda, text: 'Contam muito! Guardando isso para quando chegar a minha vez.', createdAt: minutosAtras(80) },
      ],
    },
    {
      id: 'p3',
      author: AUTORES.anonima,
      text: 'Alguém mais sente culpa por estar contando os dias para voltar a trabalhar? Amo minha filha, mas sinto falta de ser eu mesma.',
      createdAt: minutosAtras(60 * 5),
      likes: 57,
      liked: false,
      comments: [
        { id: 'c4', author: AUTORES.beatriz, text: 'Senti exatamente isso. Você não está sozinha.', createdAt: minutosAtras(60 * 4) },
        { id: 'c5', author: AUTORES.ana, text: 'Sentir falta de si mesma não anula o amor pela sua filha. As duas coisas cabem juntas. Se quiser conversar sobre isso, a roda de quarta fala exatamente desse tema.', createdAt: minutosAtras(60 * 3) },
      ],
    },
    {
      id: 'p4',
      author: AUTORES.helena,
      text: 'Roda de quinta às 18h: "Os primeiros meses". Vamos falar de sono, de rede de apoio e de como pedir ajuda sem culpa. Ainda temos 2 vagas. O encontro é online e sigiloso.',
      createdAt: minutosAtras(60 * 20),
      likes: 22,
      liked: false,
      comments: [],
    },
    {
      id: 'p5',
      author: AUTORES.fernanda,
      text: 'Com 32 semanas e o medo do parto aumentando a cada dia. Quem passou por isso, o que ajudou vocês?',
      createdAt: minutosAtras(60 * 26),
      likes: 19,
      liked: false,
      comments: [
        { id: 'c6', author: AUTORES.mariana, text: 'Conversar com outras mães e montar um plano de parto me deixou bem mais tranquila.', createdAt: minutosAtras(60 * 25) },
      ],
    },
  ];
}

export function carregarFeed() {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (salvo) return JSON.parse(salvo);
  } catch {
    // Sem acesso ao armazenamento (aba anônima, por exemplo): usa os posts de exemplo
  }
  return postsIniciais();
}

export function salvarFeed(posts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch {
    // Se não der para salvar, o feed continua funcionando até a página ser recarregada
  }
}

export const AUTOR_ANONIMO = AUTORES.anonima;
