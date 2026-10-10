"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
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
      { id: "dash", submodule: "Dashboard" },
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
];

export function RolesAndPermissionsContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const { isSuperAdmin: currentUserIsSuperAdmin } = usePermission();

  if (!currentUserIsSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-gray-100 shadow-sm mt-6">
        <ShieldAlert className="h-12 w-12 text-red-500 mb-3" />
        <h2 className="text-xl font-bold text-[#103D5C]">Access Denied</h2>
        <p className="text-sm text-gray-500 mt-1 max-w-md">
          Only Super Administrators have permission to view and configure platform roles and permissions.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 px-4 py-2 bg-[#103D5C] text-white rounded-lg text-sm font-medium hover:bg-[#0c2f47] transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const { data: roles = [], isLoading: isLoadingRoles } = useGetRolesQuery();
  const { data: allPermissions = [] } = useGetAllPermissionsQuery();

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

  const activeRoleId = useMemo(() => {
    if (roleParam && roleOptions.some((r) => r.value === roleParam)) {
      return roleParam;
    }
    return roleOptions[0]?.value || "super-admin";
  }, [roleParam, roleOptions]);

  const {
    data: rolePermissions = [],
    isLoading: isLoadingRolePermissions,
    isFetching: isFetchingRolePermissions,
  } = useGetRolePermissionsQuery(activeRoleId, {
    skip: !activeRoleId || activeRoleId === "super-admin" || activeRoleId === "admin",
  });

  const [assignRolePermissions, { isLoading: isSaving }] =
    useAssignRolePermissionsMutation();

  const [matrixData, setMatrixData] = useState<ModuleGroup[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const assignedIds = new Set(rolePermissions.map((p) => p.id));
    const assignedKeys = new Set(rolePermissions.map((p) => p.key?.toLowerCase()));

    const isSuperAdmin =
      activeRoleId === "super-admin" ||
      roleOptions.find((r) => r.value === activeRoleId)?.label.toLowerCase().includes("super");

    const built: ModuleGroup[] = BASE_MODULES.map((m) => {
      const subs: PermissionRow[] = m.submodules.map((sub) => {
        const viewPerm = allPermissions.find(
          (p) =>
            p.submodule?.toLowerCase() === sub.submodule.toLowerCase() &&
            p.action?.toUpperCase() === "VIEW"
        );
        const managePerm = allPermissions.find(
          (p) =>
            p.submodule?.toLowerCase() === sub.submodule.toLowerCase() &&
            p.action?.toUpperCase() === "MANAGE"
        );
        const allowAllPerm = allPermissions.find(
          (p) =>
            p.submodule?.toLowerCase() === sub.submodule.toLowerCase() &&
            p.action?.toUpperCase() === "ALLOW_ALL"
        );

        const hasView = isSuperAdmin
          ? true
          : viewPerm
          ? assignedIds.has(viewPerm.id) || assignedKeys.has(viewPerm.key.toLowerCase())
          : false;

        const hasManage = isSuperAdmin
          ? true
          : managePerm
          ? assignedIds.has(managePerm.id) || assignedKeys.has(managePerm.key.toLowerCase())
          : false;

        const hasAllowAll = isSuperAdmin
          ? true
          : hasView && hasManage;

        return {
          id: sub.id,
          submodule: sub.submodule,
          view: hasView,
          manage: hasManage,
          allowAll: hasAllowAll,
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

    setMatrixData(built);
  }, [activeRoleId, rolePermissions, allPermissions, roleOptions]);

  const handleRoleChange = (newRoleId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("role", newRoleId);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleTogglePermission = (
    moduleIdx: number,
    submoduleIdx: number,
    field: "view" | "manage" | "allowAll"
  ) => {
    setMatrixData((prev) => {
      const cloned = structuredClone(prev);
      const row = cloned[moduleIdx].submodules[submoduleIdx];

      if (field === "allowAll") {
        const nextState = !row.allowAll;
        row.view = nextState;
        row.manage = nextState;
        row.allowAll = nextState;
      } else {
        row[field] = !row[field];
        row.allowAll = row.view && row.manage;
      }

      return cloned;
    });
  };

  const handleSave = async () => {
    const permissionIdsToAssign: string[] = [];

    matrixData.forEach((mod) => {
      mod.submodules.forEach((sub) => {
        if (sub.view && sub.viewPermId) permissionIdsToAssign.push(sub.viewPermId);
        if (sub.manage && sub.managePermId) permissionIdsToAssign.push(sub.managePermId);
        if (sub.allowAll && sub.allowAllPermId) permissionIdsToAssign.push(sub.allowAllPermId);
      });
    });

    try {
      if (activeRoleId && activeRoleId !== "super-admin" && activeRoleId !== "admin") {
        await assignRolePermissions({
          roleId: activeRoleId,
          permissionIds: permissionIdsToAssign,
        }).unwrap();
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      // Handled by mutation
    }
  };

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
        <div className="mx-4 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-lg flex items-center justify-between">
          <span>Permissions saved successfully for this role!</span>
          <button
            type="button"
            onClick={() => setSaveSuccess(false)}
            className="text-emerald-500 hover:text-emerald-700"
          >
            ✕
          </button>
        </div>
      )}

      {isLoadingRoles || isLoadingRolePermissions || isFetchingRolePermissions ? (
        <div className="flex items-center justify-center p-16">
          <Loader2 className="h-6 w-6 animate-spin text-[#0f3453]" />
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