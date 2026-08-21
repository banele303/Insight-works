"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  useSidebar();
  const navigate = useNavigate();

  return (
    <SidebarMenu>
      <SidebarMenuItem 
        className="flex items-center gap-3 cursor-pointer p-2 rounded-xl border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all group" 
        title="My Profile"
        onClick={() => navigate("/profile")}
      >
        <Avatar className="h-8 w-8 rounded-lg border border-zinc-200 dark:border-zinc-700/60 shadow-2xs">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-bold">
            {user.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-xs leading-tight">
          <span className="truncate font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{user.name}</span>
          <span className="truncate text-[10px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">{user.email}</span>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
