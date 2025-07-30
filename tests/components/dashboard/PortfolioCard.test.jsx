import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import PortfolioCard from '../../../src/components/dashboard/PortfolioCard';
import ReactDOM from 'react-dom';

// Mock API service
const mockDeletePortfolio = vi.fn();
vi.mock('../../../src/services/api/ApiService', () => ({
  default: () => ({
    deletePortfolio: mockDeletePortfolio,
  }),
}));

// Mock Toast
vi.mock('../../../src/components/ToastCustom', () => ({
  __esModule: true,
  default: vi.fn(),
}));

// Setup for portal rendering
beforeAll(() => {
  ReactDOM.createPortal = vi.fn((element) => element);
});
afterAll(() => {
  ReactDOM.createPortal.mockRestore?.();
});

describe('PortfolioCard component', () => {
  const mockSetUserData = vi.fn();
  const mockClipboardWriteText = vi.fn();

  const mockPortfolio = {
    uuid: '1234-uuid',
    title: 'My Awesome Portfolio',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: mockClipboardWriteText,
      },
    });
  });

  test('renders title and action buttons', () => {
    render(<PortfolioCard portfolio={mockPortfolio} setUserData={mockSetUserData} />);
    expect(screen.getByText('My Awesome Portfolio')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(4); // 3 icons + delete
  });

  test('opens portfolio in new tab when open button is clicked', () => {
    const mockOpen = vi.spyOn(window, 'open').mockImplementation(() => {});
    render(<PortfolioCard portfolio={mockPortfolio} setUserData={mockSetUserData} />);

    fireEvent.click(screen.getAllByRole('button')[1]); // openInNewTab
    expect(mockOpen).toHaveBeenCalledWith('/1234-uuid', '_blank');

    mockOpen.mockRestore();
  });

  test('navigates to edit page when edit button is clicked', () => {
    const mockOpen = vi.spyOn(window, 'open').mockImplementation(() => {});
    render(<PortfolioCard portfolio={mockPortfolio} setUserData={mockSetUserData} />);

    fireEvent.click(screen.getAllByRole('button')[2]); // edit
    expect(mockOpen).toHaveBeenCalledWith('/1234-uuid/edit', '_self');

    mockOpen.mockRestore();
  });

  test('copies URL to clipboard when share button is clicked', () => {
    render(<PortfolioCard portfolio={mockPortfolio} setUserData={mockSetUserData} />);

    fireEvent.click(screen.getAllByRole('button')[3]); // copyToClipboard
    expect(mockClipboardWriteText).toHaveBeenCalledWith(`${window.location.origin}/1234-uuid`);
  });

  test('opens delete modal when clicking delete icon', () => {
    render(<PortfolioCard portfolio={mockPortfolio} setUserData={mockSetUserData} />);
    fireEvent.click(screen.getByAltText(/delete/i));

    expect(screen.getByText(/are you sure you want to delete this portfolio/i)).toBeInTheDocument();
  });

  test('calls deletePortfolio and closes modal on confirm delete', async () => {
    render(<PortfolioCard portfolio={mockPortfolio} setUserData={mockSetUserData} />);
    fireEvent.click(screen.getByAltText(/delete/i));

    fireEvent.click(screen.getByRole('button', { name: /Confirm delete portfolio/i }));

    await waitFor(() => {
      expect(mockDeletePortfolio).toHaveBeenCalledWith(mockPortfolio, mockSetUserData);
    });

    expect(screen.queryByText(/are you sure/i)).toBeNull();
  });

  test('closes modal without deleting when clicking "Close"', () => {
    render(<PortfolioCard portfolio={mockPortfolio} setUserData={mockSetUserData} />);
    fireEvent.click(screen.getByAltText(/delete/i));

    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    // Since setShowModalDeletePortfolio is internal state, we can't assert on that directly here,
    // but absence of the modal in DOM is enough if portal wasn't mocked
    expect(screen.queryByText(/are you sure/i)).toBeNull();
  });
});
