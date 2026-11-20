import { getApiBase } from '@floravel/shared';
import { getStoredJwt } from '../utils/rhSession';

export class RhApiError extends Error {
  constructor(message, { status = 0, error = '', validationErrors = null, path = '' } = {}) {
    super(message);
    this.name = 'RhApiError';
    this.status = status;
    this.error = error;
    this.validationErrors = validationErrors;
    this.path = path;
    this.isAuthError = status === 401;
    this.isForbidden = status === 403;
    this.isNetworkError = status === 0;
  }
}

export function extractErrorMessage(payload, status) {
  if (payload?.validationErrors && typeof payload.validationErrors === 'object') {
    const firstMsg = Object.values(payload.validationErrors).find(
      (val) => typeof val === 'string' && val.trim().length > 0
    );
    if (firstMsg) return firstMsg;
  }
  if (typeof payload?.message === 'string' && payload.message.trim().length > 0) {
    return payload.message;
  }
  if (typeof payload?.mensagem === 'string' && payload.mensagem.trim().length > 0) {
    return payload.mensagem;
  }
  if (status === 401) return 'Sessão expirada ou não autenticada. Faça login novamente.';
  if (status === 403) return 'Acesso restrito ao perfil Gestão RH B2B.';
  if (status === 404) return 'Recurso corporativo não encontrado.';
  if (status === 422) return 'Não foi possível concluir a operação pelas regras de negócio.';
  if (status >= 500) return 'Erro interno no servidor Florável. Tente novamente.';
  return 'Não foi possível completar a solicitação corporativa.';
}

async function rhFetch(path, options = {}) {
  const token = getStoredJwt();
  if (!token) {
    throw new RhApiError('Sessão não autenticada. Faça login para acessar o painel RH.', {
      status: 401,
      error: 'Não Autorizado',
      path,
    });
  }

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...options.headers,
  };

  let response;
  try {
    response = await fetch(`${getApiBase()}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new RhApiError(
      'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
      { status: 0, error: 'NetworkError', path }
    );
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new RhApiError(extractErrorMessage(data, response.status), {
      status: response.status,
      error: data?.error || '',
      validationErrors: data?.validationErrors || null,
      path: data?.path || path,
    });
  }

  return data;
}

const DEMO_COMPANY = {
  id: 'emp-floravel-b2b',
  nome: 'Florável Partners S.A.',
  cnpj: '48.210.593/0001-74',
  status: 'ATIVA',
  dataCadastro: '2026-10-15 09:00:00',
};

let demoCompanyState = { ...DEMO_COMPANY };

let demoLicensesState = [
  { id: 'lic-1', empresaId: 'emp-floravel-b2b', nomeColaboradora: 'Beatriz Oliveira', emailCorporativo: 'beatriz.oliveira@floravelpartners.com.br', departamento: 'Tecnologia & Produto', status: 'ATIVADA', tokenConvite: 'FLR-B2B-901A', dataConvite: '2026-10-18 10:30:00' },
  { id: 'lic-2', empresaId: 'emp-floravel-b2b', nomeColaboradora: 'Camila Mendes', emailCorporativo: 'camila.mendes@floravelpartners.com.br', departamento: 'Tecnologia & Produto', status: 'ATIVADA', tokenConvite: 'FLR-B2B-902B', dataConvite: '2026-10-20 11:15:00' },
  { id: 'lic-3', empresaId: 'emp-floravel-b2b', nomeColaboradora: 'Fernanda Costa', emailCorporativo: 'fernanda.costa@floravelpartners.com.br', departamento: 'Tecnologia & Produto', status: 'ATIVADA', tokenConvite: 'FLR-B2B-903C', dataConvite: '2026-10-22 14:00:00' },
  { id: 'lic-4', empresaId: 'emp-floravel-b2b', nomeColaboradora: 'Juliana Rocha', emailCorporativo: 'juliana.rocha@floravelpartners.com.br', departamento: 'Tecnologia & Produto', status: 'ATIVADA', tokenConvite: 'FLR-B2B-904D', dataConvite: '2026-10-25 09:45:00' },
  { id: 'lic-5', empresaId: 'emp-floravel-b2b', nomeColaboradora: 'Mariana Silva', emailCorporativo: 'mariana.silva@floravelpartners.com.br', departamento: 'Tecnologia & Produto', status: 'ATIVADA', tokenConvite: 'FLR-B2B-905E', dataConvite: '2026-10-28 16:20:00' },
  { id: 'lic-6', empresaId: 'emp-floravel-b2b', nomeColaboradora: 'Patrícia Almeida', emailCorporativo: 'patricia.almeida@floravelpartners.com.br', departamento: 'Operações & Pessoas', status: 'ATIVADA', tokenConvite: 'FLR-B2B-906F', dataConvite: '2026-11-01 10:00:00' },
  { id: 'lic-7', empresaId: 'emp-floravel-b2b', nomeColaboradora: 'Larissa Santos', emailCorporativo: 'larissa.santos@floravelpartners.com.br', departamento: 'Operações & Pessoas', status: 'ATIVADA', tokenConvite: 'FLR-B2B-907G', dataConvite: '2026-11-03 13:10:00' },
  { id: 'lic-8', empresaId: 'emp-floravel-b2b', nomeColaboradora: 'Aline Ferreira', emailCorporativo: 'aline.ferreira@floravelpartners.com.br', departamento: 'Operações & Pessoas', status: 'ATIVADA', tokenConvite: 'FLR-B2B-908H', dataConvite: '2026-11-05 15:40:00' },
  { id: 'lic-9', empresaId: 'emp-floravel-b2b', nomeColaboradora: 'Renata Lima', emailCorporativo: 'renata.lima@floravelpartners.com.br', departamento: 'Operações & Pessoas', status: 'ATIVADA', tokenConvite: 'FLR-B2B-909I', dataConvite: '2026-11-08 09:20:00' },
  { id: 'lic-10', empresaId: 'emp-floravel-b2b', nomeColaboradora: 'Tatiane Gomes', emailCorporativo: 'tatiane.gomes@floravelpartners.com.br', departamento: 'Operações & Pessoas', status: 'ATIVADA', tokenConvite: 'FLR-B2B-910J', dataConvite: '2026-11-10 11:50:00' },
  { id: 'lic-11', empresaId: 'emp-floravel-b2b', nomeColaboradora: 'Daniela Ribeiro', emailCorporativo: 'daniela.ribeiro@floravelpartners.com.br', departamento: 'Jurídico & Compliance', status: 'ATIVADA', tokenConvite: 'FLR-B2B-911K', dataConvite: '2026-11-12 14:30:00' },
  { id: 'lic-12', empresaId: 'emp-floravel-b2b', nomeColaboradora: 'Vanessa Martins', emailCorporativo: 'vanessa.martins@floravelpartners.com.br', departamento: 'Financeiro', status: 'ATIVADA', tokenConvite: 'FLR-B2B-912L', dataConvite: '2026-11-14 16:00:00' },
  { id: 'lic-13', empresaId: 'emp-floravel-b2b', nomeColaboradora: 'Carolina Duarte', emailCorporativo: 'carolina.duarte@floravelpartners.com.br', departamento: 'Marketing', status: 'PENDENTE', tokenConvite: 'FLR-B2B-913M', dataConvite: '2026-11-18 10:15:00' },
  { id: 'lic-14', empresaId: 'emp-floravel-b2b', nomeColaboradora: 'Gabriela Nunes', emailCorporativo: 'gabriela.nunes@floravelpartners.com.br', departamento: 'Tecnologia & Produto', status: 'PENDENTE', tokenConvite: 'FLR-B2B-914N', dataConvite: '2026-11-19 17:00:00' },
];

function buildDemoReport() {
  const totalEmitidas = demoLicensesState.length;
  const ativas = demoLicensesState.filter((l) => l.status === 'ATIVADA');
  const totalAtivadas = ativas.length;
  const taxa = totalEmitidas > 0 ? Number(((totalAtivadas / totalEmitidas) * 100).toFixed(1)) : 0;

  const countsByDept = {};
  for (const lic of ativas) {
    const d = lic.departamento || 'Geral';
    countsByDept[d] = (countsByDept[d] || 0) + 1;
  }

  const setoresElegiveis = [];
  let agrupadas = 0;
  for (const [nomeSetor, count] of Object.entries(countsByDept)) {
    if (count >= 5) {
      setoresElegiveis.push({ nomeSetor, colaboradorasAtivas: count, agrupadoPorKAnonimato: false });
    } else {
      agrupadas += count;
    }
  }

  return {
    empresaId: demoCompanyState.id,
    parametroKMinimo: 5,
    totalLicencasEmitidas: totalEmitidas,
    totalLicencasAtivadas: totalAtivadas,
    taxaAdesaoPercentual: taxa,
    setoresElegiveis,
    indiceGeralAgrupadoKAnonimato:
      agrupadas > 0
        ? {
            nomeSetor: 'Índice Geral da Empresa (Setores Agrupados por K-Anonimato < 5)',
            colaboradorasAtivas: agrupadas,
            agrupadoPorKAnonimato: true,
          }
        : null,
    diretrizCompliance:
      'Muralha de Fogo & K-Anonimato (K >= 5): Nenhum dado clínico, nota de Edimburgo ou agendamento individual é acessível ao RH.',
  };
}

export function obterEmpresaAtual() {
  if (!getApiBase()) return Promise.resolve({ ...demoCompanyState });
  return rhFetch('/api/rh/empresas/atual', { method: 'GET' });
}

export function atualizarEmpresa(empresaId, { nome, cnpj }) {
  if (!getApiBase()) {
    demoCompanyState = { ...demoCompanyState, nome: nome || demoCompanyState.nome, cnpj: cnpj || demoCompanyState.cnpj };
    return Promise.resolve({ ...demoCompanyState });
  }
  return rhFetch(`/api/rh/empresas/${encodeURIComponent(empresaId)}`, {
    method: 'PUT',
    body: JSON.stringify({ nome, cnpj }),
  });
}

export function listarLicencas(empresaId) {
  if (!getApiBase()) return Promise.resolve([...demoLicensesState]);
  return rhFetch(`/api/rh/empresas/${encodeURIComponent(empresaId)}/licencas`, {
    method: 'GET',
  });
}

export function emitirConviteLicenca({ empresaId, nomeColaboradora, emailCorporativo, departamento }) {
  if (!getApiBase()) {
    const nova = {
      id: `lic-${Date.now()}`,
      empresaId: empresaId || demoCompanyState.id,
      nomeColaboradora,
      emailCorporativo,
      departamento: departamento || 'Geral',
      status: 'PENDENTE',
      tokenConvite: `FLR-B2B-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      dataConvite: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };
    demoLicensesState = [nova, ...demoLicensesState];
    return Promise.resolve(nova);
  }
  return rhFetch('/api/rh/licencas/convite', {
    method: 'POST',
    body: JSON.stringify({ empresaId, nomeColaboradora, emailCorporativo, departamento }),
  });
}

export function reenviarConviteLicenca(licencaId) {
  if (!getApiBase()) {
    const target = demoLicensesState.find((l) => l.id === licencaId);
    return Promise.resolve(target || { id: licencaId, status: 'PENDENTE' });
  }
  return rhFetch(`/api/rh/licencas/${encodeURIComponent(licencaId)}/reenviar`, {
    method: 'POST',
  });
}

export function revogarLicenca(licencaId) {
  if (!getApiBase()) {
    demoLicensesState = demoLicensesState.map((l) => (l.id === licencaId ? { ...l, status: 'REVOGADA' } : l));
    return Promise.resolve(demoLicensesState.find((l) => l.id === licencaId));
  }
  return rhFetch(`/api/rh/licencas/${encodeURIComponent(licencaId)}/revogar`, {
    method: 'PATCH',
  });
}

export function reativarLicenca(licencaId) {
  if (!getApiBase()) {
    demoLicensesState = demoLicensesState.map((l) => (l.id === licencaId ? { ...l, status: 'ATIVADA' } : l));
    return Promise.resolve(demoLicensesState.find((l) => l.id === licencaId));
  }
  return rhFetch(`/api/rh/licencas/${encodeURIComponent(licencaId)}/reativar`, {
    method: 'PATCH',
  });
}

export function obterRelatorioKAnonimato(empresaId) {
  if (!getApiBase()) return Promise.resolve(buildDemoReport());
  return rhFetch(`/api/rh/empresas/${encodeURIComponent(empresaId)}/relatorio-k-anonimato`, {
    method: 'GET',
  });
}
