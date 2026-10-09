"use client";

import React from "react";
import SegmentedControl from "@/components/shared/SegmentedControl";
import { Loader2 } from "lucide-react";

export interface RoleOption {
  label: string;
  value: string;
}

interface RolesAndPermissionsHeaderProps {
  activeRole: string;
  roles?: RoleOption[];
  onRoleChange: (roleId: string) => void;
  onSave: () => void;
  isSaving?: boolean;
}

export function RolesAndPermissionsHeader({
  activeRole,
  roles = [
    { label: "Super Admin", value: "super-admin" },
    { label: "Admin", value: "admin" },
  ],
  onRoleChange,
  onSave,
  isSaving = false,
}: RolesAndPermissionsHeaderProps) {
  return (
    <div className="flex flex-wrap gap-4 justify-between items-center p-4 border-b border-[#E4EBF1] font-['Manrope']">
      <SegmentedControl
        options={roles}
        value={activeRole}
        onChange={onRoleChange}
        paramKey="role"
      />

      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="flex items-center gap-2 h-10 px-5 bg-[#103D5C] hover:bg-[#0b2841] text-white text-sm font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50"
      >
        {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
        <span>{isSaving ? "Saving..." : "Save Changes"}</span>
      </button>
    </div>
  );
}