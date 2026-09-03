import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter, d as useRouterState, L as Link, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import { S as SidebarProvider, a as SidebarInset, b as SidebarTrigger, c as Sidebar, d as SidebarHeader, e as SidebarContent, f as SidebarGroup, g as SidebarGroupLabel, h as SidebarGroupContent, i as SidebarMenu, j as SidebarMenuItem, k as SidebarMenuButton, l as SidebarFooter } from "./sidebar-W-ukBSHQ.mjs";
import { useStore, ensureSeeded, store, isSuperAdmin } from "./router-BdVNv3tq.mjs";
import { S as Separator } from "./separator-BxhEne_V.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import { b as LayoutDashboard, W as Wallet, S as ShieldCheck, F as FileCheckCorner, C as Cog, B as Bell, c as FileChartColumn, H as History, U as User, d as LogOut } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./utils-B-5jxtHY.mjs";
import "../_libs/tailwind-merge.mjs";
import "./button-BjSzN4sD.mjs";
import "./input-CtyJ1gXQ.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-tooltip.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./csrf-C3jkS9Bv.mjs";
import "./server-DpwYz346.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./jwt.shared-gMsek6D_.mjs";
import "../_libs/zod.mjs";
import "../_libs/radix-ui__react-separator.mjs";
const items = [
  { title: "Dashboard", url: "/app/dashboard", icon: LayoutDashboard },
  { title: "Financial", url: "/app/financial", icon: Wallet },
  { title: "Cybersecurity", url: "/app/cybersecurity", icon: ShieldCheck },
  { title: "Compliance", url: "/app/compliance", icon: FileCheckCorner },
  { title: "Operational", url: "/app/operational", icon: Cog },
  { title: "Alerts", url: "/app/alerts", icon: Bell },
  { title: "Reports", url: "/app/reports", icon: FileChartColumn },
  { title: "Risk History", url: "/app/history", icon: History },
  { title: "Profile", url: "/app/profile", icon: User }
];
function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const router = useRouter();
  const alerts = useStore((s) => s.alerts.filter((a) => a.status === "active").length);
  const profile = useStore((s) => s.profile);
  const onLogout = () => {
    store.logout();
    router.navigate({ to: "/login" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Sidebar, { collapsible: "icon", className: "print:hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarHeader, { className: "border-b border-sidebar-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-2 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden text-sm font-semibold text-sidebar-foreground group-data-[collapsible=icon]:block", children: "RS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col leading-tight group-data-[collapsible=icon]:hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-montserrat text-base font-semibold text-sidebar-foreground", children: "Risk Sentinel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-sidebar-foreground/80 truncate max-w-[140px]", children: profile.businessName })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SidebarGroup, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarGroupLabel, { children: "Monitoring" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarGroupContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenu, { children: items.map((item) => {
        const active = pathname === item.url;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenuButton, { asChild: true, isActive: active, tooltip: item.title, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: item.url, activeOptions: { exact: true }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.title }),
          item.title === "Alerts" && alerts > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs font-semibold bg-destructive text-destructive-foreground rounded-full px-2 py-0.5", children: alerts })
        ] }) }) }, item.title);
      }) }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarFooter, { className: "border-t border-sidebar-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenu, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SidebarMenuButton, { onClick: onLogout, tooltip: "Logout", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Logout" })
    ] }) }) }) })
  ] });
}
const titles = {
  "/app/dashboard": "Dashboard",
  "/app/financial": "Financial Monitoring",
  "/app/cybersecurity": "Cybersecurity Monitoring",
  "/app/compliance": "Compliance Monitoring",
  "/app/operational": "Operational Monitoring",
  "/app/alerts": "Alerts Center",
  "/app/reports": "Reports",
  "/app/history": "Risk History",
  "/app/profile": "Profile"
};
function AppLayout() {
  const router = useRouter();
  const authed = useStore((s) => s.authed);
  const profile = useStore((s) => s.profile);
  const pathname = useRouterState({
    select: (s) => s.location.pathname
  });
  reactExports.useEffect(() => {
    void ensureSeeded().then(async () => {
      await store.hydrateFromSession();
      store.syncAlertsFromLatest();
    });
  }, []);
  reactExports.useEffect(() => {
    if (!authed) {
      router.navigate({
        to: "/login"
      });
      return;
    }
    if (isSuperAdmin()) {
      router.navigate({
        to: "/admin/dashboard"
      });
      return;
    }
    if (pathname === "/app") {
      router.navigate({
        to: "/app/dashboard"
      });
    }
  }, [authed, pathname, router]);
  if (!authed) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SidebarProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SidebarInset, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background shadow-md px-4 print:hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarTrigger, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { orientation: "vertical", className: "mx-1 h-5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-semibold tracking-tight", children: titles[pathname] ?? "Risk Sentinel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/profile", className: "ml-auto flex items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer", "aria-label": "View profile", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right hidden sm:block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: profile.ownerName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: profile.businessName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold", children: profile.ownerName.split(" ").map((p) => p[0]).slice(0, 2).join("") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "p-6 print:p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
    ] })
  ] });
}
export {
  AppLayout as component
};
