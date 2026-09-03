import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "./use-mobile";

describe("useIsMobile", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 1024 });
  });

  it("returns false on desktop width", async () => {
    const listeners: Array<() => void> = [];
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      media: "(max-width: 767px)",
      addEventListener: (_: string, cb: () => void) => listeners.push(cb),
      removeEventListener: vi.fn(),
    }));
    const { result } = renderHook(() => useIsMobile());
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current).toBe(false);
  });

  it("returns true on mobile width", async () => {
    Object.defineProperty(window, "innerWidth", { value: 400 });
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: "(max-width: 767px)",
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    const { result } = renderHook(() => useIsMobile());
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current).toBe(true);
  });
});
