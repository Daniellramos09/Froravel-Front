import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AccessibilityProvider } from '../Components/Accessibility/AccessibilityContext';
import { AppRoutes } from '../App';

vi.mock('../utils/appLinks', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getApiBase: () => 'http://localhost:8080',
    navigateToApp: vi.fn(),
  };
});

function renderAtRoute(route) {
  return render(
    <AccessibilityProvider>
      <MemoryRouter initialEntries={[route]}>
        <AppRoutes />
      </MemoryRouter>
    </AccessibilityProvider>
  );
}

describe('AppRoutes auth routes', () => {
  it('renders /esqueci-senha with prefilled email query parameter', () => {
    renderAtRoute('/esqueci-senha?email=ana@test.com');

    expect(screen.getByRole('heading', { name: /Esqueceu sua senha\?/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Seu E-mail/i)).toHaveValue('ana@test.com');
  });

  it('renders /redefinir-senha with prefilled email and 6-digit code query parameters', () => {
    renderAtRoute('/redefinir-senha?email=ana@test.com&codigo=123456');

    expect(screen.getByRole('heading', { name: /Redefinir senha/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail cadastrado/i)).toHaveValue('ana@test.com');
    expect(screen.getByLabelText(/Código de 6 dígitos/i)).toHaveValue('123456');
  });

  it('renders /confirmar-email with prefilled email query parameter', () => {
    renderAtRoute('/confirmar-email?email=ana@test.com');

    expect(screen.getByRole('heading', { name: /Confirme seu e-mail/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail cadastrado/i)).toHaveValue('ana@test.com');
  });
});
