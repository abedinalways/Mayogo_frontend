"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, ShieldAlert, AlertCircle, CheckCircle2 } from "lucide-react";
import { usePermission } from "@/lib/permissions";
import {
  RolesAndPermissionsHeader,
  RoleOption,
} from "./RolesAndPermissionsHeader";
import { PermissionsTable, ModuleGroup, PermissionRow } from "./PermissionsTable";
import {
  useGetRolesQuery,
  useGetAllPermissionsQuery,
  useGetRolePermissionsQuery,
  useAssignRolePermissionsMutation,
} from "@/lib/redux/api/roleApi";
import { PermissionItem } from "@/types/role.types";

const BASE_MODULES = [
  {
    slNo: "01",
    moduleName: "Core Operations",
    submodules: [
      { id: "dashboard", submodule: "Dashboard" },
      { id: "jobs", submodule: "Jobs" },
      { id: "disputes", submodule: "Disputes" },
      { id: "tickets", submodule: "Support Tickets" },
    ],
  },
  {
    slNo: "02",
    moduleName: "User Management",
    submodules: [
      { id: "clients", submodule: "Clients" },
      { id: "experts", submodule: "Experts" },
      { id: "verifications", submodule: "Verification Requests" },
      { id: "reviews", submodule: "Review Moderation" },
      { id: "admin-panel", submodule: "Admin Panel" },
      { id: "roles", submodule: "Roles & Permissions" },
    ],
  },
  {
    slNo: "03",
    moduleName: "Financial Management",
    submodules: [
      { id: "transactions", submodule: "Transactions" },
      { id: "expert-payouts", submodule: "Expert Payouts" },
      { id: "subscriptions", submodule: "Subscriptions" },
    ],
  },
  {
    slNo: "04",
    moduleName: "Platform Configurations",
    submodules: [
      { id: "categories", submodule: "Categories" },
      { id: "services", submodule: "Services" },
      { id: "content", submodule: "Content Management" },
      { id: "settings", submodule: "Settings" },
    ],
  },
  {
    slNo: "05",
    moduleName: "Insights",
    submodules: [
      { id: "analytics", submodule: "Analytics" },
      { id: "reports", submodule: "Reports" },
    ],
  },
];

const normalize = (str?: string) => (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");

export function RolesAndPermissionsContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const { isSuperAdmin: currentUserIsSuperAdmin } = usePermission();

  // 1. Fetch all roles
  const { data: roles = [], isLoading: isLoadingRoles } = useGetRolesQuery();

  // 2. Fetch all permissions (/api/admin/roles/permissions) to get their IDs
  const {
    data: allPermissions = [],
    isLoading: isLoadingAllPermissions,
    error: allPermissionsError,
  } = useGetAllPermissionsQuery({ limit: 100 });

  // 3. Format roles for SegmentedControl
  const roleOptions: RoleOption[] = useMemo(() => {
    if (roles.length > 0) {
      return roles.map((r) => ({
        label: r.name,
        value: r.id,
      }));
    }
    return [
      { label: "Super Admin", value: "super-admin" },
      { label: "Admin", value: "admin" },
    ];
  }, [roles]);

  // 4. Resolve the currently active role ID
  const activeRoleId = useMemo(() => {
    if (roleParam && roleOptions.some((r) => r.value === roleParam)) {
      return roleParam;
    }
    return roleOptions[0]?.value || "";
  }, [roleParam, roleOptions]);

  // 5. Fetch assigned permissions for this active role (/api/admin/roles/{roleId}/permissions)
  const {
    data: rolePermissions = [],
    isLoading: isLoadingRolePermissions,
    isFetching: isFetchingRolePermissions,
  } = useGetRolePermissionsQuery(activeRoleId, {
    skip: !activeRoleId,
  });

  // 6. Assign mutation (/api/admin/roles/{roleId}/permissions)
  const [assignRolePermissions, { isLoading: isSaving }] =
    useAssignRolePermissionsMutation();

  const [overrides, setOverrides] = useState<
    Record<string, { view?: boolean; manage?: boolean; allowAll?: boolean }>
  >({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // 7. Purely derived matrix data without set-state in effect
  const matrixData: ModuleGroup[] = useMemo(() => {
    const assignedIds = new Set<string>();
    const assignedKeys = new Set<string>();

    rolePermissions.forEach((p: unknown) => {
      if (typeof p === "string") {
        assignedIds.add(p);
      } else if (p && typeof p === "object") {
        const item = p as PermissionItem;
        if (item.id) assignedIds.add(item.id);
        if (item.key) {
          assignedKeys.add(item.key.toLowerCase());
          assignedKeys.add(normalize(item.key));
        }
      }
    });

    const activeRoleObj = roleOptions.find((r) => r.value === activeRoleId);
    const isSuperAdminRole =
      activeRoleObj?.label.toLowerCase().includes("super") ||
      activeRoleId === "super-admin";

    // Helper to match permission by action and submodule / key
    const findPerm = (
      submoduleName: string,
      subId: string,
      action: "VIEW" | "MANAGE" | "ALLOW_ALL"
    ): PermissionItem | undefined => {
      const act = action.toUpperCase();
      const subNorm = normalize(submoduleName);
      const idNorm = normalize(subId);

      return allPermissions.find((p) => {
        const pAct = (p.action || "").toUpperCase();
        const pKey = (p.key || "").toLowerCase();

        const actionMatch =
          pAct === act ||
          (act === "VIEW" && pKey.endsWith(".view")) ||
          (act === "MANAGE" && pKey.endsWith(".manage")) ||
          (act === "ALLOW_ALL" && (pAct === "ALL" || pKey.endsWith(".allow_all") || pKey.endsWith(".all")));

        if (!actionMatch) return false;

        const pSubNorm = normalize(p.submodule);
        const pKeyStripped = normalize(pKey);

        return (
          pSubNorm === subNorm ||
          pSubNorm === idNorm ||
          (subNorm && pKeyStripped.includes(subNorm)) ||
          (idNorm && pKeyStripped.includes(idNorm)) ||
          (subNorm && pKey.includes(subNorm)) ||
          (idNorm && pKey.includes(idNorm))
        );
      });
    };

    const matchedPermIds = new Set<string>();

    const built: ModuleGroup[] = BASE_MODULES.map((m) => {
      const subs: PermissionRow[] = m.submodules.map((sub) => {
        const viewPerm = findPerm(sub.submodule, sub.id, "VIEW");
        const managePerm = findPerm(sub.submodule, sub.id, "MANAGE");
        const allowAllPerm = findPerm(sub.submodule, sub.id, "ALLOW_ALL");

        if (viewPerm?.id) matchedPermIds.add(viewPerm.id);
        if (managePerm?.id) matchedPermIds.add(managePerm.id);
        if (allowAllPerm?.id) matchedPermIds.add(allowAllPerm.id);

        const hasView = isSuperAdminRole
          ? true
          : Boolean(
            (viewPerm?.id && assignedIds.has(viewPerm.id)) ||
            (viewPerm?.key && assignedKeys.has(viewPerm.key.toLowerCase())) ||
            (viewPerm?.key && assignedKeys.has(normalize(viewPerm.key)))
          );

        const hasManage = isSuperAdminRole
          ? true
          : Boolean(
            (managePerm?.id && assignedIds.has(managePerm.id)) ||
            (managePerm?.key && assignedKeys.has(managePerm.key.toLowerCase())) ||
            (managePerm?.key && assignedKeys.has(normalize(managePerm.key)))
          );

        const hasAllowAll = isSuperAdminRole
          ? true
          : Boolean(
            (allowAllPerm?.id && assignedIds.has(allowAllPerm.id)) ||
            (allowAllPerm?.key && assignedKeys.has(allowAllPerm.key.toLowerCase())) ||
            (allowAllPerm?.key && assignedKeys.has(normalize(allowAllPerm.key))) ||
            (hasView && hasManage)
          );

        const rowOverride = overrides[sub.id];

        return {
          id: sub.id,
          submodule: sub.submodule,
          view: rowOverride?.view ?? hasView,
          manage: rowOverride?.manage ?? hasManage,
          allowAll: rowOverride?.allowAll ?? hasAllowAll,
          viewPermId: viewPerm?.id,
          managePermId: managePerm?.id,
          allowAllPermId: allowAllPerm?.id,
        };
      });

      return {
        slNo: m.slNo,
        moduleName: m.moduleName,
        submodules: subs,
      };
    });

    // Check if there are any additional permissions in allPermissions that weren't mapped
    const unmapped = allPermissions.filter((p) => p.id && !matchedPermIds.has(p.id));
    if (unmapped.length > 0) {
      const unmappedGroups = new Map<string, PermissionItem[]>();
      unmapped.forEach((p) => {
        const modKey = p.module || "Additional Permissions";
        if (!unmappedGroups.has(modKey)) unmappedGroups.set(modKey, []);
        unmappedGroups.get(modKey)!.push(p);
      });

      let nextSl = built.length + 1;
      unmappedGroups.forEach((perms, modName) => {
        const subMap = new Map<
          string,
          { view?: PermissionItem; manage?: PermissionItem; allowAll?: PermissionItem }
        >();
        perms.forEach((p) => {
          const subKey = p.submodule || p.key || "General";
          if (!subMap.has(subKey)) subMap.set(subKey, {});
          const current = subMap.get(subKey)!;
          const pAct = (p.action || "").toUpperCase();
          if (pAct === "VIEW" || p.key.endsWith(".view")) current.view = p;
          else if (pAct === "MANAGE" || p.key.endsWith(".manage")) current.manage = p;
          else current.allowAll = p;
        });

        const subs: PermissionRow[] = Array.from(subMap.entries()).map(([subName, pair], idx) => {
          const subId = `extra-${nextSl}-${idx}`;
          const hasView = isSuperAdminRole
            ? true
            : Boolean(
              (pair.view?.id && assignedIds.has(pair.view.id)) ||
              (pair.view?.key && assignedKeys.has(pair.view.key.toLowerCase())) ||
              (pair.view?.key && assignedKeys.has(normalize(pair.view.key)))
            );
          const hasManage = isSuperAdminRole
            ? true
            : Boolean(
              (pair.manage?.id && assignedIds.has(pair.manage.id)) ||
              (pair.manage?.key && assignedKeys.has(pair.manage.key.toLowerCase())) ||
              (pair.manage?.key && assignedKeys.has(normalize(pair.manage.key)))
            );
          const hasAllowAll = isSuperAdminRole
            ? true
            : Boolean(
              (pair.allowAll?.id && assignedIds.has(pair.allowAll.id)) ||
              (pair.allowAll?.key && assignedKeys.has(pair.allowAll.key.toLowerCase())) ||
              (pair.allowAll?.key && assignedKeys.has(normalize(pair.allowAll.key))) ||
              (hasView && hasManage)
            );

          const rowOverride = overrides[subId];

          return {
            id: subId,
            submodule: subName,
            view: rowOverride?.view ?? hasView,
            manage: rowOverride?.manage ?? hasManage,
            allowAll: rowOverride?.allowAll ?? hasAllowAll,
            viewPermId: pair.view?.id,
            managePermId: pair.manage?.id,
            allowAllPermId: pair.allowAll?.id,
          };
        });

        built.push({
          slNo: String(nextSl).padStart(2, "0"),
          moduleName: modName,
          submodules: subs,
        });
        nextSl++;
      });
    }

    return built;
  }, [activeRoleId, rolePermissions, allPermissions, roleOptions, overrides]);

  // Early return check rendered AFTER all hooks to preserve hook order
  if (!currentUserIsSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-gray-100 shadow-sm mt-6 font-['Manrope']">
        <ShieldAlert className="h-12 w-12 text-red-500 mb-3" />
        <h2 className="text-xl font-bold text-[#103D5C]">Access Denied</h2>
        <p className="text-sm text-gray-500 mt-1 max-w-md">
          Only Super Administrators have permission to view and configure platform roles and permissions.
        </p>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mt-4 px-4 py-2 bg-[#103D5C] text-white rounded-lg text-sm font-medium hover:bg-[#0c2f47] transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const handleRoleChange = (newRoleId: string) => {
    setApiError(null);
    setOverrides({});
    const params = new URLSearchParams(searchParams.toString());
    params.set("role", newRoleId);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleTogglePermission = (
    moduleIdx: number,
    submoduleIdx: number,
    field: "view" | "manage" | "allowAll"
  ) => {
    const row = matrixData[moduleIdx]?.submodules[submoduleIdx];
    if (!row) return;

    setOverrides((prev) => {
      const current = prev[row.id] || {
        view: row.view,
        manage: row.manage,
        allowAll: row.allowAll,
      };

      if (field === "allowAll") {
        const nextState = !current.allowAll;
        return {
          ...prev,
          [row.id]: {
            view: nextState,
            manage: nextState,
            allowAll: nextState,
          },
        };
      }

      const nextFieldVal = !current[field];
      const otherField = field === "view" ? "manage" : "view";
      const otherVal = current[otherField] ?? row[otherField];

      return {
        ...prev,
        [row.id]: {
          ...current,
          [field]: nextFieldVal,
          allowAll: nextFieldVal && otherVal,
        },
      };
    });
  };

  const handleSave = async () => {
    if (!activeRoleId) return;
    setApiError(null);

    const permissionIdsToAssign: string[] = [];

    matrixData.forEach((mod) => {
      mod.submodules.forEach((sub) => {
        if (sub.view && sub.viewPermId) {
          permissionIdsToAssign.push(sub.viewPermId);
        }
        if (sub.manage && sub.managePermId) {
          permissionIdsToAssign.push(sub.managePermId);
        }
        if (sub.allowAll && sub.allowAllPermId) {
          permissionIdsToAssign.push(sub.allowAllPermId);
        }
      });
    });

    const uniqueIds = Array.from(new Set(permissionIdsToAssign));

    // Guard: If the user checked items but no IDs could be resolved from allPermissions
    const anyChecked = matrixData.some((mod) =>
      mod.submodules.some((s) => s.view || s.manage || s.allowAll)
    );
    if (anyChecked && uniqueIds.length === 0) {
      setApiError(
        "Permissions could not be matched with backend IDs. Please make sure all permissions are loaded and refresh the page."
      );
      return;
    }

    try {
      await assignRolePermissions({
        roleId: activeRoleId,
        permissionIds: uniqueIds,
      }).unwrap();

      setOverrides({});
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string }; message?: string };
      setApiError(
        errorObj?.data?.message ||
        errorObj?.message ||
        "Failed to assign permissions to role. Please try again."
      );
    }
  };

  const isTableLoading =
    isLoadingRoles ||
    isLoadingAllPermissions ||
    isLoadingRolePermissions ||
    isFetchingRolePermissions;

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-[#E4EBF1] font-['Manrope']">
      <RolesAndPermissionsHeader
        activeRole={activeRoleId}
        roles={roleOptions}
        onRoleChange={handleRoleChange}
        onSave={handleSave}
        isSaving={isSaving}
      />

      {saveSuccess && (
        <div className="mx-4 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center justify-between transition-all">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Permissions successfully updated for this role!</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccess(false)}
            className="text-emerald-500 hover:text-emerald-700"
          >
            ✕
          </button>
        </div>
      )}

      {apiError && (
        <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold rounded-lg flex items-center justify-between transition-all">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span>{apiError}</span>
          </div>
          <button
            type="button"
            onClick={() => setApiError(null)}
            className="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {allPermissionsError && !apiError && (
        <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold rounded-lg flex items-center justify-between transition-all">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span>
              Failed to load permissions from backend. Please check your network connection.
            </span>
          </div>
        </div>
      )}

      {isTableLoading ? (
        <div className="flex flex-col items-center justify-center p-16 gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-[#103D5C]" />
          <span className="text-xs text-slate-500 font-medium">Loading permissions data...</span>
        </div>
      ) : (
        <PermissionsTable
          data={matrixData}
          onTogglePermission={handleTogglePermission}
        />
      )}
    </div>
  );
}

export default RolesAndPermissionsContainer;