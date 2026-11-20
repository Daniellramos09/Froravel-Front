import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  obterEmpresaAtual,
  atualizarEmpresa,
  listarLicencas,
  emitirConviteLicenca,
  reenviarConviteLicenca,
  revogarLicenca,
  reativarLicenca,
  obterRelatorioKAnonimato,
  RhApiError,
  extractErrorMessage,
} from '../rhApi';
import { JWT_KEY } from '../../utils/rhSession';

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('rhApi', () => {
  beforeEach(() => {
    localStorage.setItem(JWT_KEY, 'jwt-rh-token');
  });

  it('throws 401 RhApiError immediately when floravel_jwt is missing', async () => {
    localStorage.removeItem(JWT_KEY);
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    await expect(obterEmpresaAtual()).rejects.toMatchObject({
      name: 'RhApiError',
      status: 401,
      isAuthError: true,
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('rejects whitespace-only floravel_jwt with 401 RhApiError without calling fetch', async () => {
    localStorage.setItem(JWT_KEY, '   \t\n ');
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    await expect(obterEmpresaAtual()).rejects.toMatchObject({
      name: 'RhApiError',
      status: 401,
      isAuthError: true,
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('trims padded floravel_jwt before sending Authorization header', async () => {
    localStorage.setItem(JWT_KEY, '  jwt-rh-token  ');
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse({ id: 'emp-1', nome: 'TechMães Brasil S.A.' }));

    await obterEmpresaAtual();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer jwt-rh-token');
  });

  it('attaches Bearer JWT and resolves all 8 RH endpoints', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse({ id: 'emp-1', nome: 'TechMães Brasil S.A.' }))
      .mockResolvedValueOnce(jsonResponse({ id: 'emp-1', nome: 'Nova Empresa', cnpj: '12.345.678/0001-90' }))
      .mockResolvedValueOnce(jsonResponse([{ id: 'lic-1', status: 'ATIVADA' }]))
      .mockResolvedValueOnce(jsonResponse({ id: 'lic-2', status: 'PENDENTE' }, 201))
      .mockResolvedValueOnce(jsonResponse({ id: 'lic-2', status: 'PENDENTE' }))
      .mockResolvedValueOnce(jsonResponse({ id: 'lic-2', status: 'REVOGADA' }))
      .mockResolvedValueOnce(jsonResponse({ id: 'lic-2', status: 'PENDENTE' }))
      .mockResolvedValueOnce(jsonResponse({ empresaId: 'emp-1', parametroKMinimo: 5 }));

    const emp = await obterEmpresaAtual();
    expect(emp.nome).toBe('TechMães Brasil S.A.');

    await atualizarEmpresa('emp-1', { nome: 'Nova Empresa', cnpj: '12.345.678/0001-90' });
    await listarLicencas('emp-1');
    await emitirConviteLicenca({
      empresaId: 'emp-1',
      nomeColaboradora: 'Ana',
      emailCorporativo: 'ana@empresa.com',
      departamento: 'Engenharia',
    });
    await reenviarConviteLicenca('lic-2');
    await revogarLicenca('lic-2');
    await reativarLicenca('lic-2');
    await obterRelatorioKAnonimato('emp-1');

    expect(fetchMock).toHaveBeenCalledTimes(8);
    expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8080/api/rh/empresas/atual');
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer jwt-rh-token');
    expect(fetchMock.mock.calls[1][1].method).toBe('PUT');
    expect(fetchMock.mock.calls[5][1].method).toBe('PATCH');
    expect(fetchMock.mock.calls[6][1].method).toBe('PATCH');
  });

  it('prioritizes validationErrors and maps 401/403/422/network errors into RhApiError', async () => {
    expect(
      extractErrorMessage({ validationErrors: { cnpj: 'CNPJ inválido' }, message: 'Falha' }, 400)
    ).toBe('CNPJ inválido');

    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        jsonResponse({ status: 400, validationErrors: { cnpj: 'CNPJ inválido' } }, 400)
      )
      .mockResolvedValueOnce(
        jsonResponse({ status: 403, message: 'Recurso restrito ao perfil Gestão RH B2B.' }, 403)
      )
      .mockResolvedValueOnce(
        jsonResponse({ status: 422, message: 'Já existe uma licença emitida.' }, 422)
      )
      .mockRejectedValueOnce(new TypeError('Failed to fetch'));

    await expect(atualizarEmpresa('emp-1', { nome: 'X', cnpj: '1' })).rejects.toMatchObject({
      status: 400,
      message: 'CNPJ inválido',
    });

    await expect(obterEmpresaAtual()).rejects.toMatchObject({
      status: 403,
      isForbidden: true,
    });

    await expect(
      emitirConviteLicenca({
        empresaId: 'emp-1',
        nomeColaboradora: 'Ana',
        emailCorporativo: 'ana@empresa.com',
        departamento: 'Engenharia',
      })
    ).rejects.toMatchObject({
      status: 422,
      message: 'Já existe uma licença emitida.',
    });

    await expect(obterEmpresaAtual()).rejects.toBeInstanceOf(RhApiError);
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });
});
