"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MoreVertical } from "lucide-react";
import { Column, DataTable } from "../shared/DataTable";
import TableToolbar from "../shared/TableToolbar";

export type VerificationStatus =
    | "Level 1 verified"
    | "Level 2 verified"
    | "Level 3 verified"
    | "Level 4 verified"
    | "Pending";

export type ExpertStatus = "Active" | "Busy" | "Inactive";

export interface ExpertRecord {
    id: string;
    expertId: string;
    expert: {
        name: string;
        avatar: string;
    };
    contact: {
        phone: string;
        email: string;
    };
    category: string;
    verification: VerificationStatus;
    jobs: number;
    earnings: string;
    status: ExpertStatus;
}

const sampleExperts: ExpertRecord[] = [
    {
        id: "1",
        expertId: "#E124",
        expert: {
            name: "Daniel Green",
            avatar:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        },
        contact: {
            phone: "999-(1234)-555",
            email: "sarahwilliam@gmail.com",
        },
        category: "Construction & Property",
        verification: "Level 1 verified",
        jobs: 24,
        earnings: "$2,450",
        status: "Active",
    },
    {
        id: "2",
        expertId: "#E124",
        expert: {
            name: "Daniel Green",
            avatar:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        },
        contact: {
            phone: "999-(1234)-555",
            email: "sarahwilliam@gmail.com",
        },
        category: "Construction & Property",
        verification: "Level 2 verified",
        jobs: 24,
        earnings: "$2,450",
        status: "Busy",
    },
    {
        id: "3",
        expertId: "#E124",
        expert: {
            name: "Daniel Green",
            avatar:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        },
        contact: {
            phone: "999-(1234)-555",
            email: "sarahwilliam@gmail.com",
        },
        category: "Construction & Property",
        verification: "Pending",
        jobs: 24,
        earnings: "$2,450",
        status: "Active",
    },
    {
        id: "4",
        expertId: "#E124",
        expert: {
            name: "Daniel Green",
            avatar:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        },
        contact: {
            phone: "999-(1234)-555",
            email: "sarahwilliam@gmail.com",
        },
        category: "Construction & Property",
        verification: "Level 4 verified",
        jobs: 24,
        earnings: "$2,450",
        status: "Active",
    },
    {
        id: "5",
        expertId: "#E124",
        expert: {
            name: "Daniel Green",
            avatar:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        },
        contact: {
            phone: "999-(1234)-555",
            email: "sarahwilliam@gmail.com",
        },
        category: "Construction & Property",
        verification: "Level 1 verified",
        jobs: 24,
        earnings: "$2,450",
        status: "Inactive",
    },
];

export function ExpertsTable() {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<string>("");
    const [filter, setFilter] = useState<string>("");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(sampleExperts.map((item) => item.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const renderVerificationBadge = (verification: VerificationStatus) => {
        if (verification === "Pending") {
            return (
                <span className="inline-flex items-center rounded bg-amber-50 px-2.5 py-1 font-['Manrope'] text-xs font-medium text-amber-600 outline outline-1 outline-offset-[-1px] outline-amber-200">
                    Pending
                </span>
            );
        }

        return (
            <span className="inline-flex items-center rounded bg-emerald-50 px-2.5 py-1 font-['Manrope'] text-xs font-medium text-emerald-600 outline outline-1 outline-offset-[-1px] outline-emerald-200">
                {verification}
            </span>
        );
    };

    const renderStatusBadge = (status: ExpertStatus) => {
        const config = {
            Active: {
                bg: "bg-sky-50",
                border: "border-sky-200",
                text: "text-sky-600",
                dot: "bg-sky-500",
            },
            Busy: {
                bg: "bg-amber-50",
                border: "border-amber-200",
                text: "text-amber-600",
                dot: "bg-amber-500",
            },
            Inactive: {
                bg: "bg-rose-50",
                border: "border-rose-200",
                text: "text-rose-500",
                dot: "bg-rose-500",
            },
        }[status];

        return (
            <div
                className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold font-['Manrope'] ${config.bg} ${config.border} ${config.text}`}
            >
                <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
                {status}
            </div>
        );
    };

    const columns: Column<ExpertRecord>[] = [
        {
            key: "checkbox",
            header: (
                <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                        selectedIds.length === sampleExperts.length &&
                        sampleExperts.length > 0
                    }
                    className="h-4 w-4 cursor-pointer rounded border-slate-300 text-[#0a3558] focus:ring-0"
                />
            ),
            className: "w-12 pl-6 pr-2",
            cell: (item) => (
                <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => handleSelectRow(item.id)}
                    className="h-4 w-4 cursor-pointer rounded border-slate-300 text-[#0a3558] focus:ring-0"
                />
            ),
        },
        {
            key: "expertId",
            header: "Expert ID",
            className: "min-w-[100px]",
            cell: (item) => (
                <span className="font-['Manrope'] text-sm font-normal leading-6 text-[#103D5C]">
                    {item.expertId}
                </span>
            ),
        },
        {
            key: "expert",
            header: "Expert Name",
            className: "min-w-[180px]",
            cell: (item) => (
                <div className="flex items-center gap-2.5">
                    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-amber-400">
                        <Image
                            src={item.expert.avatar}
                            alt={item.expert.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span className="font-['Manrope'] text-xs font-medium leading-4 text-[#103D5C]">
                        {item.expert.name}
                    </span>
                </div>
            ),
        },
        {
            key: "contact",
            header: "Contact",
            className: "min-w-[200px]",
            cell: (item) => (
                <div className="flex flex-col gap-0.5">
                    <span className="font-['Manrope'] text-xs font-medium leading-5 text-[#667085]">
                        {item.contact.phone}
                    </span>
                    <span className="font-['Manrope'] text-[10px] font-medium leading-[10px] text-[#667085]">
                        {item.contact.email}
                    </span>
                </div>
            ),
        },
        {
            key: "category",
            header: "Category",
            className: "min-w-[180px]",
            cell: (item) => (
                <span className="font-['Manrope'] text-xs font-medium leading-4 text-[#667085]">
                    {item.category}
                </span>
            ),
        },
        {
            key: "verification",
            header: "Verification",
            className: "min-w-[150px]",
            cell: (item) => renderVerificationBadge(item.verification),
        },
        {
            key: "jobs",
            header: "Jobs",
            className: "min-w-[80px]",
            cell: (item) => (
                <span className="font-['Manrope'] text-xs font-medium leading-4 text-[#667085]">
                    {item.jobs}
                </span>
            ),
        },
        {
            key: "earnings",
            header: "Earnings",
            className: "min-w-[110px]",
            cell: (item) => (
                <span className="font-['Manrope'] text-xs font-medium leading-4 text-[#667085]">
                    {item.earnings}
                </span>
            ),
        },
        {
            key: "status",
            header: "Status",
            className: "min-w-[120px]",
            cell: (item) => renderStatusBadge(item.status),
        },
        {
            key: "action",
            header: "Action",
            className: "min-w-[80px] pr-6 text-center",
            cell: (item) => (
                <button
                    type="button"
                    onClick={() => console.log("Action clicked for", item.id)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-amber-500 transition-colors hover:bg-slate-50"
                    aria-label="Actions"
                >
                    <MoreVertical className="h-4 w-4" />
                </button>
            ),
        },
    ];

    return (
        <div>
            {/* Table Top Controls */}
            <TableToolbar
                searchQuery={searchTerm}
                onSearchChange={handleSearchChange}
                onSortClick={() => { }}
                onFilterClick={() => { }}
                onExportClick={() => { }}
            />

            {/* Main Data Table */}
            <div>
                <DataTable
                    columns={columns}
                    data={sampleExperts}
                    pagination={false}
                />
            </div>
        </div>
    );
}

export default ExpertsTable;