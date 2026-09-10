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

      <div className="flex items-center gap-3">
        <label className="relative hidden h-9 w-56 items-center rounded-lg border border-[#e4ebf1] bg-white px-3 py-2.5 shadow-sm md:flex">
          <span className="sr-only">Search</span>
          <Search className="h-4 w-4 shrink-0 text-[#9aaab5]" />
          <input
            type="search"
            placeholder="Type to search"
            className="ml-2 w-full bg-transparent text-xs font-normal text-[#123e5e] placeholder:text-[#9aaab5] outline-none"
          />
        </label>

        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#e4ebf1] bg-white p-2.5 text-[#e6a600] transition-colors hover:bg-amber-50/50"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" fill="currentColor" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[#e6a600]" />
        </button>

        <UserProfile />
      </div>
    </header>
  );
}