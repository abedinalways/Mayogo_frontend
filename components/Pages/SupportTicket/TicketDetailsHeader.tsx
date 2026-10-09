import React from "react";
import { Loader2 } from "lucide-react";

export interface TicketDetailsHeaderProps {
  ticketId: string;
  category: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  onMarkAsSolved?: () => void;
  isLoading?: boolean;
}

export function TicketDetailsHeader({
  ticketDetails,
}: {
  ticketDetails: TicketDetailsHeaderProps;
}) {
  const { ticketId, category, status, onMarkAsSolved, isLoading = false } = ticketDetails;

  const renderStatusBadge = () => {
    const config = {
      Open: {
        bg: "bg-sky-50",
        outline: "outline-sky-200/50",
        text: "text-sky-600",
        dot: "bg-sky-500",
      },
      "In Progress": {
        bg: "bg-amber-50",
        outline: "outline-amber-200/50",
        text: "text-amber-600",
        dot: "bg-amber-500",
      },
      Resolved: {
        bg: "bg-emerald-50",
        outline: "outline-emerald-200/50",
        text: "text-emerald-600",
        dot: "bg-emerald-500",
      },
      Closed: {
        bg: "bg-slate-50",
        outline: "outline-slate-200/50",
        text: "text-slate-600",
        dot: "bg-slate-400",
      },
    }[status];

    return (
      <div
        className={`flex items-center gap-1 rounded-sm px-3 py-1 outline outline-1 outline-offset-[-1px] ${config.bg} ${config.outline}`}
      >
        <span className={`h-2 w-2 rounded-full ${config.dot}`} />
        <span
          className={`font-['Manrope'] text-sm font-medium leading-4 ${config.text}`}
        >
          {status}
        </span>
      </div>
    );
  };

  return (
    <div className="flex w-full items-start justify-between font-['Manrope']">
      <div className="flex flex-col justify-center gap-2">
        <div className="flex items-center gap-4">
          <h1 className="font-['Manrope'] text-xl font-semibold leading-5 text-slate-900">
            Ticket ID #{ticketId}
          </h1>
          {renderStatusBadge()}
        </div>
        <p className="font-['Manrope'] text-sm font-medium leading-4 text-slate-600">
          Category: {category}
        </p>
      </div>

      {status !== "Resolved" && status !== "Closed" && (
        <button
          type="button"
          onClick={onMarkAsSolved}
          disabled={isLoading}
          className="flex h-12 items-center justify-center gap-2 rounded-lg bg-[#0a3558] px-6 py-3.5 text-base font-medium leading-5 tracking-tight text-white transition-colors hover:bg-[#072742] cursor-pointer disabled:opacity-50"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-white" />}
          <span>Mark as Solved</span>
        </button>
      )}
    </div>
  );
}

export default TicketDetailsHeader;