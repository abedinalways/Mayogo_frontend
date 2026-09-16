"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, MoreVertical, EyeOff, CheckCircle2 } from "lucide-react";
import { Column, DataTable } from "../../shared/DataTable";

import CustomDropdown from "../../shared/CustomDropdown";
import CustomModal from "@/components/shared/CustomModal";
import ReviewDetails from "./ReviewDetails";
import { TableToolbar } from "@/components/shared/TableToolbar";

export type ReviewStatus = "Visible" | "Hidden";

const RATING_OPTIONS = [
    { label: "All Ratings", value: "" },
    { label: "Excellent", value: "excellent" },
    { label: "Very Good", value: "very_good" },
    { label: "Fair", value: "fair" },
    { label: "Good", value: "good" },
    { label: "Poor", value: "poor" },
];

const STATUS_OPTIONS = [
    { label: "All Status", value: "" },
    { label: "Visible", value: "visible" },
    { label: "Hidden", value: "hidden" },
];

export interface ReviewRecord {
    id: string;
    jobId: string;
    service: {
        title: string;
        category: string;
        image: string;
    };
    client: {
        name: string;
        avatar: string;
    };
    expert: {
        name: string;
        avatar: string;
    };
    rating: number; // 1 to 5
    ratingLabel: string;
    comment: string;
    status: ReviewStatus;
}

const sampleReviews: ReviewRecord[] = [
    {
        id: "1",
        jobId: "#JB001",
        service: {
            title: "Air Conditioner (AC) Repair",
            category: "Repair & Diagnostic",
            image: "https://placehold.co/28x28",
        },
        client: {
            name: "Sarah William",
            avatar: "https://placehold.co/28x28",
        },
        expert: {
            name: "Daniel Green",
            avatar: "https://placehold.co/28x28",
        },
        rating: 4,
        ratingLabel: "Very Good",
        comment: "Great work, arrived right on time and fixed everything.",
        status: "Visible",
    },
    {
        id: "2",
        jobId: "#JB001",
        service: {
            title: "Air Conditioner (AC) Repair",
            category: "Repair & Diagnostic",
            image: "https://placehold.co/28x28",
        },
        client: {
            name: "Sarah William",
            avatar: "https://placehold.co/28x28",
        },
        expert: {
            name: "Daniel Green",
            avatar: "https://placehold.co/28x28",
        },
        rating: 3,
        ratingLabel: "Good",
        comment: "Work was done on time, satisfied.",
        status: "Visible",
    },
    {
        id: "3",
        jobId: "#JB001",
        service: {
            title: "Air Conditioner (AC) Repair",
            category: "Repair & Diagnostic",
            image: "https://placehold.co/28x28",
        },
        client: {
            name: "Sarah William",
            avatar: "https://placehold.co/28x28",
        },
        expert: {
            name: "Daniel Green",
            avatar: "https://placehold.co/28x28",
        },
        rating: 1,
        ratingLabel: "Poor",
        comment: "Terrible experience. AC not installed correctly, caused d...",
        status: "Hidden",
    },
    {
        id: "4",
        jobId: "#JB001",
        service: {
            title: "Air Conditioner (AC) Repair",
            category: "Repair & Diagnostic",
            image: "https://placehold.co/28x28",
        },
        client: {
            name: "Sarah William",
            avatar: "https://placehold.co/28x28",
        },
        expert: {
            name: "Daniel Green",
            avatar: "https://placehold.co/28x28",
        },
        rating: 3,
        ratingLabel: "Fair",
        comment: "Work was okay but took 2 extra days to complete. Co...",
        status: "Visible",
    },
    {
        id: "5",
        jobId: "#JB001",
        service: {
            title: "Air Conditioner (AC) Repair",
            category: "Repair & Diagnostic",
            image: "https://placehold.co/28x28",
        },
        client: {
            name: "Sarah William",
            avatar: "https://placehold.co/28x28",
        },
        expert: {
            name: "Daniel Green",
            avatar: "https://placehold.co/28x28",
        },
        rating: 5,
        ratingLabel: "Excellent",
        comment: "Generator installed perfectly. Efua is very knowledgeable...",
        status: "Visible",
    },
];

export function ReviewModerationTable() {
    const [reviews, setReviews] = useState<ReviewRecord[]>(sampleReviews);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isViewReviewModalOpen, setIsViewReviewModalOpen] = useState(false);



    const [rating, setRating] = useState("");
    const [status, setStatus] = useState("");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(reviews.map((item) => item.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleToggleStatus = (id: string) => {
        setReviews((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        status: item.status === "Visible" ? "Hidden" : "Visible",
                    }
                    : item
            )
        );
    };

    const renderStars = (rating: number) => (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`h-3.5 w-3.5 ${star <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-slate-200 text-slate-200"
                        }`}
                />
            ))}
        </div>
    );

    const columns: Column<ReviewRecord>[] = [
        {
            key: "checkbox",
            header: (
                <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                        selectedIds.length === reviews.length && reviews.length > 0
                    }
                    className="h-4 w-4 rounded border-slate-300 accent-amber-500 cursor-pointer"
                />
            ),
            className: "w-12 pl-6 pr-2",
            cell: (item) => (
                <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => handleSelectRow(item.id)}
                    className="h-4 w-4 rounded border-slate-300 accent-amber-500 cursor-pointer"
                />
            ),
        },
        {
            key: "jobId",
            header: "Job ID",
            className: "min-w-[100px]",
            cell: (item) => (
                <span className="text-xs font-normal text-[#103D5C] font-['Manrope']">
                    {item.jobId}
                </span>
            ),
        },
        {
            key: "service",
            header: "Service Name",
            className: "min-w-[220px]",
            cell: (item) => (
                <div className="flex items-center gap-2">
                    <Image
                        src={item.service.image}
                        alt={item.service.title}
                        width={28}
                        height={28}
                        className="h-7 w-7 rounded-md border border-slate-200 object-cover shrink-0"
                        unoptimized
                    />
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-[#103D5C] font-['Manrope']">
                            {item.service.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-['Manrope']">
                            {item.service.category}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            key: "client",
            header: "Client Name",
            className: "min-w-[160px]",
            cell: (item) => (
                <div className="flex items-center gap-2">
                    <Image
                        src={item.client.avatar}
                        alt={item.client.name}
                        width={28}
                        height={28}
                        className="h-7 w-7 rounded-full border border-slate-200 object-cover shrink-0"
                        unoptimized
                    />
                    <span className="text-xs font-medium text-slate-700 font-['Manrope']">
                        {item.client.name}
                    </span>
                </div>
            ),
        },
        {
            key: "expert",
            header: "Expert Name",
            className: "min-w-[160px]",
            cell: (item) => (
                <div className="flex items-center gap-2">
                    <Image
                        src={item.expert.avatar}
                        alt={item.expert.name}
                        width={28}
                        height={28}
                        className="h-7 w-7 rounded-full border border-slate-200 object-cover shrink-0"
                        unoptimized
                    />
                    <span className="text-xs font-medium text-slate-700 font-['Manrope']">
                        {item.expert.name}
                    </span>
                </div>
            ),
        },
        {
            key: "rating",
            header: "Rating",
            className: "min-w-[120px] text-center",
            cell: (item) => (
                <div className="flex flex-col items-center justify-center gap-1">
                    {renderStars(item.rating)}
                    <span className="text-[11px] font-medium text-amber-500 font-['Manrope']">
                        {item.ratingLabel}
                    </span>
                </div>
            ),
        },
        {
            key: "comment",
            header: "Review",
            className: "min-w-[220px]",
            cell: (item) => (
                <p className="line-clamp-2 text-xs font-normal leading-4 text-slate-600 font-['Manrope']">
                    {item.comment}
                </p>
            ),
        },
        {
            key: "status",
            header: "Status",
            className: "min-w-[120px]",
            cell: (item) =>
                item.status === "Visible" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 outline outline-1 outline-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Visible
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-600 outline outline-1 outline-rose-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                        Hidden
                    </span>
                ),
        },
        {
            key: "action",
            header: "Action",
            className: "min-w-[80px] text-center relative pr-6",
            cell: (item) => (
                <CustomDropdown
                    align="end"
                    ariaLabel="Review actions"
                    triggerClassName="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100"
                    trigger={<MoreVertical className="h-4 w-4" />}
                    contentClassName="w-40 rounded-xl border border-slate-100 bg-[#f8fbfd] p-2 shadow-lg"
                >
                    {({ close }) => (
                        <div className="flex w-full flex-col gap-2">
                            <button
                                onClick={() => {
                                    setIsViewReviewModalOpen(true);
                                    close();
                                }}
                                type="button"

                                className="inline-flex h-10 w-full items-center justify-start gap-2.5 rounded-lg bg-[#0a3558] px-2 py-3"
                            >
                                <span className="text-sm font-medium leading-4 text-white font-['Manrope']">
                                    View Review
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    handleToggleStatus(item.id);
                                    close();
                                }}
                                className="flex h-10 w-full items-center gap-2 rounded-lg px-2 py-3 text-sm font-medium text-[#103D5C] hover:bg-slate-200/50 font-['Manrope']"
                            >
                                {item.status === "Visible" ? (
                                    <>

                                        Hide Review
                                    </>
                                ) : (
                                    <>

                                        Make Visible
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </CustomDropdown>
            ),
        },
    ];


    return (
        <div className="">
            {/* Table Top Controls */}
            <TableToolbar
                searchQuery={searchTerm}
                onSearchChange={handleSearchChange}
                dropdownFilters={[
                    {
                        placeholder: "All Ratings",
                        value: rating,
                        options: RATING_OPTIONS,
                        onChange: (val) => setRating(val),
                    },
                    {
                        placeholder: "All Status",
                        value: status,
                        options: STATUS_OPTIONS,
                        onChange: (val) => setStatus(val),
                    },
                ]}

            />

            {/* Main Data Table */}

            <DataTable
                columns={columns}
                data={reviews}
                pagination={false}
            />

            {/* modal for view review */}
            <CustomModal size="sm" showCloseButton={false} open={isViewReviewModalOpen} onOpenChange={() => setIsViewReviewModalOpen(false)}>
                <div className="">
                    <ReviewDetails onClose={() => setIsViewReviewModalOpen(false)} />
                </div>
            </CustomModal>
        </div>
    );
}

export default ReviewModerationTable;