"use client";

import { useMemo, useState } from "react";
import { DollarSign, Minus, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";

type NotificationTab = "unread" | "read";

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  group: "Today" | "Yesterday";
  unread: boolean;
  icon: "shield" | "dollar" | "minus";
};

const sampleNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "New Expert Verification Request",
    description: "Alex Morgan sent you a verification request.",
    time: "2 minutes ago",
    group: "Today",
    unread: true,
    icon: "shield",
  },
  {
    id: "2",
    title: "New Withdrawal Request",
    description: "Alex Morgan sent you a withdrawal request.",
    time: "3 minutes ago",
    group: "Today",
    unread: true,
    icon: "dollar",
  },
  {
    id: "3",
    title: "New Dispute Raised",
    description: "Sarah William reported an issue.",
    time: "1 day ago",
    group: "Yesterday",
    unread: true,
    icon: "minus",
  },
  {
    id: "4",
    title: "Commission Deducted",
    description: "Commission charge has been deducted from Daniel Green.",
    time: "1 day ago",
    group: "Yesterday",
    unread: true,
    icon: "dollar",
  },
  {
    id: "5",
    title: "Job Completed",
    description: "Daniel Green completed AC Repair for Sarah William.",
    time: "2 days ago",
    group: "Yesterday",
    unread: false,
    icon: "shield",
  },
];

const iconMap = {
  shield: ShieldCheck,
  dollar: DollarSign,
  minus: Minus,
};

export function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<NotificationTab>("unread");

  const grouped = useMemo(() => {
    const items = sampleNotifications.filter((item) =>
      tab === "unread" ? item.unread : !item.unread,
    );

    return items.reduce<Record<string, NotificationItem[]>>((acc, item) => {
      acc[item.group] ??= [];
      acc[item.group].push(item);
      return acc;
    }, {});
  }, [tab]);

  const groups = Object.entries(grouped);

  return (
    <div className="w-[360px] overflow-hidden rounded-2xl border border-[#e4ebf1] bg-white font-['Manrope'] shadow-lg">
      <div className="flex items-center justify-between px-5 pt-5">
        <h3 className="text-base font-semibold text-[#123e5e]">Notifications</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notifications"
          className="rounded-md p-1 text-[#8a9bab] transition-colors hover:bg-slate-50 hover:text-[#123e5e]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 flex gap-6 border-b border-[#e4ebf1] px-5">
        {(["unread", "read"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              "-mb-px border-b-2 pb-2 text-sm font-medium capitalize transition-colors",
              tab === item
                ? "border-[#123e5e] text-[#123e5e]"
                : "border-transparent text-[#8a9bab] hover:text-[#123e5e]",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="max-h-[420px] overflow-y-auto px-5 py-4">
        {groups.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#8a9bab]">
            No {tab} notifications
          </p>
        ) : (
          <div className="space-y-5">
            {groups.map(([group, items]) => (
              <section key={group} className="space-y-3">
                <p className="text-xs font-medium text-[#8a9bab]">{group}</p>
                {items.map((item) => {
                  const Icon = iconMap[item.icon];
                  return (
                    <article key={item.id} className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f7fb] text-[#123e5e]">
                          <Icon className="h-4 w-4" />
                        </span>
                        {item.unread && (
                          <span className="absolute top-0 left-0 h-2 w-2 rounded-full bg-[#e11d48]" />
                        )}
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <p className="text-sm font-semibold leading-5 text-[#123e5e]">
                          {item.title}
                        </p>
                        <p className="text-sm font-medium leading-5 text-[#123e5e]">
                          {item.description}
                        </p>
                        <p className="mt-0.5 text-xs text-[#8a9bab]">{item.time}</p>
                      </div>
                    </article>
                  );
                })}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsPanel;
