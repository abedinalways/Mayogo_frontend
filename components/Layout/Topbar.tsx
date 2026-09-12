"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";
import { UserProfile } from "./UserProfile";
import { getPageMeta } from "./nav-config";

export function Topbar({
  isSidebarOpen,
  onMenuClick,
}: {
  isSidebarOpen: boolean;
  onMenuClick: () => void;
}) {
  const pathname = usePathname();
  const { title, subtitle } = getPageMeta(pathname);

  return (
    <header className="sticky top-0 z-10 flex w-full items-center justify-between gap-3 border-b border-[#e4ebf1] bg-[#f8fbfd] px-5 py-4 font-['Manrope']">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#e4ebf1] bg-white text-[#123e5e] transition-colors hover:bg-[#f3f7fb] lg:hidden"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={isSidebarOpen}
          aria-controls="dashboard-sidebar"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex min-w-0 flex-col justify-center gap-1">
          <h1 className="text-base font-medium leading-5 text-[#123e5e]">
            {title}
          </h1>
          <p className="text-xs font-normal leading-3 text-[#8a9bab]">
            {subtitle}
          </p>
        </div>
      </div>

      <HeaderActions />
    </header>
  );

}





export interface HeaderActionsProps {
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNotificationClick?: () => void;
  user?: {
    name: string;
    role: string;
    avatar: string;
  };
}

export function HeaderActions({
  onSearchChange,
  onNotificationClick,
  user = {
    name: "Daniel Green",
    role: "Admin",
    avatar: "https://placehold.co/36x36",
  },
}: HeaderActionsProps) {
  return (
    <div className="flex items-center gap-3 font-['Manrope']">
      {/* Search Input */}
      <label className="relative hidden h-9 w-56 items-center rounded-lg border border-[#e4ebf1] bg-white px-3 py-2.5 shadow-sm transition-colors focus-within:border-slate-300 md:flex">
        <span className="sr-only">Search</span>
        <Search className="h-4 w-4 shrink-0 text-[#9aaab5]" />
        <input
          type="search"
          placeholder="Type to search"
          onChange={onSearchChange}
          className="ml-2 w-full bg-transparent text-xs font-normal text-[#0f3453] placeholder:text-[#9aaab5] outline-none"
        />
      </label>

      {/* Notification Button */}
      <button
        type="button"
        onClick={onNotificationClick}
        aria-label="Notifications"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e4ebf1] bg-white text-[#f2ad1b] transition-colors hover:bg-amber-50/50"
      >
        <Bell className="h-4 w-4  text-[#f2ad1b]" />
      </button>

      {/* User Profile */}
      <div className="flex items-center gap-3">
        <img
          src={user.avatar}
          alt={user.name}
          className="h-9 w-9 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="text-base font-semibold text-[#0f3453] leading-5">
            {user.name}
          </span>
          <span className="text-xs font-normal text-slate-500 leading-tight">
            {user.role}
          </span>
        </div>
      </div>
    </div>
  );
}

