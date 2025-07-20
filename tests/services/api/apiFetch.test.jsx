import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import apiFetch from '../../../src/services/api/apiFetch';

describe('apiFetch', () => {
  const url = 'https://api.example.com/data';
  const options = { method: 'GET', headers: { 'Content-Type': 'application/json' } };
  const bearerToken = 'token123';
  const newBearerToken = 'newToken456';

  let refresh;

  beforeEach(() => {
    // reset mocks before each test
    global.fetch = vi.fn();
    refresh = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call fetch with bearer token and return response if status is not 401', async () => {
    const mockResponse = { status: 200, json: vi.fn().mockResolvedValue({ success: true }) };
    global.fetch.mockResolvedValue(mockResponse);

    const response = await apiFetch(url, options, bearerToken, refresh);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(url, expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: `Bearer ${bearerToken}`
      })
    }));
    expect(response).toBe(mockResponse);
    expect(refresh).not.toHaveBeenCalled();
  });

  it('should retry fetch with new token if first response status is 401', async () => {
    const mock401Response = { status: 401 };
    const mockSuccessResponse = { status: 200 };
    global.fetch
      .mockResolvedValueOnce(mock401Response)  // first call returns 401
      .mockResolvedValueOnce(mockSuccessResponse); // retry returns 200

    refresh.mockResolvedValue(newBearerToken);

    const response = await apiFetch(url, options, bearerToken, refresh);

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenNthCalledWith(1, url, expect.objectContaining({
      headers: expect.objectContaining({ Authorization: `Bearer ${bearerToken}` })
    }));
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenNthCalledWith(2, url, expect.objectContaining({
      headers: expect.objectContaining({ Authorization: `Bearer ${newBearerToken}` })
    }));
    expect(response).toBe(mockSuccessResponse);
  });

  it('should throw error if fetch throws', async () => {
    const mockError = new Error('Network error');
    global.fetch.mockRejectedValue(mockError);

    await expect(apiFetch(url, options, bearerToken, refresh)).rejects.toThrow('Network error');
    expect(refresh).not.toHaveBeenCalled();
  });
});
