"use client";

import React from "react";
import { Phone, Mail, MapPin, Calendar, Loader2 } from "lucide-react";
import { Client } from "@/types/client.types";

interface ClientHeaderProps {
  client?: Client | null;
  onToggleStatus?: (newActiveState: boolean) => void;
  isUpdatingStatus?: boolean;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({
  client,
  onToggleStatus,
  isUpdatingStatus = false,
}) => {
  const active = client ? (client.isActive ?? client.status?.toLowerCase() === "active") : true;
  const displayName = client?.fullName || "Client Name";
  const displayId = client?.clientId || (client?.id ? `#${client.id.slice(0, 8)}` : "#C000");
  const avatarUrl =
    client?.avatar ||
    `https://placehold.co/120x120?text=${encodeURIComponent(displayName.charAt(0))}`;

  let joinedDate = "N/A";
  if (client?.createdAt) {
    try {
      joinedDate = new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(client.createdAt));
    } catch {
      joinedDate = client.createdAt;
    }
  }

  const location = client?.location || client?.city || client?.country || "Not specified";

  return (
    <div className="flex w-full flex-col sm:flex-row items-start justify-between gap-4 rounded-2xl bg-white p-5 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)] outline outline-1 outline-offset-[-1px] outline-slate-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full outline outline-1 outline-offset-[-1px] outline-amber-400 bg-slate-100">
          <img
            src={avatarUrl}
            alt={displayName}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center gap-3">
          <div className="flex flex-col justify-center gap-1">
            <div className="flex items-center gap-3">
              <h2 className="font-['Manrope'] text-xl font-semibold leading-5 text-slate-900">
                {displayName}
              </h2>
              <div
                className={`flex h-5 items-center justify-center gap-1 rounded-lg px-2 py-0.5 outline outline-1 outline-offset-[-1px] ${
                  active
                    ? "bg-sky-50 outline-sky-200/50 text-sky-600"
                    : "bg-rose-50 outline-rose-200/50 text-rose-600"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    active ? "bg-sky-500" : "bg-rose-500"
                  }`}
                />
                <span className="font-['Manrope'] text-xs font-medium leading-4">
                  {active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <p className="font-['Manrope'] text-sm font-normal leading-4 text-slate-500">
              Client ID {displayId}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
              <div className="flex items-center gap-1.5 min-w-[180px]">
                <Phone className="h-4 w-4 shrink-0 text-amber-500" />
                <span className="font-['Manrope'] text-sm font-normal leading-5 text-slate-700">
                  {client?.phone || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="h-4 w-4 shrink-0 text-amber-500" />
                <span className="font-['Manrope'] text-sm font-normal leading-5 text-slate-700">
                  {client?.email || "N/A"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
              <div className="flex items-center gap-1.5 min-w-[180px]">
                <MapPin className="h-4 w-4 shrink-0 text-amber-500" />
                <span className="font-['Manrope'] text-sm font-normal leading-5 text-slate-700">
                  {location}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 shrink-0 text-amber-500" />
                <span className="font-['Manrope'] text-sm font-normal leading-5 text-slate-700">
                  Joined: {joinedDate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {client && onToggleStatus && (
        <button
          type="button"
          disabled={isUpdatingStatus}
          onClick={() => onToggleStatus(!active)}
          className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 font-['Manrope'] text-sm font-medium outline outline-1 outline-offset-[-1px] transition-colors disabled:opacity-50 cursor-pointer ${
            active
              ? "text-rose-600 outline-rose-200 hover:bg-rose-50"
              : "text-sky-600 outline-sky-200 hover:bg-sky-50"
          }`}
        >
          {isUpdatingStatus ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Updating...</span>
            </>
          ) : active ? (
            "Deactivate Account"
          ) : (
            "Activate Account"
          )}
        </button>
      )}
    </div>
  );
};

export default ClientHeader;