import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

// MOCK UseAuth with correct path
vi.mock('../../src/hooks/AuthProvider', () => ({
  UseAuth: () => ({
    bearerToken: 'mock-token',
    refresh: vi.fn(),
  }),
}));

// MOCK apiService (which uses UseAuth internally)
const mockDeleteConnection = vi.fn(async (id, setUserData) => {
  if (setUserData) setUserData(null);
});
vi.mock('../../../src/services/api/ApiService', () => {
  return {
    default: () => ({
      deleteConnection: mockDeleteConnection,
    }),
  };
});

import ConnectionCard from '../../../src/components/dashboard/ConnectionCard';

describe('ConnectionCard component', () => {
  const mockSetUserData = vi.fn();

  const connectionGithub = {
    id: 1,
    username: 'testuser',
    website: 'github',
  };

  const connectionGitlab = {
    id: 1,
    username: 'testuser',
    website: 'gitlab',
  }

  const connectionUnknown = {
    id: 2,
    username: 'unknownuser',
    website: 'unknownsite',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders the username and correct icon based on the website', () => {
    // Github
    const { rerender } = render(<ConnectionCard connection={connectionGithub} setUserData={mockSetUserData} />);
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByAltText(/github logo/i)).toHaveAttribute('src', '/github.svg');

    // GitLab
    rerender(<ConnectionCard connection={connectionGitlab} setUserData={mockSetUserData} />);
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByAltText(/gitlab logo/i)).toHaveAttribute('src', '/gitlab.svg');
  });

  test('shows default icon if website unknown', () => {
    render(<ConnectionCard connection={connectionUnknown} setUserData={mockSetUserData} />);
    const img = screen.getByAltText(/unknownsite/i);
    expect(img).toHaveAttribute('src', '/default.svg');
  });

  test('opens a new tab to the GitHub profile when clicking the card', () => {
    render(<ConnectionCard connection={connectionGithub} setUserData={mockSetUserData} />);
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => {});

    fireEvent.click(screen.getByText('testuser').parentElement);

    expect(openSpy).toHaveBeenCalledWith('https://github.com/testuser', '_blank');
    openSpy.mockRestore();
  });

  test('does not open a new tab when clicking card with unknown website', () => {
    render(<ConnectionCard connection={connectionUnknown} setUserData={mockSetUserData} />);
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => {});

    fireEvent.click(screen.getByText('unknownuser').parentElement);

    expect(openSpy).not.toHaveBeenCalled();
    openSpy.mockRestore();
  });

  test('does not trigger redirect when delete button is clicked', () => {
    render(<ConnectionCard connection={connectionGithub} setUserData={mockSetUserData} />);
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => {});

    const deleteButton = screen.getByRole('button', {
      name: /delete.*connection/i
    });
    fireEvent.click(deleteButton);

    expect(openSpy).not.toHaveBeenCalled();
    openSpy.mockRestore();
  });

  test('calls deleteConnection with correct ID and setUserData function', async () => {
    render(<ConnectionCard connection={connectionGithub} setUserData={mockSetUserData} />);
    const deleteButton = screen.getByRole('button', {
      name: /delete.*connection/i
    });
    fireEvent.click(deleteButton);
    await fireEvent.click(deleteButton);

    expect(mockDeleteConnection).toHaveBeenCalledWith(connectionGithub.id, mockSetUserData);
    expect(mockSetUserData).toHaveBeenCalledWith(null);
  });

  test('logs error when deleteConnection throws', async () => {
    // Modifier mock pour rejeter la promesse une fois
    mockDeleteConnection.mockImplementationOnce(() => {
      throw new Error('Delete failed');
    });

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ConnectionCard connection={connectionGithub} setUserData={mockSetUserData} />);
    const deleteButton = screen.getByRole('button', {
      name: /delete.*connection/i
    });
    await fireEvent.click(deleteButton);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Erreur lors de la suppression :',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});
