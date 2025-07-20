import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import Toolbar from '../../../src/components/dndkitPortfolio/Toolbar';

// Mock du service api
const mockUpdatePortfolio = vi.fn(() => Promise.resolve());
vi.mock('../../../src/services/api/ApiService', () => {
  return {
    default: () => ({
      updatePortfolio: mockUpdatePortfolio,
    }),
  };
});

describe('Toolbar component', () => {
  const portfolioUuid = 'uuid-1234';
  const initialTitle = 'My Portfolio';
  const items = [{ id: 1, type: 'text', content: 'hello' }];
  let setTitle;
  let onSaveSuccess;

  beforeEach(() => {
    setTitle = vi.fn();
    onSaveSuccess = vi.fn();
    mockUpdatePortfolio.mockClear();
  });

  test('renders title and buttons', () => {
    render(<Toolbar portfolioUuid={portfolioUuid} items={items} title={initialTitle} setTitle={setTitle} isUpdated={false} onSaveSuccess={onSaveSuccess} />);
    expect(screen.getByText('Toolbar')).toBeInTheDocument();
    expect(screen.getByText(initialTitle)).toBeInTheDocument();
    expect(screen.getByText('Rename portfolio')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeDisabled();
  });

  test('toggles toolbar visibility', () => {
    render(<Toolbar portfolioUuid={portfolioUuid} items={items} title={initialTitle} setTitle={setTitle} isUpdated={false} onSaveSuccess={onSaveSuccess} />);
    const toggleBtn = screen.getByRole('button', { name: /toggle toolbar/i });

    // toolbar initially visible
    expect(screen.getByText('Toolbar')).toBeVisible();

    fireEvent.click(toggleBtn);
    expect(screen.queryByText('Toolbar')).not.toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.getByText('Toolbar')).toBeVisible();
  });

  test('opens and closes rename modal', () => {
    render(<Toolbar portfolioUuid={portfolioUuid} items={items} title={initialTitle} setTitle={setTitle} isUpdated={false} onSaveSuccess={onSaveSuccess} />);

    // open modal
    fireEvent.click(screen.getByText('Rename portfolio'));
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();

    const input = within(modal).getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input.value).toBe(initialTitle);

    // close modal by clicking cancel button inside modal
    fireEvent.click(within(modal).getByText('Cancel'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('updates title on save in modal', async () => {
    render(<Toolbar portfolioUuid={portfolioUuid} items={items} title={initialTitle} setTitle={setTitle} isUpdated={false} onSaveSuccess={onSaveSuccess} />);

    fireEvent.click(screen.getByText('Rename portfolio'));
    const modal = screen.getByRole('dialog');

    const input = within(modal).getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New Title' } });
    expect(input.value).toBe('New Title');

    fireEvent.click(within(modal).getByText('Save'));

    expect(setTitle).toHaveBeenCalledWith('New Title');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  test('calls updatePortfolio and onSaveSuccess on save button click', async () => {
    render(<Toolbar portfolioUuid={portfolioUuid} items={items} title={initialTitle} setTitle={setTitle} isUpdated={true} onSaveSuccess={onSaveSuccess} />);

    const saveBtn = screen.getByText('Save');
    expect(saveBtn).toBeEnabled();

    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockUpdatePortfolio).toHaveBeenCalledWith(portfolioUuid, {
        title: initialTitle,
        content: items,
      });
      expect(onSaveSuccess).toHaveBeenCalled();
    });
  });
});
