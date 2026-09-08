import { createFileRoute, useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminPageLink } from "@/components/WorkspaceLink";
import { Separator } from "@/components/ui/separator";
import { store } from "@/lib/risk-store";
import { adminStore, initAdminStoreSync } from "@/lib/admin-store";
import { ensureSeeded, hydrateAuth, isSuperAdmin } from "@/lib/auth";
import {
  ADMIN_PAGE_TITLES,
  adminPageFromPath,
  setAdminPage,
  setAppPage,
  setPublicView,
  useAdminPage,
} from "@/lib/app-nav";
import { AdminDashboard } from "./admin.dashboard";
import { SmeManagement } from "./admin.smes";
import { SystemRiskMonitoring } from "./admin.risk";
import { AdminReports } from "./admin.reports";
import { AdminProfile } from "./admin.profile";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Risk Sentinel" }] }),
  beforeLoad: async () => {
    await ensureSeeded();
    await hydrateAuth();
    adminStore.refresh();
  },
  component: AdminLayout,
});

const pages = {
  dashboard: AdminDashboard,
  smes: SmeManagement,
  risk: SystemRiskMonitoring,
  reports: AdminReports,
  profile: AdminProfile,
};

function AdminLayout() {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const profile = store.getState().profile;
  const storedPage = useAdminPage();
  const pathPage = adminPageFromPath(pathname);
  const page = pathPage ?? storedPage;
  const PageComponent = pages[page];
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initAdminStoreSync();
    void ensureSeeded().then(async () => {
      await hydrateAuth();
      await store.hydrateFromSession();
      adminStore.refresh();
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!adminStore.isAdminAuthed()) {
      setPublicView("login");
      router.navigate({ to: "/" });
      return;
    }
    if (!isSuperAdmin()) {
      setAppPage("dashboard");
      router.navigate({ to: "/app" });
      return;
    }
    if (pathPage) {
      setAdminPage(pathPage);
      router.navigate({ to: "/admin", replace: true });
    }
  }, [pathPage, ready, router]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  if (!ready || !adminStore.isAdminAuthed() || !isSuperAdmin()) return null;

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex min-h-14 items-center gap-2 border-b bg-background px-3 py-2 sm:px-4 print:hidden">
          <SidebarTrigger className="shrink-0" />
          <Separator orientation="vertical" className="mx-1 hidden h-5 sm:block" />
          <h1 className="min-w-0 flex-1 text-sm font-semibold leading-tight tracking-tight sm:truncate sm:text-xl lg:text-3xl">
            {ADMIN_PAGE_TITLES[page]}
          </h1>
          <AdminPageLink
            page="profile"
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
          </AdminPageLink>
        </header>
        <main className="min-w-0 p-4 sm:p-6 print:p-0">
          <PageComponent />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
