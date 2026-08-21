"use client";

import * as React from "react";
import { Link } from "react-router";
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function TeamSwitcher({
  teams,
  yearName,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    logoSrc?: string;
  }[];
  yearName: string;
}) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarMenu>
      <SidebarMenuItem className="px-1 py-1.5">
        <Link
          to="/dashboard"
          className="flex items-center justify-start w-full transition-all group cursor-pointer"
          title="Dashboard"
        >
          <div className="flex items-center justify-start w-full overflow-visible">
            <img
              src="/images/logo.png"
              alt="Logo"
              className={
                isCollapsed
                  ? "size-12 object-contain rounded-md transition-transform group-hover:scale-110"
                  : "h-16 sm:h-18 w-auto max-w-[245px] object-contain rounded-md transition-transform group-hover:scale-105 filter drop-shadow-sm"
              }
            />
          </div>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

