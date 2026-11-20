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

export function obterEmpresaAtual() {
  return rhFetch('/api/rh/empresas/atual', { method: 'GET' });
}

export function atualizarEmpresa(empresaId, { nome, cnpj }) {
  return rhFetch(`/api/rh/empresas/${encodeURIComponent(empresaId)}`, {
    method: 'PUT',
    body: JSON.stringify({ nome, cnpj }),
  });
}

export function listarLicencas(empresaId) {
  return rhFetch(`/api/rh/empresas/${encodeURIComponent(empresaId)}/licencas`, {
    method: 'GET',
  });
}

export function emitirConviteLicenca({ empresaId, nomeColaboradora, emailCorporativo, departamento }) {
  return rhFetch('/api/rh/licencas/convite', {
    method: 'POST',
    body: JSON.stringify({ empresaId, nomeColaboradora, emailCorporativo, departamento }),
  });
}

export function reenviarConviteLicenca(licencaId) {
  return rhFetch(`/api/rh/licencas/${encodeURIComponent(licencaId)}/reenviar`, {
    method: 'POST',
  });
}

export function revogarLicenca(licencaId) {
  return rhFetch(`/api/rh/licencas/${encodeURIComponent(licencaId)}/revogar`, {
    method: 'PATCH',
  });
}

export function reativarLicenca(licencaId) {
  return rhFetch(`/api/rh/licencas/${encodeURIComponent(licencaId)}/reativar`, {
    method: 'PATCH',
  });
}

export function obterRelatorioKAnonimato(empresaId) {
  return rhFetch(`/api/rh/empresas/${encodeURIComponent(empresaId)}/relatorio-k-anonimato`, {
    method: 'GET',
  });
}
