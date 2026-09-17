"use client";

import React, { useState } from "react";
import { Plus, Bell, Calendar, Users, Edit3, Trash2 } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  excerpt: string;
  targetAudience: "All Users" | "Clients Only" | "Experts Only";
  priority: "High" | "Normal" | "Low";
  status: "Active" | "Scheduled" | "Draft";
  publishDate: string;
}

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    title: "Platform System Maintenance Scheduled for Oct 1",
    excerpt:
      "We will be performing routine backend updates to optimize database performance. Minimal downtime expected between 02:00 AM - 04:00 AM UTC.",
    targetAudience: "All Users",
    priority: "High",
    status: "Active",
    publishDate: "Sep 16, 2026",
  },
  {
    id: "ann-2",
    title: "New Escrow Guarantee Feature for Clients",
    excerpt:
      "Clients can now enjoy enhanced milestone safety protections and automated refund workflows upon project completion disputes.",
    targetAudience: "Clients Only",
    priority: "Normal",
    status: "Active",
    publishDate: "Sep 10, 2026",
  },
  {
    id: "ann-3",
    title: "Upcoming Expert Badge Verification Standard Updates",
    excerpt:
      "Starting next month, all top-rated experts will need to complete biometric identity verification to retain their verified badge.",
    targetAudience: "Experts Only",
    priority: "Normal",
    status: "Scheduled",
    publishDate: "Oct 05, 2026",
  },
];

export function AnnouncementsTab() {
  const [announcements, setAnnouncements] =
    useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);

  const handleDelete = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6 font-['Manrope']">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E4EBF1] shadow-sm">
        <div>
          <h3 className="text-base font-bold text-[#103D5C]">
            System & Broadcast Announcements
          </h3>
          <p className="text-xs text-slate-500">
            Publish site-wide banners and target notifications to dashboard users.
          </p>
        </div>

        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-lg bg-[#103D5C] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0b2841] shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>New Announcement</span>
        </button>
      </div>

      {/* Grid of Announcements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-[#E4EBF1] p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-xs px-2.5 py-1 rounded-md font-semibold ${
                    item.priority === "High"
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : "bg-blue-50 text-blue-600 border border-blue-200"
                  }`}
                >
                  {item.priority} Priority
                </span>

                <span
                  className={`text-xs px-2.5 py-1 rounded-md font-semibold ${
                    item.status === "Active"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : item.status === "Scheduled"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <h4 className="text-base font-bold text-[#103D5C] mb-1 leading-snug">
                {item.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.excerpt}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  <span>{item.targetAudience}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>{item.publishDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="p-1.5 text-slate-400 hover:text-[#103D5C] hover:bg-slate-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnnouncementsTab;
