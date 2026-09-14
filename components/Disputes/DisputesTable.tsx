"use client";

import React, { useState } from "react";
import { Search, ArrowUpDown, SlidersHorizontal, Download, ChevronDown, Link as LinkIcon } from "lucide-react";
import { Column, DataTable } from "../shared/DataTable";
import { StatusBadge, type StatusType } from "../shared/StatusBadge";
import TableToolbar from "../shared/TableToolbar";
import Link from "next/link";

export type RiskLevel = "Low" | "Medium" | "High" | "Urgent";
export type DisputeStatus =
    | "Open"
    | "Under Review"
    | "Awaiting Client"
    | "Awaiting Expert"
    | "Resolved"
    | "Rejected";

export interface DisputeRecord {
    id: string;
    ticketId: string;
    jobId: string;
    service: {
        name: string;
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
    disputeReason: string;
    riskLevel: RiskLevel;
    dateOpened: string;
    status: DisputeStatus;
    assignedAdmin: string;
}

const sampleDisputes: DisputeRecord[] = [
    {
        id: "1",
        ticketId: "#DSP-10482",
        jobId: "#JB002",
        service: {
            name: "Air Conditioner (AC) Repair",
            category: "Repair & Diagnostic",
            image:
                "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=100&auto=format&fit=crop&q=80",
        },
        client: {
            name: "Sarah William",
            avatar:
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
        },
        expert: {
            name: "Daniel Green",
            avatar:
                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
        },
        disputeReason: "Expert Behavior",
        riskLevel: "Medium",
        dateOpened: "Dec 27, 2026",
        status: "Open",
        assignedAdmin: "Sarah Parker",
    },
    {
        id: "2",
        ticketId: "#DSP-10482",
        jobId: "#JB002",
        service: {
            name: "Air Conditioner (AC) Repair",
            category: "Repair & Diagnostic",
            image:
                "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=100&auto=format&fit=crop&q=80",
        },
        client: {
            name: "Sarah William",
            avatar:
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
        },
        expert: {
            name: "Daniel Green",
            avatar:
                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
        },
        disputeReason: "Expert Behavior",
        riskLevel: "Low",
        dateOpened: "Dec 27, 2026",
        status: "Under Review",
        assignedAdmin: "Bessie Cooper",
    },
    {
        id: "3",
        ticketId: "#DSP-10482",
        jobId: "#JB002",
        service: {
            name: "Air Conditioner (AC) Repair",
            category: "Repair & Diagnostic",
            image:
                "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=100&auto=format&fit=crop&q=80",
        },
        client: {
            name: "Sarah William",
            avatar:
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
        },
        expert: {
            name: "Daniel Green",
            avatar:
                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
        },
        disputeReason: "Expert Behavior",
        riskLevel: "High",
        dateOpened: "Dec 27, 2026",
        status: "Awaiting Client",
        assignedAdmin: "Sarah Parker",
    },
    {
        id: "4",
        ticketId: "#DSP-10482",
        jobId: "#JB002",
        service: {
            name: "Air Conditioner (AC) Repair",
            category: "Repair & Diagnostic",
            image:
                "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=100&auto=format&fit=crop&q=80",
        },
        client: {
            name: "Sarah William",
            avatar:
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
        },
        expert: {
            name: "Daniel Green",
            avatar:
                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
        },
        disputeReason: "Expert Behavior",
        riskLevel: "Urgent",
        dateOpened: "Dec 27, 2026",
        status: "Awaiting Expert",
        assignedAdmin: "Bessie Cooper",
    },
    {
        id: "5",
        ticketId: "#DSP-10482",
        jobId: "#JB002",
        service: {
            name: "Air Conditioner (AC) Repair",
            category: "Repair & Diagnostic",
            image:
                "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=100&auto=format&fit=crop&q=80",
        },
        client: {
            name: "Sarah William",
            avatar:
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
        },
        expert: {
            name: "Daniel Green",
            avatar:
                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
        },
        disputeReason: "Expert Behavior",
        riskLevel: "Medium",
        dateOpened: "Dec 27, 2026",
        status: "Resolved",
        assignedAdmin: "Sarah Parker",
    },
    {
        id: "6",
        ticketId: "#DSP-10482",
        jobId: "#JB002",
        service: {
            name: "Air Conditioner (AC) Repair",
            category: "Repair & Diagnostic",
            image:
                "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=100&auto=format&fit=crop&q=80",
        },
        client: {
            name: "Sarah William",
            avatar:
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
        },
        expert: {
            name: "Daniel Green",
            avatar:
                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
        },
        disputeReason: "Expert Behavior",
        riskLevel: "Low",
        dateOpened: "Dec 27, 2026",
        status: "Rejected",
        assignedAdmin: "Bessie Cooper",
    },
    {
        id: "7",
        ticketId: "#DSP-10482",
        jobId: "#JB002",
        service: {
            name: "Air Conditioner (AC) Repair",
            category: "Repair & Diagnostic",
            image:
                "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=100&auto=format&fit=crop&q=80",
        },
        client: {
            name: "Sarah William",
            avatar:
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
        },
        expert: {
            name: "Daniel Green",
            avatar:
                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
        },
        disputeReason: "Expert Behavior",
        riskLevel: "High",
        dateOpened: "Dec 27, 2026",
        status: "Open",
        assignedAdmin: "Sarah Parker",
    },
];

function RiskBadge({ level }: { level: RiskLevel }) {
    const styles: Record<RiskLevel, string> = {
        Low: "bg-emerald-50 text-emerald-600 border-emerald-200",
        Medium: "bg-amber-50 text-amber-600 border-amber-200",
        High: "bg-rose-50 text-rose-500 border-rose-200",
        Urgent: "bg-rose-100 text-rose-600 border-rose-300 ",
    };

    return (
        <span
            className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded text-xs border font-medium ${styles[level]}`}
        >
            {level}
        </span>
    );
}

function DisputeStatusBadge({ status }: { status: DisputeStatus }) {
    const config: Record<
        DisputeStatus,
        { dot: string; text: string; bg: string; border: string }
    > = {
        Open: {
            dot: "bg-blue-500",
            text: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-200",
        },
        "Under Review": {
            dot: "bg-amber-500",
            text: "text-amber-600",
            bg: "bg-amber-50",
            border: "border-amber-200",
        },
        "Awaiting Client": {
            dot: "bg-slate-500",
            text: "text-slate-600",
            bg: "bg-slate-50",
            border: "border-slate-200",
        },
        "Awaiting Expert": {
            dot: "bg-slate-500",
            text: "text-slate-600",
            bg: "bg-slate-50",
            border: "border-slate-200",
        },
        Resolved: {
            dot: "bg-emerald-500",
            text: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-200",
        },
        Rejected: {
            dot: "bg-rose-500",
            text: "text-rose-600",
            bg: "bg-rose-50",
            border: "border-rose-200",
        },
    };

    const current = config[status];

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border text-nowrap ${current.bg} ${current.border} ${current.text}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
            {status}
        </span>
    );
}

export function DisputesTable() {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [adminAssignments, setAdminAssignments] = useState<
        Record<string, string>
    >({});

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(sampleDisputes.map((item) => item.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleAdminChange = (id: string, admin: string) => {
        setAdminAssignments((prev) => ({ ...prev, [id]: admin }));
    };

    const columns: Column<DisputeRecord>[] = [
        {
            key: "checkbox",
            header: (
                <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                        selectedIds.length === sampleDisputes.length &&
                        sampleDisputes.length > 0
                    }
                    className="h-4 w-4 rounded border-slate-300 text-[#0a3558] focus:ring-0 cursor-pointer "
                />
            ),
            className: "w-12 px-4",
            cell: (item) => (
                <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => handleSelectRow(item.id)}
                    className="h-4 w-4 rounded border-slate-300 text-[#0a3558] focus:ring-0 cursor-pointer"
                />
            ),
        },
        {
            key: "ticketId",
            header: "Ticket ID",
            className: "w-28 min-w-[100px]",
            cell: (item) => (
                <span className="text-[#103D5C]  text-sm font-normal leading-[160%] text-nowrap">
                    {item.ticketId}
                </span>
            ),
        },
        {
            key: "jobId",
            header: "Job ID",
            className: "w-28 min-w-[100px]",
            cell: (item) => (
                <span className="text-[#103D5C]  text-sm font-normal leading-[160%] underline decoration-solid [text-decoration-skip-ink:auto] decoration-auto underline-offset-auto [text-underline-position:from-font]">
                    {item.jobId}
                </span>
            ),
        },
        {
            key: "service",
            header: "Service Name",
            className: "min-w-[240px]",
            cell: (item) => (
                <div className="flex items-center gap-2.5">
                    <img
                        src={item.service.image}
                        alt={item.service.name}
                        className="h-8 w-8 rounded-md border border-slate-100 object-cover"
                    />
                    <div className="flex flex-col">
                        <span className="text-[#103D5C]  text-xs font-medium leading-[160%]">
                            {item.service.name}
                        </span>
                        <span className="text-[#5A5A5A]  text-[10px] font-medium leading-[100%]">
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
                    <img
                        src={item.client.avatar}
                        alt={item.client.name}
                        className="h-7 w-7 rounded-full border border-slate-200 object-cover"
                    />
                    <span className="text-[#5A5A5A]  text-xs font-medium leading-[124%]">
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
                    <img
                        src={item.expert.avatar}
                        alt={item.expert.name}
                        className="h-7 w-7 rounded-full border border-slate-200 object-cover"
                    />
                    <span className="text-[#5A5A5A]  text-xs font-medium leading-[124%]">
                        {item.expert.name}
                    </span>
                </div>
            ),
        },
        {
            key: "disputeReason",
            header: "Dispute Reason",
            className: "min-w-[140px]",
            cell: (item) => (
                <span className="text-[#5A5A5A]  text-xs font-normal leading-[160%]">
                    {item.disputeReason}
                </span>
            ),
        },
        {
            key: "riskLevel",
            header: "Risk Level",
            className: "w-28 min-w-[100px]",
            cell: (item) => <RiskBadge level={item.riskLevel} />,
        },
        {
            key: "dateOpened",
            header: "Date Opened",
            className: "min-w-[120px]",
            cell: (item) => (
                <span className="text-[#5A5A5A]  text-xs font-medium leading-[124%] whitespace-nowrap">
                    {item.dateOpened}
                </span>
            ),
        },
        {
            key: "status",
            header: "Status",
            className: "min-w-[140px]",
            cell: (item) => <DisputeStatusBadge status={item.status} />,
        },
        {
            key: "assignedAdmin",
            header: "Assigned Admin",
            className: "min-w-[150px]",
            cell: (item) => (
                <div className="relative">
                    <select
                        value={adminAssignments[item.id] || item.assignedAdmin}
                        onChange={(e) => handleAdminChange(item.id, e.target.value)}
                        className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs font-medium text-slate-700 outline-none focus:border-slate-400"
                    >
                        <option value="Sarah Parker">Sarah Parker</option>
                        <option value="Bessie Cooper">Bessie Cooper</option>
                        <option value="John Doe">John Doe</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                </div>
            ),
        },
        {
            key: "action",
            header: "Action",
            className: "w-28 min-w-[110px] text-center",
            cell: (item) => (
                <Link
                    href={`/dashboard/disputes/${item.id}`}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 text-nowrap block"
                >
                    View Details
                </Link>
            ),
        },
    ];

    return (
        <div className="w-full font-['Manrope']">
            {/* Top Controls Toolbar */}
            <TableToolbar />

            {/* Main Data Table */}
            <div className="border-x border-b border-[#E8E8E8] rounded-b-xl overflow-hidden bg-white">
                <DataTable
                    columns={columns}
                    data={sampleDisputes}
                    pagination={true}
                />
            </div>
        </div>
    );
}

export default DisputesTable;