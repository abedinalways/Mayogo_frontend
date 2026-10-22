import React from "react";

export function SidebarSkeleton() {
  return (
    <nav
      className="flex-1 space-y-3 overflow-y-auto px-4 pb-6 pt-1 animate-pulse"
      aria-label="Loading navigation"
    >
      {/* Section 1: Core Operations */}
      <div className="space-y-1">
        <div className="flex items-center justify-between px-2 py-2.5">
          <div className="h-3.5 w-28 rounded bg-[#E2EAF1]" />
          <div className="h-3 w-3 rounded-sm bg-[#E2EAF1]" />
        </div>
        <div className="space-y-1 pl-1">
          {/* Simulated active item */}
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2.5 bg-[#123e5e]/10">
            <div className="h-4 w-4 shrink-0 rounded bg-[#123e5e]/25" />
            <div className="h-3.5 w-24 rounded bg-[#123e5e]/25" />
          </div>
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2.5">
            <div className="h-4 w-4 shrink-0 rounded bg-[#E2EAF1]" />
            <div className="h-3.5 w-20 rounded bg-[#E2EAF1]" />
          </div>
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2.5">
            <div className="h-4 w-4 shrink-0 rounded bg-[#E2EAF1]" />
            <div className="h-3.5 w-24 rounded bg-[#E2EAF1]" />
          </div>
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2.5">
            <div className="h-4 w-4 shrink-0 rounded bg-[#E2EAF1]" />
            <div className="h-3.5 w-28 rounded bg-[#E2EAF1]" />
          </div>
        </div>
      </div>

      {/* Section 2: User Management */}
      <div className="space-y-1">
        <div className="flex items-center justify-between px-2 py-2.5">
          <div className="h-3.5 w-32 rounded bg-[#E2EAF1]" />
          <div className="h-3 w-3 rounded-sm bg-[#E2EAF1]" />
        </div>
        <div className="space-y-1 pl-1">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2.5">
            <div className="h-4 w-4 shrink-0 rounded bg-[#E2EAF1]" />
            <div className="h-3.5 w-20 rounded bg-[#E2EAF1]" />
          </div>
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2.5">
            <div className="h-4 w-4 shrink-0 rounded bg-[#E2EAF1]" />
            <div className="h-3.5 w-24 rounded bg-[#E2EAF1]" />
          </div>
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2.5">
            <div className="h-4 w-4 shrink-0 rounded bg-[#E2EAF1]" />
            <div className="h-3.5 w-36 rounded bg-[#E2EAF1]" />
          </div>
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2.5">
            <div className="h-4 w-4 shrink-0 rounded bg-[#E2EAF1]" />
            <div className="h-3.5 w-32 rounded bg-[#E2EAF1]" />
          </div>
        </div>
      </div>

      {/* Section 3: Financial Management */}
      <div className="space-y-1">
        <div className="flex items-center justify-between px-2 py-2.5">
          <div className="h-3.5 w-36 rounded bg-[#E2EAF1]" />
          <div className="h-3 w-3 rounded-sm bg-[#E2EAF1]" />
        </div>
        <div className="space-y-1 pl-1">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2.5">
            <div className="h-4 w-4 shrink-0 rounded bg-[#E2EAF1]" />
            <div className="h-3.5 w-24 rounded bg-[#E2EAF1]" />
          </div>
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2.5">
            <div className="h-4 w-4 shrink-0 rounded bg-[#E2EAF1]" />
            <div className="h-3.5 w-28 rounded bg-[#E2EAF1]" />
          </div>
        </div>
      </div>

      {/* Section 4: Platform Configuration */}
      <div className="space-y-1">
        <div className="flex items-center justify-between px-2 py-2.5">
          <div className="h-3.5 w-36 rounded bg-[#E2EAF1]" />
          <div className="h-3 w-3 rounded-sm bg-[#E2EAF1]" />
        </div>
        <div className="space-y-1 pl-1">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2.5">
            <div className="h-4 w-4 shrink-0 rounded bg-[#E2EAF1]" />
            <div className="h-3.5 w-24 rounded bg-[#E2EAF1]" />
          </div>
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2.5">
            <div className="h-4 w-4 shrink-0 rounded bg-[#E2EAF1]" />
            <div className="h-3.5 w-22 rounded bg-[#E2EAF1]" />
          </div>
        </div>
      </div>
    </nav>
  );
}

