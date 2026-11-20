import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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

  it('triggers POST /api/rh/licencas/{id}/reenviar when clicking Reenviar Convite on a PENDENTE row', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse({ id: 'emp-1', nome: 'TechMães Brasil S.A.' }))
      .mockResolvedValueOnce(jsonResponse(SAMPLE_LICENSES))
      .mockResolvedValueOnce(jsonResponse(SAMPLE_REPORT))
      .mockResolvedValueOnce(jsonResponse(SAMPLE_LICENSES[1]))
      .mockResolvedValueOnce(jsonResponse(SAMPLE_REPORT));

    render(<LicensesScreen />);
    await waitFor(() => {
      expect(screen.getByText('Camila Lima')).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Ações para Beatriz Souza' }));
    expect(screen.queryByRole('button', { name: 'Reenviar Convite' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Ações para Beatriz Souza' }));

    await user.click(screen.getByRole('button', { name: 'Ações para Camila Lima' }));
    await user.click(screen.getByRole('button', { name: 'Reenviar Convite' }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:8080/api/rh/licencas/lic-2/reenviar',
        expect.objectContaining({ method: 'POST' })
      );
    });
    expect(screen.getByRole('status')).toHaveTextContent(
      'Convite reenviado para camila@techmaes.com.br'
    );
  });

  it('prevents duplicate POST /api/rh/licencas/convite on synchronous same-tick double-submit', async () => {
    let resolveInvite;
    const invitePromise = new Promise((resolve) => {
      resolveInvite = resolve;
    });

    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse({ id: 'emp-1', nome: 'TechMães Brasil S.A.' }))
      .mockResolvedValueOnce(jsonResponse(SAMPLE_LICENSES))
      .mockResolvedValueOnce(jsonResponse(SAMPLE_REPORT))
      .mockImplementationOnce(() => invitePromise)
      .mockResolvedValueOnce(jsonResponse(SAMPLE_REPORT));

    render(<LicensesScreen />);
    await waitFor(() => {
      expect(screen.getByText('Beatriz Souza')).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Convidar Colaboradora/i }));
    await user.type(screen.getByLabelText('Nome Completo'), 'Mariana Alves');
    await user.type(screen.getByLabelText('E-mail Corporativo'), 'mariana@techmaes.com.br');

    const form = screen.getByRole('button', { name: /Disparar Convite/i }).closest('form');
    fireEvent.submit(form);
    fireEvent.submit(form);

    const inviteCalls = fetchMock.mock.calls.filter(([url]) =>
      String(url).endsWith('/api/rh/licencas/convite')
    );
    expect(inviteCalls).toHaveLength(1);

    resolveInvite(
      jsonResponse(
        {
          id: 'lic-5',
          empresaId: 'emp-1',
          nomeColaboradora: 'Mariana Alves',
          emailCorporativo: 'mariana@techmaes.com.br',
          departamento: 'Engenharia',
          status: 'PENDENTE',
          tokenConvite: 'FLR-5',
        },
        201
      )
    );

    await waitFor(() => {
      expect(screen.getByText('Mariana Alves')).toBeInTheDocument();
    });
  });

  it('prevents duplicate PATCH/POST calls on synchronous same-tick double-click of row actions', async () => {
    let resolveRevoke;
    const revokePromise = new Promise((resolve) => {
      resolveRevoke = resolve;
    });
    let resolveReactivate;
    const reactivatePromise = new Promise((resolve) => {
      resolveReactivate = resolve;
    });
    let resolveResend;
    const resendPromise = new Promise((resolve) => {
      resolveResend = resolve;
    });

    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse({ id: 'emp-1', nome: 'TechMães Brasil S.A.' }))
      .mockResolvedValueOnce(jsonResponse(SAMPLE_LICENSES))
      .mockResolvedValueOnce(jsonResponse(SAMPLE_REPORT))
      .mockImplementationOnce(() => revokePromise)
      .mockResolvedValueOnce(jsonResponse(SAMPLE_REPORT))
      .mockImplementationOnce(() => reactivatePromise)
      .mockResolvedValueOnce(jsonResponse(SAMPLE_REPORT))
      .mockImplementationOnce(() => resendPromise)
      .mockResolvedValueOnce(jsonResponse(SAMPLE_REPORT));

    render(<LicensesScreen />);
    await waitFor(() => {
      expect(screen.getByText('Beatriz Souza')).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Ações para Beatriz Souza' }));
    const revokeBtn = screen.getByRole('button', { name: 'Revogar' });
    fireEvent.click(revokeBtn);
    fireEvent.click(revokeBtn);

    expect(
      fetchMock.mock.calls.filter(([url]) => String(url).includes('/revogar'))
    ).toHaveLength(1);

    resolveRevoke(jsonResponse({ ...SAMPLE_LICENSES[0], status: 'REVOGADA' }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Ações para Beatriz Souza' })).toBeEnabled();
    });

    await user.click(screen.getByRole('button', { name: 'Ações para Beatriz Souza' }));
    const reactivateBtn = screen.getByRole('button', { name: 'Reativar' });
    fireEvent.click(reactivateBtn);
    fireEvent.click(reactivateBtn);

    expect(
      fetchMock.mock.calls.filter(([url]) => String(url).includes('/reativar'))
    ).toHaveLength(1);

    resolveReactivate(jsonResponse({ ...SAMPLE_LICENSES[0], status: 'ATIVADA' }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Ações para Camila Lima' })).toBeEnabled();
    });

    await user.click(screen.getByRole('button', { name: 'Ações para Camila Lima' }));
    const resendBtn = screen.getByRole('button', { name: 'Reenviar Convite' });
    fireEvent.click(resendBtn);
    fireEvent.click(resendBtn);

    expect(
      fetchMock.mock.calls.filter(([url]) => String(url).includes('/reenviar'))
    ).toHaveLength(1);

    resolveResend(jsonResponse(SAMPLE_LICENSES[1]));
    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        'Convite reenviado para camila@techmaes.com.br'
      );
    });
  });

  it('handles navigator.clipboard.writeText rejection gracefully without unhandled rejection', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse({ id: 'emp-1', nome: 'TechMães Brasil S.A.' }))
      .mockResolvedValueOnce(jsonResponse(SAMPLE_LICENSES))
      .mockResolvedValueOnce(jsonResponse(SAMPLE_REPORT));

    const writeSpy = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockRejectedValueOnce(new Error('Clipboard denied'));

    render(<LicensesScreen />);
    await waitFor(() => {
      expect(screen.getByText('Camila Lima')).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Ações para Camila Lima' }));
    await user.click(screen.getByRole('button', { name: 'Copiar Link' }));

    expect(writeSpy).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        'Não foi possível copiar o link de ativação.'
      );
    });
    expect(screen.getByRole('status')).not.toHaveTextContent('Link de ativação copiado!');
  });

  it('renders 401 re-login CTA in standalone mode when onLogout is supplied', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      jsonResponse({ status: 401, message: 'Sessão expirada.' }, 401)
    );
    const onLogout = vi.fn();

    render(<LicensesScreen onLogout={onLogout} />);

    await waitFor(() => {
      expect(screen.getByTestId('licenses-error')).toHaveTextContent('Sessão expirada.');
    });

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Fazer login novamente/i }));
    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});
