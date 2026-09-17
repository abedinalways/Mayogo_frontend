"use client";

import React from "react";
import SegmentedControl from "@/components/shared/SegmentedControl";

export type RoleType = "super-admin" | "admin";

interface RolesAndPermissionsHeaderProps {
  activeRole: RoleType;
  onRoleChange: (role: RoleType) => void;
  onSave: () => void;
  isSaving?: boolean;
}

export function RolesAndPermissionsHeader({
  activeRole,
  onRoleChange,
  onSave,
  isSaving = false,
}: RolesAndPermissionsHeaderProps) {
  return (
    <div className="flex justify-between items-center p-4 border-b border-[#E4EBF1] font-['Manrope']">
      {/* Role Toggle Switcher */}
      <SegmentedControl
        options={[
          { label: "Super Admin", value: "super-admin" },
          { label: "Admin", value: "admin" },
        ]}
        value={activeRole}
        onChange={onRoleChange}
        paramKey="role"
      />

      {/* Save Button */}
      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="h-10 px-5 bg-[#103D5C] hover:bg-[#0b2841] text-white text-sm font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}