import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Wallet,
  ShieldCheck,
  FileCheck2,
  Cog,
  Bell,
  FileBarChart2,
  History,
  User,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppPageLink } from "@/components/WorkspaceLink";
import { store, useStore } from "@/lib/risk-store";
import { setPublicView, useAppPage, type AppPageId } from "@/lib/app-nav";

const items: { title: string; page: AppPageId; icon: typeof LayoutDashboard }[] = [
  { title: "Dashboard", page: "dashboard", icon: LayoutDashboard },
  { title: "Financial", page: "financial", icon: Wallet },
  { title: "Cybersecurity", page: "cybersecurity", icon: ShieldCheck },
  { title: "Compliance", page: "compliance", icon: FileCheck2 },
  { title: "Operational", page: "operational", icon: Cog },
  { title: "Alerts", page: "alerts", icon: Bell },
  { title: "Reports", page: "reports", icon: FileBarChart2 },
  { title: "Risk History", page: "history", icon: History },
  { title: "Profile", page: "profile", icon: User },
];

export function AppSidebar() {
  const page = useAppPage();
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();
  const alerts = useStore((s) => s.alerts.filter((a) => a.status === "active").length);
  const profile = useStore((s) => s.profile);
  const closeMobileNav = () => {
    if (isMobile) setOpenMobile(false);
  };

  useEffect(() => {
    setOpenMobile(false);
  }, [page, setOpenMobile]);

  const onLogout = () => {
    store.logout();
    setPublicView("login");
    router.navigate({ to: "/" });
  };

  return (
    <Sidebar collapsible="icon" className="print:hidden">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <span className="hidden text-sm font-semibold text-sidebar-foreground group-data-[collapsible=icon]:block">
            RS
          </span>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-montserrat text-base font-semibold text-sidebar-foreground">
              Risk Sentinel
            </span>
            <span className="text-xs text-sidebar-foreground/80 truncate max-w-[140px]">
              {profile.businessName}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Monitoring</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = page === item.page;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <AppPageLink page={item.page} onClick={closeMobileNav}>
                        <item.icon />
                        <span>{item.title}</span>
                        {item.title === "Alerts" && alerts > 0 && (
                          <span className="ml-auto text-xs font-semibold bg-destructive text-destructive-foreground rounded-full px-2 py-0.5">
                            {alerts}
                          </span>
                        )}
                      </AppPageLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onLogout} tooltip="Logout">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
