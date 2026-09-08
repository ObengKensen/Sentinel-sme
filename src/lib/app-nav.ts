import { useSyncExternalStore } from "react";

export const APP_PAGES = [
  "dashboard",
  "financial",
  "cybersecurity",
  "compliance",
  "operational",
  "alerts",
  "reports",
  "history",
  "profile",
] as const;

export const ADMIN_PAGES = ["dashboard", "smes", "risk", "reports", "profile"] as const;

export const PUBLIC_VIEWS = ["landing", "login", "register", "forgot-password"] as const;

export type AppPageId = (typeof APP_PAGES)[number];
export type AdminPageId = (typeof ADMIN_PAGES)[number];
export type PublicView = (typeof PUBLIC_VIEWS)[number];

export const APP_PAGE_TITLES: Record<AppPageId, string> = {
  dashboard: "Dashboard",
  financial: "Financial Monitoring",
  cybersecurity: "Cybersecurity Monitoring",
  compliance: "Compliance Monitoring",
  operational: "Operational Monitoring",
  alerts: "Alerts Center",
  reports: "Reports",
  history: "Risk History",
  profile: "Profile",
};

export const ADMIN_PAGE_TITLES: Record<AdminPageId, string> = {
  dashboard: "Admin Dashboard",
  smes: "SME Management",
  risk: "System Risk Monitoring",
  reports: "Admin Reports",
  profile: "Admin Profile",
};

const APP_PATH_TO_PAGE: Record<string, AppPageId> = {
  "/app/dashboard": "dashboard",
  "/app/financial": "financial",
  "/app/cybersecurity": "cybersecurity",
  "/app/compliance": "compliance",
  "/app/operational": "operational",
  "/app/alerts": "alerts",
  "/app/reports": "reports",
  "/app/history": "history",
  "/app/profile": "profile",
};

const ADMIN_PATH_TO_PAGE: Record<string, AdminPageId> = {
  "/admin/dashboard": "dashboard",
  "/admin/smes": "smes",
  "/admin/risk": "risk",
  "/admin/reports": "reports",
  "/admin/profile": "profile",
};

const PUBLIC_PATH_TO_VIEW: Record<string, PublicView> = {
  "/login": "login",
  "/register": "register",
  "/forgot-password": "forgot-password",
};

let appPage: AppPageId = "dashboard";
let adminPage: AdminPageId = "dashboard";
let publicView: PublicView = "landing";
let didSyncAppFromPath = false;
let didSyncAdminFromPath = false;
let didSyncPublicFromPath = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function isAppPage(value: string | null | undefined): value is AppPageId {
  return APP_PAGES.includes(value as AppPageId);
}

export function isAdminPage(value: string | null | undefined): value is AdminPageId {
  return ADMIN_PAGES.includes(value as AdminPageId);
}

export function appPageFromPath(pathname: string): AppPageId | undefined {
  return APP_PATH_TO_PAGE[pathname];
}

export function adminPageFromPath(pathname: string): AdminPageId | undefined {
  return ADMIN_PATH_TO_PAGE[pathname];
}

export function publicViewFromPath(pathname: string): PublicView | undefined {
  return PUBLIC_PATH_TO_VIEW[pathname];
}

export function getAppPage() {
  if (!didSyncAppFromPath && typeof window !== "undefined") {
    didSyncAppFromPath = true;
    const fromPath = appPageFromPath(window.location.pathname);
    if (fromPath) appPage = fromPath;
  }
  return appPage;
}

export function getAdminPage() {
  if (!didSyncAdminFromPath && typeof window !== "undefined") {
    didSyncAdminFromPath = true;
    const fromPath = adminPageFromPath(window.location.pathname);
    if (fromPath) adminPage = fromPath;
  }
  return adminPage;
}

export function getPublicView() {
  if (!didSyncPublicFromPath && typeof window !== "undefined") {
    didSyncPublicFromPath = true;
    const fromPath = publicViewFromPath(window.location.pathname);
    if (fromPath) publicView = fromPath;
  }
  return publicView;
}

export function setAppPage(page: AppPageId) {
  if (appPage === page) return;
  appPage = page;
  emit();
}

export function setAdminPage(page: AdminPageId) {
  if (adminPage === page) return;
  adminPage = page;
  emit();
}

export function setPublicView(view: PublicView) {
  if (publicView === view) return;
  publicView = view;
  emit();
}

export function resetAppNav() {
  appPage = "dashboard";
  adminPage = "dashboard";
  publicView = "landing";
  didSyncAppFromPath = false;
  didSyncAdminFromPath = false;
  didSyncPublicFromPath = false;
  emit();
}

export function useAppPage() {
  return useSyncExternalStore(subscribe, getAppPage, () => "dashboard" as const);
}

export function useAdminPage() {
  return useSyncExternalStore(subscribe, getAdminPage, () => "dashboard" as const);
}

export function usePublicView() {
  return useSyncExternalStore(subscribe, getPublicView, () => "landing" as const);
}
