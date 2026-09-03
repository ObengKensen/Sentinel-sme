import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { routerState } from "@/test/mocks/tanstack-router-state";
import { toast } from "sonner";
import { Route } from "./forgot-password";
import { registerUser, resetAuthModuleState } from "@/lib/auth";

const ForgotPasswordPage = Route.options.component;

describe("ForgotPasswordPage", () => {
  beforeEach(async () => {
    routerState.pathname = "/forgot-password";
    resetAuthModuleState();
    localStorage.clear();
    vi.mocked(toast.error).mockClear();
    vi.mocked(toast.success).mockClear();
    await registerUser("forgot@test.com", "oldpass1");
  });

  it("renders reset form", () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByRole("heading", { name: /reset your password/i })).toBeInTheDocument();
  });

  it("resets password successfully", async () => {
    const user = userEvent.setup({ delay: null });
    render(<ForgotPasswordPage />);
    await user.type(screen.getByLabelText("Email"), "forgot@test.com");
    await user.type(screen.getByLabelText("New password"), "newpass1");
    await user.type(screen.getByLabelText("Confirm new password"), "newpass1");
    await user.click(screen.getByRole("button", { name: /update password/i }));
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Password updated. You can sign in now.");
    });
  });
});
