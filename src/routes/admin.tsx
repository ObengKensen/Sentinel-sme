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

const titles: Record<string, string> = {
  "/admin": "Admin Dashboard",
  "/admin/dashboard": "Admin Dashboard",
  "/admin/smes": "SME Management",
  "/admin/risk": "System Risk Monitoring",
  "/admin/reports": "Admin Reports",
  "/admin/profile": "Admin Profile",
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
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background px-4 print:hidden">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mx-1 h-5" />
          <div className="text-3xl font-semibold tracking-tight">{titles[pathname] ?? "Admin"}</div>
          <Link
            to="/admin/profile"
            className="ml-auto flex items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
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
