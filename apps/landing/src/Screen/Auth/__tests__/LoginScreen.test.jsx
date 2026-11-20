import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginScreen from '../LoginScreen';
import { navigateToApp } from '../../../utils/appLinks';

vi.mock('../../../utils/appLinks', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getApiBase: () => 'http://localhost:8080',
    navigateToApp: vi.fn(),
  };
});

function mockGoogleConfigFetch() {
  return {
    ok: true,
    json: async () => ({ enabled: false, clientId: '' }),
  };
}

function renderLogin(props = {}, initialRoute = '/login') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <LoginScreen {...props} />
    </MemoryRouter>
  );
}

describe('LoginScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    globalThis.fetch = vi.fn().mockImplementation(async (url) => {
      if (String(url).includes('/api/auth/oauth/google/config')) {
        return mockGoogleConfigFetch();
      }
      return { ok: false, json: async () => ({}) };
    });
  });

  it('fetches runtime Google OAuth config when VITE_GOOGLE_CLIENT_ID is unset', async () => {
    renderLogin();

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/auth/oauth/google/config'
      );
    });
  });

  it('stores RH session under floravel_rh_sessao and navigates to rh app on login', async () => {
    const user = userEvent.setup();
    const rhAuthData = {
      usuarioId: 'usr-rh-1',
      perfilId: 'usr-rh-1',
      codigoPublico: 'FLR-RH01',
      nome: 'Gestora RH',
      email: 'rh@empresa.com',
      tipoPerfil: 'RH',
      tokenSessao: 'jwt-rh-token',
    };

    globalThis.fetch.mockImplementation(async (url) => {
      if (String(url).includes('/api/auth/oauth/google/config')) {
        return mockGoogleConfigFetch();
      }
      if (String(url).includes('/api/auth/login')) {
        return { ok: true, json: async () => rhAuthData };
      }
      return { ok: false, json: async () => ({}) };
    });

    renderLogin();

    await user.click(screen.getByRole('button', { name: /Gestão RH/i }));
    await user.type(screen.getByLabelText(/^E-mail$/i), 'rh@empresa.com');
    await user.type(screen.getByLabelText(/^Senha$/i), 'senhaRh123');
    await user.click(screen.getByRole('button', { name: /Entrar como Gestão RH/i }));

    await waitFor(() => {
      expect(navigateToApp).toHaveBeenCalledWith('rh', rhAuthData);
    });
    expect(localStorage.getItem('floravel_rh_sessao')).toBe(JSON.stringify(rhAuthData));
    expect(localStorage.getItem('floravel_mae_sessao')).toBeNull();
    expect(localStorage.getItem('floravel_jwt')).toBe('jwt-rh-token');
  });

  it('resolves destination app and storage key from server tipoPerfil even from default tab', async () => {
    const user = userEvent.setup();
    const rhAuthData = {
      usuarioId: 'usr-rh-2',
      nome: 'RH Server',
      email: 'rh2@empresa.com',
      tipoPerfil: 'RH',
      tokenSessao: 'jwt-rh-server',
    };

    globalThis.fetch.mockImplementation(async (url) => {
      if (String(url).includes('/api/auth/oauth/google/config')) {
        return mockGoogleConfigFetch();
      }
      if (String(url).includes('/api/auth/login')) {
        return { ok: true, json: async () => rhAuthData };
      }
      return { ok: false, json: async () => ({}) };
    });

    renderLogin();

    await user.type(screen.getByLabelText(/^E-mail$/i), 'rh2@empresa.com');
    await user.type(screen.getByLabelText(/^Senha$/i), 'senha123');
    await user.click(screen.getByRole('button', { name: /Entrar como Sou Mãe/i }));

    await waitFor(() => {
      expect(navigateToApp).toHaveBeenCalledWith('rh', rhAuthData);
    });
    expect(localStorage.getItem('floravel_rh_sessao')).toBe(JSON.stringify(rhAuthData));
    expect(localStorage.getItem('floravel_mae_sessao')).toBeNull();
  });

  it('opens real password recovery modal, resets password, and prefills login email', async () => {
    const user = userEvent.setup();
    globalThis.fetch.mockImplementation(async (url) => {
      if (String(url).includes('/api/auth/oauth/google/config')) {
        return mockGoogleConfigFetch();
      }
      if (String(url).includes('/api/auth/esqueci-senha')) {
        return {
          ok: true,
          json: async () => ({
            mensagem: 'Se cadastrado, enviaremos o código.',
            email: 'recuperar@floravel.com',
            expiracaoMinutos: 15,
          }),
        };
      }
      if (String(url).includes('/api/auth/redefinir-senha')) {
        return {
          ok: true,
          json: async () => ({
            redefinida: true,
            mensagem: 'Senha redefinida!',
            email: 'recuperar@floravel.com',
          }),
        };
      }
      return { ok: false, json: async () => ({}) };
    });

    renderLogin();

    await user.click(screen.getByRole('button', { name: /Esqueceu a senha\?/i }));
    await user.type(screen.getByLabelText(/Seu E-mail/i), 'recuperar@floravel.com');
    await user.click(screen.getByRole('button', { name: /Enviar código de recuperação/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Redefinir senha/i })).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/Código de 6 dígitos/i), '123456');
    await user.type(screen.getByLabelText(/^Nova senha$/i), 'novaSenha123');
    await user.type(screen.getByLabelText(/Confirmar nova senha/i), 'novaSenha123');
    await user.click(screen.getByRole('button', { name: /Redefinir senha/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Senha redefinida com sucesso/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Ir para o Login/i }));

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /Senha redefinida com sucesso/i })).not.toBeInTheDocument();
    });
    expect(screen.getByLabelText(/^E-mail$/i)).toHaveValue('recuperar@floravel.com');
  });

  it('transitions post-cadastro to EmailConfirmationFlow modal and exchanges JWT before navigating to mae app', async () => {
    const user = userEvent.setup();
    const maeCriada = {
      id: 'mae-1',
      usuarioId: 'usr-mae-1',
      nome: 'Helena Costa',
      email: 'helena@floravel.com',
      tipoPerfil: 'MAE',
      emailVerificado: false,
    };
    const loginData = {
      usuarioId: 'usr-mae-1',
      perfilId: 'mae-1',
      codigoPublico: 'FLR-MAE1',
      nome: 'Helena Costa',
      email: 'helena@floravel.com',
      tipoPerfil: 'MAE',
      emailVerificado: true,
      tokenSessao: 'jwt-mae-confirmada',
    };

    globalThis.fetch.mockImplementation(async (url) => {
      if (String(url).includes('/api/auth/oauth/google/config')) {
        return mockGoogleConfigFetch();
      }
      if (String(url).endsWith('/api/maes')) {
        return { ok: true, status: 201, json: async () => maeCriada };
      }
      if (String(url).endsWith('/api/auth/confirmar-email')) {
        return {
          ok: true,
          json: async () => ({ verificado: true, mensagem: 'Confirmado!', email: 'helena@floravel.com' }),
        };
      }
      if (String(url).endsWith('/api/auth/login')) {
        return { ok: true, json: async () => loginData };
      }
      return { ok: false, json: async () => ({}) };
    });

    renderLogin({ initialMode: 'cadastro' }, '/cadastro');

    await user.type(screen.getByLabelText(/Nome completo/i), 'Helena Costa');
    await user.type(screen.getByLabelText(/^E-mail/i), 'helena@floravel.com');
    await user.type(screen.getByLabelText(/Senha segura/i), 'senhaSegura123');
    await user.click(screen.getByRole('button', { name: /Criar conta \(Sou Mãe\)/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Confirme seu e-mail/i })).toBeInTheDocument();
    });
    expect(navigateToApp).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText(/Código de confirmação/i), '456789');
    await user.click(screen.getByRole('button', { name: /Confirmar e-mail/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /E-mail confirmado! Boas-vindas à Florável/i })
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Entrar no Espaço Florável/i }));

    expect(localStorage.getItem('floravel_mae_sessao')).toBe(JSON.stringify(loginData));
    expect(localStorage.getItem('floravel_jwt')).toBe('jwt-mae-confirmada');
    expect(navigateToApp).toHaveBeenCalledWith('mae', loginData);
  });

  it.each([401, 500])(
    'degrades post-cadastro auto-login %i safely to login form without saving tokenless session',
    async (loginStatus) => {
      const user = userEvent.setup();
      const maeCriada = {
        id: 'mae-2',
        usuarioId: 'usr-mae-2',
        nome: 'Helena Costa',
        email: 'helena@floravel.com',
        tipoPerfil: 'MAE',
        emailVerificado: false,
      };

      globalThis.fetch.mockImplementation(async (url) => {
        if (String(url).includes('/api/auth/oauth/google/config')) {
          return mockGoogleConfigFetch();
        }
        if (String(url).endsWith('/api/maes')) {
          return { ok: true, status: 201, json: async () => maeCriada };
        }
        if (String(url).endsWith('/api/auth/confirmar-email')) {
          return {
            ok: true,
            json: async () => ({ verificado: true, mensagem: 'Confirmado!', email: 'helena@floravel.com' }),
          };
        }
        if (String(url).endsWith('/api/auth/login')) {
          return { ok: false, status: loginStatus, json: async () => ({ message: 'Falha no login' }) };
        }
        return { ok: false, json: async () => ({}) };
      });

      renderLogin({ initialMode: 'cadastro' }, '/cadastro');

      await user.type(screen.getByLabelText(/Nome completo/i), 'Helena Costa');
      await user.type(screen.getByLabelText(/^E-mail/i), 'helena@floravel.com');
      await user.type(screen.getByLabelText(/Senha segura/i), 'senhaSegura123');
      await user.click(screen.getByRole('button', { name: /Criar conta \(Sou Mãe\)/i }));

      const dialog = await screen.findByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');

      await user.type(screen.getByLabelText(/Código de confirmação/i), '456789');
      await user.click(screen.getByRole('button', { name: /Confirmar e-mail/i }));

      expect(await screen.findByRole('status')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Entrar no Espaço Florável/i })).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /Ir para o Login/i }));

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
      expect(screen.getByRole('button', { name: /Entrar como Sou Mãe/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/^E-mail$/i)).toHaveValue('helena@floravel.com');
      expect(navigateToApp).not.toHaveBeenCalled();
      expect(localStorage.getItem('floravel_jwt')).toBeNull();
      expect(localStorage.getItem('floravel_mae_sessao')).toBeNull();
    }
  );

  it('prevents synchronous double-submit on login and cadastro forms', async () => {
    let resolveLogin;
    let resolveCadastro;
    globalThis.fetch.mockImplementation((url) => {
      if (String(url).includes('/api/auth/oauth/google/config')) {
        return Promise.resolve(mockGoogleConfigFetch());
      }
      if (String(url).endsWith('/api/auth/login')) {
        return new Promise((resolve) => {
          resolveLogin = resolve;
        });
      }
      if (String(url).endsWith('/api/maes')) {
        return new Promise((resolve) => {
          resolveCadastro = resolve;
        });
      }
      return Promise.resolve({ ok: false, json: async () => ({}) });
    });

    const { unmount } = renderLogin();
    fireEvent.change(screen.getByLabelText(/^E-mail$/i), { target: { value: 'mae@floravel.com' } });
    fireEvent.change(screen.getByLabelText(/^Senha$/i), { target: { value: 'senha123' } });

    const loginForm = screen.getByRole('button', { name: /Entrar como Sou Mãe/i }).closest('form');
    fireEvent.submit(loginForm);
    fireEvent.submit(loginForm);

    const loginCalls = globalThis.fetch.mock.calls.filter(([url]) =>
      String(url).endsWith('/api/auth/login')
    );
    expect(loginCalls).toHaveLength(1);

    resolveLogin({
      ok: false,
      status: 422,
      json: async () => ({ message: 'Credenciais inválidas' }),
    });
    expect(await screen.findByRole('alert')).toHaveTextContent('Credenciais inválidas');
    unmount();

    renderLogin({ initialMode: 'cadastro' }, '/cadastro');
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { value: 'Helena Costa' } });
    fireEvent.change(screen.getByLabelText(/^E-mail/i), { target: { value: 'helena@floravel.com' } });
    fireEvent.change(screen.getByLabelText(/Senha segura/i), { target: { value: 'senhaSegura123' } });

    const cadastroForm = screen.getByRole('button', { name: /Criar conta \(Sou Mãe\)/i }).closest('form');
    fireEvent.submit(cadastroForm);
    fireEvent.submit(cadastroForm);

    const cadastroCalls = globalThis.fetch.mock.calls.filter(([url]) =>
      String(url).endsWith('/api/maes')
    );
    expect(cadastroCalls).toHaveLength(1);

    resolveCadastro({
      ok: true,
      status: 201,
      json: async () => ({ email: 'helena@floravel.com', nome: 'Helena Costa' }),
    });
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('exposes role=dialog aria-modal=true on forgot password modal and closes on Escape', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: /Esqueceu a senha\?/i }));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
