/**
 * Retorna a cor de fundo correspondente de cada ilustração autoral Florável
 * para que a imagem fique inteira dentro da moldura (object-contain) sem cortar rostos.
 */
export function getIllustrationBgClass(imgPath = '') {
  if (imgPath.includes('roda.jpg')) return 'bg-[#213D29]';
  if (imgPath.includes('rede.jpg')) return 'bg-[#EBB4BF]';
  if (imgPath.includes('pausa.jpg')) return 'bg-[#F2EAE1]';
  if (imgPath.includes('leitura.jpg')) return 'bg-[#ECD8C2]';
  return 'bg-[#F8F5F0]';
}
