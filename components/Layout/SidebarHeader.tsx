"use client";

import { X } from "lucide-react";

export function SidebarHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between gap-2.5 px-4 pt-4 pb-8">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#e9b83f] bg-[#15466b] text-[10px] font-bold tracking-wide text-white">
          NP
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold leading-tight text-[#123e5e]">
            Napotech
          </p>
          <p className="text-[11px] leading-tight text-[#6c8294]">
            Admin Console
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#6c8294] transition-colors hover:bg-[#f3f7fb] hover:text-[#123e5e] lg:hidden"
        aria-label="Close sidebar"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
