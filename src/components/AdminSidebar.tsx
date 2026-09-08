import { useRouter } from "@tanstack/react-router";
import { LayoutDashboard, Building2, ShieldAlert, FileBarChart2, User, LogOut } from "lucide-react";
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
import { AdminPageLink } from "@/components/WorkspaceLink";
import { store } from "@/lib/risk-store";
import { setPublicView, useAdminPage, type AdminPageId } from "@/lib/app-nav";

const items: { title: string; page: AdminPageId; icon: typeof LayoutDashboard }[] = [
  { title: "Dashboard", page: "dashboard", icon: LayoutDashboard },
  { title: "SME Management", page: "smes", icon: Building2 },
  { title: "Risk Monitoring", page: "risk", icon: ShieldAlert },
  { title: "Reports", page: "reports", icon: FileBarChart2 },
  { title: "Profile", page: "profile", icon: User },
];

export function AdminSidebar() {
  const page = useAdminPage();
  const router = useRouter();

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
            SA
          </span>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-montserrat text-base font-semibold text-sidebar-foreground">
              Risk Sentinel
            </span>
            <span className="text-xs text-sidebar-foreground/80">Super Admin</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = page === item.page;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <AdminPageLink page={item.page}>
                        <item.icon />
                        <span>{item.title}</span>
                      </AdminPageLink>
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
