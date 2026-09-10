import { SidebarHeader } from "./SidebarHeader";
import { SidebarMenu } from "./SidebarMenu";

export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <aside
      id="dashboard-sidebar"
      className={`fixed inset-y-0 left-0 z-50 flex h-screen w-60 shrink-0 flex-col bg-[#FBFDFF] shadow-lg transition-transform duration-200 ease-out lg:sticky lg:top-0 lg:z-0 lg:translate-x-0 lg:shadow-none ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <SidebarHeader onClose={onClose} />
      <SidebarMenu onNavigate={onClose} />
    </aside>
  );
}
