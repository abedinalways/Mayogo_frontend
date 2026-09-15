"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Star, Table } from "lucide-react";
import { Column, DataTable } from "../../shared/DataTable";
import TableToolbar from "../../shared/TableToolbar";
import { transactionsFilterSchema } from "../../shared/filter-presets";

/* ==========================================
   1. TRANSACTION HISTORY TABLE
========================================== */

export type PaymentStatusType = "Completed" | "Pending" | "Refunded";

export interface TransactionRecord {
    id: string;
    transactionId: string;
    jobId: string;
    amount: string;
    paymentStatus: PaymentStatusType;
    date: string;
}

const sampleTransactions: TransactionRecord[] = [
    {
        id: "1",
        transactionId: "#TX-012639",
        jobId: "#J124",
        amount: "$80",
        paymentStatus: "Completed",
        date: "12 Jul, 2026",
    },
    {
        id: "2",
        transactionId: "#TX-012639",
        jobId: "#J124",
        amount: "$80",
        paymentStatus: "Completed",
        date: "12 Jul, 2026",
    },
    {
        id: "3",
        transactionId: "#TX-012639",
        jobId: "#J124",
        amount: "$80",
        paymentStatus: "Pending",
        date: "12 Jul, 2026",
    },
    {
        id: "4",
        transactionId: "#TX-012639",
        jobId: "#J124",
        amount: "$80",
        paymentStatus: "Completed",
        date: "12 Jul, 2026",
    },
    {
        id: "5",
        transactionId: "#TX-012639",
        jobId: "#J124",
        amount: "$80",
        paymentStatus: "Refunded",
        date: "12 Jul, 2026",
    },
];

export function TransactionHistoryTable() {
    const [searchTerm, setSearchTerm] = useState("");
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const renderStatusBadge = (status: PaymentStatusType) => {
        const config = {
            Completed: {
                bg: "bg-emerald-50",
                outline: "outline-emerald-200",
                text: "text-green-700",
                dot: "bg-emerald-500",
            },
            Pending: {
                bg: "bg-amber-50",
                outline: "outline-amber-200",
                text: "text-amber-700",
                dot: "bg-amber-500",
            },
            Refunded: {
                bg: "bg-rose-50",
                outline: "outline-rose-200",
                text: "text-rose-700",
                dot: "bg-rose-500",
            },
        }[status];

        return (
            <div
                className={`h-5 px-2 py-0.5 rounded-sm outline outline-1 outline-offset-[-1px] inline-flex justify-center items-center gap-1 ${config.bg} ${config.outline}`}
            >
                <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
                <span className={`text-center text-xs font-medium font-['Manrope'] leading-4 ${config.text}`}>
                    {status}
                </span>
            </div>
        );
    };

    const columns: Column<TransactionRecord>[] = [
        {
            key: "transactionId",
            header: "Transaction ID",
            className: "w-32 pl-4",
            cell: (item) => (
                <span className="text-sm font-normal text-[#103D5C] font-['Manrope'] leading-6">
                    {item.transactionId}
                </span>
            ),
        },
        {
            key: "jobId",
            header: "Job ID",
            className: "min-w-[120px]",
            cell: (item) => (
                <span className="text-sm font-normal text-[#103D5C] font-['Manrope'] underline leading-6 cursor-pointer">
                    {item.jobId}
                </span>
            ),
        },
        {
            key: "amount",
            header: "Amount",
            className: "min-w-[100px]",
            cell: (item) => (
                <span className="text-xs font-medium text-slate-700 font-['Manrope'] leading-4">
                    {item.amount}
                </span>
            ),
        },
        {
            key: "paymentStatus",
            header: "Payment Status",
            className: "min-w-[140px]",
            cell: (item) => renderStatusBadge(item.paymentStatus),
        },
        {
            key: "date",
            header: "Date",
            className: "min-w-[130px]",
            cell: (item) => (
                <span className="text-xs font-medium text-slate-700 font-['Manrope'] leading-4 whitespace-nowrap">
                    {item.date}
                </span>
            ),
        },
        {
            key: "action",
            header: "Action",
            className: "w-20 pr-4 text-center",
            cell: (item) => (
                <Link
                    href={`/dashboard/transactions/${item.id}`}
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
                title="Transaction History"
                searchQuery={searchTerm}
                onSearchChange={handleSearchChange}
                filterSchema={transactionsFilterSchema}
            />

            {/* Main Data Table */}

            <DataTable columns={columns} data={sampleTransactions} pagination={false} />

        </div>
    );
}


