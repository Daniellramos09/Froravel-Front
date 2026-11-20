import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LicensesScreen from '../LicensesScreen';
import { JWT_KEY } from '../../utils/rhSession';

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

const SAMPLE_LICENSES = [
  {
    id: 'lic-1',
    empresaId: 'emp-1',
    nomeColaboradora: 'Beatriz Souza',
    emailCorporativo: 'beatriz@techmaes.com.br',
    departamento: 'Engenharia',
    status: 'ATIVADA',
    tokenConvite: 'FLR-B2B-ATIV-1',
    dataConvite: '2026-10-01 10:00:00',
  },
  {
    id: 'lic-2',
    empresaId: 'emp-1',
    nomeColaboradora: 'Camila Lima',
    emailCorporativo: 'camila@techmaes.com.br',
    departamento: 'Jurídico',
    status: 'PENDENTE',
    tokenConvite: 'FLR-B2B-PEND-2',
    dataConvite: '2026-10-02 10:00:00',
  },
  {
    id: 'lic-3',
    empresaId: 'emp-1',
    nomeColaboradora: 'Daniela Costa',
    emailCorporativo: 'daniela@techmaes.com.br',
    departamento: 'Design',
    status: 'REVOGADA',
    tokenConvite: 'FLR-B2B-REV-3',
    dataConvite: '2026-10-03 10:00:00',
  },
];

const SAMPLE_REPORT = {
  empresaId: 'emp-1',
  taxaAdesaoPercentual: 33.3,
};

describe('LicensesScreen', () => {
  beforeEach(() => {
    localStorage.setItem(JWT_KEY, 'jwt-rh');
  });

  it('loads real licenses, filters by search/status/department, and copies real invite token link', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse({ id: 'emp-1', nome: 'TechMães Brasil S.A.' }))
      .mockResolvedValueOnce(jsonResponse(SAMPLE_LICENSES))
      .mockResolvedValueOnce(jsonResponse(SAMPLE_REPORT));

    render(<LicensesScreen />);
    expect(screen.getByTestId('licenses-loading')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Beatriz Souza')).toBeInTheDocument();
    });
    expect(screen.getByText('33.3%')).toBeInTheDocument();
    expect(document.body.textContent).not.toContain('INITIAL_COLLABORATORS');
    expect(document.body.textContent).not.toContain('94%');

    const user = userEvent.setup();
    const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);

    await user.selectOptions(screen.getByLabelText('Filtrar por setor'), 'Jurídico');
    expect(screen.queryByText('Beatriz Souza')).not.toBeInTheDocument();
    expect(screen.getByText('Camila Lima')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Ações para Camila Lima' }));
    await user.click(screen.getByRole('button', { name: 'Copiar Link' }));

    expect(writeTextSpy).toHaveBeenCalledWith(
      expect.stringContaining('convite=FLR-B2B-PEND-2')
    );
  });

  it('handles invite creation, 422 duplicate error, resend, revoke, and reactivate', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse({ id: 'emp-1', nome: 'TechMães Brasil S.A.' }))
      .mockResolvedValueOnce(jsonResponse(SAMPLE_LICENSES))
      .mockResolvedValueOnce(jsonResponse(SAMPLE_REPORT))
      // 422 duplicate invite
      .mockResolvedValueOnce(
        jsonResponse({ status: 422, message: 'Já existe uma licença emitida para este e-mail.' }, 422)
      )
      // 201 created invite
      .mockResolvedValueOnce(
        jsonResponse(
          {
            id: 'lic-4',
            empresaId: 'emp-1',
            nomeColaboradora: 'Fernanda Alves',
            emailCorporativo: 'fernanda@techmaes.com.br',
            departamento: 'Engenharia',
            status: 'PENDENTE',
            tokenConvite: 'FLR-B2B-NEW-4',
          },
          201
        )
      )
      .mockResolvedValueOnce(jsonResponse({ ...SAMPLE_REPORT, taxaAdesaoPercentual: 25.0 }))
      // revoke lic-1
      .mockResolvedValueOnce(jsonResponse({ ...SAMPLE_LICENSES[0], status: 'REVOGADA' }))
      .mockResolvedValueOnce(jsonResponse({ ...SAMPLE_REPORT, taxaAdesaoPercentual: 0 }))
      // reactivate lic-1
      .mockResolvedValueOnce(jsonResponse({ ...SAMPLE_LICENSES[0], status: 'ATIVADA' }))
      .mockResolvedValueOnce(jsonResponse({ ...SAMPLE_REPORT, taxaAdesaoPercentual: 25.0 }));

    render(<LicensesScreen />);
    await waitFor(() => {
      expect(screen.getByText('Beatriz Souza')).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Convidar Colaboradora/i }));
    await user.type(screen.getByLabelText('Nome Completo'), 'Fernanda Alves');
    await user.type(screen.getByLabelText('E-mail Corporativo'), 'beatriz@techmaes.com.br');
    await user.click(screen.getByRole('button', { name: /Disparar Convite/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Já existe uma licença emitida');
    });

    await user.clear(screen.getByLabelText('E-mail Corporativo'));
    await user.type(screen.getByLabelText('E-mail Corporativo'), 'fernanda@techmaes.com.br');
    await user.click(screen.getByRole('button', { name: /Disparar Convite/i }));

    await waitFor(() => {
      expect(screen.getByText('Fernanda Alves')).toBeInTheDocument();
    });

    // Revoke Beatriz -> Revogada, then Reactivate -> Ativa
    await user.click(screen.getByRole('button', { name: 'Ações para Beatriz Souza' }));
    await user.click(screen.getByRole('button', { name: 'Revogar' }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:8080/api/rh/licencas/lic-1/revogar',
        expect.objectContaining({ method: 'PATCH' })
      );
    });

    await user.click(screen.getByRole('button', { name: 'Ações para Beatriz Souza' }));
    await user.click(screen.getByRole('button', { name: 'Reativar' }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:8080/api/rh/licencas/lic-1/reativar',
        expect.objectContaining({ method: 'PATCH' })
      );
    });
  });

  it('displays error banner and retries on network failure', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockRejectedValueOnce(new TypeError('Network failure'))
      .mockResolvedValueOnce(jsonResponse({ id: 'emp-1', nome: 'TechMães Brasil S.A.' }))
      .mockResolvedValueOnce(jsonResponse(SAMPLE_LICENSES))
      .mockResolvedValueOnce(jsonResponse(SAMPLE_REPORT));

    render(<LicensesScreen />);
    await waitFor(() => {
      expect(screen.getByTestId('licenses-error')).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Tentar novamente/i }));

    await waitFor(() => {
      expect(screen.getByText('Beatriz Souza')).toBeInTheDocument();
    });
  });
});
