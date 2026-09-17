"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  RolesAndPermissionsHeader,
  RoleType,
} from "./RolesAndPermissionsHeader";
import { PermissionsTable, ModuleGroup } from "./PermissionsTable";

const INITIAL_PERMISSIONS: Record<RoleType, ModuleGroup[]> = {
  "super-admin": [
    {
      slNo: "01",
      moduleName: "Core Operations",
      submodules: [
        { id: "dash", submodule: "Dashboard", view: false, manage: false, allowAll: false },
        { id: "jobs", submodule: "Jobs", view: false, manage: false, allowAll: false },
        { id: "disputes", submodule: "Disputes", view: false, manage: false, allowAll: false },
        { id: "tickets", submodule: "Support Tickets", view: false, manage: false, allowAll: false },
      ],
    },
    {
      slNo: "02",
      moduleName: "User Management",
      submodules: [
        { id: "clients", submodule: "Clients", view: false, manage: false, allowAll: false },
        { id: "experts", submodule: "Experts", view: false, manage: false, allowAll: false },
        { id: "verifications", submodule: "Verification Requests", view: false, manage: false, allowAll: false },
        { id: "reviews", submodule: "Review Moderation", view: false, manage: false, allowAll: false },
        { id: "admin-panel", submodule: "Admin Panel", view: false, manage: false, allowAll: false },
        { id: "roles", submodule: "Roles & Permissions", view: false, manage: false, allowAll: false },
      ],
    },
  ],
  admin: [
    {
      slNo: "01",
      moduleName: "Core Operations",
      submodules: [
        { id: "dash", submodule: "Dashboard", view: true, manage: false, allowAll: false },
        { id: "jobs", submodule: "Jobs", view: true, manage: true, allowAll: true },
        { id: "disputes", submodule: "Disputes", view: false, manage: false, allowAll: false },
        { id: "tickets", submodule: "Support Tickets", view: true, manage: false, allowAll: false },
      ],
    },
    {
      slNo: "02",
      moduleName: "User Management",
      submodules: [
        { id: "clients", submodule: "Clients", view: true, manage: false, allowAll: false },
        { id: "experts", submodule: "Experts", view: true, manage: false, allowAll: false },
        { id: "verifications", submodule: "Verification Requests", view: false, manage: false, allowAll: false },
        { id: "reviews", submodule: "Review Moderation", view: false, manage: false, allowAll: false },
        { id: "admin-panel", submodule: "Admin Panel", view: false, manage: false, allowAll: false },
        { id: "roles", submodule: "Roles & Permissions", view: false, manage: false, allowAll: false },
      ],
    },
  ],
};

export function RolesAndPermissionsContainer() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const validRole: RoleType =
    roleParam === "admin" || roleParam === "super-admin" ? roleParam : "super-admin";

  const [activeRole, setActiveRole] = useState<RoleType>(validRole);
  const [permissions, setPermissions] = useState(INITIAL_PERMISSIONS);

  useEffect(() => {
    if (roleParam === "admin" || roleParam === "super-admin") {
      setActiveRole(roleParam);
    }
  }, [roleParam]);

  const handleTogglePermission = (
    moduleIdx: number,
    submoduleIdx: number,
    field: "view" | "manage" | "allowAll"
  ) => {
    setPermissions((prev) => {
      const roleData = structuredClone(prev[activeRole]);
      const target = roleData[moduleIdx].submodules[submoduleIdx];

      if (field === "allowAll") {
        const nextState = !target.allowAll;
        target.view = nextState;
        target.manage = nextState;
        target.allowAll = nextState;
      } else {
        target[field] = !target[field];
        target.allowAll = target.view && target.manage;
      }

      return { ...prev, [activeRole]: roleData };
    });
  };

  const handleSave = () => {
    console.log(`Saved ${activeRole} permissions:`, permissions[activeRole]);
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-[#E4EBF1]  font-['Manrope']">
      <RolesAndPermissionsHeader
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        onSave={handleSave}
      />
      <PermissionsTable
        data={permissions[activeRole]}
        onTogglePermission={handleTogglePermission}
      />
    </div>
  );
}