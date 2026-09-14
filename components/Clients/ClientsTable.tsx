"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ArrowUpDown, SlidersHorizontal, Download } from "lucide-react";
import { Column, DataTable } from "../shared/DataTable";
import TableToolbar from "../shared/TableToolbar";

export type ClientStatus = "Active" | "Inactive" | "Suspended";

export interface ClientRecord {
    id: string;
    clientId: string;
    client: {
        name: string;
        avatar: string;
    };
    contact: {
        phone: string;
        email: string;
    };
    jobRequested: number;
    totalSpent: string;
    joined: string;
    status: ClientStatus;
}

const sampleClients: ClientRecord[] = [
    {
        id: "1",
        clientId: "#C124",
        client: {
            name: "Sarah William",
            avatar:
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
        },
        contact: {
            phone: "999-(1234)-555",
            email: "sarahwilliam@gmail.com",
        },
        jobRequested: 10,
        totalSpent: "$2,450",
        joined: "12 Jul, 2026",
        status: "Active",
    },
    {
        id: "2",
        clientId: "#C124",
        client: {
            name: "Sarah William",
            avatar:
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
        },
        contact: {
            phone: "999-(1234)-555",
            email: "sarahwilliam@gmail.com",
        },
        jobRequested: 10,
        totalSpent: "$2,450",
        joined: "12 Jul, 2026",
        status: "Active",
    },
    {
        id: "3",
        clientId: "#C124",
        client: {
            name: "Sarah William",
            avatar:
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
        },
        contact: {
            phone: "999-(1234)-555",
            email: "sarahwilliam@gmail.com",
        },
        jobRequested: 10,
        totalSpent: "$2,450",
        joined: "12 Jul, 2026",
        status: "Inactive",
    },
    {
        id: "4",
        clientId: "#C124",
        client: {
            name: "Sarah William",
            avatar:
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
        },
        contact: {
            phone: "999-(1234)-555",
            email: "sarahwilliam@gmail.com",
        },
        jobRequested: 10,
        totalSpent: "$2,450",
        joined: "12 Jul, 2026",
        status: "Active",
    },
    {
        id: "5",
        clientId: "#C124",
        client: {
            name: "Sarah William",
            avatar:
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
        },
        contact: {
            phone: "999-(1234)-555",
            email: "sarahwilliam@gmail.com",
        },
        jobRequested: 10,
        totalSpent: "$2,450",
        joined: "12 Jul, 2026",
        status: "Suspended",
    },
];

export function ClientsTable() {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(sampleClients.map((item) => item.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const renderStatusBadge = (status: ClientStatus) => {
        const config = {
            Active: {
                bg: "bg-sky-50",
                border: "border-sky-200",
                text: "text-sky-600",
                dot: "bg-sky-500",
            },
            Inactive: {
                bg: "bg-rose-50",
                border: "border-rose-200",
                text: "text-rose-500",
                dot: "bg-rose-500",
            },
            Suspended: {
                bg: "bg-amber-50",
                border: "border-amber-200",
                text: "text-amber-600",
                dot: "bg-amber-500",
            },
        }[status];

        return (
            <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-semibold ${config.bg} ${config.border} ${config.text}`}
            >
                <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
                {status}
            </div>
        );
    };

    const columns: Column<ClientRecord>[] = [
        {
            key: "checkbox",
            header: (
                <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                        selectedIds.length === sampleClients.length &&
                        sampleClients.length > 0
                    }
                    className="h-4 w-4 rounded border-slate-300 text-[#0a3558] focus:ring-0 cursor-pointer"
                />
            ),
            className: "w-12 pl-6 pr-2",
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
            key: "clientId",
            header: "Client ID",
            className: "min-w-[100px]",
            cell: (item) => (
                <span className="text-sm font-normal text-[#103D5C] font-['Manrope'] leading-6">
                    {item.clientId}
                </span>
            ),
        },
        {
            key: "client",
            header: "Client Name",
            className: "min-w-[180px]",
            cell: (item) => (
                <div className="flex items-center gap-2.5">
                    <img
                        src={item.client.avatar}
                        alt={item.client.name}
                        className="h-8 w-8 rounded-full border border-amber-400 object-cover shrink-0"
                    />
                    <span className="text-xs font-medium text-[#103D5C] font-['Manrope'] leading-4">
                        {item.client.name}
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
                    <span className="text-xs font-medium text-[#667085] font-['Manrope'] leading-5">
                        {item.contact.phone}
                    </span>
                    <span className="text-[10px] font-medium text-[#667085] font-['Manrope'] leading-[10px]">
                        {item.contact.email}
                    </span>
                </div>
            ),
        },
        {
            key: "jobRequested",
            header: "Job Requested",
            className: "min-w-[130px]",
            cell: (item) => (
                <span className="text-xs font-medium text-[#667085] font-['Manrope'] leading-4">
                    {item.jobRequested}
                </span>
            ),
        },
        {
            key: "totalSpent",
            header: "Total Spent",
            className: "min-w-[120px]",
            cell: (item) => (
                <span className="text-xs font-medium text-[#667085] font-['Manrope'] leading-4">
                    {item.totalSpent}
                </span>
            ),
        },
        {
            key: "joined",
            header: "Joined",
            className: "min-w-[130px]",
            cell: (item) => (
                <span className="text-xs font-medium text-[#667085] font-['Manrope'] leading-4 whitespace-nowrap">
                    {item.joined}
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
            className: "min-w-[120px] pr-6 text-right",
            cell: (item) => (
                <Link
                    href={`/dashboard/clients/${item.id}`}
                    className="inline-flex h-8 items-center justify-center rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 font-['Manrope'] leading-3 transition-colors hover:bg-slate-50"
                >
                    View Details
                </Link>
            ),
        },
    ];

    return (
        <div >
            {/* Table Top Controls */}
            <TableToolbar
                searchQuery={searchTerm}
                onSearchChange={handleSearchChange}
            />

            {/* Main Data Table */}
            <div className="">
                <DataTable
                    columns={columns}
                    data={sampleClients}
                    pagination={false}
                />
            </div>
        </div>
    );
}

export default ClientsTable;