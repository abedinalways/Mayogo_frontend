"use client";

import { CustomAmberCheckbox } from "@/components/shared/CustomAmberCheckbox";
import React from "react";

export interface PermissionRow {
  id: string;
  submodule: string;
  view: boolean;
  manage: boolean;
  allowAll: boolean;
}

export interface ModuleGroup {
  slNo: string;
  moduleName: string;
  submodules: PermissionRow[];
}

interface PermissionsTableProps {
  data: ModuleGroup[];
  onTogglePermission: (
    moduleIndex: number,
    submoduleIndex: number,
    field: "view" | "manage" | "allowAll"
  ) => void;
}

export function PermissionsTable({
  data,
  onTogglePermission,
}: PermissionsTableProps) {
  return (
    <div className="w-full overflow-x-auto  font-['Manrope']">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-[#F8FAFC] text-[#64748B] text-xs font-semibold border-b border-[#E4EBF1]">
            <th className="py-3 px-4 w-16 text-nowrap">Sl No.</th>
            <th className="py-3 px-4 min-w-[180px]">Module</th>
            <th className="py-3 px-4 min-w-[200px]">Submodule</th>
            <th className="py-3 px-4 w-28 text-center">View</th>
            <th className="py-3 px-4 w-28 text-center">Manage</th>
            <th className="py-3 px-4 w-28 text-center">Allow All</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E4EBF1]">
          {data.map((moduleGroup, modIdx) =>
            moduleGroup.submodules.map((sub, subIdx) => {
              const isFirstRowOfModule = subIdx === 0;

              return (
                <tr
                  key={sub.id}
                  className="hover:bg-slate-50/50 transition-colors text-sm"
                >
                  {/* Rowspan Module Sl No and Name */}
                  {isFirstRowOfModule ? (
                    <>
                      <td
                        rowSpan={moduleGroup.submodules.length}
                        className="py-4 px-4 align-top font-medium text-slate-500 border-r border-[#E4EBF1]/60"
                      >
                        {moduleGroup.slNo}
                      </td>
                      <td
                        rowSpan={moduleGroup.submodules.length}
                        className="py-4 px-4 align-top font-semibold text-[#103D5C] border-r border-[#E4EBF1]/60"
                      >
                        {moduleGroup.moduleName}
                      </td>
                    </>
                  ) : null}

                  {/* Submodule Title */}
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {sub.submodule}
                  </td>

                  {/* Checkboxes */}
                  <td className="py-3.5 px-4 text-center">
                    <CustomAmberCheckbox
                      checked={sub.view}
                      onChange={() => onTogglePermission(modIdx, subIdx, "view")}
                      ariaLabel={`View permission for ${sub.submodule}`}
                    />
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <CustomAmberCheckbox
                      checked={sub.manage}
                      onChange={() => onTogglePermission(modIdx, subIdx, "manage")}
                      ariaLabel={`Manage permission for ${sub.submodule}`}
                    />
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <CustomAmberCheckbox
                      checked={sub.allowAll}
                      onChange={() => onTogglePermission(modIdx, subIdx, "allowAll")}
                      ariaLabel={`Allow All permissions for ${sub.submodule}`}
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}