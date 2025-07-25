import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import RegisterForm from '../../src/components/authentification/RegisterForm';
import { MemoryRouter } from 'react-router-dom';

// Mock de useNavigate de react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock du hook UseAuth
const mockRegister = vi.fn();
vi.mock('../../src/hooks/AuthProvider', () => ({
  UseAuth: () => ({
    register: mockRegister,
  }),
}));

describe('RegisterForm component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders all input fields and submit button disabled initially', () => {
    render(<RegisterForm />, { wrapper: MemoryRouter });

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeDisabled();
  });

  test('shows email validation error for invalid email', () => {
    render(<RegisterForm />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'invalidemail' } });
    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeDisabled();
  });

  test('shows password validation errors for weak password', () => {
    render(<RegisterForm />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText(/^password$/i), { target: { value: 'abc' } });

    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/one uppercase letter/i)).toBeInTheDocument();
    expect(screen.getByText(/one number/i)).toBeInTheDocument();
    expect(screen.getByText(/one special character/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /register/i })).toBeDisabled();
  });

  test('shows confirm password error if passwords do not match', () => {
    render(<RegisterForm />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText(/^password$/i), { target: { value: 'Abcdef1!' } });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { target: { value: 'Different1!' } });

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeDisabled();
  });

  test('enables submit button when form is valid', () => {
    render(<RegisterForm />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), { target: { value: 'Abcdef1!' } });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { target: { value: 'Abcdef1!' } });

    expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/passwords do not match/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeEnabled();
  });

  test('calls register and navigates to dashboard on successful submit', async () => {
    mockRegister.mockResolvedValueOnce();

    render(<RegisterForm />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), { target: { value: 'Abcdef1!' } });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { target: { value: 'Abcdef1!' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('test@example.com', 'Abcdef1!');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('displays error message on register failure', async () => {
    mockRegister.mockRejectedValueOnce(new Error('Registration failed'));

    render(<RegisterForm />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), { target: { value: 'Abcdef1!' } });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { target: { value: 'Abcdef1!' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
