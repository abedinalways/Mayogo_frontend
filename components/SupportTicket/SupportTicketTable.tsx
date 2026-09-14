"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Column, DataTable } from "../shared/DataTable";
import TableToolbar from "../shared/TableToolbar";

export type TicketStatus = "Open" | "Resolved" | "Under Review";
export type PriorityLevel = "Low" | "Medium" | "High" | "Urgent";

export interface TicketRecord {
    id: string;
    ticketId: string;
    category: string;
    user: {
        name: string;
        avatar: string;
    };
    role: "Client" | "Expert";
    reason: string;
    status: TicketStatus;
    priority: PriorityLevel;
    assignedAdmin: string;
}

const sampleTickets: TicketRecord[] = [
    {
        id: "1",
        ticketId: "#GNL-10482",
        category: "General Issue",
        user: {
            name: "Daniel Green",
            avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
        },
        role: "Client",
        reason: "Service was not compl...",
        status: "Open",
        priority: "Medium",
        assignedAdmin: "Sarah Parker",
    },
    {
        id: "2",
        ticketId: "#GNL-10482",
        category: "General Issue",
        user: {
            name: "Daniel Green",
            avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
        },
        role: "Expert",
        reason: "Service was not compl...",
        status: "Resolved",
        priority: "Low",
        assignedAdmin: "Sarah Parker",
    },
    {
        id: "3",
        ticketId: "#GNL-10482",
        category: "General Issue",
        user: {
            name: "Daniel Green",
            avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
        },
        role: "Client",
        reason: "Service was not compl...",
        status: "Resolved",
        priority: "Urgent",
        assignedAdmin: "Sarah Parker",
    },
    {
        id: "4",
        ticketId: "#DSP-10482",
        category: "Raise Dispute",
        user: {
            name: "Daniel Green",
            avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
        },
        role: "Client",
        reason: "Service was not compl...",
        status: "Open",
        priority: "High",
        assignedAdmin: "Sarah Parker",
    },
    {
        id: "5",
        ticketId: "#DSP-10482",
        category: "Raise Dispute",
        user: {
            name: "Daniel Green",
            avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
        },
        role: "Client",
        reason: "Service was not compl...",
        status: "Under Review",
        priority: "High",
        assignedAdmin: "Sarah Parker",
    },
];

const adminOptions = ["Sarah Parker", "John Doe", "Alex Smith"];

export function SupportTicketsTable() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sort, setSort] = useState<string>("newest");
    const [assignedAdmins, setAssignedAdmins] = useState<Record<string, string>>(
        sampleTickets.reduce((acc, ticket) => ({ ...acc, [ticket.id]: ticket.assignedAdmin }), {})
    );

    const handleAdminChange = (ticketId: string, newAdmin: string) => {
        setAssignedAdmins((prev) => ({ ...prev, [ticketId]: newAdmin }));
    };

    const renderStatusBadge = (status: TicketStatus) => {
        const config = {
            Open: {
                bg: "bg-sky-50",
                border: "border-sky-200",
                text: "text-sky-600",
                dot: "bg-sky-500",
            },
            Resolved: {
                bg: "bg-emerald-50",
                border: "border-emerald-200",
                text: "text-emerald-600",
                dot: "bg-emerald-500",
            },
            "Under Review": {
                bg: "bg-amber-50",
                border: "border-amber-200",
                text: "text-amber-600",
                dot: "bg-amber-500",
            },
        }[status];

        return (
            <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium text-nowrap ${config.bg} ${config.border} ${config.text}`}
            >
                <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
                {status}
            </div>
        );
    };

    const renderPriorityBadge = (priority: PriorityLevel) => {
        const config = {
            Low: {
                bg: "bg-amber-50",
                border: "border-amber-200",
                text: "text-amber-600",
                dot: "bg-amber-500",
            },
            Medium: {
                bg: "bg-amber-50",
                border: "border-amber-200",
                text: "text-amber-600",
                dot: "bg-amber-500",
            },
            High: {
                bg: "bg-rose-50",
                border: "border-rose-200",
                text: "text-rose-500",
                dot: "bg-rose-500",
            },
            Urgent: {
                bg: "bg-rose-50",
                border: "border-rose-200",
                text: "text-rose-500",
                dot: "bg-rose-500",
            },
        }[priority];

        return (
            <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium text-nowrap ${config.bg} ${config.border} ${config.text}`}
            >
                <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
                {priority}
            </div>
        );
    };

    const columns: Column<TicketRecord>[] = [
        {
            key: "ticketId",
            header: "Ticket ID",
            className: "min-w-[120px] pl-6",
            cell: (item) => (
                <span className="text-[color:var(--Heading,#103D5C)] [font-family:Manrope] text-sm font-normal leading-[160%]">
                    {item.ticketId}
                </span>
            ),
        },
        {
            key: "category",
            header: "Category",
            className: "min-w-[140px]",
            cell: (item) => (
                <span className="text-[color:var(--Heading,#103D5C)] [font-family:Manrope] text-sm font-normal leading-[160%] underline decoration-solid [text-decoration-skip-ink:auto] decoration-auto underline-offset-auto [text-underline-position:from-font]">
                    {item.category}
                </span>
            ),
        },
        {
            key: "user",
            header: "User Name",
            className: "min-w-[160px]",
            cell: (item) => (
                <div className="flex items-center gap-2.5">
                    <img
                        src={item.user.avatar}
                        alt={item.user.name}
                        className="h-8 w-8 rounded-full border border-amber-400 object-cover"
                    />
                    <span className="text-[color:var(--Heading,#103D5C)] [font-family:Manrope] text-xs font-medium leading-[160%]">
                        {item.user.name}
                    </span>
                </div>
            ),
        },
        {
            key: "role",
            header: "Role",
            className: "min-w-[90px]",
            cell: (item) => (
                <span className="text-xs font-normal text-slate-500">
                    {item.role}
                </span>
            ),
        },
        {
            key: "reason",
            header: "Reason",
            className: "min-w-[160px]",
            cell: (item) => (
                <span className="text-xs font-normal text-slate-500 truncate max-w-[150px] block">
                    {item.reason}
                </span>
            ),
        },
        {
            key: "status",
            header: "Status",
            className: "min-w-[130px]",
            cell: (item) => renderStatusBadge(item.status),
        },
        {
            key: "priority",
            header: "Priority",
            className: "min-w-[110px]",
            cell: (item) => renderPriorityBadge(item.priority),
        },
        {
            key: "assignedAdmin",
            header: "Assigned Admin",
            className: "min-w-[170px]",
            cell: (item) => (
                <div className="relative inline-block w-full max-w-[150px]">
                    <select
                        value={assignedAdmins[item.id]}
                        onChange={(e) => handleAdminChange(item.id, e.target.value)}
                        className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-1.5 pr-8 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0a3558] cursor-pointer"
                    >
                        {adminOptions.map((admin) => (
                            <option key={admin} value={admin}>
                                {admin}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                </div>
            ),
        },
        {
            key: "action",
            header: "Action",
            className: "min-w-[90px] pr-6 text-right",
            cell: (item) => (
                <Link
                    href={`/dashboard/tickets/${item.id}`}
                    className="inline-block rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                    Open
                </Link>
            ),
        },
    ];

    return (
        <div className="">
            {/* Table Toolbar / Controls */}
            <TableToolbar
                searchQuery={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
                onSortClick={() => setSort(sort === "newest" ? "oldest" : "newest")}
            />
            <DataTable
                    columns={columns}
                    data={sampleTickets}
                    pagination={false}
                />

            {/* Custom Pagination Footer */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-2">
                {/* Show Items Selector */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#0a3558]">Show items</span>
                    <div className="relative">
                        <select className="appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-7 text-xs font-medium text-[#0a3558] focus:outline-none focus:ring-1 focus:ring-[#0a3558] cursor-pointer">
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-amber-500 pointer-events-none" />
                    </div>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-1.5">
                    <button
                        disabled
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-amber-500 opacity-50 cursor-not-allowed"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-[#0a3558]">
                        1
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50">
                        2
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50">
                        3
                    </button>
                    <span className="flex h-8 w-8 items-center justify-center text-xs text-slate-400">
                        ...
                    </span>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50">
                        4
                    </button>

                    <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-amber-500 hover:bg-slate-50">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SupportTicketsTable;