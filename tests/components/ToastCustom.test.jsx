import { vi, describe, it, expect, beforeEach } from 'vitest';
import toast from 'react-hot-toast';
import ToastCustom from '../../src/components/ToastCustom';

// Mock de react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    loading: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    // tu peux ajouter d'autres types si besoin (info, warning...)
  },
}));

describe('ToastCustom util', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call toast.loading with correct message and options when type is loading', () => {
    const message = 'Loading message';
    ToastCustom(message, 'loading');

    expect(toast.loading).toHaveBeenCalledWith(message, expect.objectContaining({
      position: 'top-center',
      style: expect.objectContaining({
        border: '1px solid #739BF2',
        padding: '16px',
        color: '#739BF2',
        backgroundColor: '#F7F1F2',
      }),
    }));
  });

  it('should call toast.success with correct message and options by default', () => {
    const message = 'Success message';
    ToastCustom(message);

    expect(toast.success).toHaveBeenCalledWith(message, expect.objectContaining({
      position: 'top-center',
      style: expect.objectContaining({
        border: '1px solid #739BF2',
        padding: '16px',
        color: '#739BF2',
        backgroundColor: '#F7F1F2',
      }),
    }));
  });

  it('should call toast.error with correct message and options when type is error', () => {
    const message = 'Error message';
    ToastCustom(message, 'error');

    expect(toast.error).toHaveBeenCalledWith(message, expect.objectContaining({
      position: 'top-center',
      style: expect.objectContaining({
        border: '1px solid #739BF2',
        padding: '16px',
        color: '#739BF2',
        backgroundColor: '#F7F1F2',
      }),
    }));
  });

  it('should call toast with id when toastId is provided', () => {
    const message = 'Info message';
    const toastId = 'abc123';

    // Ajouter un type 'info' pour test ou utiliser 'success' si tu veux
    ToastCustom(message, 'success', toastId);

    expect(toast.success).toHaveBeenCalledWith(message, expect.objectContaining({
      id: toastId,
      position: 'top-center',
      style: expect.any(Object),
    }));
  });
});
