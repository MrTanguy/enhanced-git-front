import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../src/hooks/AuthProvider", () => ({
  UseAuth: vi.fn(),
}));

vi.mock("../../../src/services/api/apiFetch", () => {
  let hasRefreshed = false;

  return {
    default: vi.fn(async (url, options = {}, bearerToken, refresh) => {
      if (!hasRefreshed) {
        hasRefreshed = true;
        return {
          status: 401,
          ok: false,
        };
      } else {
        await refresh();
        return {
          status: 200,
          ok: true,
          json: async () => ({ token: "new-token-data" }),
        };
      }
    }),
  };
});

vi.mock("../../../src/components/ToastCustom", () => ({
  __esModule: true,
  default: vi.fn(),
}));

import { UseAuth } from "../../../src/hooks/AuthProvider";
import apiFetch from "../../../src/services/api/apiFetch";
import ToastCustom from "../../../src/components/ToastCustom";
import apiService from "../../../src/services/api/ApiService";

describe("ApiService", () => {
  let service;

  beforeEach(() => {
    vi.clearAllMocks();

    UseAuth.mockReturnValue({
      bearerToken: "fake-bearer-token",
      refresh: vi.fn().mockResolvedValue("new-fake-token"),
    });

    service = apiService();

    delete window.location;
    window.location = { href: "" };
  });

  it("getOAuthUrl should redirect on successful response", async () => {
    const fakeUrl = "http://redirect.url";

    apiFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(fakeUrl),
    });

    await service.getOAuthUrl("github");

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining("/connect/url?website=github"),
      expect.objectContaining({ method: "GET" }),
      "fake-bearer-token",
      expect.any(Function)
    );
    expect(window.location.href).toBe(fakeUrl);
  });

  it("sendAccessToken should call apiFetch and return data on success", async () => {
    const fakeData = { token: "abc" };

    apiFetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(fakeData),
    });

    const data = await service.sendAccessToken("code123", "github");

    expect(apiFetch).toHaveBeenCalledWith(
        expect.stringContaining("/connect/token"),
        expect.objectContaining({ method: "POST" }),
        "fake-bearer-token",
        expect.any(Function)
    );

    expect(ToastCustom).toHaveBeenNthCalledWith(
        1,
        "Connection to github...",
        "loading"
    );

    expect(ToastCustom).toHaveBeenNthCalledWith(
        2,
        "Successfully connected !",
        "success",
        undefined
    );

    expect(data).toEqual(fakeData);
    });


  it("getUserData should fetch user data when called", async () => {
    const fakeUserData = { connections: [], portfolios: [] };

    apiFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(fakeUserData),
    });

    const data = await service.getUserData();

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining("/user/data?types=connections,portfolios"),
      expect.objectContaining({ method: "GET" }),
      "fake-bearer-token",
      expect.any(Function)
    );
    expect(data).toEqual(fakeUserData);
  });

  it("getAllPublicProjects should fetch projects and return data on success", async () => {
    const fakeConnection = { id: 42, website: "github" };
    const fakeProjects = [{ id: 1 }, { id: 2 }];

    apiFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(fakeProjects),
    });

    const data = await service.getAllPublicProjects(fakeConnection);

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/connect/projects?account_id=${fakeConnection.id}&website=${fakeConnection.website}`),
      expect.objectContaining({ method: "GET" }),
      "fake-bearer-token",
      expect.any(Function)
    );

    expect(data).toEqual(fakeProjects);
  });

  it("deleteConnection should delete connection and update user data", async () => {
    const fakeId = 123;
    const setUserData = vi.fn();
    const prevUserData = {
      connections: [{ id: fakeId }, { id: 456 }],
      portfolios: []
    };

    ToastCustom.mockReturnValue("loading-toast");

    apiFetch.mockResolvedValue({
      ok: true,
    });

    await service.deleteConnection(fakeId, setUserData);

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/connect/delete/${fakeId}`),
      expect.objectContaining({ method: "DELETE" }),
      "fake-bearer-token",
      expect.any(Function)
    );

    expect(setUserData).toHaveBeenCalled();

    const updateFn = setUserData.mock.calls[0][0];
    const updatedData = updateFn(prevUserData);
    expect(updatedData.connections).toEqual([{ id: 456 }]);

    expect(ToastCustom).toHaveBeenNthCalledWith(1, "Deleting connection...", "loading");
    expect(ToastCustom).toHaveBeenNthCalledWith(2, "Connection deleted !", "success", "loading-toast");
  });

  it("createPortfolio should create a portfolio and update user data", async () => {
    const setUserData = vi.fn();
    const fakePortfolio = { uuid: "abc123", title: "My portfolio" };

    ToastCustom.mockReturnValue("loading-toast");

    apiFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(fakePortfolio),
    });

    await service.createPortfolio(setUserData);

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining("/portfolio/create"),
      expect.objectContaining({ method: "GET" }),
      "fake-bearer-token",
      expect.any(Function)
    );

    expect(setUserData).toHaveBeenCalled();

    // Vérifier que le callback ajoute bien le portfolio
    const updateFn = setUserData.mock.calls[0][0];
    const prevData = { portfolios: [] };
    const updatedData = updateFn(prevData);
    expect(updatedData.portfolios).toContain(fakePortfolio);

    expect(ToastCustom).toHaveBeenNthCalledWith(1, "Creating a portfolio...", "loading");
    expect(ToastCustom).toHaveBeenNthCalledWith(2, "Portfolio created !", "success", "loading-toast");
  });

  it("getPortfolioData should fetch portfolio data and return it on success", async () => {
    const uuid = "abc-uuid";
    const fakePortfolioData = { uuid, title: "Test" };

    apiFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(fakePortfolioData),
    });

    const data = await service.getPortfolioData(uuid);

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/portfolio/${uuid}`),
      expect.objectContaining({ method: "GET" })
    );

    expect(data).toEqual(fakePortfolioData);
  });

  it("updatePortfolio should update portfolio and show toasts", async () => {
    const uuid = "abc-uuid";
    const portfolioData = { title: "New Title" };

    ToastCustom.mockReturnValue("loading-toast");

    apiFetch.mockResolvedValue({
      ok: true,
    });

    await service.updatePortfolio(uuid, portfolioData);

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/portfolio/${uuid}`),
      expect.objectContaining({
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(portfolioData),
      }),
      "fake-bearer-token",
      expect.any(Function)
    );

    expect(ToastCustom).toHaveBeenNthCalledWith(1, "Saving portfolio...", "loading");
    expect(ToastCustom).toHaveBeenNthCalledWith(2, "Portfolio saved !", "success", "loading-toast");
  });

  it("deletePortfolio should delete portfolio and update user data", async () => {
    const fakePortfolio = { uuid: "abc123" };
    const setUserData = vi.fn();
    const prevUserData = {
      portfolios: [fakePortfolio, { uuid: "xyz456" }],
    };

    ToastCustom.mockReturnValue("loading-toast");

    apiFetch.mockResolvedValue({
      ok: true,
    });

    await service.deletePortfolio(fakePortfolio, setUserData);

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/portfolio/${fakePortfolio.uuid}`),
      expect.objectContaining({ method: "DELETE" }),
      "fake-bearer-token",
      expect.any(Function)
    );

    expect(setUserData).toHaveBeenCalled();

    const updateFn = setUserData.mock.calls[0][0];
    const updatedData = updateFn(prevUserData);
    expect(updatedData.portfolios).toEqual([{ uuid: "xyz456" }]);

    expect(ToastCustom).toHaveBeenNthCalledWith(1, "Deleting portfolio...", "loading");
    expect(ToastCustom).toHaveBeenNthCalledWith(2, "Portfolio deleted !", "success", "loading-toast");
  });

  it("getOAuthUrl should not redirect if response not ok", async () => {
    apiFetch.mockResolvedValue({
        ok: false,
    });

    await service.getOAuthUrl("github");

    expect(window.location.href).toBe("");
  });

  it("deleteConnection should handle apiFetch failure gracefully", async () => {
    const setUserData = vi.fn();

    apiFetch.mockResolvedValue({
        ok: false,
    });

    await service.deleteConnection(123, setUserData);

    expect(setUserData).not.toHaveBeenCalled();
  });

  it("createPortfolio should handle error response", async () => {
    const setUserData = vi.fn();

    apiFetch.mockResolvedValue({
        ok: false,
    });

    await service.createPortfolio(setUserData);

    expect(setUserData).not.toHaveBeenCalled();
  });

  it("getAllPublicProjects handles api failure", async () => {
    apiFetch.mockResolvedValue({ ok: false });

    const data = await service.getAllPublicProjects({ id: 1, website: "gitlab" });

    expect(data).toEqual(undefined);
  });

  it("deletePortfolio handles failure and does not update data", async () => {
    const setUserData = vi.fn();

    apiFetch.mockResolvedValue({ ok: false });

    await service.deletePortfolio({ uuid: "abc" }, setUserData);

    expect(setUserData).not.toHaveBeenCalled();
  });
});
