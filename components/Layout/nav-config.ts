import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  CircleMinus,
  FileText,
  Files,
  Folder,
  Info,
  LayoutGrid,
  LineChart,
  MessagesSquare,
  Settings,
  ShieldCheck,
  Star,
  User,
  Users,
  Wrench,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  subtitle: string;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const navSections: NavSection[] = [
  {
    title: "Core Operations",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutGrid,
        subtitle: "Platform performance at a glance",
      },
      {
        label: "Jobs",
        href: "/dashboard/jobs",
        icon: Briefcase,
        subtitle: "Track and manage platform jobs",
      },
      {
        label: "Disputes",
        href: "/dashboard/disputes",
        icon: CircleMinus,
        subtitle: "Review and resolve open disputes",
      },
      {
        label: "Support Ticket",
        href: "/dashboard/support-ticket",
        icon: MessagesSquare,
        subtitle: "Respond to customer support tickets",
      },
    ],
  },
  {
    title: "User Management",
    items: [
      {
        label: "Clients",
        href: "/dashboard/clients",
        icon: User,
        subtitle: "Manage client accounts",
      },
      {
        label: "Experts",
        href: "/dashboard/experts",
        icon: User,
        subtitle: "Manage expert profiles",
      },
      {
        label: "Verification Requests",
        href: "/dashboard/verification-requests",
        icon: ShieldCheck,
        subtitle: "Approve pending verifications",
      },
      {
        label: "Review Moderation",
        href: "/dashboard/review-moderation",
        icon: Star,
        subtitle: "Moderate user reviews",
      },
      {
        label: "Admin Users",
        href: "/dashboard/admin-users",
        icon: Users,
        subtitle: "Manage console administrators",
      },
      {
        label: "Roles & Permissions",
        href: "/dashboard/roles-permissions",
        icon: FileText,
        subtitle: "Configure roles and access",
      },
    ],
  },
  {
    title: "Financial Management",
    items: [
      {
        label: "Transactions",
        href: "/dashboard/transactions",
        icon: LayoutGrid,
        subtitle: "View platform transactions",
      },
      {
        label: "Expert Payouts",
        href: "/dashboard/expert-payouts",
        icon: Folder,
        subtitle: "Release and track expert payouts",
      },
      {
        label: "Subscriptions",
        href: "/dashboard/subscriptions",
        icon: Info,
        subtitle: "Manage subscription plans",
      },
    ],
  },
  {
    title: "Platform Configurations",
    items: [
      {
        label: "Categories",
        href: "/dashboard/categories",
        icon: LayoutGrid,
        subtitle: "Organize service categories",
      },
      {
        label: "Services",
        href: "/dashboard/services",
        icon: Wrench,
        subtitle: "Configure available services",
      },
      {
        label: "Content Management",
        href: "/dashboard/content",
        icon: Files,
        subtitle: "Update platform content",
      },
      {
        label: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        subtitle: "Adjust platform settings",
      },
    ],
  },
  {
    title: "Insights",
    items: [
      {
        label: "Analytics & Reports",
        href: "/dashboard/analytics",
        icon: LineChart,
        subtitle: "Explore analytics and reports",
      },
    ],
  },
];

export const navItems = navSections.flatMap((section) => section.items);

export function isPathActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getActiveNavItem(pathname: string) {
  return navItems
    .filter((item) => isPathActive(pathname, item.href))
    .sort((a, b) => b.href.length - a.href.length)[0];
}

export function getPageMeta(pathname: string) {
  const item = getActiveNavItem(pathname);

  return {
    title: item?.label ?? "Dashboard",
    subtitle: item?.subtitle ?? "Platform performance at a glance",
  };
}
