const STORAGE_KEY = 'floravel_contatos_seguranca';

const CONTATOS_INICIAIS = [
  {
    id: 'helena-souza',
    nome: 'Dra. Helena Souza',
    codigoPublico: '#FLR-P14H90',
    papel: 'psicologo',
    papelLabel: 'Psicóloga Perinatal · CRP 06/142980',
    canal: 'Vídeo em Grupo · Roda de Acolhimento: Os Primeiros Meses',
    tipoCanal: 'video_grupo',
    ultimoContato: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'camila-rocha',
    nome: 'Camila Rocha',
    codigoPublico: '#FLR-M2C8R4',
    papel: 'mae',
    papelLabel: 'Mãe participante',
    canal: 'Vídeo em Grupo · Roda de Acolhimento: Os Primeiros Meses',
    tipoCanal: 'video_grupo',
    ultimoContato: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'beatriz-lima',
    nome: 'Beatriz Lima',
    codigoPublico: '#FLR-M9B5L7',
    papel: 'mae',
    papelLabel: 'Mãe participante',
    canal: 'Vídeo em Grupo · Roda de Acolhimento: Os Primeiros Meses',
    tipoCanal: 'video_grupo',
    ultimoContato: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ana-beatriz',
    nome: 'Dra. Ana Beatriz Lima',
    codigoPublico: '#FLR-P11B34',
    papel: 'psicologo',
    papelLabel: 'Psicóloga Perinatal · CRP 06/118734',
    canal: 'Comunidade Florável · Publicação',
    tipoCanal: 'mensagem',
    ultimoContato: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'juliana-costa',
    nome: 'Juliana Costa',
    codigoPublico: '#FLR-M3J7C9',
    papel: 'mae',
    papelLabel: 'Mãe participante',
    canal: 'Comunidade Florável · Mensagem',
    tipoCanal: 'mensagem',
    ultimoContato: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function carregarContatosSeguranca() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(CONTATOS_INICIAIS));
      return CONTATOS_INICIAIS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : CONTATOS_INICIAIS;
  } catch {
    return CONTATOS_INICIAIS;
  }
}

export function registrarContatosEncontro(novosContatos = []) {
  if (!Array.isArray(novosContatos) || novosContatos.length === 0) return;
  try {
    const atuais = carregarContatosSeguranca();
    const mapa = new Map(atuais.map((c) => [c.codigoPublico || c.id || c.nome, c]));

    for (const item of novosContatos) {
      if (!item?.nome) continue;
      const chave = item.codigoPublico || item.id || item.nome;
      mapa.set(chave, {
        id: item.id || chave,
        nome: item.nome,
        codigoPublico: item.codigoPublico || '#FLR-PART',
        papel: item.papel || 'mae',
        papelLabel: item.papelLabel || (item.papel === 'psicologo' ? 'Psicóloga Perinatal' : 'Mãe participante'),
        canal: item.canal || 'Encontro Florável',
        tipoCanal: item.tipoCanal || 'video_grupo',
        ultimoContato: new Date().toISOString(),
      });
    }

    const listaAtualizada = Array.from(mapa.values()).sort(
      (a, b) => new Date(b.ultimoContato).getTime() - new Date(a.ultimoContato).getTime()
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listaAtualizada));
  } catch {
    // ignore storage errors
  }
}

export function carregarDenunciasRegistradas() {
  try {
    const raw = localStorage.getItem('floravel_denuncias');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
