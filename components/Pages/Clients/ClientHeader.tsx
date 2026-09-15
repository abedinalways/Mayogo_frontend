"use client";

import React from "react";
import Image from "next/image";
import { Phone, Mail, MapPin, Calendar } from "lucide-react";

interface Client {
  id: string;
  name: string;
  avatar: string;
  status: "Active" | "Inactive" | "Blocked" | "Suspended";
  phone: string;
  email: string;
  location: string;
  joinedDate: string;
}

interface ClientHeaderProps {
  client?: Client | null;
  onSuspend?: () => void;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({
  client = {
    id: "1",
    name: "John Doe",
    avatar: "https://plus.unsplash.com/premium_photo-1682096252599-e8536cd97d2b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8eW91bmclMjBtYW58ZW58MHx8MHx8fDA%3D",
    status: "Active",
    phone: "1234567890",
    email: "john.doe@example.com",
    location: "New York, NY",
    joinedDate: "2021-01-01",
  },
  onSuspend = () => {
    console.log("Suspend account");
  },
}) => {
  return (
    <div className="flex w-full items-start justify-between rounded-2xl bg-white p-4 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)] outline outline-1 outline-offset-[-1px] outline-slate-200">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full outline outline-1 outline-offset-[-1px] outline-amber-400">
          <Image
            src={client?.avatar || ""}
            alt={client?.name || ""}
            fill
            className="object-cover"
          />
        </div>

        {/* Info Container */}
        <div className="flex flex-col justify-center gap-4">
          {/* Name & Status Header */}
          <div className="flex flex-col justify-center gap-1.5">
            <div className="flex items-center gap-3">
              <h2 className="font-['Manrope'] text-xl font-semibold leading-5 text-slate-900">
                {client?.name || ""}
              </h2>
              <div className="flex h-5 items-center justify-center gap-1 rounded-lg bg-sky-50 px-2 py-0.5 outline outline-1 outline-offset-[-1px] outline-sky-200/50">
                <span className="h-2 w-2 rounded-full bg-sky-500" />
                <span className="font-['Manrope'] text-xs font-medium leading-4 text-sky-600">
                  {client?.status || ""}
                </span>
              </div>
            </div>
            <p className="font-['Manrope'] text-sm font-normal leading-4 text-slate-500">
              Client ID #{client?.id || ""}
            </p>
          </div>

          {/* Contact Details Grid */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-5">
              <div className="flex w-48 items-center gap-1.5">
                <Phone className="h-4 w-4 shrink-0 text-amber-500" />
                <span className="font-['Manrope'] text-sm font-normal leading-5 text-slate-700">
                  {client?.phone || ""}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="h-4 w-4 shrink-0 text-amber-500" />
                <span className="font-['Manrope'] text-sm font-normal leading-5 text-slate-700">
                  {client?.email || ""}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="flex w-48 items-center gap-1.5">
                <MapPin className="h-4 w-4 shrink-0 text-amber-500" />
                <span className="font-['Manrope'] text-sm font-normal leading-5 text-slate-700">
                  {client?.location || ""}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 shrink-0 text-amber-500" />
                <span className="font-['Manrope'] text-sm font-normal leading-5 text-slate-700">
                  {client?.joinedDate || ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={onSuspend || (() => {})}
        className="inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 py-2 font-['Manrope'] text-sm font-medium text-rose-500 outline outline-1 outline-offset-[-1px] outline-rose-200 transition-colors hover:bg-rose-50"
      >
        Suspend Account
      </button>
    </div>
  );
};