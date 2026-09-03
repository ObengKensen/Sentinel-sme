import { createFileRoute, Link, Outlet, useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Separator } from "@/components/ui/separator";
import { store } from "@/lib/risk-store";
import { adminStore, initAdminStoreSync } from "@/lib/admin-store";
import { ensureSeeded, hydrateAuth, isSuperAdmin } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    await ensureSeeded();
    await hydrateAuth();
    adminStore.refresh();
  },
  component: AdminLayout,
});

const titles: Record<string, { short: string; full: string }> = {
  "/admin": { short: "Dashboard", full: "Admin Dashboard" },
  "/admin/dashboard": { short: "Dashboard", full: "Admin Dashboard" },
  "/admin/smes": { short: "SMEs", full: "SME Management" },
  "/admin/risk": { short: "Risk Monitoring", full: "System Risk Monitoring" },
  "/admin/reports": { short: "Reports", full: "Admin Reports" },
  "/admin/profile": { short: "Profile", full: "Admin Profile" },
};

function AdminLayout() {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const profile = store.getState().profile;

  useEffect(() => {
    initAdminStoreSync();
    void ensureSeeded().then(async () => {
      await hydrateAuth();
      await store.hydrateFromSession();
      adminStore.refresh();
    });
  }, []);

  useEffect(() => {
    if (!adminStore.isAdminAuthed()) {
      router.navigate({ to: "/login" });
      return;
    }
    if (!isSuperAdmin()) {
      router.navigate({ to: "/app/dashboard" });
      return;
    }
    if (pathname === "/admin") {
      router.navigate({ to: "/admin/dashboard" });
    }
  }, [pathname, router]);

  if (!adminStore.isAdminAuthed() || !isSuperAdmin()) return null;

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex min-h-14 items-center gap-2 border-b bg-background px-3 py-2 sm:px-4 print:hidden">
          <SidebarTrigger className="shrink-0" />
          <Separator orientation="vertical" className="mx-1 hidden h-5 sm:block" />
          <h1 className="min-w-0 flex-1 truncate text-base font-semibold leading-tight tracking-tight sm:text-xl lg:text-3xl">
            <span className="sm:hidden">{titles[pathname]?.short ?? "Admin"}</span>
            <span className="hidden sm:inline">{titles[pathname]?.full ?? "Admin"}</span>
          </h1>
          <Link
            to="/admin/profile"
            className="ml-auto flex shrink-0 items-center gap-2 rounded-md px-1 py-1 text-sm transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer sm:px-2"
            aria-label="View admin profile"
          >
            <div className="text-right hidden sm:block">
              <div className="font-semibold">{profile.ownerName}</div>
              <div className="text-sm text-muted-foreground">Super Admin</div>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
              SA
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
