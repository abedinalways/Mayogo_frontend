import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface SidebarMenuItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function SidebarMenuItem({
  href,
  icon: Icon,
  label,
  isActive = false,
  onClick,
}: SidebarMenuItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-1.5 py-2.5 text-sm font transition-colors font-medium ${
        isActive
          ? "bg-[#123e5e] text-white shadow-sm"
          : "text-[#123e5e] hover:bg-[#f3f7fb]"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.7} />
      <span>{label}</span>
    </Link>
  );
}
