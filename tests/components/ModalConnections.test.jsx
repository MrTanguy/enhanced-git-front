import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ModalConnections from '../../src/components/ModalConnections';

// Mock de la fonction getOAuthUrl
const mockGetOAuthUrl = vi.fn();

vi.mock('../../src/services/api/ApiService', () => {
  return {
    default: () => ({
      getOAuthUrl: mockGetOAuthUrl,
    }),
  };
});

describe('ModalConnections component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders GitHub and GitLab options with a close button', () => {
    render(<ModalConnections onClose={mockOnClose} />);
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('GitLab')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  test('calls getOAuthUrl with "github" when GitHub is clicked', () => {
    render(<ModalConnections onClose={mockOnClose} />);
    fireEvent.click(screen.getByText('GitHub'));
    expect(mockGetOAuthUrl).toHaveBeenCalledWith('github');
  });

  test('calls getOAuthUrl with "gitlab" when GitLab is clicked', () => {
    render(<ModalConnections onClose={mockOnClose} />);
    fireEvent.click(screen.getByText('GitLab'));
    expect(mockGetOAuthUrl).toHaveBeenCalledWith('gitlab');
  });

  test('calls onClose when background is clicked', () => {
    render(<ModalConnections onClose={mockOnClose} />);
    const background = screen.getByText('GitHub').closest('.modalBackground');
    fireEvent.click(background);
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('does not call onClose when clicking inside modal content', () => {
    render(<ModalConnections onClose={mockOnClose} />);
    const modalContent = screen.getByText('GitHub').closest('.modalDiv');
    fireEvent.click(modalContent);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('calls onClose when clicking the close button', () => {
    render(<ModalConnections onClose={mockOnClose} />);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
