

export type TimelineVariant = "info" | "success" | "warning";

export interface TimelineItem {
  id: string | number;
  title: string;
  timestamp: string;
  description: string;
  variant?: TimelineVariant;
}

export interface JobStatusTimelineProps {
  title?: string;
  items?: TimelineItem[];
}

const defaultItems: TimelineItem[] = [
  {
    id: 1,
    title: "Request Sent",
    timestamp: "2 days ago",
    description: "Sarah William requested a new service.",
    variant: "info",
  },
  {
    id: 2,
    title: "Quote Sent",
    timestamp: "2 days ago",
    description: "Quote for $248.00 sent to the client.",
    variant: "info",
  },
  {
    id: 3,
    title: "Job Accepted",
    timestamp: "2 days ago",
    description: "Sarah William accepted Alex Morgan’s quote.",
    variant: "success",
  },
  {
    id: 4,
    title: "Payment Completed",
    timestamp: "2 days ago",
    description: "Sarah William successfully paid the agreed amount.",
    variant: "success",
  },
  {
    id: 5,
    title: "Work in Progress",
    timestamp: "2 days ago",
    description: "Expert checked in and begin the service.",
    variant: "warning",
  },
  {
    id: 6,
    title: "Evidence Submitted",
    timestamp: "2 days ago",
    description:
      "Expert send the work evidence to the client & mark as completed.",
    variant: "warning",
  },
  {
    id: 7,
    title: "Job Completed",
    timestamp: "2 days ago",
    description:
      "Client approved the final work and marked the job complete.",
    variant: "success",
  },
  {
    id: 8,
    title: "Escrow Released",
    timestamp: "2 days ago",
    description: "Payment released to the Expert.",
    variant: "info",
  },
];

const variantDotClasses: Record<TimelineVariant, string> = {
  info: "bg-[#2563eb]",
  success: "bg-[#16a34a]",
  warning: "bg-[#f59e0b]",
};

export function JobStatusTimeline({
  title = "Job Status Timeline",
  items = defaultItems,
}: JobStatusTimelineProps) {
  return (
    <div className="flex w-full  flex-col gap-4 rounded-2xl bg-white p-4 shadow-[0px_2px_4px_-1px_rgba(13,13,18,0.06)] border border-[#e4ebf1] font-['Manrope'] ">
      {/* Timeline Card Title */}
      {title && (
        <h3 className="text-base font-semibold text-[#0f3453] ">{title}</h3>
      )}

      <hr className="border-t border-[#e4ebf1] -mx-4" />

      {/* Timeline Items List */}
      <div className="flex flex-col">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const variant = item.variant || "info";

          return (
            <div
              key={item.id}
              className={`flex items-start gap-3 py-3 ${
                !isLast ? "border-b border-[#f0f4f8]" : ""
              }`}
            >
              {/* Dot Icon Indicator */}
              <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${variantDotClasses[variant]}`}
                />
              </div>

              {/* Content Container */}
              <div className="flex flex-1 flex-col gap-1">
                {/* Title & Time Header */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#0f3453]">
                    {item.title}
                  </span>
                  <span className="text-xs font-normal text-[#8a9bab]">
                    {item.timestamp}
                  </span>
                </div>

                {/* Description Text */}
                <p className="text-xs font-normal leading-relaxed text-[#6c8294]">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default JobStatusTimeline;