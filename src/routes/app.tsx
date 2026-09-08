import { createFileRoute, useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppPageLink } from "@/components/WorkspaceLink";
import { Separator } from "@/components/ui/separator";
import { store, useStore } from "@/lib/risk-store";
import { ensureSeeded, isSuperAdmin } from "@/lib/auth";
import {
  APP_PAGE_TITLES,
  appPageFromPath,
  setAdminPage,
  setAppPage,
  setPublicView,
  useAppPage,
} from "@/lib/app-nav";
import { Dashboard } from "./app.dashboard";
import { FinancialPage } from "./app.financial";
import { CybersecurityPage } from "./app.cybersecurity";
import { CompliancePage } from "./app.compliance";
import { OperationalPage } from "./app.operational";
import { AlertsPage } from "./app.alerts";
import { ReportsPage } from "./app.reports";
import { HistoryPage } from "./app.history";
import { ProfilePage } from "./app.profile";

export const Route = createFileRoute("/app")({
  head: () => ({ meta: [{ title: "Risk Sentinel" }] }),
  component: AppLayout,
});

const pages = {
  dashboard: Dashboard,
  financial: FinancialPage,
  cybersecurity: CybersecurityPage,
  compliance: CompliancePage,
  operational: OperationalPage,
  alerts: AlertsPage,
  reports: ReportsPage,
  history: HistoryPage,
  profile: ProfilePage,
};

function AppLayout() {
  const router = useRouter();
  const authed = useStore((s) => s.authed);
  const profile = useStore((s) => s.profile);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const storedPage = useAppPage();
  const pathPage = appPageFromPath(pathname);
  const page = pathPage ?? storedPage;
  const PageComponent = pages[page];
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void ensureSeeded().then(async () => {
      await store.hydrateFromSession();
      store.syncAlertsFromLatest();
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!authed) {
      setPublicView("login");
      router.navigate({ to: "/" });
      return;
    }
    if (isSuperAdmin()) {
      setAdminPage("dashboard");
      router.navigate({ to: "/admin" });
      return;
    }
    if (pathPage) {
      setAppPage(pathPage);
      router.navigate({ to: "/app", replace: true });
    }
  }, [authed, pathPage, ready, router]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  if (!ready || !authed) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex min-h-14 items-center gap-2 border-b bg-background px-3 py-2 shadow-md sm:px-4 print:hidden">
          <SidebarTrigger className="shrink-0" />
          <Separator orientation="vertical" className="mx-1 hidden h-5 sm:block" />
          <h1 className="min-w-0 flex-1 text-sm font-semibold leading-tight tracking-tight sm:truncate sm:text-xl lg:text-3xl">
            {APP_PAGE_TITLES[page]}
          </h1>
          <AppPageLink
            page="profile"
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
          </AppPageLink>
        </header>
        <main className="min-w-0 p-4 sm:p-6 print:p-0">
          <PageComponent />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
