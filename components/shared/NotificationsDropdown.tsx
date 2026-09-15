"use client";

import { Bell } from "lucide-react";
import { CustomDropdown } from "./CustomDropdown";
import { NotificationsPanel } from "./NotificationsPanel";

export type NotificationsDropdownProps = {
  onOpen?: () => void;
};

export function NotificationsDropdown({ onOpen }: NotificationsDropdownProps) {
  return (
    <CustomDropdown
      ariaLabel="Notifications"
      align="end"
      triggerClassName="flex h-9 w-9 items-center justify-center rounded-full border border-[#e4ebf1] bg-white text-[#f2ad1b] transition-colors hover:bg-amber-50/50"
      trigger={<Bell className="h-4 w-4 text-[#f2ad1b]" />}
      onOpenChange={(open) => {
        if (open) onOpen?.();
      }}
    >
      {({ close }) => <NotificationsPanel onClose={close} />}
    </CustomDropdown>
  );
}

export default NotificationsDropdown;
