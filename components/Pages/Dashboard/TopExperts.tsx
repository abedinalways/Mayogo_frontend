"use client";

import React from "react";
import Link from "next/link";
import { Star, Loader2 } from "lucide-react";
import { useGetExpertsQuery } from "@/lib/redux/api/expertApi";
import { Expert } from "@/types/expert.types";

export interface Professional {
  id: string;
  name: string;
  profession: string;
  avatar: string;
  completedJobs: number;
  totalEarned: string;
  rating: number;
}

export interface ProfessionalCardProps {
  professional: Professional;
  className?: string;
}

export function ProfessionalCard({
  professional,
  className = "",
}: ProfessionalCardProps) {
  const { id, name, profession, avatar, completedJobs, totalEarned, rating } =
    professional;

  return (
    <Link
      href={`/dashboard/experts/${id}`}
      className={`flex items-center gap-4 rounded-xl border border-slate-100 bg-[#f8fbfd] p-3.5 shadow-[0px_2px_4px_-1px_rgba(13,13,18,0.06)] font-['Manrope'] transition-all hover:bg-white hover:shadow-md ${className}`}
    >
      <div className="relative shrink-0">
        <img
          src={avatar}
          alt={name}
          className="h-[68px] w-[68px] rounded-full object-cover ring-2 ring-amber-400"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80";
          }}
        />
      </div>

      <div className="flex flex-1 items-start justify-between min-w-0">
        <div className="flex flex-col gap-1.5 min-w-0">
          <div>
            <h3 className="truncate text-lg font-semibold leading-tight text-[#0f3453]">
              {name}
            </h3>
            <p className="truncate text-sm font-normal text-slate-500">
              {profession}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-normal text-[#0f3453]">
            <span>{completedJobs} Jobs Completed</span>
            <span className="h-3 w-[1px] bg-slate-200" aria-hidden="true" />
            <span>{totalEarned} Earned</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-semibold text-[#0f3453]">
            {rating.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  );
}

const fallbackProfessionals: Professional[] = [
  {
    id: "1",
    name: "Daniel Green",
    profession: "Professional Electrician",
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    completedJobs: 94,
    totalEarned: "$12.4K",
    rating: 4.8,
  },
  {
    id: "2",
    name: "Emma Wilson",
    profession: "Teacher & Tutor",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    completedJobs: 82,
    totalEarned: "$9.8K",
    rating: 4.9,
  },
  {
    id: "3",
    name: "David Clark",
    profession: "Web Developer",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    completedJobs: 67,
    totalEarned: "$11.2K",
    rating: 4.8,
  },
];

export default function TopExperts({ className = "" }: { className?: string }) {
  const { data: expertsResponse, isLoading } = useGetExpertsQuery({
    limit: 4,
  });

  const rawExperts: Expert[] = Array.isArray(expertsResponse?.data)
    ? expertsResponse.data
    : (expertsResponse?.data as { experts?: Expert[]; data?: Expert[] })?.experts ||
      (expertsResponse?.data as { experts?: Expert[]; data?: Expert[] })?.data ||
      [];

  const professionals: Professional[] =
    rawExperts.length > 0
      ? rawExperts.map((exp) => {
          const catName =
            typeof exp.category === "object"
              ? exp.category?.name
              : exp.category || exp.businessName || "Certified Expert";

          const totalJobs = exp.totalJobs || exp.jobs || 0;
          const earningsVal =
            typeof exp.earnings === "number"
              ? `$${exp.earnings.toLocaleString()}`
              : exp.earnings || `$${(totalJobs * 85).toLocaleString()}`;

          return {
            id: exp.id,
            name: exp.fullName,
            profession: catName,
            avatar:
              exp.avatar ||
              "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
            completedJobs: totalJobs,
            totalEarned: earningsVal,
            rating: 4.9,
          };
        })
      : fallbackProfessionals;

  return (
    <div className={`w-full overflow-hidden card-container ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-100 pt-2 pb-6 px-4 -mx-4 mb-4">
        <h2 className="text-lg font-semibold text-[#0f3453]">Top Experts</h2>
        <Link
          href="/dashboard/experts"
          className="text-xs font-semibold text-[#0f3453] hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="w-full">
        {isLoading ? (
          <div className="flex flex-col gap-3 animate-pulse">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-xl border border-slate-100 bg-[#f8fbfd] p-3.5"
              >
                <div className="h-[68px] w-[68px] shrink-0 rounded-full bg-slate-200" />
                <div className="flex flex-1 flex-col gap-2 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="h-4 w-32 rounded bg-slate-200" />
                      <div className="h-3 w-20 rounded bg-slate-100" />
                    </div>
                    <div className="h-4 w-12 shrink-0 rounded bg-slate-100" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-24 rounded bg-slate-100" />
                    <div className="h-3 w-16 rounded bg-slate-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {professionals.map((item) => (
              <ProfessionalCard key={item.id} professional={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
