import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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
});
