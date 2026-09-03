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

const titles: Record<string, string> = {
  "/app/dashboard": "Dashboard",
  "/app/financial": "Financial Monitoring",
  "/app/cybersecurity": "Cybersecurity Monitoring",
  "/app/compliance": "Compliance Monitoring",
  "/app/operational": "Operational Monitoring",
  "/app/alerts": "Alerts Center",
  "/app/reports": "Reports",
  "/app/history": "Risk History",
  "/app/profile": "Profile",
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
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background shadow-md px-4 print:hidden">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mx-1 h-5" />
          <div className="text-3xl font-semibold tracking-tight">{titles[pathname] ?? "Risk Sentinel"}</div>
          <Link
            to="/app/profile"
            className="ml-auto flex items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
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
