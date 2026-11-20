import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import DashboardRh from '../DashboardRh';
import { JWT_KEY, PUBLIC_CODE_KEY, SESSION_KEY } from '../utils/rhSession';

const MOCK_COMPANY = {
  id: 'emp-1',
  nome: 'TechMães Brasil S.A.',
  cnpj: '12.345.678/0001-90',
  status: 'ATIVA',
  dataCadastro: '2026-10-01 10:00:00',
};

const MOCK_REPORT = {
  empresaId: 'emp-1',
  parametroKMinimo: 5,
  totalLicencasEmitidas: 10,
  totalLicencasAtivadas: 8,
  taxaAdesaoPercentual: 80.0,
  setoresElegiveis: [
    { nomeSetor: 'Engenharia', colaboradorasAtivas: 6, agrupadoPorKAnonimato: false },
  ],
  indiceGeralAgrupadoKAnonimato: {
    nomeSetor: 'Índice Geral da Empresa (Setores Agrupados por K-Anonimato < 5)',
    colaboradorasAtivas: 2,
    agrupadoPorKAnonimato: true,
  },
  diretrizCompliance:
    'Muralha de Fogo & K-Anonimato (K >= 5): Nenhum dado clínico, nota de Edimburgo ou agendamento individual é acessível ao RH.',
};

const MOCK_LICENSES = [
  {
    id: 'lic-1',
    empresaId: 'emp-1',
    nomeColaboradora: 'Colaboradora 1',
    emailCorporativo: 'c1@techmaes.com.br',
    departamento: 'Engenharia',
    status: 'ATIVADA',
    tokenConvite: 'FLR-B2B-1',
    dataConvite: '2026-10-02 09:00:00',
  },
  {
    id: 'lic-2',
    empresaId: 'emp-1',
    nomeColaboradora: 'Colaboradora 2',
    emailCorporativo: 'c2@techmaes.com.br',
    departamento: 'Design',
    status: 'PENDENTE',
    tokenConvite: 'FLR-B2B-2',
    dataConvite: '2026-10-03 09:00:00',
  },
];

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function encodeAuthHash(obj) {
  const bytes = new TextEncoder().encode(JSON.stringify(obj));
  const b64 = btoa(String.fromCharCode(...bytes));
  return `#auth=${encodeURIComponent(b64)}`;
}

describe('App & DashboardRh live integration', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('blocks access with Auth Guard when JWT is absent or role is not RH', () => {
    const { unmount } = render(<App />);
    expect(screen.getByTestId('rh-auth-guard')).toHaveTextContent('Sessão corporativa necessária');
    unmount();

    localStorage.setItem(JWT_KEY, 'jwt-mae');
    localStorage.setItem(SESSION_KEY, JSON.stringify({ tipoPerfil: 'MAE', nome: 'Mariana' }));
    render(<App />);
    expect(screen.getByTestId('rh-auth-guard')).toHaveTextContent('Acesso restrito ao perfil Gestão RH');
  });

  it('shows loading state, renders live company/K-anonymity data without TechCorp mocks, and supports logout', async () => {
    localStorage.setItem(JWT_KEY, 'jwt-rh');
    localStorage.setItem(PUBLIC_CODE_KEY, 'FLR-RH01');
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        nome: 'Gestão RH TechMães',
        email: 'rh@techmaes.com.br',
        tipoPerfil: 'RH',
      })
    );

    let resolveEmpresa;
    const empresaPromise = new Promise((resolve) => {
      resolveEmpresa = resolve;
    });

    vi.spyOn(globalThis, 'fetch').mockImplementation((url) => {
      if (String(url).endsWith('/api/rh/empresas/atual')) return empresaPromise;
      if (String(url).includes('/relatorio-k-anonimato')) return Promise.resolve(jsonResponse(MOCK_REPORT));
      if (String(url).endsWith('/licencas')) return Promise.resolve(jsonResponse(MOCK_LICENSES));
      return Promise.resolve(jsonResponse({}, 404));
    });

    render(<App />);
    expect(screen.getByTestId('dashboard-loading')).toBeInTheDocument();

    resolveEmpresa(jsonResponse(MOCK_COMPANY));

    await waitFor(() => {
      expect(screen.getByText(/Olá, TechMães Brasil S\.A\.!/)).toBeInTheDocument();
    });

    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('Gestão RH TechMães')).toBeInTheDocument();
    expect(screen.getByText('rh@techmaes.com.br')).toBeInTheDocument();
    expect(screen.getByText(/Muralha de Fogo LGPD & Telemetria Clínica Protegida/)).toBeInTheDocument();
    expect(document.body.textContent).not.toContain('TechCorp');
    expect(document.body.textContent).not.toContain('42 / 50');

    // Navigate to billing safe fallback
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Faturamento/i }));
    expect(screen.getByText('Integração de Faturamento Indisponível')).toBeInTheDocument();

    // Logout clears session keys
    await user.click(screen.getByRole('button', { name: 'Sair do painel RH' }));
    expect(localStorage.getItem(JWT_KEY)).toBeNull();
    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
    expect(localStorage.getItem(PUBLIC_CODE_KEY)).toBeNull();
  });

  it('renders error banner on 500/401/network failure and recovers on retry', async () => {
    localStorage.setItem(JWT_KEY, 'jwt-rh');
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ nome: 'RH TechMães', email: 'rh@techmaes.com.br', tipoPerfil: 'RH' })
    );

    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse({ status: 500, message: 'Erro interno no servidor.' }, 500))
      .mockResolvedValueOnce(jsonResponse(MOCK_COMPANY))
      .mockResolvedValueOnce(jsonResponse(MOCK_REPORT))
      .mockResolvedValueOnce(jsonResponse(MOCK_LICENSES));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-error')).toBeInTheDocument();
    });
    expect(screen.getByTestId('dashboard-error')).toHaveTextContent('Erro interno no servidor.');

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Tentar novamente/i }));

    await waitFor(() => {
      expect(screen.getByText(/Olá, TechMães Brasil S\.A\.!/)).toBeInTheDocument();
    });
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it('blocks dashboard when floravel_jwt is whitespace-only without calling fetch', () => {
    localStorage.setItem(JWT_KEY, '   ');
    localStorage.setItem(SESSION_KEY, JSON.stringify({ tipoPerfil: 'RH', nome: 'RH' }));
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    render(<App />);

    expect(screen.getByTestId('rh-auth-guard')).toHaveTextContent('Sessão corporativa necessária');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('hydrates RH session from #auth= hash, clears hash, and renders live DashboardRh', async () => {
    window.history.replaceState(
      null,
      '',
      '/' +
        encodeAuthHash({
          nome: 'Gestão RH São Paulo',
          email: 'rh@techmaes.com.br',
          tipoPerfil: 'RH',
          tokenSessao: '  jwt-hash-123  ',
          codigoPublico: '  FLR-RH99  ',
        })
    );

    vi.spyOn(globalThis, 'fetch').mockImplementation((url) => {
      if (String(url).endsWith('/api/rh/empresas/atual')) return Promise.resolve(jsonResponse(MOCK_COMPANY));
      if (String(url).includes('/relatorio-k-anonimato')) return Promise.resolve(jsonResponse(MOCK_REPORT));
      if (String(url).endsWith('/licencas')) return Promise.resolve(jsonResponse(MOCK_LICENSES));
      return Promise.resolve(jsonResponse({}, 404));
    });

    render(<App />);

    expect(localStorage.getItem(JWT_KEY)).toBe('jwt-hash-123');
    expect(localStorage.getItem(PUBLIC_CODE_KEY)).toBe('FLR-RH99');
    expect(JSON.parse(localStorage.getItem(SESSION_KEY)).nome).toBe('Gestão RH São Paulo');
    expect(window.location.hash).toBe('');

    await waitFor(() => {
      expect(screen.getByText(/Olá, TechMães Brasil S\.A\.!/)).toBeInTheDocument();
    });
    expect(screen.getByText('Gestão RH São Paulo')).toBeInTheDocument();
  });

  it('strips #auth= hash and blocks non-RH role, malformed hash, and whitespace tokenSessao', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    window.history.replaceState(
      null,
      '',
      '/' + encodeAuthHash({ tipoPerfil: 'MAE', tokenSessao: 'jwt-mae' })
    );
    const first = render(<App />);
    expect(screen.getByTestId('rh-auth-guard')).toHaveTextContent('Acesso restrito ao perfil Gestão RH');
    expect(window.location.hash).toBe('');
    expect(fetchSpy).not.toHaveBeenCalled();
    first.unmount();
    localStorage.clear();

    window.history.replaceState(null, '', '/#auth=!!!not-base64!!!');
    const second = render(<App />);
    expect(screen.getByTestId('rh-auth-guard')).toHaveTextContent('Sessão corporativa necessária');
    expect(window.location.hash).toBe('');
    expect(fetchSpy).not.toHaveBeenCalled();
    second.unmount();
    localStorage.clear();

    window.history.replaceState(
      null,
      '',
      '/' + encodeAuthHash({ tipoPerfil: 'RH', tokenSessao: '   ' })
    );
    render(<App />);
    expect(screen.getByTestId('rh-auth-guard')).toHaveTextContent('Sessão corporativa necessária');
    expect(window.location.hash).toBe('');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('shows 401 re-login CTA on Overview and secondary tabs without redundant refetches', async () => {
    localStorage.setItem(JWT_KEY, 'expired-jwt');
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse({ status: 401, message: 'Sessão expirada.' }, 401));
    const onLogout = vi.fn();

    render(
      <DashboardRh
        session={{ nome: 'RH TechMães', email: 'rh@techmaes.com.br', tipoPerfil: 'RH' }}
        onLogout={onLogout}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-error')).toHaveTextContent('Sessão expirada.');
    });

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Fazer login novamente/i }));
    expect(onLogout).toHaveBeenCalledTimes(1);
    onLogout.mockClear();

    await user.click(screen.getByRole('button', { name: /Gestão de Licenças/i }));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('licenses-error')).toHaveTextContent('Sessão expirada.');
    await user.click(screen.getByRole('button', { name: /Fazer login novamente/i }));
    expect(onLogout).toHaveBeenCalledTimes(1);
    onLogout.mockClear();

    await user.click(screen.getByRole('button', { name: /Relatórios de Saúde/i }));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('reports-error')).toHaveTextContent('Sessão expirada.');
    await user.click(screen.getByRole('button', { name: /Fazer login novamente/i }));
    expect(onLogout).toHaveBeenCalledTimes(1);
    onLogout.mockClear();

    await user.click(screen.getByRole('button', { name: /^Configurações$/i }));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('settings-error')).toHaveTextContent('Sessão expirada.');
    await user.click(screen.getByRole('button', { name: /Fazer login novamente/i }));
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('shows loading skeleton instead of blank overview during manual refresh after prior load', async () => {
    localStorage.setItem(JWT_KEY, 'jwt-rh');
    let resolveRefreshEmpresa;
    const refreshEmpresaPromise = new Promise((resolve) => {
      resolveRefreshEmpresa = resolve;
    });

    let empresaCalls = 0;
    vi.spyOn(globalThis, 'fetch').mockImplementation((url) => {
      if (String(url).endsWith('/api/rh/empresas/atual')) {
        empresaCalls += 1;
        return empresaCalls === 1 ? Promise.resolve(jsonResponse(MOCK_COMPANY)) : refreshEmpresaPromise;
      }
      if (String(url).includes('/relatorio-k-anonimato')) return Promise.resolve(jsonResponse(MOCK_REPORT));
      if (String(url).endsWith('/licencas')) return Promise.resolve(jsonResponse(MOCK_LICENSES));
      return Promise.resolve(jsonResponse({}, 404));
    });

    render(
      <DashboardRh
        session={{ nome: 'RH TechMães', email: 'rh@techmaes.com.br', tipoPerfil: 'RH' }}
        onLogout={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Olá, TechMães Brasil S\.A\.!/)).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Relatórios de Saúde/i }));
    await user.click(screen.getByRole('button', { name: /Atualizar/i }));
    await user.click(screen.getByRole('button', { name: /Voltar ao Overview/i }));

    expect(screen.getByTestId('dashboard-loading')).toBeInTheDocument();

    resolveRefreshEmpresa(jsonResponse(MOCK_COMPANY));

    await waitFor(() => {
      expect(screen.getByText(/Olá, TechMães Brasil S\.A\.!/)).toBeInTheDocument();
    });
  });
});
