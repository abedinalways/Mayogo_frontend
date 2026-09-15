"use client";

import React from "react";
import { Star } from "lucide-react";

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

export function ProfessionalCard({ professional, className = "" }: ProfessionalCardProps) {
    const { name, profession, avatar, completedJobs, totalEarned, rating } = professional;

    return (
        <div
            className={`flex items-center gap-4 rounded-xl border border-slate-100 bg-[#f8fbfd] p-3.5 shadow-[0px_2px_4px_-1px_rgba(13,13,18,0.06)] font-['Manrope'] transition-all hover:bg-white hover:shadow-md ${className}`}
        >
            {/* Avatar with Amber Ring */}
            <div className="relative shrink-0">
                <img
                    src={avatar}
                    alt={name}
                    className="h-[68px] w-[68px] rounded-full object-cover ring-2 ring-amber-400"
                />
            </div>

            {/* Info Container */}
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

                    {/* Stats Bar */}
                    <div className="flex items-center gap-2 text-xs font-normal text-[#0f3453]">
                        <span>{completedJobs} Jobs Completed</span>
                        <span className="h-3 w-[1px] bg-slate-200" aria-hidden="true" />
                        <span>{totalEarned} Earned</span>
                    </div>
                </div>

                {/* Rating Badge */}
                <div className="flex shrink-0 items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-[#0f3453]">
                        {rating.toFixed(1)}
                    </span>
                </div>
            </div>
        </div>
    );
}







// ==========================================
// Example List Component
// ==========================================

const sampleProfessionals: Professional[] = [
    {
        id: "1",
        name: "Daniel Green",
        profession: "Professional Electrician",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        completedJobs: 94,
        totalEarned: "$12.4K",
        rating: 4.8,
    },
    {
        id: "2",
        name: "Emma Wilson",
        profession: "Teacher",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        completedJobs: 94,
        totalEarned: "$12.4K",
        rating: 4.8,
    },
    {
        id: "3",
        name: "David Clark",
        profession: "Web Developer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        completedJobs: 94,
        totalEarned: "$12.4K",
        rating: 4.8,
    },
];






export default function TopExperts({ className = "" }: { className?: string }) {
    const title = "Top Experts";
    return (
        <div
            className={`w-full  overflow-hidden card-container  ${className}`}
        >
            {/* Card Header */}
            <div className="border-b border-slate-100 pt-2 pb-6 px-4 -mx-4 mb-4">
                <h2 className="text-lg font-semibold text-[#0f3453]">{title}</h2>
            </div>

            <div className="w-full ">
                <div className="flex flex-col gap-3">
                    {sampleProfessionals.map((item) => (
                        <ProfessionalCard key={item.id} professional={item} />
                    ))}
                </div>
            </div>

        </div>
    )
}
