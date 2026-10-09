"use client";

import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, LogOut, ChevronDown } from "lucide-react";
import { getPageMeta } from "./nav-config";
import { NotificationsDropdown } from "@/components/shared/NotificationsDropdown";
import { CustomDropdown } from "@/components/shared/CustomDropdown";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectCurrentUser, selectIsAuthenticated } from "@/lib/redux/features/auth/authSlice";
import { useGetProfileQuery, useLogoutAdminMutation } from "@/lib/redux/api/authApi";

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
}

export function HeaderActions({
  onSearchChange,
  onNotificationClick,
}: HeaderActionsProps) {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentUser = useAppSelector(selectCurrentUser);

  useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [logoutAdmin, { isLoading: isLoggingOut }] = useLogoutAdminMutation();

  const handleLogout = async () => {
    try {
      await logoutAdmin().unwrap();
    } catch {
      // Ignored: cleanup happens locally regardless
    } finally {
      router.push("/login");
    }
  };

  const displayName = currentUser?.fullName || "Admin User";
  const displayRole = currentUser?.role?.name || (currentUser?.isSuperAdmin ? "Super Admin" : "Admin");
  const displayEmail = currentUser?.email || "";
  const avatarUrl = currentUser?.avatar || "https://placehold.co/72x72?text=" + encodeURIComponent(displayName.charAt(0));

  return (
    <div className="flex items-center gap-3 font-['Manrope']">
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

      <NotificationsDropdown onOpen={onNotificationClick} />

      <CustomDropdown
        align="end"
        triggerClassName="flex items-center gap-2.5 p-1 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
        trigger={
          <div className="flex items-center gap-3">
            <img
              src={avatarUrl}
              alt={displayName}
              className="h-9 w-9 rounded-full object-cover border border-[#e4ebf1]"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-semibold text-[#0f3453] leading-5">
                {displayName}
              </span>
              <span className="text-[11px] font-normal text-slate-500 leading-tight">
                {displayRole}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-[#9aaab5]" />
          </div>
        }
      >
        {({ close }) => (
          <div className="w-56 p-1 bg-white rounded-xl shadow-lg border border-slate-100 font-['Manrope']">
            <div className="px-3 py-2 border-b border-slate-100">
              <p className="text-sm font-semibold text-[#0f3453] truncate">{displayName}</p>
              <p className="text-xs text-slate-500 truncate">{displayEmail}</p>
              <span className="mt-1 inline-block px-2 py-0.5 text-[10px] font-medium rounded bg-sky-50 text-sky-700">
                {displayRole}
              </span>
            </div>
            <div className="p-1">
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={async () => {
                  close();
                  await handleLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <LogOut className="h-4 w-4 text-red-500" />
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              </button>
            </div>
          </div>
        )}
      </CustomDropdown>
    </div>
  );
}
