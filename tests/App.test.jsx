import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';

vi.mock('../src/pages/Home', () => ({
  default: () => <div>Home Page</div>
}));
vi.mock('../src/pages/Login', () => ({
  default: () => <div>Login Page</div>
}));
vi.mock('../src/pages/Register', () => ({
  default: () => <div>Register Page</div>
}));
vi.mock('../src/pages/Dashboard', () => ({
  default: () => <div>Dashboard Page</div>
}));
vi.mock('../src/pages/Callback', () => ({
  default: () => <div>Callback Page</div>
}));
vi.mock('../src/pages/Portfolio', () => ({
  default: () => <div>Portfolio Page</div>
}));
vi.mock('../src/pages/EditPortfolio', () => ({
  default: () => <div>Edit Portfolio Page</div>
}));
vi.mock('../src/components/layouts/Header', () => ({
  default: () => <header>Header</header>
}));
vi.mock('../src/hooks/AuthProvider', async () => {
  const actual = await vi.importActual('../src/hooks/AuthProvider');
  return {
    ...actual,
    AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>,
  };
});
vi.mock('../src/components/ProtectedRoute', () => ({
  default: ({ children }) => <div data-testid="protected-route">{children}</div>,
}));

describe('App routing', () => {
  it('renders public routes correctly', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('renders login page', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders register page', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Register Page')).toBeInTheDocument();
  });

  it('renders portfolio public page', () => {
    render(
      <MemoryRouter initialEntries={['/portfolio-uuid-test']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Portfolio Page')).toBeInTheDocument();
  });

  it('renders dashboard route via ProtectedRoute', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });

  it('renders edit portfolio route via ProtectedRoute', () => {
    render(
      <MemoryRouter initialEntries={['/portfolio-uuid-test/edit']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    expect(screen.getByText('Edit Portfolio Page')).toBeInTheDocument();
  });

  it('renders oauth callback route via ProtectedRoute', () => {
    render(
      <MemoryRouter initialEntries={['/oauth/callback']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    expect(screen.getByText('Callback Page')).toBeInTheDocument();
  });
});
