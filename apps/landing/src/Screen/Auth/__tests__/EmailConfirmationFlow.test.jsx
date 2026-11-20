import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import EmailConfirmationFlow from '../EmailConfirmationFlow';
import { navigateToApp } from '../../../utils/appLinks';

vi.mock('../../../utils/appLinks', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getApiBase: () => 'http://localhost:8080',
    navigateToApp: vi.fn(),
  };
});

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location-probe">{location.pathname + location.search}</div>;
}

function renderFlow(props = {}, initialRoute = '/confirmar-email') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <LocationProbe />
      <EmailConfirmationFlow {...props} />
    </MemoryRouter>
  );
}

describe('EmailConfirmationFlow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    globalThis.fetch = vi.fn();
  });

  it('rejects non-6-digit code client-side before calling fetch', async () => {
    const user = userEvent.setup();
    renderFlow({ initialEmail: 'mariana@floravel.com' });

    await user.type(screen.getByLabelText(/Código de confirmação/i), '123');
    await user.click(screen.getByRole('button', { name: /Confirmar e-mail/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/6 dígitos/i);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('confirms email and renders welcome screen on 200 OK', async () => {
    const user = userEvent.setup();
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        verificado: true,
        mensagem: 'E-mail confirmado com sucesso!',
        email: 'mariana@floravel.com',
      }),
    });

    renderFlow({ initialEmail: 'mariana@floravel.com', nome: 'Mariana' });

    await user.type(screen.getByLabelText(/Código de confirmação/i), '987654');
    await user.click(screen.getByRole('button', { name: /Confirmar e-mail/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /E-mail confirmado! Boas-vindas à Florável/i })
      ).toBeInTheDocument();
    });
    expect(screen.getByText(/Que alegria ter você aqui, Mariana!/i)).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/auth/confirmar-email',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'mariana@floravel.com', codigo: '987654' }),
      })
    );
  });

  it('displays backend error message when code is invalid or expired (400)', async () => {
    const user = userEvent.setup();
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        status: 400,
        error: 'Código Inválido',
        message: 'Código de confirmação incorreto ou já utilizado.',
      }),
    });

    renderFlow({ initialEmail: 'mariana@floravel.com' });

    await user.type(screen.getByLabelText(/Código de confirmação/i), '000000');
    await user.click(screen.getByRole('button', { name: /Confirmar e-mail/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Código de confirmação incorreto ou já utilizado.'
    );
  });

  it('handles resend code success and error states', async () => {
    const user = userEvent.setup();
    globalThis.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          verificado: false,
          mensagem: 'Novo código de confirmação enviado.',
          email: 'mariana@floravel.com',
        }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: async () => ({
          message: 'Usuário não cadastrado na plataforma.',
        }),
      });

    renderFlow({ initialEmail: 'mariana@floravel.com' });

    await user.click(screen.getByRole('button', { name: /Reenviar código/i }));
    expect(await screen.findByText('Novo código de confirmação enviado.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Reenviar código/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Usuário não cadastrado na plataforma.'
    );
  });

  it('degrades fail-closed to Ir para o Login when post-cadastro auto-login returns 401 and dismisses modal cleanly', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onGoToLogin = vi.fn();
    const onEnterMaeApp = vi.fn();

    globalThis.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          verificado: true,
          mensagem: 'E-mail confirmado!',
          email: 'helena@floravel.com',
        }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Credenciais inválidas' }),
      });

    renderFlow(
      {
        isModal: true,
        initialEmail: 'helena@floravel.com',
        nome: 'Helena',
        pendingAuthCredentials: { email: 'helena@floravel.com', senha: 'senhaSegura123' },
        onClose,
        onGoToLogin,
        onEnterMaeApp,
      },
      '/login'
    );

    await user.type(screen.getByLabelText(/Código de confirmação/i), '123456');
    await user.click(screen.getByRole('button', { name: /Confirmar e-mail/i }));

    const statusNotice = await screen.findByRole('status');
    expect(statusNotice).toHaveTextContent(/não foi possível iniciar sua sessão automaticamente/i);
    expect(screen.queryByRole('button', { name: /Entrar no Espaço Florável/i })).not.toBeInTheDocument();

    const goToLoginBtn = screen.getByRole('button', { name: /Ir para o Login/i });
    await user.click(goToLoginBtn);

    expect(onEnterMaeApp).not.toHaveBeenCalled();
    expect(navigateToApp).not.toHaveBeenCalled();
    expect(localStorage.getItem('floravel_jwt')).toBeNull();
    expect(localStorage.getItem('floravel_mae_sessao')).toBeNull();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onGoToLogin).toHaveBeenCalledWith('helena@floravel.com');
    expect(screen.getByTestId('location-probe')).toHaveTextContent('/login?email=helena%40floravel.com');
  });

  it.each([
    { label: '500 error', loginRes: { ok: false, status: 500, json: async () => ({ message: 'Erro interno' }) } },
    { label: '200 without tokenSessao', loginRes: { ok: true, status: 200, json: async () => ({ email: 'helena@floravel.com' }) } },
  ])('degrades fail-closed to Ir para o Login when auto-login returns $label', async ({ loginRes }) => {
    const user = userEvent.setup();
    const onEnterMaeApp = vi.fn();

    globalThis.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ verificado: true, email: 'helena@floravel.com' }),
      })
      .mockResolvedValueOnce(loginRes);

    renderFlow({
      isModal: true,
      initialEmail: 'helena@floravel.com',
      pendingAuthCredentials: { email: 'helena@floravel.com', senha: 'senhaSegura123' },
      onClose: vi.fn(),
      onGoToLogin: vi.fn(),
      onEnterMaeApp,
    });

    await user.type(screen.getByLabelText(/Código de confirmação/i), '654321');
    await user.click(screen.getByRole('button', { name: /Confirmar e-mail/i }));

    expect(await screen.findByRole('status')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Entrar no Espaço Florável/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Ir para o Login/i }));
    expect(onEnterMaeApp).not.toHaveBeenCalled();
    expect(navigateToApp).not.toHaveBeenCalled();
    expect(localStorage.getItem('floravel_jwt')).toBeNull();
    expect(localStorage.getItem('floravel_mae_sessao')).toBeNull();
  });

  it('prevents synchronous double-submit and double-resend via useRef in-flight lock', async () => {
    let resolveConfirm;
    globalThis.fetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveConfirm = resolve;
        })
    );

    const { unmount } = renderFlow({ initialEmail: 'ana@floravel.com' });
    fireEvent.change(screen.getByLabelText(/Código de confirmação/i), { target: { value: '123456' } });

    const form = screen.getByRole('button', { name: /Confirmar e-mail/i }).closest('form');
    fireEvent.submit(form);
    fireEvent.submit(form);

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    resolveConfirm({
      ok: true,
      json: async () => ({ verificado: true, email: 'ana@floravel.com' }),
    });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /E-mail confirmado! Boas-vindas à Florável/i })
      ).toBeInTheDocument();
    });
    unmount();

    globalThis.fetch.mockReset();
    let resolveResend;
    globalThis.fetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveResend = resolve;
        })
    );

    renderFlow({ initialEmail: 'ana@floravel.com' });
    const resendBtn = screen.getByRole('button', { name: /Reenviar código/i });
    fireEvent.click(resendBtn);
    fireEvent.click(resendBtn);

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    resolveResend({
      ok: true,
      json: async () => ({ verificado: false, mensagem: 'Código reenviado!' }),
    });
    expect(await screen.findByText('Código reenviado!')).toBeInTheDocument();
  });

  it('prioritizes validationErrors field message over generic 400 message', async () => {
    const user = userEvent.setup();
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        status: 400,
        message: 'Falha de validação nos campos informados',
        validationErrors: {
          codigo: 'O código deve conter exatamente 6 dígitos numéricos.',
        },
      }),
    });

    renderFlow({ initialEmail: 'mariana@floravel.com' });
    await user.type(screen.getByLabelText(/Código de confirmação/i), '123456');
    await user.click(screen.getByRole('button', { name: /Confirmar e-mail/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'O código deve conter exatamente 6 dígitos numéricos.'
    );
  });
});
