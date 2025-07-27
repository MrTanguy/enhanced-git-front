import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import LoginForm from '../../../src/components/authentication/LoginForm';

const mockLogin = vi.fn();

vi.mock('../../../src/hooks/AuthProvider', () => ({
  UseAuth: () => ({
    bearerToken: 'mock-token',
    refresh: vi.fn(),
    login: mockLogin,
  }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('LoginForm component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders form inputs and button', () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/new here \?/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  test('updates input values on change', () => {
    render(<LoginForm />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'mypassword' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('mypassword');
  });

  test('calls login and navigates on successful submit', async () => {
    mockLogin.mockResolvedValueOnce();
    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'mypassword' } });
    fireEvent.submit(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'mypassword');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('shows error message when login fails', async () => {
    const error = new Error('Invalid credentials');
    mockLogin.mockRejectedValueOnce(error);

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'badpass' } });
    fireEvent.submit(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  test('navigates to register page when clicking Register link', () => {
    render(<LoginForm />);
    const registerLink = screen.getByText(/register/i);

    fireEvent.click(registerLink);

    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });
});
