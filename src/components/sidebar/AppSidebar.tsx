"use client";

import {
  Settings2,
  Users,
  LayoutDashboard,
  Megaphone,
  type LucideIcon,
  LogOut,
  Sparkles,
  HeartPulse,
  ShieldCheck,
  Video,
} from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import type { UserRole } from "@/types";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "@/hooks/AuthProvider";
import { useMemo } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToogle } from "./ThemeToogle";

export interface NavItem {
  title: string;
  url: string; // Used for linking and active state matching
  icon?: LucideIcon;
  isActive?: boolean; // Default open state for collapsibles
  roles?: UserRole[]; // Who can see this section? (undefined = everyone)
  items?: {
    title: string;
    url: string;
    roles?: UserRole[]; // Who can see this specific link?
  }[];
}

// Practice Sidebar Navigation Data
export const sidebardata = {
  teams: [
    {
      name: "Insight Works Therapy & Coaching",
      logo: HeartPulse,
      logoSrc: "/images/logo.png",
    },
  ],
  navMain: [
    {
      title: "Practice Care",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      roles: ["admin", "teacher", "student", "parent"],
      items: [
        { title: "Clinical Dashboard", url: "/dashboard", roles: ["admin", "teacher", "student", "parent"] },
        { title: "Appointments CRM", url: "/appointments", roles: ["admin", "teacher", "student"] },
        { title: "Appointments Calendar", url: "/events", roles: ["admin", "teacher", "student", "parent"] },
        { title: "Client Intake Queue", url: "/admin/applications", roles: ["admin", "teacher"] },
        { title: "Enrolment Pipeline", url: "/admin/pipeline", roles: ["admin", "teacher"] },
        { title: "Practice Analytics", url: "/analytics", roles: ["admin", "teacher"] },
      ],
    },
    {
      title: "Telehealth & Sessions",
      url: "#",
      icon: Video,
      isActive: true,
      roles: ["admin", "teacher", "student"],
      items: [
        { title: "Start Video Session (Lobby)", url: "/therapy-lobby/room-live", roles: ["admin", "teacher", "student"] },
        { title: "Group Live Workshops", url: "/lives", roles: ["admin", "teacher", "student"] },
        { title: "Whiteboard Canvas", url: "/whiteboard", roles: ["admin", "teacher", "student"] },
      ],
    },
    {
      title: "Clients & Practitioners",
      url: "#",
      icon: Users,
      roles: ["admin", "teacher"],
      items: [
        { title: "Client Directory", url: "/users/students", roles: ["admin", "teacher"] },
        { title: "Practitioners & Coaches", url: "/users/teachers", roles: ["admin"] },
        { title: "Family & Partners", url: "/users/parents", roles: ["admin"] },
        { title: "Practice Administrators", url: "/users/admins", roles: ["admin"] },
        { title: "New Client Intakes", url: "/admin/applications", roles: ["admin", "teacher"] },
      ],
    },
    {
      title: "System & Compliance",
      url: "#",
      icon: Settings2,
      roles: ["admin", "teacher", "student", "parent"],
      items: [
        { title: "Practice Profile & Settings", url: "/settings/general", roles: ["admin"] },
        { title: "POPIA Roles & Access", url: "/settings/roles", roles: ["admin"] },
        { title: "Blog & Publications", url: "/admin/blogs", roles: ["admin", "teacher"] },
        { title: "Manage Clinical Files", url: "/admin/resources", roles: ["admin"] },
        { title: "My Profile", url: "/profile", roles: ["admin", "teacher", "student", "parent"] },
      ],
    },
  ] as NavItem[],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, year } = useAuth();
  const { signOut } = useAuthActions();
  const location = useLocation(); // <--- Get current URL
  const pathname = location.pathname; // e.g., "/dashboard/analytics"
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const navigate = useNavigate();

  const userData = {
    name: user?.name || "User",
    email: user?.email || "",
    avatar: "",
  };

  const userRole = (user?.role || "student") as UserRole;
  const isApproved = user?.isApproved !== false || user?.role === "admin" || user?.role === "parent";

  const filteredNav = useMemo(() => {
    return sidebardata.navMain
      .filter((item) => !item.roles || item.roles.includes(userRole))
      .map((item) => {
        const isChildActive = item.items?.some((sub) => sub.url === pathname);
        const isMainActive = item.url === pathname;
        return {
          ...item,
          isActive: isMainActive || isChildActive,
          items: item.items
            ?.filter(
              (subItem) => !subItem.roles || subItem.roles.includes(userRole),
            )
            .map((subItem) => ({
              ...subItem,
              isActive: subItem.url === pathname,
            })),
        };
      })
      .filter((item) => {
        // If not approved, only show Dashboard and System menus
        if (!isApproved) {
          return item.title === "Dashboard" || item.title === "System";
        }
        return true;
      })
      .map((item) => {
        // If not approved, restrict sub-items to only dashboard and profile
        if (!isApproved) {
          if (item.title === "Dashboard") {
            return {
              ...item,
              items: item.items?.filter((sub) => sub.url === "/dashboard"),
            };
          }
          if (item.title === "System") {
            return {
              ...item,
              items: item.items?.filter((sub) => sub.url === "/profile"),
            };
          }
        }
        return item;
      });
  }, [pathname, userRole, isApproved]);

  const logout = async () => {
    try {
      await signOut();
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebardata.teams} yearName={year?.name!} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNav} />
      </SidebarContent>
      <SidebarFooter className="border-t border-zinc-200/80 dark:border-zinc-800/80 p-2 gap-2">
        <NavUser user={userData} />
        <div
          className={cn(
            "flex items-center gap-1.5 pt-1",
            isCollapsed ? "flex-col" : "justify-between"
          )}
        >
          <Button
            onClick={logout}
            variant="ghost"
            size="sm"
            className="h-8 rounded-xl px-2 text-xs font-semibold text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer gap-1.5"
            title="Log out of portal"
          >
            <LogOut className="h-3.5 w-3.5" />
            {!isCollapsed && <span>Log out</span>}
          </Button>
          {!isCollapsed && <ThemeToogle />}
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
