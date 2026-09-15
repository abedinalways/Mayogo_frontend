"use client";

import React, { useState } from "react";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

// ==========================================
// Types
// ==========================================

export interface Column<T> {
    key: string;
    header: React.ReactNode;
    className?: string;
    cell: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
    title?: string;
    onViewAll?: () => void;
    columns: Column<T>[];
    data: T[];
    pageSize?: number;
    pageSizeOptions?: number[];
    onPageSizeChange?: (size: number) => void;
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    pagination?: boolean;
}

// ==========================================
// Generic Reusable DataTable Component
// ==========================================

export function DataTable<T>({

    columns,
    data,
    pageSize = 25,
    pageSizeOptions = [10, 25, 50, 100],
    onPageSizeChange,
    currentPage = 1,
    totalPages = 4,
    onPageChange,
    pagination = true,
}: DataTableProps<T>) {

    const [selectedPageSize, setSelectedPageSize] = useState(pageSize);
    const [activePage, setActivePage] = useState(currentPage);

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = Number(e.target.value);
        setSelectedPageSize(val);
        onPageSizeChange?.(val);
    };

    const handlePageClick = (page: number) => {
        setActivePage(page);
        onPageChange?.(page);
    };

    return (
        <div className="w-full overflow-hidden  border border-[#E8E8E8] bg-white shadow-[0_2px_4px_-1px_rgba(13,13,18,0.06)] rounded-b-xl">


            {/* Table Container */}
            <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    {/* Table Head */}
                    <thead>
                        <tr className="h-12  border-b border-[#e4ebf1] [background:var(--Card-bg,rgba(16,61,92,0.06))]">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-4 py-3 text-sm font-semibold leading-6 text-[#5A5A5A] ${col.className || ""}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-[#e4ebf1]">
                        {data.map((row, index) => (
                            <tr
                                key={index}
                                className="h-16 transition-colors hover:bg-slate-50/60"
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className={`px-4 py-3 ${col.className || ""}`}>
                                        {col.cell(row)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {
                pagination && (
                    <>
                        {/* Table Pagination Footer */}
                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e4ebf1] bg-white p-4 rounded-b-xl">
                            {/* Page Size Selector */}
                            <div className="flex items-center gap-3">
                                <span className="text-base font-medium text-[#123e5e]">Show items</span>
                                <div className="relative flex items-center">
                                    <select
                                        value={selectedPageSize}
                                        onChange={handlePageSizeChange}
                                        className="h-9 appearance-none rounded-lg border border-[#e4ebf1] bg-white pl-3 pr-8 text-sm font-medium text-[#123e5e] outline-none focus:border-slate-300"
                                    >
                                        {pageSizeOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-2.5 h-4 w-4 text-slate-400" />
                                </div>
                            </div>

                            {/* Pagination Controls */}
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    disabled={activePage === 1}
                                    onClick={() => handlePageClick(activePage - 1)}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e4ebf1] text-slate-600 disabled:opacity-40 hover:bg-slate-50"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>

                                <div className="flex items-center rounded-lg bg-[#f8fbfd]">
                                    {[1, 2, 3, "...", totalPages].map((page, idx) => {
                                        if (typeof page === "number") {
                                            const isActive = activePage === page;
                                            return (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => handlePageClick(page)}
                                                    className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${isActive
                                                        ? "border border-[#e4ebf1] bg-white font-semibold text-[#123e5e] shadow-sm"
                                                        : "text-[#6c8294] hover:text-[#123e5e]"
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        }
                                        return (
                                            <span
                                                key={idx}
                                                className="flex h-9 w-9 items-center justify-center text-sm font-medium text-[#6c8294]"
                                            >
                                                {page}
                                            </span>
                                        );
                                    })}
                                </div>

                                <button
                                    type="button"
                                    disabled={activePage === totalPages}
                                    onClick={() => handlePageClick(activePage + 1)}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e4ebf1] text-slate-600 disabled:opacity-40 hover:bg-slate-50"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    );
}
