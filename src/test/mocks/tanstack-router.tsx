import type { ReactNode } from "react";
import { mockNavigate, routerState } from "./tanstack-router-state";

export { mockNavigate, routerState };

export const routerMock = {
  Link: ({
    children,
    to,
    ...props
  }: {
    children: ReactNode;
    to: string;
    className?: string;
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useRouter: () => ({ navigate: mockNavigate }),
  useRouterState: ({
    select,
  }: {
    select: (s: { location: { pathname: string; href: string } }) => unknown;
  }) =>
    select({
      location: {
        pathname: routerState.pathname,
        href: `http://localhost${routerState.pathname}`,
      },
    }),
  createFileRoute: (_path: string) => (opts: Record<string, unknown>) => ({
    options: opts,
    id: _path,
  }),
  redirect: (opts: unknown) => opts,
};
