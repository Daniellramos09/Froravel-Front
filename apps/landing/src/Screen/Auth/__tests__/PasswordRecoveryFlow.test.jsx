import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import PasswordRecoveryFlow from '../PasswordRecoveryFlow';

vi.mock('../../../utils/appLinks', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getApiBase: () => 'http://localhost:8080',
    navigateToApp: vi.fn(),
  };
});

function renderFlow(props = {}) {
  return render(
    <MemoryRouter>
      <PasswordRecoveryFlow {...props} />
    </MemoryRouter>
  );
}

describe('PasswordRecoveryFlow', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  it('submits trimmed lowercase email, shows loading state, and transitions to reset step', async () => {
    const user = userEvent.setup();
    let resolveFetch;
    globalThis.fetch.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    renderFlow();

    await user.type(screen.getByLabelText(/Seu E-mail/i), '  ANA.Silva@Email.COM ');
    const submitBtn = screen.getByRole('button', { name: /Enviar código de recuperação/i });
    await user.click(submitBtn);

    expect(screen.getByRole('button', { name: /Enviando código/i })).toBeDisabled();
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/auth/esqueci-senha',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'ana.silva@email.com' }),
      })
    );

    resolveFetch({
      ok: true,
      json: async () => ({
        mensagem: 'Código enviado para o e-mail informado.',
        email: 'ana.silva@email.com',
        expiracaoMinutos: 15,
      }),
    });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Redefinir senha/i })).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/E-mail cadastrado/i)).toHaveValue('ana.silva@email.com');
  });

  it('displays alert and stays on request step when server or network fails', async () => {
    const user = userEvent.setup();
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Serviço temporariamente indisponível.' }),
    });

    renderFlow();

    await user.type(screen.getByLabelText(/Seu E-mail/i), 'ana@floravel.com');
    await user.click(screen.getByRole('button', { name: /Enviar código de recuperação/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Serviço temporariamente indisponível.'
    );
    expect(screen.getByRole('heading', { name: /Esqueceu sua senha/i })).toBeInTheDocument();

    globalThis.fetch.mockRejectedValueOnce(new Error('Network error'));
    await user.click(screen.getByRole('button', { name: /Enviar código de recuperação/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /Não foi possível conectar ao servidor/i
    );
  });

  it('validates 6-digit code, password length, and password confirmation before calling fetch', async () => {
    const user = userEvent.setup();
    renderFlow({ initialStep: 'reset', initialEmail: 'ana@floravel.com' });

    await user.type(screen.getByLabelText(/Código de 6 dígitos/i), '123');
    await user.type(screen.getByLabelText(/^Nova senha$/i), '123456');
    await user.type(screen.getByLabelText(/Confirmar nova senha/i), '123456');
    await user.click(screen.getByRole('button', { name: /Redefinir senha/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/6 dígitos/i);
    expect(globalThis.fetch).not.toHaveBeenCalled();

    await user.clear(screen.getByLabelText(/Código de 6 dígitos/i));
    await user.type(screen.getByLabelText(/Código de 6 dígitos/i), '123456');
    await user.clear(screen.getByLabelText(/^Nova senha$/i));
    await user.type(screen.getByLabelText(/^Nova senha$/i), '123');
    await user.clear(screen.getByLabelText(/Confirmar nova senha/i));
    await user.type(screen.getByLabelText(/Confirmar nova senha/i), '123');
    await user.click(screen.getByRole('button', { name: /Redefinir senha/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/mínimo 6 caracteres/i);
    expect(globalThis.fetch).not.toHaveBeenCalled();

    await user.clear(screen.getByLabelText(/^Nova senha$/i));
    await user.type(screen.getByLabelText(/^Nova senha$/i), 'senha123');
    await user.clear(screen.getByLabelText(/Confirmar nova senha/i));
    await user.type(screen.getByLabelText(/Confirmar nova senha/i), 'outra123');
    await user.click(screen.getByRole('button', { name: /Redefinir senha/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/não conferem/i);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('submits reset request successfully and calls onSuccessLogin on CTA click', async () => {
    const user = userEvent.setup();
    const onSuccessLogin = vi.fn();
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        redefinida: true,
        mensagem: 'Senha redefinida com sucesso!',
        email: 'ana@floravel.com',
      }),
    });

    renderFlow({
      initialStep: 'reset',
      initialEmail: 'ana@floravel.com',
      onSuccessLogin,
    });

    await user.type(screen.getByLabelText(/Código de 6 dígitos/i), '654321');
    await user.type(screen.getByLabelText(/^Nova senha$/i), 'novaSenha123');
    await user.type(screen.getByLabelText(/Confirmar nova senha/i), 'novaSenha123');
    await user.click(screen.getByRole('button', { name: /Redefinir senha/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Senha redefinida com sucesso/i })).toBeInTheDocument();
    });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/auth/redefinir-senha',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'ana@floravel.com',
          codigo: '654321',
          novaSenha: 'novaSenha123',
        }),
      })
    );

    await user.click(screen.getByRole('button', { name: /Ir para o Login/i }));
    expect(onSuccessLogin).toHaveBeenCalledWith('ana@floravel.com');
  });

  it('displays backend error message for expired or invalid reset code (400)', async () => {
    const user = userEvent.setup();
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        status: 400,
        error: 'Código Expirado',
        message: 'Este código de recuperação expirou. Solicite um novo código.',
      }),
    });

    renderFlow({ initialStep: 'reset', initialEmail: 'ana@floravel.com' });

    await user.type(screen.getByLabelText(/Código de 6 dígitos/i), '123456');
    await user.type(screen.getByLabelText(/^Nova senha$/i), 'novaSenha123');
    await user.type(screen.getByLabelText(/Confirmar nova senha/i), 'novaSenha123');
    await user.click(screen.getByRole('button', { name: /Redefinir senha/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Este código de recuperação expirou. Solicite um novo código.'
    );
    expect(screen.getByRole('heading', { name: /Redefinir senha/i })).toBeInTheDocument();
  });

  it('triggers POST /api/auth/esqueci-senha when clicking Reenviar código', async () => {
    const user = userEvent.setup();
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        mensagem: 'Novo código enviado.',
        email: 'ana@floravel.com',
        expiracaoMinutos: 15,
      }),
    });

    renderFlow({ initialStep: 'reset', initialEmail: 'ana@floravel.com' });

    await user.click(screen.getByRole('button', { name: /Reenviar código/i }));

    expect(await screen.findByText('Novo código enviado.')).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/auth/esqueci-senha',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'ana@floravel.com' }),
      })
    );
  });

  it('prevents synchronous double-submit on request, reset, and resend via useRef in-flight lock', async () => {
    // 1. Request step double-submit
    let resolveReq;
    globalThis.fetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveReq = resolve;
        })
    );
    const { unmount: unmountReq } = renderFlow();
    fireEvent.change(screen.getByLabelText(/Seu E-mail/i), { target: { value: 'ana@floravel.com' } });
    const reqForm = screen.getByRole('button', { name: /Enviar código de recuperação/i }).closest('form');
    fireEvent.submit(reqForm);
    fireEvent.submit(reqForm);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    resolveReq({
      ok: true,
      json: async () => ({ mensagem: 'Código enviado!', email: 'ana@floravel.com' }),
    });
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Redefinir senha/i })).toBeInTheDocument();
    });
    unmountReq();

    // 2. Reset step double-submit
    globalThis.fetch.mockReset();
    let resolveReset;
    globalThis.fetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveReset = resolve;
        })
    );
    const { unmount: unmountReset } = renderFlow({ initialStep: 'reset', initialEmail: 'ana@floravel.com' });
    fireEvent.change(screen.getByLabelText(/Código de 6 dígitos/i), { target: { value: '654321' } });
    fireEvent.change(screen.getByLabelText(/^Nova senha$/i), { target: { value: 'novaSenha123' } });
    fireEvent.change(screen.getByLabelText(/Confirmar nova senha/i), { target: { value: 'novaSenha123' } });
    const resetForm = screen.getByRole('button', { name: /Redefinir senha/i }).closest('form');
    fireEvent.submit(resetForm);
    fireEvent.submit(resetForm);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    resolveReset({
      ok: true,
      json: async () => ({ redefinida: true, email: 'ana@floravel.com' }),
    });
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Senha redefinida com sucesso/i })).toBeInTheDocument();
    });
    unmountReset();

    // 3. Reset step double-resend
    globalThis.fetch.mockReset();
    let resolveResend;
    globalThis.fetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveResend = resolve;
        })
    );
    renderFlow({ initialStep: 'reset', initialEmail: 'ana@floravel.com' });
    const resendBtn = screen.getByRole('button', { name: /Reenviar código/i });
    fireEvent.click(resendBtn);
    fireEvent.click(resendBtn);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    resolveResend({
      ok: true,
      json: async () => ({ mensagem: 'Reenviado com sucesso!' }),
    });
    expect(await screen.findByText('Reenviado com sucesso!')).toBeInTheDocument();
  });

  it('prioritizes validationErrors field message over generic 400 message on reset submit', async () => {
    const user = userEvent.setup();
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        status: 400,
        message: 'Falha de validação nos campos informados',
        validationErrors: {
          novaSenha: 'A nova senha deve conter entre 6 e 72 caracteres.',
        },
      }),
    });

    renderFlow({ initialStep: 'reset', initialEmail: 'ana@floravel.com' });
    await user.type(screen.getByLabelText(/Código de 6 dígitos/i), '123456');
    await user.type(screen.getByLabelText(/^Nova senha$/i), 'novaSenha123');
    await user.type(screen.getByLabelText(/Confirmar nova senha/i), 'novaSenha123');
    await user.click(screen.getByRole('button', { name: /Redefinir senha/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'A nova senha deve conter entre 6 e 72 caracteres.'
    );
  });

  it('enforces maxLength=72 on password inputs and clears stale infoMessage when toggling steps', async () => {
    const user = userEvent.setup();
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        mensagem: 'Código temporário enviado para seu e-mail.',
        email: 'ana@floravel.com',
      }),
    });

    renderFlow();

    await user.type(screen.getByLabelText(/Seu E-mail/i), 'ana@floravel.com');
    await user.click(screen.getByRole('button', { name: /Enviar código de recuperação/i }));

    expect(await screen.findByText('Código temporário enviado para seu e-mail.')).toBeInTheDocument();
    expect(screen.getByLabelText(/^Nova senha$/i)).toHaveAttribute('maxLength', '72');
    expect(screen.getByLabelText(/Confirmar nova senha/i)).toHaveAttribute('maxLength', '72');

    await user.click(screen.getByRole('button', { name: /Alterar e-mail/i }));
    await user.click(screen.getByRole('button', { name: /Já tenho o código de 6 dígitos/i }));

    expect(screen.queryByText('Código temporário enviado para seu e-mail.')).not.toBeInTheDocument();
  });
});
