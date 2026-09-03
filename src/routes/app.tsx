import { createFileRoute, Link, Outlet, useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { store, useStore } from "@/lib/risk-store";
import { ensureSeeded, isSuperAdmin } from "@/lib/auth";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

const titles: Record<string, { short: string; full: string }> = {
  "/app/dashboard": { short: "Dashboard", full: "Dashboard" },
  "/app/financial": { short: "Financial", full: "Financial Monitoring" },
  "/app/cybersecurity": { short: "Cybersecurity", full: "Cybersecurity Monitoring" },
  "/app/compliance": { short: "Compliance", full: "Compliance Monitoring" },
  "/app/operational": { short: "Operational", full: "Operational Monitoring" },
  "/app/alerts": { short: "Alerts", full: "Alerts Center" },
  "/app/reports": { short: "Reports", full: "Reports" },
  "/app/history": { short: "Risk History", full: "Risk History" },
  "/app/profile": { short: "Profile", full: "Profile" },
};

function AppLayout() {
  const router = useRouter();
  const authed = useStore((s) => s.authed);
  const profile = useStore((s) => s.profile);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    void ensureSeeded().then(async () => {
      await store.hydrateFromSession();
      store.syncAlertsFromLatest();
    });
  }, []);

  useEffect(() => {
    if (!authed) {
      router.navigate({ to: "/login" });
      return;
    }
    if (isSuperAdmin()) {
      router.navigate({ to: "/admin/dashboard" });
      return;
    }
    if (pathname === "/app") {
      router.navigate({ to: "/app/dashboard" });
    }
  }, [authed, pathname, router]);

  if (!authed) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex min-h-14 items-center gap-2 border-b bg-background px-3 py-2 shadow-md sm:px-4 print:hidden">
          <SidebarTrigger className="shrink-0" />
          <Separator orientation="vertical" className="mx-1 hidden h-5 sm:block" />
          <h1 className="min-w-0 flex-1 truncate text-base font-semibold leading-tight tracking-tight sm:text-xl lg:text-3xl">
            <span className="sm:hidden">{titles[pathname]?.short ?? "Risk Sentinel"}</span>
            <span className="hidden sm:inline">{titles[pathname]?.full ?? "Risk Sentinel"}</span>
          </h1>
          <Link
            to="/app/profile"
            className="ml-auto flex shrink-0 items-center gap-2 rounded-md px-1 py-1 text-sm transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer sm:px-2"
            aria-label="View profile"
          >
            <div className="text-right hidden sm:block">
              <div className="font-semibold">{profile.ownerName}</div>
              <div className="text-sm text-muted-foreground">{profile.businessName}</div>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
              {profile.ownerName
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")}
            </div>
          </Link>
        </header>
        <main className="p-6 print:p-0">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
