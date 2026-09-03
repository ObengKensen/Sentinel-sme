import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import { routerState } from "./mocks/tanstack-router-state";

vi.mock("@tanstack/react-router", async () => {
  const { routerMock } = await import("./mocks/tanstack-router");
  return routerMock;
});

vi.mock("@/lib/api/auth.functions", () => import("./mocks/auth-functions"));
vi.mock("@/lib/api/account.functions", () => import("./mocks/account-functions"));
vi.mock("@/lib/api/risk-data.functions", () => import("./mocks/risk-data-functions"));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock("recharts", () => import("./mocks/recharts"));

vi.mock("@/lib/api/alert-email.functions", () => ({
  sendAlertEmailFn: vi.fn(async () => ({ ok: true as const })),
}));

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

class IntersectionObserverMock {
  constructor(_callback: IntersectionObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;

beforeEach(() => {
  routerState.pathname = "/app/dashboard";
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
