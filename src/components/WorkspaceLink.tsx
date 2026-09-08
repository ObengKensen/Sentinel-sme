import type { ComponentProps, MouseEvent } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  publicViewFromPath,
  setAdminPage,
  setAppPage,
  setPublicView,
  type AdminPageId,
  type AppPageId,
  type PublicView,
} from "@/lib/app-nav";

type LinkProps = Omit<ComponentProps<"a">, "href">;

export function AppPageLink({
  page,
  onClick,
  ...props
}: LinkProps & { page: AppPageId }) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setAppPage(page);
    onClick?.(event);
  };

  return <a href="/app" onClick={handleClick} {...props} />;
}

export function AdminPageLink({
  page,
  onClick,
  ...props
}: LinkProps & { page: AdminPageId }) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setAdminPage(page);
    onClick?.(event);
  };

  return <a href="/admin" onClick={handleClick} {...props} />;
}

export function PublicViewLink({
  view,
  onClick,
  ...props
}: LinkProps & { view: PublicView }) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setPublicView(view);
    onClick?.(event);
  };

  return <a href="/" onClick={handleClick} {...props} />;
}

export function useHideNamedPublicPath(view: PublicView) {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (typeof window !== "undefined") setPublicView(view);

  useEffect(() => {
    if (!publicViewFromPath(pathname)) return;
    setPublicView(view);
    void router.navigate({ to: "/", replace: true });
  }, [pathname, router, view]);
}
