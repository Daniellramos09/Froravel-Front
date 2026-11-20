import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SettingsScreen from '../SettingsScreen';
import HealthReportsScreen from '../HealthReportsScreen';
import { JWT_KEY } from '../../utils/rhSession';

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('SettingsScreen & HealthReportsScreen', () => {
  beforeEach(() => {
    localStorage.setItem(JWT_KEY, 'jwt-rh');
  });

  it('SettingsScreen validates CNPJ, updates company via PUT /api/rh/empresas/{id}, and renders safe fallbacks', async () => {
    const onCompanyUpdated = vi.fn();
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        jsonResponse({
          id: 'emp-1',
          nome: 'TechMães Brasil S.A.',
          cnpj: '12.345.678/0001-90',
          status: 'ATIVA',
        })
      )
      .mockResolvedValueOnce(
        jsonResponse({
          id: 'emp-1',
          nome: 'TechMães Atualizada S.A.',
          cnpj: '98.765.432/0001-10',
          status: 'ATIVA',
        })
      );

    render(
      <SettingsScreen
        session={{ nome: 'Gestora RH', email: 'rh@techmaes.com.br', codigoPublico: 'FLR-RH1' }}
        onCompanyUpdated={onCompanyUpdated}
      />
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('TechMães Brasil S.A.')).toBeInTheDocument();
    });

    const user = userEvent.setup();
    const cnpjInput = screen.getByLabelText('CNPJ');
    await user.clear(cnpjInput);
    await user.type(cnpjInput, '123');
    expect(screen.getByRole('alert')).toHaveTextContent('CNPJ inválido');

    await user.clear(cnpjInput);
    await user.type(cnpjInput, '98.765.432/0001-10');
    const nameInput = screen.getByLabelText('Razão Social / Nome da Empresa');
    await user.clear(nameInput);
    await user.type(nameInput, 'TechMães Atualizada S.A.');

    await user.click(screen.getByRole('button', { name: /Salvar Alterações/i }));

    await waitFor(() => {
      expect(onCompanyUpdated).toHaveBeenCalledWith(
        expect.objectContaining({ nome: 'TechMães Atualizada S.A.' })
      );
    });

    // Safe fallback on Admins & Notifications tabs (no Tatiana Camargo mock)
    await user.click(screen.getByRole('tab', { name: /Administradores/i }));
    expect(screen.getByText('Gestora RH')).toBeInTheDocument();
    expect(screen.getByText(/provisionamento multi-administrador via API está indisponível/i)).toBeInTheDocument();
    expect(document.body.textContent).not.toContain('Tatiana Camargo');

    await user.click(screen.getByRole('tab', { name: /Notificações/i }));
    expect(screen.getByText('Preferências de Notificação Indisponíveis')).toBeInTheDocument();
  });

  it('HealthReportsScreen renders live K-anonymity report, LGPD clinical-unavailable notice, and retries on 500', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse({ status: 500, message: 'Falha ao consultar relatório' }, 500))
      .mockResolvedValueOnce(jsonResponse({ id: 'emp-1', nome: 'TechMães Brasil S.A.' }))
      .mockResolvedValueOnce(
        jsonResponse({
          empresaId: 'emp-1',
          parametroKMinimo: 5,
          totalLicencasEmitidas: 10,
          totalLicencasAtivadas: 8,
          taxaAdesaoPercentual: 80.0,
          setoresElegiveis: [
            { nomeSetor: 'Engenharia', colaboradorasAtivas: 6, agrupadoPorKAnonimato: false },
          ],
          indiceGeralAgrupadoKAnonimato: {
            nomeSetor: 'Índice Geral da Empresa',
            colaboradorasAtivas: 2,
            agrupadoPorKAnonimato: true,
          },
          diretrizCompliance: 'Muralha de Fogo & K-Anonimato (K >= 5)',
        })
      );

    render(<HealthReportsScreen />);
    await waitFor(() => {
      expect(screen.getByTestId('reports-error')).toHaveTextContent('Falha ao consultar relatório');
    });

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Tentar novamente/i }));

    await waitFor(() => {
      expect(screen.getByText('Telemetria Clínica Longitudinal Indisponível')).toBeInTheDocument();
    });
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('rejects mixed-alphanumeric and malformed-punctuation CNPJs while accepting raw 14-digit and formatted CNPJs', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        jsonResponse({
          id: 'emp-1',
          nome: 'TechMães Brasil S.A.',
          cnpj: '12.345.678/0001-90',
          status: 'ATIVA',
        })
      )
      .mockResolvedValueOnce(
        jsonResponse({
          id: 'emp-1',
          nome: 'TechMães Brasil S.A.',
          cnpj: '12345678000190',
          status: 'ATIVA',
        })
      );

    render(<SettingsScreen />);
    await waitFor(() => {
      expect(screen.getByDisplayValue('TechMães Brasil S.A.')).toBeInTheDocument();
    });

    const user = userEvent.setup();
    const cnpjInput = screen.getByLabelText('CNPJ');
    const saveButton = screen.getByRole('button', { name: /Salvar Alterações/i });

    await user.clear(cnpjInput);
    await user.type(cnpjInput, '12345678000190abc');
    expect(screen.getByRole('alert')).toHaveTextContent(/CNPJ inválido/i);
    expect(saveButton).toBeDisabled();
    fireEvent.submit(cnpjInput.closest('form'));
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await user.clear(cnpjInput);
    await user.type(cnpjInput, '12.345.678-0001/90');
    expect(screen.getByRole('alert')).toHaveTextContent(/CNPJ inválido/i);
    expect(saveButton).toBeDisabled();
    fireEvent.submit(cnpjInput.closest('form'));
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await user.clear(cnpjInput);
    await user.type(cnpjInput, '12345678000190');
    expect(screen.queryByText(/CNPJ inválido/i)).toBeNull();
    expect(saveButton).toBeEnabled();

    await user.click(saveButton);
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:8080/api/rh/empresas/emp-1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ nome: 'TechMães Brasil S.A.', cnpj: '12345678000190' }),
        })
      );
    });
  });

  it('prevents duplicate PUT /api/rh/empresas/{id} on synchronous same-tick double-submit', async () => {
    let resolvePut;
    const putPromise = new Promise((resolve) => {
      resolvePut = resolve;
    });

    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        jsonResponse({
          id: 'emp-1',
          nome: 'TechMães Brasil S.A.',
          cnpj: '12.345.678/0001-90',
          status: 'ATIVA',
        })
      )
      .mockImplementationOnce(() => putPromise);

    render(<SettingsScreen />);
    await waitFor(() => {
      expect(screen.getByDisplayValue('TechMães Brasil S.A.')).toBeInTheDocument();
    });

    const user = userEvent.setup();
    const nameInput = screen.getByLabelText('Razão Social / Nome da Empresa');
    await user.clear(nameInput);
    await user.type(nameInput, 'TechMães Nova S.A.');

    const form = screen.getByRole('button', { name: /Salvar Alterações/i }).closest('form');
    fireEvent.submit(form);
    fireEvent.submit(form);

    const putCalls = fetchMock.mock.calls.filter(([, opts]) => opts?.method === 'PUT');
    expect(putCalls).toHaveLength(1);

    resolvePut(
      jsonResponse({
        id: 'emp-1',
        nome: 'TechMães Nova S.A.',
        cnpj: '12.345.678/0001-90',
        status: 'ATIVA',
      })
    );

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        'Dados da empresa atualizados com sucesso!'
      );
    });
  });

  it('HealthReportsScreen renders 0% instead of raw "%" when taxaAdesaoPercentual is null in 0/0 empty report', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse({ id: 'emp-1', nome: 'TechMães Brasil S.A.' }))
      .mockResolvedValueOnce(
        jsonResponse({
          empresaId: 'emp-1',
          parametroKMinimo: 5,
          totalLicencasEmitidas: 0,
          totalLicencasAtivadas: 0,
          taxaAdesaoPercentual: null,
          setoresElegiveis: [],
          indiceGeralAgrupadoKAnonimato: null,
        })
      );

    render(<HealthReportsScreen />);

    await waitFor(() => {
      expect(screen.getByText('Telemetria Clínica Longitudinal Indisponível')).toBeInTheDocument();
    });
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.queryByText(/^%$/)).toBeNull();
    expect(document.body.textContent).not.toContain('NaN%');
    expect(screen.getByText('Nenhuma colaboradora ativa registrada até o momento.')).toBeInTheDocument();
  });

  it('SettingsScreen and HealthReportsScreen render 401 re-login CTA in standalone mode when onLogout is supplied', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse({ status: 401, message: 'Sessão expirada.' }, 401))
      .mockResolvedValueOnce(jsonResponse({ status: 401, message: 'Sessão expirada.' }, 401));

    const onLogout = vi.fn();
    const user = userEvent.setup();

    const { unmount } = render(<SettingsScreen onLogout={onLogout} />);
    await waitFor(() => {
      expect(screen.getByTestId('settings-error')).toHaveTextContent('Sessão expirada.');
    });
    await user.click(screen.getByRole('button', { name: /Fazer login novamente/i }));
    expect(onLogout).toHaveBeenCalledTimes(1);
    unmount();

    render(<HealthReportsScreen onLogout={onLogout} />);
    await waitFor(() => {
      expect(screen.getByTestId('reports-error')).toHaveTextContent('Sessão expirada.');
    });
    await user.click(screen.getByRole('button', { name: /Fazer login novamente/i }));
    expect(onLogout).toHaveBeenCalledTimes(2);
  });
});
