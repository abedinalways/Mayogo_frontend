import React from "react";
import Link from "next/link";

export interface TicketSidebarDetails {
  userId: string;
  requestedBy: string;
  role: string;
  createdOn: string;
  lastActivity: string;
  jobId?: string;
  serviceValue?: string;
  clientProfileId?: string;
}

export interface TicketSidebarProps {
  details?: TicketSidebarDetails;
  onViewJobDetails?: () => void;
}

export const TicketSidebar = ({
  details = {
    userId: "#USR-8042",
    requestedBy: "Daniel Green",
    role: "Client",
    createdOn: "Jul 27, 2026, 02:00 PM",
    lastActivity: "Jul 27, 2026, 02:00 PM",
    jobId: "#JB124",
    serviceValue: "$200",
  },
  onViewJobDetails,
}: TicketSidebarProps) => {
  return (
    <aside className="shrink-0 rounded-2xl bg-white p-4 outline outline-1 outline-offset-[-1px] outline-slate-200 font-['Manrope']">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-center border-b border-slate-100 pb-4">
          <h3 className="w-full font-['Manrope'] text-lg font-semibold leading-6 text-[#0a3558]">
            Ticket Details
          </h3>
        </div>

        <div className="flex flex-col gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-start justify-between">
            <span className="font-['Manrope'] text-base font-medium leading-4 text-slate-900">
              User ID
            </span>
            <div className="flex w-40 items-center justify-start gap-2.5">
              <span className="font-['Manrope'] text-base font-normal leading-4 text-slate-600">
                {details.userId}
              </span>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <span className="font-['Manrope'] text-base font-medium leading-4 text-slate-900">
              Requested By
            </span>
            <div className="flex w-40 items-center justify-start gap-2.5">
              <span className="font-['Manrope'] text-base font-normal leading-4 text-slate-600">
                {details.requestedBy}
              </span>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <span className="font-['Manrope'] text-base font-medium leading-4 text-slate-900">
              Role
            </span>
            <div className="flex w-40 items-center justify-start gap-2.5">
              <span className="font-['Manrope'] text-base font-normal leading-4 text-slate-600">
                {details.role}
              </span>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <span className="font-['Manrope'] text-base font-medium leading-4 text-slate-900">
              Created On
            </span>
            <span className="font-['Manrope'] text-base font-normal leading-4 text-slate-600">
              {details.createdOn}
            </span>
          </div>

          <div className="flex items-start justify-between">
            <span className="font-['Manrope'] text-base font-medium leading-4 text-slate-900">
              Last Activity
            </span>
            <span className="font-['Manrope'] text-base font-normal leading-4 text-slate-600">
              {details.lastActivity}
            </span>
          </div>

          {details.jobId && (
            <div className="flex items-start justify-between">
              <span className="font-['Manrope'] text-base font-medium leading-4 text-slate-900">
                Job ID
              </span>
              <div className="flex w-40 items-center justify-start gap-2.5">
                <span className="font-['Manrope'] text-base font-normal leading-4 text-slate-600">
                  {details.jobId}
                </span>
              </div>
            </div>
          )}

          {details.serviceValue && (
            <div className="flex items-start justify-between">
              <span className="font-['Manrope'] text-base font-medium leading-4 text-slate-900">
                Service Value
              </span>
              <div className="flex w-40 items-center justify-start gap-2.5">
                <span className="font-['Manrope'] text-base font-normal leading-4 text-slate-600">
                  {details.serviceValue}
                </span>
              </div>
            </div>
          )}
        </div>

        {details.jobId && (
          <div>
            {onViewJobDetails ? (
              <button
                type="button"
                onClick={onViewJobDetails}
                className="flex h-10 w-full items-center justify-center rounded-lg outline outline-1 outline-offset-[-1px] outline-[#0a3558] px-6 py-3 font-['Manrope'] text-sm font-medium leading-4 text-[#0a3558] transition-colors hover:bg-slate-50 cursor-pointer"
              >
                View Job Details
              </button>
            ) : (
              <Link
                href={`/dashboard/jobs/${details.jobId.replace("#", "")}`}
                className="flex h-10 w-full items-center justify-center rounded-lg outline outline-1 outline-offset-[-1px] outline-[#0a3558] px-6 py-3 font-['Manrope'] text-sm font-medium leading-4 text-[#0a3558] transition-colors hover:bg-slate-50"
              >
                View Job Details
              </Link>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default TicketSidebar;