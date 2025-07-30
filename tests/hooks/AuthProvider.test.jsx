import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthProvider, UseAuth } from '../../src/hooks/AuthProvider';
import { BrowserRouter, useNavigate } from 'react-router-dom';

// Mock de useNavigate de react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('AuthProvider', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    // Reset localStorage mock
    localStorage.clear();
    // Reset mocks
    vi.clearAllMocks();
    // Mock useNavigate renvoie notre mockNavigate
    useNavigate.mockReturnValue(mockNavigate);
  });

  // Helper component pour récupérer le contexte
  function TestComponent() {
    const { bearerToken, login, register, refresh } = UseAuth();
    return (
      <div>
        <span data-testid="token">{bearerToken || 'no-token'}</span>
        <button onClick={() => login('user@example.com', 'pass')}>Login</button>
        <button onClick={() => register('user@example.com', 'pass')}>Register</button>
        <button onClick={() => refresh()}>Refresh</button>
      </div>
    );
  }

  it('should initialize with token from localStorage', () => {
    localStorage.setItem('bearerToken', 'stored-token');
    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByTestId('token').textContent).toBe('stored-token');
  });

  it('login should fetch token and save it', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ bearer: 'fake-token' }),
      })
    );

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    // Click login button triggers login()
    screen.getByText('Login').click();

    // wait for async
    await new Promise((r) => setTimeout(r, 0));

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/token'), expect.any(Object));
    expect(localStorage.getItem('bearerToken')).toBe('fake-token');
    expect(screen.getByTestId('token').textContent).toBe('fake-token');
  });

  it('register should fetch token and save it', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ bearer: 'registered-token' }),
      })
    );

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    screen.getByText('Register').click();

    await new Promise((r) => setTimeout(r, 0));

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/register'), expect.any(Object));
    expect(localStorage.getItem('bearerToken')).toBe('registered-token');
    expect(screen.getByTestId('token').textContent).toBe('registered-token');
  });

  it('refresh should navigate to /login if 401', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ detail: 'Unauthorized' }),
      })
    );

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    screen.getByText('Refresh').click();

    await new Promise((r) => setTimeout(r, 0));

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('refresh should save token if ok', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ bearer: 'refreshed-token' }),
      })
    );

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    screen.getByText('Refresh').click();

    await new Promise((r) => setTimeout(r, 0));

    expect(localStorage.getItem('bearerToken')).toBe('refreshed-token');
    expect(screen.getByTestId('token').textContent).toBe('refreshed-token');
  });
});
