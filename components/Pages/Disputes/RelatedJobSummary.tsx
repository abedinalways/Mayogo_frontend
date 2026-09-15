"use client";

import React, { useState } from "react";

export interface UserProfile {
  name: string;
  id: string;
  avatarUrl: string;
}

export interface RelatedJobSummaryProps {
  hiredDate?: string;
  client?: UserProfile;
  expert?: UserProfile;
  scopeOfWork?: string;
  agreedQuote?: string;
  estDuration?: string;
  hasPhotoPresence?: boolean;
}

export default function RelatedJobSummary({
  hiredDate = "Jul 27, 2026",
  client = {
    name: "Sarah William",
    id: "Client ID #CET001",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
  expert = {
    name: "Daniel Green",
    id: "Expert ID #EXP001",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  scopeOfWork = "Inspect the AC unit, identify the cause of poor cooling performance, replace faulty components if required, and ensure the system is operating normally after repair.",
  agreedQuote = "$500.00",
  estDuration = "2 Days",
  hasPhotoPresence: initialPhotoPresence = true,
}: RelatedJobSummaryProps) {
  const [photoPresence, setPhotoPresence] = useState(initialPhotoPresence);

  return (
    <div className="w-full p-4 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col gap-5 font-['Manrope']">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#0a3558] leading-5">
          Related Job Summary
        </h2>
        <div className="flex items-center gap-1 text-sm font-medium text-slate-500">
          <span>Hired on:</span>
          <span>{hiredDate}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-5">
        {/* User Profiles Stack */}
        <div className="flex flex-col gap-3">
          {/* Client Info */}
          <div className="flex items-center gap-3">
            <img
              src={client.avatarUrl}
              alt={client.name}
              className="h-10 w-10 rounded-full object-cover border border-amber-400"
            />
            <div className="flex flex-col">
              <span className="text-base font-semibold text-[#0a3558] leading-4">
                {client.name}
              </span>
              <span className="text-sm font-normal text-slate-500 leading-5">
                {client.id}
              </span>
            </div>
          </div>

          {/* Expert Info */}
          <div className="flex items-center gap-3">
            <img
              src={expert.avatarUrl}
              alt={expert.name}
              className="h-10 w-10 rounded-full object-cover border border-amber-400"
            />
            <div className="flex flex-col">
              <span className="text-base font-semibold text-[#0a3558] leading-4">
                {expert.name}
              </span>
              <span className="text-sm font-normal text-slate-500 leading-5">
                {expert.id}
              </span>
            </div>
          </div>
        </div>

        {/* Scope of Work Section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-normal text-slate-500 leading-5">
              Scope of work
            </span>
            <p className="text-base font-normal text-slate-800 leading-6">
              {scopeOfWork}
            </p>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start pt-1">
            {/* Quote */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-normal text-slate-500 leading-5">
                Agreed Quote
              </span>
              <span className="text-base font-medium text-[#0a3558] leading-5">
                {agreedQuote}
              </span>
            </div>

            {/* Duration */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-normal text-slate-500 leading-5">
                Est. Duration
              </span>
              <span className="text-base font-medium text-[#0a3558] leading-5">
                {estDuration}
              </span>
            </div>

            {/* Toggle Switch */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-normal text-slate-500 leading-5">
                Before After Photo Presence
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={photoPresence}
                onClick={() => setPhotoPresence(!photoPresence)}
                className={`w-9 h-5 p-0.5 rounded-full transition-colors duration-200 ease-in-out flex items-center cursor-pointer ${
                  photoPresence ? "bg-amber-500 justify-end" : "bg-slate-300 justify-start"
                }`}
              >
                <span className="h-4 w-4 bg-white rounded-full shadow-xs transition-all duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}