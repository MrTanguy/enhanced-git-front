import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import ProtectedRoute from '../../src/components/ProtectedRoute';

// Correct import pour ton vrai chemin
import { UseAuth } from '../../src/hooks/AuthProvider';

// Mock de UseAuth
vi.mock('../../src/hooks/AuthProvider', () => ({
  UseAuth: vi.fn(),
}));

// Mock de Navigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: vi.fn(({ to }) => <div>Redirected to {to}</div>),
  };
});

describe('ProtectedRoute component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to login if bearerToken is missing', () => {
    UseAuth.mockReturnValue({ bearerToken: null });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText(/redirected to \/login/i)).toBeInTheDocument();
  });

  it('renders children if bearerToken exists', () => {
    UseAuth.mockReturnValue({ bearerToken: 'mock-token' });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
