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
import { PERMISSIONS } from "@/lib/permissions";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  subtitle: string;
  permission?: string;
  superAdminOnly?: boolean;
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
        permission: PERMISSIONS.DASHBOARD_VIEW,
      },
      {
        label: "Jobs",
        href: "/dashboard/jobs",
        icon: Briefcase,
        subtitle: "Track and manage platform jobs",
        permission: PERMISSIONS.JOBS_VIEW,
      },
      {
        label: "Disputes",
        href: "/dashboard/disputes",
        icon: CircleMinus,
        subtitle: "Review and resolve open disputes",
        permission: PERMISSIONS.DISPUTES_VIEW,
      },
      {
        label: "Support Ticket",
        href: "/dashboard/support-ticket",
        icon: MessagesSquare,
        subtitle: "Respond to customer support tickets",
        permission: PERMISSIONS.SUPPORT_TICKETS_VIEW,
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
        permission: PERMISSIONS.CLIENTS_VIEW,
      },
      {
        label: "Experts",
        href: "/dashboard/experts",
        icon: User,
        subtitle: "Manage expert profiles",
        permission: PERMISSIONS.EXPERTS_VIEW,
      },
      {
        label: "Verification Requests",
        href: "/dashboard/verification-requests",
        icon: ShieldCheck,
        subtitle: "Approve pending verifications",
        permission: PERMISSIONS.VERIFICATION_VIEW,
      },
      {
        label: "Review Moderation",
        href: "/dashboard/review-moderation",
        icon: Star,
        subtitle: "Moderate user reviews",
        permission: PERMISSIONS.REVIEW_MODERATION_VIEW,
      },
      {
        label: "Admin Users",
        href: "/dashboard/admin-users",
        icon: Users,
        subtitle: "Manage console administrators",
        permission: PERMISSIONS.ADMIN_PANEL_VIEW,
      },
      {
        label: "Roles & Permissions",
        href: "/dashboard/roles-permissions",
        icon: FileText,
        subtitle: "Configure roles and access",
        permission: PERMISSIONS.ROLES_PERMISSIONS_VIEW,
        superAdminOnly: true, // Restricted to Super Admin only
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
        permission: PERMISSIONS.TRANSACTIONS_VIEW,
      },
      {
        label: "Expert Payouts",
        href: "/dashboard/expert-payouts",
        icon: Folder,
        subtitle: "Release and track expert payouts",
        permission: PERMISSIONS.EXPERT_PAYOUTS_VIEW,
      },
      {
        label: "Subscriptions",
        href: "/dashboard/subscriptions",
        icon: Info,
        subtitle: "Manage subscription plans",
        permission: PERMISSIONS.SUBSCRIPTIONS_VIEW,
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
        permission: PERMISSIONS.CATEGORIES_VIEW,
      },
      {
        label: "Services",
        href: "/dashboard/services",
        icon: Wrench,
        subtitle: "Configure available services",
        permission: PERMISSIONS.SERVICES_VIEW,
      },
      {
        label: "Content Management",
        href: "/dashboard/content",
        icon: Files,
        subtitle: "Update platform content",
        permission: PERMISSIONS.CONTENT_VIEW,
      },
      {
        label: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        subtitle: "Adjust platform settings",
        permission: PERMISSIONS.SETTINGS_VIEW,
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
        permission: PERMISSIONS.ANALYTICS_VIEW,
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
