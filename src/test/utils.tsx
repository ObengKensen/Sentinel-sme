import { render, screen, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { resetAuthModuleState } from "@/lib/auth";
import { resetStoreAfterDataWipe } from "@/lib/risk-store";
import { mockNavigate } from "./mocks/tanstack-router-state";

export { mockNavigate };

export function getFieldInput(label: string): HTMLElement {
  const labelEl = screen.getByText(label, { selector: "label" });
  const field = labelEl.parentElement;
  if (!field) throw new Error(`No field container for label: ${label}`);
  const input = field.querySelector("input, select, textarea");
  if (!input) throw new Error(`No input for label: ${label}`);
  return input as HTMLElement;
}

export function resetTestState() {
  localStorage.clear();
  resetAuthModuleState();
  resetStoreAfterDataWipe();
  mockNavigate.mockClear();
}

export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  return render(
    <TooltipProvider>
      <SidebarProvider>{ui}</SidebarProvider>
    </TooltipProvider>,
    options,
  );
}
