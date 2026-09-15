export type StatusType =
  | "Completed"
  | "Accepted"
  | "In Progress"
  | "Pending"
  | "Under Review"
  | "Cancelled"
  | "Disputed"
  | "Paid"
  | "Failed"
  | "Refunded";

const statusStyles: Record<
  string,
  { bg: string; border: string; text: string; dot: string }
> = {
  completed: {
    bg: "bg-emerald-50",
    border: "outline-emerald-200",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  paid: {
    bg: "bg-emerald-50",
    border: "outline-emerald-200",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  accepted: {
    bg: "bg-blue-50",
    border: "outline-blue-200",
    text: "text-blue-600",
    dot: "bg-blue-500",
  },
  "in progress": {
    bg: "bg-blue-50",
    border: "outline-blue-200",
    text: "text-blue-600",
    dot: "bg-blue-500",
  },
  pending: {
    bg: "bg-amber-50",
    border: "outline-amber-200",
    text: "text-amber-600",
    dot: "bg-amber-500",
  },
  "under review": {
    bg: "bg-amber-50",
    border: "outline-amber-200",
    text: "text-amber-600",
    dot: "bg-amber-500",
  },
  cancelled: {
    bg: "bg-rose-50",
    border: "outline-rose-200",
    text: "text-rose-600",
    dot: "bg-rose-500",
  },
  disputed: {
    bg: "bg-rose-50",
    border: "outline-rose-200",
    text: "text-rose-600",
    dot: "bg-rose-500",
  },
  failed: {
    bg: "bg-rose-50",
    border: "outline-rose-200",
    text: "text-rose-600",
    dot: "bg-rose-500",
  },
  refunded: {
    bg: "bg-cyan-50",
    border: "outline-cyan-200",
    text: "text-cyan-600",
    dot: "bg-cyan-500",
  },
};

const defaultStyle = {
  bg: "bg-slate-50",
  border: "outline-slate-200",
  text: "text-slate-600",
  dot: "bg-slate-400",
};

export function StatusBadge({ status }: { status: StatusType | string }) {
  const style = statusStyles[status.toLowerCase()] ?? defaultStyle;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-xs font-medium outline outline-1 outline-offset-[-1px] ${style.bg} ${style.border} ${style.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}
