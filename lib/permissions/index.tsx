"use client";

import React, { useMemo, useCallback } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectCurrentUser } from "@/lib/redux/features/auth/authSlice";
import { AdminUser } from "@/types/auth.types";

/**
 * Standard Permission Key Mapping matching backend format:
 * "<module>.<submodule>.<action>"
 */
export const PERMISSIONS = {
  // Core Operations
  DASHBOARD_VIEW: "core.operations.dashboard.view",
  DASHBOARD_MANAGE: "core.operations.dashboard.manage",
  DASHBOARD_ALLOW_ALL: "core.operations.dashboard.allow_all",

  JOBS_VIEW: "core.operations.jobs.view",
  JOBS_MANAGE: "core.operations.jobs.manage",
  JOBS_ALLOW_ALL: "core.operations.jobs.allow_all",

  DISPUTES_VIEW: "core.operations.disputes.view",
  DISPUTES_MANAGE: "core.operations.disputes.manage",
  DISPUTES_ALLOW_ALL: "core.operations.disputes.allow_all",

  SUPPORT_TICKETS_VIEW: "core.operations.support.tickets.view",
  SUPPORT_TICKETS_MANAGE: "core.operations.support.tickets.manage",
  SUPPORT_TICKETS_ALLOW_ALL: "core.operations.support.tickets.allow_all",

  // User Management
  CLIENTS_VIEW: "user.management.clients.view",
  CLIENTS_MANAGE: "user.management.clients.manage",
  CLIENTS_ALLOW_ALL: "user.management.clients.allow_all",

  EXPERTS_VIEW: "user.management.experts.view",
  EXPERTS_MANAGE: "user.management.experts.manage",
  EXPERTS_ALLOW_ALL: "user.management.experts.allow_all",

  VERIFICATION_VIEW: "user.management.verification.requests.view",
  VERIFICATION_MANAGE: "user.management.verification.requests.manage",
  VERIFICATION_ALLOW_ALL: "user.management.verification.requests.allow_all",

  REVIEW_MODERATION_VIEW: "user.management.review.moderation.view",
  REVIEW_MODERATION_MANAGE: "user.management.review.moderation.manage",
  REVIEW_MODERATION_ALLOW_ALL: "user.management.review.moderation.allow_all",

  ADMIN_PANEL_VIEW: "user.management.admin.panel.view",
  ADMIN_PANEL_MANAGE: "user.management.admin.panel.manage",
  ADMIN_PANEL_ALLOW_ALL: "user.management.admin.panel.allow_all",

  ROLES_PERMISSIONS_VIEW: "user.management.roles.permissions.view",
  ROLES_PERMISSIONS_MANAGE: "user.management.roles.permissions.manage",
  ROLES_PERMISSIONS_ALLOW_ALL: "user.management.roles.permissions.allow_all",

  // Financial Management
  TRANSACTIONS_VIEW: "financial.management.transactions.view",
  TRANSACTIONS_MANAGE: "financial.management.transactions.manage",
  TRANSACTIONS_ALLOW_ALL: "financial.management.transactions.allow_all",

  EXPERT_PAYOUTS_VIEW: "financial.management.expert.payouts.view",
  EXPERT_PAYOUTS_MANAGE: "financial.management.expert.payouts.manage",
  EXPERT_PAYOUTS_ALLOW_ALL: "financial.management.expert.payouts.allow_all",

  SUBSCRIPTIONS_VIEW: "financial.management.subscriptions.view",
  SUBSCRIPTIONS_MANAGE: "financial.management.subscriptions.manage",
  SUBSCRIPTIONS_ALLOW_ALL: "financial.management.subscriptions.allow_all",

  // Platform Configuration
  CATEGORIES_VIEW: "platform.configuration.categories.view",
  CATEGORIES_MANAGE: "platform.configuration.categories.manage",
  CATEGORIES_ALLOW_ALL: "platform.configuration.categories.allow_all",

  SERVICES_VIEW: "platform.configuration.services.view",
  SERVICES_MANAGE: "platform.configuration.services.manage",
  SERVICES_ALLOW_ALL: "platform.configuration.services.allow_all",

  CONTENT_VIEW: "platform.configuration.content.management.view",
  CONTENT_MANAGE: "platform.configuration.content.management.manage",
  CONTENT_ALLOW_ALL: "platform.configuration.content.management.allow_all",

  SETTINGS_VIEW: "platform.configuration.settings.view",
  SETTINGS_MANAGE: "platform.configuration.settings.manage",
  SETTINGS_ALLOW_ALL: "platform.configuration.settings.allow_all",

  // Insights
  ANALYTICS_VIEW: "insights.analytics.view",
  ANALYTICS_MANAGE: "insights.analytics.manage",
  ANALYTICS_ALLOW_ALL: "insights.analytics.allow_all",

  REPORTS_VIEW: "insights.reports.view",
  REPORTS_MANAGE: "insights.reports.manage",
  REPORTS_ALLOW_ALL: "insights.reports.allow_all",
} as const;

export type PermissionKey = string;

/**
 * Extracts normalized permission string list from user object
 */
export function getUserPermissions(user: AdminUser | null): string[] {
  if (!user) return [];
  if (Array.isArray(user.permissions) && user.permissions.length > 0) {
    return user.permissions.map((p) => String(p));
  }
  if (user.role && Array.isArray(user.role.permissions)) {
    return user.role.permissions.map((p) => {
      if (typeof p === "string") return p;
      const permObj = p as { key?: string; name?: string };
      return permObj.key || permObj.name || "";
    });
  }
  return [];
}

/**
 * Central pure check for permission
 * - If user is Super Admin: returns true immediately
 * - If checking for a 'view' action: returns true if user has 'view', 'manage', or 'allow_all' for that module
 * - If checking for 'manage': returns true if user has 'manage' or 'allow_all'
 */
export function hasPermission(
  user: AdminUser | null,
  requiredPermission: string | string[]
): boolean {
  if (!user) return false;
  if (user.isSuperAdmin) return true;

  const userPerms = new Set(getUserPermissions(user));
  const reqList = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];

  return reqList.some((req) => {
    if (userPerms.has(req)) return true;

    // Check wildcard module-level allow_all (e.g. core.operations.jobs.allow_all)
    const parts = req.split(".");
    if (parts.length >= 3) {
      const moduleSubmodule = parts.slice(0, parts.length - 1).join(".");
      const action = parts[parts.length - 1];

      // allow_all covers everything
      if (userPerms.has(`${moduleSubmodule}.allow_all`)) return true;

      // manage also covers view
      if (action === "view" && userPerms.has(`${moduleSubmodule}.manage`)) return true;
    }

    return false;
  });
}

/**
 * Central hook for checking permissions anywhere in the application
 */
export function usePermission() {
  const user = useAppSelector(selectCurrentUser);
  const isSuperAdmin = Boolean(user?.isSuperAdmin);

  const permissions = useMemo(() => getUserPermissions(user), [user]);

  const can = useCallback(
    (requiredPermission: string | string[]) => {
      return hasPermission(user, requiredPermission);
    },
    [user]
  );

  const canManage = useCallback(
    (moduleSubmodule: string) => {
      if (isSuperAdmin) return true;
      return can(`${moduleSubmodule}.manage`);
    },
    [isSuperAdmin, can]
  );

  return {
    user,
    isSuperAdmin,
    permissions,
    can,
    canManage,
  };
}

/**
 * PermissionGate Component:
 * Conditionally render UI (e.g. Action buttons, sections) based on permissions.
 */
export interface PermissionGateProps {
  permission?: string | string[];
  superAdminOnly?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

import { useToast } from "@/components/shared/Toast/ToastContext";

export { useToast } from "@/components/shared/Toast/ToastContext";

/**
 * Hook for action buttons that allows clicking to trigger a user-friendly toast
 * when the user only has view permission instead of manage/allow_all permission.
 */
export function usePermissionAction(moduleSubmodule: string) {
  const { isSuperAdmin, canManage } = usePermission();
  const { showRestrictedToast } = useToast();

  const isAllowedToManage = isSuperAdmin || canManage(moduleSubmodule);

  const executeIfAllowed = useCallback(
    (actionFn: () => void, deniedMessage?: string) => {
      if (isAllowedToManage) {
        actionFn();
      } else {
        showRestrictedToast(
          deniedMessage ||
            "You only have view permission for this feature. Management permission (Manage / Allow All) is required to perform this action."
        );
      }
    },
    [isAllowedToManage, showRestrictedToast]
  );

  return {
    isAllowedToManage,
    canManage: isAllowedToManage,
    executeIfAllowed,
  };
}

export function PermissionGate({
  permission,
  superAdminOnly = false,
  children,
  fallback = null,
}: PermissionGateProps) {
  const { isSuperAdmin, can } = usePermission();

  if (superAdminOnly && !isSuperAdmin) {
    return <>{fallback}</>;
  }

  if (permission && !can(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
