"use client";

import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { SidebarSkeleton } from "./SidebarSkeleton";
import { getActiveNavItem, isPathActive, navSections, NavSection } from "./nav-config";
import { usePermission } from "@/lib/permissions";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthLoading,
} from "@/lib/redux/features/auth/authSlice";
import { useGetProfileQuery } from "@/lib/redux/api/authApi";

export function SidebarMenu({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentUser = useAppSelector(selectCurrentUser);
  const authLoading = useAppSelector(selectAuthLoading);

  const { isError: isProfileError } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  const { isSuperAdmin, can } = usePermission();

  // Filter sections and items dynamically according to user permissions
  const filteredSections: NavSection[] = useMemo(() => {
    return navSections
      .map((section) => {
        const visibleItems = section.items.filter((item) => {
          if (item.superAdminOnly && !isSuperAdmin) return false;
          if (item.permission && !can(item.permission)) return false;
          return true;
        });

        return {
          ...section,
          items: visibleItems,
        };
      })
      .filter((section) => section.items.length > 0);
  }, [isSuperAdmin, can]);

  const activeHref = getActiveNavItem(pathname)?.href;
  const [trackedPath, setTrackedPath] = useState(pathname);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    return Object.fromEntries(
      navSections.map((section) => [
        section.title,
        section.items.some((item) => isPathActive(pathname, item.href)),
      ])
    );
  });

  if (trackedPath !== pathname) {
    setTrackedPath(pathname);
    setOpenSections((prev) => {
      const next = { ...prev };
      for (const section of filteredSections) {
        if (section.items.some((item) => isPathActive(pathname, item.href))) {
          next[section.title] = true;
        }
      }
      return next;
    });
  }

  const toggleSection = (sectionTitle: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  const isInitialLoading =
    authLoading ||
    (isAuthenticated && !currentUser && !isProfileError);

  if (isInitialLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-4 pb-6">
      {filteredSections.map((section) => {
        const isOpen = Boolean(openSections[section.title]);

        return (
          <div key={section.title}>
            <button
              type="button"
              onClick={() => toggleSection(section.title)}
              className="flex w-full items-center justify-between rounded-md px-2 py-2.5 text-[13px] font-medium text-[#123e5e] hover:bg-[#f3f7fb]"
              aria-expanded={isOpen}
            >
              <span>{section.title}</span>
              <ChevronDown
                className={`h-4 w-4 text-[#6c8294] transition-transform duration-200 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {isOpen ? (
              <div className="mb-1 space-y-0.5 pl-1">
                {section.items.map((item) => (
                  <SidebarMenuItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    isActive={item.href === activeHref}
                    onClick={onNavigate}
                  />
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
