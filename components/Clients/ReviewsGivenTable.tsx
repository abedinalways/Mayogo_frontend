"use client";

import { useState } from "react";
import { Search, Star } from "lucide-react";
import { Column, DataTable } from "../shared/DataTable";
import Link from "next/link";
import TableToolbar from "../shared/TableToolbar";

export interface ReviewRecord {
    id: string;
    jobId: string;
    expert: {
        name: string;
        avatar: string;
    };
    rating: number; // e.g. 4
    ratingLabel: string; // e.g. "Very Good"
    date: string;
}

const sampleReviews: ReviewRecord[] = [
    {
        id: "1",
        jobId: "#JB001",
        expert: {
            name: "Daniel Green",
            avatar:
                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
        },
        rating: 4,
        ratingLabel: "Very Good",
        date: "12 Jul, 2026",
    },
    {
        id: "2",
        jobId: "#JB001",
        expert: {
            name: "Daniel Green",
            avatar:
                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
        },
        rating: 4,
        ratingLabel: "Very Good",
        date: "12 Jul, 2026",
    },
    {
        id: "3",
        jobId: "#JB001",
        expert: {
            name: "Daniel Green",
            avatar:
                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
        },
        rating: 4,
        ratingLabel: "Very Good",
        date: "12 Jul, 2026",
    },
    {
        id: "4",
        jobId: "#JB001",
        expert: {
            name: "Daniel Green",
            avatar:
                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
        },
        rating: 4,
        ratingLabel: "Very Good",
        date: "12 Jul, 2026",
    },
    {
        id: "5",
        jobId: "#JB001",
        expert: {
            name: "Daniel Green",
            avatar:
                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
        },
        rating: 4,
        ratingLabel: "Very Good",
        date: "12 Jul, 2026",
    },
];

export function ReviewsGivenTable() {
    const [searchTerm, setSearchTerm] = useState("");
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };
    const renderStarRating = (rating: number, label: string) => {
        return (
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`h-4 w-4 ${star <= rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "fill-slate-100 text-slate-200"
                                }`}
                        />
                    ))}
                </div>
                <span className="text-xs font-semibold text-amber-500">
                    {label}
                </span>
            </div>
        );
    };

    const columns: Column<ReviewRecord>[] = [
        {
          key: "jobId",
          header: "Job ID",
          className: "flex-1 pl-4",
          cell: (item) => (
            <span className="text-sm font-normal text-slate-900 font-['Manrope'] leading-6">
              {item.jobId}
            </span>
          ),
        },
        {
          key: "expert",
          header: "Expert Name",
          className: "w-36",
          cell: (item) => (
            <div className="flex items-center gap-2">
              <img
                src={item.expert.avatar}
                alt={item.expert.name}
                className="h-7 w-7 rounded-full border border-amber-400 object-cover shrink-0 shadow-[-3.75px_7.5px_7.5px_0px_rgba(0,0,0,0.05)]"
              />
              <span className="text-xs font-medium text-slate-700 font-['Manrope'] leading-4">
                {item.expert.name}
              </span>
            </div>
          ),
        },
        {
          key: "rating",
          header: "Rating",
          className: "min-w-[140px]",
          cell: (item) => renderStarRating(item.rating, item.ratingLabel),
        },
        {
          key: "date",
          header: "Date",
          className: "min-w-[120px]",
          cell: (item) => (
            <span className="text-xs font-medium text-slate-700 font-['Manrope'] leading-4 whitespace-nowrap">
              {item.date}
            </span>
          ),
        },
        {
          key: "action",
          header: "Action",
          className: "pr-4 text-center",
          cell: (item) => (
            <Link
              href={`/dashboard/reviews/${item.id}`}
              className="inline-flex h-8 items-center justify-center rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 font-['Manrope'] leading-3 transition-colors hover:bg-slate-50"
            >
              View
            </Link>
          ),
        },
      ];

    return (
        <div >
            {/* Table Header Controls */}
            <TableToolbar
                title="Review Given"
                searchQuery={searchTerm}
                onSearchChange={handleSearchChange}
            />

            {/* Main Data Table */}

            <DataTable columns={columns} data={sampleReviews} pagination={false} />

        </div>
    );
}