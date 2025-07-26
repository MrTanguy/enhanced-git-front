import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ModalDeletePortfolio from '../../../src/components/dashboard/ModalDeletePortfolio';

describe('ModalDeletePortfolio component', () => {
  const mockOnDelete = vi.fn();
  const mockSetShowModalDeletePortfolio = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders confirmation message and buttons', () => {
    render(
      <ModalDeletePortfolio
        onDelete={mockOnDelete}
        setShowModalDeletePortfolio={mockSetShowModalDeletePortfolio}
      />
    );

    expect(
      screen.getByText(/are you sure you want to delete this portfolio\?/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Confirm delete portfolio/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  test('calls onDelete when clicking "Confirm delete portfolio"', () => {
    render(
      <ModalDeletePortfolio
        onDelete={mockOnDelete}
        setShowModalDeletePortfolio={mockSetShowModalDeletePortfolio}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Confirm delete portfolio/i }));
    expect(mockOnDelete).toHaveBeenCalled();
  });

  test('calls setShowModalDeletePortfolio(false) when clicking "Close"', () => {
    render(
      <ModalDeletePortfolio
        onDelete={mockOnDelete}
        setShowModalDeletePortfolio={mockSetShowModalDeletePortfolio}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(mockSetShowModalDeletePortfolio).toHaveBeenCalledWith(false);
  });
});
