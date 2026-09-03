import { Link, useRouter, useRouterState } from "@tanstack/react-router";
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
} from "@/components/ui/sidebar";
import { store, useStore } from "@/lib/risk-store";

const items = [
  { title: "Dashboard", url: "/app/dashboard", icon: LayoutDashboard },
  { title: "Financial", url: "/app/financial", icon: Wallet },
  { title: "Cybersecurity", url: "/app/cybersecurity", icon: ShieldCheck },
  { title: "Compliance", url: "/app/compliance", icon: FileCheck2 },
  { title: "Operational", url: "/app/operational", icon: Cog },
  { title: "Alerts", url: "/app/alerts", icon: Bell },
  { title: "Reports", url: "/app/reports", icon: FileBarChart2 },
  { title: "Risk History", url: "/app/history", icon: History },
  { title: "Profile", url: "/app/profile", icon: User },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const router = useRouter();
  const alerts = useStore((s) => s.alerts.filter((a) => a.status === "active").length);
  const profile = useStore((s) => s.profile);

  const onLogout = () => {
    store.logout();
    router.navigate({ to: "/login" });
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
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link to={item.url} activeOptions={{ exact: true }}>
                        <item.icon />
                        <span>{item.title}</span>
                        {item.title === "Alerts" && alerts > 0 && (
                          <span className="ml-auto text-xs font-semibold bg-destructive text-destructive-foreground rounded-full px-2 py-0.5">
                            {alerts}
                          </span>
                        )}
                      </Link>
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
